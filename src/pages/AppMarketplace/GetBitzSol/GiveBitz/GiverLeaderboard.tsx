import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import LeaderBoardTable, { LeaderBoardItemType } from "../LeaderBoardTable";

interface GiverLeaderboardProps {
  bountySubmitter: string;
  bountyId: string;
  fetchGetterLeaderBoard: any;
  showUserPosition: boolean;
}

const GiverLeaderboard: React.FC<GiverLeaderboardProps> = (props) => {
  const { bountySubmitter, bountyId, fetchGetterLeaderBoard, showUserPosition } = props;

  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [giverLeaderBoardIsLoading, setGiverLeaderBoardIsLoading] = useState<boolean>(false);
  const { publicKey } = useWallet();
  const address = publicKey?.toBase58();
  const [getterLeaderBoard, setGetterLeaderBoard] = useState<LeaderBoardItemType[]>([]);

  async function loadBaseData() {
    setGiverLeaderBoardIsLoading(true);
    const _toLeaderBoardTypeArr: LeaderBoardItemType[] = await fetchGetterLeaderBoard({
      getterAddr: bountyId === "b20" ? "erd1lgyz209038gh8l2zfxq68kzl9ljz0p22hv6l0ev8fydhx8s9cwasdtrua2" : bountySubmitter,
      campaignId: bountyId,
    });
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
        animate={{
          opacity: showLeaderboard ? 1 : 0,
          y: showLeaderboard ? -800 : 0,
        }}
        transition={{ duration: 1, type: "spring" }}
        className="z-20 h-[797px]  w-full -mt-10   overflow-y-auto border border-[#35d9fa]/30 shadow-inner shadow-[#35d9fa]/30 bg-[#2495AC] dark:bg-[#022629] absolute p-4 rounded-t-xl z-100">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col max-w-[100%] p-[.5rem] mb-[3rem] rounded-[1rem]">
          <h4 className="text-center text-white mb-[1rem] !text-[1rem]">
            Giver Leaderboard <br />
            Bounty {bountyId}
          </h4>
          {giverLeaderBoardIsLoading ? (
            <div className="flex items-center justify-center h-100">
              <Loader className="w-32" />
            </div>
          ) : (
            <div className="flex">
              {getterLeaderBoard && getterLeaderBoard.length > 0 ? (
                <LeaderBoardTable leaderBoardData={getterLeaderBoard} address={address ?? ""} showMyPosition={showUserPosition} />
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
