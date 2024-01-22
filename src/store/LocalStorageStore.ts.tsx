import { create } from "zustand";

interface LocalStorageStore {
  appVersion: string | undefined;
  setAppVersion: (newAppVersion: string | undefined) => void;
}

export const useLocalStorageStore = create<LocalStorageStore>((set) => ({
  appVersion: import.meta.env.VITE_APP_VERSION,
  setAppVersion: (newAppVersion) => set({ appVersion: newAppVersion }),
}));
