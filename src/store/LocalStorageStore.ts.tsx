import { create } from "zustand";

interface LocalStorageStore {
  appVersion: string | undefined;
  setAppVersion: (newAppVersion: string | undefined) => void;
}

export const useLocalStorageStore = create<LocalStorageStore>((set) => ({
  appVersion: process.env.REACT_APP_VERSION,
  setAppVersion: (newAppVersion) => set({ appVersion: newAppVersion }),
}));
