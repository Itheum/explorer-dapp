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

export const TRAILBLAZER_TOKENS =
  process.env.REACT_APP_ENV_NETWORK && process.env.REACT_APP_ENV_NETWORK === EnvironmentsEnum.devnet
    ? [
        { tokenIdentifier: "DATANFTFT-e0b917", nonce: 1 },
        // { tokenIdentifier: "DATANFTFT-e0b917", nonce: 423 },
        // { tokenIdentifier: "DATANFTFT-e0b917", nonce: 453 },
      ]
    : [{ tokenIdentifier: "DATANFTFT-e936d4", nonce: 1 }];
export const MULTIVERSX_BUBBLE_TOKENS =
  process.env.REACT_APP_ENV_NETWORK && process.env.REACT_APP_ENV_NETWORK === EnvironmentsEnum.devnet
    ? [
        // { tokenIdentifier: "DATANFTFT-e0b917", nonce: 416 },
        // { tokenIdentifier: "DATANFTFT-e0b917", nonce: 491 },
      ]
    : [{ tokenIdentifier: "DATANFTFT-e936d4", nonce: 2 }];
export const MULTIVERSX_INFOGRAPHICS_TOKENS =
  process.env.REACT_APP_ENV_NETWORK && process.env.REACT_APP_ENV_NETWORK === EnvironmentsEnum.devnet
    ? [
        { tokenIdentifier: "DATANFTFT-e0b917", nonce: 3 },
        // { tokenIdentifier: "DATANFTFT-e0b917", nonce: 476 },
        // { tokenIdentifier: "DATANFTFT-e0b917", nonce: 480 },
        // { tokenIdentifier: "DATANFTFT-e0b917", nonce: 490 },
      ]
    : [{ tokenIdentifier: "DATANFTFT-e936d4", nonce: 3 }];
export const NF_TUNES_TOKENS =
  process.env.REACT_APP_ENV_NETWORK && process.env.REACT_APP_ENV_NETWORK === EnvironmentsEnum.devnet
    ? [
        { tokenIdentifier: "DATANFTFT-e0b917", nonce: 2 },
        // { tokenIdentifier: "DATANFTFT-e0b917", nonce: 529 },
      ]
    : [{ tokenIdentifier: "DATANFTFT-e936d4", nonce: 4 }];

export const CC_SHOW_SIZE = 10;
export const PLAYSTATION_GAMER_PASSPORT_TOKENS = [
  // { tokenIdentifier: "DATANFTFT-e0b917", nonce: 379 },
  // { tokenIdentifier: "DATANFTFT-e0b917", nonce: 380 },
];
export const ESDT_BUBBLE_TOKENS = [
  // { tokenIdentifier: "DATANFTFT-e0b917", nonce: 417 }
];
export const EB_SHOW_SIZE = 10;

export const MARKETPLACE_DETAILS_PAGE =
  process.env.REACT_APP_ENV_NETWORK && process.env.REACT_APP_ENV_NETWORK === EnvironmentsEnum.devnet
    ? "https://test.datadex.itheum.io/datanfts/marketplace/"
    : "https://datadex.itheum.io/datanfts/marketplace/";

export const MAINNET_EXPLORER_ADDRESS = "https://explorer.multiversx.com";

export const SUPPORTED_COLLECTIONS =
  process.env.REACT_APP_ENV_NETWORK && process.env.REACT_APP_ENV_NETWORK === EnvironmentsEnum.devnet ? ["DATANFTFT-e0b917"] : ["DATANFTFT-e936d4"];

export const SUPPORTED_APPS =
  process.env.REACT_APP_ENV_NETWORK && process.env.REACT_APP_ENV_NETWORK === EnvironmentsEnum.devnet
    ? ["itheumtrailblazer", "multiversxbubbles", "esdtBubble", "playstationgamerpassport", "multiversxinfographics", "nftunes"]
    : ["itheumtrailblazer", "multiversxbubbles", "multiversxinfographics", "nftunes"];
