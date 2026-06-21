import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { asyncStorage } from './async-storage';

export type AppTab = 'home' | 'scoreboard' | 'builder' | 'analytics';
export type BuilderTab = 'parts' | 'builder' | 'decks' | 'collection';

interface UiStore {
  /**
   * Modalità top-level. scoreboard = landscape; home/builder/analytics = portrait. Gated da
   * MODE_HOME_ENABLED in App (con flag OFF l'app resta sempre sullo scoreboard).
   */
  activeTab: AppTab;
  /** Tab interna del builder. */
  activeBuilderTab: BuilderTab;
  setActiveTab: (tab: AppTab) => void;
  setActiveBuilderTab: (tab: BuilderTab) => void;
}

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      activeTab: 'home',
      activeBuilderTab: 'builder',
      setActiveTab: (activeTab) => set({ activeTab }),
      setActiveBuilderTab: (activeBuilderTab) => set({ activeBuilderTab }),
    }),
    {
      name: 'beybladex-ui',
      storage: createJSONStorage(() => asyncStorage),
    }
  )
);
