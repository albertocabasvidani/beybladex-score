import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ComboLine, FinishType, PartCategory, PlayerId } from '@beybladex/shared';
import { asyncStorage } from '../../store/async-storage';
import { beyComboKey, type AssignedBey } from './bey';

/** Snapshot di una Bey al momento del match (immutabile: sopravvive a rename/delete della combo). */
export interface RecordedBey {
  /** Chiave d'identità per l'aggregazione (id parti ordinati o `free:<nome>`). */
  comboKey: string;
  comboId: string | null;
  name: string;
  line: ComboLine;
  /** Parti come {categoria, id, nome} — niente stat (non servono all'analisi dei risultati). */
  parts: { category: PartCategory; id: string; name: string }[];
  freeform?: boolean;
  variant?: boolean;
}

/** Risultato di un lato (giocatore) in un match registrato. */
export interface RecordedSide {
  bey: RecordedBey;
  score: number;
  finishCounts: Record<FinishType, number>;
  fouls: number;
}

/** Una partita conclusa: due Bey, i rispettivi risultati e il vincitore. */
export interface MatchRecord {
  id: string;
  playedAt: number;
  winScore: number;
  winner: PlayerId;
  player1: RecordedSide;
  player2: RecordedSide;
}

/** Risultato grezzo di un lato per la registrazione (dallo stato del game store). */
export interface SideResultInput {
  bey: AssignedBey;
  score: number;
  finishCounts: Record<FinishType, number>;
  fouls: number;
}

function toRecordedBey(bey: AssignedBey): RecordedBey {
  return {
    comboKey: beyComboKey(bey),
    comboId: bey.comboId,
    name: bey.name,
    line: bey.line,
    parts: Object.entries(bey.parts).flatMap(([category, p]) =>
      p ? [{ category: category as PartCategory, id: p.id, name: p.name }] : []
    ),
    ...(bey.freeform ? { freeform: true } : {}),
    ...(bey.variant ? { variant: true } : {}),
  };
}

interface RecordMatchInput {
  playedAt: number;
  winScore: number;
  winner: PlayerId;
  player1: SideResultInput;
  player2: SideResultInput;
}

interface StatsState {
  records: MatchRecord[];
  /** Registra una partita conclusa. Restituisce l'id del record creato. */
  recordMatch: (input: RecordMatchInput) => string;
  deleteRecord: (id: string) => void;
  clearAll: () => void;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
      records: [],
      recordMatch: (input) => {
        const id = `match-${input.playedAt}-${Math.round(input.player1.score * 100 + input.player2.score)}`;
        const record: MatchRecord = {
          id,
          playedAt: input.playedAt,
          winScore: input.winScore,
          winner: input.winner,
          player1: {
            bey: toRecordedBey(input.player1.bey),
            score: input.player1.score,
            finishCounts: input.player1.finishCounts,
            fouls: input.player1.fouls,
          },
          player2: {
            bey: toRecordedBey(input.player2.bey),
            score: input.player2.score,
            finishCounts: input.player2.finishCounts,
            fouls: input.player2.fouls,
          },
        };
        set((s) => ({ records: [...s.records, record] }));
        return id;
      },
      deleteRecord: (id) => set((s) => ({ records: s.records.filter((r) => r.id !== id) })),
      clearAll: () => set({ records: [] }),
    }),
    {
      name: 'beybladex-stats',
      storage: createJSONStorage(() => asyncStorage),
      version: 1,
      partialize: (s) => ({ records: s.records }),
    }
  )
);
