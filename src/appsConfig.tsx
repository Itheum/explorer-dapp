import { EnvironmentsEnum } from "libs/types";

export const IS_DEVNET = import.meta.env.VITE_ENV_NETWORK && import.meta.env.VITE_ENV_NETWORK === EnvironmentsEnum.devnet;

export type app_token = {
  tokenIdentifier: string;
  nonce: number;
};

export const TRAILBLAZER_TOKENS: app_token[] = IS_DEVNET
  ? [
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 1 },
      // { tokenIdentifier: "DATANFTFT-e0b917", nonce: 423 },
      // { tokenIdentifier: "DATANFTFT-e0b917", nonce: 453 },
    ]
  : [{ tokenIdentifier: "DATANFTFT-e936d4", nonce: 1 }];
export const MULTIVERSX_BUBBLE_TOKENS: app_token[] = IS_DEVNET
  ? [
      // { tokenIdentifier: "DATANFTFT-e0b917", nonce: 416 },
      // { tokenIdentifier: "DATANFTFT-e0b917", nonce: 491 },
    ]
  : [{ tokenIdentifier: "DATANFTFT-e936d4", nonce: 2 }];
export const MULTIVERSX_INFOGRAPHICS_TOKENS: app_token[] = IS_DEVNET
  ? [
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 3 },
      { tokenIdentifier: "COLNAMA-539838", nonce: 5 },
      // { tokenIdentifier: "DATANFTFT-e0b917", nonce: 476 },
      // { tokenIdentifier: "DATANFTFT-e0b917", nonce: 480 },
      // { tokenIdentifier: "DATANFTFT-e0b917", nonce: 490 },
    ]
  : [{ tokenIdentifier: "DATANFTFT-e936d4", nonce: 3 }];
export const FEATURED_NF_TUNES_TOKEN: app_token = IS_DEVNET
  ? { tokenIdentifier: "DATANFTFT-e0b917", nonce: 15 }
  : { tokenIdentifier: "DATANFTFT-e936d4", nonce: 4 };

export const NF_TUNES_TOKENS: app_token[] = IS_DEVNET
  ? [
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 15 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 2 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 10 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 34 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 42 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 56 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 48 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 131 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 134 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 138 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 187 },

      // { tokenIdentifier: "DATANFTFT-e0b917", nonce: 529 },
    ]
  : [{ tokenIdentifier: "DATANFTFT-e936d4", nonce: 4 }];
export const PLAYSTATION_GAMER_PASSPORT_TOKENS: app_token[] = [
  { tokenIdentifier: "DATANFTFT-e0b917", nonce: 24 },
  // { tokenIdentifier: "DATANFTFT-e0b917", nonce: 380 },
];
export const ESDT_BUBBLE_TOKENS: app_token[] = [
  // { tokenIdentifier: "DATANFTFT-e0b917", nonce: 417 }
];
export const TIMECAPSULE_TOKENS: app_token[] = IS_DEVNET
  ? [{ tokenIdentifier: "DATANFTFT-e0b917", nonce: 57 }]
  : [{ tokenIdentifier: "DATANFTFT-e936d4", nonce: 5 }];

export const SUPPORTED_APPS = IS_DEVNET
  ? ["itheumtrailblazer", "multiversxbubbles", "esdtBubble", "playstationgamerpassport", "multiversxinfographics", "nftunes", "timecapsule"]
  : ["itheumtrailblazer", "multiversxbubbles", "multiversxinfographics", "nftunes", "timecapsule"];
