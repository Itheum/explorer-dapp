import * as React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { SUPPORTED_APPS } from "appsConfig";
import { APP_MAPPINGS } from "libs/utils/constant";
import { routeNames } from "routes";
import { HeaderComponent } from "../components/Layout/HeaderComponent";
import { logout } from "../helpers";
import { useGetIsLoggedIn } from "../hooks";
import { Button } from "../libComponents/Button";
import { useLocalStorageStore } from "../store/LocalStorageStore.ts";

export function returnRoute(routeKey: string) {
  return (routeNames as any)[routeKey];
}

export const Home = () => {
  const isLoggedIn = useGetIsLoggedIn();
  const { appVersion, setAppVersion } = useLocalStorageStore();
  const handleLogout = () => {
    logout(`${window.location.origin}`, undefined, false);
  };

  useEffect(() => {
    if (isLoggedIn && appVersion !== localStorage.getItem("app-version")) {
      localStorage.setItem("app-version", appVersion ?? "");
      handleLogout();
    }
  }, [appVersion]);

  return (
    <HeaderComponent
      pageTitle={"Data Widget Marketplace"}
      subTitle={
        "Itheum Data Widgets are lightweight apps powered by Data NFTs, enabling creative ways to open, visualize and discover the potential of the raw data found within Data NFTs."
      }
      hasImage={false}>
      {APP_MAPPINGS.filter((app) => SUPPORTED_APPS.includes(app.routeKey)).map((item) => (
        <div key={item.routeKey} className="mb-10 w-[341px]">
          <div className="mb-4 border-[0.5px] rounded-t-[30px] border-neutral-500/90">
            <img className="w-[464.29px] h-[250px] rounded-t-[30px]" src={item.img} alt="Apps" />
          </div>
          <h3 className="!font-[Clash-Medium]">{item.appName}</h3>
          <p className="h-[100px] text-foreground font-[Satoshi-Light] mt-1">{item.desc}</p>
          <div className="pt-5">
            <Link to={returnRoute(item.routeKey)} className="text-base hover:!no-underline hover:text-black">
              <div className="w-[7.5rem] relative bg-gradient-to-r from-yellow-300 to-orange-500 px-[1px] py-[1px] rounded-md justify-center">
                <div className="bg-background rounded-md">
                  <Button className="text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                    Launch
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </HeaderComponent>
  );
};
