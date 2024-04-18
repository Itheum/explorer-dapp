import React from "react";
import QuestionCard from "./QuestionCard";

export const BIT_GAME_WINDOW_HOURS = "3"; // how often we can play the game, need to match logic inside Data NFT
export const BIT_GAME_TOP_LEADER_BOARD_GROUP = "20"; // top X leaderboard winners for the monthly price

const Faq: React.FC = () => {
  const faqs = [
    {
      title: "What are Itheum <BiTz> Points?",
      content: (
        <>
          <p>
            Think of them as XP (Experience Points) of the Itheum Protocol, we also like to call them "Data Ownership OG (Original Gangster) XP" and if you
            consider yourself an Itheum OG and love Data Ownership, then we absolutely think you are a pioneer and {`<BiTz>`} is the Itheum XP system for you!!
          </p>
          <p className="mt-5">
            You need to use Data NFT and Itheum Core Infrastructure to collect your {`<BiTz>`} XP, and this exact Web3/Blockchain based product stack can be
            used by you to empower you to take ownership of and tokenize your data. So in essence, you are using Data Ownership + Data Tokenization technology
            and learning about how you can take ownership of your data! Welcome Itheum Data Ownership OG!
          </p>
        </>
      ),
    },
    {
      title: "Why are <BiTz> Points Important?",
      content: (
        <>
          <p>
            In addition to serving as the Itheum Protocol XP, they signal your "liveliness" and authenticate your status as a human rather than a BOT. This
            serves as a form of "reputation signalling" within the Itheum ecosystem, a concept greatly strengthened when connected to "data ownership," adding
            an additional layer of "proof of experience" to the Itheum Protocol.
          </p>
          <p className="mt-5">
            A series of new features related to "liveliness & reputation signalling" will soon be introduced within the Itheum protocol, and {`<BiTz>`} XP
            stands as the inaugural feature of its kind.
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
            Once you have the Data NFT in your wallet, you can play the Game every 6 Hours ({BIT_GAME_WINDOW_HOURS} Hours in "Launch Window"). You have to burn
            a Meme and sacrifice it to the {`<BiTz>`} Generator God and then based on pure random chance, you win {`<BiTz>`}!
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
          {" "}
          <p>
            Itheum {`<BiTz>`} is like an XP system and you collect {`<BiTz>`} each time you interact with certain features of Itheum Protocol. Like all XP
            Systems, there will be LEADERBOARD-based rewards that are tied to use cases within the Itheum protocol. At launch, the following utility will be
            available:
          </p>
          <ol className="mt-5 text-lg">
            <li className="my-5">
              1. Top 5 Movers (top {BIT_GAME_TOP_LEADER_BOARD_GROUP} during LAUNCH WINDOW) from "Monthly" LEADERBOARD get Airdropped{" "}
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
            Nope, there are more than enough meme coins out there and we don't need more. Itheum {`<BiTz>`} are simple XP to "gamify" usage of the Itheum
            Protocol infrastructure. The $ITHEUM token is the primary utility token of the entire Itheum Ecosystem.
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
            If you do this, you will "fragment" your XP and you wont get much benefits so it's best you use your primary identity wallet to collect {`<BiTz>`}{" "}
            XP. BUT, we also know that many "hunters" may try and do this to game (sybil attack) the LEADERBOARD and it will disadvantage the regular genuine
            users. We are rolling out some new blockchain powered "liveliness & reputation signalling" features that should prevent or drastically reduce such
            XP sybil attacks.
          </p>
        </>
      ),
    },
    {
      title: "Can I move Itheum <BiTz> Points Between my Wallets?",
      content: (
        <>
          <p>
            Lost your primary wallet or want to move Itheum {`<BiTz>`} to your new wallet? unfortunately, this is not possible right now (it MAY be in the
            future - but no guarantee). So make sure you get {`<BiTz>`} in the wallet you treasure the most.
          </p>
        </>
      ),
    },
    {
      title: "Why is it Called <BiTz>?",
      content: (
        <p>
          Itheum is a data ownership protocol that is trying to break the current cycle of data exploitation. A Bit is the smallest unit of data. Let's break
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
            We are not game developers and don't pretend to be, so are waiting for an A.I tool that will build the game for us. We'd love for the Get {`<BiTz>`}{" "}
            app to become a hub of "Mini-Games" where you win {`<BiTz>`} XP. Are you an A.I or a Game Dev and want to build a game layer for the Itheum{" "}
            {`<BiTz>`} XP system? Reach out and you could get a grant from via the{" "}
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
  return (
    <div className="flex flex-col  justify-between py-16 ">
      <div className="flex flex-col  mb-8 items-center justify-center">
        <span className="text-foreground text-4xl mb-2">FAQs</span>
        <span className="text-base text-foreground/75 text-center ">Explore our frequently asked questions and answers.</span>
      </div>
      <div className="flex flex-col gap-4 justify-center items-center ">
        {faqs.map((pair, index) => (
          <QuestionCard key={index} title={pair.title} content={pair.content} />
        ))}
      </div>
    </div>
  );
};

export default Faq;
