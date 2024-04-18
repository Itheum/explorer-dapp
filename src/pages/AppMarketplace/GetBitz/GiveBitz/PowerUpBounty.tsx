import React, { useState, useEffect } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import moment from "moment-timezone";
import { Loader } from "components";
import { CopyAddress } from "components/CopyAddress";
import { Modal } from "components/Modal/Modal";
import { useGetAccount } from "hooks";
import { HoverBorderGradient } from "libComponents/Animated/HoverBorderGradient";
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
    gameDataNFT,
    sendPowerUp,
    fetchGivenBitsForGetter,
    fetchGetterLeaderBoard,
    fetchMyGivenBitz,
    fetchGiverLeaderBoard,
  } = props;
  const { address } = useGetAccount();
  const [bitsVal, setBitsVal] = useState<number>(0);
  const [bitsGivenToCreator, setBitsGivenToCreator] = useState<number>(-1);
  const [powerUpSending, setPowerUpSending] = useState<boolean>(false);
  const { chainID } = useGetNetworkConfig();
  const [getterLeaderBoardIsLoading, setGetterLeaderBoardIsLoading] = useState<boolean>(false);
  const [getterLeaderBoard, setGetterLeaderBoard] = useState<LeaderBoardItemType[]>([]);
  const [isPowerUpSuccess, setIsPowerUpSuccess] = useState<boolean>(false);
  const [tweetText, setTweetText] = useState<string>("");

  useEffect(() => {
    if (address && bountySubmitter && gameDataNFT && bountyId) {
      loadBaseData();
    }
  }, [address, bountySubmitter, gameDataNFT, bountyId]);

  async function loadBaseData() {
    const _fetchGivenBitsForCreator = await fetchGivenBitsForGetter({ getterAddr: bountySubmitter, campaignId: bountyId });
    setBitsGivenToCreator(_fetchGivenBitsForCreator);
    setGetterLeaderBoardIsLoading(true);
    const _toLeaderBoardTypeArr: LeaderBoardItemType[] = await fetchGetterLeaderBoard({ getterAddr: bountySubmitter, campaignId: bountyId });
    setGetterLeaderBoard(_toLeaderBoardTypeArr);
    setGetterLeaderBoardIsLoading(false);
  }

  function handleGiveBitzChange(bitz: number) {
    setBitsVal(bitz);
  }

  async function handlePowerUp() {
    setPowerUpSending(true);
    setIsPowerUpSuccess(false);
    setTweetText("");

    const _isPowerUpSuccess = await sendPowerUp({ bitsVal, bitsToWho: bountySubmitter, bitsToCampaignId: bountyId });

    if (_isPowerUpSuccess) {
      await sleep(1);
      setBitsGivenToCreator(-1);
      const _fetchGivenBitsForCreator = await fetchGivenBitsForGetter({ getterAddr: bountySubmitter, campaignId: bountyId });

      setBitsGivenToCreator(_fetchGivenBitsForCreator);

      await sleep(1);

      setGetterLeaderBoardIsLoading(true);
      const _toLeaderBoardTypeArr: LeaderBoardItemType[] = await fetchGetterLeaderBoard({ getterAddr: bountySubmitter, campaignId: bountyId });

      await sleep(1);
      fetchMyGivenBitz();
      fetchGiverLeaderBoard();

      setIsPowerUpSuccess(true);

      setTweetText(
        `url=https://explorer.itheum.io/getbitz?r=${address}&text=I just gave ${bitsVal} of my precious %23itheum <BiTz> XP to Power-Up a Data Bounty in return for some exclusive rewards and perks.%0A%0AWhat are you waiting for? %23GetBiTz and %23GiveBiTz here`
      );
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

      {address && (
        <>
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

              <Modal
                openTrigger={
                  <Button
                    disabled={!(bitsVal > 0) || powerUpSending}
                    className="cursor-pointer mt-3"
                    onClick={() => {
                      setIsPowerUpSuccess(false);
                      setTweetText("");
                    }}>
                    Send {bitsVal} BiTz Power Up
                  </Button>
                }
                closeOnOverlayClick={false}
                title={(isPowerUpSuccess && "Power-up Success!") || `Power-up a Data Bounty with ${bitsVal} BiTz?`}
                hasFilter={false}
                filterData={[]}
                modalClassName={"p-8"}
                titleClassName={""}>
                <div>
                  {!isPowerUpSuccess && (
                    <>
                      <div className="mt-5 text-lg">{`Are you sure you want to power-up ${bountySubmitter} with ${bitsVal} BiTz?`}</div>
                      <div className="mt-5 text-md">
                        🛟 Giving BiTz is super rewarding but cannot be un-done, so before you proceed make sure you read and agree to the Give BiTz terms of
                        use{" "}
                        <a
                          className="!text-[#7a98df] hover:underline"
                          href="https://docs.itheum.io/product-docs/legal/ecosystem-tools-terms/bitz-xp/give-bitz"
                          target="blank">
                          Give BiTz terms of use
                        </a>
                      </div>
                      <Button disabled={!(bitsVal > 0) || powerUpSending} className="cursor-pointer mt-3" onClick={handlePowerUp}>
                        I agree, Send {bitsVal} BiTz Power Up
                      </Button>
                      {powerUpSending && <div>Sending PowerUp...</div>}
                    </>
                  )}

                  {isPowerUpSuccess && (
                    <div className="rounded-full p-[1px] -z-1">
                      <p className="text-2xl p-2 mt-5">w👀t! w👀t! your power-up has been sent. Share this with the world Itheum OG!</p>
                      <HoverBorderGradient className="-z-1">
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
                  )}
                </div>
              </Modal>

              {/* <Button disabled={!(bitsVal > 0) || powerUpSending} className="cursor-pointer mt-3" onClick={handlePowerUp}>
                Send {bitsVal} BiTz Power Up
              </Button> */}
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
        </>
      )}
    </div>
  );
};

export default PowerUpBounty;
