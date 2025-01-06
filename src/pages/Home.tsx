import * as React from "react";
import { useGetAccount } from "@multiversx/sdk-dapp/hooks";
import { Link } from "react-router-dom";
import { SUPPORTED_APPS } from "appsConfig";
import featuredAppNFTunesMobileHero from "assets/img/nf-tunes/featured-app-banner-mobile.png";
import featuredAppNFTunesHero from "assets/img/nf-tunes/featured-app-banner.png";
import xDayTimeCapsuleHero from "assets/img/timecapsule/custom-app-header-timecapsule-xday.png";
import xDayTimeCapsuleHeroMobile from "assets/img/timecapsule/expl-app-timecapsule-xday-icon.png";
import HelmetPageMeta from "components/HelmetPageMeta";
import { NFMeIDBannerCTA } from "components/NFMeIDBannerCTA";
import RecentDataNFTsSection from "components/RecentDataNftsSection";
import TrendingSection from "components/TrendingSection";
import { APP_MAPPINGS } from "libs/utils/constant";
import { isMostLikelyMobile } from "libs/utils/misc";
import { routeNames } from "routes";
import { Button } from "../libComponents/Button";
import { AIWorkforceTopN } from "../pages/AIWorkforce/AIWorkforce";
import { AnalyticsSnapshot } from "../pages/Analytics/AnalyticsSnapshot";

export function returnRoute(routeKey: string) {
  return (routeNames as any)[routeKey];
}

