import React, { useState } from "react";
import { useGetAccount } from "@multiversx/sdk-dapp/hooks";
import { Loader } from "@multiversx/sdk-dapp/UI/Loader/Loader";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import { useLocalStorageStore } from "store/LocalStorageStore.ts";
import { GiverLeaderboardProps, LeaderBoardItemType } from "../interfaces";
import LeaderBoardTable from "../LeaderBoardTable";

const GiverLeaderboard: React.FC<GiverLeaderboardProps> = (props) => {
  const { bountySubmitter, bountyId, fetchGetterLeaderBoard, showUserPosition } = props;
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [giverLeaderBoardIsLoading, setGiverLeaderBoardIsLoading] = useState<boolean>(false);
  const { address: mvxAddress } = useGetAccount();
  const { publicKey } = useWallet();
  const solAddress = publicKey?.toBase58() ?? "";
  const defaultChain = useLocalStorageStore((state) => state.defaultChain);
  const address = defaultChain === "multiversx" ? mvxAddress : solAddress;
  const [getterLeaderBoard, setGetterLeaderBoard] = useState<LeaderBoardItemType[]>([]);

  async function loadBaseData() {
    setGiverLeaderBoardIsLoading(true);
    const _toLeaderBoardTypeArr: LeaderBoardItemType[] = await fetchGetterLeaderBoard({ getterAddr: bountySubmitter, campaignId: bountyId });
    setGetterLeaderBoard(_toLeaderBoardTypeArr);
    setGiverLeaderBoardIsLoading(false);
  }

  function handleLeaderboard() {
    if (showLeaderboard === false) loadBaseData();
    setShowLeaderboard((prev) => !prev);
  }

  return (
    <div className="relative">
      <div
        onClick={handleLeaderboard}
        className="relative flex z-[100] cursor-pointer text-foreground  rounded-b-3xl w-full bg-[#35d9fa]/30 dark:bg-neutral-950 hover:bg-[#2495AC]  hover:dark:bg-[#022629]  item-center justify-center border-t-4 border-[#35d9fa]/30">
        <p className="p-2">{showLeaderboard ? "Close" : `Leaderboard`} </p>
      </div>

      <motion.div
        initial={{ y: 0 }}
        animate={{ opacity: showLeaderboard ? 1 : 0, y: showLeaderboard ? -800 : 0 }}
        transition={{ duration: 1, type: "spring" }}
        className="z-20 h-[797px]  w-full -mt-10   overflow-y-auto border border-[#35d9fa]/30 shadow-inner shadow-[#35d9fa]/30 bg-[#2495AC] dark:bg-[#022629] absolute p-4 rounded-t-xl z-100">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col max-w-[100%] p-[.5rem] mb-[3rem] rounded-[1rem]">
          <h4 className="text-center text-white mb-[1rem] !text-[1rem]">
            Giver Leaderboard <br />
            Bounty {bountyId}
          </h4>
          {giverLeaderBoardIsLoading ? (
            <div className="flex items-center justify-center  ">
              <Loader className="w-32" />
            </div>
          ) : (
            <div className="flex">
              {getterLeaderBoard && getterLeaderBoard.length > 0 ? (
                <LeaderBoardTable leaderBoardData={getterLeaderBoard} address={address} showMyPosition={showUserPosition} />
              ) : (
                <div className="text-center">{"No Data Yet"!}</div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GiverLeaderboard;
