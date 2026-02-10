import { create } from 'zustand';
import type { FinishType, PlayerId, MatchState } from '@beybladex/shared';
import {
  createInitialMatchState,
  scorePoint,
  undoLastAction,
  canUndo as canUndoFn,
  resetMatch,
  setWinScore,
  setPlayerName,
  DEFAULT_WIN_SCORE,
} from '@beybladex/shared';
import { logger } from '../utils/logger';

interface GameStore extends MatchState {
  currentAnimation: {
    type: FinishType;
    playerId: PlayerId;
  } | null;

  // Actions
  score: (playerId: PlayerId, finishType: FinishType) => void;
  undo: () => void;
  reset: () => void;
  canUndo: () => boolean;
  clearAnimation: () => void;
  setWinScoreValue: (value: number) => void;
  setPlayerNameValue: (playerId: PlayerId, name: string) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  ...createInitialMatchState(DEFAULT_WIN_SCORE),
  currentAnimation: null,

  // Score a point
  score: (playerId, finishType) => {
    try {
      const state = get();
      if (state.winner) {
        logger.warn('Score blocked: winner exists', { winner: state.winner });
        return;
      }
      if (state.currentAnimation) {
        logger.warn('Score blocked: animation in progress', { animation: state.currentAnimation.type });
        return;
      }
      logger.info('Score', {
        playerId,
        finishType,
        p1: state.player1.score,
        p2: state.player2.score,
      });
      const newState = scorePoint(state, playerId, finishType);
      set({
        ...newState,
        currentAnimation: { type: finishType, playerId },
      });
      logger.info('Score applied', {
        p1: newState.player1.score,
        p2: newState.player2.score,
        winner: newState.winner,
      });
    } catch (e) {
      logger.error('Score action CRASHED', {
        error: (e as Error).message,
        stack: (e as Error).stack?.split('\n').slice(0, 3).join('\n'),
        playerId,
        finishType,
      });
    }
  },

  // Undo last action
  undo: () => {
    try {
      const state = get();
      logger.info('Undo', {
        historyLength: state.history.length,
        p1: state.player1.score,
        p2: state.player2.score,
        currentAnimation: state.currentAnimation?.type ?? null,
      });
      const newState = undoLastAction(state);
      set({
        player1: newState.player1,
        player2: newState.player2,
        winner: newState.winner,
        history: newState.history,
        currentAnimation: null,
      });
    } catch (e) {
      logger.error('Undo action CRASHED', {
        error: (e as Error).message,
        stack: (e as Error).stack?.split('\n').slice(0, 3).join('\n'),
      });
    }
  },

  // Reset match
  reset: () => {
    try {
      const state = get();
      logger.info('Reset match', {
        winScore: state.winScore,
        p1: state.player1.score,
        p2: state.player2.score,
        currentAnimation: state.currentAnimation?.type ?? null,
      });
      const newState = resetMatch(state);
      set({ ...newState, currentAnimation: null });
    } catch (e) {
      logger.error('Reset action CRASHED', {
        error: (e as Error).message,
        stack: (e as Error).stack?.split('\n').slice(0, 3).join('\n'),
      });
    }
  },

  // Check if undo is available
  canUndo: () => {
    return canUndoFn(get());
  },

  // Clear animation overlay
  clearAnimation: () => {
    const state = get();
    logger.info('Clear animation', {
      type: state.currentAnimation?.type,
      winner: state.winner,
    });
    set({ currentAnimation: null });
  },

  // Set win score
  setWinScoreValue: (value) => {
    try {
      const state = get();
      logger.info('Set win score', { value });
      const newState = setWinScore(state, value);
      set({ winScore: newState.winScore });
    } catch (e) {
      logger.error('SetWinScore CRASHED', {
        error: (e as Error).message,
        value,
      });
    }
  },

  // Set player name
  setPlayerNameValue: (playerId, name) => {
    try {
      const state = get();
      logger.info('Set player name', { playerId, name });
      const newState = setPlayerName(state, playerId, name);
      set({ [playerId]: newState[playerId] });
    } catch (e) {
      logger.error('SetPlayerName CRASHED', {
        error: (e as Error).message,
        playerId,
        name,
      });
    }
  },
}));
