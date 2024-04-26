import { EnvironmentsEnum } from "libs/types";

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
}

export function getCreatorCampaigns() {
  const allCreatorCampaigns: GiveBitzCreatorCampaign[] = [];

  if (import.meta.env.VITE_ENV_NETWORK && import.meta.env.VITE_ENV_NETWORK === EnvironmentsEnum.devnet) {
    allCreatorCampaigns.push({
      creatorAddress: "erd1xdq4d7uewptx9j9k23aufraklda9leumqc7eu3uezt2kf4fqxz2sex2rxl",
      campaignId: "c1",
      campaignStartTs: 1712713989,
      campaignEndTs: 1715305989,
      campaignPerks: "Top 20 Leaderboard gets my latest Data NFT. 10 Data NFTs to be dropped to random winners of top 100 Leaderboard.",
    });

    allCreatorCampaigns.push({
      creatorAddress: "erd1qmsq6ej344kpn8mc9xfngjhyla3zd6lqdm4zxx6653jee6rfq3ns3fkcc7",
      campaignId: "c2",
      campaignStartTs: 1712713989,
      campaignEndTs: 1715305989,
      campaignPerks: "Top 20 Leaderboard gets my latest Data NFT. 10 Data NFTs to be dropped to random winners of top 100 Leaderboard.",
    });

    allCreatorCampaigns.push({
      creatorAddress: "erd16vjhrga4yjpy88lwnu64wlxlapwxtvjl93jax4rg3yq3hzxtnausdmhcjf",
      campaignId: "c3",
      campaignStartTs: 1712713989,
      campaignEndTs: 1715305989,
      campaignPerks: "Top 20 Leaderboard gets my latest Data NFT. 10 Data NFTs to be dropped to random winners of top 100 Leaderboard.",
    });

    allCreatorCampaigns.push({
      creatorAddress: "erd1xdq4d7uewptx9j9k23aufraklda9leumqc7eu3uezt2kf4fqxz2sex2rxl",
      campaignId: "c4",
      campaignStartTs: 1712713989,
      campaignEndTs: 1715305989,
      campaignPerks: "Top 20 Leaderboard gets my latest Data NFT. 10 Data NFTs to be dropped to random winners of top 100 Leaderboard.",
    });

    return allCreatorCampaigns;
  } else {
    return allCreatorCampaigns;
  }
}

export function getDataBounties() {
  const allBounties: GiveBitzDataBounty[] = [];

  if (import.meta.env.VITE_ENV_NETWORK && import.meta.env.VITE_ENV_NETWORK === EnvironmentsEnum.devnet) {
    allBounties.push({
      bountySubmitter: "erd1xdq4d7uewptx9j9k23aufraklda9leumqc7eu3uezt2kf4fqxz2sex2rxl",
      bountyId: "b1",
      title: "Top 50 addresses of daily ITHEUM flippers",
      summary: "A dynamic Data NFT which can be opened to find the top 50 flippers of ITHEUM tokens",
      readMoreLink: "https://docs.itheum.io/data-bounties/top-itheum-flippers",
      submittedOnTs: 1712713989,
      fillPerks: "Top 20 Leaderboard gets Data NFT once bounty launches. 10 Data NFTs to be dropped to random winners of top 100 Leaderboard.",
    });

    allBounties.push({
      bountySubmitter: "erd1xdq4d7uewptx9j9k23aufraklda9leumqc7eu3uezt2kf4fqxz2sex2rxl",
      bountyId: "b2",
      title: "Top 50 addresses of daily RIDE flippers",
      summary: "A dynamic Data NFT which can be opened to find the top 50 flippers of RIDE tokens",
      readMoreLink: "https://docs.itheum.io/data-bounties/top-ride-flippers",
      submittedOnTs: 1712713989,
      fillPerks: "Top 20 Leaderboard gets Data NFT once bounty launches. 10 Data NFTs to be dropped to random winners of top 100 Leaderboard.",
    });

    allBounties.push({
      bountySubmitter: "erd1qmsq6ej344kpn8mc9xfngjhyla3zd6lqdm4zxx6653jee6rfq3ns3fkcc7",
      bountyId: "b3",
      title: "Top 50 addresses of daily EGLD flippers",
      summary: "A dynamic Data NFT which can be opened to find the top 50 flippers of EGLD tokens",
      readMoreLink: "https://docs.itheum.io/data-bounties/top-egld-flippers",
      submittedOnTs: 1712713989,
      fillPerks: "Top 20 Leaderboard gets Data NFT once bounty launches. 10 Data NFTs to be dropped to random winners of top 100 Leaderboard.",
    });

    allBounties.push({
      bountySubmitter: "erd16vjhrga4yjpy88lwnu64wlxlapwxtvjl93jax4rg3yq3hzxtnausdmhcjf",
      bountyId: "b4",
      title: "Top 50 addresses of daily ASH flippers",
      summary: "A dynamic Data NFT which can be opened to find the top 50 flippers of ASH tokens",
      readMoreLink: "https://docs.itheum.io/data-bounties/top-ash-flippers",
      submittedOnTs: 1712713989,
      fillPerks: "Top 20 Leaderboard gets Data NFT once bounty launches. 10 Data NFTs to be dropped to random winners of top 100 Leaderboard.",
    });

    return allBounties;
  } else {
    return allBounties;
  }
}
