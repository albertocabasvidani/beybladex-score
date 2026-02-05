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
  finishCounts: Record<FinishType, number>;
}

export interface HistoryEntry {
  playerId: PlayerId;
  finishType: FinishType;
  pointsAdded: number;
  timestamp: number;
}

export interface MatchState {
  player1: Player;
  player2: Player;
  winScore: number;
  winner: PlayerId | null;
  history: HistoryEntry[];
}

export interface GameAction {
  type: 'SCORE' | 'UNDO' | 'RESET' | 'SET_NAME' | 'SET_WIN_SCORE';
  payload?: {
    playerId?: PlayerId;
    finishType?: FinishType;
    name?: string;
    winScore?: number;
  };
}
