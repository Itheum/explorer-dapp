import iconBubbleMaps from "assets/img/expl-app-bubblemaps-icon.png";
import iconInfrographics from "assets/img/expl-app-infographics-icon.png";
import iconTrailblazer from "assets/img/expl-app-trailblazer-icon.png";
import iconNFTunes from "assets/img/nf-tunes-logo.png";

export const ERROR_CONNECT_WALLET = "Connect your wallet";
export const ERROR_TRANSACTION_ONGOING = "A transaction is ongoing";
export const ERROR_DATA_LOADING = "Data is still loading";

export const APP_MAPPINGS = [
  {
    appName: "TrailBlazer",
    appDescription: "TrailBlazer Data NFT",
    routeKey: "itheumtrailblazer",
    desc: "Hardcore community members unlock Project Alpha by owning their favorite project's TrailBlazer Data NFTs. Unlock and visualize these TrailBlazer Data NFTs by using this app.",
    img: iconTrailblazer,
  },
  {
    appName: "MultiversX ESDT Bubbles",
    appDescription: "MultiversX ESDT Bubbles Data NFT",
    routeKey: "esdtBubble",
    desc: "ESDT is the native token standard of the MultiversX blockchain. This app visualizes the dynamic data stream of various ESDT token insights as bubble graphs.",
    img: "https://itheum-static.s3.ap-southeast-2.amazonaws.com/expl-app-esdt-bubbles-icon.png",
  },
  {
    appName: "MultiversX Bubbles",
    appDescription: "MultiversX Bubbles Data NFT",
    routeKey: "multiversxbubbles",
    desc: "This app visualizes dynamic data streams of various MultiversX ecosystem metrics and insights as bubble graphs. Get MultiversX ecosystem alpha today!",
    img: iconBubbleMaps,
  },
  {
    appName: "PlayStation Gamer Passport",
    appDescription: "PlayStation Gamer Passport Data NFT",
    routeKey: "playstationgamerpassport",
    desc: "There are over 110 million active Sony Playstation gamers, and now, they can own some of their data. Unlock these PlatStation gamers Data NFTs by using this app.",
    img: "https://itheum-static.s3.ap-southeast-2.amazonaws.com/expl-app-playstation-icon.png",
  },
  {
    appName: "MultiversX Infographics",
    appDescription: "MultiversX Infographics Data NFT",
    routeKey: "multiversxinfographics",
    desc: 'This app visualizes dynamic and evolving data streams rendered into PDF files that showcase unique MultiversX ecosystem "alpha", insights, and education.',
    img: iconInfrographics,
  },
  {
    appName: "NF-Tunes",
    appDescription: "MultiversX Music Data NFT",
    routeKey: "nftunes",
    desc: "Explore a multisensory journey with this app, extending art beyond visuals. Through vibrations, it unveils the creative potentials of Data NFTs, offering a unique and immersive experience.",
    img: iconNFTunes,
  },
];

export const ITHEUM_EXPLORER_URL = "https://explorer.itheum.io";
export const ITHEUM_DATADEX_URL = "https://datadex.itheum.io";
