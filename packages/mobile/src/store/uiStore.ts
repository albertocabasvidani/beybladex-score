import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { asyncStorage } from './async-storage';

export type AppTab = 'scoreboard' | 'builder';
export type BuilderTab = 'parts' | 'builder' | 'decks' | 'collection';

interface UiStore {
  /** Tab top-level: scoreboard (landscape) o builder (portrait). Gated da BUILDER_ENABLED in App. */
  activeTab: AppTab;
  /** Tab interna del builder. */
  activeBuilderTab: BuilderTab;
  setActiveTab: (tab: AppTab) => void;
  setActiveBuilderTab: (tab: BuilderTab) => void;
}

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      activeTab: 'scoreboard',
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
