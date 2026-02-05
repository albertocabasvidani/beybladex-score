/**
 * Zustand store for app settings
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_WIN_SCORE, MIN_WIN_SCORE, MAX_WIN_SCORE } from '@beybladex/shared';

export type Language = 'it' | 'en';

interface SettingsStore {
  language: Language;
  defaultWinScore: number;

  // Actions
  setLanguage: (language: Language) => void;
  setDefaultWinScore: (score: number) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      language: 'it',
      defaultWinScore: DEFAULT_WIN_SCORE,

      setLanguage: (language) => {
        set({ language });
      },

      setDefaultWinScore: (score) => {
        // Clamp value between min and max
        const clampedScore = Math.max(MIN_WIN_SCORE, Math.min(MAX_WIN_SCORE, score));
        set({ defaultWinScore: clampedScore });
      },
    }),
    {
      name: 'beybladex-settings',
    }
  )
);
