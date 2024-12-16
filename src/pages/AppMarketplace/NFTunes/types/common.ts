export interface GiftBitzToArtistMeta {
  bountyId: string;
  creatorWallet: string;
  albums: Array<{
    bountyId: string;
    // Add other album properties if needed
  }>;
}
