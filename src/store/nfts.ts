import { DataNft } from "@itheum/sdk-mx-data-nft/out";
import { DasApiAsset } from "@metaplex-foundation/digital-asset-standard-api";
import { create } from "zustand";

type State = {
  mvxNfts: DataNft[];
  isLoadingMvx: boolean;
  solNfts: DasApiAsset[];
  solBitzNfts: DasApiAsset[];
  isLoadingSol: boolean;
};

type Action = {
  updateMvxNfts: (bitzBalance: State["mvxNfts"]) => void;
  updateIsLoadingMvx: (isLoading: boolean) => void;
  updateSolNfts: (solNfts: State["solNfts"]) => void;
  updateSolBitzNfts: (solBitzNfts: State["solBitzNfts"]) => void;
  updateIsLoadingSol: (isLoading: boolean) => void;
};

export const useNftsStore = create<State & Action>((set) => ({
  mvxNfts: [],
  isLoadingMvx: false,
  solNfts: [],
  solBitzNfts: [],
  isLoadingSol: false,
  updateMvxNfts: (value: DataNft[]) => set(() => ({ mvxNfts: value })),
  updateIsLoadingMvx: (value: boolean) => set(() => ({ isLoadingMvx: value })),
  updateSolNfts: (value: DasApiAsset[]) => set(() => ({ solNfts: value })),
  updateSolBitzNfts: (value: DasApiAsset[]) => set(() => ({ solBitzNfts: value })),
  updateIsLoadingSol: (value: boolean) => set(() => ({ isLoadingSol: value })),
}));
