import { EnvironmentsEnum } from "libs/types";

export const ELROND_NETWORK = process.env.REACT_APP_ENV_NETWORK || EnvironmentsEnum.devnet;
// Generate your own WalletConnect 2 ProjectId here: https://cloud.walletconnect.com/app
export const walletConnectV2ProjectId = process.env.REACT_APP_ENV_WALLETCONNECTV2_PROJECTID;

export const apiTimeout = 10_000; // 10s
export const TOOLS_API_URL = "https://tools.multiversx.com";
/**
 * Calls to these domains will use `nativeAuth` Baerer token
 */
export const sampleAuthenticatedDomains = [TOOLS_API_URL];

//////////////////////////////////////////////////////////////////////////////////////////////////
export const dAppName = "Itheum Explorer";

export const CC_SHOW_SIZE = 10;

export const EB_SHOW_SIZE = 10;

export const MARKETPLACE_DETAILS_PAGE =
  process.env.REACT_APP_ENV_NETWORK && process.env.REACT_APP_ENV_NETWORK === EnvironmentsEnum.devnet
    ? "https://test.datadex.itheum.io/datanfts/marketplace/"
    : "https://datadex.itheum.io/datanfts/marketplace/";

export const MAINNET_EXPLORER_ADDRESS = "https://explorer.multiversx.com";

export const SUPPORTED_COLLECTIONS =
  process.env.REACT_APP_ENV_NETWORK && process.env.REACT_APP_ENV_NETWORK === EnvironmentsEnum.devnet
    ? ["DATANFTFT-e0b917", "I3TICKER-03e5c2"]
    : ["DATANFTFT-e936d4"];
