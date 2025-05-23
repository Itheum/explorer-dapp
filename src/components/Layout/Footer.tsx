import React from "react";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { ExternalLink } from "lucide-react";
import { ELROND_NETWORK } from "config";
import { getMvxRpcApi } from "libs/utils";

export const Footer = () => {
  const {
    network: { chainId: chainID },
  } = useGetNetworkConfig();

  const appVersion = import.meta.env.VITE_APP_VERSION ? `v${import.meta.env.VITE_APP_VERSION}` : "version number unknown";
  const isPublicApi = getMvxRpcApi(chainID).includes("api.multiversx.com");

  return (
    <footer className="xl:mx-[7.5rem] md:mx-[4rem] h-auto mb-10 mt-10">
      <div className="w-full h-[2px] bg-[linear-gradient(to_right,#737373,#A76262,#5D3899,#5D3899,#A76262,#737373)] animate-gradient bg-[length:200%_auto]"></div>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-[50%] p-5">
          <div>
            <p className="mb-3 bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500 dark:from-yellow-300 dark:to-orange-500 text-transparent font-bold text-[1.5rem]">
              Itheum Explorer
            </p>
            <p className="text-xs md:text-sm">
              Explore Itheum Data NFTs with apps and widgets that unlock unique experiences, stream Web3 music on NF-Tunes, check your global ranking on the
              NFMe ID user reputation leaderboard, and earn BiTz XP—exclusive Itheum points to boost your reputation and unlock free Data NFTs based on your
              activity!
            </p>
          </div>
          <div className="">
            <div className="flex py-5 flex-col">
              <ul className="flex gap-2 mt-5">
                <li>
                  {" "}
                  <a
                    href="https://docs.itheum.io/product-docs/legal/ecosystem-tools-terms/datadex/terms-of-use"
                    target="_blank"
                    className="flex justify-center items-center gap-0.5 hover:underline">
                    <small>Terms of Use</small>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  {" "}
                  <a
                    href="https://docs.itheum.io/product-docs/legal/ecosystem-tools-terms/datadex/privacy-policy"
                    target="_blank"
                    className="flex justify-center items-center gap-0.5 hover:underline">
                    <small>Privacy Policy</small>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  {" "}
                  <a href="https://stats.uptimerobot.com/D8JBwIo983" target="_blank" className="flex justify-center items-center gap-0.5 hover:underline">
                    <small>Protocol Status</small>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              </ul>
              <div className="flex flex-col mt-2 opacity-60">
                <p>
                  <small>MVX API Provider: {isPublicApi ? "Public" : "Private"}</small>
                </p>
                <p>
                  <small>
                    {appVersion + " "}
                    {ELROND_NETWORK.toUpperCase()}
                  </small>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex md:flex-col md:w-[50%] pl-5 h-auto border-l-2">
          <div className="flex justify-between">
            <div className="py-5 md:flex-1">
              <p className="text-md mb-2 bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500 dark:from-yellow-300 dark:to-orange-500 text-transparent font-bold text-base">
                Connect With Us
              </p>
              <ul className="text-xs md:text-sm flex flex-col gap-1">
                <li>
                  {"> "}
                  <a href="https://x.com/itheum" target="_blank" className="hover:underline">
                    X
                  </a>
                </li>
                <li>
                  {"> "}
                  <a href="https://itheum.io/discord" target="_blank" className="hover:underline">
                    Discord
                  </a>
                </li>
                <li>
                  {"> "}
                  <a href="https://t.me/itheum" target="_blank" className="hover:underline">
                    Telegram
                  </a>
                </li>
                <li>
                  {"> "}
                  <a href="https://www.instagram.com/itheumofficial/" target="_blank" className="hover:underline">
                    Instagram
                  </a>
                </li>
                <li>
                  {"> "}
                  <a href="https://drip.haus/itheum" target="_blank" className="hover:underline">
                    DRiP Haus
                  </a>
                </li>
                <li>
                  {"> "}
                  <a href="https://itheum.medium.com" target="_blank" className="hover:underline">
                    Medium Blog
                  </a>
                </li>
                <li>
                  {"> "}
                  <a href="https://www.youtube.com/itheum" target="_blank" className="hover:underline">
                    YouTube
                  </a>
                </li>
                <li>
                  {"> "}
                  <a href="https://github.com/Itheum" target="_blank" className="hover:underline">
                    Github
                  </a>
                </li>
                <li>
                  {"> "}
                  <a href="itheum.io" target="_blank" className="hover:underline">
                    Website
                  </a>
                </li>
              </ul>
            </div>

            <div className="py-5 ml-10 md:ml-[auto] md:flex-1">
              <p className="text-md mb-2 bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500 dark:from-yellow-300 dark:to-orange-500 text-transparent font-bold text-base">
                More to Explore
              </p>
              <ul className="text-xs md:text-sm flex flex-col gap-1">
                <li>
                  {"> "}
                  <a href="https://ai-workforce.itheum.com" target="_blank" className="hover:underline">
                    Solana AI Data Workforce
                  </a>
                </li>
                <li>
                  {"> "}
                  <a href="https://datadex.itheum.com" target="_blank" className="hover:underline">
                    MultiversX Data DEX
                  </a>
                </li>
                <li>
                  {"> "}
                  <a href="https://portal.itheum.com" target="_blank" className="hover:underline">
                    {`Solana <> MultiversX `}Token Bridge
                  </a>
                </li>
                <li>
                  {"> "}
                  <a href="https://ai-workforce.itheum.com/NFMeID" target="_blank" className="hover:underline">
                    Claim your NFMe ID (Solana)
                  </a>
                </li>
                <li>
                  {"> "}
                  <a href="https://ai-workforce.itheum.io/NFMeID#liveliness" target="_blank" className="hover:underline">
                    Liveliness Staking (Solana)
                  </a>
                </li>
                <li>
                  {"> "}
                  <a href="https://datadex.itheum.com/NFMeID" target="_blank" className="hover:underline">
                    Claim your NFMe ID (MultiversX)
                  </a>
                </li>
                <li>
                  {"> "}
                  <a href="https://datadex.itheum.io/NFMeID#liveliness" target="_blank" className="hover:underline">
                    Liveliness Staking (MultiversX)
                  </a>
                </li>
                <li>
                  {"> "}
                  <a href="/nftunes" className="hover:underline">
                    NF-Tunes : Stream Web3 Music
                  </a>
                </li>
                <li>
                  {"> "}
                  <a href="https://drip.haus/itheum" className="hover:underline">
                    Free Music Data NFTs on Solana's DRiP Haus
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
