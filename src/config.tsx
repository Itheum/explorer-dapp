import { IS_DEVNET } from "appsConfig";
import exp from "constants";
import { EnvironmentsEnum } from "libs/types";

export const ELROND_NETWORK = import.meta.env.VITE_ENV_NETWORK || EnvironmentsEnum.devnet;
// Generate your own WalletConnect 2 ProjectId here: https://cloud.walletconnect.com/app
export const walletConnectV2ProjectId = import.meta.env.VITE_ENV_WALLETCONNECTV2_PROJECTID;

export const apiTimeout = 10_000; // 10s
export const TOOLS_API_URL = "https://tools.multiversx.com";

export const dAppName = "Itheum Explorer";

export const SHOW_NFTS_STEP = 10;

export const MARKETPLACE_DETAILS_PAGE = IS_DEVNET ? "https://test.datadex.itheum.io/datanfts/marketplace/" : "https://datadex.itheum.io/datanfts/marketplace/";

export const DRIP_PAGE = "https://drip.haus/itheum";

export const CREATOR_PROFILE_PAGE =
  import.meta.env.VITE_ENV_NETWORK && import.meta.env.VITE_ENV_NETWORK === EnvironmentsEnum.devnet
    ? "https://test.datadex.itheum.io/profile/"
    : "https://datadex.itheum.io/profile/";

export const MAINNET_MVX_EXPLORER_ADDRESS = "https://explorer.multiversx.com";

export const MAINNET_SOL_EXPLORER_ADDRESS = "https://explorer.solana.com/";

export const SUPPORTED_MVX_COLLECTIONS = IS_DEVNET
  ? ["DATANFTFT-e0b917", "DNFTPHMA-9e2b1c", "OASISMUSIC-9b3433", "OASMUSICPL-47b186", "FOOWLDMSC-5ee8ec"]
  : ["DATANFTFT-e936d4", "DFEE-72425b"];

export const SUPPORTED_SOL_COLLECTIONS = IS_DEVNET
  ? ["6MgvQSDUU3Z2a5MQqPeStUyCo1AXrB8xJhyBc8YYH3uk", "6uXqBZLNdp3dT1wgJYHCXjCs36WWLThdQkKUeqdTT7ni"]
  : ["me2Sj97xewgEodSCRs31jFEyA1m3FQFzziqVXK9SVHX"];

export const MARSHAL_CACHE_DURATION_SECONDS = import.meta.env.MARSHAL_CACHE_DURATION_SECONDS || 300; // 5 minutes

export enum SOL_ENV_ENUM {
  devnet = "SD",
  mainnet = "S1",
}

export enum MVX_ENV_ENUM {
  devnet = "ED",
  mainnet = "E1",
}
