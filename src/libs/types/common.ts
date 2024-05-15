import { ViewDataReturnType } from "@itheum/sdk-mx-data-nft";

export enum BlobDataType {
  TEXT,
  IMAGE,
  AUDIO,
  SVG,
  PDF,
  VIDEO,
}

export interface ExtendedViewDataReturnType extends ViewDataReturnType {
  blobDataType: BlobDataType;
}

export interface TrendingNft {
  uuid: string;
  tokenIdentifier: string;
  rating: number;
}
export interface NftMedia {
  url: string;
  originalUrl: string;
  thumbnailUrl: string;
  fileType: string;
  fileSize: number;
}
