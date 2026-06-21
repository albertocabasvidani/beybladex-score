/**
 * Bey assegnata a un giocatore nello scoreboard. È il ponte tra lo "scaffale" (le SavedCombo del
 * combo builder) e la registrazione delle statistiche: ogni partita conclusa con due Bey assegnate
 * diventa un dato di win-rate per combo.
 */
import type { ComboLine, PartCategory } from '@beybladex/shared';
import type { SelectedPart, SelectedParts } from '../builder/stores/slots';
import { SLOT_ORDER, CX_LAMA_CATEGORIES, ratchetIsIncluded } from '../builder/stores/slots';
import { getComboLine } from '../builder/stores/builderStore';
import type { SavedCombo } from '../builder/stores/comboStore';

export interface AssignedBey {
  /** id della SavedCombo da cui proviene (scaffale); null se composta o nome libero al volo. */
  comboId: string | null;
  /** Nome visualizzato: nome combo dallo scaffale, oppure nome libero. */
  name: string;
  line: ComboLine;
  /** Mappa categoria → parte selezionata (id/name/stats). Vuota per le Bey freeform. */
  parts: SelectedParts;
  /** Solo un nome libero, nessuna parte strutturata. */
  freeform?: boolean;
  /** Modificata al volo rispetto alla combo dello scaffale (variante effimera del match). */
  variant?: boolean;
}

/** Chip ordinati (categoria + nome) per il rendering della Bey sotto al nome giocatore. */
export function beyChips(bey: AssignedBey): { category: PartCategory; name: string }[] {
  return SLOT_ORDER.flatMap((cat) => {
    const p = bey.parts[cat];
    return p ? [{ category: cat, name: p.name }] : [];
  });
}

/** Etichetta compatta "pezzo1 · pezzo2 · …" (nome libero: solo il nome). */
export function beyLabel(bey: AssignedBey): string {
  if (bey.freeform || beyChips(bey).length === 0) return bey.name;
  return beyChips(bey)
    .map((c) => c.name)
    .join(' · ');
}

/**
 * Chiave di aggregazione = identità della combo a prescindere da nome/side/salvataggio.
 * Strutturata: id parti ordinati. Freeform: `free:<nome normalizzato>`.
 */
export function beyComboKey(bey: Pick<AssignedBey, 'parts' | 'freeform' | 'name'>): string {
  if (bey.freeform) return `free:${bey.name.trim().toLowerCase()}`;
  const ids = Object.values(bey.parts)
    .map((p) => p?.id)
    .filter((id): id is string => !!id)
    .sort();
  if (ids.length === 0) return `free:${bey.name.trim().toLowerCase()}`;
  return ids.join('|');
}

/** Converte una SavedCombo del builder in una Bey assegnabile (pesca dallo scaffale). */
export function beyFromSavedCombo(combo: SavedCombo): AssignedBey {
  return {
    comboId: combo.id,
    name: combo.name,
    line: combo.line,
    parts: { ...combo.parts },
    variant: false,
  };
}

/**
 * Sostituisce un pezzo della Bey (modifica al volo al tavolo) applicando le regole di esclusività
 * degli slot (blade ↔ lame CX, ratchet incluso) e ricalcolando la linea. Marca la Bey come variante.
 */
export function beyWithPart(bey: AssignedBey, category: PartCategory, part: SelectedPart): AssignedBey {
  const parts: SelectedParts = { ...bey.parts, [category]: part };
  if (category === 'blade') {
    for (const c of CX_LAMA_CATEGORIES) delete parts[c];
  } else if (CX_LAMA_CATEGORIES.includes(category)) {
    delete parts.blade;
  }
  if (ratchetIsIncluded(parts)) delete parts.ratchet;
  return { ...bey, parts, line: getComboLine(parts), variant: true, freeform: false };
}

/** Bey "nome libero": solo un nome, nessuna parte. */
export function beyFreeform(name: string): AssignedBey {
  return { comboId: null, name: name.trim() || 'Bey', line: 'bx', parts: {}, freeform: true };
}
