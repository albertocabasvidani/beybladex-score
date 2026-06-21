/**
 * Game constants for Beyblade X Score Tracker
 * Pure TypeScript - no React/DOM dependencies for mobile reuse
 */

import type { FinishType, Player, PlayerId } from './types';

// Points awarded for each finish type
export const FINISH_SCORES: Record<FinishType, number> = {
  spin: 1,
  burst: 2,
  over: 2,
  xtreme: 3,
} as const;

// Default win score (first to reach this wins)
export const DEFAULT_WIN_SCORE = 4;

// Min/max win score for settings
export const MIN_WIN_SCORE = 3;
export const MAX_WIN_SCORE = 999;

// Foul limits
export const DEFAULT_MAX_FOULS = 2;
export const MIN_MAX_FOULS = 0;  // 0 = disabled
export const MAX_MAX_FOULS = 5;

// Finish type display info
export const FINISH_INFO: Record<FinishType, {
  label: string;
  labelKey: string;
  color: string;
  bgColor: string;
  hoverColor: string;
}> = {
  spin: {
    label: 'Spin',
    labelKey: 'finish.spin',
    color: '#22c55e',      // green-500
    bgColor: '#166534',    // green-800
    hoverColor: '#15803d', // green-700
  },
  burst: {
    label: 'Burst',
    labelKey: 'finish.burst',
    color: '#ef4444',      // red-500
    bgColor: '#991b1b',    // red-800
    hoverColor: '#b91c1c', // red-700
  },
  over: {
    label: 'Over',
    labelKey: 'finish.over',
    color: '#3b82f6',      // blue-500
    bgColor: '#1e40af',    // blue-800
    hoverColor: '#1d4ed8', // blue-700
  },
  xtreme: {
    label: 'Xtreme',
    labelKey: 'finish.xtreme',
    color: '#f59e0b',      // amber-500
    bgColor: '#92400e',    // amber-800
    hoverColor: '#b45309', // amber-700
  },
} as const;

// Order of finish buttons (left to right)
export const FINISH_ORDER: FinishType[] = ['spin', 'burst', 'over', 'xtreme'];

// Default player names. Used as a sentinel: the UI shows the localized name
// (player.player1/2) while the stored value still equals one of these.
export const DEFAULT_PLAYER_NAMES: Record<PlayerId, string> = {
  player1: 'Player 1',
  player2: 'Player 2',
};

// True when the name is still the (English) default, i.e. the user never set a custom one.
export function isDefaultPlayerName(name: string, playerId: PlayerId): boolean {
  return name === DEFAULT_PLAYER_NAMES[playerId];
}

// Create initial player state
export function createInitialPlayer(id: 'player1' | 'player2'): Player {
  return {
    id,
    name: DEFAULT_PLAYER_NAMES[id],
    score: 0,
    fouls: 0,
    finishCounts: {
      spin: 0,
      burst: 0,
      over: 0,
      xtreme: 0,
    },
  };
}
