export enum BlobDataType {
  TEXT,
  IMAGE,
  AUDIO,
  SVG,
  PDF,
  VIDEO,
}

export interface TrendingNft {
  uuid: string;
  tokenIdentifier: string;
  rating: number;
}
