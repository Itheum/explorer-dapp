import { dAppName } from "config";
import { RouteType } from "libs/types";
import { DeepForestMusic } from "pages/AppMarketplace/DeepForestMusic/DeepForestMusic";
import { ItheumTrailblazer } from "pages/AppMarketplace/ItheumTrailblazer/ItheumTrailblazer";
import { NFPodcast } from "pages/AppMarketplace/NFPodcast";
import { NFTunes } from "pages/AppMarketplace/NFTunes";
import { SpreadsheetNfts } from "pages/AppMarketplace/SpreadsheetNfts";
import { TimeCapsule } from "pages/AppMarketplace/TimeCapsule/TimeCapsule";
import { withPageTitle } from "./components/PageTitle";
import { Home, MyListed, MyWallet, MultiversxBubbles, MultiversxInfographics, GetBitz, BoberGameRoom, AnalyticsPage, GamerPassport } from "./pages";

export const routeNames = {
  home: "/",
  unlock: "/unlock",
  analytics: "/analytics",
  mylisted: "/my-listed",
  mywallet: "/my-wallet",
  playstationgamerpassport: "/gamer-passport",
  itheumtrailblazer: "/project-trailblazer",
  esdtBubble: "/esdt-bubbles",
  multiversxbubbles: "/multiversx-bubbles",
  multiversxinfographics: "/multiversx-infographics",
  nftunes: "/nftunes",
  deepforestmusic: "/deep-forest-music-data-nft",
  timecapsule: "/timecapsule",
  getbitz: "/getbitz",
  bobergameroom: "/bobergameroom",
  spreadsheetnfts: "/spreadsheetnfts",
  nfpodcast: "/nfpodcast",
  gamerpassport: "/gamerpassport",
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
    path: routeNames.mylisted,
    title: "My Listed",
    component: MyListed,
    authenticatedRoute: true,
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
];

export const mappedRoutes = routes.map((route) => {
  const title = route.title ? `${route.title} • MultiversX ${dAppName}` : `MultiversX ${dAppName}`;

  const requiresAuth = Boolean(route.authenticatedRoute);
  const wrappedComponent = withPageTitle(title, route.component);

  return {
    path: route.path,
    component: wrappedComponent,
    authenticatedRoute: requiresAuth,
  };
});
