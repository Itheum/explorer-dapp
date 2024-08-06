import * as React from "react";
import { Link } from "react-router-dom";
import { SUPPORTED_APPS, FEATURED_APPS } from "appsConfig";
import GamerPassportHero from "assets/img/gamer-passport/gamer-passport-adaptor-hero.png";
import RecentDataNFTsSection from "components/RecentDataNftsSection";
import TrendingSection from "components/TrendingSection";
import { APP_MAPPINGS } from "libs/utils/constant";
import { routeNames } from "routes";
import { HeaderComponent } from "../components/Layout/HeaderComponent";
import { Button } from "../libComponents/Button";
import { AnalyticsSnapshot } from "../pages/Analytics/AnalyticsSnapshot";

export function returnRoute(routeKey: string) {
  return (routeNames as any)[routeKey];
}

export const Home = () => {
  return (
    <HeaderComponent pageTitle={""} hasImage={false}>
      <div className="flex flex-col">
        <div
          id="gamer-passport-cta"
          className="mt-2 bg-red-000 h-[230px] bg-no-repeat bg-contain bg-top md:bg-fixed rounded-3xl"
          style={{ "backgroundImage": `url(${GamerPassportHero})` }}>
          <div className="flex flex-col bg-red-000 h-[100%] justify-center items-center">
            <h1 className="!text-white !text-xl text-center md:!text-3xl mb-2">Gamer Passport is On-Boarding Gamers...</h1>
            <h2 className="!text-white !text-sm text-center md:!text-xl mb-5">Earn $ITHEUM rewards for playing games</h2>
            <Link to={routeNames.gamerpassport} className="text-base hover:!no-underline hover:text-black">
              <div className="w-[7.5rem] relative bg-gradient-to-r from-yellow-300 to-orange-500 px-[1px] py-[1px] rounded-md justify-center">
                <div className="bg-background rounded-md">
                  <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                    Join Now
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <hr className="w-48 h-1 mx-auto my-4 bg-gray-300 border-0 rounded md:my-10 dark:bg-gray-700"></hr>

        <div className="">
          <h2 className="!text-2xl md:!text-3xl text-center">Featured Data Widget Apps</h2>
          <div className="flex flex-row flex-wrap gap-x-8 mt-5 justify-center md:justify-around">
            {APP_MAPPINGS.filter((app) => FEATURED_APPS.includes(app.routeKey)).map((item) => (
              <div key={item.routeKey} className="mb-10 w-[341px]">
                <div className="mb-4 border-[0.5px] rounded-t-[30px] border-neutral-500/90">
                  <Link to={returnRoute(item.routeKey)}>
                    <img className="w-[464.29px] h-[250px] rounded-t-[30px]" src={item.img} alt="Apps" />
                  </Link>
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
          </div>
        </div>

        <hr className="w-48 h-1 mx-auto my-4 bg-gray-300 border-0 rounded md:my-10 dark:bg-gray-700"></hr>

        <div className="">
          <h2 className="!text-2xl md:!text-3xl text-center">Protocol Activity</h2>
          <div className="flex flex-row flex-wrap gap-x-8 mt-5">
            <AnalyticsSnapshot />
          </div>
          <div className="pt-10 flex justify-center">
            <Link to={routeNames.analytics} className="text-base hover:!no-underline hover:text-black">
              <div className="w-[7.5rem] relative bg-gradient-to-r from-yellow-300 to-orange-500 px-[1px] py-[1px] rounded-md justify-center">
                <div className="bg-background rounded-md">
                  <Button className="text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                    View All
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <hr className="w-48 h-1 mx-auto my-4 bg-gray-300 border-0 rounded md:my-10 dark:bg-gray-700"></hr>

        <div className="mt-5">
          <h2 className="!text-2xl md:!text-3xl text-center">All Data Widget Apps</h2>
          <div className="flex flex-row flex-wrap gap-x-8 mt-5 justify-center md:justify-around md:after:content-[''] md:after:flex-auto">
            {APP_MAPPINGS.filter((app) => SUPPORTED_APPS.filter((i) => !FEATURED_APPS.includes(i)).includes(app.routeKey)).map((item) => (
              <div key={item.routeKey} className="mb-10 w-[341px]">
                <div className="mb-4 border-[0.5px] rounded-t-[30px] border-neutral-500/90">
                  <Link to={returnRoute(item.routeKey)}>
                    <img className="w-[464.29px] h-[250px] rounded-t-[30px]" src={item.img} alt="Apps" />
                  </Link>
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
          </div>
        </div>

        <hr className="w-48 h-1 mx-auto my-4 bg-gray-300 border-0 rounded md:my-10 dark:bg-gray-700"></hr>

        <div className="flex flex-col">
          <TrendingSection />
          <RecentDataNFTsSection />
        </div>

        <hr className="w-48 h-1 mx-auto my-4 bg-gray-300 border-0 rounded md:my-10 dark:bg-gray-700"></hr>
      </div>
    </HeaderComponent>
  );
};
