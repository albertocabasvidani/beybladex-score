/**
 * Aggiornamento parti a runtime (Strategia A — stale-while-revalidate, apply-al-riavvio).
 *
 * All'avvio: `hydratePartsFromCache()` legge la cache locale (se più fresca del bundle) e la attiva
 * PRIMA che compaiano i tab combo, poi calcola le parti nuove da annunciare. In background:
 * `refreshPartsInBackground()` scarica il `parts.json` fresco, lo valida e lo scrive in cache — che
 * verrà applicata al **prossimo** avvio. Nessuna sostituzione a caldo, nessuna invalidazione dei
 * memo dei componenti. Ogni errore è silenzioso (log warn), mai un crash — come il logger.
 *
 * Il dataset non sta in AsyncStorage (limite ~6MB su Android): usa FileSystem, come persistent-logger.
 */
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getAllParts,
  getPartsVersion,
  setRegistry,
  validatePartsRegistry,
  type PartsRegistry,
} from '@beybladex/shared';
import { logger } from '../utils/logger';
import { REMOTE_PARTS_URL } from '../config/featureFlags';
import { usePartsStore, type NewPart } from '../store/partsStore';

const PARTS_DIR = `${FileSystem.documentDirectory}parts/`;
const CACHE_FILE = `${PARTS_DIR}parts.json`;
const TMP_FILE = `${PARTS_DIR}parts.tmp.json`;

const SEEN_KEY = 'beybladex-parts-seen';
const LAST_FETCH_KEY = 'beybladex-parts-last-fetch';

const FETCH_TIMEOUT_MS = 10_000;
const MIN_REFRESH_INTERVAL_MS = 12 * 60 * 60 * 1000; // 12h: evita traffico inutile ad ogni avvio

// Id del dataset attivo all'ultima idratazione: base per aggiornare i "visti" quando l'utente
// conferma la modale. Popolato da hydratePartsFromCache.
let currentIdsSnapshot: string[] = [];

// --- Persistenza metadati (piccoli) via AsyncStorage, letture awaited (niente race con persist) ---

async function readSeenIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(SEEN_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

async function writeSeenIds(ids: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(SEEN_KEY, JSON.stringify(ids));
  } catch {
    // silent
  }
}

// --- Cache dataset su FileSystem ---

async function ensureDir(): Promise<void> {
  const info = await FileSystem.getInfoAsync(PARTS_DIR);
  if (!info.exists) await FileSystem.makeDirectoryAsync(PARTS_DIR, { intermediates: true });
}

async function readCache(): Promise<PartsRegistry | null> {
  try {
    const info = await FileSystem.getInfoAsync(CACHE_FILE);
    if (!info.exists) return null;
    const raw = await FileSystem.readAsStringAsync(CACHE_FILE);
    const res = validatePartsRegistry(JSON.parse(raw));
    if (!res.ok) {
      logger.warn('parts: cache non valida, la elimino', { errors: res.errors.slice(0, 3) });
      await FileSystem.deleteAsync(CACHE_FILE, { idempotent: true });
      return null;
    }
    return res.data;
  } catch (e) {
    logger.warn('parts: lettura cache fallita', { message: (e as Error).message });
    return null;
  }
}

async function writeCache(data: PartsRegistry): Promise<void> {
  await ensureDir();
  await FileSystem.writeAsStringAsync(TMP_FILE, JSON.stringify(data));
  // moveAsync può fallire se la destinazione esiste: rimuoverla prima rende lo swap atomico.
  await FileSystem.deleteAsync(CACHE_FILE, { idempotent: true });
  await FileSystem.moveAsync({ from: TMP_FILE, to: CACHE_FILE });
}

async function deleteCache(): Promise<void> {
  try {
    await FileSystem.deleteAsync(CACHE_FILE, { idempotent: true });
  } catch {
    // silent
  }
}

// --- API pubblica ---

/**
 * Idrata il registry dalla cache (se più fresca del bundle) e calcola le parti nuove da annunciare.
 * Imposta sempre lo store su `ready` (anche in errore/offline: si resta sul bundle). Chiamata una
 * volta all'avvio, PRIMA di montare i tab combo.
 */
export async function hydratePartsFromCache(): Promise<void> {
  try {
    const bundledVersion = getPartsVersion(); // attivo = bundle a questo punto
    const cached = await readCache();
    if (cached && cached.version > bundledVersion) {
      setRegistry(cached);
      logger.info('parts: attivo dataset da cache', { version: cached.version, bundled: bundledVersion });
    } else if (cached) {
      // Il bundle è ≥ della cache (es. release dello store più fresca): la cache è stantia.
      await deleteCache();
    }

    // Diff sul dataset ATTIVO.
    const parts = getAllParts();
    currentIdsSnapshot = parts.map((p) => p.id);
    const seen = await readSeenIds();

    if (seen.length === 0) {
      // Primo avvio in assoluto: non annunciare l'intero catalogo, memorizza solo la baseline.
      await writeSeenIds(currentIdsSnapshot);
      usePartsStore.getState().setReady([]);
      return;
    }

    const seenSet = new Set(seen);
    const newParts: NewPart[] = parts
      .filter((p) => !seenSet.has(p.id))
      .map((p) => ({ id: p.id, name: p.name }));
    usePartsStore.getState().setReady(newParts);
    if (newParts.length) logger.info('parts: nuove parti da annunciare', { count: newParts.length });
  } catch (e) {
    logger.warn('parts: hydrate fallita', { message: (e as Error).message });
    currentIdsSnapshot = [];
    usePartsStore.getState().setReady([]);
  }
}

/**
 * Scarica il parts.json fresco, lo valida e — se più recente dell'attivo — lo scrive in cache per il
 * PROSSIMO avvio. Fire-and-forget dopo l'idratazione. Guardia min-interval per non scaricare ad ogni
 * avvio. Silenzioso su qualsiasi errore.
 */
export async function refreshPartsInBackground(): Promise<void> {
  try {
    const lastRaw = await AsyncStorage.getItem(LAST_FETCH_KEY);
    const last = lastRaw ? Number(lastRaw) : 0;
    const now = Date.now();
    if (last && now - last < MIN_REFRESH_INTERVAL_MS) return;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    let json: unknown;
    try {
      const res = await fetch(REMOTE_PARTS_URL, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      json = await res.json();
    } finally {
      clearTimeout(timer);
    }

    const res = validatePartsRegistry(json);
    if (!res.ok) {
      logger.warn('parts: remoto non valido, scartato', { errors: res.errors.slice(0, 3) });
      return;
    }

    // Fetch riuscito e valido: aggiorna la guardia anche se la versione è identica.
    await AsyncStorage.setItem(LAST_FETCH_KEY, String(now));

    const activeVersion = getPartsVersion();
    if (res.data.version === activeVersion) return; // nessuna novità

    await writeCache(res.data);
    logger.info('parts: cache aggiornata (si applica al prossimo avvio)', {
      from: activeVersion,
      to: res.data.version,
    });
  } catch (e) {
    logger.warn('parts: refresh fallito', { message: (e as Error).message });
  }
}

/** L'utente ha visto l'avviso: aggiorna la baseline dei "visti" e chiude la modale. */
export async function acknowledgeNewParts(): Promise<void> {
  usePartsStore.getState().clearNewParts();
  if (currentIdsSnapshot.length) await writeSeenIds(currentIdsSnapshot);
}
