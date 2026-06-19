import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PartStats } from '@beybladex/shared';
import { asyncStorage } from '../../../store/async-storage';
import type { SelectedPart } from './builderStore';

export interface SavedCombo {
  id: string;
  name: string;
  blade: SelectedPart;
  ratchet: SelectedPart;
  bit: SelectedPart;
  stats: PartStats;
  createdAt: number;
}

/** Stat della combo = somma grezza di blade + ratchet + bit, senza pesi (pezzi senza stat = 0). */
export function calcComboStats(blade: SelectedPart, ratchet: SelectedPart, bit: SelectedPart): PartStats {
  const parts = [blade, ratchet, bit];
  return {
    atk: parts.reduce((s, p) => s + (p.stats?.atk ?? 0), 0),
    def: parts.reduce((s, p) => s + (p.stats?.def ?? 0), 0),
    sta: parts.reduce((s, p) => s + (p.stats?.sta ?? 0), 0),
  };
}

interface ComboState {
  combos: SavedCombo[];
  saveCombo: (name: string, blade: SelectedPart, ratchet: SelectedPart, bit: SelectedPart) => void;
  updateCombo: (id: string, name: string, blade: SelectedPart, ratchet: SelectedPart, bit: SelectedPart) => void;
  deleteCombo: (id: string) => void;
  getCombo: (id: string) => SavedCombo | undefined;
}

export const useComboStore = create<ComboState>()(
  persist(
    (set, get) => ({
      combos: [],
      saveCombo: (name, blade, ratchet, bit) =>
        set((state) => ({
          combos: [
            ...state.combos,
            {
              id: `combo-${Date.now()}`,
              name,
              blade,
              ratchet,
              bit,
              stats: calcComboStats(blade, ratchet, bit),
              createdAt: Date.now(),
            },
          ],
        })),
      updateCombo: (id, name, blade, ratchet, bit) =>
        set((state) => ({
          combos: state.combos.map((c) =>
            c.id === id ? { ...c, name, blade, ratchet, bit, stats: calcComboStats(blade, ratchet, bit) } : c
          ),
        })),
      deleteCombo: (id) => set((state) => ({ combos: state.combos.filter((c) => c.id !== id) })),
      getCombo: (id) => get().combos.find((c) => c.id === id),
    }),
    {
      name: 'beybladex-builder-combos',
      storage: createJSONStorage(() => asyncStorage),
      partialize: (s) => ({ combos: s.combos }),
    }
  )
);
