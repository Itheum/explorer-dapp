import * as React from "react";
import { Link } from "react-router-dom";
import { SUPPORTED_APPS } from "config";
import { APP_MAPPINGS } from "libs/utils/constant";
import { routeNames } from "routes";
import { HeaderComponent } from "../components/Layout/HeaderComponent";
import { Button } from "../libComponents/Button";

export function returnRoute(routeKey: string) {
  return (routeNames as any)[routeKey];
}

export const Home = () => {
  return (
    <HeaderComponent pageTitle={"App Marketplace"} hasImage={false}>
      {APP_MAPPINGS.filter((app) => SUPPORTED_APPS.includes(app.routeKey)).map((item) => (
        <div key={item.routeKey} className="mb-3 w-[341px]">
          <div className="  mb-4 border-[0.5px] rounded-t-[30px] border-neutral-500/90">
            <img className="w-[464.29px] h-[250px] rounded-t-[30px]" src={item.img} alt="Apps" />
          </div>
          <h3 className=" !font-[Clash-Medium]">{item.appName}</h3>
          <p className="h-[100px] dark:text-slate-100/90 text-slate-500 font-[Satoshi-Light] mt-1">{item.desc}</p>
          <Link to={returnRoute(item.routeKey)} className="text-base hover:!no-underline hover:text-black">
            <div className="w-[121px] relative bg-gradient-to-r from-yellow-300 to-orange-500 px-[1px] py-[1px] rounded-md justify-center ">
              <div className="dark:bg-black bg-slate-50 rounded-md ">
                <Button className="relative left-2 bottom-1.5 text-base bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[6px] hover:scale-100">
                  Launch App
                </Button>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </HeaderComponent>
  );
};
