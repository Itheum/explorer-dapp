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

export const CANTINA_CORNER_NONCES = [50, 51, 52];

export const TRAILBLAZER_NONCES = process.env.REACT_APP_ENV_NETWORK && process.env.REACT_APP_ENV_NETWORK === EnvironmentsEnum.devnet ? [407, 423, 453] : [1];
export const MULTIVERSX_BUBBLE_NONCES = process.env.REACT_APP_ENV_NETWORK && process.env.REACT_APP_ENV_NETWORK === EnvironmentsEnum.devnet ? [416, 491] : [2];
export const MULTIVERSX_INFOGRAPHICS_NONCES =
  process.env.REACT_APP_ENV_NETWORK && process.env.REACT_APP_ENV_NETWORK === EnvironmentsEnum.devnet ? [469, 476, 480, 490] : [3];
export const NF_TUNES_NONCES = [527, 529];

export const CC_SHOW_SIZE = 10;
export const GAMER_PASSPORT_GAMER_NONCES = [12];
export const PLAYSTATION_GAMER_PASSPORT_NONCES = [379, 380];
export const ESDT_BUBBLE_NONCES = [417];
export const EB_SHOW_SIZE = 10;

export const MARKETPLACE_DETAILS_PAGE =
  process.env.REACT_APP_ENV_NETWORK && process.env.REACT_APP_ENV_NETWORK === EnvironmentsEnum.devnet
    ? "https://stg.datadex.itheum.io/datanfts/marketplace/"
    : "https://datadex.itheum.io/datanfts/marketplace/";

export const MAINNET_EXPLORER_ADDRESS = "https://explorer.multiversx.com";

export const SUPPORTED_APPS =
  process.env.REACT_APP_ENV_NETWORK && process.env.REACT_APP_ENV_NETWORK === EnvironmentsEnum.devnet
    ? ["itheumtrailblazer", "multiversxbubbles", "esdtBubble", "playstationgamerpassport", "multiversxinfographics", "nftunes"]
    : ["itheumtrailblazer", "multiversxbubbles", "multiversxinfographics"];
