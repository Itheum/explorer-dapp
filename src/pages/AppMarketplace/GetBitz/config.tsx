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
      bountyId: "b11",
      title: "Top 50 addresses of daily ITHEUM flippers",
      summary: "A dynamic Data NFT which can be opened to find the top 50 flippers of ITHEUM tokens",
      readMoreLink: "https://docs.itheum.io/data-bounties/top-itheum-flippers",
      submittedOnTs: 1712713989,
      fillPerks: "Top 20 Leaderboard gets Data NFT once bounty launches. 10 Data NFTs to be dropped to random winners of top 100 Leaderboard.",
    });

    allBounties.push({
      bountySubmitter: "erd1xdq4d7uewptx9j9k23aufraklda9leumqc7eu3uezt2kf4fqxz2sex2rxl",
      bountyId: "b21",
      title: "Top 50 addresses of daily RIDE flippers",
      summary: "A dynamic Data NFT which can be opened to find the top 50 flippers of RIDE tokens",
      readMoreLink: "https://docs.itheum.io/data-bounties/top-ride-flippers",
      submittedOnTs: 1712713989,
      fillPerks: "Top 20 Leaderboard gets Data NFT once bounty launches. 10 Data NFTs to be dropped to random winners of top 100 Leaderboard.",
    });
    allBounties.push({
      bountySubmitter: "erd1lgyz209038gh8l2zfxq68kzl9ljz0p22hv6l0ev8fydhx8s9cwasdtrua2",
      bountyId: "b1",
      title: "DNB Music DataNFT",
      summary:
        "Craft a Music Data NFT featuring a dynamic playlist of at least 3 songs. The playlist can evolve over time based on community input. AI utilization is allowed as long as the content generated complies with the Terms of Use.",
      readMoreLink: "",
      submittedOnTs: 1714138439,
      fillPerks:
        "The Creator of the bounty will receive 5 copies of the album.\n The top 5 contributors on the GiveBiTz leaderboard for this bounty will each receive 3 copies.\n Contributors ranked 6th to 20th will receive 2 copies each.\n Contributors ranked 21st to 50th will receive 1 copy each.\n Additionally, 5 lucky winners from the top 51 to 100 contributors will each receive 1 copy.\n 50 copies donated to BiTz Monthly Leaderboard",
    });
    allBounties.push({
      bountySubmitter: "erd1lgyz209038gh8l2zfxq68kzl9ljz0p22hv6l0ev8fydhx8s9cwasdtrua2",
      bountyId: "b2",
      title: "Hip-Hop Music DataNFT",
      summary: "Craft a Music Data NFT featuring a dynamic playlist of at least 3 songs. The playlist can evolve over time based on community input.",
      readMoreLink: "https://docs.itheum.io/data-bounties/top-ride-flippers",
      submittedOnTs: 1714138439,
      fillPerks:
        "The Creator of the bounty will receive 5 copies of the album.\n The top 5 contributors on the GiveBiTz leaderboard for this bounty will each receive 3 copies.\n Contributors ranked 6th to 20th will receive 2 copies each.\n Contributors ranked 21st to 50th will receive 1 copy each.\n Additionally, 5 lucky winners from the top 51 to 100 contributors will each receive 1 copy.\n 50 copies donated to BiTz Monthly Leaderboard",
    });
    allBounties.push({
      bountySubmitter: "erd108t4gdwdhwx2xhj5q0e6pujurk0kdyzxxh69987e873n83xumazshe0l3r",
      bountyId: "b3",
      title: "$BOBER flippers",
      summary:
        "Create a dynamic visual map of everyone flipping $BOBER. Each address should be represented as a Bubble, and the bubble increases every time the address sells $BOBER.\n The dynamic map can show the top 150/250/500 flippers as a starting point and evolve into more numbers over time.\n",
      readMoreLink: "",
      submittedOnTs: 1714138439,
      fillPerks:
        "The Creator of the bounty will receive 5 copies of the album.\n The top 5 contributors on the GiveBiTz leaderboard for this bounty will each receive 3 copies.\n Contributors ranked 6th to 20th will receive 2 copies each.\n Contributors ranked 21st to 50th will receive 1 copy each.\n Additionally, 5 lucky winners from the top 51 to 100 contributors will each receive 1 copy.\n 50 copies donated to BiTz Monthly Leaderboard",
    });
    allBounties.push({
      bountySubmitter: "erd108t4gdwdhwx2xhj5q0e6pujurk0kdyzxxh69987e873n83xumazshe0l3r",
      bountyId: "b4",
      title: "ESDT flippers",
      summary:
        "Create a dynamic visual map of everyone flipping any ESDT tokens. Each address should be represented as a Bubble, and the bubble increases every time the address sells ESDT.\n The dynamic map can show the top 150/250/500 flippers as a starting point and evolve into more numbers over time.\n",
      readMoreLink: "",
      submittedOnTs: 1714138439,
      fillPerks:
        "The Creator of the bounty will receive 5 copies of the album.\n The top 5 contributors on the GiveBiTz leaderboard for this bounty will each receive 3 copies.\n Contributors ranked 6th to 20th will receive 2 copies each.\n Contributors ranked 21st to 50th will receive 1 copy each.\n Additionally, 5 lucky winners from the top 51 to 100 contributors will each receive 1 copy.\n 50 copies donated to BiTz Monthly Leaderboard",
    });
    allBounties.push({
      bountySubmitter: "erd1mvuj03mcvrpc48nhnkptdjkx9xwm65jadxgy500m293vvkqkkutqgfm24d",
      bountyId: "b5",
      title: "MultiversX Meme vs Other Major Blockchain Meme Coin Activity",
      summary:
        "hain vs other major Blockchain ecosystems. The activity can include volumes per day, total unique holders, and any other valuable metrics that show “activity”Create a dynamic visual map that compares the Meme Coin activity in the MultiversX blockchain vs other major Blockchain ecosystems. The activity can include volumes per day, total unique holders, and any other valuable metrics that show “activity”",
      readMoreLink: "",
      submittedOnTs: 1714138439,
      fillPerks:
        "The Creator of the bounty will receive 5 copies of the album.\n The top 5 contributors on the GiveBiTz leaderboard for this bounty will each receive 3 copies.\n Contributors ranked 6th to 20th will receive 2 copies each.\n Contributors ranked 21st to 50th will receive 1 copy each.\n Additionally, 5 lucky winners from the top 51 to 100 contributors will each receive 1 copy.\n 50 copies donated to BiTz Monthly Leaderboard",
    });
    return allBounties;
  } else {
    allBounties.push({
      bountySubmitter: "erd1lgyz209038gh8l2zfxq68kzl9ljz0p22hv6l0ev8fydhx8s9cwasdtrua2",
      bountyId: "b1",
      title: "DNB Music DataNFT",
      summary:
        "Craft a Music Data NFT featuring a dynamic playlist of at least 3 songs. The playlist can evolve over time based on community input. AI utilization is allowed as long as the content generated complies with the Terms of Use.",
      readMoreLink: "",
      submittedOnTs: 1714138439,
      fillPerks:
        "The Creator of the bounty will receive 5 copies of the album.\n The top 5 contributors on the GiveBiTz leaderboard for this bounty will each receive 3 copies.\n Contributors ranked 6th to 20th will receive 2 copies each.\n Contributors ranked 21st to 50th will receive 1 copy each.\n Additionally, 5 lucky winners from the top 51 to 100 contributors will each receive 1 copy.\n 50 copies donated to BiTz Monthly Leaderboard",
    });
    allBounties.push({
      bountySubmitter: "erd1lgyz209038gh8l2zfxq68kzl9ljz0p22hv6l0ev8fydhx8s9cwasdtrua2",
      bountyId: "b2",
      title: "Hip-Hop Music DataNFT",
      summary: "Craft a Music Data NFT featuring a dynamic playlist of at least 3 songs. The playlist can evolve over time based on community input.",
      readMoreLink: "",
      submittedOnTs: 1714138439,
      fillPerks:
        "The Creator of the bounty will receive 5 copies of the album.\n The top 5 contributors on the GiveBiTz leaderboard for this bounty will each receive 3 copies.\n Contributors ranked 6th to 20th will receive 2 copies each.\n Contributors ranked 21st to 50th will receive 1 copy each.\n Additionally, 5 lucky winners from the top 51 to 100 contributors will each receive 1 copy.\n 50 copies donated to BiTz Monthly Leaderboard",
    });
    allBounties.push({
      bountySubmitter: "erd108t4gdwdhwx2xhj5q0e6pujurk0kdyzxxh69987e873n83xumazshe0l3r",
      bountyId: "b3",
      title: "$BOBER flippers",
      summary:
        "Create a dynamic visual map of everyone flipping $BOBER. Each address should be represented as a Bubble, and the bubble increases every time the address sells $BOBER.\n The dynamic map can show the top 150/250/500 flippers as a starting point and evolve into more numbers over time.\n",
      readMoreLink: "",
      submittedOnTs: 1714138439,
      fillPerks:
        "The Creator of the bounty will receive 5 copies of the album.\n The top 5 contributors on the GiveBiTz leaderboard for this bounty will each receive 3 copies.\n Contributors ranked 6th to 20th will receive 2 copies each.\n Contributors ranked 21st to 50th will receive 1 copy each.\n Additionally, 5 lucky winners from the top 51 to 100 contributors will each receive 1 copy.\n 50 copies donated to BiTz Monthly Leaderboard",
    });
    allBounties.push({
      bountySubmitter: "erd108t4gdwdhwx2xhj5q0e6pujurk0kdyzxxh69987e873n83xumazshe0l3r",
      bountyId: "b4",
      title: "ESDT flippers",
      summary:
        "Create a dynamic visual map of everyone flipping any ESDT tokens. Each address should be represented as a Bubble, and the bubble increases every time the address sells ESDT.\n The dynamic map can show the top 150/250/500 flippers as a starting point and evolve into more numbers over time.\n",
      readMoreLink: "",
      submittedOnTs: 1714138439,
      fillPerks:
        "The Creator of the bounty will receive 5 copies of the album.\n The top 5 contributors on the GiveBiTz leaderboard for this bounty will each receive 3 copies.\n Contributors ranked 6th to 20th will receive 2 copies each.\n Contributors ranked 21st to 50th will receive 1 copy each.\n Additionally, 5 lucky winners from the top 51 to 100 contributors will each receive 1 copy.\n 50 copies donated to BiTz Monthly Leaderboard",
    });
    allBounties.push({
      bountySubmitter: "erd1mvuj03mcvrpc48nhnkptdjkx9xwm65jadxgy500m293vvkqkkutqgfm24d",
      bountyId: "b5",
      title: "MultiversX Meme vs Other Major Blockchain Meme Coin Activity",
      summary:
        "Create a dynamic visual map that compares the Meme Coin activity in the MultiversX blockchain vs other major Blockchain ecosystems. The activity can include volumes per day, total unique holders, and any other valuable metrics that show “activity”",
      readMoreLink: "",
      submittedOnTs: 1714138439,
      fillPerks:
        "The Creator of the bounty will receive 5 copies of the album.\n The top 5 contributors on the GiveBiTz leaderboard for this bounty will each receive 3 copies.\n Contributors ranked 6th to 20th will receive 2 copies each.\n Contributors ranked 21st to 50th will receive 1 copy each.\n Additionally, 5 lucky winners from the top 51 to 100 contributors will each receive 1 copy.\n 50 copies donated to BiTz Monthly Leaderboard",
    });
    allBounties.push({
      bountySubmitter: "erd1622wqsnpdkwhzr3nxfv0673pdt2cvqq7ffjw9mvlpju9822dac6sarqw2d",
      bountyId: "b6",
      title: "DUB-REGGAE Music DataNFT",
      summary:
        "Craft a Music Data NFT featuring a dynamic playlist of at least 3 songs. Heavy weight bass like the artists: O.B.F, King Alpha, Alpha Step, Radikal Guru, Indica Dubs, Vibronics.",
      readMoreLink: "",
      submittedOnTs: 1714138439,
      fillPerks:
        "The creator of the bounty will receive 5 copies of the album.\n The top 3 contributors on the GiveBiTz leaderboard for this bounty will each receive 3 copies.\n Contributors ranked 4th and 5th will receive 2 copies each.\n Contributors ranked 6th to 20th will receive 1 copy each.\n Additionally, 12 lucky winners from the top 21 to 100 contributors will each receive 1 copy.\n 30 copies donated to BiTz Monthly Leaderboard",
    });
    allBounties.push({
      bountySubmitter: "erd1x4xtwphcnx254gc0c3yuur98vyveh4s99se45qvqmugcgu27ahjsuvf95r",
      bountyId: "b7",
      title: "Educational content about data ownership",
      summary:
        "Craft  a data NFT showing the importance of data in the web3 era. This will be a series of articles showing why we need to claim ownership of our data.",
      readMoreLink: "",
      submittedOnTs: 1714138439,
      fillPerks:
        "The Creator of the bounty will receive 5 copies.\n The top 5 contributors on the GiveBiTz leaderboard for this bounty will each receive 3 copies.\n Contributors ranked 6th to 20th will receive 2 copies each.\n Contributors ranked 21st to 50th will receive 1 copy each.\n Additionally, 5 lucky winners from the top 51 to 100 contributors will each receive 1 copy.\n 50 copies donated to BiTz Monthly Leaderboard",
    });
    return allBounties;
  }
}
