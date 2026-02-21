/**
 * Core types for Beyblade X Score Tracker
 * Pure TypeScript - no React/DOM dependencies for mobile reuse
 */

export type FinishType = 'spin' | 'burst' | 'over' | 'xtreme';

export type PlayerId = 'player1' | 'player2';

export interface Player {
  id: PlayerId;
  name: string;
  score: number;
  fouls: number;
  finishCounts: Record<FinishType, number>;
}

export interface ScoreHistoryEntry {
  type: 'score';
  playerId: PlayerId;
  finishType: FinishType;
  pointsAdded: number;
  timestamp: number;
}

export interface FoulHistoryEntry {
  type: 'foul';
  playerId: PlayerId;
  previousFouls: number;
  opponentScored: boolean;
  timestamp: number;
}

export type HistoryEntry = ScoreHistoryEntry | FoulHistoryEntry;

export interface MatchState {
  player1: Player;
  player2: Player;
  winScore: number;
  maxFouls: number;
  winner: PlayerId | null;
  history: HistoryEntry[];
}

export interface GameAction {
  type: 'SCORE' | 'UNDO' | 'RESET' | 'SET_NAME' | 'SET_WIN_SCORE' | 'ADD_FOUL' | 'REMOVE_FOUL';
  payload?: {
    playerId?: PlayerId;
    finishType?: FinishType;
    name?: string;
    winScore?: number;
  };
}
