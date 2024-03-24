import { create } from "zustand";

type State = {
  bitsBalance: number;
};

type Action = {
  updateBitsBalance: (bitsBalance: State["bitsBalance"]) => void;
};

export const useAccountStore = create<State & Action>((set) => ({
  bitsBalance: -2,
  updateBitsBalance: (value: number) => set(() => ({ bitsBalance: value })),
}));
