import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getBladeLine, type PartCategory, type ComboLine } from '@beybladex/shared';
import { asyncStorage } from '../../../store/async-storage';
import {
  CX_LAMA_CATEGORIES,
  ratchetIsIncluded,
  sumStats,
  type SelectedPart,
  type SelectedParts,
} from './slots';

// La logica pura degli slot vive in ./slots (testabile in isolamento) ed è ri-esportata qui per i consumatori.
export * from './slots';

/** Linea combo derivata dalle parti: cx se c'è una lama CX, altrimenti bx/ux dal blade. */
export function getComboLine(parts: SelectedParts): ComboLine {
  if (CX_LAMA_CATEGORIES.some((c) => !!parts[c])) return 'cx';
  if (parts.blade) return getBladeLine(parts.blade.id);
  return 'bx';
}

const RECENTS_MAX = 6;
function pushRecent(list: SelectedPart[], part: SelectedPart): SelectedPart[] {
  return [part, ...list.filter((p) => p.id !== part.id)].slice(0, RECENTS_MAX);
}

interface BuilderState {
  parts: SelectedParts;
  recent: Partial<Record<PartCategory, SelectedPart[]>>;
  setPart: (category: PartCategory, part: SelectedPart) => void;
  clearPart: (category: PartCategory) => void;
  /** Carica una combo esistente negli slot (per la modifica). */
  loadCombo: (parts: SelectedParts) => void;
  getComboStats: () => ReturnType<typeof sumStats>;
  hasAnyStats: () => boolean;
  clearAll: () => void;
}

interface PersistedBuilder {
  parts: SelectedParts;
  recent: Partial<Record<PartCategory, SelectedPart[]>>;
}

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set, get) => ({
      parts: {},
      recent: {},
      setPart: (category, part) =>
        set((s) => {
          const parts: SelectedParts = { ...s.parts, [category]: part };
          // Famiglia esclusiva: blade ↔ lame CX.
          if (category === 'blade') {
            for (const c of CX_LAMA_CATEGORIES) delete parts[c];
          } else if (CX_LAMA_CATEGORIES.includes(category)) {
            delete parts.blade;
          }
          // Se la nuova parte ingloba il ratchet, svuota lo slot ratchet.
          if (ratchetIsIncluded(parts)) delete parts.ratchet;
          return {
            parts,
            recent: { ...s.recent, [category]: pushRecent(s.recent[category] ?? [], part) },
          };
        }),
      clearPart: (category) =>
        set((s) => {
          const parts = { ...s.parts };
          delete parts[category];
          return { parts };
        }),
      loadCombo: (parts) => set({ parts: { ...parts } }),
      getComboStats: () => sumStats(get().parts),
      hasAnyStats: () => Object.values(get().parts).some((p) => !!p?.stats),
      clearAll: () => set({ parts: {} }),
    }),
    {
      name: 'beybladex-builder-current',
      storage: createJSONStorage(() => asyncStorage),
      version: 2,
      migrate: (persisted, version) => {
        if (!persisted || typeof persisted !== 'object') return persisted as PersistedBuilder;
        const s = persisted as Record<string, unknown>;
        // v0: schema originale a 3 variabili fisse.
        if (version < 1) {
          const parts: SelectedParts = {};
          if (s.selectedBlade) parts.blade = s.selectedBlade as SelectedPart;
          if (s.selectedRatchet) parts.ratchet = s.selectedRatchet as SelectedPart;
          if (s.selectedBit) parts.bit = s.selectedBit as SelectedPart;
          return {
            parts,
            recent: {
              blade: (s.recentBlades as SelectedPart[]) ?? [],
              ratchet: (s.recentRatchets as SelectedPart[]) ?? [],
              bit: (s.recentBits as SelectedPart[]) ?? [],
            },
          } as PersistedBuilder as unknown as BuilderState;
        }
        // v1: aveva { system, parts, recent } → rimuovo system.
        if (version < 2) {
          return {
            parts: (s.parts as SelectedParts) ?? {},
            recent: (s.recent as PersistedBuilder['recent']) ?? {},
          } as PersistedBuilder as unknown as BuilderState;
        }
        return persisted as BuilderState;
      },
      partialize: (s): PersistedBuilder => ({ parts: s.parts, recent: s.recent }),
    }
  )
);
