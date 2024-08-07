export interface GiveBitzCreatorCampaign {
  creatorAddress: string;
  campaignId: string;
  campaignStartTs: number;
  campaignEndTs: number;
  campaignPerks: string;
}

export interface GiveBitzDataBounty {
  bountySubmitter: string;
  bountyId: string;
  title: string;
  summary: string;
  readMoreLink: string;
  submittedOnTs: number;
  fillPerks: string;
  receivedBitzSum?: number;
  giverCounts?: number;
  finalizedDataNftIdentifier?: string;
  finalized?: boolean;
}

export interface LeaderBoardItemType {
  playerAddr: string;
  bits: number;
}

export interface LeaderBoardGiverItemType {
  giverAddr: string;
  bits: number;
}

export interface BonusBitzHistoryItemType {
  on: number;
  reward: number;
  amount: number;
}

export interface GiverLeaderboardProps {
  bountySubmitter: string;
  bountyId: string;
  fetchGetterLeaderBoard: any;
  showUserPosition: boolean;
}

export type PowerUpBountyProps = {
  bounty: GiveBitzDataBounty;
  sendPowerUp: any;
  fetchGivenBitsForGetter: any;
  fetchGetterLeaderBoard: any;
  isSendingPowerUp: boolean;
  setIsSendingPowerUp: any;
};

export interface GiveBitzLowerCardProps {
  bountySubmitter: string;
  bountyId: string;
  sendPowerUp: (args: { bitsVal: number; bitsToWho: string; bitsToCampaignId: string; isNewGiver: number }) => Promise<boolean>;
  fetchGivenBitsForGetter: (args: { getterAddr: string; campaignId: string }) => Promise<number>;
  fetchGetterLeaderBoard: () => void;
  isSendingPowerUp: boolean;
  setIsSendingPowerUp: any;
}

export const BIT_GAME_WINDOW_HOURS = "6"; // how often we can play the game, need to match logic inside Data NFT
export const BIT_GAME_TOP_LEADER_BOARD_GROUP = "5"; // top X leaderboard winners for the monthly price
