import React, { useState, useEffect } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import moment from "moment-timezone";
import bounty from "assets/img/getbitz/givebitz/bounty12.jpg";
import { Loader } from "components";
import { CopyAddress } from "components/CopyAddress";
import { Modal } from "components/Modal/Modal";
import { useGetAccount } from "hooks";
import { Highlighter } from "libComponents/animated/HighlightHoverEffect";
import { HoverBorderGradient } from "libComponents/animated/HoverBorderGradient";
import { Button } from "libComponents/Button";
import { sleep } from "libs/utils";
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

  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const { chainID } = useGetNetworkConfig();

  const { address } = useGetAccount();
  // const [bitsGivenToCreator, setBitsGivenToCreator] = useState<number>(-1);
  // const [powerUpSending, setPowerUpSending] = useState<boolean>(false);
  // const { chainID } = useGetNetworkConfig();
  const [getterLeaderBoardIsLoading, setGetterLeaderBoardIsLoading] = useState<boolean>(false);
  const [getterLeaderBoard, setGetterLeaderBoard] = useState<LeaderBoardItemType[]>([]);
  // const [isPowerUpSuccess, setIsPowerUpSuccess] = useState<boolean>(false);
  // const [tweetText, setTweetText] = useState<string>("");

  // useEffect(() => {
  //   if (address && bountySubmitter && gameDataNFT && bountyId) {
  //     loadBaseData();
  //   }
  // }, [address, bountySubmitter, gameDataNFT, bountyId]);

  async function loadBaseData() {
    // const _fetchGivenBitsForCreator = await fetchGivenBitsForGetter({ getterAddr: bountySubmitter, campaignId: bountyId });
    // setBitsGivenToCreator(_fetchGivenBitsForCreator);
    setGetterLeaderBoardIsLoading(true);
    const _toLeaderBoardTypeArr: LeaderBoardItemType[] = await fetchGetterLeaderBoard({ getterAddr: bountySubmitter, campaignId: bountyId });
    // const leaderboardEntries =
    //   _toLeaderBoardTypeArr.length < 20
    //     ? [..._toLeaderBoardTypeArr, ...new Array(20 - _toLeaderBoardTypeArr.length).fill({ playerAddr: "test", bits: 0 })]
    //     : _toLeaderBoardTypeArr.slice(0, 20);
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
        <div className="relative bg-[#35d9fa]/70 dark:bg-[#35d9fa]/30  rounded-3xl p-[2px] before:absolute before:w-96 before:h-96 before:-left-48 before:-top-48 before:bg-[#35d9fa]  before:rounded-full before:opacity-0 before:pointer-events-none before:transition-opacity before:duration-500 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:hover:opacity-20 before:z-30 before:blur-[100px] after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:transition-opacity after:duration-500 after:[background:_radial-gradient(250px_circle_at_var(--mouse-x)_var(--mouse-y),theme(colors.sky.400),transparent)] after:group-hover:opacity-100 after:z-10 overflow-hidden">
          <div className="relative h-full bg-neutral-950/40 dark:bg-neutral-950/60  rounded-[inherit] z-20 overflow-hidden p-4 md:p-8">
            {/* <div className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none -z-10 w-1/3 aspect-square" aria-hidden="true">
              <div className="absolute inset-0 translate-z-0 rounded-full bg-slate-800 group-[.swiper-slide-active]/slide:bg-purple-500 transition-colors duration-500 ease-in-out blur-[60px]"></div>
              </div> */}
            {/* <div
              className="-z-1 absolute w-full h-full"
              style={{
                backgroundImage: `url(${bounty})`,
                opacity: 0.2,
                objectFit: "cover",
                objectPosition: "center",
                backgroundRepeat: "no-repeat",
              }} />   */}
            {true ? (
              <>
                <div className="mb-3 text-lg font-bold p-1">{title}</div>
                <div className="py-2 border-b-4  border-[#35d9fa]/30 text-sm">
                  {summary} <br />
                  <a className="!text-[#35d9fa] hover:underline" href={readMoreLink} target="blank">
                    Read More
                  </a>
                </div>
                <div className="my-2">
                  Submitted Id: <CopyAddress address={bountySubmitter} precision={8} />
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
                    fetchGetterLeaderBoard={fetchGetterLeaderBoard}
                    fetchMyGivenBitz={fetchMyGivenBitz}
                    fetchGiverLeaderBoard={fetchGiverLeaderBoard}
                  />
                )}

                {address && (
                  <div
                    className="rounded-b-3xl w-full bg-[#35d9fa]/30 dark:bg-neutral-950  cursor-pointer text-foreground relative"
                    onClick={handleLeaderboard}
                    // style={{ backgroundImage: `url(${bounty})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                    //TODO create a separate component with the leaderboard
                  >
                    <div className="flex  item-center justify-center border-t-4 border-[#35d9fa]/30   ">
                      <p className="p-2">{showLeaderboard ? "Close" : "Leaderboard"} </p>{" "}
                    </div>
                    {showLeaderboard && (
                      <motion.div
                        initial={{ y: 0 }}
                        animate={{ opacity: 1, y: -753 }}
                        transition={{ duration: 1, type: "spring" }}
                        className="z-20 h-[750px] -mt-10 md:-mt-0 md:h-[710px] overflow-y-auto border border-[#35d9fa]/30 shadow-inner shadow-[#35d9fa]/30 bg-[#2495AC] dark:bg-[#022629] absolute p-4 rounded-t-3xl z-100">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col max-w-[100%] p-[.5rem] mb-[3rem] rounded-[1rem]">
                          <h4 className="text-center text-white mb-[1rem] !text-[1rem]">GIVER LEADERBOARD</h4>
                          {getterLeaderBoardIsLoading ? (
                            <Loader />
                          ) : (
                            <>
                              {getterLeaderBoard && getterLeaderBoard.length > 0 ? (
                                leaderBoardTable(getterLeaderBoard, address)
                              ) : (
                                <div className="text-center">{!chainID ? "Connect Wallet to Check" : "No Data Yet"!}</div>
                              )}
                            </>
                          )}
                        </motion.div>
                      </motion.div>
                    )}{" "}
                  </div>
                )}
              </>
            ) : (
              <></>
              // <motion.div layout onClick={() => setShowLeaderboard(!showLeaderboard)}>
              //   <motion.h2 layout="position"> Framer motion</motion.h2>
              //   {showLeaderboard && (
              //     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              //       <div className="flex flex-col max-w-[100%] p-[.5rem] mb-[3rem] rounded-[1rem]">
              //         <h4 className="text-center text-white mb-[1rem] !text-[1rem]">GIVER LEADERBOARD</h4>
              //         {getterLeaderBoardIsLoading ? (
              //           <Loader />
              //         ) : (
              //           <>
              //             {getterLeaderBoard && getterLeaderBoard.length > 0 ? (
              //               leaderBoardTable(getterLeaderBoard, address)
              //             ) : (
              //               <div className="text-center">{!chainID ? "Connect Wallet to Check" : "No Data Yet"!}</div>
              //             )}
              //           </>
              //         )}
              //       </div>
              //     </motion.div>
              //   )}
              // </motion.div>

              // <div className="flex flex-col w-full h-full">
              //   <div className="flex flex-col max-w-[100%] p-[.5rem] mb-[3rem] rounded-[1rem]">
              //     <h4 className="text-center text-white mb-[1rem] !text-[1rem]">GIVER LEADERBOARD</h4>
              //     {getterLeaderBoardIsLoading ? (
              //       <Loader />
              //     ) : (
              //       <>
              //         {getterLeaderBoard && getterLeaderBoard.length > 0 ? (
              //           leaderBoardTable(getterLeaderBoard, address)
              //         ) : (
              //           <div className="text-center">{!chainID ? "Connect Wallet to Check" : "No Data Yet"!}</div>
              //         )}
              //       </>
              //     )}
              //   </div>
              // </div>
            )}
            {/* <Modal
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
                              🛟 Giving BiTz is super rewarding but cannot be un-done, so before you proceed make sure you read and agree to the Give BiTz terms
                              of use{" "}
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
                    </Modal> */}
            {/* <Button disabled={!(bitsVal > 0) || powerUpSending} className="cursor-pointer mt-3" onClick={handlePowerUp}>
                Send {bitsVal} BiTz Power Up
              </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerUpBounty;
