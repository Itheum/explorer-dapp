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
} from "./pages";

export const routeNames = {
  home: "/",
  dashboard: "/dashboard",
  unlock: "/unlock",
  mylisted: "/my-listed",
  mywallet: "/my-wallet",
  cantinacorner: "/cantina-corner-poc",
  gamerpassportgamer: "/gamer-passport-gamer-poc",
  playstationgamerpassport: "/playstation-gamer-passport-poc",
  itheumtrailblazer: "/itheum-trailblazer-poc",
  esdtBubble: "/esdt-bubble-poc",
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
    title: "Sony Playstation Data Passport",
    component: PlayStationGamer,
    authenticatedRoute: false,
  },
  {
    path: routeNames.itheumtrailblazer,
    title: "Trailblazer",
    component: ItheumTrailblazer,
    authenticatedRoute: false,
  },
  {
    path: routeNames.esdtBubble,
    title: "ESDT Bubbles",
    component: EsdtBubble,
    authenticatedRoute: false,
  },
];

export const mappedRoutes = routes.map((route) => {
  const title = route.title
    ? `${route.title} • MultiversX ${dAppName}`
    : `MultiversX ${dAppName}`;

  const requiresAuth = Boolean(route.authenticatedRoute);
  const wrappedComponent = withPageTitle(title, route.component);

  return {
    path: route.path,
    component: wrappedComponent,
    authenticatedRoute: requiresAuth,
  };
});
