import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { FinishType, PlayerId, MatchState, PartCategory } from '@beybladex/shared';
import type { SelectedPart } from '../features/builder/stores/slots';
import { type AssignedBey, beyWithPart } from '../features/stats/bey';
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
  isSwapped: boolean;
  wins: { player1: number; player2: number };
  sideSwitchReminderEnabled: boolean;
  /** Bey assegnata a ciascun giocatore (selettore combo nello scoreboard). Persistita tra i match. */
  player1Bey: AssignedBey | null;
  player2Bey: AssignedBey | null;

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
  swapSides: () => void;
  resetWins: () => void;
  setSideSwitchReminderEnabled: (value: boolean) => void;
  assignBey: (playerId: PlayerId, bey: AssignedBey) => void;
  clearBey: (playerId: PlayerId) => void;
  /** Cambia un solo pezzo della Bey al volo (variante effimera). */
  swapBeyPart: (playerId: PlayerId, category: PartCategory, part: SelectedPart) => void;
}

interface PersistedState {
  winScore: number;
  maxFouls: number;
  wins: { player1: number; player2: number };
  _persistedNames: { player1: string; player2: string };
  sideSwitchReminderEnabled: boolean;
  player1Bey: AssignedBey | null;
  player2Bey: AssignedBey | null;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...createInitialMatchState(DEFAULT_WIN_SCORE, DEFAULT_MAX_FOULS),
      currentAnimation: null,
      isSwapped: false,
      wins: { player1: 0, player2: 0 },
      sideSwitchReminderEnabled: true,
      player1Bey: null,
      player2Bey: null,

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
          const updates: Partial<GameStore> = {
            ...newState,
            currentAnimation: { type: finishType, playerId },
          };
          if (newState.winner && !state.winner) {
            updates.wins = { ...state.wins, [newState.winner]: state.wins[newState.winner] + 1 };
          }
          set(updates);
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
          if (state.currentAnimation) {
            logger.warn('Undo blocked: animation in progress', { animation: state.currentAnimation.type });
            return;
          }
          logger.info('Undo', {
            historyLength: state.history.length,
            p1: state.player1.score,
            p2: state.player2.score,
            currentAnimation: null, // garantito null: il guard sopra fa return se è in corso un'animazione
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
          const updates: Partial<GameStore> = {
            player1: newState.player1,
            player2: newState.player2,
            winner: newState.winner,
            history: newState.history,
          };
          if (newState.winner && !state.winner) {
            updates.wins = { ...state.wins, [newState.winner]: state.wins[newState.winner] + 1 };
          }
          set(updates);
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

      // Swap sides (cambio campo)
      swapSides: () => {
        const state = get();
        logger.info('Swap sides', { isSwapped: !state.isSwapped });
        set({ isSwapped: !state.isSwapped });
      },

      // Reset wins counter for both players
      resetWins: () => {
        logger.info('Reset wins');
        set({ wins: { player1: 0, player2: 0 } });
      },

      // Enable/disable the "did you switch sides?" reminder
      setSideSwitchReminderEnabled: (value) => {
        logger.info('Set side-switch reminder', { value });
        set({ sideSwitchReminderEnabled: value });
      },

      // Assign a Bey (combo) to a player from the shelf / compose / freeform
      assignBey: (playerId, bey) => {
        logger.info('Assign bey', { playerId, name: bey.name, comboId: bey.comboId });
        set(playerId === 'player1' ? { player1Bey: bey } : { player2Bey: bey });
      },

      // Remove the assigned Bey
      clearBey: (playerId) => {
        logger.info('Clear bey', { playerId });
        set(playerId === 'player1' ? { player1Bey: null } : { player2Bey: null });
      },

      // Swap a single part of the assigned Bey (ephemeral variant)
      swapBeyPart: (playerId, category, part) => {
        const state = get();
        const current = playerId === 'player1' ? state.player1Bey : state.player2Bey;
        const base: AssignedBey =
          current ?? { comboId: null, name: part.name, line: 'bx', parts: {} };
        const next = beyWithPart(base, category, part);
        logger.info('Swap bey part', { playerId, category, part: part.name });
        set(playerId === 'player1' ? { player1Bey: next } : { player2Bey: next });
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
        wins: state.wins,
        _persistedNames: {
          player1: state.player1.name,
          player2: state.player2.name,
        },
        sideSwitchReminderEnabled: state.sideSwitchReminderEnabled,
        player1Bey: state.player1Bey,
        player2Bey: state.player2Bey,
      }),
      merge: (persisted, current) => {
        const p = persisted as PersistedState | undefined;
        if (!p) return current as GameStore;
        return {
          ...(current as GameStore),
          winScore: p.winScore ?? (current as GameStore).winScore,
          maxFouls: p.maxFouls ?? (current as GameStore).maxFouls,
          wins: p.wins ?? (current as GameStore).wins,
          player1: {
            ...(current as GameStore).player1,
            name: p._persistedNames?.player1 ?? (current as GameStore).player1.name,
          },
          player2: {
            ...(current as GameStore).player2,
            name: p._persistedNames?.player2 ?? (current as GameStore).player2.name,
          },
          sideSwitchReminderEnabled:
            p.sideSwitchReminderEnabled ?? (current as GameStore).sideSwitchReminderEnabled,
          player1Bey: p.player1Bey ?? (current as GameStore).player1Bey,
          player2Bey: p.player2Bey ?? (current as GameStore).player2Bey,
        };
      },
    }
  )
);
