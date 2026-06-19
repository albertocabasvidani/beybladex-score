import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PartStats, AnyPart } from '@beybladex/shared';
import { asyncStorage } from '../../../store/async-storage';

/** Parte selezionata in uno slot. `stats` opzionale: molte parti non le hanno (vedi degradazione). */
export interface SelectedPart {
  id: string;
  name: string;
  stats?: PartStats;
}

export const emptyStats: PartStats = { atk: 0, def: 0, sta: 0 };

/** Converte una parte del registry in SelectedPart (id/name/stats). */
export function toSelectedPart(part: AnyPart): SelectedPart {
  return { id: part.id, name: part.name, stats: (part as { stats?: PartStats }).stats };
}

const RECENTS_MAX = 6;
function pushRecent(list: SelectedPart[], part: SelectedPart): SelectedPart[] {
  return [part, ...list.filter((p) => p.id !== part.id)].slice(0, RECENTS_MAX);
}

interface BuilderState {
  selectedBlade: SelectedPart | null;
  selectedRatchet: SelectedPart | null;
  selectedBit: SelectedPart | null;
  recentBlades: SelectedPart[];
  recentRatchets: SelectedPart[];
  recentBits: SelectedPart[];
  setBlade: (blade: SelectedPart | null) => void;
  setRatchet: (ratchet: SelectedPart | null) => void;
  setBit: (bit: SelectedPart | null) => void;
  /** Carica una combo esistente nei tre slot (per la modifica). */
  loadCombo: (blade: SelectedPart, ratchet: SelectedPart, bit: SelectedPart) => void;
  /** Somma delle stat dei pezzi selezionati (parti senza stat contano 0). */
  getComboStats: () => PartStats;
  /** True se almeno un pezzo selezionato ha le stat (per decidere se mostrare il radar). */
  hasAnyStats: () => boolean;
  clearAll: () => void;
}

interface PersistedBuilder {
  selectedBlade: SelectedPart | null;
  selectedRatchet: SelectedPart | null;
  selectedBit: SelectedPart | null;
  recentBlades: SelectedPart[];
  recentRatchets: SelectedPart[];
  recentBits: SelectedPart[];
}

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set, get) => ({
      selectedBlade: null,
      selectedRatchet: null,
      selectedBit: null,
      recentBlades: [],
      recentRatchets: [],
      recentBits: [],
      setBlade: (blade) =>
        set((s) => ({
          selectedBlade: blade,
          recentBlades: blade ? pushRecent(s.recentBlades, blade) : s.recentBlades,
        })),
      setRatchet: (ratchet) =>
        set((s) => ({
          selectedRatchet: ratchet,
          recentRatchets: ratchet ? pushRecent(s.recentRatchets, ratchet) : s.recentRatchets,
        })),
      setBit: (bit) =>
        set((s) => ({
          selectedBit: bit,
          recentBits: bit ? pushRecent(s.recentBits, bit) : s.recentBits,
        })),
      loadCombo: (blade, ratchet, bit) =>
        set({ selectedBlade: blade, selectedRatchet: ratchet, selectedBit: bit }),
      getComboStats: () => {
        // Somma grezza dei pezzi, senza pesi (valori come sul sito; pezzi senza stat = 0).
        const { selectedBlade, selectedRatchet, selectedBit } = get();
        const parts = [selectedBlade, selectedRatchet, selectedBit];
        return {
          atk: parts.reduce((sum, p) => sum + (p?.stats?.atk ?? 0), 0),
          def: parts.reduce((sum, p) => sum + (p?.stats?.def ?? 0), 0),
          sta: parts.reduce((sum, p) => sum + (p?.stats?.sta ?? 0), 0),
        };
      },
      hasAnyStats: () => {
        const { selectedBlade, selectedRatchet, selectedBit } = get();
        return [selectedBlade, selectedRatchet, selectedBit].some((p) => !!p?.stats);
      },
      clearAll: () => set({ selectedBlade: null, selectedRatchet: null, selectedBit: null }),
    }),
    {
      name: 'beybladex-builder-current',
      storage: createJSONStorage(() => asyncStorage),
      partialize: (s): PersistedBuilder => ({
        selectedBlade: s.selectedBlade,
        selectedRatchet: s.selectedRatchet,
        selectedBit: s.selectedBit,
        recentBlades: s.recentBlades,
        recentRatchets: s.recentRatchets,
        recentBits: s.recentBits,
      }),
    }
  )
);
