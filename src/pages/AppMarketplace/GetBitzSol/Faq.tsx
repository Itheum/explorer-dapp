import React from 'react';
import QuestionCard from './QuestionCard';

export const BIT_GAME_WINDOW_HOURS = '6'; // how often we can play the game, need to match logic inside Data NFT
export const BIT_GAME_TOP_LEADER_BOARD_GROUP = '5'; // top X leaderboard winners for the monthly price

const Faq: React.FC = () => {
  const faqs = [
    {
      title: 'What are Itheum <BiTz> Points?',
      content: (
        <>
          <p>
            Think of them as XP (Experience Points) of the Itheum Protocol, we
            also like to call them &quot;Data Ownership OG XP&quot; and if you
            consider yourself an Itheum OG and love Data Ownership, then we
            absolutely think you are a pioneer and {`<BiTz>`} is the Itheum XP
            system for you!
          </p>
          <p className="mt-5">
            You need to use Data NFT and Itheum Core Infrastructure to collect
            your {`<BiTz>`} XP, and this exact Web3 / Blockchain based product
            stack can be used by you to empower you to take ownership of and
            tokenize your data. So, in essence, you are using Data Ownership +
            Data Tokenization technology and learning how you can take ownership
            of your data! Welcome Itheum Data Ownership OG!
          </p>
        </>
      ),
    },
    {
      title: 'Why are <BiTz> Points Important?',
      content: (
        <>
          <p>
            In addition to serving as the Itheum Protocol XP, they signal your
            &quot;liveliness&quot; and authenticate your status as a human
            rather than a BOT. This serves as a form of &quot;reputation
            signalling&quot; within the Itheum ecosystem, a concept greatly
            strengthened when connected to &quot;data ownership,&quot; adding an
            additional layer of &quot;proof of experience&quot; to the Itheum
            Protocol.
          </p>
          <p className="mt-5">
            A series of new features related to &quot;liveliness & reputation
            signalling&quot; will soon be introduced within the Itheum protocol,
            and {`<BiTz>`} XP stands as the inaugural feature of its kind.
          </p>
        </>
      ),
    },
    {
      title: 'How can I collect <BiTz> Points?',
      content: (
        <>
          <p>
            You need to HODL a {`<BiTz>`} compatible Data NFT in your wallet to
            play the Get {`<BiTz>`} game (you are on this page now). This Data
            NFT was airdropped in waves to OGs of the Itheum Protocol, but fear
            not, you can also get it through{' '}
            <a
              className="!text-[#7a98df] hover:underline"
              href="https://drip.haus/itheum"
              target="blank"
            >
              Itheum&apos;s DRiP Haus channel{' '}
            </a>
            or any NFT Marketplace (if the OGs broke our hearts and parted ways
            with their Data NFTs). If you missed the previous {`<BiTz>`} Data
            NFT drops, you can subscribe to{' '}
            <a
              className="!text-[#7a98df] hover:underline"
              href="https://drip.haus/itheum"
              target="blank"
            >
              our DRiP Haus channel{' '}
            </a>
            where you can get access to future drops.
          </p>
          <p className="mt-5">
            Once you have the Data NFT in your wallet, you can play the Game
            every {BIT_GAME_WINDOW_HOURS} Hours. You have to burn a Meme and
            sacrifice it to the {`<BiTz>`} Generator God and then based on pure
            random chance, you win {`<BiTz>`}!
          </p>
          <p className="mt-5">
            In the near future, the Get {`<BiTz>`} game won&apos;t be the only
            way to collect {`<BiTz>`} points, if you stay &quot;active&quot; on
            the Itheum Protocol, you will be rewarded with bonus {`<BiTz>`}{' '}
            points as well.
          </p>
          <p className="mt-5">
            You DO NOT need to spend any gas to Play the Get {`<BiTz>`} ! SAY
            WAT?!
          </p>
        </>
      ),
    },
    {
      title: 'Where can I play the Get <BiTz> Game?',
      content: (
        <>
          <p>
            Currently, you can play it on the{' '}
            <a
              className="!text-[#7a98df] hover:underline"
              href="https://itheum.io/getxp"
              target="blank"
            >
              Get {`<BiTz>`} dApp on Solana Network
            </a>{' '}
            or on{' '}
            <a
              className="!text-[#7a98df] hover:underline"
              href="https://explorer.itheum.io/getbitz"
              target="blank"
            >
              the Get {`<BiTz>`} dApp on the MultiversX blockchain
            </a>{' '}
          </p>
        </>
      ),
    },
    {
      title: 'What can I do with Itheum <BiTz> Points?',
      content: (
        <>
          <p>
            Itheum {`<BiTz>`} is like an XP system and you collect {`<BiTz>`}{' '}
            each time you interact with certain features of Itheum Protocol.
            Like all XP Systems, there is a LEADERBOARD-based rewards system
            that is tied to use cases within the Itheum protocol. At launch, the
            following utility will be available:
          </p>
          <ol className="mt-5 text-lg">
            <li>
              1. Power Up Data Bounties with {`<BiTz>`} XP below - Give{' '}
              {`<BiTz>`}
            </li>
            <li className="my-5">
              2. Top leaderboard gets rewards as part of monthly competitions
              for Data NFT airdrops or $ITHEUM airdrop campaigns. (Check special
              “Perks” section above for any active competitions happening)
            </li>
            <li className="my-5">
              3. Bragging rights as you climb to the top of the LEADERBOARD!
            </li>
          </ol>
          <p className="mt-5">
            This is just the start, we have a bunch of other ideas planned for{' '}
            {`<BiTz>`}. Got ideas for {`<BiTz>`} utility? We love to hear them:{' '}
            <a
              className="!text-[#7a98df] hover:underline"
              href="https://forms.gle/muA4XiD2ddQis4G78"
              target="blank"
            >
              {' '}
              Send ideas
            </a>{' '}
          </p>
        </>
      ),
    },

    {
      title: 'Are Itheum <BiTz> Points Blockchain Tokens?',
      content: (
        <>
          <p>
            Nope, there are plenty of meme coins out there already. Itheum{' '}
            {`<BiTz>`} are XP points aiming to &quot;gamify&quot; usage of the
            Itheum Protocol infrastructure. The{' '}
            <a
              className="!text-[#7a98df] hover:underline"
              href="https://coinmarketcap.com/currencies/itheum/"
              target="blank"
            >
              $ITHEUM token
            </a>{' '}
            is the primary utility token of the entire Itheum Ecosystem.
          </p>
        </>
      ),
    },
    {
      title: 'Are Itheum <BiTz> Points Tradable?',
      content: (
        <>
          {' '}
          <p>
            We are heart-broken that you asked :( and nope you can&apos;t as
            they are not blockchain tokens (see above). But we are looking at
            possibilities of where you can &quot;gift&quot; them to Data
            Creators who mint Data NFT Collections. &quot;Gifting&quot; Itheum{' '}
            {`<BiTz>`} will have its own LEADERBOARD and perks ;)
          </p>
        </>
      ),
    },
    {
      title: 'Can I use Multiple Wallets to Claim <BiTz> XP?',
      content: (
        <>
          <p>
            If you do this, you will &quot;fragment&quot; your XP and you wont
            get much benefits so it&apos;s best you use your primary identity
            wallet to collect {`<BiTz>`} XP. We will also be rolling out soon
            some new blockchain powered &quot;liveliness & reputation
            signalling&quot; features that should prevent or drastically reduce
            possible XP sybil attacks.
          </p>
        </>
      ),
    },
    {
      title: 'Can I move Itheum <BiTz> Points Between my Wallets?',
      content: (
        <>
          <p>
            Lost your primary wallet or want to move Itheum {`<BiTz>`} to your
            new wallet? unfortunately, this is not possible right now. So stay
            SAFU & make sure you get {`<BiTz>`} in the wallet you treasure the
            most.
          </p>
        </>
      ),
    },
    {
      title: 'Why is it Called <BiTz>?',
      content: (
        <p>
          Itheum is a data ownership protocol that is trying to break the
          current cycle of data exploitation. A Bit is the smallest unit of
          data. Let&apos;s break the cycle of data exploitation one {`<BiT>`} at
          a time.
        </p>
      ),
    },
    {
      title: 'Will this <BiTz> App become a Playable Game?',
      content: (
        <>
          {' '}
          <p>
            We are not game developers and don&apos;t pretend to be, so are
            waiting for an A.I tool that will build the game for us. We&apos;d
            love for the Get {`<BiTz>`} app to become a hub of
            &quot;Mini-Games&quot; where you win {`<BiTz>`} XP. Are you an A.I
            or a Game Dev and want to build a game layer for the Itheum{' '}
            {`<BiTz>`} XP system? Reach out and you could get a grant via the{' '}
            <a
              className="!text-[#7a98df] hover:underline"
              href="https://docs.itheum.io/product-docs/protocol/governance/itheum-xpand-dao/itheum-xpand-grants-program"
              target="blank"
            >
              Itheum xPand DAO program
            </a>
            . As the entire game logic is actually inside the Data NFT, ANYONE
            can{' '}
            <a
              className="!text-[#7a98df] hover:underline"
              href="https://docs.itheum.io/product-docs/developers/software-development-kits-sdks/data-nft-sdk"
            >
              use our SDK
            </a>{' '}
            and build their own game UI in front of it, this is the power and
            &quot;Composability&quot; of Itheum&apos;s Data NFTs in action.
          </p>
        </>
      ),
    },
    {
      title: 'Help Make Itheum <BiTz> Better?',
      content: (
        <>
          {' '}
          <p>
            We want to make the Itheum {`<BiTz>`} XP System better! Do you have
            any questions or ideas for us or just want to know more? Head over
            to our{' '}
            <a
              className="!text-[#7a98df] hover:underline"
              href="https://itheum.io/discord"
              target="blank"
            >
              Discord
            </a>{' '}
            and speak to us or{' '}
            <a
              className="!text-[#7a98df] hover:underline"
              href="https://forms.gle/muA4XiD2ddQis4G78"
              target="blank"
            >
              Send us your utility ideas for {`<BiTz>`} here.
            </a>{' '}
          </p>
        </>
      ),
    },
  ];

  return (
    <div
      id="faq"
      className="flex flex-col max-w-[100%] border border-[#35d9fa] p-[2rem] rounded-[1rem] mt-[3rem]"
    >
      <div className="flex flex-col mb-8 items-center justify-center">
        <h2 className="text-foreground text-4xl mb-2">FAQs</h2>
        <span className="text-base text-foreground/75 text-center ">
          Explore our frequently asked questions and answers.
        </span>
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
