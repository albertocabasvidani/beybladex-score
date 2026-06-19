import { create } from 'zustand';

/** Gruppo di parti mostrato nella schermata Parti. 'cx' raggruppa le 4 categorie Custom. */
export type BrowseCategory = 'blade' | 'ratchet' | 'bit' | 'cx';
export type TypeFilter = 'all' | 'attack' | 'defense' | 'stamina' | 'balance';
export type SortField = 'name' | 'atk' | 'def' | 'sta';

interface FilterState {
  searchQuery: string;
  category: BrowseCategory;
  partType: TypeFilter;
  ownedOnly: boolean;
  sortField: SortField;
  sortAsc: boolean;
  setSearchQuery: (query: string) => void;
  setCategory: (category: BrowseCategory) => void;
  setPartType: (type: TypeFilter) => void;
  setOwnedOnly: (owned: boolean) => void;
  setSortField: (field: SortField) => void;
  toggleSortDirection: () => void;
  resetFilters: () => void;
}

// In memoria (non persistito): i filtri ripartono puliti a ogni avvio.
export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: '',
  category: 'blade',
  partType: 'all',
  ownedOnly: false,
  sortField: 'name',
  sortAsc: true,
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCategory: (category) => set({ category }),
  setPartType: (partType) => set({ partType }),
  setOwnedOnly: (ownedOnly) => set({ ownedOnly }),
  setSortField: (sortField) => set({ sortField }),
  toggleSortDirection: () => set((s) => ({ sortAsc: !s.sortAsc })),
  resetFilters: () =>
    set({ searchQuery: '', category: 'blade', partType: 'all', ownedOnly: false, sortField: 'name', sortAsc: true }),
}));
