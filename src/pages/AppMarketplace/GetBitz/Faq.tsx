import React from "react";
import QuestionCard from "./QuestionCard";

const Faq: React.FC = () => {
  const faqs = [
    {
      title: "What are Itheum `<BiTz>` Points?",
      content: [
        `Think of them as XP (Experience Points) of the Itheum Protocol, we also like to call them "Data Ownership OG (Original Gangster) XP" and if you consider yourself an Itheum OG and love Data Ownership, then we absolutely think you are a pioneer and \`<BiTz>\` is the Itheum XP system for you!!`,
        `You need to use Data NFT and Itheum Core Infrastructure to collect your \`<BiTz>\` XP, and this exact Web3/Blockchain based product stack can be used by you to empower you to take ownership of and tokenize your data. So in essence, you are using Data Ownership + Data Tokenization technology and learning about how you can take ownership of you data! Welcome Itheum Data Ownership OG!`,
      ],
    },
    {
      title: "Why are `<BiTz>` Points Important?",
      content: [
        `On top of being Itheum Protocol XP, they also signal your "liveliness" as a human and not a BOT. This is a form of "reputation signalling" of you as a human within the Itheum ecosystem, this reputation signalling is a very powerful concept when you link it to "data ownership" as it add a layer of "proof of humanity" to the Itheum Protocol.`,
        `There will be a wave of new "liveliness & reputation signalling" features launching within the Itheum protocol in the very near future, and \`<BiTz>\` XP is the first such "liveliness & reputation signalling" features to launch`,
      ],
    },
    {
      title: "How can I collect `<BiTz>` Points?",
      content: [
        `You need to hold a \`<BiTz>\` compatible Data NFT in your wallet to play the Get \`<BiTz>\` game (you are on this page now). This Data NFT was airdropped in waves to OGs of the Itheum Protocol, but fear not, you can also get it on any NFT Marketplace (if the OGs broke our hearts and parted ways with their Data NFTs). If this "Series 1" \`<BiTz>\` Data NFT is successful, there may be a follow-up Series of \`<BiTz>\` Data NFTs launched and airdropped as well.`,
        `Once you have the Data NFT in your wallet, you can play the Game every 6 Hours (\${BIT_GAME_WINDOW_HOURS} Hours in "Launch Window"). You have to burn a Meme and sacrifice it to the \`<BiTz>\` Generator God and then based on pure random chance, you win \`<BiTz>\`!`,
        `You DO NOT need to spend any gas to Play the Get \`<BiTz>\`! SAY WAT?!`,
        `But in the near future, the Get \`<BiTz>\` game won't be the only way to collect \`<BiTz>\` points, if you stay "active" on the Itheum Protocol, you will be rewarded with bonus \`<BiTz>\` points as well. For example, if you use the Data DEX to explore and "favorite" the Data NFTs and Data Creators you like or if you use features like "Data Uptime Checks" or use Data Widgets inside the Itheum Explorer, all these Itheum Protocol "activity" will have \`<BiTz>\` bonus points attached to it and sent to you!`,
      ],
      links: [
        {
          text: "Data DEX",
          url: "https://datadex.itheum.io/datanfts/marketplace/market",
        },
      ],
    },
    {
      "title": "Where can I play the Get {`<BiTz>`} Game?",
      "content": [
        "The Get {`<BiTz>`} app is available on the Itheum Data DApp. You can start playing by connecting your wallet. Make sure to participate actively to climb the LEADERBOARD!",
      ],
      "links": [
        {
          "text": "Itheum Data DApp",
          "url": "https://data.itheum.io",
        },
      ],
    },
    {
      "title": "What can I do with Itheum {`<BiTz>`} Points?",
      "content": [
        'Currently, Itheum {`<BiTz>`} Points can be used to climb the LEADERBOARD and earn bragging rights among the Itheum community. In the future, we\'re exploring options to let you "gift" these points to your favorite Data Creators or redeem them for other perks within the Itheum Ecosystem. Stay tuned for updates!',
      ],
    },
    {
      "title": "Can I move Itheum {`<BiTz>`} Points Between my Wallets?",
      "content": [
        "Lost your primary wallet or want to move Itheum {`<BiTz>`} to your new wallet? Unfortunately, this is not possible right now (it MAY be in the future - but no guarantee). So make sure you get {`<BiTz>`} in the wallet you treasure the most.",
      ],
    },
    {
      "title": "Why is it Called {`<BiTz>`}?",
      "content": [
        "Itheum is a data ownership protocol that is trying to break the current cycle of data exploitation. A Bit is the smallest unit of data. Let's break the cycle of data exploitation one {`<BiT>`} at a time.",
      ],
    },
    {
      "title": "Will this {`<BiTz>`} App become a Playable Game?",
      "content": [
        'We are not game developers and don\'t pretend to be, so are waiting for an A.I tool that will build the game for us. We\'d love for the Get {`<BiTz>`} app to become a hub of "Mini-Games" where you win {`<BiTz>`} XP. Are you an A.I or a Game Dev and want to build a game layer for the Itheum {`<BiTz>`} XP system? Reach out and you could get a grant from via the Itheum xPand DAO program. As the entire game logic is actually inside the Data NFT, ANYONE can use our SDK and build their own game UI in front of it, this is the power and "Composability" of Itheum\'s Data NFT technology.',
      ],
      "links": [
        {
          "text": "Itheum xPand DAO program",
          "url": "https://docs.itheum.io/product-docs/protocol/governance/itheum-xpand-dao/itheum-xpand-grants-program",
        },
        {
          "text": "use our SDK",
          "url": "https://docs.itheum.io/product-docs/developers/software-development-kits-sdks/data-nft-sdk",
        },
      ],
    },

    {
      "title": "Are Itheum {`<BiTz>`} Points Blockchain Tokens?",
      "content": [
        'Nope, there are more than enough meme coins out there and we don\'t need more. Itheum {`<BiTz>`} are simple XP to "gamify" usage of the Itheum Protocol infrastructure. The $ITHEUM token is the primary utility token of the entire Itheum Ecosystem.',
      ],
    },
    {
      "title": "Are Itheum {`<BiTz>`} Points Tradable?",
      "content": [
        'We are heart-broken that you asked :( and nope you can\'t as they are not blockchain tokens (see above). But we are looking at possibilities of where you can "gift" them to Data Creators who mint Data NFT Collections. "Gifting" Itheum {`<BiTz>`} will have its own LEADERBOARD and perks ;)',
      ],
    },
    {
      "title": "Can I use Multiple Wallets to Claim {`<BiTz>`} XP?",
      "content": [
        'If you do this, you will "fragment" your XP and you wont get much benefits so it\'s best you use your primary identity wallet to collect {`<BiTz>`} XP. BUT, we also know that many "hunters" may try and do this to game (sybil attack) the LEADERBOARD and it will disadvantage the regular genuine users. We are rolling out some new blockchain powered "liveliness & reputation signalling" features that should prevent or drastically reduce such XP sybil attacks.',
      ],
    },
    {
      "title": "Can I move Itheum {`<BiTz>`} Points Between my Wallets?",
      "content": [
        "Lost your primary wallet or want to move Itheum {`<BiTz>`} to your new wallet? unfortunately, this is not possible right now (it MAY be in the future - but no guarantee). So make sure you get {`<BiTz>`} in the wallet you treasure the most.",
      ],
    },
    {
      "title": "Why is it Called {`<BiTz>`}?",
      "content": [
        "Itheum is a data ownership protocol that is trying to break the current cycle of data exploitation. A Bit is the smallest unit of data. Let's break the cycle of data exploitation one {`<BiT>`} at a time.",
      ],
    },
    {
      "title": "Will this {`<BiTz>`} App become a Playable Game?",
      "content": [
        'We are not game developers and don\'t pretend to be, so are waiting for an A.I tool that will build the game for us. We\'d love for the Get {`<BiTz>`} app to become a hub of "Mini-Games" where you win {`<BiTz>`} XP. Are you an A.I or a Game Dev and want to build a game layer for the Itheum {`<BiTz>`} XP system? reach out and you could get a grant from via the Itheum xPand DAO program. As the entire game logic is actually inside the Data NFT, ANYONE can use our SDK and build their own game UI in front of it, this is the power and "Composability" of Itheum\'s Data NFT technology.',
      ],
      "links": [
        {
          "text": "Itheum xPand DAO program",
          "url": "https://docs.itheum.io/product-docs/protocol/governance/itheum-xpand-dao/itheum-xpand-grants-program",
        },
        {
          "text": "use our SDK",
          "url": "https://docs.itheum.io/product-docs/developers/software-development-kits-sdks/data-nft-sdk",
        },
      ],
    },
  ];
  return (
    <div className="flex flex-col lg:flex-row justify-between py-16 ">
      <div className="flex flex-col  mb-8 items-start">
        <span className="text-foreground text-4xl mb-2">FAQs</span>
        <span className="text-base text-foreground/75  ">Explore our frequently asked questions and answers.</span>
      </div>
      <div className="flex flex-col gap-4 justify-center items-center md:justify-start md:items-start ">
        {faqs.map((pair, index) => (
          <QuestionCard key={index} title={pair.title} content={pair.content} />
        ))}
      </div>
    </div>
  );
};

export default Faq;
