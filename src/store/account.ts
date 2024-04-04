import { create } from "zustand";

type State = {
  bitzBalance: number;
  cooldown: number;
};

type Action = {
  updateBitzBalance: (bitzBalance: State["bitzBalance"]) => void;
  updateCooldown: (cooldown: State["cooldown"]) => void;
};

export const useAccountStore = create<State & Action>((set) => ({
  bitzBalance: -2,
  cooldown: -2,
  updateBitzBalance: (value: number) => set(() => ({ bitzBalance: value })),
  updateCooldown: (value: number) => set(() => ({ cooldown: value })),
}));
