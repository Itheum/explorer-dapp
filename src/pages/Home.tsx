import * as React from "react";
import { Link } from "react-router-dom";
import { SUPPORTED_APPS, FEATURED_APPS } from "appsConfig";
import GamerPassportHero from "assets/img/gamer-passport/gamer-passport-adaptor-hero.png";
import RecentDataNFTsSection from "components/RecentDataNftsSection";
import TrendingSection from "components/TrendingSection";
import { APP_MAPPINGS } from "libs/utils/constant";
import { routeNames } from "routes";
import { Button } from "../libComponents/Button";
import { AIWorkforceTopN } from "../pages/AIWorkforce/AIWorkforce";
import { AnalyticsSnapshot } from "../pages/Analytics/AnalyticsSnapshot";

export function returnRoute(routeKey: string) {
  return (routeNames as any)[routeKey];
}

export const Home = () => {
  return (
    <div className="flex flex-col py-2">
      <div className="flex flex-col md:flex-row">
        <div
          id="nf-tunes-cta"
          className="flex-1 border-[0.5px] border-neutral-500/90 mt-2 md:h-[300px] bg-no-repeat bg-cover rounded-3xl mx-2 py-5 md:py-1"
          style={{
            "backgroundImage": `url(https://assetspublic-itheum-ecosystem.s3.eu-central-1.amazonaws.com/app_nftunes/images/featured_hero/manu_retrofy.jpg)`,
          }}>
          <div className="flex flex-col bg-red-000 h-[100%] justify-center items-center">
            <h1 className="!text-white !text-xl text-center md:!text-3xl mb-2">YFGP "Retrofy" Digital EP Live!</h1>
            <h2 className="!text-white !text-sm text-center md:!text-xl mb-5">Data NFT powered Music Stream</h2>
            <Link to={routeNames.nftunes} className="text-base hover:!no-underline hover:text-black">
              <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                Listen Now
              </Button>
            </Link>
          </div>
        </div>
        <div
          id="gamer-passport-cta"
          className="flex-1 border-[0.5px] border-neutral-500/90 mt-2 md:h-[300px] bg-no-repeat bg-cover rounded-3xl mx-2 py-5 md:py-1"
          style={{ "backgroundImage": `url(${GamerPassportHero})` }}>
          <div className="flex flex-col bg-red-000 h-[100%] justify-center items-center">
            <h1 className="!text-white !text-xl text-center md:!text-3xl mb-2">Gamer Passport is Live</h1>
            <h2 className="!text-white !text-sm text-center md:!text-xl mb-5">Earn $ITHEUM rewards for playing games</h2>
            <Link to={routeNames.gamerpassport} className="text-base hover:!no-underline hover:text-black">
              <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                Join Now
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <hr className="w-48 h-1 mx-auto my-10 bg-gray-300 border-0 rounded dark:bg-gray-700"></hr>

      <div className="">
        <h2 className="!text-2xl md:!text-3xl text-center">Featured Apps</h2>
        <div className="flex flex-row flex-wrap gap-x-8 mt-5 justify-center">
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

      <hr className="w-48 h-1 mx-auto my-10 bg-gray-300 border-0 rounded dark:bg-gray-700"></hr>

      <div className="">
        <h2 className="!text-2xl md:!text-3xl text-center">Top 5 Ranked Itheum AI Workforce</h2>
        <div className="flex flex-row flex-wrap gap-x-8 mt-5">
          <AIWorkforceTopN showItems={6} />
        </div>
        <div className="flex justify-center">
          <Link to={routeNames.aiworkforce} className="text-base hover:!no-underline hover:text-black">
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

      <hr className="w-48 h-1 mx-auto my-10 bg-gray-300 border-0 rounded dark:bg-gray-700"></hr>

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

      <hr className="w-48 h-1 mx-auto my-10 bg-gray-300 border-0 rounded dark:bg-gray-700"></hr>

      <div className="mt-5">
        <h2 className="!text-2xl md:!text-3xl text-center">All Apps</h2>
        <div className="flex flex-row flex-wrap gap-x-8 mt-5 justify-center">
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

      <hr className="w-48 h-1 mx-auto my-10 bg-gray-300 border-0 rounded dark:bg-gray-700"></hr>

      <div className="flex flex-col">
        <TrendingSection />
        <RecentDataNFTsSection />
      </div>

      <hr className="w-48 h-1 mx-auto my-10 bg-gray-300 border-0 rounded dark:bg-gray-700"></hr>
    </div>
  );
};
