import React, { useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import axios, { AxiosError } from "axios";
import { GET_BITZ_TOKEN } from "appsConfig";
import { Loader } from "components";
import { useGetAccount } from "hooks";
import { decodeNativeAuthToken, sleep, getApiWeb2Apps, createNftId, toastError } from "libs/utils";
import { useAccountStore } from "store/account";
import PowerUpBounty from "./PowerUpBounty";
import PowerUpCreator from "./PowerUpCreator";
import { getCreatorCampaigns, GiveBitzCreatorCampaign, getDataBounties, GiveBitzDataBounty } from "../config";
import { LeaderBoardItemType, leaderBoardTable, viewDataJSONCore } from "../index";

type GiveBitzBaseProps = {
  gameDataNFT: DataNft;
};

export interface LeaderBoardGiverItemType {
  giverAddr: string;
  bits: number;
}

const GiveBitzBase = (props: GiveBitzBaseProps) => {
  const { gameDataNFT } = props;
  const { address } = useGetAccount();
  const { tokenLogin } = useGetLoginInfo();
  const givenBitzSum = useAccountStore((state: any) => state.givenBitzSum);
  const collectedBitzSum = useAccountStore((state: any) => state.collectedBitzSum);
  const { chainID } = useGetNetworkConfig();
  const [giverLeaderBoardIsLoading, setGiverLeaderBoardIsLoading] = useState<boolean>(false);
  const [giverLeaderBoard, setGiverLeaderBoard] = useState<LeaderBoardItemType[]>([]);
  const [powerUpSending, setPowerUpSending] = useState<boolean>(false);
  const updateGivenBitzSum = useAccountStore((state) => state.updateGivenBitzSum);
  const updateBitzBalance = useAccountStore((state) => state.updateBitzBalance);

  async function handleFetchGivenBitsForMe() {
    // dont do it for when page load or collectedBitzSum is still being collected (collectedBitzSum will be -2 or -1 state)
    if (collectedBitzSum > 0) {
      updateGivenBitzSum(-2);

      const callConfig = {
        headers: {
          "fwd-tokenid": createNftId(GET_BITZ_TOKEN.tokenIdentifier, GET_BITZ_TOKEN.nonce),
        },
      };

      try {
        console.log("AXIOS CALL -----> xpGamePrivate/givenBits: giverAddr only");
        const { data } = await axios.get<any>(`${getApiWeb2Apps(chainID)}/datadexapi/xpGamePrivate/givenBits?giverAddr=${address}`, callConfig);

        await sleep(2);

        // update stores
        const sumGivenBits = data.bits ? parseInt(data.bits, 10) : -2;
        updateGivenBitzSum(sumGivenBits);

        if (sumGivenBits > 0) {
          updateBitzBalance(collectedBitzSum - sumGivenBits); // update new balance (collected bits - given bits)
        }
      } catch (err) {
        const message = "Getting my sum givenBits failed:" + (err as AxiosError).message;
        console.error(message);
      }
    }

    fetchAndLoadGiverLeaderBoards();
  }

  async function fetchAndLoadGiverLeaderBoards() {
    setGiverLeaderBoardIsLoading(true);

    const callConfig = {
      headers: {
        "fwd-tokenid": createNftId(GET_BITZ_TOKEN.tokenIdentifier, GET_BITZ_TOKEN.nonce),
      },
    };

    try {
      // S: ACTUAL LOGIC
      console.log("AXIOS CALL -----> xpGamePrivate/giverLeaderBoard");
      const { data } = await axios.get<any[]>(`${getApiWeb2Apps(chainID)}/datadexapi/xpGamePrivate/giverLeaderBoard`, callConfig);

      const _toLeaderBoardTypeArr: LeaderBoardItemType[] = data.map((i) => {
        const item: LeaderBoardItemType = {
          playerAddr: i.giverAddr,
          bits: i.bits,
        };

        return item;
      });

      await sleep(2);
      setGiverLeaderBoard(_toLeaderBoardTypeArr);
      // E: ACTUAL LOGIC
    } catch (err) {
      const message = "Monthly Leaderboard fetching failed:" + (err as AxiosError).message;
      console.error(message);
    }

    setGiverLeaderBoardIsLoading(false);
  }

  async function sendPowerUp({ bitsVal, bitsToWho, bitsToCampaignId }: { bitsVal: number; bitsToWho: string; bitsToCampaignId: string }) {
    console.log("sendPowerUp");

    if (tokenLogin) {
      setPowerUpSending(true);

      try {
        const viewDataArgs = {
          mvxNativeAuthOrigins: [decodeNativeAuthToken(tokenLogin.nativeAuthToken || "").origin],
          mvxNativeAuthMaxExpirySeconds: 3600,
          fwdHeaderMapLookup: {
            "authorization": `Bearer ${tokenLogin.nativeAuthToken}`,
            "dmf-custom-give-bits": "1",
            "dmf-custom-give-bits-val": bitsVal,
            "dmf-custom-give-bits-to-who": bitsToWho,
            "dmf-custom-give-bits-to-campaign-id": bitsToCampaignId,
          },
          fwdHeaderKeys: "authorization, dmf-custom-give-bits, dmf-custom-give-bits-val, dmf-custom-give-bits-to-who, dmf-custom-give-bits-to-campaign-id",
        };

        const giveBitzGameResult = await viewDataJSONCore(viewDataArgs, gameDataNFT);

        if (giveBitzGameResult) {
          console.log("giveBitzGameResult", giveBitzGameResult);
          if (giveBitzGameResult?.data?.statusCode && giveBitzGameResult?.data?.statusCode != 200) {
            throw new Error("Error: Not possible to sent power up. As error code returned. Do you have enough BiTz to give?");
          } else {
            // await sleep(2);
            // fetchGivenBitsForCreator();
            // await sleep(2);
            // fetchAndLoadGetterLeaderBoards();

            return true;
          }
        } else {
          throw new Error("Error: Not possible to sent power up");
        }
      } catch (err) {
        console.error(err);
        toastError((err as Error).message);
      }

      setPowerUpSending(false);
    }
  }

  async function fetchGivenBitsForCreator({ getterAddr, campaignId }: { getterAddr: string; campaignId: string }) {
    const callConfig = {
      headers: {
        "fwd-tokenid": createNftId(GET_BITZ_TOKEN.tokenIdentifier, GET_BITZ_TOKEN.nonce),
      },
    };

    try {
      console.log("AXIOS CALL -----> xpGamePrivate/givenBits: giverAddr && getterAddr");
      const { data } = await axios.get<any>(
        `${getApiWeb2Apps(chainID)}/datadexapi/xpGamePrivate/givenBits?giverAddr=${address}&getterAddr=${getterAddr}&campaignId=${campaignId}`,
        callConfig
      );

      await sleep(2);
      handleFetchGivenBitsForMe(); // call back to parent and ask to refresh the total given sum

      return data.bits ? parseInt(data.bits, 10) : -2;
    } catch (err) {
      const message = "Getting my rank on the all time leaderboard failed:" + (err as AxiosError).message;
      console.error(message);
    }
  }

  async function fetchAndLoadGetterLeaderBoards({ getterAddr, campaignId }: { getterAddr: string; campaignId: string }) {
    const callConfig = {
      headers: {
        "fwd-tokenid": createNftId(GET_BITZ_TOKEN.tokenIdentifier, GET_BITZ_TOKEN.nonce),
      },
    };

    try {
      // S: ACTUAL LOGIC
      console.log("AXIOS CALL -----> xpGamePrivate/getterLeaderBoard : getterAddr =", getterAddr);
      const { data } = await axios.get<any[]>(
        `${getApiWeb2Apps(chainID)}/datadexapi/xpGamePrivate/getterLeaderBoard?getterAddr=${getterAddr}&campaignId=${campaignId}`,
        callConfig
      );

      const _toLeaderBoardTypeArr: LeaderBoardItemType[] = data.map((i) => {
        const item: LeaderBoardItemType = {
          playerAddr: i.giverAddr,
          bits: i.bits,
        };

        return item;
      });

      return _toLeaderBoardTypeArr;
      // E: ACTUAL LOGIC
    } catch (err) {
      const message = "Monthly Leaderboard fetching failed:" + (err as AxiosError).message;
      console.error(message);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row justify-between py-16 ">
      <div className="flex flex-col  mb-8 items-center justify-center">
        <span className="text-foreground text-4xl mb-2">Give Bitz</span>
        <span className="text-base text-foreground/75 text-center ">Power-Up VERIFIED Data Creators and Data Bounties</span>
      </div>

      <div className="my-rank-and-score md:flex md:justify-center border p-[.6rem] mb-[1rem] rounded-[1rem] text-center bg-[#35d9fa] bg-opacity-25">
        <div className="flex flex-col items-center p-[1rem] md:flex-row md:align-baseline md:pr-[2rem]">
          <p className="flex items-end md:text-lg md:mr-[1rem]">Total BitZ You Have Given for Power-Ups</p>
          <p className="text-xl md:text-2xl dark:text-[#35d9fa] font-bold">
            {givenBitzSum === -2 ? `...` : <>{givenBitzSum === -1 ? "0" : `${givenBitzSum}`}</>}
          </p>
        </div>
      </div>

      <div className="flex flex-col max-w-[100%] border border-[#35d9fa] p-[1rem] mb-[3rem] rounded-[1rem]">
        <h3 className="text-center text-white mb-[1rem]">POWER-UP LEADERBOARD</h3>
        {giverLeaderBoardIsLoading ? (
          <Loader />
        ) : (
          <>
            {giverLeaderBoard.length > 0 ? (
              leaderBoardTable(giverLeaderBoard, address)
            ) : (
              <div className="text-center">{!chainID ? "Connect Wallet to Check" : "No Data Yet"!}</div>
            )}
          </>
        )}
      </div>

      <>
        <div className="flex flex-col mt-10 mb-8 items-center justify-center">
          <span className="text-foreground text-4xl mb-2">Power-up Creators</span>
          <span className="text-base text-foreground/75 text-center ">
            VERIFIED Data Creators run "Power-Me-Up" campiagn. Check out their campaign perks and Power-Up Data Creators with your BiTz XP, Climb Data Creator
            Leaderboards and get perks.
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:flex-wrap md:justify-between gap-4 justify-center items-center align-start">
          {getCreatorCampaigns().map((item: GiveBitzCreatorCampaign) => (
            <PowerUpCreator
              key={item.campaignId}
              {...item}
              gameDataNFT={gameDataNFT}
              sendPowerUp={sendPowerUp}
              fetchGivenBitsForCreator={fetchGivenBitsForCreator}
              fetchAndLoadGetterLeaderBoards={fetchAndLoadGetterLeaderBoards}
            />
          ))}
        </div>
      </>

      <>
        <div className="flex flex-col mt-10 mb-8 items-center justify-center">
          <span className="text-foreground text-4xl mb-2">Power-up Data Bounties</span>
          <span className="text-base text-foreground/75 text-center ">
            Power-Up Data Bounties (Ideas for new Data NFTs) with your BiTz XP, Climb Bounty Leaderboards and get bonus rewards if your Bounty is realized.
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:flex-wrap md:justify-between gap-4 justify-center items-center align-start">
          {getDataBounties().map((item: GiveBitzDataBounty) => (
            <PowerUpBounty
              key={item.bountyId}
              {...item}
              gameDataNFT={gameDataNFT}
              sendPowerUp={sendPowerUp}
              fetchGivenBitsForCreator={fetchGivenBitsForCreator}
              fetchAndLoadGetterLeaderBoards={fetchAndLoadGetterLeaderBoards}
            />
          ))}
        </div>
      </>
    </div>
  );
};

export default GiveBitzBase;
