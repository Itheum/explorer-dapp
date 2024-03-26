import React, { useEffect, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { confetti } from "@tsparticles/confetti";
import { fireworks } from "@tsparticles/fireworks";
import Countdown from "react-countdown";
import { GET_BITS_TOKEN } from "appsConfig";
import "./GetBits.css";

// Image Layers
import FingerPoint from "assets/img/getbits/finger-point.gif";
import ImgGameCanvas from "assets/img/getbits/getbits-game-canvas.gif";
import ImgGetDataNFT from "assets/img/getbits/getbits-get-datanft.gif";
import ImgPlayGame from "assets/img/getbits/getbits-play.gif";
import Meme1 from "assets/img/getbits/memes/1.jpg";
import Meme2 from "assets/img/getbits/memes/2.jpg";
import Meme3 from "assets/img/getbits/memes/3.jpg";
import Meme4 from "assets/img/getbits/memes/4.jpg";
import Meme5 from "assets/img/getbits/memes/5.jpg";
import Meme6 from "assets/img/getbits/memes/6.jpg";
import aladinRugg from "assets/img/getbits/aladin.png";

import SacrificeGodLoader from "assets/img/getbits/sacrifice-god-loader.mp4";
import { Loader } from "components";
import { MARKETPLACE_DETAILS_PAGE } from "config";
import { useGetAccount, useGetPendingTransactions } from "hooks";
import { BlobDataType, ExtendedViewDataReturnType } from "libs/types";
import { decodeNativeAuthToken, toastError, sleep } from "libs/utils";
import { useAccountStore } from "../../../store/account";
import { motion } from "framer-motion";

const MEME_IMGS = [Meme1, Meme2, Meme3, Meme4, Meme5, Meme6];

export const GetBits = () => {
  const { address } = useGetAccount();
  const { tokenLogin } = useGetLoginInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const [gameDataNFT, setGameDataNFT] = useState<DataNft>();
  const [hasGameDataNFT, setHasGameDataNFT] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
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

  // const [bypassDebug, setBypassDebug] = useState<boolean>(false);

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
    await sleep(2);
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
      setGameDataFetched(true);
      setIsFetchingDataMarshal(false);
      setViewDataRes(viewDataPayload);
      if (viewDataPayload.data.gamePlayResult.bitsWon === 0) {
      } else if (viewDataPayload.data.gamePlayResult.bitsWon > 0) {
        if (viewDataPayload.data.gamePlayResult.userWonMaxBits === 1) {
          (async () => {
            await fireworks({ background: "transparent" });
          })();
        } else {
          (async () => {
            await confetti({ count: 500 });
            await confetti({ origin: { x: 70 } });
            await confetti({ origin: { x: 30 } });
          })();
        }
      }
      if (viewDataPayload.data.gamePlayResult.bitsScoreAfterPlay > -1) {
        updateBitsBalance(viewDataPayload.data.gamePlayResult.bitsScoreAfterPlay);
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

  const gamePlayImageSprites = () => {
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

    // user does not have the data nft, so take them to the marketplace
    if (!hasGameDataNFT) {
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
    const countdownRenderer = ({ hours, minutes, seconds, completed }) => {
      if (completed) {
        // Render a complete state
        return <CountDownComplete />;
      } else {
        // Render a countdown
        return (
          <span>
            {hours}H:{minutes}M:{seconds}S
          </span>
        );
      }
    };

    // user clicked on the start game view, so load the empty blank game canvas
    if (_loadBlankGameCanvas && !_gameDataFetched) {
      return (
        <div className="relative  overflow-hidden  ">
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
                <p className="text-center text-md text-gray-950 text-foreground mb-[0.5rem] md:text-xl mb-[1rem]">Let's Burn Sacrifice this Meme!</p>

                <img className="rounded-[.5rem] w-[210px] md:w-[300px] m-auto" src={randomMeme} alt={"Sacrifice a Meme"} />
                <div className="glow" style={{ opacity: burnFireGlow }}></div>
                <div className="flame !top-[285px] md:!top-[90px]" style={{ transform: burnFireScale }}></div>
              </div>
            )}

            {_isFetchingDataMarshal && (
              <div>
                <p className="text-center text-md text-gray-950 text-foreground mb-[0.5rem] md:text-xl mb-[1rem]">
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
                        <p className="text-2xl">OPPS! Aladdin rugged you! 0 Points this time...</p>
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
  };

  function spritLayerPointsCloud() {
    return (
      <div className="flex flex-col justify-center items-center w-[200px] h-[100px] absolute top-[2%] left-[2%] rounded-[3rem] bg-slate-50 text-gray-950 p-[2rem] border border-primary/50">
        <p className="text-sm">Your {`<BiTS>`} Points</p>
        <p className="text-[1.5rem] font-bold mt-[2px]">{bitsBalance === -2 ? `...` : <>{bitsBalance === -1 ? "0" : `${bitsBalance}`}</>}</p>
      </div>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {gamePlayImageSprites()}

      <div className="flex flex-col max-w-[100%] border border-primary/50 p-[2rem] my-[3rem]">
        <div>
          <h2 className="text-center text-white">FAQs</h2>

          <div className="mt-[2rem]">
            <h3 className="text-white">What are Itheum {`<BiTS>`} Points?</h3>
            <p>
              Think of them as the XP points of the Itheum Protocol, we like to call them "Data Ownership OG (Original Gangster) XP Points" and if you consider
              yourself an Itheum OG and love Data Ownership, then we absolutely think you are a pioneer and {`<BiTS>`} is the Itheum XP system for you!!
              <p className="mt-5">
                You need to use Data NFT and Itheum Core Infrastructure to collect your Itheum {`<BiTS>`}, and this exact Web3/Blockchain based product stack
                can be used by you to empower you to take ownership of and tokenize your data. So in essence, you are using Data Ownership + Data Tokenization
                technology! Welcome Itheum Data Ownership OG!
              </p>
            </p>
          </div>

          <div className="mt-[2rem]">
            <h3 className="text-white">How can I collect {`<BiTS>`} Points?</h3>
            <p>
              You need to hold a {`<BiTS>`} compatible Data NFT in your wallet to play the Get {`<BiTS>`} game (you are on this page now). This Data NFT was
              airdropped in waves to OGs of the Itheum Protocol, but fear not, you can also get it on any NFT Marketplace (if the OGs broke our hearts and
              parted ways with their Data NFTs). If this "Series 1" {`<BiTS>`} Data NFT is successful, there may be a follow-up Series of {`<BiTS>`} Data NFTs
              launched and airdropped as well.
            </p>
            <p className="mt-5">Once you have the Data NFT in your wallet, you can play the Game every 6 Hours. Based on random chance, you win {`<BiTS>`}.</p>
            <p className="mt-5">You DO NOT need to spend any gas to Play the game! SAY WAT?!</p>
          </div>

          <div className="mt-[2rem]">
            <h3 className="text-white">Wen Itheum {`<BiTS>`} Leaderboards?</h3>
            <p>Hang tight, leaderboards are coming very soon. Keep collecting them {`<BiTS>`} in the meantime.</p>
          </div>

          <div className="mt-[2rem]">
            <h3 className="text-white">What can I do with Itheum {`<BiTS>`} Points?</h3>
            <p>
              Itheum {`<BiTS>`} is like an XP system as you interact with the Itheum Protocol to collect your points. And like all XP Systems, there will be
              leaderboard-based rewards that are tied to use cases within the Itheum protocol. At launch, the following utility will be available:
            </p>
            <ol className="mt-5">
              <li>
                1. Top 3 Movers each month get Airdropped{" "}
                <a className="!text-[#7a98df] hover:underline" href="https://datadex.itheum.io/datanfts/marketplace/market" target="blank">
                  Data NFTs
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
            <h3 className="text-white">Are Itheum {`<BiTS>`} Points Blockchain Tokens?</h3>
            <p>
              Nope, there are more than enough meme coins out there and we don't need more. Itheum {`<BiTS>`} are simple XP points to gamify usage of the Itheum
              Protocol infrastructure. The $ITHEUM token is the primary utility token of the entire Itheum Ecosystem.
            </p>
          </div>

          <div className="mt-[2rem]">
            <h3 className="text-white">Are Itheum {`<BiTS>`} Points Tradable?</h3>
            <p>
              We are heart-broken that you asked :( and nope you can't as they are not blockchain tokens (see above). But we are looking at possibilities of
              where you can "gift" them to Data Creators who mint Data NFT Collections. "Gifting" Itheum {`<BiTS>`} will have its own leaderboard and perks ;)
            </p>
          </div>

          <div className="mt-[2rem]">
            <h3 className="text-white">Can I move Itheum {`<BiTS>`} Points Between my Wallets?</h3>
            <p>
              Lost your primary wallet or want to move Itheum {`<BiTS>`} to your new wallet? unfortunately, this is not possible right now (it MAY be in the
              future - but no guarantee). So make sure you get {`<BiTS>`} in the wallet you treasure the most.
            </p>
          </div>

          <div className="mt-[2rem]">
            <h3 className="text-white">Why is it Called {`<BiTS>`}?</h3>
            <p>
              Itheum is a data ownership protocol that is trying to break the current cycle of data exploitation. A Bit is the smallest unit of data. Let's
              break the cycle of data exploitation one {`<BiT>`} at a time.
            </p>
          </div>

          <div className="mt-[2rem]">
            <h3 className="text-white">Will this {`<BiTS>`} App become a Playable Game?</h3>
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
            <h3 className="text-white">Help Make Itheum {`<BiTS>`} Better?</h3>
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
