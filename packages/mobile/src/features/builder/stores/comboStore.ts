import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PartStats, ComboLine } from '@beybladex/shared';
import { asyncStorage } from '../../../store/async-storage';
import { sumStats, SLOT_ORDER, type SelectedPart, type SelectedParts } from './builderStore';

export interface SavedCombo {
  id: string;
  name: string;
  /** Linea della combo: bx/ux (forma standard) o cx (forma a 5+1 pezzi). */
  line: ComboLine;
  /** Pezzi per categoria. Gli slot effettivi dipendono dalle parti scelte (vedi computeSlots). */
  parts: SelectedParts;
  stats: PartStats;
  createdAt: number;
}

/** Stat della combo = somma grezza dei pezzi, senza pesi (pezzi senza stat = 0). */
export function calcComboStats(parts: SelectedParts): PartStats {
  return sumStats(parts);
}

/** Riassunto "pezzo1 · pezzo2 · …" nell'ordine canonico degli slot, saltando gli slot vuoti. */
export function comboPartsLabel(combo: SavedCombo): string {
  return SLOT_ORDER.map((cat) => combo.parts[cat]?.name)
    .filter(Boolean)
    .join(' · ');
}

/** Forma di una combo come poteva essere persistita prima del refactor multi-linea. */
type LegacyCombo = {
  id: string;
  name: string;
  line?: ComboLine;
  parts?: SelectedParts;
  blade?: SelectedPart;
  ratchet?: SelectedPart;
  bit?: SelectedPart;
  stats: PartStats;
  createdAt: number;
};

/**
 * Converte una combo del vecchio schema {blade, ratchet, bit} nel nuovo {line:'bx', parts:{...}}.
 * Idempotente: se la combo ha già `parts` la restituisce invariata. Condivisa con la migrate dei deck.
 */
export function migrateLegacyCombo(c: LegacyCombo): SavedCombo {
  if (c.parts) return c as SavedCombo;
  return {
    id: c.id,
    name: c.name,
    line: 'bx',
    parts: {
      ...(c.blade ? { blade: c.blade } : {}),
      ...(c.ratchet ? { ratchet: c.ratchet } : {}),
      ...(c.bit ? { bit: c.bit } : {}),
    },
    stats: c.stats,
    createdAt: c.createdAt,
  };
}

interface ComboState {
  combos: SavedCombo[];
  saveCombo: (name: string, line: ComboLine, parts: SelectedParts) => void;
  updateCombo: (id: string, name: string, line: ComboLine, parts: SelectedParts) => void;
  deleteCombo: (id: string) => void;
  getCombo: (id: string) => SavedCombo | undefined;
}

export const useComboStore = create<ComboState>()(
  persist(
    (set, get) => ({
      combos: [],
      saveCombo: (name, line, parts) =>
        set((state) => ({
          combos: [
            ...state.combos,
            {
              id: `combo-${Date.now()}`,
              name,
              line,
              parts,
              stats: calcComboStats(parts),
              createdAt: Date.now(),
            },
          ],
        })),
      updateCombo: (id, name, line, parts) =>
        set((state) => ({
          combos: state.combos.map((c) =>
            c.id === id ? { ...c, name, line, parts, stats: calcComboStats(parts) } : c
          ),
        })),
      deleteCombo: (id) => set((state) => ({ combos: state.combos.filter((c) => c.id !== id) })),
      getCombo: (id) => get().combos.find((c) => c.id === id),
    }),
    {
      name: 'beybladex-builder-combos',
      storage: createJSONStorage(() => asyncStorage),
      version: 1,
      // Migrazione dal vecchio schema {blade, ratchet, bit} → {line:'bx', parts:{...}}.
      migrate: (persisted, version) => {
        if (version < 1 && persisted && typeof persisted === 'object') {
          const s = persisted as { combos?: LegacyCombo[] };
          const combos = (s.combos ?? []).map(migrateLegacyCombo);
          return { combos } as unknown as ComboState;
        }
        return persisted as ComboState;
      },
      partialize: (s) => ({ combos: s.combos }),
    }
  )
);
