import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { FinishType, PlayerId, MatchState } from '@beybladex/shared';
import {
  createInitialMatchState,
  scorePoint,
  undoLastAction,
  canUndo as canUndoFn,
  resetMatch,
  setWinScore,
  setMaxFouls,
  setPlayerName,
  addFoul as addFoulFn,
  removeFoul as removeFoulFn,
  DEFAULT_WIN_SCORE,
  DEFAULT_MAX_FOULS,
} from '@beybladex/shared';
import { logger } from '../utils/logger';
import { asyncStorage } from './async-storage';

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
  addFoul: (playerId: PlayerId) => void;
  removeFoul: (playerId: PlayerId) => void;
  setMaxFoulsValue: (value: number) => void;
}

interface PersistedState {
  winScore: number;
  maxFouls: number;
  _persistedNames: { player1: string; player2: string };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...createInitialMatchState(DEFAULT_WIN_SCORE, DEFAULT_MAX_FOULS),
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

      // Reset match (preserve player names)
      reset: () => {
        try {
          const state = get();
          const p1Name = state.player1.name;
          const p2Name = state.player2.name;
          logger.info('Reset match', {
            winScore: state.winScore,
            p1: state.player1.score,
            p2: state.player2.score,
            currentAnimation: state.currentAnimation?.type ?? null,
          });
          const newState = resetMatch(state);
          set({
            ...newState,
            player1: { ...newState.player1, name: p1Name },
            player2: { ...newState.player2, name: p2Name },
            currentAnimation: null,
          });
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

      // Add foul to a player
      addFoul: (playerId) => {
        try {
          const state = get();
          if (state.winner) {
            logger.warn('Foul blocked: winner exists', { winner: state.winner });
            return;
          }
          logger.info('Add foul', {
            playerId,
            currentFouls: state[playerId].fouls,
            maxFouls: state.maxFouls,
          });
          const newState = addFoulFn(state, playerId);
          set({
            player1: newState.player1,
            player2: newState.player2,
            winner: newState.winner,
            history: newState.history,
          });
          logger.info('Foul applied', {
            fouls: newState[playerId].fouls,
            p1Score: newState.player1.score,
            p2Score: newState.player2.score,
            winner: newState.winner,
          });
        } catch (e) {
          logger.error('AddFoul CRASHED', {
            error: (e as Error).message,
            stack: (e as Error).stack?.split('\n').slice(0, 3).join('\n'),
            playerId,
          });
        }
      },

      // Remove foul from a player
      removeFoul: (playerId) => {
        try {
          const state = get();
          if (state[playerId].fouls <= 0) return;
          logger.info('Remove foul', {
            playerId,
            currentFouls: state[playerId].fouls,
          });
          const newState = removeFoulFn(state, playerId);
          set({
            [playerId]: newState[playerId],
            history: newState.history,
          });
        } catch (e) {
          logger.error('RemoveFoul CRASHED', {
            error: (e as Error).message,
            playerId,
          });
        }
      },

      // Set max fouls limit
      setMaxFoulsValue: (value) => {
        try {
          logger.info('Set max fouls', { value });
          const state = get();
          const newState = setMaxFouls(state, value);
          set({ maxFouls: newState.maxFouls });
        } catch (e) {
          logger.error('SetMaxFouls CRASHED', {
            error: (e as Error).message,
            value,
          });
        }
      },
    }),
    {
      name: 'beybladex-game',
      storage: createJSONStorage(() => asyncStorage),
      partialize: (state): PersistedState => ({
        winScore: state.winScore,
        maxFouls: state.maxFouls,
        _persistedNames: {
          player1: state.player1.name,
          player2: state.player2.name,
        },
      }),
      merge: (persisted, current) => {
        const p = persisted as PersistedState | undefined;
        if (!p) return current as GameStore;
        return {
          ...(current as GameStore),
          winScore: p.winScore ?? (current as GameStore).winScore,
          maxFouls: p.maxFouls ?? (current as GameStore).maxFouls,
          player1: {
            ...(current as GameStore).player1,
            name: p._persistedNames?.player1 ?? (current as GameStore).player1.name,
          },
          player2: {
            ...(current as GameStore).player2,
            name: p._persistedNames?.player2 ?? (current as GameStore).player2.name,
          },
        };
      },
    }
  )
);
