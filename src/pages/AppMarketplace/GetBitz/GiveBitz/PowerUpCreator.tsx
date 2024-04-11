import React, { useState, useEffect } from "react";
import { CopyAddress } from "components/CopyAddress";
import { Button } from "../../../../libComponents/Button";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { useGetAccount } from "hooks";
import { viewDataJSONCore } from "../index";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import axios, { AxiosError } from "axios";
import { GET_BITZ_TOKEN } from "appsConfig";
import { decodeNativeAuthToken, toastError, sleep, getApiWeb2Apps, createNftId } from "libs/utils";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { LeaderBoardItemType, leaderBoardTable } from "../index";
import { Loader } from "components";

type PowerUpCreatorProps = {
  creatorAddress: string;
  gameDataNFT: DataNft;
  refreshMyGivenSum: any;
};

const PowerUpCreator = (props: PowerUpCreatorProps) => {
  const { creatorAddress, gameDataNFT, refreshMyGivenSum } = props;
  const { address } = useGetAccount();
  const { tokenLogin } = useGetLoginInfo();
  const [bitsVal, setBitsVal] = useState<number>(0);
  const [bitsGivenToCreator, setBitsGivenToCreator] = useState<number>(-1);
  const [powerUpSending, setPowerUpSending] = useState<boolean>(false);
  const { chainID } = useGetNetworkConfig();
  const [getterLeaderBoardIsLoading, setGetterLeaderBoardIsLoading] = useState<boolean>(false);
  const [getterLeaderBoard, setGetterLeaderBoard] = useState<LeaderBoardItemType[]>([]);

  useEffect(() => {
    // onload
    if (address && creatorAddress && gameDataNFT) {
      fetchGivenBitsForCreator();
      fetchAndLoadGetterLeaderBoards();
    }
  }, [address, creatorAddress, gameDataNFT]);

  async function sendPowerUp() {
    console.log("sendPowerUp");
    debugger;
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
            "dmf-custom-give-bits-to-who": creatorAddress,
          },
          fwdHeaderKeys: "authorization, dmf-custom-give-bits, dmf-custom-give-bits-val, dmf-custom-give-bits-to-who",
        };

        const giveBitzGameResult = await viewDataJSONCore(viewDataArgs, gameDataNFT);

        if (giveBitzGameResult) {
          console.log("giveBitzGameResult", giveBitzGameResult);
          if (giveBitzGameResult?.data?.statusCode && giveBitzGameResult?.data?.statusCode != 200) {
            throw new Error("Error: Not possible to sent power up. Error code returned");
          } else {
            await sleep(2);
            fetchGivenBitsForCreator();
            await sleep(2);
            fetchAndLoadGetterLeaderBoards();
          }
        } else {
          throw new Error("Error: Not possible to sent power up");
        }
      } catch (err) {
        console.error(err);
        toastError((err as Error).message);
      }

      setBitsVal(0); // reset the figure the user sent
      setPowerUpSending(false);
    }
  }

  function handleGiveBitzChange(bitz: number) {
    setBitsVal(bitz);
  }

  async function fetchGivenBitsForCreator() {
    setBitsGivenToCreator(-1);

    const callConfig = {
      headers: {
        "fwd-tokenid": createNftId(GET_BITZ_TOKEN.tokenIdentifier, GET_BITZ_TOKEN.nonce),
      },
    };

    try {
      console.log("AXIOS CALL -----> xpGamePrivate/givenBits: giverAddr && getterAddr");
      const { data } = await axios.get<any>(
        `${getApiWeb2Apps(chainID)}/datadexapi/xpGamePrivate/givenBits?giverAddr=${address}&getterAddr=${creatorAddress}`,
        callConfig
      );

      await sleep(2);
      setBitsGivenToCreator(data.bits ? parseInt(data.bits, 10) : -2);
      await sleep(2);
      refreshMyGivenSum(); // call back to parent and ask to refresh the total given sum
    } catch (err) {
      const message = "Getting my rank on the all time leaderboard failed:" + (err as AxiosError).message;
      console.error(message);
    }
  }

  async function fetchAndLoadGetterLeaderBoards() {
    setGetterLeaderBoardIsLoading(true);

    const callConfig = {
      headers: {
        "fwd-tokenid": createNftId(GET_BITZ_TOKEN.tokenIdentifier, GET_BITZ_TOKEN.nonce),
      },
    };

    try {
      // S: ACTUAL LOGIC
      console.log("AXIOS CALL -----> xpGamePrivate/getterLeaderBoard : getterAddr =", creatorAddress);
      const { data } = await axios.get<any[]>(`${getApiWeb2Apps(chainID)}/datadexapi/xpGamePrivate/getterLeaderBoard?getterAddr=${creatorAddress}`, callConfig);

      const _toLeaderBoardTypeArr: LeaderBoardItemType[] = data.map((i) => {
        const item: LeaderBoardItemType = {
          playerAddr: i.giverAddr,
          bits: i.bits,
        };

        return item;
      });

      setGetterLeaderBoard(_toLeaderBoardTypeArr);
      // E: ACTUAL LOGIC
    } catch (err) {
      const message = "Monthly Leaderboard fetching failed:" + (err as AxiosError).message;
      console.error(message);
    }

    setGetterLeaderBoardIsLoading(false);
  }

  return (
    <div className="creator-tile border p-10 w-[300px]">
      <div className="text-lg">Creator Profile</div>
      <div className="mb-5">
        {" "}
        <CopyAddress address={creatorAddress} precision={8} />
      </div>
      <div className="mb-3 py-2 border-b-4">
        <div>Given BiTz: {bitsGivenToCreator === -1 ? "Loading..." : <>{bitsGivenToCreator === -2 ? "0" : bitsGivenToCreator}</>}</div>
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
          <Button disabled={!(bitsVal > 0) || powerUpSending} className="cursor-pointer mt-3" onClick={sendPowerUp}>
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
