import { DataNft } from "@itheum/sdk-mx-data-nft/out";
import { create } from "zustand";

type State = {
  nfts: DataNft[];
};

type Action = {
  updateNfts: (bitzBalance: State["nfts"]) => void;
};

export const useNftsStore = create<State & Action>((set) => ({
  nfts: [],
  updateNfts: (value: DataNft[]) => set(() => ({ nfts: value })),
}));
