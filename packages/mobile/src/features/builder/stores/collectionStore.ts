import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { asyncStorage } from '../../../store/async-storage';

interface CollectionState {
  ownedIds: Set<string>;
  toggleOwned: (id: string) => void;
  isOwned: (id: string) => boolean;
  getOwnedCount: (ids: string[]) => number;
}

interface PersistedCollection {
  ownedIds: string[];
}

/**
 * Collezione parti possedute. `ownedIds` è un Set per lookup O(1); persistito come array e
 * ricostruito a Set nel `merge` (stesso pattern Set↔Array di game-store con `_persistedNames`).
 */
export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      ownedIds: new Set<string>(),
      toggleOwned: (id) =>
        set((state) => {
          const next = new Set(state.ownedIds);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return { ownedIds: next };
        }),
      isOwned: (id) => get().ownedIds.has(id),
      getOwnedCount: (ids) => ids.filter((id) => get().ownedIds.has(id)).length,
    }),
    {
      name: 'beybladex-builder-collection',
      storage: createJSONStorage(() => asyncStorage),
      partialize: (s): PersistedCollection => ({ ownedIds: [...s.ownedIds] }),
      merge: (persisted, current) => {
        const p = persisted as PersistedCollection | undefined;
        return { ...(current as CollectionState), ownedIds: new Set(p?.ownedIds ?? []) };
      },
    }
  )
);
