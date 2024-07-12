import { create } from "zustand";

interface LocalStorageStore {
  appVersion: string | undefined;
  setAppVersion: (newAppVersion: string | undefined) => void;
  defaultChain: string;
  setDefaultChain: (newDefaultChain: string) => void;
}

export const useLocalStorageStore = create<LocalStorageStore>((set) => ({
  appVersion: import.meta.env.VITE_APP_VERSION,
  setAppVersion: (newAppVersion) => set({ appVersion: newAppVersion }),
  defaultChain: localStorage.getItem("defaultChain") ?? "multiversx",
  setDefaultChain: (newDefaultChain) => {
    localStorage.setItem("defaultChain", newDefaultChain);
    set({ defaultChain: newDefaultChain });
  },
}));
