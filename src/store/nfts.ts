import { DataNft } from "@itheum/sdk-mx-data-nft/out";
import { create } from "zustand";

type State = {
  nfts: DataNft[];
  isLoading: boolean;
};

type Action = {
  updateNfts: (bitzBalance: State["nfts"]) => void;
  updateIsLoading: (isLoading: boolean) => void;
};

export const useNftsStore = create<State & Action>((set) => ({
  nfts: [],
  isLoading: false,
  updateNfts: (value: DataNft[]) => set(() => ({ nfts: value })),
  updateIsLoading: (value: boolean) => set(() => ({ isLoading: value })),
}));
