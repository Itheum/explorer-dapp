import { create } from "zustand";

interface FilterStore {
  filter: string | null;
  setFilter: (newFilter: string | null) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  filter: null,
  setFilter: (newFilter) => set({ filter: newFilter }),
}));
