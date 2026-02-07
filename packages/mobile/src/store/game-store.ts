import { create } from 'zustand';
import type { FinishType, PlayerId, MatchState } from '@beybladex/shared';
import {
  createInitialMatchState,
  scorePoint,
  undoLastAction,
  canUndo as canUndoFn,
  resetMatch,
  DEFAULT_WIN_SCORE,
} from '@beybladex/shared';

interface GameStore extends MatchState {
  // Actions
  score: (playerId: PlayerId, finishType: FinishType) => void;
  undo: () => void;
  reset: () => void;
  canUndo: () => boolean;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  ...createInitialMatchState(DEFAULT_WIN_SCORE),

  // Score a point
  score: (playerId, finishType) => {
    const state = get();
    if (state.winner) return;
    const newState = scorePoint(state, playerId, finishType);
    set(newState);
  },

  // Undo last action
  undo: () => {
    const state = get();
    const newState = undoLastAction(state);
    set({
      player1: newState.player1,
      player2: newState.player2,
      winner: newState.winner,
      history: newState.history,
    });
  },

  // Reset match
  reset: () => {
    const state = get();
    const newState = resetMatch(state);
    set(newState);
  },

  // Check if undo is available
  canUndo: () => {
    return canUndoFn(get());
  },
}));
