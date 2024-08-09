import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { Loader } from "lucide-react";
import { FlaskRound } from "lucide-react";
import bounty from "assets/img/getbitz/givebitz/bountyMain.png";
import { SUPPORTED_SOL_COLLECTIONS } from "config";
import { Highlighter } from "libComponents/animated/HighlightHoverEffect";
import { itheumSolPreaccess, itheumSolViewData } from "libs/sol/SolViewData";
import { BlobDataType } from "libs/types";
import { getApiWeb2Apps, sleep } from "libs/utils";
import { useAccountStore } from "store/account";
import { useNftsStore } from "store/nfts";
import useSolBitzStore from "store/solBitz";
import { getDataBounties } from "./configSol";
import BonusBitzHistory from "../common/BonusBitzHistory";
import PowerUpBounty from "../common/GiveBitz/PowerUpBounty";
import { GiveBitzDataBounty, LeaderBoardItemType } from "../common/interfaces";
import LeaderBoardTable from "../common/LeaderBoardTable";

const GiveBitzBase = () => {
  const { publicKey, signMessage } = useWallet();
  const address = publicKey?.toBase58();
  const givenBitzSum = useSolBitzStore((state: any) => state.givenBitzSum);
  const collectedBitzSum = useSolBitzStore((state: any) => state.collectedBitzSum);
  const bonusBitzSum = useSolBitzStore((state: any) => state.bonusBitzSum);
  const bitzBalance = useSolBitzStore((state: any) => state.bitzBalance);
  const [giverLeaderBoardIsLoading, setGiverLeaderBoardIsLoading] = useState<boolean>(false);
  const [giverLeaderBoard, setGiverLeaderBoard] = useState<LeaderBoardItemType[]>([]);
  const nfts = useNftsStore((state) => state.solNfts);
  const bitzStore = useSolBitzStore();
  const [dataBounties, setDataBounties] = useState<GiveBitzDataBounty[]>([]);
  const [fetchingDataBountiesReceivedSum, setFetchingDataBountiesReceivedSum] = useState<boolean>(true);
  const [isSendingPowerUp, setIsSendingPowerUp] = useState<boolean>(false);

  const solPreaccessNonce = useAccountStore((state: any) => state.solPreaccessNonce);
  const solPreaccessSignature = useAccountStore((state: any) => state.solPreaccessSignature);
  const solPreaccessTimestamp = useAccountStore((state: any) => state.solPreaccessTimestamp);
  const updateSolPreaccessNonce = useAccountStore((state: any) => state.updateSolPreaccessNonce);
  const updateSolPreaccessTimestamp = useAccountStore((state: any) => state.updateSolPreaccessTimestamp);
  const updateSolSignedPreaccess = useAccountStore((state: any) => state.updateSolSignedPreaccess);

  useEffect(() => {
    setFetchingDataBountiesReceivedSum(true);
    const fetchDataBounties = async () => {
      const _dataBounties: GiveBitzDataBounty[] = await Promise.all(
        getDataBounties().map(async (item: GiveBitzDataBounty) => {
          const response = await fetchBitSumAndGiverCounts({
            getterAddr: item.bountyId === "b20" ? "erd1lgyz209038gh8l2zfxq68kzl9ljz0p22hv6l0ev8fydhx8s9cwasdtrua2" : item.bountySubmitter,
            campaignId: item.bountyId,
          });
          return {
            ...item,
            receivedBitzSum: response.bitsSum,
            giverCounts: response.giverCounts,
          };
        })
      );
      const sortedDataBounties = _dataBounties;
      // .sort(
      //   (a, b) => (b.receivedBitzSum ?? 0) - (a.receivedBitzSum ?? 0),
      // );

      setDataBounties(sortedDataBounties);
    };
    fetchDataBounties();
    setFetchingDataBountiesReceivedSum(false);
  }, []);

  useEffect(() => {
    const highlighters = document.querySelectorAll("[data-highlighter]");
    highlighters.forEach((highlighter) => {
      new Highlighter(highlighter);
    });
  }, [dataBounties]);

  useEffect(() => {
    // Load the giver LeaderBoards regardless on if the user has does not have the data nft in to entice them
    fetchGiverLeaderBoard();
  }, []);

  useEffect(() => {
    if (!address) {
      return;
    }
    // Load the giver LeaderBoards regardless on if the user has does not have the data nft in to entice them
    fetchMyGivenBitz();
  }, [address]);

  // fetch MY latest given bits count
  async function fetchMyGivenBitz() {
    // dont do it for when page load or collectedBitzSum is still being collected (collectedBitzSum will be -2 or -1 state)
    if (collectedBitzSum > 0) {
      bitzStore.updateGivenBitzSum(-2);
      const callConfig = {
        headers: {
          "fwd-tokenid": SUPPORTED_SOL_COLLECTIONS[0],
        },
      };
      try {
        console.log("GET CALL -----> xpGamePrivate/givenBits: giverAddr only");
        const res = await fetch(`${getApiWeb2Apps()}/datadexapi/xpGamePrivate/givenBits?giverAddr=${address}`, callConfig);
        const data = await res.json();
        await sleep(2);
        // update stores
        const sumGivenBits = data.bits ? parseInt(data.bits, 10) : -2;
        bitzStore.updateGivenBitzSum(sumGivenBits);
        if (sumGivenBits > 0) {
          bitzStore.updateBitzBalance(collectedBitzSum + bonusBitzSum - sumGivenBits); // update new balance (collected bits - given bits)
        }
      } catch (err: any) {
        const message = "Getting my sum givenBits failed:" + err.message;
        console.error(message);
      }
    }
  }

  // fetch the full leaderboard for all givers
  async function fetchGiverLeaderBoard() {
    setGiverLeaderBoardIsLoading(true);
    const callConfig = {
      headers: {
        "fwd-tokenid": SUPPORTED_SOL_COLLECTIONS[0],
      },
    };
    try {
      // S: ACTUAL LOGIC
      console.log("GET CALL -----> xpGamePrivate/giverLeaderBoard");
      const res = await fetch(`${getApiWeb2Apps()}/datadexapi/xpGamePrivate/giverLeaderBoard`, callConfig);
      const data = await res.json();
      const _toLeaderBoardTypeArr: LeaderBoardItemType[] = data.map((i: any) => {
        const item: LeaderBoardItemType = {
          playerAddr: i.giverAddr,
          bits: i.bits,
        };
        return item;
      });
      await sleep(2);
      setGiverLeaderBoard(_toLeaderBoardTypeArr);
      // E: ACTUAL LOGIC
    } catch (err: any) {
      const message = "Monthly Leaderboard fetching failed:" + err.message;
      console.error(message);
    }
    setGiverLeaderBoardIsLoading(false);
  }

  async function fetchBitSumAndGiverCounts({ getterAddr, campaignId }: { getterAddr: string; campaignId: string }): Promise<any> {
    const callConfig = {
      headers: {
        "fwd-tokenid": SUPPORTED_SOL_COLLECTIONS[0],
      },
    };
    try {
      const res = await fetch(
        `${getApiWeb2Apps()}/datadexapi/xpGamePrivate/getterBitSumAndGiverCounts?getterAddr=${getterAddr}&campaignId=${campaignId}`,
        callConfig
      );
      const data = await res.json();
      return data;
    } catch (err: any) {
      const message = "Getting sum and giver count failed :" + address + "  " + campaignId + err.message;
      console.error(message);
      return false;
    }
  }

  // fetch the given bits for a specific getter (creator campaign or bounty id)
  async function fetchGivenBitsForGetter({ getterAddr, campaignId }: { getterAddr: string; campaignId: string }) {
    const callConfig = {
      headers: {
        "fwd-tokenid": SUPPORTED_SOL_COLLECTIONS[0],
      },
    };
    try {
      console.log("GET CALL -----> xpGamePrivate/givenBits: giverAddr && getterAddr");
      const res = await fetch(
        `${getApiWeb2Apps()}/datadexapi/xpGamePrivate/givenBits?giverAddr=${address}&getterAddr=${getterAddr}&campaignId=${campaignId}`,
        callConfig
      );
      const data = await res.json();
      return data.bits !== undefined ? data.bits : 0;
    } catch (err: any) {
      const message = "Getting my rank on the all time leaderboard failed:" + err.message;
      console.error(message);
    }
  }

  // fetch a getter leaderboard (creator campaign or bounty id)
  async function fetchGetterLeaderBoard({ getterAddr, campaignId }: { getterAddr: string; campaignId: string }) {
    const callConfig = {
      headers: {
        "fwd-tokenid": SUPPORTED_SOL_COLLECTIONS[0],
      },
    };
    try {
      // S: ACTUAL LOGIC
      console.log("GET CALL -----> xpGamePrivate/getterLeaderBoard : getterAddr =", getterAddr);
      const res = await fetch(`${getApiWeb2Apps()}/datadexapi/xpGamePrivate/getterLeaderBoard?getterAddr=${getterAddr}&campaignId=${campaignId}`, callConfig);
      const data = await res.json();
      const _toLeaderBoardTypeArr: LeaderBoardItemType[] = data.map((i: any) => {
        const item: LeaderBoardItemType = {
          playerAddr: i.giverAddr,
          bits: i.bits,
        };
        return item;
      });
      return _toLeaderBoardTypeArr;
      // E: ACTUAL LOGIC
    } catch (err: any) {
      const message = "Monthly Leaderboard fetching failed:" + err.message;
      console.error(message);
    }
  }

  // find the data bounty with the given id and update its total received amount
  const updateDataBountyTotalReceivedAmount = (id: string, bitsVal: number, isNewGiver: number) => {
    setDataBounties((prevDataBounties) => {
      return prevDataBounties.map((dataBounty) => {
        if (dataBounty.bountyId === id) {
          return {
            ...dataBounty,
            receivedBitzSum: (dataBounty.receivedBitzSum ?? 0) + bitsVal,
            giverCounts: (dataBounty.giverCounts ?? 0) + isNewGiver,
          };
        }
        return dataBounty;
      });
    });
  };

  // send bits to creator or bounty
  async function sendPowerUp({
    bitsVal,
    bitsToWho,
    bitsToCampaignId,
    isNewGiver,
  }: {
    bitsVal: number;
    bitsToWho: string;
    bitsToCampaignId: string;
    isNewGiver: number;
  }) {
    try {
      const viewDataArgs = {
        headers: {
          "dmf-custom-give-bits": "1",
          "dmf-custom-give-bits-val": bitsVal,
          "dmf-custom-give-bits-to-who": bitsToWho,
          "dmf-custom-give-bits-to-campaign-id": bitsToCampaignId,
        },
        fwdHeaderKeys: ["dmf-custom-give-bits", "dmf-custom-give-bits-val", "dmf-custom-give-bits-to-who", "dmf-custom-give-bits-to-campaign-id"],
      };
      const giveBitzGameResult = await viewData(viewDataArgs, nfts[0]);
      if (giveBitzGameResult) {
        if (giveBitzGameResult?.data?.statusCode && giveBitzGameResult?.data?.statusCode != 200) {
          throw new Error("Error: Not possible to send power-up. Error code returned. Do you have enough BiTz to give?");
        } else {
          fetchMyGivenBitz();
          fetchGiverLeaderBoard();
          updateDataBountyTotalReceivedAmount(bitsToCampaignId, bitsVal, isNewGiver);
          return true;
        }
      } else {
        throw new Error("Error: Not possible to send power-up");
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function viewData(viewDataArgs: any, requiredDataNFT: any) {
    try {
      let usedPreAccessNonce = solPreaccessNonce;
      let usedPreAccessSignature = solPreaccessSignature;
      if (solPreaccessSignature === "" || solPreaccessTimestamp === -2 || solPreaccessTimestamp + 60 * 80 * 1000 < Date.now()) {
        const preAccessNonce = await itheumSolPreaccess();
        const message = new TextEncoder().encode(preAccessNonce);
        if (signMessage === undefined) throw new Error("signMessage is undefiend");
        const signature = await signMessage(message);
        if (!preAccessNonce || !signature || !publicKey) throw new Error("Missing data for viewData");
        const encodedSignature = bs58.encode(signature);
        updateSolPreaccessNonce(preAccessNonce);
        updateSolSignedPreaccess(encodedSignature);
        updateSolPreaccessTimestamp(Date.now());
        usedPreAccessNonce = preAccessNonce;
        usedPreAccessSignature = encodedSignature;
      }
      if (!publicKey) throw new Error("Missing data for viewData");
      const res = await itheumSolViewData(
        requiredDataNFT.id,
        usedPreAccessNonce,
        usedPreAccessSignature,
        publicKey,
        viewDataArgs.fwdHeaderKeys,
        viewDataArgs.headers
      );
      let blobDataType = BlobDataType.TEXT;
      let data;
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          data = await res.json();
        }
        return { data, blobDataType, contentType };
      } else {
        console.error("viewData threw catch error", res.statusText);

        return undefined;
      }
    } catch (err) {
      return undefined;
    }
  }

  return (
    <div id="givebits" className="flex flex-col max-w-[100%] border border-[#35d9fa] p-[2rem] rounded-[1rem] mt-[3rem]">
      <div className="flex flex-col mb-8 items-center justify-center">
        <h2 className="text-foreground text-4xl mb-2">Give Bitz</h2>
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

      <div id="giveLeaderboard" className="h-fit flex flex-col max-w-[100%] border border-[#35d9fa] mb-[3rem] rounded-[1rem] p-8">
        <h3 className="text-center mb-[1rem]">POWER-UP LEADERBOARD</h3>

        {giverLeaderBoardIsLoading ? (
          <div className="flex justify-center items-center h-100">
            <Loader />
          </div>
        ) : (
          <>
            {giverLeaderBoard && giverLeaderBoard.length > 0 ? (
              <LeaderBoardTable leaderBoardData={giverLeaderBoard} address={address ?? ""} />
            ) : (
              <div className="text-center">{"No Data Yet"!}</div>
            )}
          </>
        )}
      </div>

      <BonusBitzHistory />

      <div id="bounties" className="flex flex-col items-center justify-center">
        <div className="flex flex-col mt-10 mb-8 items-center justify-center ">
          <div className="flex flex-col md:flex-row items-center justify-center ">
            <h2 className="text-foreground text-4xl mb-2 text-center">Power-up Data Bounties </h2>
            <div className="flex flex-row ml-8 text-foreground text-4xl ">
              {publicKey && (
                <>
                  {bitzBalance === -2 ? `...` : <>{bitzBalance === -1 ? "0" : `${bitzBalance}`}</>}
                  <FlaskRound className=" w-10 h-10 fill-[#35d9fa]" />
                </>
              )}
            </div>
          </div>
          <span className="text-base text-foreground/75 text-center ">
            Power-Up Data Bounties (Ideas for new Data NFTs) with your BiTz XP, Climb Bounty Leaderboards and get bonus rewards if your Bounty is realized.
          </span>
        </div>

        <div
          className="flex flex-col md:flex-row md:flex-wrap gap-3 items-center md:items-center justify-center md:justify-center md:max-w-[100%] w-full antialiased pt-4 relative h-[100%]"
          style={{
            backgroundImage: `url(${bounty})`,
            objectFit: "scale-down",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}>
          {!fetchingDataBountiesReceivedSum ? (
            dataBounties.map((item: GiveBitzDataBounty) => {
              return (
                <PowerUpBounty
                  key={item.bountyId}
                  bounty={item}
                  sendPowerUp={sendPowerUp}
                  fetchGivenBitsForGetter={fetchGivenBitsForGetter}
                  fetchGetterLeaderBoard={fetchGetterLeaderBoard}
                  isSendingPowerUp={isSendingPowerUp}
                  setIsSendingPowerUp={setIsSendingPowerUp}
                />
              );
            })
          ) : (
            <div className="flex justify-center items-center h-100">
              <Loader />
            </div>
          )}
        </div>
        <div className="mt-8 group max-w-[60rem]" data-highlighter>
          <div className="relative bg-[#35d9fa]/80 dark:bg-[#35d9fa]/50  rounded-3xl p-[2px] before:absolute before:w-96 before:h-96 before:-left-48 before:-top-48 before:bg-[#35d9fa]  before:rounded-full before:opacity-0 before:pointer-events-none before:transition-opacity before:duration-500 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:hover:opacity-20 before:z-30 before:blur-[100px] after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:transition-opacity after:duration-500 after:[background:_radial-gradient(250px_circle_at_var(--mouse-x)_var(--mouse-y),theme(colors.sky.400),transparent)] after:group-hover:opacity-100 after:z-10 overflow-hidden">
            <div className="relative h-full bg-neutral-950/40 dark:bg-neutral-950/30  rounded-[inherit] z-20 overflow-hidden p-8">
              <div className="text-lg text-bond">💡 Got an idea for a Data Bounty?</div>
              <p>
                Anyone can submit an innovative idea for a Data Bounty, entice exiting and new Data Creators to &quot;fill&quot; your Data Bounty and earn
                rewards and &quot;community cred&quot; for your idea.
              </p>
              <p>
                <a
                  className="!text-[#35d9fa] hover:underline"
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdnuqbpdCZnYJ_twkf4wWoRBpSzzIiJBNgmv30HWUo1uNU_Ew/viewform?usp=sf_link"
                  target="blank">
                  Express your interest for a new Data Bounty
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiveBitzBase;
