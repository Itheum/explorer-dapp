import React, { useState, useEffect } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import moment from "moment-timezone";
import { Loader } from "components";
import { CopyAddress } from "components/CopyAddress";
import { useGetAccount } from "hooks";
import { sleep } from "libs/utils";
import { Button } from "../../../../libComponents/Button";
import { LeaderBoardItemType, leaderBoardTable } from "../index";

type PowerUpBountyProps = {
  bountySubmitter: string;
  bountyId: string;
  title: string;
  summary: string;
  readMoreLink: string;
  submittedOnTs: number;
  fillPerks: string;
  gameDataNFT: DataNft;
  sendPowerUp: any;
  fetchGivenBitsForCreator: any;
  fetchAndLoadGetterLeaderBoards: any;
};

const PowerUpCreator = (props: PowerUpBountyProps) => {
  const {
    bountySubmitter,
    bountyId,
    title,
    summary,
    readMoreLink,
    submittedOnTs,
    fillPerks,
    gameDataNFT,
    sendPowerUp,
    fetchGivenBitsForCreator,
    fetchAndLoadGetterLeaderBoards,
  } = props;
  const { address } = useGetAccount();
  const [bitsVal, setBitsVal] = useState<number>(0);
  const [bitsGivenToCreator, setBitsGivenToCreator] = useState<number>(-1);
  const [powerUpSending, setPowerUpSending] = useState<boolean>(false);
  const { chainID } = useGetNetworkConfig();
  const [getterLeaderBoardIsLoading, setGetterLeaderBoardIsLoading] = useState<boolean>(false);
  const [getterLeaderBoard, setGetterLeaderBoard] = useState<LeaderBoardItemType[]>([]);

  useEffect(() => {
    if (address && bountySubmitter && gameDataNFT && bountyId) {
      loadBaseData();
    }
  }, [address, bountySubmitter, gameDataNFT, bountyId]);

  async function loadBaseData() {
    const _fetchGivenBitsForCreator = await fetchGivenBitsForCreator({ getterAddr: bountySubmitter, campaignId: bountyId });
    setBitsGivenToCreator(_fetchGivenBitsForCreator);
    setGetterLeaderBoardIsLoading(true);
    const _toLeaderBoardTypeArr: LeaderBoardItemType[] = await fetchAndLoadGetterLeaderBoards({ getterAddr: bountySubmitter, campaignId: bountyId });
    setGetterLeaderBoard(_toLeaderBoardTypeArr);
    setGetterLeaderBoardIsLoading(false);
  }

  function handleGiveBitzChange(bitz: number) {
    setBitsVal(bitz);
  }

  async function handlePowerUp() {
    setPowerUpSending(true);
    const isPowerUpSuccess = await sendPowerUp({ bitsVal, bitsToWho: bountySubmitter, bitsToCampaignId: bountyId });

    if (isPowerUpSuccess) {
      await sleep(2);
      setBitsGivenToCreator(-1);
      const _fetchGivenBitsForCreator = await fetchGivenBitsForCreator({ getterAddr: bountySubmitter, campaignId: bountyId });

      setBitsGivenToCreator(_fetchGivenBitsForCreator);

      await sleep(2);

      setGetterLeaderBoardIsLoading(true);
      const _toLeaderBoardTypeArr: LeaderBoardItemType[] = await fetchAndLoadGetterLeaderBoards({ getterAddr: bountySubmitter, campaignId: bountyId });

      setGetterLeaderBoard(_toLeaderBoardTypeArr);
      setGetterLeaderBoardIsLoading(false);
    }

    setBitsVal(0); // reset the figure the user sent
    setPowerUpSending(false);
  }

  return (
    <div className="power-up-tile border p-10 min-w-[300px] max-w-[360px]">
      <div className="mb-3 text-lg font-bold">{title}</div>
      <div className="py-2 border-b-4 text-sm">
        {summary}{" "}
        <a className="!text-[#7a98df] hover:underline" href={readMoreLink} target="blank">
          : Read More
        </a>
      </div>

      <div className="my-2">
        Submitted Id: <CopyAddress address={bountySubmitter} precision={8} />
      </div>

      <div className="mb-3 py-1">Bounty Id: {bountyId}</div>
      <div className="mb-3 py-1 border-b-4">Submitted On: {moment(submittedOnTs * 1000).format("YYYY-MM-DD")}</div>
      <div className="mb-3 py-2 border-b-4 text-sm">Bounty Fulfillment Perks: {fillPerks}</div>

      <div className="my-rank-and-score md:flex md:justify-center border p-[.6rem] mb-[1rem] rounded-[1rem] text-center bg-[#35d9fa] bg-opacity-25">
        <p className="flex items-end md:text-lg md:mr-[1rem]">Given BiTz</p>
        <p className="text-lg md:text-xl dark:text-[#35d9fa] font-bold">
          {bitsGivenToCreator === -1 ? "Loading..." : <>{bitsGivenToCreator === -2 ? "0" : bitsGivenToCreator}</>}
        </p>
      </div>

      {powerUpSending && <div>Sending PowerUp...</div>}

      <div className="mb-3 py-2 border-b-4">
        <div>Give More BiTz</div>
        <div className="mb-3">
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={bitsVal}
            onChange={(e) => handleGiveBitzChange(Number(e.target.value))}
            className="accent-black dark:accent-white w-[70%] cursor-pointer ml-2"></input>
          <Button disabled={!(bitsVal > 0) || powerUpSending} className="cursor-pointer mt-3" onClick={handlePowerUp}>
            Send {bitsVal} BiTz Power Up
          </Button>
        </div>
      </div>

      <div className="flex flex-col max-w-[100%] border border-[#35d9fa] p-[.5rem] mb-[3rem] rounded-[1rem]">
        <h4 className="text-center text-white mb-[1rem] !text-[1rem]">GIVER LEADERBOARD</h4>
        {getterLeaderBoardIsLoading ? (
          <Loader />
        ) : (
          <>
            {getterLeaderBoard.length > 0 ? (
              leaderBoardTable(getterLeaderBoard, address)
            ) : (
              <div className="text-center">{!chainID ? "Connect Wallet to Check" : "No Data Yet"!}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PowerUpCreator;
