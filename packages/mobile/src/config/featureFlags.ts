/**
 * Feature flag delle funzioni "avanzate" (combo builder, statistiche, home modalità).
 *
 * Tutte ON in sviluppo (`__DEV__` = true con `expo start`), OFF nelle build di produzione
 * (release APK/AAB) finché la feature non è pronta al rilascio. Con i flag OFF l'app è identica
 * allo scoreboard attuale: nessun tab, nessuna home, nessun cambio di orientamento, nessun
 * selettore Bey, nessuna registrazione statistiche.
 *
 * Per una build beta (track Test aperto su Play Store) usare `full-build-aab.sh --beta`:
 * attiva le feature solo in quell'AAB via EXPO_PUBLIC_FEATURES_ON, senza toccare la Production.
 */

// Attivato a build-time SOLO dalle build beta: `full-build-aab.sh --beta` esporta
// EXPO_PUBLIC_FEATURES_ON=1, che babel-preset-expo inlina qui. Senza il flag --beta la variabile
// è assente → in Production i gate restano legati al solo __DEV__ (feature nascoste).
const FEATURES_ON: boolean = process.env.EXPO_PUBLIC_FEATURES_ON === '1';

/** Combo Builder (tab parti/builder/deck/collezione). */
export const BUILDER_ENABLED: boolean = __DEV__ || FEATURES_ON;

/**
 * Statistiche per combo: selettore Bey nello scoreboard, registrazione dei match e schermate
 * analitiche. Gate separato dal builder, ma di fatto sono nate insieme (la selezione Bey pesca
 * dallo "scaffale" del builder).
 */
export const STATS_ENABLED: boolean = __DEV__ || FEATURES_ON;

/**
 * Home con selettore di modalità (Segnapunti / Gestore combo / Analitiche). Mostrata solo se è
 * attiva almeno una delle feature avanzate; altrimenti l'app entra dritta nello scoreboard.
 */
export const MODE_HOME_ENABLED: boolean = BUILDER_ENABLED || STATS_ENABLED;

/**
 * Banner in-app che invita gli utenti al beta-testing dopo un po' di utilizzo.
 * NON è gated da __DEV__: deve girare nella build di produzione per reclutare tester.
 * Mettere a `false` quando la beta si chiude (feature in produzione per tutti).
 */
export const BETA_INVITE_ENABLED: boolean = true;

/**
 * Aggiornamento parti a runtime: l'app scarica il `parts.json` fresco, lo mette in cache offline e
 * lo applica al riavvio successivo (senza pubblicare una release). Gira SOLO dove le combo sono
 * attive: in una build Production scoreboard-only resta OFF → nessuna chiamata di rete.
 */
export const REMOTE_PARTS_ENABLED: boolean = BUILDER_ENABLED || STATS_ENABLED;

/**
 * URL del `parts.json` canonico — stessa fonte di `scripts/sync-parts.js` (branch master del combo
 * finder, aggiornato ogni mattina dalla pipeline). Override via `EXPO_PUBLIC_PARTS_URL` per testare
 * con un file/gist più fresco senza toccare il codice.
 */
export const REMOTE_PARTS_URL: string =
  process.env.EXPO_PUBLIC_PARTS_URL ||
  'https://raw.githubusercontent.com/albertocabasvidani/beyblade-x-combo-finder/master/data/parts.json';
