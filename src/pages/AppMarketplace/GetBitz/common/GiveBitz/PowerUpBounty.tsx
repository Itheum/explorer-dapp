import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { ExternalLinkIcon } from "lucide-react";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import stampFinalized from "assets/img/getbitz/givebitz/stampFinalized.png";
import { MXAddressLink } from "components";
import { MAINNET_MVX_EXPLORER_ADDRESS, MARKETPLACE_DETAILS_PAGE } from "config";
import { useGetAccount } from "hooks";
import { cn } from "libs/utils";
import { useLocalStorageStore } from "store/LocalStorageStore.ts";
import GiveBitzLowerCard from "./GiveBitzLowerCard";
import { PowerUpBountyProps } from "../interfaces";

const PowerUpBounty = (props: PowerUpBountyProps) => {
  const { bounty, sendPowerUp, fetchGivenBitsForGetter, fetchGetterLeaderBoard, isSendingPowerUp, setIsSendingPowerUp } = props;
  const { bountySubmitter, bountyId, title, summary, readMoreLink, submittedOnTs, fillPerks, giverCounts, receivedBitzSum, finalizedDataNftIdentifier } =
    bounty;
  const { address: mvxAddress } = useGetAccount();
  const { publicKey } = useWallet();
  const solAddress = publicKey?.toBase58() ?? "";
  const defaultChain = useLocalStorageStore((state) => state.defaultChain);
  const address = defaultChain === "multiversx" ? mvxAddress : solAddress;

  return (
    <div className="power-up-tile border min-w-[260px] max-w-[360px] relative rounded-3xl">
      <div className="group" data-highlighter>
        <div
          className={cn(
            "relative bg-[#35d9fa]/80 dark:bg-[#35d9fa]/60  rounded-3xl p-[2px] before:absolute before:w-96 before:h-96 before:-left-48 before:-top-48 before:bg-[#35d9fa]  before:rounded-full before:opacity-0 before:pointer-events-none before:transition-opacity before:duration-500 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:hover:opacity-20 before:z-30 before:blur-[100px] after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:transition-opacity after:duration-500 after:[background:_radial-gradient(250px_circle_at_var(--mouse-x)_var(--mouse-y),theme(colors.sky.400),transparent)] after:group-hover:opacity-100 after:z-10 overflow-hidden",
            finalizedDataNftIdentifier ? " bg-[#35d9fa]/40   dark:bg-[#35d9fa]/20" : ""
          )}>
          {finalizedDataNftIdentifier && (
            <div className="ribbon absolute -top-2 -right-2 h-40 w-40 overflow-hidden before:absolute before:top-0 before:right-0 before:-z-[1] before:border-4 before:border-blue-500 after:absolute after:left-0 after:bottom-0 after:-z-[1] after:border-4 after:border-blue-500">
              <div className="absolute z-[100] -right-14 top-[43px] w-60 rotate-45 bg-gradient-to-br from-[#022629]/80 via-[#2495AC] to-[#35d9fa] py-2.5 text-center text-white shadow-md">
                Finalized
              </div>
            </div>
          )}
          <div className="relative h-full bg-neutral-950/40 dark:bg-neutral-950/60  rounded-[inherit] z-20 overflow-hidden p-4 md:p-8">
            <div className="flex justify-between items-center text-sm md:text-base">
              <div className=" bg-[#2495AC] dark:bg-[#022629] p-1 px-3 rounded-2xl shadow-inner shadow-[#35d9fa]/30  ">
                {" "}
                Received Bitz: {receivedBitzSum ? receivedBitzSum : 0}
              </div>

              <div className="bg-[#2495AC] dark:bg-[#022629] p-1 px-3 rounded-2xl shadow-inner shadow-[#35d9fa]/30  ">
                Givers: {giverCounts ? giverCounts : 0}
              </div>
            </div>

            <>
              <div className="mb-3 text-lg font-bold p-1 md:h-11">{title}</div>
              <div className="py-2  border-b-4  border-[#35d9fa]/30 text-sm ">
                <div className="md:h-[10rem] overflow-y-auto">{summary} </div>
                <div className="md:h-[1.3rem]">
                  {readMoreLink && (
                    <a className="!text-[#35d9fa] hover:underline" href={readMoreLink} target="blank">
                      Read More
                    </a>
                  )}{" "}
                </div>
              </div>
              <div className="my-2">
                Submitted Id:{" "}
                <MXAddressLink
                  textStyle="!text-[#35d9fa]  hover:!text-[#35d9fa] hover:underline"
                  explorerAddress={MAINNET_MVX_EXPLORER_ADDRESS}
                  address={bountySubmitter}
                  precision={8}
                />
              </div>
              <div className="mb-3 py-1">Bounty Id: {bountyId}</div>
              <div className="mb-3 py-1 border-b-4 border-[#35d9fa]/30">Submitted On: {moment(submittedOnTs * 1000).format("YYYY-MM-DD")}</div>
              <div className="mb-3 py-2 border-b-4 border-[#35d9fa]/30 text-sm">
                Data Bounty Fulfillment Perks: <br />
                <ul className="mt-2 h-[280px] overflow-y-auto ">
                  {fillPerks.split("\n").map((line, index) => {
                    return <li key={index}>💎 {line}</li>;
                  })}
                </ul>
              </div>
              {address && finalizedDataNftIdentifier ? (
                <div className="h-[21rem]">
                  <img src={stampFinalized} alt="Finalized" className="w-40 mx-auto" />
                  <div className="text-center text-2xl bg-[#2495AC] dark:bg-[#022629] p-1 px-3 rounded-2xl shadow-inner shadow-[#35d9fa]/30">Finalized</div>
                  <Link
                    to={MARKETPLACE_DETAILS_PAGE + finalizedDataNftIdentifier}
                    target="_blank"
                    className="relative z-[100] mt-16 text-[#35d9fa] hover:underline   md:text-xl  flex flex-row gap-1 justify-center items-center">
                    View Collection
                    <ExternalLinkIcon width={20} />
                  </Link>
                </div>
              ) : (
                <>
                  {address && (
                    <GiveBitzLowerCard
                      bountySubmitter={bountySubmitter}
                      bountyId={bountyId}
                      sendPowerUp={sendPowerUp}
                      fetchGivenBitsForGetter={fetchGivenBitsForGetter}
                      fetchGetterLeaderBoard={fetchGetterLeaderBoard}
                      isSendingPowerUp={isSendingPowerUp}
                      setIsSendingPowerUp={setIsSendingPowerUp}
                    />
                  )}
                </>
              )}

              {!finalizedDataNftIdentifier ? (
                <Link
                  to="https://docs.google.com/forms/d/e/1FAIpQLSctQIpxSw-TnJzP52nUddJEun28DUcObqbUGH8ulHEd0MNmaQ/viewform?usp=sf_link"
                  target="_blank"
                  className="relative z-[100] mt-2 text-[#35d9fa] hover:underline text-xs md:text-sm  flex flex-row gap-1 justify-center items-center">
                  Fill this bounty as a Data NFT!
                  <ExternalLinkIcon width={15} />
                </Link>
              ) : !address ? (
                <div className="flex flex-row gap-2 justify-between items-center">
                  <div className="text-center items-center bg-[#2495AC] dark:bg-[#022629] p-1 px-3 rounded-2xl shadow-inner shadow-[#35d9fa]/30">Finalized</div>

                  <Link
                    to={MARKETPLACE_DETAILS_PAGE + finalizedDataNftIdentifier}
                    target="_blank"
                    className="relative z-[100]  text-[#35d9fa] hover:underline text-xs md:text-sm  flex flex-row gap-1 justify-center items-center">
                    View Collection
                    <ExternalLinkIcon width={15} />
                  </Link>
                </div>
              ) : (
                <div className="h-6"> </div>
              )}
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerUpBounty;
