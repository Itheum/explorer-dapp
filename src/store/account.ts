import { create } from "zustand";

type State = {
  bitzBalance: number;
  cooldown: number;
  givenBitzSum: number;
  collectedBitzSum: number;
  bonusBitzSum: number;
  bonusTries: number;
};

type Action = {
  updateBitzBalance: (bitzBalance: State["bitzBalance"]) => void;
  updateCooldown: (cooldown: State["cooldown"]) => void;
  updateGivenBitzSum: (givenBitzSum: State["givenBitzSum"]) => void;
  updateCollectedBitzSum: (collectedBitzSum: State["collectedBitzSum"]) => void;
  updateBonusBitzSum: (bonusBitzSum: State["bonusBitzSum"]) => void;
  updateBonusTries: (bonusTries: State["bonusTries"]) => void;
};

export const useAccountStore = create<State & Action>((set) => ({
  bitzBalance: -2,
  cooldown: -2,
  givenBitzSum: -2,
  collectedBitzSum: -2,
  bonusBitzSum: -2,
  bonusTries: -2,
  updateBitzBalance: (value: number) => set(() => ({ bitzBalance: value })),
  updateCooldown: (value: number) => set(() => ({ cooldown: value })),
  updateGivenBitzSum: (value: number) => set(() => ({ givenBitzSum: value })),
  updateCollectedBitzSum: (value: number) => set(() => ({ collectedBitzSum: value })),
  updateBonusBitzSum: (value: number) => set(() => ({ bonusBitzSum: value })),
  updateBonusTries: (value: number) => set(() => ({ bonusTries: value })),
}));
