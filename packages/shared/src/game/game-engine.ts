/**
 * Game engine for Beyblade X Score Tracker
 * Pure functions - no React/DOM dependencies for mobile reuse
 */

import type { FinishType, PlayerId, Player, MatchState, ScoreHistoryEntry, FoulHistoryEntry } from './types';
import { FINISH_SCORES, DEFAULT_WIN_SCORE, DEFAULT_MAX_FOULS, createInitialPlayer } from './constants';

/**
 * Calculate points for a finish type
 */
export function getFinishPoints(finishType: FinishType): number {
  return FINISH_SCORES[finishType];
}

/**
 * Create initial match state
 */
export function createInitialMatchState(
  winScore: number = DEFAULT_WIN_SCORE,
  maxFouls: number = DEFAULT_MAX_FOULS
): MatchState {
  return {
    player1: createInitialPlayer('player1'),
    player2: createInitialPlayer('player2'),
    winScore,
    maxFouls,
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

  const historyEntry: ScoreHistoryEntry = {
    type: 'score',
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
 * Add a foul to a player.
 * If maxFouls > 0 and fouls reach maxFouls: opponent gets +1 point, fouls reset to 0.
 */
export function addFoul(state: MatchState, playerId: PlayerId): MatchState {
  if (state.winner) return state;

  const player = state[playerId];
  const opponentId = getOpponentId(playerId);
  const newFouls = player.fouls + 1;
  let opponentScored = false;

  let updatedPlayer: Player = { ...player, fouls: newFouls };
  let updatedOpponent: Player = { ...state[opponentId] };

  // Check if fouls reached the limit
  if (state.maxFouls > 0 && newFouls >= state.maxFouls) {
    updatedPlayer = { ...updatedPlayer, fouls: 0 };
    updatedOpponent = { ...updatedOpponent, score: updatedOpponent.score + 1 };
    opponentScored = true;
  }

  const historyEntry: FoulHistoryEntry = {
    type: 'foul',
    playerId,
    previousFouls: player.fouls,
    opponentScored,
    timestamp: Date.now(),
  };

  const newState: MatchState = {
    ...state,
    [playerId]: updatedPlayer,
    [opponentId]: updatedOpponent,
    history: [...state.history, historyEntry],
  };

  // Check for winner after potential penalty point
  if (opponentScored) {
    newState.winner = checkWinner(newState);
  }

  return newState;
}

/**
 * Remove a foul from a player (decrement, minimum 0)
 */
export function removeFoul(state: MatchState, playerId: PlayerId): MatchState {
  const player = state[playerId];
  if (player.fouls <= 0) return state;

  const historyEntry: FoulHistoryEntry = {
    type: 'foul',
    playerId,
    previousFouls: player.fouls,
    opponentScored: false,
    timestamp: Date.now(),
  };

  return {
    ...state,
    [playerId]: { ...player, fouls: player.fouls - 1 },
    history: [...state.history, historyEntry],
  };
}

/**
 * Undo the last action
 */
export function undoLastAction(state: MatchState): MatchState {
  if (state.history.length === 0) {
    return state;
  }

  const lastEntry = state.history[state.history.length - 1];
  const newHistory = state.history.slice(0, -1);

  if (lastEntry.type === 'score') {
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
      history: newHistory,
      winner: null,
    };
  }

  if (lastEntry.type === 'foul') {
    const player = state[lastEntry.playerId];
    const updatedPlayer: Player = {
      ...player,
      fouls: lastEntry.previousFouls,
    };

    let result: MatchState = {
      ...state,
      [lastEntry.playerId]: updatedPlayer,
      history: newHistory,
      winner: null,
    };

    // If the foul caused opponent to score, undo that point too
    if (lastEntry.opponentScored) {
      const opponentId = getOpponentId(lastEntry.playerId);
      const opponent = state[opponentId];
      result = {
        ...result,
        [opponentId]: { ...opponent, score: opponent.score - 1 },
      };
    }

    return result;
  }

  return state;
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
  return createInitialMatchState(state.winScore, state.maxFouls);
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
 * Set max fouls limit
 */
export function setMaxFouls(state: MatchState, maxFouls: number): MatchState {
  return {
    ...state,
    maxFouls,
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
      fouls: state.player1.fouls,
    },
    player2: {
      ...state.player2.finishCounts,
      total: state.player2.score,
      fouls: state.player2.fouls,
    },
    totalRounds: state.history.filter(h => h.type === 'score').length,
  };
}
