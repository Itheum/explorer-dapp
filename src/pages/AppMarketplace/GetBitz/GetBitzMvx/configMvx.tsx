import { EnvironmentsEnum } from "libs/types";
import { BIT_GAME_TOP_LEADER_BOARD_GROUP, BIT_GAME_WINDOW_HOURS, GiveBitzCreatorCampaign, GiveBitzDataBounty } from "../common/interfaces";

export const faqs = [
  {
    title: "What are Itheum <BiTz> Points?",
    content: (
      <>
        <p>
          Think of them as XP (Experience Points) of the Itheum Protocol, we also like to call them "Data Ownership OG (Original Gangster) XP" and if you
          consider yourself an Itheum OG and love Data Ownership, then we absolutely think you are a pioneer and {`<BiTz>`} is the Itheum XP system for you!!
        </p>
        <p className="mt-5">
          You need to use Data NFT and Itheum Core Infrastructure to collect your {`<BiTz>`} XP, and this exact Web3/Blockchain based product stack can be used
          by you to empower you to take ownership of and tokenize your data. So in essence, you are using Data Ownership + Data Tokenization technology and
          learning about how you can take ownership of your data! Welcome Itheum Data Ownership OG!
        </p>
      </>
    ),
  },
  {
    title: "Why are <BiTz> Points Important?",
    content: (
      <>
        <p>
          In addition to serving as the Itheum Protocol XP, they signal your "liveliness" and authenticate your status as a human rather than a BOT. This serves
          as a form of "reputation signalling" within the Itheum ecosystem, a concept greatly strengthened when connected to "data ownership," adding an
          additional layer of "proof of experience" to the Itheum Protocol.
        </p>
        <p className="mt-5">
          A series of new features related to "liveliness & reputation signalling" will soon be introduced within the Itheum protocol, and {`<BiTz>`} XP stands
          as the inaugural feature of its kind.
        </p>
      </>
    ),
  },
  {
    title: "How can I collect `<BiTz>` Points?",
    content: (
      <>
        {" "}
        <p>
          You need to hold a {`<BiTz>`} compatible Data NFT in your wallet to play the Get {`<BiTz>`} game (you are on this page now). This Data NFT was
          airdropped in waves to OGs of the Itheum Protocol, but fear not, you can also get it on the{" "}
          <a className="!text-[#7a98df] hover:underline" href="https://datadex.itheum.io/datanfts/marketplace/DATANFTFT-e936d4-07" target="blank">
            Itheum Data NFT Marketplace
          </a>{" "}
          or any NFT Marketplace (if the OGs broke our hearts and parted ways with their Data NFTs). If this "Gen 1" {`<BiTz>`} Data NFT is successful, there
          may be a follow-up Series of {`<BiTz>`} Data NFTs launched and airdropped as well.
        </p>
        <p className="mt-5">
          Once you have the Data NFT in your wallet, you can play the Game every ({BIT_GAME_WINDOW_HOURS} Hours in "Launch Window"). You have to burn a Meme and
          sacrifice it to the {`<BiTz>`} Generator God and then based on pure random chance, you win {`<BiTz>`}!
        </p>
        <p className="mt-5">You DO NOT need to spend any gas to Play the Get {`<BiTz>`} ! SAY WAT?!</p>
        <p className="mt-5">
          But in the near future, the Get {`<BiTz>`} game won't be the only way to collect {`<BiTz>`} points, if you stay "active" on the Itheum Protocol, you
          will be rewarded with bonus {`<BiTz>`} points as well. For example, if you use the{" "}
          <a className="!text-[#7a98df] hover:underline" href="https://datadex.itheum.io/datanfts/marketplace/market" target="blank">
            Data DEX
          </a>{" "}
          to explore and "favorite" the Data NFTs and Data Creators you like or if you use features like "Data Uptime Checks" or use Data Widgets inside the
          Itheum Explorer, all these Itheum Protocol "activity" will have {`<BiTz>`} bonus points attached to it and sent to you!
        </p>
      </>
    ),
  },
  {
    title: "Where can I play the Get <BiTz> Game?",
    content: (
      <>
        {" "}
        <p>
          Currently, you can play it on Itheum Explorer's Get {`<BiTz>`} Data Widget{" "}
          <a className="!text-[#7a98df] hover:underline" href="https://explorer.itheum.io/getbitz" target="blank">
            explorer.itheum.io/getbitz
          </a>
        </p>
        <p className="mt-5">
          Also note that Itheum Explorer is available on xPortal Hub as well, so with a few taps on your xPortal mobile wallet, you can open the game and Get{" "}
          {`<BiTz>`}!
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
          Systems, there will be LEADERBOARD-based rewards that are tied to use cases within the Itheum protocol. At launch, the following utility will be
          available:
        </p>
        <ol className="mt-5 text-lg">
          <li className="my-5">
            1. Top {BIT_GAME_TOP_LEADER_BOARD_GROUP} Movers from "Monthly" LEADERBOARD get Airdropped{" "}
            <a className="!text-[#7a98df] hover:underline" href="https://datadex.itheum.io/datanfts/marketplace/market" target="blank">
              Data NFTs
            </a>{" "}
            from previous and upcoming Data Creators.
          </li>
          <li className="my-5">
            2. Get a boost on Monthly{" "}
            <a className="!text-[#7a98df] hover:underline" href="https://explorer.itheum.io/project-trailblazer" target="blank">
              Itheum Trailblazer
            </a>{" "}
            Data NFT Quest Rewards.
          </li>
          <li className="my-5">
            3. 3 bonus drops of{" "}
            <a className="!text-[#7a98df] hover:underline" href="https://datadex.itheum.io/datanfts/marketplace/market" target="blank">
              Data NFTs
            </a>{" "}
            from previous and upcoming Data Creators sent randomly to users from top 100 "All Time" LEADERBOARD
          </li>
          <li className="my-5">4. Bragging rights as you climb to the top of the LEADERBOARD!</li>
          <li>
            5. Power Up Data Bounties with {`<BiTz>`} XP below - Give {`<BiTz>`}
          </li>
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
    "title": "Are Itheum <BiTz> Points Blockchain Tokens?",
    "content": (
      <>
        <p>
          Nope, there are more than enough meme coins out there and we don't need more. Itheum {`<BiTz>`} are simple XP to "gamify" usage of the Itheum Protocol
          infrastructure. The $ITHEUM token is the primary utility token of the entire Itheum Ecosystem.
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
          We are heart-broken that you asked :( and nope you can't as they are not blockchain tokens (see above). But we are looking at possibilities of where
          you can "gift" them to Data Creators who mint Data NFT Collections. "Gifting" Itheum {`<BiTz>`} will have its own LEADERBOARD and perks ;)
        </p>
      </>
    ),
  },
  {
    title: "Can I use Multiple Wallets to Claim <BiTz> XP?",
    content: (
      <>
        <p>
          If you do this, you will "fragment" your XP and you wont get much benefits so it's best you use your primary identity wallet to collect {`<BiTz>`} XP.
          BUT, we also know that many "hunters" may try and do this to game (sybil attack) the LEADERBOARD and it will disadvantage the regular genuine users.
          We are rolling out some new blockchain powered "liveliness & reputation signalling" features that should prevent or drastically reduce such XP sybil
          attacks.
        </p>
      </>
    ),
  },
  {
    title: "Can I move Itheum <BiTz> Points Between my Wallets?",
    content: (
      <>
        <p>
          Lost your primary wallet or want to move Itheum {`<BiTz>`} to your new wallet? unfortunately, this is not possible right now (it MAY be in the future
          - but no guarantee). So make sure you get {`<BiTz>`} in the wallet you treasure the most.
        </p>
      </>
    ),
  },
  {
    title: "Why is it Called <BiTz>?",
    content: (
      <p>
        Itheum is a data ownership protocol that is trying to break the current cycle of data exploitation. A Bit is the smallest unit of data. Let's break the
        cycle of data exploitation one {`<BiT>`} at a time.
      </p>
    ),
  },
  {
    title: "Will this <BiTz> App become a Playable Game?",
    content: (
      <>
        {" "}
        <p>
          We are not game developers and don't pretend to be, so are waiting for an A.I tool that will build the game for us. We'd love for the Get {`<BiTz>`}{" "}
          app to become a hub of "Mini-Games" where you win {`<BiTz>`} XP. Are you an A.I or a Game Dev and want to build a game layer for the Itheum {`<BiTz>`}{" "}
          XP system? Reach out and you could get a grant from via the{" "}
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
          and build their own game UI in front of it, this is the power and "Composability" of Itheum's Data NFTs in action.
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
      finalizedDataNftIdentifier: "DATANFTFT-e936d4-0a",
    });

    allBounties.push({
      bountySubmitter: "erd1xdq4d7uewptx9j9k23aufraklda9leumqc7eu3uezt2kf4fqxz2sex2rxl",
      bountyId: "b21",
      title: "Top 50 addresses of daily RIDE flippers",
      summary: "A dynamic Data NFT which can be opened to find the top 50 flippers of RIDE tokens",
      readMoreLink: "https://docs.itheum.io/data-bounties/top-ride-flippers",
      submittedOnTs: 1712713989,
      fillPerks: "Top 20 Leaderboard gets Data NFT once bounty launches. 10 Data NFTs to be dropped to random winners of top 100 Leaderboard.",
      finalizedDataNftIdentifier: "DATANFTFT-e936d4-0a",
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
    allBounties.push({
      bountySubmitter: "erd12nk8jwsfrnp6zdrwsc28nnn54psfcj5rjzqmm8z2xl0xv8g8ra5q5evzw8",
      bountyId: "b9",
      title: "MultiversX Developers Community",
      summary: `Infographics and data visualization about the number of developers on the Elrond / MultiversX ecosystem.\n
        The goal is to better understand the developing ecosystem and it's evolution over the years, using only facts and not the noise on social networks.\n
        It would be interesting to see data such as the repartition core dev / other dev, evolution of the number of releases, posts on GitHub, fixes, and new smart contracts on dev or mainet...`,
      readMoreLink: "",
      submittedOnTs: 1715084891,
      fillPerks: `The creator of the bounty will receive 5 copies of the album. 
        The top 5 contributors on the GiveBiTz leaderboard for this bounty will each receive 3 copies.  
        Contributors ranked 6th to 20th will receive 2 copies each. 
        Contributors ranked 21st to 50th will receive 1 copy each. 
        Additionally, 5 lucky winners from the top 51 to 100 contributors will each receive 1 copy. 
        50 copies donated to BiTz Monthly Leaderboard`,
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
      finalizedDataNftIdentifier: "DATANFTFT-e936d4-09",
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
      finalizedDataNftIdentifier: "DATANFTFT-e936d4-0a",
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
      bountySubmitter: "erd12nk8jwsfrnp6zdrwsc28nnn54psfcj5rjzqmm8z2xl0xv8g8ra5q5evzw8",
      bountyId: "b9",
      title: "MultiversX Developers Community",
      summary: `Infographics and data visualization about the number of developers on the Elrond / MultiversX ecosystem.\n
        The goal is to better understand the developing ecosystem and it's evolution over the years, using only facts and not the noise on social networks.\n
        It would be interesting to see data such as the repartition core dev / other dev, evolution of the number of releases, posts on GitHub, fixes, and new smart contracts on dev or mainet...`,
      readMoreLink: "",
      submittedOnTs: 1715084891,
      fillPerks: `The creator of the bounty will receive 5 copies of the album. 
        The top 5 contributors on the GiveBiTz leaderboard for this bounty will each receive 3 copies.  
        Contributors ranked 6th to 20th will receive 2 copies each. 
        Contributors ranked 21st to 50th will receive 1 copy each. 
        Additionally, 5 lucky winners from the top 51 to 100 contributors will each receive 1 copy. 
        50 copies donated to BiTz Monthly Leaderboard`,
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
    allBounties.push({
      bountySubmitter: "erd1dzmvw7gfrfv6tjxvah9rmwd45xqzs6q098925ucmsu69s48776dqlytnn2",
      bountyId: "b12",
      title: "EGLD Fear&Greed Index",
      summary: `A EGLD market sentiment gauge, similar to the BTC Fear&Greed Index.`,
      readMoreLink: "",
      submittedOnTs: 1715329474,
      fillPerks: `The creator of the bounty will receive 5 copies. 
        The top 5 contributors on the GiveBiTz leaderboard for this bounty will each receive 3 copies.  
        Contributors ranked 6th to 20th will receive 2 copies each. 
        Contributors ranked 21st to 50th will receive 1 copy each. 
        Additionally, 5 lucky winners from the top 51 to 100 contributors will each receive 1 copy. 
        50 copies donated to BiTz Monthly Leaderboard`,
    });
    return allBounties;
  }
}
