import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PartCategory } from '@beybladex/shared';
import { asyncStorage } from '../../../store/async-storage';
import { migrateLegacyCombo, type SavedCombo } from './comboStore';
import type { SelectedPart } from './builderStore';

export interface SavedDeck {
  id: string;
  name: string;
  combos: SavedCombo[];
  createdAt: number;
}

/** Esito della validazione WBO: quale pezzo è duplicato e con che nome (null = OK). */
export interface DuplicatePartError {
  kind: PartCategory;
  name: string;
}

/**
 * Regola WBO: in un deck 3-on-3 nessuna parte può ripetersi tra le combo. Vale per OGNI categoria
 * (blade/ratchet/bit e i pezzi CX) e funziona anche con deck misti BX/UX/CX. Ritorna il primo
 * conflitto trovato (o null). Il messaggio localizzato lo costruisce la screen.
 */
export function validateNoDuplicateParts(combos: SavedCombo[]): DuplicatePartError | null {
  const seen = new Set<string>();
  for (const combo of combos) {
    for (const [category, part] of Object.entries(combo.parts) as [PartCategory, SelectedPart | undefined][]) {
      if (!part) continue;
      if (seen.has(part.id)) return { kind: category, name: part.name };
      seen.add(part.id);
    }
  }
  return null;
}

interface DeckState {
  decks: SavedDeck[];
  /** Salva il deck; ritorna l'errore di duplicato se la regola WBO è violata (null = salvato). */
  saveDeck: (name: string, combos: SavedCombo[]) => DuplicatePartError | null;
  updateDeck: (id: string, name: string, combos: SavedCombo[]) => DuplicatePartError | null;
  deleteDeck: (id: string) => void;
}

export const useDeckStore = create<DeckState>()(
  persist(
    (set) => ({
      decks: [],
      saveDeck: (name, combos) => {
        const error = validateNoDuplicateParts(combos);
        if (error) return error;
        set((state) => ({
          decks: [...state.decks, { id: `deck-${Date.now()}`, name, combos, createdAt: Date.now() }],
        }));
        return null;
      },
      updateDeck: (id, name, combos) => {
        const error = validateNoDuplicateParts(combos);
        if (error) return error;
        set((state) => ({
          decks: state.decks.map((d) => (d.id === id ? { ...d, name, combos } : d)),
        }));
        return null;
      },
      deleteDeck: (id) => set((state) => ({ decks: state.decks.filter((d) => d.id !== id) })),
    }),
    {
      name: 'beybladex-builder-decks',
      storage: createJSONStorage(() => asyncStorage),
      version: 1,
      // Le combo annidate nei deck legacy vanno migrate allo schema {line, parts} come in comboStore.
      migrate: (persisted, version) => {
        if (version < 1 && persisted && typeof persisted === 'object') {
          const s = persisted as { decks?: Array<Omit<SavedDeck, 'combos'> & { combos: unknown[] }> };
          const decks = (s.decks ?? []).map((d) => ({
            ...d,
            combos: (d.combos ?? []).map((c) => migrateLegacyCombo(c as Parameters<typeof migrateLegacyCombo>[0])),
          }));
          return { decks } as unknown as DeckState;
        }
        return persisted as DeckState;
      },
      partialize: (s) => ({ decks: s.decks }),
    }
  )
);
