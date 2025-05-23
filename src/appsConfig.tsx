import { EnvironmentsEnum } from "libs/types";

export const IS_DEVNET = import.meta.env.VITE_ENV_NETWORK && import.meta.env.VITE_ENV_NETWORK === EnvironmentsEnum.devnet;

export type app_token = {
  tokenIdentifier: string;
  nonce: number;
};

export const TRAILBLAZER_TOKENS: app_token[] = IS_DEVNET
  ? [
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 1 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 266 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 350 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 351 },
    ]
  : [{ tokenIdentifier: "DATANFTFT-e936d4", nonce: 1 }];

export const MULTIVERSX_BUBBLE_TOKENS: app_token[] = IS_DEVNET ? [] : [{ tokenIdentifier: "DATANFTFT-e936d4", nonce: 2 }];

export const MULTIVERSX_INFOGRAPHICS_TOKENS: app_token[] = IS_DEVNET
  ? [
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 3 },
      { tokenIdentifier: "COLNAMA-539838", nonce: 5 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 454 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 648 },
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
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 295 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 299 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 301 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 324 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 326 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 357 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 552 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 597 },
      ...Array.from({ length: 4 }, (_, i) => ({ tokenIdentifier: "OASMUSICPL-47b186", nonce: i })),
      ...Array.from({ length: 19 }, (_, i) => ({ tokenIdentifier: "FOOWLDMSC-5ee8ec", nonce: i })),
    ]
  : [
      { tokenIdentifier: "DATANFTFT-e936d4", nonce: 4 },
      { tokenIdentifier: "DATANFTFT-e936d4", nonce: 9 },
      { tokenIdentifier: "DATANFTFT-e936d4", nonce: 10 },
      { tokenIdentifier: "DATANFTFT-e936d4", nonce: 11 },
      { tokenIdentifier: "DATANFTFT-e936d4", nonce: 15 },
      { tokenIdentifier: "DATANFTFT-e936d4", nonce: 174 },
      { tokenIdentifier: "DATANFTFT-e936d4", nonce: 213 },
      { tokenIdentifier: "DATANFTFT-e936d4", nonce: 237 },
      ...Array.from({ length: 91 }, (_, i) => ({ tokenIdentifier: "DFEE-72425b", nonce: i })),
    ];

export const NF_PODCAST_TOKENS: app_token[] = IS_DEVNET
  ? [{ tokenIdentifier: "DATANFTFT-e0b917", nonce: 357 }]
  : [{ tokenIdentifier: "DATANFTFT-e936d4", nonce: 12 }];

export const PLAYSTATION_GAMER_PASSPORT_TOKENS: app_token[] = [{ tokenIdentifier: "DATANFTFT-e0b917", nonce: 24 }];

export const TIMECAPSULE_TOKENS: app_token[] = IS_DEVNET
  ? [
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 57 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 266 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 350 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 351 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 624 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 625 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 629 },
    ]
  : [
      { tokenIdentifier: "DATANFTFT-e936d4", nonce: 5 },
      { tokenIdentifier: "DATANFTFT-e936d4", nonce: 196 },
    ];

export const TIMECAPSULE_XDAY_TOKENS: app_token[] = IS_DEVNET
  ? [{ tokenIdentifier: "DATANFTFT-e0b917", nonce: 629 }]
  : [{ tokenIdentifier: "DATANFTFT-e936d4", nonce: 196 }];

export const BOBER_GAME_ROOM_TOKENS: app_token[] = IS_DEVNET
  ? [
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 218 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 230 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 255 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 257 },
    ]
  : [{ tokenIdentifier: "DATANFTFT-e936d4", nonce: 8 }];

export const SPREADSHEET_NFTS_TOKENS: app_token[] = IS_DEVNET
  ? [
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 352 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 353 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 354 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 354 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 608 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 610 },
      { tokenIdentifier: "DATANFTFT-e0b917", nonce: 611 },
    ]
  : [
      { tokenIdentifier: "DATANFTFT-e936d4", nonce: 185 },
      { tokenIdentifier: "MICIMUSTAR-1920e7", nonce: 1 },
    ];

export const GET_BITZ_TOKEN_MVX: app_token = IS_DEVNET
  ? { tokenIdentifier: "DATANFTFT-e0b917", nonce: 198 }
  : { tokenIdentifier: "DATANFTFT-e936d4", nonce: 7 };

export const SUPPORTED_APPS = IS_DEVNET
  ? [
      "itheumtrailblazer",
      "multiversxbubbles",
      "esdtBubble",
      "playstationgamerpassport",
      "multiversxinfographics",
      "nftunes",
      "deepforestmusic",
      "timecapsule",
      "timecapsulexday",
      "getbitz",
      "bobergameroom",
      "spreadsheetnfts",
      "nfpodcast",
    ]
  : ["itheumtrailblazer", "nftunes", "deepforestmusic", "timecapsule", "timecapsulexday", "getbitz", "spreadsheetnfts", "nfpodcast"];