export const Home = () => {
  const { address: addressMvx } = useGetAccount();

  return (
    <>
      <HelmetPageMeta
        title="Itheum Explorer : Explore the Itheum Protocol"
        shortTitle="Itheum Explorer"
        desc="Explore Itheum Data NFTs, Stream Web3 Music on NF-Tunes and Earn BiTz XP"
      />

      <NFMeIDBannerCTA />

      <div className="flex flex-col py-2 px-4 md:px-0">
        <div className="mt-2">
          <h1 className="!text-2xl md:!text-3xl text-center">NF-Tunes Releases</h1>
          <h2 className="dark:!text-white !text-sm text-center md:!text-xl mb-5">Data NFT powered Music</h2>

          <div className="flex flex-col md:flex-row flex-wrap p-2 pb-0 rounded-md">
            <div
              id="featured1"
              className="flex md:min-w-[25%] md:flex-1 border-[0.5px] border-neutral-500/90 mt-2 min-h-[200px] md:h-[330px] bg-no-repeat bg-cover rounded-3xl mx-2 py-5 md:py-1"
              style={{
                "backgroundImage": `url(https://api.itheumcloud.com/app_nftunes/assets/img/PhysixDudeAnglesOfIdentity.jpg)`,
                "backgroundBlendMode": "multiply",
                "backgroundColor": "#161616a3",
              }}>
              <div className="flex flex-col w-[80%] h-[100%] m-auto justify-center items-center">
                <h1 className="!text-lg !text-white text-center md:!text-3xl mb-5">Physixdude's "Angles of Identity" is Live!</h1>
                <Link to={`${routeNames.nftunes}/?artist-profile=physixdude`} className="text-base hover:!no-underline hover:text-black">
                  <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                    Listen & Collect
                  </Button>
                </Link>
              </div>
            </div>

            <div
              id="featured2"
              className="flex md:min-w-[25%] md:flex-1 border-[0.5px] border-neutral-500/90 mt-2 min-h-[200px] md:h-[330px] bg-no-repeat bg-cover rounded-3xl mx-2 py-5 md:py-1"
              style={{
                "backgroundImage": `url(https://api.itheumcloud.com/app_nftunes/assets/img/TheArtOfSelfDestruction.jpg)`,
                "backgroundBlendMode": "multiply",
                "backgroundColor": "#161616a3",
              }}>
              <div className="flex flex-col w-[80%] h-[100%] m-auto justify-center items-center">
                <h1 className="!text-lg !text-white text-center md:!text-3xl mb-5">Scooby's "The Art of Self Destruction" is Live!</h1>
                <Link to={`${routeNames.nftunes}/?artist-profile=beats-by-scooby`} className="text-base hover:!no-underline hover:text-black">
                  <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                    Listen & Collect
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row flex-wrap p-2 pt-0 rounded-md">
            <div
              className="flex md:min-w-[25%] md:flex-1 border-[0.5px] border-neutral-500/90 mt-2 min-h-[200px] md:h-[330px] bg-no-repeat bg-cover rounded-3xl mx-2 py-5 md:py-1"
              style={{
                "backgroundImage": `url(https://gateway.lighthouse.storage/ipfs/bafybeigoe7tekqogeyofpmwdnjlo62zln7fserppzdvfn563nvrwk3sqxy/72112.image_GasMoney.gif)`,
                "backgroundBlendMode": "multiply",
                "backgroundColor": "#161616a3",
              }}>
              <div className="flex flex-col w-[80%] h-[100%] m-auto justify-center items-center">
                <h1 className="!text-lg !text-white text-center md:!text-3xl mb-5">Llluna01's "Problem Child EP" is Live!</h1>
                <Link to={`${routeNames.nftunes}/?artist-profile=llluna01`} className="text-base hover:!no-underline hover:text-black">
                  <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                    Listen & Collect
                  </Button>
                </Link>
              </div>
            </div>

            <div
              className="flex md:min-w-[25%] md:flex-1 border-[0.5px] border-neutral-500/90 mt-2 min-h-[200px] md:h-[330px] bg-no-repeat bg-cover rounded-3xl mx-2 py-5 md:py-1"
              style={{
                "backgroundImage": `url(https://api.itheumcloud.com/app_nftunes/assets/img/OllyGChristmasBallad.jpg)`,
                "backgroundBlendMode": "multiply",
                "backgroundColor": "#161616a3",
              }}>
              <div className="flex flex-col w-[80%] h-[100%] m-auto justify-center items-center">
                <h1 className="!text-lg !text-white text-center md:!text-3xl mb-5">OllyG's "Christmas Ballad" is Launching!</h1>
                <Link to={`${routeNames.nftunes}/?artist-profile=olly-g`} className="text-base hover:!no-underline hover:text-black">
                  <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                    Listen & Collect
                  </Button>
                </Link>
              </div>
            </div>

            <div
              className="flex md:min-w-[25%] md:flex-1 border-[0.5px] border-neutral-500/90 mt-2 min-h-[200px] md:h-[330px] bg-no-repeat bg-cover rounded-3xl mx-2 py-5 md:py-1"
              style={{
                "backgroundImage": `url(https://api.itheumcloud.com/app_nftunes/images/artist_profile/gritbeat.png)`,
                "backgroundBlendMode": "multiply",
                "backgroundColor": "#161616a3",
              }}>
              <div className="flex flex-col w-[80%] h-[100%] m-auto justify-center items-center">
                <h1 className="!text-lg !text-white text-center md:!text-3xl mb-5">GritBeat's "Subnautical II" EP is Live!</h1>
                <Link to={`${routeNames.nftunes}/?artist-profile=gritbeat`} className="text-base hover:!no-underline hover:text-black">
                  <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                    Listen & Collect
                  </Button>
                </Link>
              </div>
            </div>

            <div
              className="flex md:min-w-[25%] md:flex-1 border-[0.5px] border-neutral-500/90 mt-2 min-h-[200px] md:h-[330px] bg-no-repeat bg-cover rounded-3xl mx-2 py-5 md:py-1"
              style={{
                "backgroundImage": `url(https://api.itheumcloud.com/app_nftunes/images/artist_profile/bogden-cobra.png)`,
                "backgroundBlendMode": "multiply",
                "backgroundColor": "#161616a3",
              }}>
              <div className="flex flex-col w-[80%] h-[100%] m-auto justify-center items-center">
                <h1 className="!text-lg !text-white text-center md:!text-3xl mb-5">Bogdan Cobra's "Sundown" EP is Launching!</h1>
                <Link to={`${routeNames.nftunes}/?artist-profile=bogdan-cobra`} className="text-base hover:!no-underline hover:text-black">
                  <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                    Listen & Collect
                  </Button>
                </Link>
              </div>
            </div>

            <div
              className="flex md:min-w-[25%] md:flex-1 border-[0.5px] border-neutral-500/90 mt-2 min-h-[200px] md:h-[330px] bg-no-repeat bg-cover rounded-3xl mx-2 py-5 md:py-1"
              style={{
                "backgroundImage": `url(https://api.itheumcloud.com/app_nftunes/images/featured_hero/manu_retrofy.jpg)`,
              }}>
              <div className="flex flex-col w-[80%] h-[100%] m-auto justify-center items-center">
                <h1 className="!text-lg !text-white text-center md:!text-3xl mb-5">YFGP's "Elements" EP is Live!</h1>
                <Link to={`${routeNames.nftunes}/?artist-profile=yfgp`} className="text-base hover:!no-underline hover:text-black">
                  <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                    Listen & Collect
                  </Button>
                </Link>
              </div>
            </div>

            <div
              className="flex md:min-w-[25%] md:flex-1 border-[0.5px] border-neutral-500/90 mt-2 min-h-[200px] md:h-[330px] bg-no-repeat bg-cover rounded-3xl mx-2 py-5 md:py-1"
              style={{
                "backgroundImage": `url(https://api.itheumcloud.com/app_nftunes/images/featured_hero/framework-fortune.jpg)`,
              }}>
              <div className="flex flex-col w-[80%] h-[100%] m-auto justify-center items-center">
                <h1 className="!text-lg !text-white text-center md:!text-3xl mb-5">Framework Fortune's "Frame Favs V1" is Live!</h1>
                <Link to={`${routeNames.nftunes}/?artist-profile=framework-fortune`} className="text-base hover:!no-underline hover:text-black">
                  <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                    Listen & Collect
                  </Button>
                </Link>
              </div>
            </div>

            <div
              className="flex md:min-w-[25%] md:flex-1 border-[0.5px] border-neutral-500/90 mt-2 min-h-[200px] md:h-[330px] bg-no-repeat bg-cover rounded-3xl mx-2 py-5 md:py-1"
              style={{
                "backgroundImage": `url(https://api.itheumcloud.com/app_nftunes/images/featured_hero/stephen-snodgrass.jpg)`,
              }}>
              <div className="flex flex-col w-[80%] h-[100%] m-auto justify-center items-center">
                <h1 className="!text-lg !text-white text-center md:!text-3xl mb-5">"TWOWEEK EP" is Live!</h1>
                <Link to={`${routeNames.nftunes}/?artist-profile=two-week`} className="text-base hover:!no-underline hover:text-black">
                  <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                    Listen & Collect
                  </Button>
                </Link>
              </div>
            </div>

            <div
              className="flex md:min-w-[25%] md:flex-1 border-[0.5px] border-neutral-500/90 mt-2 min-h-[200px] md:h-[330px] bg-no-repeat bg-cover rounded-3xl mx-2 py-5 md:py-1"
              style={{
                "backgroundImage": `url(https://api.itheumcloud.com/app_nftunes/images/featured_hero/yoshiro-mare.jpg)`,
              }}>
              <div className="flex flex-col w-[80%] h-[100%] m-auto justify-center items-center">
                <h1 className="!text-lg !text-white text-center md:!text-3xl mb-5">Yoshiro Mare "They Were Right" EP is Live!</h1>
                <Link to={`${routeNames.nftunes}/?artist-profile=yoshiro-mare`} className="text-base hover:!no-underline hover:text-black">
                  <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                    Listen & Collect
                  </Button>
                </Link>
              </div>
            </div>

            <div
              className="flex md:min-w-[25%] md:flex-1 border-[0.5px] border-neutral-500/90 mt-2 min-h-[200px] md:h-[330px] bg-no-repeat bg-cover rounded-3xl mx-2 py-5 md:py-1"
              style={{
                "backgroundImage": `url(https://api.itheumcloud.com/app_nftunes/images/featured_hero/mic-in-flames.jpg)`,
              }}>
              <div className="flex flex-col w-[80%] h-[100%] m-auto justify-center items-center">
                <h1 className="!text-lg !text-white text-center md:!text-3xl mb-5">Mic in Flames Podcast is Live!</h1>
                <Link to={`${routeNames.nftunes}/?artist-profile=flaka-ciprislg`} className="text-base hover:!no-underline hover:text-black">
                  <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                    Listen & Collect
                  </Button>
                </Link>
              </div>
            </div>

            <div
              className="flex md:min-w-[25%] md:flex-1 border-[0.5px] border-neutral-500/90 mt-2 min-h-[200px] md:h-[330px] bg-no-repeat bg-cover rounded-3xl mx-2 py-5 md:py-1"
              style={{
                "backgroundImage": `url(https://api.itheumcloud.com/app_nftunes/images/featured_hero/deep-forest.jpg)`,
              }}>
              <div className="flex flex-col w-[80%] h-[100%] m-auto justify-center items-center">
                <h1 className="!text-lg !text-white text-center md:!text-2xl mb-5">Grammy Winner Deep Forest's "Ethereal Echoes" EP is Live!</h1>
                <Link to={`${routeNames.nftunes}/?artist-profile=deep-forest`} className="text-base hover:!no-underline hover:text-black">
                  <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                    Listen & Collect
                  </Button>
                </Link>
              </div>
            </div>

            <div
              className="flex md:min-w-[25%] md:flex-1 border-[0.5px] border-neutral-500/90 mt-2 min-h-[200px] md:h-[330px] bg-no-repeat bg-cover rounded-3xl mx-2 py-5 md:py-1"
              style={{
                "backgroundImage": `url(https://api.itheumcloud.com/app_nftunes/images/featured_hero/llluna01-diaspora.jpg)`,
              }}>
              <div className="flex flex-col w-[80%] h-[100%] m-auto justify-center items-center">
                <h1 className="!text-lg !text-white text-center md:!text-3xl mb-5">Llluna01's "Diaspora" is Live!</h1>
                <Link to={`${routeNames.nftunes}/?artist-profile=llluna01`} className="text-base hover:!no-underline hover:text-black">
                  <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                    Listen & Collect
                  </Button>
                </Link>
              </div>
            </div>

            <div
              className="flex md:min-w-[25%] md:flex-1 border-[0.5px] border-neutral-500/90 mt-2 min-h-[200px] md:h-[330px] bg-no-repeat bg-cover rounded-3xl mx-2 py-5 md:py-1"
              style={{
                "backgroundImage": `url(https://api.itheumcloud.com/app_nftunes/images/featured_hero/manu_retrofy.jpg)`,
              }}>
              <div className="flex flex-col w-[80%] h-[100%] m-auto justify-center items-center">
                <h1 className="!text-lg !text-white text-center md:!text-3xl mb-5">YFGP's "Retrofy" EP is Live!</h1>
                <Link to={`${routeNames.nftunes}/?artist-profile=yfgp`} className="text-base hover:!no-underline hover:text-black">
                  <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                    Listen & Collect
                  </Button>
                </Link>
              </div>
            </div>

            <div
              className="flex md:min-w-[25%] md:flex-1 border-[0.5px] border-neutral-500/90 mt-2 min-h-[200px] md:h-[330px] bg-no-repeat bg-cover rounded-3xl mx-2 py-5 md:py-1"
              style={{
                "backgroundImage": `url(https://api.itheumcloud.com/app_nftunes/images/featured_hero/3oe.jpg)`,
              }}>
              <div className="flex flex-col w-[80%] h-[100%] m-auto justify-center items-center">
                <h1 className="!text-lg !text-white text-center md:!text-3xl mb-5">3OE's Eternal Echo EP is Live!</h1>
                <Link to={`${routeNames.nftunes}/?artist-profile=3oe`} className="text-base hover:!no-underline hover:text-black">
                  <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                    Listen & Collect
                  </Button>
                </Link>
              </div>
            </div>

            <div
              className="flex md:min-w-[25%] md:flex-1 border-[0.5px] border-neutral-500/90 mt-2 min-h-[200px] md:h-[330px] bg-no-repeat bg-cover rounded-3xl mx-2 py-5 md:py-1"
              style={{
                "backgroundImage": `url(https://api.itheumcloud.com/app_nftunes/images/featured_hero/hachi-mugen_mugen-cafe.jpg)`,
              }}>
              <div className="flex flex-col w-[80%] h-[100%] m-auto justify-center items-center">
                <h1 className="!text-lg !text-white text-center md:!text-3xl mb-5">Hachi Mugen's "Mugen Cafe" EP is Live!</h1>
                <Link to={`${routeNames.nftunes}/?artist-profile=hachi-mugen`} className="text-base hover:!no-underline hover:text-black">
                  <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                    Listen & Collect
                  </Button>
                </Link>
              </div>
            </div>

            <div
              className="flex md:min-w-[25%] md:flex-1 border-[0.5px] border-neutral-500/90 mt-2 min-h-[200px] md:h-[330px] bg-no-repeat bg-cover rounded-3xl mx-2 py-5 md:py-1"
              style={{
                "backgroundImage": `url(https://api.itheumcloud.com/app_nftunes/images/featured_hero/hachi-mugen-infinity-series.jpg)`,
              }}>
              <div className="flex flex-col w-[80%] h-[100%] m-auto justify-center items-center">
                <h1 className="!text-lg !text-white text-center md:!text-3xl mb-5">Hachi Mugen "Infinity Series" EP is Live!</h1>
                <Link to={`${routeNames.nftunes}/?artist-profile=hachi-mugen`} className="text-base hover:!no-underline hover:text-black">
                  <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                    Listen & Collect
                  </Button>
                </Link>
              </div>
            </div>

            <div
              className="flex md:min-w-[25%] md:flex-1 border-[0.5px] border-neutral-500/90 mt-2 min-h-[200px] md:h-[330px] bg-no-repeat bg-cover rounded-3xl mx-2 py-5 md:py-1"
              style={{
                "backgroundImage": `url(https://api.itheumcloud.com/app_nftunes/images/featured_hero/waveborn-luminex.jpg)`,
              }}>
              <div className="flex flex-col w-[80%] h-[100%] m-auto justify-center items-center">
                <h1 className="!text-lg !text-white text-center md:!text-3xl mb-5">Waveborn Luminex "Suno" EP is Live!</h1>
                <Link to={`${routeNames.nftunes}/?artist-profile=waveborn-luminex`} className="text-base hover:!no-underline hover:text-black">
                  <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                    Listen & Collect
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <hr className="w-48 h-1 mx-auto my-10 bg-gray-300 border-0 rounded dark:bg-gray-700"></hr>

        <div className="">
          <h2 className="!text-2xl md:!text-3xl text-center">Top Ranked NFMe IDs</h2>
          <h3 className="dark:!text-white !text-sm text-center md:!text-xl mb-5">Join the Itheum AI Data Workforce - Powered by Liveliness Staking</h3>
          <div className="flex flex-row flex-wrap gap-x-8 mt-5">
            <AIWorkforceTopN showItems={6} />
          </div>
          <div className="flex justify-center">
            <Link to={routeNames.aiworkforce} className="text-base hover:!no-underline hover:text-black">
              <div className="w-[7.5rem] relative bg-gradient-to-r from-yellow-300 to-orange-500 px-[1px] py-[1px] rounded-md justify-center">
                <div className="bg-background rounded-md">
                  <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
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
                  <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                    View All
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <hr className="w-48 h-1 mx-auto my-10 bg-gray-300 border-0 rounded dark:bg-gray-700"></hr>

        {addressMvx ? (
          <div className="mt-2 mb-5">
            <h1 className="!text-2xl md:!text-3xl text-center">Featured App</h1>
            <Link to={`${routeNames.timecapsulexday}`} className="text-base hover:!no-underline hover:text-black">
              <div className="flex flex-col md:flex-row flex-wrap-reverse p-2 rounded-md">
                <div
                  className="flex md:min-w-[25%] md:flex-1 border-[0.5px] border-neutral-500/90 mt-2 min-h-[200px] md:h-[300px] bg-no-repeat bg-cover rounded-3xl mx-2 py-5 md:py-1"
                  style={{
                    "backgroundImage": `url(${isMostLikelyMobile() ? xDayTimeCapsuleHeroMobile : xDayTimeCapsuleHero})`,
                  }}></div>
              </div>
            </Link>
          </div>
        ) : (
          <div className="mt-2 mb-5">
            <h1 className="!text-2xl md:!text-3xl text-center">Featured App</h1>
            <Link to={`${routeNames.nftunes}`} className="text-base hover:!no-underline hover:text-black">
              <div className="flex flex-col md:flex-row flex-wrap-reverse p-2 rounded-md">
                <div
                  className="flex md:min-w-[25%] md:flex-1 border-[0.5px] border-neutral-500/90 mt-2 min-h-[250px] md:h-[350px] bg-no-repeat bg-cover rounded-3xl mx-2 py-5 md:py-1"
                  style={{
                    "backgroundImage": `url(${isMostLikelyMobile() ? featuredAppNFTunesMobileHero : featuredAppNFTunesHero})`,
                  }}></div>
              </div>
            </Link>
          </div>
        )}

        <hr className="w-48 h-1 mx-auto my-10 bg-gray-300 border-0 rounded dark:bg-gray-700"></hr>

        <div className="mt-5">
          <h2 className="!text-2xl md:!text-3xl text-center">Itheum App Store</h2>
          <h3 className="dark:!text-white !text-sm text-center md:!text-xl mb-5">Decentralized Apps Powered By Data NFTs</h3>
          <div className="mt-5 flex flex-col items-center md:grid md:grid-cols-3 3xl:grid-cols-4">
            {APP_MAPPINGS.filter((app) => SUPPORTED_APPS.includes(app.routeKey)).map((item) => (
              <div key={item.routeKey} className="mb-10 w-[341px]">
                <div className="mb-4 border-[0.5px] rounded-t-[30px] border-neutral-500/90">
                  <Link to={returnRoute(item.routeKey)}>
                    <img className="w-[464.29px] h-[250px] rounded-t-[30px]" src={item.img} alt="Apps" />
                  </Link>
                </div>
                <h3 className="!font-[Clash-Medium]">{item.appName}</h3>
                <p className="h-[60px] text-foreground font-[Satoshi-Light] mt-1 text-sm">{item.desc}</p>
                <div className="pt-5">
                  <Link to={returnRoute(item.routeKey)} className="text-base hover:!no-underline hover:text-black">
                    <div className="w-[7.5rem] relative bg-gradient-to-r from-yellow-300 to-orange-500 px-[1px] py-[1px] rounded-md justify-center">
                      <div className="bg-background rounded-md">
                        <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
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

        {addressMvx && (
          <>
            <hr className="w-48 h-1 mx-auto my-10 bg-gray-300 border-0 rounded dark:bg-gray-700"></hr>

            <div className="flex flex-col">
              <TrendingSection />
              <RecentDataNFTsSection />
            </div>
          </>
        )}
      </div>
    </>
  );
};
