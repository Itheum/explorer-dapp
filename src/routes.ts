import { dAppName } from "config";
import { RouteType } from "libs/types";
import { DeepForestMusic } from "pages/AppMarketplace/DeepForestMusic/DeepForestMusic";
import GetBitz from "pages/AppMarketplace/GetBitz";
import { ItheumTrailblazer } from "pages/AppMarketplace/ItheumTrailblazer/ItheumTrailblazer";
import { NFPodcast } from "pages/AppMarketplace/NFPodcast";
import { NFTunes } from "pages/AppMarketplace/NFTunes";
import { SpreadsheetNfts } from "pages/AppMarketplace/SpreadsheetNfts";
import { TimeCapsule } from "pages/AppMarketplace/TimeCapsule/TimeCapsule";
import { TimeCapsuleXDay } from "pages/AppMarketplace/TimeCapsuleXDay/TimeCapsuleXDay";
import { withPageTitle } from "./components/PageTitle";
import { Home, MyWallet, MultiversxBubbles, MultiversxInfographics, BoberGameRoom, AnalyticsPage, GamerPassport, AIWorkforce } from "./pages";

export const routeNames = {
  home: "/",
  unlock: "/unlock",
  analytics: "/analytics",
  mywallet: "/my-wallet",
  playstationgamerpassport: "/gamer-passport",
  itheumtrailblazer: "/project-trailblazer",
  esdtBubble: "/esdt-bubbles",
  multiversxbubbles: "/multiversx-bubbles",
  multiversxinfographics: "/multiversx-infographics",
  nftunes: "/nftunes",
  deepforestmusic: "/deep-forest-music-data-nft",
  timecapsule: "/timecapsule",
  timecapsulexday: "/xday-timecapsule",
  getbitz: "/getbitz",
  bobergameroom: "/bobergameroom",
  spreadsheetnfts: "/spreadsheetnfts",
  nfpodcast: "/nfpodcast",
  gamerpassport: "/gamerpassport",
  aiworkforce: "/aiworkforce",
};

interface RouteWithTitleType extends RouteType {
  title: string;
}

export const routes: RouteWithTitleType[] = [
  {
    path: routeNames.home,
    title: "Home",
    component: Home,
  },
  {
    path: routeNames.analytics,
    title: "Analytics",
    component: AnalyticsPage,
  },
  {
    path: routeNames.mywallet,
    title: "My Wallet",
    component: MyWallet,
    authenticatedRoute: false,
  },
  {
    path: routeNames.itheumtrailblazer,
    title: "TrailBlazer",
    component: ItheumTrailblazer,
    authenticatedRoute: false,
  },
  {
    path: routeNames.multiversxbubbles,
    title: "MultiversX Bubbles",
    component: MultiversxBubbles,
    authenticatedRoute: false,
  },
  {
    path: routeNames.multiversxinfographics,
    title: "MultiversX Infographics",
    component: MultiversxInfographics,
    authenticatedRoute: false,
  },
  {
    path: routeNames.nftunes,
    title: "NFTunes",
    component: NFTunes,
    authenticatedRoute: false,
  },
  {
    path: routeNames.deepforestmusic,
    title: "Deep Forest Music Data NFT",
    component: DeepForestMusic,
    authenticatedRoute: false,
  },
  {
    path: routeNames.timecapsule,
    title: "Time Capsule",
    component: TimeCapsule,
    authenticatedRoute: false,
  },
  {
    path: routeNames.timecapsulexday,
    title: "MultiversX xDay Time Capsule",
    component: TimeCapsuleXDay,
    authenticatedRoute: false,
  },
  {
    path: routeNames.getbitz,
    title: "Get Bitz",
    component: GetBitz,
    authenticatedRoute: false,
  },
  {
    path: routeNames.bobergameroom,
    title: "Bober Game Room",
    component: BoberGameRoom,
    authenticatedRoute: false,
  },
  {
    path: routeNames.spreadsheetnfts,
    title: "Spreadsheet NFTs",
    component: SpreadsheetNfts,
    authenticatedRoute: false,
  },
  {
    path: routeNames.nfpodcast,
    title: "NFPodcast",
    component: NFPodcast,
    authenticatedRoute: false,
  },
  {
    path: routeNames.gamerpassport,
    title: "Gamer Passport",
    component: GamerPassport,
  },
  {
    path: routeNames.aiworkforce,
    title: "AI Data Workforce",
    component: AIWorkforce,
  },
];

export const mappedRoutes = routes.map((route) => {
  const title = route.title ? `${route.title} • ${dAppName}` : `${dAppName}`;

  const requiresAuth = Boolean(route.authenticatedRoute);
  const wrappedComponent = withPageTitle(title, route.component);

  return {
    path: route.path,
    component: wrappedComponent,
    authenticatedRoute: requiresAuth,
  };
});
