import React, { useEffect, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { confetti } from "@tsparticles/confetti";
import { Container } from "@tsparticles/engine";
import { fireworks } from "@tsparticles/fireworks";
import axios, { AxiosError } from "axios";
import { motion } from "framer-motion";
import { MousePointerClick } from "lucide-react";
import Countdown from "react-countdown";
import { Link } from "react-router-dom";
import { GET_BITZ_TOKEN_MVX } from "appsConfig";
import { Loader } from "components";
import { toastClosableError } from "libs/utils/uiShared";
import { MARKETPLACE_DETAILS_PAGE } from "config";
import { useGetAccount, useGetPendingTransactions } from "hooks";
import { BlobDataType, ExtendedViewDataReturnType } from "libs/types";
import { decodeNativeAuthToken, sleep, getApiWeb2Apps, createNftId, cn, shortenAddress, scrollToSection } from "libs/utils";
import { computeRemainingCooldown } from "libs/utils/functions";
import { routeNames } from "routes";
import { BurningImage } from "../common/BurningImage";
import Faq from "../common/Faq";
import GiveBitzBase from "./GiveBitzBase";
import resultLoading from "assets/img/getbitz/pixel-loading.gif";
import { HoverBorderGradient } from "libComponents/animated/HoverBorderGradient";
import { useAccountStore } from "store/account";
import { useNftsStore } from "store/nfts";
import { BIT_GAME_TOP_LEADER_BOARD_GROUP, LeaderBoardItemType } from "../common/interfaces";
import LeaderBoardTable from "../common/LeaderBoardTable";
import Torch from "../common/Torch";
import "../common/GetBitz.css";

// Image Layers
import aladinRugg from "assets/img/getbitz/aladin.png";
import FingerPoint from "assets/img/getbitz/finger-point.gif";
import ImgGameCanvas from "assets/img/getbitz/getbitz-game-canvas.png";
import ImgGetDataNFT from "assets/img/getbitz/getbitz-get-datanft-v2.gif";
import ImgLoadingGame from "assets/img/getbitz/getbitz-loading.gif";
import ImgLogin from "assets/img/getbitz/getbitz-login.gif";
import ImgPlayGame from "assets/img/getbitz/getbitz-play.gif";

// Memes
import Meme1 from "assets/img/getbitz/memes/1.jpg";
import Meme10 from "assets/img/getbitz/memes/10.jpg";
import Meme11 from "assets/img/getbitz/memes/11.jpg";
import Meme12 from "assets/img/getbitz/memes/12.jpg";
import Meme13 from "assets/img/getbitz/memes/13.jpg";
import Meme14 from "assets/img/getbitz/memes/14.jpg";
import Meme15 from "assets/img/getbitz/memes/15.jpg";
import Meme16 from "assets/img/getbitz/memes/16.jpg";
import Meme17 from "assets/img/getbitz/memes/17.jpg";
import Meme18 from "assets/img/getbitz/memes/18.jpg";
import Meme19 from "assets/img/getbitz/memes/19.jpg";
import Meme2 from "assets/img/getbitz/memes/2.jpg";
import Meme20 from "assets/img/getbitz/memes/20.jpg";
import Meme21 from "assets/img/getbitz/memes/21.jpg";
import Meme22 from "assets/img/getbitz/memes/22.jpg";
import Meme23 from "assets/img/getbitz/memes/23.jpg";
import Meme24 from "assets/img/getbitz/memes/24.jpg";
import Meme25 from "assets/img/getbitz/memes/25.jpg";
import Meme26 from "assets/img/getbitz/memes/26.jpg";
import Meme27 from "assets/img/getbitz/memes/27.jpg";
import Meme28 from "assets/img/getbitz/memes/28.jpg";
import Meme29 from "assets/img/getbitz/memes/29.jpg";
import Meme3 from "assets/img/getbitz/memes/3.jpg";
import Meme4 from "assets/img/getbitz/memes/4.jpg";
import Meme5 from "assets/img/getbitz/memes/5.jpg";
import Meme6 from "assets/img/getbitz/memes/6.jpg";
import Meme7 from "assets/img/getbitz/memes/7.jpg";
import Meme8 from "assets/img/getbitz/memes/8.jpg";
import Meme9 from "assets/img/getbitz/memes/9.jpg";

const MEME_IMGS = [
  Meme1,
  Meme2,
  Meme3,
  Meme4,
  Meme5,
  Meme6,
  Meme7,
  Meme8,
  Meme9,
  Meme10,
  Meme11,
  Meme12,
  Meme13,
  Meme14,
  Meme15,
  Meme16,
  Meme17,
  Meme18,
  Meme19,
  Meme20,
  Meme21,
  Meme22,
  Meme23,
  Meme24,
  Meme25,
  Meme26,
  Meme27,
  Meme28,
  Meme29,
];

export const GetBitzMvx = (props: any) => {
  const { modalMode } = props;

  const { address } = useGetAccount();
  const { tokenLogin } = useGetLoginInfo();
  const {
    network: { chainId: chainID },
  } = useGetNetworkConfig();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const [gameDataNFT, setGameDataNFT] = useState<DataNft>();
  const [checkingIfHasGameDataNFT, setCheckingIfHasGameDataNFT] = useState<boolean>(true);
  const [hasGameDataNFT, setHasGameDataNFT] = useState<boolean>(false);
  const { mvxNfts: nfts } = useNftsStore();

  // store based state
  const bitzBalance = useAccountStore((state: any) => state.bitzBalance);
  const cooldown = useAccountStore((state: any) => state.cooldown);
  const collectedBitzSum = useAccountStore((state: any) => state.collectedBitzSum);
  const updateCollectedBitzSum = useAccountStore((state) => state.updateCollectedBitzSum);
  const updateBitzBalance = useAccountStore((state) => state.updateBitzBalance);
  const updateCooldown = useAccountStore((state) => state.updateCooldown);
  const updateBonusTries = useAccountStore((state) => state.updateBonusTries);

  // a single game-play related (so we have to reset these if the user wants to "replay")
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(false);
  const [isMemeBurnHappening, setIsMemeBurnHappening] = useState<boolean>(false);
  const [gameDataFetched, setGameDataFetched] = useState<boolean>(false);
  const [viewDataRes, setViewDataRes] = useState<ExtendedViewDataReturnType>();
  const [burnFireScale, setBurnFireScale] = useState<string>("scale(0) translate(-13px, -15px)");
  const [burnFireGlow, setBurnFireGlow] = useState<number>(0);
  const [burnProgress, setBurnProgress] = useState(0);
  const [randomMeme, setRandomMeme] = useState<any>(Meme1);
  const tweetText = `url=https://explorer.itheum.io/getbitz?v=3&text=${viewDataRes?.data.gamePlayResult.bitsWon > 0 ? "I just played the Get BiTz XP Game on %23itheum and won " + viewDataRes?.data.gamePlayResult.bitsWon + " BiTz points 🙌!%0A%0APlay now and get your own BiTz! %23GetBiTz" : "Oh no, I got rugged getting BiTz points this time. Maybe you will have better luck?%0A%0ATry here to %23GetBiTz %23itheum %0A"}`;
  const [usingReferralCode, setUsingReferralCode] = useState<string>("");

  // Game canvas related
  const [loadBlankGameCanvas, setLoadBlankGameCanvas] = useState<boolean>(false);

  // LeaderBoard related
  const [leaderBoardAllTime, setLeaderBoardAllTime] = useState<LeaderBoardItemType[]>([]);
  const [leaderBoardMonthly, setLeaderBoardMonthly] = useState<LeaderBoardItemType[]>([]);
  const [leaderBoardMonthString, setLeaderBoardMonthString] = useState<string>("");
  const [leaderBoardIsLoading, setLeaderBoardIsLoading] = useState<boolean>(false);
  const [myRankOnAllTimeLeaderBoard, setMyRankOnAllTimeLeaderBoard] = useState<string>("-2");

  // Debug / Tests
  const [inDateStringDebugMode, setInDateStringDebugMode] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (!hasPendingTransactions) {
      fetchGameDataNfts();
    }
  }, [hasPendingTransactions, nfts]);

  useEffect(() => {
    fetchMyNfts();
  }, [nfts, address, gameDataNFT]);

  useEffect(() => {
    if (!chainID) {
      return;
    }

    // is the player using a referral code?
    const searchParams = new URLSearchParams(window.location.search);
    const _referralCode = searchParams.get("r");

    if (_referralCode && _referralCode.trim().length > 5) {
      setUsingReferralCode(_referralCode.trim().toLowerCase());
    }

    // Load the LeaderBoards regardless on if the user has does not have the data nft in to entice them
    fetchAndLoadLeaderBoards();
  }, [chainID]);

  useEffect(() => {
    setBurnFireScale(`scale(${burnProgress}) translate(-13px, -15px)`);
    setBurnFireGlow(burnProgress * 0.1);

    // we can slow the burn by updating the value here...
    if (burnProgress === 25) {
      setIsMemeBurnHappening(false);
      playGame();
    }
  }, [burnProgress]);

  useEffect(() => {
    // load my rank if i'm not in the visible leader board (e.g. I'm not in the top 20, so whats my rank?)
    if (address && leaderBoardAllTime.length > 0) {
      let playerRank = -1;

      for (let i = 0; i < leaderBoardAllTime.length; i++) {
        if (leaderBoardAllTime[i].playerAddr === address) {
          playerRank = i + 1;
          break;
        }
      }

      if (playerRank > -1) {
        setMyRankOnAllTimeLeaderBoard(playerRank.toString());
      } else {
        fetchAndLoadMyRankOnLeaderBoard();
      }
    }
  }, [address, leaderBoardAllTime]);

  // first, we get the Data NFT details needed for this game (but not if the current user has it)
  async function fetchGameDataNfts() {
    const _gameDataNFT = await DataNft.createFromApi(GET_BITZ_TOKEN_MVX);
    setGameDataNFT(_gameDataNFT);
  }

  // secondly, we get the user's Data NFTs and flag if the user has the required Data NFT for the game in their wallet
  async function fetchMyNfts() {
    if (gameDataNFT) {
      const _dataNfts = nfts;
      const hasRequiredDataNFT = _dataNfts.find((dNft) => gameDataNFT.tokenIdentifier === dNft.tokenIdentifier);
      setHasGameDataNFT(hasRequiredDataNFT ? true : false);
      setCheckingIfHasGameDataNFT(false);

      setRandomMeme(MEME_IMGS[Math.floor(Math.random() * MEME_IMGS.length)]); // set a random meme as well
    }
  }

  // have to reset all "single game-play related" (see above)
  function resetToStartGame() {
    setIsFetchingDataMarshal(false);
    setIsMemeBurnHappening(false);
    setGameDataFetched(false);
    setBurnProgress(0);
    setViewDataRes(undefined);
    setBurnFireScale("scale(0) translate(-13px, -15px)");
    setBurnFireGlow(0);
    setRandomMeme(MEME_IMGS[Math.floor(Math.random() * MEME_IMGS.length)]); // set a random meme as well
  }

  async function playGame() {
    if (!(tokenLogin && tokenLogin.nativeAuthToken)) {
      throw Error("No Native Auth token");
    }

    if (!gameDataNFT) {
      toastClosableError("ER6: Game NFT Data is not loaded");
      return;
    }

    setIsFetchingDataMarshal(true);

    await sleep(5);

    const _fwdHeaderMapLookup: Record<string, string> = {
      "authorization": `Bearer ${tokenLogin.nativeAuthToken}`,
    };

    let _fwdHeaderKeys = "authorization";

    if (usingReferralCode !== "") {
      _fwdHeaderMapLookup["dmf-referral-code"] = usingReferralCode;
      _fwdHeaderKeys = "authorization, dmf-referral-code";
    }

    const viewDataArgs: Record<string, any> = {
      mvxNativeAuthOrigins: [decodeNativeAuthToken(tokenLogin.nativeAuthToken).origin],
      mvxNativeAuthMaxExpirySeconds: 3600,
      fwdHeaderMapLookup: _fwdHeaderMapLookup,
      fwdHeaderKeys: _fwdHeaderKeys,
    };

    const viewDataPayload: ExtendedViewDataReturnType | undefined = await viewData(viewDataArgs, gameDataNFT);

    if (viewDataPayload) {
      let animation;
      if (viewDataPayload.data.gamePlayResult.bitsWon > 0) {
        if (viewDataPayload.data.gamePlayResult.userWonMaxBits === 1) {
          animation = await fireworks({ background: "transparent", sounds: true });
        } else {
          animation = await confetti({
            zIndex: 10000,
            spread: 360,
            ticks: 100,
            gravity: 0,
            decay: 0.94,
            startVelocity: 30,
            particleCount: 200,
            scalar: 2,
            shapes: ["emoji"],
            shapeOptions: {
              emoji: {
                value: ["🤲🏼", "💎", "🤲🏼", "💎", "🎊", "🐸", "🐸", "🐸", "🐸", "🐹", "🐹"],
              },
            },
          });
        }

        // if the user won something, then we should reload the LeaderBoards
        fetchAndLoadLeaderBoards();
      }

      setGameDataFetched(true);
      setIsFetchingDataMarshal(false);
      setViewDataRes(viewDataPayload);

      updateCooldown(
        computeRemainingCooldown(
          Math.max(viewDataPayload.data.gamePlayResult.lastPlayedAndCommitted, viewDataPayload.data.gamePlayResult.lastPlayedBeforeThisPlay),
          viewDataPayload.data.gamePlayResult.configCanPlayEveryMSecs
        )
      );

      let sumScoreBitzBefore = viewDataPayload.data.gamePlayResult.bitsScoreBeforePlay || 0;
      sumScoreBitzBefore = sumScoreBitzBefore < 0 ? 0 : sumScoreBitzBefore;

      let sumScoreBitzAfter = viewDataPayload.data.gamePlayResult.bitsScoreAfterPlay || 0;
      sumScoreBitzAfter = sumScoreBitzAfter < 0 ? 0 : sumScoreBitzAfter;

      let sumGivenBitz = viewDataPayload.data?.bitsMain?.bitsGivenSum || 0;
      sumGivenBitz = sumGivenBitz < 0 ? 0 : sumGivenBitz;

      let sumBonusBitz = viewDataPayload.data?.bitsMain?.bitsBonusSum || 0;
      sumBonusBitz = sumBonusBitz < 0 ? 0 : sumBonusBitz;

      if (viewDataPayload.data.gamePlayResult.bitsScoreAfterPlay > -1) {
        updateBitzBalance(sumScoreBitzAfter + sumBonusBitz - sumGivenBitz); // won some bis, minus given bits and show
        updateCollectedBitzSum(sumScoreBitzAfter);
      } else {
        updateBitzBalance(sumScoreBitzBefore + sumBonusBitz - sumGivenBitz); // did not win bits, minus given bits from current and show
        updateCollectedBitzSum(sumScoreBitzBefore);
      }

      // how many bonus tries does the user have
      if (viewDataPayload.data.gamePlayResult.bonusTriesAfterThisPlay > -1) {
        updateBonusTries(viewDataPayload.data.gamePlayResult.bonusTriesAfterThisPlay);
      } else {
        updateBonusTries(viewDataPayload.data.gamePlayResult.bonusTriesBeforeThisPlay || 0);
      }

      if (animation) {
        await sleep(10);

        animation.stop();
        // if its confetti, then we have to destroy it
        if ((animation as unknown as Container).destroy) {
          (animation as unknown as Container).destroy();
        }
      }
    } else {
      toastClosableError("ER2: Did not get a response from the game server");
      setIsFetchingDataMarshal(false);
    }
  }

  async function viewData(viewDataArgs: any, requiredDataNFT: DataNft) {
    try {
      if (!gameDataNFT) {
        toastClosableError("ER3: Game NFT Data is not loaded");
        return;
      }

      return viewDataJSONCore(viewDataArgs, requiredDataNFT);
    } catch (err) {
      console.error(err);
      toastClosableError((err as Error).message);
      setIsFetchingDataMarshal(false);

      return undefined;
    }
  }

  function gamePlayImageSprites() {
    let _viewDataRes = viewDataRes;
    let _loadBlankGameCanvas = loadBlankGameCanvas;
    let _gameDataFetched = gameDataFetched;
    let _isFetchingDataMarshal = isFetchingDataMarshal;
    let _isMemeBurnHappening = isMemeBurnHappening;

    // user is not logged in, ask them to connect wallet
    if (!address) {
      return (
        <Link className="relative" to={routeNames.unlock} state={{ from: `${location.pathname}${location.search}` }}>
          <img
            className={cn("-z-1 relative z-5 rounded-[3rem] w-full cursor-pointer", modalMode ? "rounded" : "")}
            src={ImgLogin}
            alt="Connect your wallet to play"
          />
        </Link>
      );
    }

    // user is logged in and we are checking if they have the data nft to proceed with a play
    if ((address && checkingIfHasGameDataNFT && !hasGameDataNFT) || cooldown === -2) {
      return (
        <div className="relative">
          <img
            className={cn("-z-1 rounded-[3rem] w-full cursor-pointer", modalMode ? "rounded" : "")}
            src={ImgLoadingGame}
            alt="Checking if you have BiTz Data NFT"
          />
        </div>
      );
    }

    // user is logged in does not have the data nft, so take them to the marketplace
    if (address && !checkingIfHasGameDataNFT && !hasGameDataNFT) {
      return (
        <div
          className="relative"
          onClick={() => {
            window.open("https://datadex.itheum.io/datanfts/marketplace/DATANFTFT-e936d4-07", "_blank")?.focus();
          }}>
          <img
            className={cn("z-5 rounded-[3rem] w-full cursor-pointer", modalMode ? "rounded" : "")}
            src={ImgGetDataNFT}
            alt="Get BiTz Data NFT from Data NFT Marketplace"
          />
        </div>
      );
    }

    const CountDownComplete = () => (
      <div
        className="cursor-pointer relative inline-flex h-12 overflow-hidden rounded-full p-[1px] "
        onClick={() => {
          resetToStartGame();
        }}>
        <span className="absolute hover:bg-[#35d9fa] inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF03,#45d4ff_50%,#111111_50%)]" />
        <span className="text-primary inline-flex h-full hover:bg-gradient-to-tl from-background to-[#35d9fa] w-full cursor-pointer items-center justify-center rounded-full bg-background px-3 py-1 text-sm font-medium   backdrop-blur-3xl">
          RIGHT NOW! Try again <MousePointerClick className="ml-2 text-[#35d9fa]" />
        </span>
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
            {props.hours > 0 ? <>{`${props.hours} ${props.hours === 1 ? " Hour " : " Hours "}`}</> : ""}
            {props.minutes > 0 ? props.minutes + " Min " : ""} {props.seconds} Sec
          </span>
        );
      }
    };

    // user has data nft, so load the "start game" view
    if (!_loadBlankGameCanvas && !_isFetchingDataMarshal) {
      return (
        <div className="relative">
          {cooldown > 0 && (
            <Countdown
              className="mx-auto text-3"
              date={cooldown}
              renderer={(props: { hours: number; minutes: number; seconds: number; completed: boolean }) => {
                if (props.completed) {
                  return <> </>;
                } else {
                  return (
                    <div className={cn("absolute z-5 w-full h-full rounded-[3rem] bg-black/90", modalMode ? "rounded" : "")}>
                      <div className="flex w-full h-full items-center justify-center">
                        <div className="text-3xl md:text-5xl flex flex-col items-center justify-center text-white ">
                          <p className="my-4 text-xl md:text-3xl "> You can play again in: </p>{" "}
                          {props.hours > 0 ? <>{`${props.hours} ${props.hours === 1 ? " Hour " : " Hours "}`}</> : ""}
                          {props.minutes > 0 ? props.minutes + " Min " : ""} {props.seconds} Sec
                        </div>
                      </div>
                    </div>
                  );
                }
              }}
            />
          )}
          <img
            onClick={() => {
              setLoadBlankGameCanvas(true);
            }}
            className={cn("rounded-[3rem] w-full cursor-pointer", modalMode ? "rounded" : "")}
            src={ImgPlayGame}
            alt={"Start Game"}
          />
        </div>
      );
    }

    // user clicked on the start game view, so load the empty blank game canvas
    if (_loadBlankGameCanvas && !_gameDataFetched) {
      return (
        <div className="relative overflow-hidden">
          {!modalMode && _isMemeBurnHappening && <Torch />}
          <img
            className={cn("rounded-[3rem] w-full", _isMemeBurnHappening && !modalMode ? "cursor-none" : "", modalMode ? "rounded" : "")}
            src={ImgGameCanvas}
            alt={"Play Game"}
          />
          <div>
            <div
              className={cn(
                "select-none flex justify-center items-center mt-[2rem] w-[100%] h-[350px] md:h-[400px] rounded-[3rem] bg-slate-50 text-gray-950 p-[2rem] border border-primary/50 static lg:absolute lg:pb-[.5rem] lg:w-[500px] lg:h-[420px] lg:mt-0 lg:top-[40%] lg:left-[50%] lg:-translate-x-1/2 lg:-translate-y-1/2",
                _isMemeBurnHappening && !modalMode ? "cursor-none" : "",
                modalMode ? "scale-75 !mt-[35px]" : ""
              )}>
              {(!_isFetchingDataMarshal && !_isMemeBurnHappening && (
                <>
                  <div
                    className="text-center text-xl text-gray-950 text-foreground cursor-pointer"
                    onClick={() => {
                      setIsMemeBurnHappening(true);
                    }}>
                    <p className="text-[16px] lg:text-xl">Welcome Back Itheum OG!</p>
                    <p className="text-[16px] mt-2 lg:text-xl lg:mt-5">
                      Ready to grab yourself some of them <span className="lg:text-3xl">🤤</span> {`BiTz`} points?
                    </p>
                    <p className="text-[18px] font-bold lg:text-2xl mt-5">But the {`BiTz`} Generator God will need a Meme 🔥 Sacrifice from you to proceed!</p>
                    <p className="text-[16px] font-bold mt-2 lg:mt-5 lg:text-xl">Click here when you are ready...</p>
                    <img className="w-[40px] m-auto" src={FingerPoint} alt={"Click to Start"} />{" "}
                  </div>
                </>
              )) ||
                null}

              {_isMemeBurnHappening && (
                <div
                  className={cn("z-10 relative cursor-none select-none p-8", modalMode ? "cursor-pointer" : "")}
                  onClick={() => {
                    setBurnProgress((prev) => prev + 1);
                  }}>
                  <p className="text-center text-md text-gray-950 text-foreground lg:text-xl ">Light up this Meme Sacrifice!</p>
                  <p className="text-gray-950 text-sm text-center mb-[1rem]">Click to burn</p>
                  <BurningImage src={randomMeme} burnProgress={burnProgress} modalMode={modalMode} />
                  <div className="glow" style={{ opacity: burnFireGlow }}></div>
                  <div className="flame !top-[125px] lg:!top-[90px]" style={{ transform: burnFireScale }}></div>
                </div>
              )}

              {_isFetchingDataMarshal && (
                <div>
                  <p className="text-center text-md text-gray-950 text-foreground lg:text-xl mb-[1rem]">
                    Did the {`BiTz`} Generator God like that Meme Sacrifice? Only time will tell...
                  </p>
                  <p className="text-gray-950 text-sm text-center mb-[1rem]">Hang tight, result incoming</p>
                  <img className="w-[160px] lg:w-[230px] m-auto" src={resultLoading} alt={"Result loading"} />{" "}
                </div>
              )}
            </div>

            {!modalMode && spritLayerPointsCloud()}
          </div>
        </div>
      );
    }

    // we got the response from the game play
    if (_loadBlankGameCanvas && !_isFetchingDataMarshal && _gameDataFetched) {
      return (
        <div className="relative overflow-hidden">
          <img className={cn("rounded-[3rem] w-full cursor-pointer", modalMode ? "rounded" : "")} src={ImgGameCanvas} alt={"Get BiTz Points"} />
          <div
            className={cn(
              "flex justify-center items-center mt-[2rem] w-[100%] h-[350px] rounded-[3rem] bg-slate-50 text-gray-950 p-[1rem] border border-primary/50 static lg:absolute lg:p-[2rem] lg:pb-[.5rem] lg:w-[500px] lg:h-[400px] lg:mt-0 lg:top-[40%] lg:left-[50%] lg:-translate-x-1/2 lg:-translate-y-1/2",
              modalMode ? "scale-75 !mt-[35px]" : ""
            )}>
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
                      <>
                        <div className="z-[25]">
                          <p className="text-2xl">OPPS! Aladdin Rugged You! 0 Points this Time...</p>
                          <motion.img
                            className="w-[150px] md:w-[180px] lg:w-[210px] xl:w-full absolute z-[25]"
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
                        <div className="bg-black rounded-full p-[1px] -z-1 ">
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
                      </>
                    )}

                    {(_viewDataRes.data.gamePlayResult.bitsWon > 0 && (
                      <>
                        <p className="text-2xl text-gray-950">w👀t! w👀t! You have won:</p>
                        <p className="text-4xl mt-[2rem] text-gray-950">
                          {_viewDataRes.data.gamePlayResult.bitsWon} {` BiTz`}
                        </p>
                        <div className="bg-black rounded-full p-[1px]">
                          <HoverBorderGradient>
                            <a
                              className=" bg-black text-white  rounded-3xl gap-2 flex flex-row justify-center items-center"
                              href={"https://twitter.com/intent/tweet?" + tweetText}
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

                    {(((_viewDataRes.data.gamePlayResult.bonusTriesBeforeThisPlay > 0 && _viewDataRes.data.gamePlayResult.bonusTriesAfterThisPlay === -1) ||
                      _viewDataRes.data.gamePlayResult.bonusTriesAfterThisPlay > 0) && (
                      <div className="text-center mt-[2rem]">
                        <p className="text-xl">
                          BONUS GAMES AVAILABLE! w👀t! your referrals have earned you{" "}
                          {_viewDataRes.data.gamePlayResult.bonusTriesAfterThisPlay > 0
                            ? _viewDataRes.data.gamePlayResult.bonusTriesAfterThisPlay
                            : _viewDataRes.data.gamePlayResult.bonusTriesBeforeThisPlay}{" "}
                          more bonus tries!
                        </p>

                        <div
                          className="cursor-pointer relative inline-flex h-12 overflow-hidden rounded-full p-[1px] "
                          onClick={() => {
                            resetToStartGame();
                          }}>
                          <span className="absolute hover:bg-sky-300 inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF03,#45d4ff_50%,#111111_50%)]" />
                          <span className="text-primary inline-flex h-full hover:bg-gradient-to-tl from-background to-sky-300 w-full cursor-pointer items-center justify-center rounded-full bg-background px-3 py-1 text-sm font-medium backdrop-blur-3xl">
                            PLAY AGAIN! <MousePointerClick className="ml-2 text-sky-300" />
                          </span>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center mt-[2rem]">
                        <p className="text-xl">You can try again in:</p>
                        <div className="text-2xl mt-[1rem]">
                          <Countdown date={Date.now() + _viewDataRes.data.gamePlayResult.configCanPlayEveryMSecs} renderer={countdownRenderer} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {!modalMode && spritLayerPointsCloud()}
        </div>
      );
    }
  }

  function spritLayerPointsCloud() {
    return (
      <div className="flex flex-col justify-center items-center w-[200px] h-[100px] absolute top-[2%] left-[2%] rounded-[3rem] bg-slate-50 text-gray-950 p-[2rem] border border-primary/50">
        <p className="text-sm">Your {`BiTz`} Points</p>
        <p className="text-[1.5rem] font-bold mt-[2px]">{bitzBalance === -2 ? `...` : <>{bitzBalance === -1 ? "0" : `${bitzBalance}`}</>}</p>
      </div>
    );
  }

  async function fetchAndLoadLeaderBoards() {
    setLeaderBoardIsLoading(true);

    const callConfig = {
      headers: {
        "fwd-tokenid": createNftId(GET_BITZ_TOKEN_MVX.tokenIdentifier, GET_BITZ_TOKEN_MVX.nonce),
      },
    };

    const nowDateObj = new Date();
    let UTCMonth = nowDateObj.getUTCMonth() + 1; // can returns vals 1 - 12
    let UTCMonthStr = UTCMonth.toString();

    if (UTCMonth < 10) {
      UTCMonthStr = "0" + UTCMonthStr; // make 1 = 01 ... 9 = 09 etc
    }

    const UTCYear = nowDateObj.getUTCFullYear().toString().slice(-2); // converts number 2024 to string 24
    let MMYYString = `${UTCMonthStr}_${UTCYear}`;

    // S: for TESTING monthly leaderboards, allow a param override!
    const searchParams = new URLSearchParams(window.location.search);
    const _overrideMMYYString = searchParams.get("x-test-custom-mmyy-string"); // should be like this 03_24

    if (_overrideMMYYString && _overrideMMYYString.length === 5 && _overrideMMYYString.indexOf("_") === 2) {
      MMYYString = _overrideMMYYString;
      setInDateStringDebugMode(true);
    }
    // E: for TESTING monthly leaderboards, allow a param override!

    setLeaderBoardMonthString(MMYYString);

    // Get All Time leaderboard
    try {
      // S: ACTUAL LOGIC
      const { data } = await axios.get<LeaderBoardItemType[]>(`${getApiWeb2Apps(chainID)}/datadexapi/xpGamePrivate/leaderBoard`, callConfig);
      setLeaderBoardAllTime(data);
      // E: ACTUAL LOGIC
    } catch (err) {
      const message = "Leaderboard fetching failed:" + (err as AxiosError).message;
      console.error(message);
    }

    // Get Monthly Leaderboard
    try {
      // S: ACTUAL LOGIC
      const { data } = await axios.get<LeaderBoardItemType[]>(
        `${getApiWeb2Apps(chainID)}/datadexapi/xpGamePrivate/monthLeaderBoard?MMYYString=${MMYYString}`,
        callConfig
      );

      setLeaderBoardMonthly(data);
      // E: ACTUAL LOGIC
    } catch (err) {
      const message = "Monthly Leaderboard fetching failed:" + (err as AxiosError).message;
      console.error(message);
    }

    setLeaderBoardIsLoading(false);
  }

  async function fetchAndLoadMyRankOnLeaderBoard() {
    const callConfig = {
      headers: {
        "fwd-tokenid": createNftId(GET_BITZ_TOKEN_MVX.tokenIdentifier, GET_BITZ_TOKEN_MVX.nonce),
      },
    };

    try {
      const { data } = await axios.get<any>(`${getApiWeb2Apps(chainID)}/datadexapi/xpGamePrivate/playerRankOnLeaderBoard?playerAddr=${address}`, callConfig);

      setMyRankOnAllTimeLeaderBoard(data.playerRank || "N/A");
    } catch (err) {
      const message = "Getting my rank on the all time leaderboard failed:" + (err as AxiosError).message;
      console.error(message);
    }
  }

  return (
    <>
      {usingReferralCode !== "" && (
        <div className="p-1 text-lg font-bold border border-[#35d9fa] rounded-[1rem] mb-[1rem] text-center">
          You are playing with referral code {usingReferralCode}
        </div>
      )}
      <div className="relative w-full">
        <div className="absolute -z-1 w-full">
          <img
            className={cn("-z-1 rounded-[3rem] w-full cursor-pointer", modalMode ? "rounded" : "")}
            src={ImgLoadingGame}
            alt={"Checking if you have BiTz Data NFT"}
          />
        </div>
        {gamePlayImageSprites()}
      </div>

      {!modalMode && (
        <>
          <div className="p-5 text-lg font-bold border border-[#35d9fa] rounded-[1rem] mt-[3rem] ">
            <h2 className="text-center text-white mb-[1rem]">Get BiTz Perks</h2>

            <ol className="mt-5">
              <li className="my-5">
                1. Top {BIT_GAME_TOP_LEADER_BOARD_GROUP} Movers from "Monthly" LEADERBOARD get Airdropped Data NFTs from previous and upcoming Data Creators.
              </li>
              <li className="my-5">2. Extra 3 bonus drops of Data NFTs sent randomly to users from top 100 "All Time" LEADERBOARD</li>
              <li className="my-5">
                3. Got Memes for burning? Join our{" "}
                <a className="!text-[#35d9fa] hover:underline" href="https://discord.com/channels/869901313616527360/922340575594831872" target="blank">
                  Discord Meme Channel
                </a>{" "}
                and submit it there. Top 3 memes per week get included into the Meme Burn Game and we will showcase it on Twitter.
              </li>
              <li className="my-5">
                4. Power Up Data Bounties with {`BiTz`} XP below - Give {`BiTz`}
              </li>
            </ol>
            <p>See the full list of {`BiTz`} XP perks listed in the FAQ section below...</p>
          </div>

          <div id="leaderboard" className="flex flex-col max-w-[100%] border border-[#35d9fa] p-[2rem] rounded-[1rem] mt-[3rem]">
            <div className="leaderBoard">
              <h2 className="text-center text-white mb-[1rem]">LEADERBOARD</h2>

              {address && leaderBoardAllTime.length > 0 && (
                <div className="my-rank-and-score md:flex md:justify-center border p-[.6rem] mb-[1rem] rounded-[1rem] text-center bg-[#35d9fa] bg-opacity-25">
                  <div className="flex flex-col items-center p-[1rem] md:flex-row md:align-baseline md:pr-[2rem] md:border-r-4 border-[#171717]">
                    <p className="flex items-end md:text-lg md:mr-[1rem]">Your Current All-Time Rank</p>
                    <p className="text-xl md:text-2xl dark:text-[#35d9fa] font-bold">
                      {myRankOnAllTimeLeaderBoard === "-2" ? `...` : myRankOnAllTimeLeaderBoard}
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-[1rem] md:flex-row md:align-baseline md:pr-[2rem] md:pl-[2rem]">
                    <p className="flex items-end md:text-lg md:mr-[1rem]">Your Collected {`BiTz`} Points </p>
                    <p className="text-xl md:text-2xl dark:text-[#35d9fa] font-bold">
                      {collectedBitzSum === -2 ? `...` : <>{collectedBitzSum === -1 ? "0" : `${collectedBitzSum}`}</>}
                    </p>
                  </div>
                </div>
              )}

              <div className="md:flex">
                <div className="my-[1rem] allTime md:flex-1">
                  <h3 className="text-center text-white mb-[1rem]">All Time</h3>
                  {leaderBoardIsLoading ? (
                    <Loader />
                  ) : (
                    <>
                      {leaderBoardAllTime.length > 0 ? (
                        <LeaderBoardTable leaderBoardData={leaderBoardAllTime} address={address} />
                      ) : (
                        <div className="text-center">{!chainID ? "Connect Wallet to Check" : "No Data Yet"!}</div>
                      )}
                    </>
                  )}
                </div>

                <div className="my-[1rem] monthly md:flex-1">
                  <h3 className="text-center text-white mb-[1rem]">
                    Monthly ({leaderBoardMonthString.replace("_", "-20")}) {inDateStringDebugMode && <span className="text-red-100"> IN DEBUG MODE!</span>}
                  </h3>
                  {leaderBoardIsLoading ? (
                    <Loader />
                  ) : (
                    <>
                      {leaderBoardMonthly.length > 0 ? (
                        <LeaderBoardTable leaderBoardData={leaderBoardMonthly} address={address} />
                      ) : (
                        <div className="text-center">{!chainID ? "Connect Wallet to Check" : "No Data Yet"!}</div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {leaderBoardAllTime.length > 0 && gameDataNFT && <GiveBitzBase gameDataNFT={gameDataNFT} />}

          <Faq />
        </>
      )}
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
