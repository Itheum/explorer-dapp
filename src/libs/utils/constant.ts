import iconBubbleMaps from "assets/img/expl-app-bubblemaps-icon.png";
import iconInfrographics from "assets/img/expl-app-infographics-icon.png";
import iconTrailblazer from "assets/img/expl-app-trailblazer-icon.png";
import iconTimeCapsule from "assets/img/timecapsule/expl-app-timecapsule-icon.png";
import iconNFTunes from "assets/img/nf-tunes-logo.png";
import iconGetBits from "assets/img/getbits/expl-app-getbits-icon.gif";

export const ERROR_CONNECT_WALLET = "Connect your wallet";
export const ERROR_TRANSACTION_ONGOING = "A transaction is ongoing";
export const ERROR_DATA_LOADING = "Data is still loading";

export const APP_MAPPINGS = [
  {
    appName: "Get <BiTS> Points",
    appDescription: "Collect Itheum <BiTS> Points",
    routeKey: "getbits",
    desc: "Consider yourself a Itheum OG and data ownership pioneer? Open this app to get <BiTS> points, <BiTS> points are like Data Ownership OG XP. Let's Get <BiTS>!",
    img: iconGetBits,
  },
  {
    appName: "TrailBlazer",
    appDescription: "TrailBlazer Quest App",
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
    appDescription: "MultiversX Datasets Visualized",
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
    appDescription: "View Dynamic Infographic PDFs",
    routeKey: "multiversxinfographics",
    desc: 'This app visualizes dynamic and evolving data streams rendered into PDF files that showcase unique MultiversX ecosystem "alpha", insights, and education.',
    img: iconInfrographics,
  },
  {
    appName: "NF-Tunes",
    appDescription: "Listen to Music Playlists",
    routeKey: "nftunes",
    desc: "Explore a multisensory journey with this app, extending art beyond visuals. Through vibrations, it unveils the creative potentials of Data NFTs, offering a unique and immersive experience.",
    img: iconNFTunes,
  },
  {
    appName: "Time Capsule",
    appDescription: "Preserve Memories Forever",
    routeKey: "timecapsule",
    desc: "Capture, archive, and relive historic social media events through photos and videos, preserving memories for future generations. Join the nostalgia journey!",
    img: iconTimeCapsule,
  },
];

export const ITHEUM_EXPLORER_PROD_URL = "https://explorer.itheum.io";
export const ITHEUM_EXPLORER_STG_URL = "https://stg.explorer.itheum.io";
export const ITHEUM_EXPLORER_TEST_URL = "https://test.explorer.itheum.io";
export const ITHEUM_DATADEX_PROD_URL = "https://datadex.itheum.io";
export const ITHEUM_DATADEX_STG_URL = "https://stg.datadex.itheum.io";
export const ITHEUM_DATADEX_TEST_URL = "https://test.datadex.itheum.io";
export const ZEDGE_STORAGE_PROD_URL = "https://www.zedgestorage.com";
export const ZEDGE_STORAGE_TEST_URL = "https://www.test.zedgestorage.com";

export const nativeAuthOrigins = () => {
  return [ITHEUM_DATADEX_PROD_URL, ITHEUM_DATADEX_STG_URL, ITHEUM_DATADEX_TEST_URL, window.location.origin];
};
