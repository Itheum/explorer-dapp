import { dAppName } from "config";
import { RouteType } from "libs/types";
import { ItheumTrailblazer } from "pages/ItheumTrailblazer";
import { withPageTitle } from "./components/PageTitle";
import {
  CantinaCorner,
  GamerPassportGamer,
  PlayStationGamer,
  Dashboard,
  Home,
  MyListed,
  MyWallet,
  EsdtBubble,
  MultiversxBubbles,
  MultiversxInfographics,
  MintNewCollection,
  TutorialsEnterprise,
} from "./pages";

export const routeNames = {
  home: "/",
  dashboard: "/dashboard",
  unlock: "/unlock",
  mylisted: "/my-listed",
  mywallet: "/my-wallet",
  cantinacorner: "/cantina-corner-poc",
  gamerpassportgamer: "/gamer-passport-gamer-poc",
  playstationgamerpassport: "/gamer-passport",
  itheumtrailblazer: "/project-trailblazer",
  esdtBubble: "/esdt-bubbles",
  multiversxbubbles: "/multiversx-bubbles",
  multiversxinfographics: "/multiversx-infographics",
  tutorials: "/tutorials",
  tutorialsenterprise: "/tutorialsenterprise",
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
    path: routeNames.dashboard,
    title: "Dashboard",
    component: Home,
    authenticatedRoute: false,
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
    authenticatedRoute: true,
  },
  {
    path: routeNames.cantinacorner,
    title: "Cantina Corner",
    component: CantinaCorner,
    authenticatedRoute: false,
  },
  {
    path: routeNames.gamerpassportgamer,
    title: "Web3 Gamer Passport",
    component: GamerPassportGamer,
    authenticatedRoute: false,
  },
  {
    path: routeNames.playstationgamerpassport,
    title: "PlayStation Gamer Passport",
    component: PlayStationGamer,
    authenticatedRoute: false,
  },
  {
    path: routeNames.itheumtrailblazer,
    title: "TrailBlazer",
    component: ItheumTrailblazer,
    authenticatedRoute: false,
  },
  {
    path: routeNames.esdtBubble,
    title: "ESDT Bubbles",
    component: EsdtBubble,
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
    path: routeNames.tutorials,
    title: "SDK Tutorials",
    component: MintNewCollection,
    authenticatedRoute: false,
  },
  {
    path: routeNames.tutorialsenterprise,
    title: "SDK Tutorials - Enterprise",
    component: TutorialsEnterprise,
    authenticatedRoute: false,
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
