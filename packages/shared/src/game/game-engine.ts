/**
 * Game engine for Beyblade X Score Tracker
 * Pure functions - no React/DOM dependencies for mobile reuse
 */

import type { FinishType, PlayerId, Player, MatchState, HistoryEntry } from './types';
import { FINISH_SCORES, DEFAULT_WIN_SCORE, createInitialPlayer } from './constants';

/**
 * Calculate points for a finish type
 */
export function getFinishPoints(finishType: FinishType): number {
  return FINISH_SCORES[finishType];
}

/**
 * Create initial match state
 */
export function createInitialMatchState(winScore: number = DEFAULT_WIN_SCORE): MatchState {
  return {
    player1: createInitialPlayer('player1'),
    player2: createInitialPlayer('player2'),
    winScore,
    winner: null,
    history: [],
  };
}

/**
 * Check if a player has won
 */
export function checkWinner(state: MatchState): PlayerId | null {
  if (state.player1.score >= state.winScore) {
    return 'player1';
  }
  if (state.player2.score >= state.winScore) {
    return 'player2';
  }
  return null;
}

/**
 * Add points to a player for a finish
 */
export function scorePoint(
  state: MatchState,
  playerId: PlayerId,
  finishType: FinishType
): MatchState {
  // Don't allow scoring if there's already a winner
  if (state.winner) {
    return state;
  }

  const points = getFinishPoints(finishType);
  const player = state[playerId];

  const updatedPlayer: Player = {
    ...player,
    score: player.score + points,
    finishCounts: {
      ...player.finishCounts,
      [finishType]: player.finishCounts[finishType] + 1,
    },
  };

  const historyEntry: HistoryEntry = {
    playerId,
    finishType,
    pointsAdded: points,
    timestamp: Date.now(),
  };

  const newState: MatchState = {
    ...state,
    [playerId]: updatedPlayer,
    history: [...state.history, historyEntry],
  };

  // Check for winner after scoring
  newState.winner = checkWinner(newState);

  return newState;
}

/**
 * Undo the last action
 */
export function undoLastAction(state: MatchState): MatchState {
  if (state.history.length === 0) {
    return state;
  }

  const lastEntry = state.history[state.history.length - 1];
  const player = state[lastEntry.playerId];

  const updatedPlayer: Player = {
    ...player,
    score: player.score - lastEntry.pointsAdded,
    finishCounts: {
      ...player.finishCounts,
      [lastEntry.finishType]: player.finishCounts[lastEntry.finishType] - 1,
    },
  };

  return {
    ...state,
    [lastEntry.playerId]: updatedPlayer,
    history: state.history.slice(0, -1),
    winner: null, // Reset winner since we're undoing
  };
}

/**
 * Check if undo is available
 */
export function canUndo(state: MatchState): boolean {
  return state.history.length > 0;
}

/**
 * Reset match to initial state
 */
export function resetMatch(state: MatchState): MatchState {
  return createInitialMatchState(state.winScore);
}

/**
 * Set player name
 */
export function setPlayerName(
  state: MatchState,
  playerId: PlayerId,
  name: string
): MatchState {
  return {
    ...state,
    [playerId]: {
      ...state[playerId],
      name: name.trim() || (playerId === 'player1' ? 'Player 1' : 'Player 2'),
    },
  };
}

/**
 * Set win score
 */
export function setWinScore(state: MatchState, winScore: number): MatchState {
  return {
    ...state,
    winScore,
    // Recheck winner with new score
    winner: checkWinner({ ...state, winScore }),
  };
}

/**
 * Get the opponent player ID
 */
export function getOpponentId(playerId: PlayerId): PlayerId {
  return playerId === 'player1' ? 'player2' : 'player1';
}

/**
 * Get match statistics
 */
export function getMatchStats(state: MatchState) {
  return {
    player1: {
      ...state.player1.finishCounts,
      total: state.player1.score,
    },
    player2: {
      ...state.player2.finishCounts,
      total: state.player2.score,
    },
    totalRounds: state.history.length,
  };
}
