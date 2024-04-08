import { create } from "zustand";

type State = {
  bitzBalance: number;
  cooldown: number;
  givenBitzSum: number;
};

type Action = {
  updateBitzBalance: (bitzBalance: State["bitzBalance"]) => void;
  updateCooldown: (cooldown: State["cooldown"]) => void;
  updateGivenBitzSum: (givenBitzSum: State["givenBitzSum"]) => void;
};

export const useAccountStore = create<State & Action>((set) => ({
  bitzBalance: -2,
  cooldown: -2,
  givenBitzSum: -2,
  updateBitzBalance: (value: number) => set(() => ({ bitzBalance: value })),
  updateCooldown: (value: number) => set(() => ({ cooldown: value })),
  updateGivenBitzSum: (value: number) => set(() => ({ givenBitzSum: value })),
}));
