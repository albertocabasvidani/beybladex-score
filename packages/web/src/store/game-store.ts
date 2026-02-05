/**
 * Zustand store for game state
 */

import { create } from 'zustand';
import type { FinishType, PlayerId, MatchState } from '@beybladex/shared';
import {
  createInitialMatchState,
  scorePoint,
  undoLastAction,
  canUndo,
  resetMatch,
  setPlayerName,
  setWinScore,
  DEFAULT_WIN_SCORE,
} from '@beybladex/shared';

interface GameStore extends MatchState {
  // Current animation to display (null when no animation)
  currentAnimation: {
    type: FinishType;
    playerId: PlayerId;
  } | null;

  // Actions
  score: (playerId: PlayerId, finishType: FinishType) => void;
  undo: () => void;
  reset: () => void;
  setName: (playerId: PlayerId, name: string) => void;
  setWinScoreValue: (winScore: number) => void;
  clearAnimation: () => void;
  canUndo: () => boolean;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  ...createInitialMatchState(DEFAULT_WIN_SCORE),
  currentAnimation: null,

  // Score a point
  score: (playerId, finishType) => {
    const state = get();
    if (state.winner) return; // Don't score if game is over

    const newState = scorePoint(state, playerId, finishType);

    set({
      ...newState,
      currentAnimation: { type: finishType, playerId },
    });
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
      currentAnimation: null,
    });
  },

  // Reset match
  reset: () => {
    const state = get();
    const newState = resetMatch(state);
    set({
      ...newState,
      currentAnimation: null,
    });
  },

  // Set player name
  setName: (playerId, name) => {
    const state = get();
    const newState = setPlayerName(state, playerId, name);
    set({
      [playerId]: newState[playerId],
    });
  },

  // Set win score
  setWinScoreValue: (winScore) => {
    const state = get();
    const newState = setWinScore(state, winScore);
    set({
      winScore: newState.winScore,
      winner: newState.winner,
    });
  },

  // Clear current animation
  clearAnimation: () => {
    set({ currentAnimation: null });
  },

  // Check if undo is available
  canUndo: () => {
    return canUndo(get());
  },
}));
