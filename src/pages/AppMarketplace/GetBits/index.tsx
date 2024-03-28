import React, { useEffect, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { confetti } from "@tsparticles/confetti";
import { fireworks } from "@tsparticles/fireworks";
import axios, { AxiosError } from "axios";
import Countdown from "react-countdown";
import { Link } from "react-router-dom";
import { GET_BITS_TOKEN } from "appsConfig";
import { CopyAddress } from "components/CopyAddress";
import { routeNames } from "routes";
import "./GetBits.css";

// Image Layers
import ImgLogin from "assets/img/getbits/getbits-login.gif";
import ImgGetDataNFT from "assets/img/getbits/getbits-get-datanft.gif";
import ImgPlayGame from "assets/img/getbits/getbits-play.gif";
import FingerPoint from "assets/img/getbits/finger-point.gif";
import ImgGameCanvas from "assets/img/getbits/getbits-game-canvas.gif";
import Meme1 from "assets/img/getbits/memes/1.jpg";
import Meme2 from "assets/img/getbits/memes/2.jpg";
import Meme3 from "assets/img/getbits/memes/3.jpg";
import Meme4 from "assets/img/getbits/memes/4.jpg";
import Meme5 from "assets/img/getbits/memes/5.jpg";
import Meme6 from "assets/img/getbits/memes/6.jpg";
import aladinRugg from "assets/img/getbits/aladin.png";
import { BurningImage } from "./BurningImage";

import SacrificeGodLoader from "assets/img/getbits/sacrifice-god-loader.mp4";
import { Loader } from "components";
import { MARKETPLACE_DETAILS_PAGE } from "config";
import { useGetAccount, useGetPendingTransactions } from "hooks";
import { BlobDataType, ExtendedViewDataReturnType } from "libs/types";
import { decodeNativeAuthToken, toastError, sleep, getApiWeb2Apps } from "libs/utils";
import { useAccountStore } from "../../../store/account";
import { motion } from "framer-motion";
import { HoverBorderGradient } from "libComponents/Animated/HoverBorderGradient";

interface LeaderBoardItemType {
  playerAddr: string;
  bits: number;
}

const MEME_IMGS = [Meme1, Meme2, Meme3, Meme4, Meme5, Meme6];

export const GetBits = () => {
  const { address } = useGetAccount();
  const { tokenLogin } = useGetLoginInfo();
  const { chainID } = useGetNetworkConfig();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const [gameDataNFT, setGameDataNFT] = useState<DataNft>();
  const [hasGameDataNFT, setHasGameDataNFT] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(false);
  const [isMemeBurnHappening, setIsMemeBurnHappening] = useState<boolean>(false);
  const [gameDataFetched, setGameDataFetched] = useState<boolean>(false);
  const [loadBlankGameCanvas, setLoadBlankGameCanvas] = useState<boolean>(false);
  const [viewDataRes, setViewDataRes] = useState<ExtendedViewDataReturnType>();
  const bitsBalance = useAccountStore((state: any) => state.bitsBalance);
  const updateBitsBalance = useAccountStore((state) => state.updateBitsBalance);
  const [burnFireScale, setBurnFireScale] = useState<string>("scale(0) translate(-13px, -15px)");
  const [burnFireGlow, setBurnFireGlow] = useState<number>(0);
  const [randomMeme, setRandomMeme] = useState<any>(Meme1);
  let tweetText = `url=https://explorer.itheum.io/getbits&text=I just played the Get <BiTz> XP Game on %23itheum ${viewDataRes?.data.gamePlayResult.bitsWon > 0 ? "and won " + viewDataRes?.data.gamePlayResult.bitsWon + " <BiTz> points!" : "!"} Play now and get your own <BiTz>! %23GetBiTz`;

  // LeaderBoard
  const [leaderBoardAllTime, setLeaderBoardAllTime] = useState<LeaderBoardItemType[]>([]);
  const [leaderBoardMonthly, setLeaderBoardMonthly] = useState<LeaderBoardItemType[]>([]);
  const [leaderBoardMonthString, setLeaderBoardMonthString] = useState<string>("");
  const [leaderBoardIsLoading, setLeaderBoardIsLoading] = useState<boolean>(false);

  // const [bypassDebug, setBypassDebug] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!hasPendingTransactions) {
      fetchDataNfts();
    }
  }, [hasPendingTransactions]);

  useEffect(() => {
    if (!isLoading && address) {
      fetchMyNfts();
    }
  }, [isLoading, address]);

  useEffect(() => {
    if (!chainID) {
      return;
    }

    // Load the LeaderBoards regardless on if the user has does not have the data nft in to entice them
    fetchAndLoadLeaderBoards();
  }, [chainID]);

  // first, we get the Data NFT details needed for this game (but not if the current user has it)
  async function fetchDataNfts() {
    setIsLoading(true);

    const _gameDataNFT = await DataNft.createFromApi(GET_BITS_TOKEN);
    setGameDataNFT(_gameDataNFT);

    setIsLoading(false);
  }

  // secondly, we get the user's Data NFTs and flag if the user has the required Data NFT for the game in their wallet
  async function fetchMyNfts() {
    if (gameDataNFT) {
      const _dataNfts = await DataNft.ownedByAddress(address);
      const hasRequiredDataNFT = _dataNfts.find((dNft) => gameDataNFT.nonce === dNft.nonce);
      setHasGameDataNFT(hasRequiredDataNFT ? true : false);

      setRandomMeme(MEME_IMGS[Math.floor(Math.random() * MEME_IMGS.length)]); // set a random meme as well
    }
  }

  async function memeBurn() {
    // animation uses: https://codepen.io/freedommayer/pen/vYRrarM
    setIsMemeBurnHappening(true);

    await sleep(1);
    setBurnFireScale("scale(1) translate(-13px, -15px)");
    setBurnFireGlow(1 * 0.1);
    await sleep(2);
    setBurnFireScale("scale(3) translate(-13px, -15px)");
    setBurnFireGlow(3 * 0.1);
    await sleep(2);
    setBurnFireScale("scale(5) translate(-13px, -15px)");
    setBurnFireGlow(5 * 0.1);
    await sleep(2);
    setBurnFireScale("scale(7) translate(-13px, -15px)");
    setBurnFireGlow(7 * 0.1);
    await sleep(2);
    setBurnFireScale("scale(9) translate(-13px, -15px)");
    await sleep(2);
    setBurnFireScale("scale(10) translate(-13px, -15px)");
    await sleep(5);

    setIsMemeBurnHappening(false);

    playGame();
  }

  async function playGame() {
    if (!(tokenLogin && tokenLogin.nativeAuthToken)) {
      throw Error("No Native Auth token");
    }

    if (!gameDataNFT) {
      toastError("ER6: Game NFT Data is not loaded");
      return;
    }

    setIsFetchingDataMarshal(true);

    await sleep(5);

    const viewDataArgs = {
      mvxNativeAuthOrigins: [decodeNativeAuthToken(tokenLogin.nativeAuthToken).origin],
      mvxNativeAuthMaxExpirySeconds: 3600,
      fwdHeaderMapLookup: {
        "authorization": `Bearer ${tokenLogin.nativeAuthToken}`,
      },
      fwdHeaderKeys: "authorization",
    };

    const viewDataPayload: ExtendedViewDataReturnType | undefined = await viewData(viewDataArgs, gameDataNFT);

    if (viewDataPayload) {
      if (viewDataPayload.data.gamePlayResult.bitsWon > 0) {
        if (viewDataPayload.data.gamePlayResult.userWonMaxBits === 1) {
          (async () => {
            await fireworks({ background: "transparent" });
          })();
        } else {
          (async () => {
            await confetti({ count: 500 });
          })();
        }
      }
      setGameDataFetched(true);
      setIsFetchingDataMarshal(false);
      setViewDataRes(viewDataPayload);

      if (viewDataPayload.data.gamePlayResult.bitsScoreAfterPlay > -1) {
        updateBitsBalance(viewDataPayload.data.gamePlayResult.bitsScoreAfterPlay);
      }

      // if the user won something, then we should reload the LeaderBoards
      if (viewDataPayload.data.gamePlayResult.bitsWon > 0) {
        fetchAndLoadLeaderBoards();
      }
    } else {
      toastError("ER2: Did not get a response from the game server");
      setIsFetchingDataMarshal(false);
    }
  }

  function resetToStartGame() {
    setIsMemeBurnHappening(false);
    setRandomMeme(MEME_IMGS[Math.floor(Math.random() * MEME_IMGS.length)]); // set a random meme as well
    setBurnFireScale("scale(0) translate(-13px, -15px)");
    setBurnFireGlow(0);

    setGameDataFetched(false);
    setIsFetchingDataMarshal(false);
    setViewDataRes(undefined);
  }

  async function viewData(viewDataArgs: any, requiredDataNFT: DataNft) {
    try {
      if (!gameDataNFT) {
        toastError("ER3: Game NFT Data is not loaded");
        return;
      }

      return viewDataJSONCore(viewDataArgs, requiredDataNFT);
    } catch (err) {
      console.error(err);
      toastError((err as Error).message);
      setIsFetchingDataMarshal(false);

      return undefined;
    }
  }

  function goToMarketplace(tokenIdentifier: string) {
    window.open(`${MARKETPLACE_DETAILS_PAGE}${tokenIdentifier}`)?.focus();
  }

  function gamePlayImageSprites() {
    let _viewDataRes = viewDataRes;

    let _loadBlankGameCanvas = loadBlankGameCanvas;
    let _gameDataFetched = gameDataFetched;
    let _isFetchingDataMarshal = isFetchingDataMarshal;
    let _isMemeBurnHappening = isMemeBurnHappening;

    // if (!viewDataRes && !bypassDebug) {
    //   // for local UI debugging
    //   _loadBlankGameCanvas = true;
    //   _gameDataFetched = false;
    //   _isFetchingDataMarshal = false;
    //   _isMemeBurnHappening = false;

    //   _viewDataRes = {
    //     contentType: "string",
    //     data: {
    //       gamePlayResult: {
    //         bitsScoreBeforePlay: -1, // points before current play
    //         bitsScoreAfterPlay: -1, // points after current play
    //         bitsWon: -1, // can be 0 for no win, no 5-50. -1 means they tried to paly to soon
    //         userWonMaxBits: -1, // the user just won the maximum bits? 1 for yes, -1 for no
    //         lastPlayedBeforeThisPlay: -1, // the timestampbefore current play
    //         lastPlayedAndCommitted: -1, // the latest timestamp of current play
    //         configCanPlayEveryMSecs: -1, // how many Mili seconds interval before being able to play again
    //         // triedTooSoonTryAgainInMs: -1, // played too soon before allowed, so they have to wait this many Mili seconds to play (use for countdown timer to next play)
    //         triedTooSoonTryAgainInMs: 6000, // played too soon before allowed, so they have to wait this many Mili seconds to play (use for countdown timer to next play)
    //       },
    //     },
    //   };
    // }

    // console.log("_viewDataRes", _viewDataRes);

    // user is note logged in, ask them to connect wallet
    if (!address) {
      return (
        <Link to={routeNames.unlock} state={{ from: location.pathname }}>
          <img className="rounded-[3rem] w-full cursor-pointer" src={ImgLogin} alt={"Connect your wallet to play"} />
        </Link>
      );
    }

    // user is logged in does not have the data nft, so take them to the marketplace
    if (address && !hasGameDataNFT) {
      return (
        <div
          onClick={() => {
            if (gameDataNFT) {
              goToMarketplace(gameDataNFT.tokenIdentifier);
            }
          }}>
          <img className="rounded-[3rem] w-full cursor-pointer" src={ImgGetDataNFT} alt={"Get <BiTS> Data NFT from Data NFT Marketplace"} />
        </div>
      );
    }

    // user has data nft, so load the "start game" view
    if (!_loadBlankGameCanvas && !_isFetchingDataMarshal) {
      return (
        <div
          onClick={() => {
            setLoadBlankGameCanvas(true);
          }}>
          <img className="rounded-[3rem] w-full cursor-pointer" src={ImgPlayGame} alt={"Start Game"} />
        </div>
      );
    }

    const CountDownComplete = () => (
      <div
        className="cursor-pointer underline decoration-pink-500"
        onClick={() => {
          resetToStartGame();
        }}>
        RIGHT NOW! What are you waiting for? (Click Here)
      </div>
    );

    // Renderer callback with condition
    const countdownRenderer = (props: { hours: number; minutes: number; seconds: number; completed: boolean }) => {
      if (props.completed) {
        // Render a complete state
        return <CountDownComplete />;
      } else {
        // Render a countdown
        return (
          <span>
            {props.hours}H:{props.minutes}M:{props.seconds}S
          </span>
        );
      }
    };

    // user clicked on the start game view, so load the empty blank game canvas
    if (_loadBlankGameCanvas && !_gameDataFetched) {
      return (
        <div className="relative overflow-hidden">
          <img className="rounded-[3rem] w-full cursor-pointer" src={ImgGameCanvas} alt={"Play Game"} />

          <div
            className="flex justify-center items-center mt-[10px] w-[100%] h-[350px] rounded-[3rem] bg-slate-50 text-gray-950 p-[1rem] border border-primary/50 static
                        md:absolute md:p-[2rem] md:pb-[.5rem] md:w-[500px] md:h-[400px] md:mt-0 md:top-[40%] md:left-[50%] md:-translate-x-1/2 md:-translate-y-1/2">
            {(!_isFetchingDataMarshal && !_isMemeBurnHappening && (
              <>
                <div
                  className="text-center text-xl text-gray-950 text-foreground cursor-pointer"
                  onClick={() => {
                    // setBypassDebug(true);
                    memeBurn();
                  }}>
                  <p className="md:text-md">We love our Itheum OGs! So get ready to grab yourself some of them sWeet sWeet {`<BiTS>`} points?</p>
                  <p className="font-bold md:text-2xl mt-5">But the {`<BiTS>`} Generator God will need a Meme Sacrifice from you to proceed!</p>
                  <p className="font-bold mt-5">Click here when you are ready...</p>
                  <img className="w-[40px] m-auto" src={FingerPoint} alt={"Click to Start"} />{" "}
                </div>
              </>
            )) ||
              null}

            {_isMemeBurnHappening && (
              <div>
                <p className="text-center text-md text-gray-950 text-foreground   md:text-xl mb-[1rem]">Light up this meme sacrifice!</p>

                <BurningImage src={randomMeme} />
                <div className="glow" style={{ opacity: burnFireGlow }}></div>
                <div className="flame !top-[285px] md:!top-[90px]" style={{ transform: burnFireScale }}></div>
              </div>
            )}

            {_isFetchingDataMarshal && (
              <div>
                <p className="text-center text-md text-gray-950 text-foreground  md:text-xl mb-[1rem]">
                  Did the {`<BiTS>`} Generator God like that Meme Sacrifice?
                </p>
                <video className="w-[210px] md:w-[300px] m-auto" autoPlay loop src={SacrificeGodLoader} />
              </div>
            )}
          </div>
          {spritLayerPointsCloud()}
        </div>
      );
    }

    // we got the response from the game play
    if (_loadBlankGameCanvas && !_isFetchingDataMarshal && _gameDataFetched) {
      return (
        <div className="relative overflow-hidden">
          <img className="rounded-[3rem] w-full cursor-pointer" src={ImgGameCanvas} alt={"Get <BiTS> Points"} />
          <div
            className="flex justify-center items-center mt-[10px] w-[100%] h-[350px] rounded-[3rem] bg-slate-50 text-gray-950 p-[1rem] border border-primary/50 static
                        md:absolute md:p-[2rem] md:pb-[.5rem] md:w-[500px] md:h-[400px] md:mt-0 md:top-[40%] md:left-[50%] md:-translate-x-1/2 md:-translate-y-1/2">
            {_viewDataRes && !_viewDataRes.error && (
              <>
                {_viewDataRes.data.gamePlayResult.triedTooSoonTryAgainInMs > 0 && (
                  <div>
                    <p className="text-2xl text-center">You FOMOed in too fast, try again in:</p>
                    <div className="text-2xl text-center mt-[2rem]">
                      <Countdown date={Date.now() + _viewDataRes.data.gamePlayResult.triedTooSoonTryAgainInMs} renderer={countdownRenderer} />
                    </div>
                  </div>
                )}

                {_viewDataRes.data.gamePlayResult.triedTooSoonTryAgainInMs === -1 && (
                  <div className="flex flex-col justify-around h-[100%] items-center text-center">
                    {_viewDataRes.data.gamePlayResult.bitsWon === 0 && (
                      <div>
                        <p className="text-2xl">OPPS! Aladdin Rugged You! 0 Points this Time...</p>
                        <motion.img
                          className=" w-[150px] lg:w-full absolute"
                          src={aladinRugg}
                          initial={{ x: -750, y: 0 }}
                          animate={{
                            scale: [0.5, 1, 1, 0.5],
                            rotate: [0, 0, -360, -360, -360, -360],
                            opacity: [0.8, 1, 1, 1, 1, 1, 1, 0],
                            x: [-750, 0, 200, 1000],
                          }}
                          transition={{ duration: 8 }}
                        />
                      </div>
                    )}

                    {(_viewDataRes.data.gamePlayResult.bitsWon > 0 && (
                      <>
                        <p className="text-2xl text-gray-950">w00t! w00t! You have won:</p>
                        <p className="text-4xl mt-[2rem] text-gray-950">
                          {_viewDataRes.data.gamePlayResult.bitsWon} {` <BiTS>`}
                        </p>
                        <div className="bg-black rounded-full p-1">
                          <HoverBorderGradient>
                            <a
                              className=" bg-black text-white  rounded-3xl gap-2 flex flex-row justify-center items-center"
                              href={"https://twitter.com/intent/tweet?text=" + tweetText}
                              data-size="large"
                              target="_blank">
                              <span className="[&>svg]:h-4 [&>svg]:w-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
                                  <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                                </svg>
                              </span>
                              Tweet
                            </a>
                          </HoverBorderGradient>
                        </div>
                      </>
                    )) ||
                      null}

                    <div className="text-center mt-[2rem]">
                      <p className="text-xl">You can try again in:</p>
                      <div className="text-2xl mt-[1rem]">
                        <Countdown date={Date.now() + _viewDataRes.data.gamePlayResult.configCanPlayEveryMSecs} renderer={countdownRenderer} />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {spritLayerPointsCloud()}
        </div>
      );
    }
  }

  function spritLayerPointsCloud() {
    return (
      <div className="flex flex-col justify-center items-center w-[200px] h-[100px] absolute top-[2%] left-[2%] rounded-[3rem] bg-slate-50 text-gray-950 p-[2rem] border border-primary/50">
        <p className="text-sm">Your {`<BiTS>`} Points</p>
        <p className="text-[1.5rem] font-bold mt-[2px]">{bitsBalance === -2 ? `...` : <>{bitsBalance === -1 ? "0" : `${bitsBalance}`}</>}</p>
      </div>
    );
  }

  async function fetchAndLoadLeaderBoards() {
    setLeaderBoardIsLoading(true);

    const callConfig = {
      headers: {
        "fwd-tokenid": "DATANFTFT-e0b917-c6",
      },
    };

    const nowDateObj = new Date();
    let UTCMonth = nowDateObj.getUTCMonth() + 1; // can returns vals 1 - 12
    let UTCMonthStr = UTCMonth.toString();
    if (UTCMonth < 10) {
      UTCMonthStr = "0" + UTCMonthStr; // make 1 = 01 ... 9 = 09 etc
    }
    const UTCYear = nowDateObj.getUTCFullYear().toString().slice(-2); // converts number 2024 to string 24
    const MMYYString = `${UTCMonthStr}_${UTCYear}`;

    setLeaderBoardMonthString(MMYYString);

    try {
      // S: ACTUAL LOGIC
      const { data } = await axios.get<LeaderBoardItemType[]>(`${getApiWeb2Apps(chainID)}/datadexapi/xpGamePrivate/leaderBoard`, callConfig);
      const toJSONString = JSON.stringify(data);
      const toBase64String = btoa(toJSONString); // @TODO: we should save this in some local cache and hydrate to prevent the API always hitting

      setLeaderBoardAllTime(data);
      // E: ACTUAL LOGIC

      // // S: UNCOMMENT BELOW BLOCK TO MOCK FOR LOCAL UI DEVELOPMENT (COMMENT THE ABOVE ACTUAL LOGIC)
      // const allTimePayload =
      //   "W3sicGxheWVyQWRkciI6ImVyZDF2eWVqdjUyZTQzZnhxOTZjc2NoeXlqOWc1N3FuOWtndHhyaGtnOTJleWhmdTVhMDIycGxxdGR4dmRtIiwiYml0cyI6MjkwLCJkYXRhTkZUSWQiOiJEQVRBTkZURlQtZTBiOTE3LWM2In0seyJwbGF5ZXJBZGRyIjoiZXJkMWV3ZXF5a3hjcmhoNW5wczRmemt0dTllZnRmN3J4cGE4eGRma3lwd3owazRodWhsMHMwNHNhNnRxeWQiLCJiaXRzIjoyNjAsImRhdGFORlRJZCI6IkRBVEFORlRGVC1lMGI5MTctYzYifSx7InBsYXllckFkZHIiOiJlcmQxdXdrZzlwcnh3cXZsY2xhemQ1OHR4MjJ6OWV6Y3JkYTh5bnJ2MDR6aGg4YW11bm44bDV2cTQ1dnRtMCIsImJpdHMiOjE3NSwiZGF0YU5GVElkIjoiREFUQU5GVEZULWUwYjkxNy1jNiJ9LHsicGxheWVyQWRkciI6ImVyZDF4ZHE0ZDd1ZXdwdHg5ajlrMjNhdWZyYWtsZGE5bGV1bXFjN2V1M3VlenQya2Y0ZnF4ejJzZXgycnhsIiwiYml0cyI6OTUsImRhdGFORlRJZCI6IkRBVEFORlRGVC1lMGI5MTctYzYifSx7InBsYXllckFkZHIiOiJlcmQxNnZqaHJnYTR5anB5ODhsd251NjR3bHhsYXB3eHR2amw5M2pheDRyZzN5cTNoenh0bmF1c2RtaGNqZiIsImJpdHMiOjcwLCJkYXRhTkZUSWQiOiJEQVRBTkZURlQtZTBiOTE3LWM2In0seyJwbGF5ZXJBZGRyIjoiZXJkMXI1M2R2ZDBoOWo2dTBnenp5ZXR4czVzajMyaHM3a256cHJzbHk3cng5eXgyM2RjbHdsenM4MzM1enciLCJiaXRzIjo3MCwiZGF0YU5GVElkIjoiREFUQU5GVEZULWUwYjkxNy1jNiJ9LHsicGxheWVyQWRkciI6ImVyZDFxbXNxNmVqMzQ0a3BuOG1jOXhmbmdqaHlsYTN6ZDZscWRtNHp4eDY2NTNqZWU2cmZxM25zM2ZrY2M3IiwiYml0cyI6NTAsImRhdGFORlRJZCI6IkRBVEFORlRGVC1lMGI5MTctYzYifSx7InBsYXllckFkZHIiOiJlcmQxNnU4eTQ1dTM5N201YWR1eXo5Zm5jNWdwdjNlcmF4cWh0dWVkMnF2dnJza2QzMmZmamtnc3BkNGxjbSIsImJpdHMiOjMwLCJkYXRhTkZUSWQiOiJEQVRBTkZURlQtZTBiOTE3LWM2In0seyJwbGF5ZXJBZGRyIjoiZXJkMXV0aHY4bmFqZGM0Mmg1N2w4cDk3NXRkNnI4OHgzczQ4cGZ5dXNsczQ3ZXY1Nnhjczh0eXMwM3llczUiLCJiaXRzIjoyMCwiZGF0YU5GVElkIjoiREFUQU5GVEZULWUwYjkxNy1jNiJ9LHsicGxheWVyQWRkciI6ImVyZDFseWh0OHh1eW4zaHlrdjNlcnFrd3ljZWFqeXRzNXV3cnpyNWNudTlrNHV1MzRnODc4bDNxa25kanc4IiwiYml0cyI6MjAsImRhdGFORlRJZCI6IkRBVEFORlRGVC1lMGI5MTctYzYifV0=";

      // const base64ToString = atob(allTimePayload);
      // const stringToJSON = JSON.parse(base64ToString);

      // setLeaderBoardAllTime(stringToJSON);
      // // E: UNCOMMENT BELOW BLOCK TO MOCK FOR LOCAL UI DEVELOPMENT (COMMENT THE ABOVE ACTUAL LOGIC)
    } catch (err) {
      const message = "Leaderboard fetching failed:" + (err as AxiosError).message;
      console.error(message);
    }

    try {
      // S: ACTUAL LOGIC
      const { data } = await axios.get<LeaderBoardItemType[]>(
        `${getApiWeb2Apps(chainID)}/datadexapi/xpGamePrivate/monthLeaderBoard?MMYYString=${MMYYString}`,
        callConfig
      );

      const toJSONString = JSON.stringify(data);
      const toBase64String = btoa(toJSONString); // @TODO: we should save this in some local cache and hydrate to prevent the API always hitting

      setLeaderBoardMonthly(data);
      // E: ACTUAL LOGIC

      // // S: UNCOMMENT BELOW BLOCK TO MOCK FOR LOCAL UI DEVELOPMENT (COMMENT THE ABOVE ACTUAL LOGIC)
      // const monthlyPayload =
      //   "W3siTU1ZWURhdGFORlRJZCI6IjAzXzI0X0RBVEFORlRGVC1lMGI5MTctYzYiLCJwbGF5ZXJBZGRyIjoiZXJkMXZ5ZWp2NTJlNDNmeHE5NmNzY2h5eWo5ZzU3cW45a2d0eHJoa2c5MmV5aGZ1NWEwMjJwbHF0ZHh2ZG0iLCJiaXRzIjoyOTB9LHsiTU1ZWURhdGFORlRJZCI6IjAzXzI0X0RBVEFORlRGVC1lMGI5MTctYzYiLCJwbGF5ZXJBZGRyIjoiZXJkMWV3ZXF5a3hjcmhoNW5wczRmemt0dTllZnRmN3J4cGE4eGRma3lwd3owazRodWhsMHMwNHNhNnRxeWQiLCJiaXRzIjoyNjB9LHsiTU1ZWURhdGFORlRJZCI6IjAzXzI0X0RBVEFORlRGVC1lMGI5MTctYzYiLCJwbGF5ZXJBZGRyIjoiZXJkMXV3a2c5cHJ4d3F2bGNsYXpkNTh0eDIyejllemNyZGE4eW5ydjA0emhoOGFtdW5uOGw1dnE0NXZ0bTAiLCJiaXRzIjoxNzV9LHsiTU1ZWURhdGFORlRJZCI6IjAzXzI0X0RBVEFORlRGVC1lMGI5MTctYzYiLCJwbGF5ZXJBZGRyIjoiZXJkMXhkcTRkN3Vld3B0eDlqOWsyM2F1ZnJha2xkYTlsZXVtcWM3ZXUzdWV6dDJrZjRmcXh6MnNleDJyeGwiLCJiaXRzIjo5NX0seyJNTVlZRGF0YU5GVElkIjoiMDNfMjRfREFUQU5GVEZULWUwYjkxNy1jNiIsInBsYXllckFkZHIiOiJlcmQxNnZqaHJnYTR5anB5ODhsd251NjR3bHhsYXB3eHR2amw5M2pheDRyZzN5cTNoenh0bmF1c2RtaGNqZiIsImJpdHMiOjcwfSx7Ik1NWVlEYXRhTkZUSWQiOiIwM18yNF9EQVRBTkZURlQtZTBiOTE3LWM2IiwicGxheWVyQWRkciI6ImVyZDFyNTNkdmQwaDlqNnUwZ3p6eWV0eHM1c2ozMmhzN2tuenByc2x5N3J4OXl4MjNkY2x3bHpzODMzNXp3IiwiYml0cyI6NzB9LHsiTU1ZWURhdGFORlRJZCI6IjAzXzI0X0RBVEFORlRGVC1lMGI5MTctYzYiLCJwbGF5ZXJBZGRyIjoiZXJkMXFtc3E2ZWozNDRrcG44bWM5eGZuZ2poeWxhM3pkNmxxZG00enh4NjY1M2plZTZyZnEzbnMzZmtjYzciLCJiaXRzIjo1MH0seyJNTVlZRGF0YU5GVElkIjoiMDNfMjRfREFUQU5GVEZULWUwYjkxNy1jNiIsInBsYXllckFkZHIiOiJlcmQxNnU4eTQ1dTM5N201YWR1eXo5Zm5jNWdwdjNlcmF4cWh0dWVkMnF2dnJza2QzMmZmamtnc3BkNGxjbSIsImJpdHMiOjMwfSx7Ik1NWVlEYXRhTkZUSWQiOiIwM18yNF9EQVRBTkZURlQtZTBiOTE3LWM2IiwicGxheWVyQWRkciI6ImVyZDF1dGh2OG5hamRjNDJoNTdsOHA5NzV0ZDZyODh4M3M0OHBmeXVzbHM0N2V2NTZ4Y3M4dHlzMDN5ZXM1IiwiYml0cyI6MjB9LHsiTU1ZWURhdGFORlRJZCI6IjAzXzI0X0RBVEFORlRGVC1lMGI5MTctYzYiLCJwbGF5ZXJBZGRyIjoiZXJkMWx5aHQ4eHV5bjNoeWt2M2VycWt3eWNlYWp5dHM1dXdyenI1Y251OWs0dXUzNGc4NzhsM3FrbmRqdzgiLCJiaXRzIjoyMH1d";
      // const base64ToString = atob(monthlyPayload);
      // const stringToJSON = JSON.parse(base64ToString);

      // setLeaderBoardMonthly(stringToJSON);
      // // E: UNCOMMENT BELOW BLOCK TO MOCK FOR LOCAL UI DEVELOPMENT (COMMENT THE ABOVE ACTUAL LOGIC)
    } catch (err) {
      const message = "Monthly Leaderboard fetching failed:" + (err as AxiosError).message;
      console.error(message);
    }
    setLeaderBoardIsLoading(false);
  }

  function leaderBoardTable(leaderBoardData: LeaderBoardItemType[]) {
    return (
      <>
        <table className="border border-primary/50 text-center m-auto w-[90%] max-w-[500px]">
          <thead>
            <tr className="border">
              <th className="p-2">Rank</th>
              <th className="p-2">User</th>
              <th className="p-2">{`<BiTS>`} Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderBoardData.map((item, rank) => (
              <tr key={rank} className="border">
                <td className="p-2">
                  #{rank + 1} {rank + 1 === 1 && <span> 🥇</span>} {rank + 1 === 2 && <span> 🥈</span>} {rank + 1 === 3 && <span> 🥉</span>}
                </td>
                <td className="p-2">{item.playerAddr === address ? "It's YOU! 🫵 🎊" : <CopyAddress address={item.playerAddr} precision={8} />}</td>
                <td className="p-2">{item.bits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }

  return (
    <>
      {gamePlayImageSprites()}

      <div className="p-5 text-lg font-bold bg-[#35d9fa] text-black rounded-[1rem] my-[3rem]">
        TO CELEBRATE THE LAUNCH of Itheum {`<BiTS>`}, The {`<BiTS>`} Generator God is in a generous mood! For the first month only (April 1, 2024 - May 1,
        2024), check out these LAUNCH WINDOW special perks:
        <ol className="mt-5">
          <li>1. A special shorter Game Window is in place. So instead of a usual 6 Hours Window. You can play every 3 hours!</li>
          <li>2. The top 20 LEADERBOARD movers in this month will get Airdropped Data NFTs from previous Data NFT Creators</li>
        </ol>
      </div>

      <div className="flex flex-col max-w-[100%] border border-[#35d9fa] p-[2rem] mb-[3rem] rounded-[1rem]">
        <div className="leaderBoard">
          <h2 className="text-center text-white mb-[1rem]">LEADERBOARD</h2>
          <div className="md:flex">
            <div className="allTime md:flex-1">
              <h3 className="text-center text-white mb-[1rem]">All Time</h3>
              {leaderBoardIsLoading ? (
                <Loader />
              ) : (
                <>
                  {leaderBoardAllTime.length > 0 ? (
                    leaderBoardTable(leaderBoardAllTime)
                  ) : (
                    <div className="text-center">{!chainID ? "Connect Wallet to Check" : "No Data Yet"!}</div>
                  )}
                </>
              )}
            </div>

            <div className="my-[1rem] md:my-auto monthly md:flex-1">
              <h3 className="text-center text-white mb-[1rem]">Monthly ({leaderBoardMonthString.replace("_", "-20")})</h3>
              {leaderBoardIsLoading ? (
                <Loader />
              ) : (
                <>
                  {leaderBoardMonthly.length > 0 ? (
                    leaderBoardTable(leaderBoardMonthly)
                  ) : (
                    <div className="text-center">{!chainID ? "Connect Wallet to Check" : "No Data Yet"!}</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-center text-white my-[3rem]">FAQs</h2>

          <div className="mt-[2rem]">
            <h3 className="!text-[#7a98df] dark:!text-[#35d9fa]">What are Itheum {`<BiTS>`} Points?</h3>
            <p>
              Think of them as XP (Experience Points) of the Itheum Protocol, we like to call them "Data Ownership OG (Original Gangster) XP" and if you
              consider yourself an Itheum OG and love Data Ownership, then we absolutely think you are a pioneer and {`<BiTS>`} is the Itheum XP system for
              you!!
            </p>
            <p className="mt-5">
              You need to use Data NFT and Itheum Core Infrastructure to collect your Itheum {`<BiTS>`}, and this exact Web3/Blockchain based product stack can
              be used by you to empower you to take ownership of and tokenize your data. So in essence, you are using Data Ownership + Data Tokenization
              technology! Welcome Itheum Data Ownership OG!
            </p>
          </div>

          <div className="mt-[2rem]">
            <h3 className="!text-[#7a98df] dark:!text-[#35d9fa]">Why are Itheum {`<BiTS>`} Points Important?</h3>
            <p>
              On top of being XP, they also signal your "liveliness" as a human and not a BOT. This is a form of "reputation signalling" of you as a human
              within the Itheum ecosystem, this reputation signalling is a very powerful concept when you link it to "data ownership" as it add a layer of
              "proof of humanity" to the Itheum Protocol.
            </p>
          </div>

          <div className="mt-[2rem]">
            <h3 className="!text-[#7a98df] dark:!text-[#35d9fa]">How can I collect {`<BiTS>`} Points?</h3>
            <p>
              You need to hold a {`<BiTS>`} compatible Data NFT in your wallet to play the Get {`<BiTS>`} game (you are on this page now). This Data NFT was
              airdropped in waves to OGs of the Itheum Protocol, but fear not, you can also get it on any NFT Marketplace (if the OGs broke our hearts and
              parted ways with their Data NFTs). If this "Series 1" {`<BiTS>`} Data NFT is successful, there may be a follow-up Series of {`<BiTS>`} Data NFTs
              launched and airdropped as well.
            </p>
            <p className="mt-5">
              Once you have the Data NFT in your wallet, you can play the Game every 6 Hours (3 Hours in "Launch Window"). Based on random chance, you win{" "}
              {`<BiTS>`}.
            </p>
            <p className="mt-5">You DO NOT need to spend any gas to Play the game! SAY WAT?!</p>
          </div>

          <div className="mt-[2rem]">
            <h3 className="!text-[#7a98df] dark:!text-[#35d9fa]">What can I do with Itheum {`<BiTS>`} Points?</h3>
            <p>
              Itheum {`<BiTS>`} is like an XP system as you interact with the Itheum Protocol to collect your points. And like all XP Systems, there will be
              LEADERBOARD-based rewards that are tied to use cases within the Itheum protocol. At launch, the following utility will be available:
            </p>
            <ol className="mt-5">
              <li>
                1. Top 5 Movers each month get Airdropped{" "}
                <a className="!text-[#7a98df] hover:underline" href="https://datadex.itheum.io/datanfts/marketplace/market" target="blank">
                  Data NFTs (top 20 during LAUNCH WINDOW)
                </a>{" "}
                from previous and upcoming Data Creators
              </li>
              <li>
                2. Get a boost on Monthly{" "}
                <a className="!text-[#7a98df] hover:underline" href="https://explorer.itheum.io/project-trailblazer" target="blank">
                  Itheum Trailblazer
                </a>{" "}
                Data NFT Quest Rewards
              </li>
              <li>3. Admire the balance grow as you connect your wallet to Itheum Protocol dApps and play</li>
            </ol>

            <p className="mt-5">
              This is just the start, we have a bunch of other ideas planned for {`<BiTS>`}. Got ideas for {`<BiTS>`} utility? We love to hear them:{" "}
              <a className="!text-[#7a98df] hover:underline" href="https://forms.gle/muA4XiD2ddQis4G78" target="blank">
                {" "}
                Send ideas
              </a>{" "}
            </p>
          </div>

          <div className="mt-[2rem]">
            <h3 className="!text-[#7a98df] dark:!text-[#35d9fa]">Are Itheum {`<BiTS>`} Points Blockchain Tokens?</h3>
            <p>
              Nope, there are more than enough meme coins out there and we don't need more. Itheum {`<BiTS>`} are simple XP to "gamify" usage of the Itheum
              Protocol infrastructure. The $ITHEUM token is the primary utility token of the entire Itheum Ecosystem.
            </p>
          </div>

          <div className="mt-[2rem]">
            <h3 className="!text-[#7a98df] dark:!text-[#35d9fa]">Are Itheum {`<BiTS>`} Points Tradable?</h3>
            <p>
              We are heart-broken that you asked :( and nope you can't as they are not blockchain tokens (see above). But we are looking at possibilities of
              where you can "gift" them to Data Creators who mint Data NFT Collections. "Gifting" Itheum {`<BiTS>`} will have its own LEADERBOARD and perks ;)
            </p>
          </div>

          <div className="mt-[2rem]">
            <h3 className="!text-[#7a98df] dark:!text-[#35d9fa]">Can I move Itheum {`<BiTS>`} Points Between my Wallets?</h3>
            <p>
              Lost your primary wallet or want to move Itheum {`<BiTS>`} to your new wallet? unfortunately, this is not possible right now (it MAY be in the
              future - but no guarantee). So make sure you get {`<BiTS>`} in the wallet you treasure the most.
            </p>
          </div>

          <div className="mt-[2rem]">
            <h3 className="!text-[#7a98df] dark:!text-[#35d9fa]">Why is it Called {`<BiTS>`}?</h3>
            <p>
              Itheum is a data ownership protocol that is trying to break the current cycle of data exploitation. A Bit is the smallest unit of data. Let's
              break the cycle of data exploitation one {`<BiT>`} at a time.
            </p>
          </div>

          <div className="mt-[2rem]">
            <h3 className="!text-[#7a98df] dark:!text-[#35d9fa]">Will this {`<BiTS>`} App become a Playable Game?</h3>
            <p>
              We are not game developers and don't pretend to be so are waiting for an A.I tool that will build the game for us. Are you an A.I or a Game Dev
              and want to build a game layer for the Itheum {`<BiTS>`} XP system? reach out and you could get a grant from via the{" "}
              <a
                className="!text-[#7a98df] hover:underline"
                href="https://docs.itheum.io/product-docs/protocol/governance/itheum-xpand-dao/itheum-xpand-grants-program"
                target="blank">
                Itheum xPand program
              </a>
              . As the entire game logic is actually inside the Data NFT, ANYONE can{" "}
              <a className="!text-[#7a98df] hover:underline" href="https://docs.itheum.io/product-docs/developers/software-development-kits-sdks/data-nft-sdk">
                use our SDK
              </a>{" "}
              and build their own game UI in front of it, this is the power and "Composability" of Itheum's Data NFTs in action.
            </p>
          </div>

          <div className="mt-[2rem]">
            <h3 className="!text-[#7a98df] dark:!text-[#35d9fa]">Help Make Itheum {`<BiTS>`} Better?</h3>
            <p>
              We want to make the Itheum {`<BiTS>`} XP System better! Do you have any questions or ideas for us or just want to know more? Head over to our{" "}
              <a className="!text-[#7a98df] hover:underline" href="https://itheum.io/discord" target="blank">
                Discord
              </a>{" "}
              and speak to us or{" "}
              <a className="!text-[#7a98df] hover:underline" href="https://forms.gle/muA4XiD2ddQis4G78" target="blank">
                Send us your utility ideas for {`<BiTS>`} here.
              </a>{" "}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

/*
A utility method that we can use to get, parse and return data from the viewDataViaMVXNativeAuth method
*/
export async function viewDataJSONCore(viewDataArgs: any, requiredDataNFT: DataNft) {
  try {
    let res: any;
    res = await requiredDataNFT.viewDataViaMVXNativeAuth(viewDataArgs);

    let blobDataType = BlobDataType.TEXT;

    if (!res.error) {
      if (res.contentType.search("application/json") >= 0) {
        res.data = JSON.parse(await (res.data as Blob).text());
      }

      const viewDataJSONPayload: ExtendedViewDataReturnType = {
        ...res,
        blobDataType,
      };

      return viewDataJSONPayload;
    } else {
      console.log("viewDataJSONCore threw catch error");
      console.error(res.error);

      return undefined;
    }
  } catch (err) {
    console.log("viewDataJSONCore threw catch error");
    console.error(err);

    return undefined;
  }
}
