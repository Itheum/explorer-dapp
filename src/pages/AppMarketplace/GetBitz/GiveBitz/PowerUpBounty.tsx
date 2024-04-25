import React, { useState } from "react";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import moment from "moment-timezone";
import { Loader, MXAddressLink } from "components";
import { useGetAccount } from "hooks";
import { LeaderBoardItemType, leaderBoardTable } from "../index";
import GiveBitzLowerCard from "./GiveBitzLowerCard";
import { motion } from "framer-motion";

type PowerUpBountyProps = {
  bountySubmitter: string;
  bountyId: string;
  title: string;
  summary: string;
  readMoreLink: string;
  submittedOnTs: number;
  fillPerks: string;
  sendPowerUp: any;
  fetchGivenBitsForGetter: any;
  fetchGetterLeaderBoard: any;
  fetchMyGivenBitz: any;
  fetchGiverLeaderBoard: any;
};

const PowerUpBounty = (props: PowerUpBountyProps) => {
  const {
    bountySubmitter,
    bountyId,
    title,
    summary,
    readMoreLink,
    submittedOnTs,
    fillPerks,
    sendPowerUp,
    fetchGivenBitsForGetter,
    fetchGetterLeaderBoard,
    fetchMyGivenBitz,
    fetchGiverLeaderBoard,
  } = props;

  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const { chainID } = useGetNetworkConfig();
  const {
    network: { explorerAddress },
  } = useGetNetworkConfig();

  const { address } = useGetAccount();

  const [getterLeaderBoardIsLoading, setGetterLeaderBoardIsLoading] = useState<boolean>(false);
  const [getterLeaderBoard, setGetterLeaderBoard] = useState<LeaderBoardItemType[]>([]);

  async function loadBaseData() {
    setGetterLeaderBoardIsLoading(true);
    const _toLeaderBoardTypeArr: LeaderBoardItemType[] = await fetchGetterLeaderBoard({ getterAddr: bountySubmitter, campaignId: bountyId });
    setGetterLeaderBoard(_toLeaderBoardTypeArr);
    setGetterLeaderBoardIsLoading(false);
  }

  function handleLeaderboard() {
    loadBaseData();
    setShowLeaderboard((prev) => !prev);
  }

  return (
    <div className="power-up-tile border  min-w-[260px] max-w-[360px] relative rounded-3xl">
      <div className="group" data-highlighter>
        <div className="relative bg-[#35d9fa]/80 dark:bg-[#35d9fa]/30  rounded-3xl p-[2px] before:absolute before:w-96 before:h-96 before:-left-48 before:-top-48 before:bg-[#35d9fa]  before:rounded-full before:opacity-0 before:pointer-events-none before:transition-opacity before:duration-500 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:hover:opacity-20 before:z-30 before:blur-[100px] after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:transition-opacity after:duration-500 after:[background:_radial-gradient(250px_circle_at_var(--mouse-x)_var(--mouse-y),theme(colors.sky.400),transparent)] after:group-hover:opacity-100 after:z-10 overflow-hidden">
          <div className="relative h-full bg-neutral-950/40 dark:bg-neutral-950/60  rounded-[inherit] z-20 overflow-hidden p-4 md:p-8">
            {/* <div
              className="-z-1 absolute w-full h-full"
              style={{
                backgroundImage: `url(${bounty})`,
                opacity: 0.2,
                objectFit: "cover",
                objectPosition: "center",
                backgroundRepeat: "no-repeat",
              }} />   */}
            <>
              <div className="mb-3 text-lg font-bold p-1">{title}</div>
              <div className="py-2 border-b-4  border-[#35d9fa]/30 text-sm">
                {summary} <br />
                <a className="!text-[#35d9fa] hover:underline" href={readMoreLink} target="blank">
                  Read More
                </a>
              </div>
              <div className="my-2">
                Submitted Id:{" "}
                <MXAddressLink
                  textStyle="!text-[#35d9fa]  hover:!text-[#35d9fa] hover:underline"
                  explorerAddress={explorerAddress}
                  address={bountySubmitter}
                  precision={8}
                />
              </div>
              <div className="mb-3 py-1">Bounty Id: {bountyId}</div>
              <div className="mb-3 py-1 border-b-4 border-[#35d9fa]/30">Submitted On: {moment(submittedOnTs * 1000).format("YYYY-MM-DD")}</div>
              <div className="mb-3 py-2 border-b-4 border-[#35d9fa]/30 text-sm">Bounty Fulfillment Perks: {fillPerks}</div>
              {address && (
                <GiveBitzLowerCard
                  bountySubmitter={bountySubmitter}
                  bountyId={bountyId}
                  sendPowerUp={sendPowerUp}
                  fetchGivenBitsForGetter={fetchGivenBitsForGetter}
                  fetchMyGivenBitz={fetchMyGivenBitz}
                  fetchGiverLeaderBoard={fetchGiverLeaderBoard}
                />
              )}

              {address && (
                <div
                  className="rounded-b-3xl w-full bg-[#35d9fa]/30 dark:bg-neutral-950 hover:bg-[#2495AC] dark:hover:bg-[#022629] cursor-pointer text-foreground relative"
                  onClick={handleLeaderboard}>
                  <div className="flex  item-center justify-center border-t-4 border-[#35d9fa]/30">
                    <p className="p-2">{showLeaderboard ? "Close" : `Leaderboard`} </p>
                  </div>
                  {showLeaderboard && (
                    <motion.div
                      initial={{ y: 0 }}
                      animate={{ opacity: 1, y: -756 }}
                      transition={{ duration: 1, type: "spring" }}
                      className="z-20 h-[753px] w-full -mt-10 md:-mt-0 md:h-[713px] overflow-y-auto border border-[#35d9fa]/30 shadow-inner shadow-[#35d9fa]/30 bg-[#2495AC] dark:bg-[#022629] absolute p-4 rounded-t-3xl z-100">
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col max-w-[100%] p-[.5rem] mb-[3rem] rounded-[1rem]">
                        <h4 className="text-center text-white mb-[1rem] !text-[1rem]">
                          Giver Leaderboard <br />
                          Bounty {bountyId}
                        </h4>
                        {getterLeaderBoardIsLoading ? (
                          <div className="flex items-center justify-center  ">
                            <Loader />
                          </div>
                        ) : (
                          <div className="flex">
                            {getterLeaderBoard && getterLeaderBoard.length > 0 ? (
                              leaderBoardTable(getterLeaderBoard, address, true)
                            ) : (
                              <div className="text-center">{!chainID ? "Connect Wallet to Check" : "No Data Yet"!}</div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              )}
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerUpBounty;
