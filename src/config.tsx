import { EnvironmentsEnum } from "libs/types";

export const ELROND_NETWORK =
  process.env.REACT_APP_ENV_NETWORK || EnvironmentsEnum.devnet;
// Generate your own WalletConnect 2 ProjectId here: https://cloud.walletconnect.com/app
export const walletConnectV2ProjectId =
  process.env.REACT_APP_ENV_WALLETCONNECTV2_PROJECTID;

export const apiTimeout = 10_000; // 10s
export const TOOLS_API_URL = "https://tools.multiversx.com";
/**
 * Calls to these domains will use `nativeAuth` Baerer token
 */
export const sampleAuthenticatedDomains = [TOOLS_API_URL];

//////////////////////////////////////////////////////////////////////////////////////////////////
export const dAppName = "Itheum Explorer";

export const CANTINA_CORNER_NONCES = [50, 51, 52];
export const TRAILBLAZER_NONCES = [407, 423];
export const CC_SHOW_SIZE = 10;
export const GAMER_PASSPORT_GAMER_NONCES = [12];
export const PLAYSTATION_GAMER_PASSPORT_NONCES = [379, 380];

export const MARKETPLACE_DETAILS_PAGE =
  process.env.REACT_APP_ENV_NETWORK &&
  process.env.REACT_APP_ENV_NETWORK === EnvironmentsEnum.devnet
    ? "https://stg.datadex.itheum.io/datanfts/marketplace/"
    : "https://datadex.itheum.io/datanfts/marketplace/";
