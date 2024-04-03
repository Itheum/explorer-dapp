import { create } from "zustand";

type State = {
  bitzBalance: number;
};

type Action = {
  updateBitzBalance: (bitzBalance: State["bitzBalance"]) => void;
};

export const useAccountStore = create<State & Action>((set) => ({
  bitzBalance: -2,
  updateBitzBalance: (value: number) => set(() => ({ bitzBalance: value })),
}));
