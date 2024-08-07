import { IS_DEVNET } from "appsConfig";
import { BIT_GAME_WINDOW_HOURS, GiveBitzCreatorCampaign, GiveBitzDataBounty } from "../common/interfaces";

export const faqs = [
  {
    title: "What are Itheum <BiTz> Points?",
    content: (
      <>
        <p>
          Think of them as XP (Experience Points) of the Itheum Protocol, we also like to call them &quot;Data Ownership OG XP&quot; and if you consider
          yourself an Itheum OG and love Data Ownership, then we absolutely think you are a pioneer and {`<BiTz>`} is the Itheum XP system for you!
        </p>
        <p className="mt-5">
          You need to use Data NFT and Itheum Core Infrastructure to collect your {`<BiTz>`} XP, and this exact Web3 / Blockchain based product stack can be
          used by you to empower you to take ownership of and tokenize your data. So, in essence, you are using Data Ownership + Data Tokenization technology
          and learning how you can take ownership of your data! Welcome Itheum Data Ownership OG!
        </p>
      </>
    ),
  },
  {
    title: "Why are <BiTz> Points Important?",
    content: (
      <>
        <p>
          In addition to serving as the Itheum Protocol XP, they signal your &quot;liveliness&quot; and authenticate your status as a human rather than a BOT.
          This serves as a form of &quot;reputation signalling&quot; within the Itheum ecosystem, a concept greatly strengthened when connected to &quot;data
          ownership,&quot; adding an additional layer of &quot;proof of experience&quot; to the Itheum Protocol.
        </p>
        <p className="mt-5">
          A series of new features related to &quot;liveliness & reputation signalling&quot; will soon be introduced within the Itheum protocol, and {`<BiTz>`}{" "}
          XP stands as the inaugural feature of its kind.
        </p>
      </>
    ),
  },
  {
    title: "How can I collect <BiTz> Points?",
    content: (
      <>
        <p>
          You need to HODL a {`<BiTz>`} compatible Data NFT in your wallet to play the Get {`<BiTz>`} game (you are on this page now). This Data NFT was
          airdropped in waves to OGs of the Itheum Protocol, but fear not, you can also get it through{" "}
          <a className="!text-[#7a98df] hover:underline" href="https://drip.haus/itheum" target="blank">
            Itheum&apos;s DRiP Haus channel{" "}
          </a>
          or any NFT Marketplace (if the OGs broke our hearts and parted ways with their Data NFTs). If you missed the previous {`<BiTz>`} Data NFT drops, you
          can subscribe to{" "}
          <a className="!text-[#7a98df] hover:underline" href="https://drip.haus/itheum" target="blank">
            our DRiP Haus channel{" "}
          </a>
          where you can get access to future drops.
        </p>
        <p className="mt-5">
          Once you have the Data NFT in your wallet, you can play the Game every {BIT_GAME_WINDOW_HOURS} Hours. You have to burn a Meme and sacrifice it to the{" "}
          {`<BiTz>`} Generator God and then based on pure random chance, you win {`<BiTz>`}!
        </p>
        <p className="mt-5">
          In the near future, the Get {`<BiTz>`} game won&apos;t be the only way to collect {`<BiTz>`} points, if you stay &quot;active&quot; on the Itheum
          Protocol, you will be rewarded with bonus {`<BiTz>`} points as well.
        </p>
        <p className="mt-5">You DO NOT need to spend any gas to Play the Get {`<BiTz>`} ! SAY WAT?!</p>
      </>
    ),
  },
  {
    title: "Where can I play the Get <BiTz> Game?",
    content: (
      <>
        <p>
          Currently, you can play it on the{" "}
          <a className="!text-[#7a98df] hover:underline" href="https://itheum.io/getxp" target="blank">
            Get {`<BiTz>`} dApp
          </a>{" "}
        </p>
      </>
    ),
  },
  {
    title: "What can I do with Itheum <BiTz> Points?",
    content: (
      <>
        <p>
          Itheum {`<BiTz>`} is like an XP system and you collect {`<BiTz>`} each time you interact with certain features of Itheum Protocol. Like all XP
          Systems, there is a LEADERBOARD-based rewards system that is tied to use cases within the Itheum protocol. At launch, the following utility will be
          available:
        </p>
        <ol className="mt-5 text-lg">
          <li>
            1. Power Up Data Bounties with {`<BiTz>`} XP below - Give {`<BiTz>`}
          </li>
          <li className="my-5">
            2. Top leaderboard gets rewards as part of monthly competitions for Data NFT airdrops or $ITHEUM airdrop campaigns. (Check special “Perks” section
            above for any active competitions happening)
          </li>
          <li className="my-5">3. Bragging rights as you climb to the top of the LEADERBOARD!</li>
        </ol>
        <p className="mt-5">
          This is just the start, we have a bunch of other ideas planned for {`<BiTz>`}. Got ideas for {`<BiTz>`} utility? We love to hear them:{" "}
          <a className="!text-[#7a98df] hover:underline" href="https://forms.gle/muA4XiD2ddQis4G78" target="blank">
            {" "}
            Send ideas
          </a>{" "}
        </p>
      </>
    ),
  },

  {
    title: "Are Itheum <BiTz> Points Blockchain Tokens?",
    content: (
      <>
        <p>
          Nope, there are plenty of meme coins out there already. Itheum {`<BiTz>`} are XP points aiming to &quot;gamify&quot; usage of the Itheum Protocol
          infrastructure. The{" "}
          <a className="!text-[#7a98df] hover:underline" href="https://coinmarketcap.com/currencies/itheum/" target="blank">
            $ITHEUM token
          </a>{" "}
          is the primary utility token of the entire Itheum Ecosystem.
        </p>
      </>
    ),
  },
  {
    title: "Are Itheum <BiTz> Points Tradable?",
    content: (
      <>
        {" "}
        <p>
          We are heart-broken that you asked :( and nope you can&apos;t as they are not blockchain tokens (see above). But we are looking at possibilities of
          where you can &quot;gift&quot; them to Data Creators who mint Data NFT Collections. &quot;Gifting&quot; Itheum {`<BiTz>`} will have its own
          LEADERBOARD and perks ;)
        </p>
      </>
    ),
  },
  {
    title: "Can I use Multiple Wallets to Claim <BiTz> XP?",
    content: (
      <>
        <p>
          If you do this, you will &quot;fragment&quot; your XP and you wont get much benefits so it&apos;s best you use your primary identity wallet to collect{" "}
          {`<BiTz>`} XP. We will also be rolling out soon some new blockchain powered &quot;liveliness & reputation signalling&quot; features that should
          prevent or drastically reduce possible XP sybil attacks.
        </p>
      </>
    ),
  },
  {
    title: "Can I move Itheum <BiTz> Points Between my Wallets?",
    content: (
      <>
        <p>
          Lost your primary wallet or want to move Itheum {`<BiTz>`} to your new wallet? unfortunately, this is not possible right now. So stay SAFU & make sure
          you get {`<BiTz>`} in the wallet you treasure the most.
        </p>
      </>
    ),
  },
  {
    title: "Why is it Called <BiTz>?",
    content: (
      <p>
        Itheum is a data ownership protocol that is trying to break the current cycle of data exploitation. A Bit is the smallest unit of data. Let&apos;s break
        the cycle of data exploitation one {`<BiT>`} at a time.
      </p>
    ),
  },
  {
    title: "Will this <BiTz> App become a Playable Game?",
    content: (
      <>
        {" "}
        <p>
          We are not game developers and don&apos;t pretend to be, so are waiting for an A.I tool that will build the game for us. We&apos;d love for the Get{" "}
          {`<BiTz>`} app to become a hub of &quot;Mini-Games&quot; where you win {`<BiTz>`} XP. Are you an A.I or a Game Dev and want to build a game layer for
          the Itheum {`<BiTz>`} XP system? Reach out and you could get a grant via the{" "}
          <a
            className="!text-[#7a98df] hover:underline"
            href="https://docs.itheum.io/product-docs/protocol/governance/itheum-xpand-dao/itheum-xpand-grants-program"
            target="blank">
            Itheum xPand DAO program
          </a>
          . As the entire game logic is actually inside the Data NFT, ANYONE can{" "}
          <a className="!text-[#7a98df] hover:underline" href="https://docs.itheum.io/product-docs/developers/software-development-kits-sdks/data-nft-sdk">
            use our SDK
          </a>{" "}
          and build their own game UI in front of it, this is the power and &quot;Composability&quot; of Itheum&apos;s Data NFTs in action.
        </p>
      </>
    ),
  },
  {
    title: "Help Make Itheum <BiTz> Better?",
    content: (
      <>
        {" "}
        <p>
          We want to make the Itheum {`<BiTz>`} XP System better! Do you have any questions or ideas for us or just want to know more? Head over to our{" "}
          <a className="!text-[#7a98df] hover:underline" href="https://itheum.io/discord" target="blank">
            Discord
          </a>{" "}
          and speak to us or{" "}
          <a className="!text-[#7a98df] hover:underline" href="https://forms.gle/muA4XiD2ddQis4G78" target="blank">
            Send us your utility ideas for {`<BiTz>`} here.
          </a>{" "}
        </p>
      </>
    ),
  },
];

export function getCreatorCampaigns() {
  const allCreatorCampaigns: GiveBitzCreatorCampaign[] = [];

  if (IS_DEVNET) {
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

  if (IS_DEVNET) {
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
