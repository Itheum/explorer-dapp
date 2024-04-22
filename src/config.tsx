import { IS_DEVNET } from "appsConfig";
import { EnvironmentsEnum } from "libs/types";

export const ELROND_NETWORK = import.meta.env.VITE_ENV_NETWORK || EnvironmentsEnum.devnet;
// Generate your own WalletConnect 2 ProjectId here: https://cloud.walletconnect.com/app
export const walletConnectV2ProjectId = import.meta.env.VITE_ENV_WALLETCONNECTV2_PROJECTID;

export const apiTimeout = 10_000; // 10s
export const TOOLS_API_URL = "https://tools.multiversx.com";

export const dAppName = "Itheum Explorer";

export const SHOW_NFTS_STEP = 10;

export const MARKETPLACE_DETAILS_PAGE = IS_DEVNET ? "https://test.datadex.itheum.io/datanfts/marketplace/" : "https://datadex.itheum.io/datanfts/marketplace/";

export const MAINNET_EXPLORER_ADDRESS = "https://explorer.multiversx.com";

export const SUPPORTED_COLLECTIONS = IS_DEVNET
  ? ["DATANFTFT-e0b917", "I3TICKER-03e5c2", "COLNAMA-539838", "DNFTPHMA-9e2b1c", "OASISMUSIC-9b3433", "OASMUSICPL-47b186"]
  : ["DATANFTFT-e936d4"];
