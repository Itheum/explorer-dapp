import React, { useState, useEffect } from "react";
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
import { Vortex } from "libComponents/animated/Vortex";
import { Highlighter } from "libComponents/animated/HighlightHoverEffect";
import bounty from "assets/img/getbitz/givebitz/bounty.png";

type GiveBitzBaseProps = {
  gameDataNFT: DataNft;
};

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

  useEffect(() => {
    const highlighters = document.querySelectorAll("[data-highlighter]");
    highlighters.forEach((highlighter) => {
      new Highlighter(highlighter);
    });
  }, []);

  useEffect(() => {
    if (!chainID) {
      return;
    }

    // Load the giver LeaderBoards regardless on if the user has does not have the data nft in to entice them
    fetchGiverLeaderBoard();
  }, [chainID]);

  useEffect(() => {
    if (!address || !chainID) {
      return;
    }

    // Load the giver LeaderBoards regardless on if the user has does not have the data nft in to entice them
    fetchMyGivenBitz();
  }, [chainID, address]);

  // fetch MY latest given bits count
  async function fetchMyGivenBitz() {
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
  }

  // fetch the full leaderboard for all givers
  async function fetchGiverLeaderBoard() {
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

  // fetch the given bits for a specific getter (creator campaign or bounty id)
  async function fetchGivenBitsForGetter({ getterAddr, campaignId }: { getterAddr: string; campaignId: string }) {
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

      return data.bits ? parseInt(data.bits, 10) : -2;
    } catch (err) {
      const message = "Getting my rank on the all time leaderboard failed:" + (err as AxiosError).message;
      console.error(message);
    }
  }

  // fetch a getter leaderboard (creator campaign or bounty id)
  async function fetchGetterLeaderBoard({ getterAddr, campaignId }: { getterAddr: string; campaignId: string }) {
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

  // send bits to creator or bounty
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
        console.log("giveBitzGameResult", giveBitzGameResult);

        if (giveBitzGameResult) {
          console.log("giveBitzGameResult", giveBitzGameResult);
          if (giveBitzGameResult?.data?.statusCode && giveBitzGameResult?.data?.statusCode != 200) {
            throw new Error("Error: Not possible to sent power-up. As error code returned. Do you have enough BiTz to give?");
          } else {
            return true;
          }
        } else {
          throw new Error("Error: Not possible to sent power-up");
        }
      } catch (err) {
        console.error(err);
        toastError((err as Error).message);
      }

      setPowerUpSending(false);
    }
  }

  return (
    <div id="givebits" className="flex flex-col max-w-[100%] border border-[#35d9fa] p-[2rem] rounded-[1rem] mt-[3rem]">
      <div className="flex flex-col mb-8 items-center justify-center">
        <span className="text-foreground text-4xl mb-2">Give Bitz</span>
        <span className="text-base text-foreground/75 text-center ">Power-Up VERIFIED Data Creators and Data Bounties</span>
      </div>

      {address && (
        <div className="my-rank-and-score md:flex md:justify-center border p-[.6rem] mb-[1rem] rounded-[1rem] text-center bg-[#35d9fa] bg-opacity-25">
          <div className="flex flex-col items-center p-[1rem] md:flex-row md:align-baseline md:pr-[2rem]">
            <p className="flex items-end md:text-lg md:mr-[1rem]">Total BitZ You Have Given for Power-Ups</p>
            <p className="text-xl md:text-2xl dark:text-[#35d9fa] font-bold">
              {givenBitzSum === -2 ? `...` : <>{givenBitzSum === -1 ? "0" : `${givenBitzSum}`}</>}
            </p>
          </div>
        </div>
      )}

      <div id="giveLeaderboard" className="h-full flex flex-col max-w-[100%] border border-[#35d9fa] mb-[3rem] rounded-[1rem]">
        {/* <Vortex
          containerClassName="h-full w-full overflow-hidden"
          backgroundColor="transparent"
          rangeY={300} /// TOOD SET THE HEIGHT OF THE DIV
          particleCount={100}
          baseRadius={4}
          baseHue={120}
          baseSpeed={0.3}
          rangeSpeed={0.3}
          rangeRadius={10}
          className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"> */}
        <h3 className="text-center text-white mb-[1rem]">POWER-UP LEADERBOARD</h3>

        {giverLeaderBoardIsLoading ? (
          <Loader />
        ) : (
          <>
            {giverLeaderBoard && giverLeaderBoard.length > 0 ? (
              leaderBoardTable(giverLeaderBoard, address)
            ) : (
              <div className="text-center">{!chainID ? "Connect Wallet to Check" : "No Data Yet"!}</div>
            )}
          </>
        )}
        {/* </Vortex> */}
      </div>

      {/* <>
        <div className="flex flex-col mt-10 mb-8 items-center justify-center">
          <span className="text-foreground text-4xl mb-2">Power-up Creators</span>
          <span className="text-base text-foreground/75 text-center ">
            VERIFIED Data Creators run "Power-Me-Up" campiagn. Check out their campaign perks and Power-Up Data Creators with your BiTz XP, Climb Data Creator
            Leaderboards and get perks.
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:flex-wrap gap-4 items-start">
          {getCreatorCampaigns().map((item: GiveBitzCreatorCampaign) => (
            <PowerUpCreator
              key={item.campaignId}
              {...item}
              gameDataNFT={gameDataNFT}
              sendPowerUp={sendPowerUp}
              fetchGivenBitsForGetter={fetchGivenBitsForGetter}
              fetchGetterLeaderBoard={fetchGetterLeaderBoard}
              fetchMyGivenBitz={fetchMyGivenBitz}
              fetchGiverLeaderBoard={fetchGiverLeaderBoard}
            />
          ))}

          <div className="power-up-tile flex flex-col direction-row justify-between border p-10 min-w-[300px] max-w-[360px] min-h-[350px]">
            <div className="text-lg text-bond">🔌 Run a Power-Up Creator Campaign</div>
            <p>Running a Creator Campaign will help you build your own following of "hardcore fans" who support your creative work.</p>
            <p>
              <a className="!text-[#7a98df] hover:underline" href="https://google-form/eoi-bitz-creator-campaign" target="blank">
                Express your interest to run a BiTz XP Power-Up
              </a>
            </p>
          </div>
        </div>
      </> */}

      <>
        <div className="flex flex-col mt-10 mb-8 items-center justify-center">
          <span className="text-foreground text-4xl mb-2">Power-up Data Bounties</span>
          <span className="text-base text-foreground/75 text-center ">
            Power-Up Data Bounties (Ideas for new Data NFTs) with your BiTz XP, Climb Bounty Leaderboards and get bonus rewards if your Bounty is realized.
          </span>
        </div>

        {/* <div
          data-highlighter
          className=" relative h-screen bg-slate-800 rounded-3xl p-px -m-px before:absolute before:w-64 before:h-64 before:-left-32 before:-top-32 before:bg-indigo-500 before:rounded-full before:opacity-0 before:pointer-events-none before:transition-opacity before:duration-500 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:hover:opacity-30 before:z-30 before:blur-[64px] after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:transition-opacity after:duration-500 after:[background:_radial-gradient(250px_circle_at_var(--mouse-x)_var(--mouse-y),theme(colors.slate.400),transparent)] after:group-hover:opacity-100 after:z-10 overflow-hidden">
          <div className="relative h-full bg-slate-900 rounded-[inherit] z-20 overflow-hidden">
            <img src={bounty} />
            <div className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none -z-10 w-1/2 aspect-square" aria-hidden="true">
              <div className="absolute inset-0 translate-z-0 bg-sky-300 rounded-full blur-[120px]"></div>
            </div>
          </div>
        </div> */}
        {/* <div className="relative h-full bg-slate-900 rounded-[inherit] z-20 overflow-hidden">
          <img src={bounty} />
          <div className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none -z-10 w-1/2 aspect-square" aria-hidden="true">
            <div className="absolute inset-0 translate-z-0 bg-sky-300 rounded-full blur-[120px]"></div>
          </div>
        </div> */}
        <div className="flex flex-col md:flex-row md:flex-wrap gap-4 items-start" style={{ backgroundImage: `url(${bounty})` }}>
          {getDataBounties().map((item: GiveBitzDataBounty) => (
            <PowerUpBounty
              key={item.bountyId}
              {...item}
              gameDataNFT={gameDataNFT}
              sendPowerUp={sendPowerUp}
              fetchGivenBitsForGetter={fetchGivenBitsForGetter}
              fetchGetterLeaderBoard={fetchGetterLeaderBoard}
              fetchMyGivenBitz={fetchMyGivenBitz}
              fetchGiverLeaderBoard={fetchGiverLeaderBoard}
            />
          ))}

          <div className="power-up-tile flex flex-col justify-between border p-10 min-w-[300px] max-w-[360px] min-h-[350px]">
            <div className="text-lg text-bond">💡 Got an idea for a Data Bounty?</div>
            <p>
              Anyone can submit an innovative idea for a Data Bounty, entice exiting and new Data Creators to "fill" your Data Bounty and earn rewards and
              "community cred" for your idea.
            </p>
            <p>
              <a className="!text-[#7a98df] hover:underline" href="https://google-form/eoi-bitz-data-bounty" target="blank">
                Express your interest for a new Data Bounty
              </a>
            </p>
          </div>
        </div>
      </>
    </div>
  );
};

export default GiveBitzBase;
