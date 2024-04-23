import React, { useEffect, useState } from "react";
import { ExternalLinkIcon, Loader } from "lucide-react";
import { HoverBorderGradient } from "libComponents/animated/HoverBorderGradient";
import { Button } from "libComponents/Button";
import "./CustomRangeSlider.css";
import { useGetAccount, useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { LeaderBoardItemType } from "..";
import { sleep } from "libs/utils";
import { useAccountStore } from "store/account";

export interface LeaderBoardGiverItemType {
  giverAddr: string;
  bits: number;
}
interface GiveBitzLowerCardProps {
  bountySubmitter: string;
  bountyId: string;
  sendPowerUp: (args: { bitsVal: number; bitsToWho: string; bitsToCampaignId: string }) => Promise<boolean>;
  fetchGivenBitsForGetter: (args: { getterAddr: string; campaignId: string }) => Promise<number>;
  fetchMyGivenBitz: () => void;
  fetchGetterLeaderBoard: (args: { getterAddr: string; campaignId: string }) => Promise<LeaderBoardItemType[]>;
  fetchGiverLeaderBoard: () => void;
}

const GiveBitzLowerCard: React.FC<GiveBitzLowerCardProps> = (props) => {
  const { bountyId, bountySubmitter, sendPowerUp, fetchGivenBitsForGetter, fetchGetterLeaderBoard, fetchMyGivenBitz, fetchGiverLeaderBoard } = props;
  const [isPowerUpSuccess, setIsPowerUpSuccess] = useState(false);
  const [tweetText, setTweetText] = useState("");
  const [termsOfUseCheckbox, setTermsOfUseCheckbox] = useState(false);
  const { address } = useGetAccount();
  const [bitzVal, setBitzVal] = useState<number>(0);
  const [bitzGivenToCreator, setBitzGivenToCreator] = useState<number>(-1);
  const [powerUpSending, setPowerUpSending] = useState<boolean>(false);
  const bitzBalance = useAccountStore((state: any) => state.bitzBalance);

  // const [getterLeaderBoardIsLoading, setGetterLeaderBoardIsLoading] = useState<boolean>(false);
  // const [getterLeaderBoard, setGetterLeaderBoard] = useState<LeaderBoardGiverItemType[]>([]);

  const sliderEl = document.querySelector("#rangeBitz") as HTMLInputElement;

  useEffect(() => {
    async function fetchData() {
      const _fetchGivenBitsForCreator = await fetchGivenBitsForGetter({ getterAddr: bountySubmitter, campaignId: bountyId });
      // console.log("GIVEN BITZ ", _fetchGivenBitsForCreator);
      setBitzGivenToCreator(_fetchGivenBitsForCreator);
    }
    fetchData();
  }, []);

  async function handlePowerUp() {
    setPowerUpSending(true);
    setIsPowerUpSuccess(false);
    setTweetText("");

    const _isPowerUpSuccess = await sendPowerUp({ bitsVal: bitzVal, bitsToWho: bountySubmitter, bitsToCampaignId: bountyId });

    if (_isPowerUpSuccess) {
      // await sleep(1);
      // setBitzGivenToCreator(-1);
      setBitzGivenToCreator((prev) => prev + bitzVal);

      /// TODO UNECESSARY CALL , we could compute it manually from the previous value

      // const _fetchGivenBitsForCreator = await fetchGivenBitsForGetter({ getterAddr: bountySubmitter, campaignId: bountyId });
      // console.log("GIVEN BITZ ", _fetchGivenBitsForCreator);
      // setBitzGivenToCreator(_fetchGivenBitsForCreator);

      //await sleep(1);

      // setGetterLeaderBoardIsLoading(true);
      // const _toLeaderBoardTypeArr: LeaderBoardItemType[] = await fetchGetterLeaderBoard({ getterAddr: bountySubmitter, campaignId: bountyId });

      //await sleep(1);
      fetchMyGivenBitz();
      fetchGiverLeaderBoard();

      setIsPowerUpSuccess(true);

      setTweetText(
        `url=https://explorer.itheum.io/getbitz?r=${address}&text=I just gave ${bitzVal} of my precious %23itheum <BiTz> XP to Power-Up a Data Bounty in return for some exclusive rewards and perks.%0A%0AWhat are you waiting for? %23GetBiTz and %23GiveBiTz here`
      );
      // setGetterLeaderBoard(_toLeaderBoardTypeArr);
      // setGetterLeaderBoardIsLoading(false);
    }

    setBitzVal(0); // reset the figure the user sent
    setPowerUpSending(false);
  }

  return (
    <div className="h-[18rem]">
      <div className=" items-center gap-2   my-rank-and-score  flex  justify-center border p-[.6rem] mb-[1rem] rounded-[1rem] text-center bg-[#35d9fa] bg-opacity-25">
        <p className="flex  md:text-lg md:mr-[1rem]">Given BiTz</p>
        <p className="text-lg md:text-xl dark:text-[#35d9fa] font-bold">
          {bitzGivenToCreator === -1 ? "Loading..." : <>{bitzGivenToCreator === -2 ? "0" : bitzGivenToCreator}</>}
        </p>
      </div>

      {isPowerUpSuccess ? (
        <div className="flex flex-col items-center justify-between w-full h-[75%]">
          <p> Maybe a message ? Good job on supporting ideas </p>
          <HoverBorderGradient className="-z-1 ">
            <a
              className="z-1 bg-black text-white  rounded-3xl gap-2 flex flex-row justify-center items-center"
              href={"https://twitter.com/intent/tweet?" + tweetText}
              data-size="large"
              target="_blank">
              <span className=" [&>svg]:h-4 [&>svg]:w-4 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
                  <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                </svg>
              </span>
              <p className="z-10">Tweet</p>
            </a>
          </HoverBorderGradient>
        </div>
      ) : (
        <div className="flex flex-col">
          <div>Give More BiTz</div>
          <div className="mb-3 mt-1">
            <input
              type="range"
              id="rangeBitz"
              min="0"
              max={bitzBalance}
              step="1"
              value={bitzVal}
              onChange={(e) => setBitzVal(Number(e.target.value))}
              className="accent-black dark:accent-white w-[90%] cursor-pointer   custom-range-slider  "
            />
            <div className="flex flex-row gap-2">
              <input
                type="checkbox"
                required
                className="cursor-pointer accent-[#35d9fa]"
                checked={termsOfUseCheckbox}
                onChange={(e) => setTermsOfUseCheckbox(e.target.checked)}
              />
              <div className="mt-5 text-md ">
                I have read and agree to the <br />
                <a
                  className="!text-[#35d9fa] hover:underline flex flex-row gap-2"
                  href="https://docs.itheum.io/product-docs/legal/ecosystem-tools-terms/bitz-xp/give-bitz"
                  target="blank">
                  Give BiTz terms of use <ExternalLinkIcon width={16} />
                </a>
              </div>
            </div>
          </div>

          <button
            disabled={!(bitzVal > 0) || powerUpSending || !termsOfUseCheckbox}
            className="hover:none flex items-center justify-center border disabled:bg-[#35d9fa]/30 bg-[#35d9fa]/80 mt-10 w-[12rem] md:w-[15rem] mx-auto rounded-3xl h-10"
            onClick={() => {
              setIsPowerUpSuccess(false);
              setTweetText("");
              handlePowerUp();
            }}>
            {!powerUpSending ? (
              <div className=" flex items-center m-[2px] justify-center bg-neutral-950  w-full h-full rounded-3xl">Send {bitzVal} BiTz Power Up </div>
            ) : (
              <div className="w-[12rem] md:w-[15rem] h-10 relative inline-flex  overflow-hidden rounded-3xl p-[1px] text-foreground ">
                <span className="absolute hover:bg-[#35d9fa] inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF03,#45d4ff_50%,#111111_50%)]" />
                <span className="inline-flex h-full hover:bg-gradient-to-tl from-background to-[#35d9fa] w-full cursor-pointer items-center justify-center rounded-3xl bg-neutral-950 px-3 py-1 text-sm font-medium   backdrop-blur-3xl">
                  Sending bitz...
                </span>
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default GiveBitzLowerCard;
