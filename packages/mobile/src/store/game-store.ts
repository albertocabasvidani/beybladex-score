import { create } from 'zustand';
import {
  createGameStore,
  type GameState,
  type GameActions,
} from '@beybladex/shared';

export type GameStore = GameState & GameActions;

// Crea lo store mobile con la logica condivisa
export const useGameStore = create<GameStore>()((...args) =>
  createGameStore(...args)
);
