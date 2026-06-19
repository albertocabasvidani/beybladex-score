import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { asyncStorage } from '../../../store/async-storage';
import type { SavedCombo } from './comboStore';

export interface SavedDeck {
  id: string;
  name: string;
  combos: SavedCombo[];
  createdAt: number;
}

/** Esito della validazione WBO: quale pezzo è duplicato e con che nome (null = OK). */
export interface DuplicatePartError {
  kind: 'blade' | 'ratchet' | 'bit';
  name: string;
}

/**
 * Regola WBO: in un deck 3-on-3 nessuna parte (blade/ratchet/bit) può ripetersi tra le combo.
 * Ritorna il primo conflitto trovato (o null). Il messaggio localizzato lo costruisce la screen.
 */
export function validateNoDuplicateParts(combos: SavedCombo[]): DuplicatePartError | null {
  const slots: { kind: DuplicatePartError['kind']; pick: (c: SavedCombo) => SavedCombo['blade'] }[] = [
    { kind: 'blade', pick: (c) => c.blade },
    { kind: 'ratchet', pick: (c) => c.ratchet },
    { kind: 'bit', pick: (c) => c.bit },
  ];
  for (const { kind, pick } of slots) {
    const ids = combos.map((c) => pick(c).id);
    const dup = ids.find((id, i) => ids.indexOf(id) !== i);
    if (dup) {
      const name = combos.map(pick).find((p) => p.id === dup)?.name ?? dup;
      return { kind, name };
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
      partialize: (s) => ({ decks: s.decks }),
    }
  )
);
