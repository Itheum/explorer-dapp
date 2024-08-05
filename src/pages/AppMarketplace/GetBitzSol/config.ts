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
  receivedBitzSum?: number;
  giverCounts?: number;
  finalizedDataNftIdentifier?: string;
  finalized?: boolean;
}

export function getCreatorCampaigns() {
  const allCreatorCampaigns: GiveBitzCreatorCampaign[] = [];

  if (process.env.NEXT_PUBLIC_ENV_NETWORK === EnvironmentsEnum.devnet) {
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

  if (process.env.NEXT_PUBLIC_ENV_NETWORK === EnvironmentsEnum.devnet) {
    allBounties.push({
      bountySubmitter: "3ibP6nxaKocQPA8S5ntXSo1Xd4aYSa93QKjPzDaPqAmB",
      bountyId: "b20",
      title: "Alpha Gamer Passport",
      summary: `Create a Data NFT which can be used by gamers as a Data Vault in order to crowdsource their data for the AI industry and generate revenue for the data they share.`,
      readMoreLink: "",
      submittedOnTs: 1718622020,
      fillPerks: `Donate +100 BiTz to be eligible for the first drop of the Gamer Passport Data NFT.`,
    });
    allBounties.push({
      bountySubmitter: "3ibP6nxaKocQPA8S5ntXSo1Xd4aYSa93QKjPzDaPqAmB",
      bountyId: "b1",
      title: "Dummy Bounty - SOL Address",
      summary: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dignissim ipsum diam, a placerat velit cursus ut. Nulla ac finibus nulla. Curabitur elementum fermentum lorem, sed porta ipsum molestie in. Praesent congue nisl eu dolor dignissim porta.`,
      readMoreLink: "",
      submittedOnTs: 1718877864,
      fillPerks: `Maecenas a tortor sit amet neque tristique tincidunt placerat et odio.`,
    });
    allBounties.push({
      bountySubmitter: "erd1622wqsnpdkwhzr3nxfv0673pdt2cvqq7ffjw9mvlpju9822dac6sarqw2d",
      bountyId: "b2",
      title: "Dummy Bounty - ERD Address",
      summary: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dignissim ipsum diam, a placerat velit cursus ut. Nulla ac finibus nulla. Curabitur elementum fermentum lorem, sed porta ipsum molestie in. Praesent congue nisl eu dolor dignissim porta.`,
      readMoreLink: "",
      submittedOnTs: 1718877864,
      fillPerks: `Maecenas a tortor sit amet neque tristique tincidunt placerat et odio.`,
    });
    allBounties.push({
      bountySubmitter: "0xF8E2166774A02f21471568752E9F863B0E697a7b",
      bountyId: "b3",
      title: "Dummy Bounty - ETH Address",
      summary: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dignissim ipsum diam, a placerat velit cursus ut. Nulla ac finibus nulla. Curabitur elementum fermentum lorem, sed porta ipsum molestie in. Praesent congue nisl eu dolor dignissim porta.`,
      readMoreLink: "",
      submittedOnTs: 1718877864,
      fillPerks: `Maecenas a tortor sit amet neque tristique tincidunt placerat et odio.`,
    });
    allBounties.push({
      bountySubmitter: "TOBEFILLED",
      bountyId: "b4",
      title: "Dummy Bounty - Filler Address",
      summary: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dignissim ipsum diam, a placerat velit cursus ut. Nulla ac finibus nulla. Curabitur elementum fermentum lorem, sed porta ipsum molestie in. Praesent congue nisl eu dolor dignissim porta.`,
      readMoreLink: "",
      submittedOnTs: 1718877864,
      fillPerks: `Maecenas a tortor sit amet neque tristique tincidunt placerat et odio.`,
    });
    return allBounties;
  } else {
    allBounties.push({
      bountySubmitter: "3ibP6nxaKocQPA8S5ntXSo1Xd4aYSa93QKjPzDaPqAmB",
      bountyId: "b20",
      title: "Alpha Gamer Passport",
      summary: `Create a Data NFT which can be used by gamers as a Data Vault in order to crowdsource their data for the AI industry and generate revenue for the data they share.`,
      readMoreLink: "",
      submittedOnTs: 1718622020,
      fillPerks: `Donate +100 BiTz to be eligible for the first drop of the Gamer Passport Data NFT.`,
    });
    allBounties.push({
      bountySubmitter: "erd1622wqsnpdkwhzr3nxfv0673pdt2cvqq7ffjw9mvlpju9822dac6sarqw2d",
      bountyId: "b6",
      title: "DUB-REGGAE Music DataNFT",
      summary:
        "Craft a Music Data NFT featuring a dynamic playlist of at least 3 songs. Heavy weight bass like the artists: O.B.F, King Alpha, Alpha Step, Radikal Guru, Indica Dubs, Vibronics.",
      readMoreLink: "",
      submittedOnTs: 1714981876,
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
      submittedOnTs: 1714981876,
      fillPerks:
        "The Creator of the bounty will receive 5 copies.\n The top 5 contributors on the GiveBiTz leaderboard for this bounty will each receive 3 copies.\n Contributors ranked 6th to 20th will receive 2 copies each.\n Contributors ranked 21st to 50th will receive 1 copy each.\n Additionally, 5 lucky winners from the top 51 to 100 contributors will each receive 1 copy.\n 50 copies donated to BiTz Monthly Leaderboard",
    });
    allBounties.push({
      bountySubmitter: "erd1c7jg5lkfjxsk0y32td5z2f4edh7r8u0pwy0k67evzmeem3gzwdxsvlukc0",
      bountyId: "b8",
      title: "Indie/Rock Data NFT",
      summary:
        "Craft a Music Data NFT which should contain at least 1 song (Indie/Rock). Warm voice on a chillin' guitar, slow BPM, something to listen with joy next to a glass of wine.",
      readMoreLink: "",
      submittedOnTs: 1714981876,
      fillPerks:
        "The creator of the bounty will receive 10 copies of the album.\n The top 5 contributors on the GiveBiTz leaderboard for this bounty will each receive 3 copies.\n Contributors ranked 6th to 10th will receive 2 copies each.\n  Contributors ranked 11st to 35th will receive 1 copy each.\n  Additionally, 10 lucky winners from the top 36 to 100 contributors will each receive 1 copy. \n 30 copies donated to BiTz Monthly Leaderboard",
    });
    allBounties.push({
      bountySubmitter: "erd13ga0m7hjvjg9x47ngzv7mehamh4klctdn4m0gufwr4ukfg9x5yqs45gnga",
      bountyId: "b10",
      title: "Me and my tradition",
      summary: `Data NFT bounty focused on digitizing and immortalizing vanishing cultural traditions and practices.
      Each participant would need to record rituals, ceremonies, traditional crafts, or oral histories. Each verified contribution could be transformed into a unique NFT, with rewards including a portion of NFT sales, or biTz point that are funding for community-led cultural preservation projects, or access to immersive experiences showcasing these traditions.
       It's a way to celebrate and safeguard cultural diversity while empowering communities to preserve their heritage for future generations.`,
      readMoreLink: "",
      submittedOnTs: 1715329474,
      fillPerks: `The creator of the bounty will receive 5 copies. 
        The top 5 contributors on the GiveBiTz leaderboard for this bounty will each receive 3 copies.  
        Contributors ranked 6th to 20th will receive 2 copies each. 
        Contributors ranked 21st to 50th will receive 1 copy each. 
        Additionally, 5 lucky winners from the top 51 to 100 contributors will each receive 1 copy. 
        50 copies donated to BiTz Monthly Leaderboard`,
    });
    allBounties.push({
      bountySubmitter: "erd18qxupz0zfffk3pa034pxlsu7tttjw93aey3wlxc7jew8fe4epj6sly56ya",
      bountyId: "b11",
      title: "Music Data NFT",
      summary: `Craft a Music Data NFT featuring a dynamic playlist of at least 3 songs. The playlist can evolve over time based on community input`,
      readMoreLink: "",
      submittedOnTs: 1715329474,
      fillPerks: `The creator of the bounty will receive 5 copies of the album. 
        The top 5 contributors on the GiveBiTz leaderboard for this bounty will each receive 3 copies.  
        Contributors ranked 6th to 20th will receive 2 copies each. 
        Contributors ranked 21st to 50th will receive 1 copy each. 
        Additionally, 5 lucky winners from the top 51 to 100 contributors will each receive 1 copy. 
        50 copies donated to BiTz Monthly Leaderboard`,
    });
    return allBounties;
  }
}
