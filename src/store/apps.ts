import { create } from "zustand";

type State = {
  nfTunesRadioFirstTrackCachedBlob: string;
};

type Action = {
  updateNfTunesRadioFirstTrackCachedBlob: (nfTunesRadioFirstTrackCachedBlob: State["nfTunesRadioFirstTrackCachedBlob"]) => void;
};

export const useAppsStore = create<State & Action>((set) => ({
  nfTunesRadioFirstTrackCachedBlob: "",
  updateNfTunesRadioFirstTrackCachedBlob: (value: string) => set(() => ({ nfTunesRadioFirstTrackCachedBlob: value })),
}));
