import React, { useEffect, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { GET_BITS_TOKEN } from "appsConfig";
import { Loader } from "components";
import { MARKETPLACE_DETAILS_PAGE } from "config";
import { useGetAccount, useGetPendingTransactions } from "hooks";
import { BlobDataType, ExtendedViewDataReturnType } from "libs/types";
import { decodeNativeAuthToken, toastError, sleep, timeUntil } from "libs/utils";
import { useAccountStore } from "../../../store/account";
import "./GetBits.css";

// Image Layers
import ImgPlayGame from "assets/img/getbits/getbits-play.gif";
import ImgGetDataNFT from "assets/img/getbits/getbits-get-datanft.gif";
import ImgGameCanvas from "assets/img/getbits/getbits-game-canvas.gif";

export const GetBits = () => {
  const { address } = useGetAccount();
  const { tokenLogin } = useGetLoginInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const [gameDataNFT, setGameDataNFT] = useState<DataNft>();
  const [hasGameDataNFT, setHasGameDataNFT] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(false);
  const [gameDataFetched, setGameDataFetched] = useState<boolean>(false);
  const [loadBlankGameCanvas, setLoadBlankGameCanvas] = useState<boolean>(false);
  const [viewDataRes, setViewDataRes] = useState<ExtendedViewDataReturnType>();
  const bitsBalance = useAccountStore((state: any) => state.bitsBalance);
  const updateBitsBalance = useAccountStore((state) => state.updateBitsBalance);

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
    }
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

      if (viewDataPayload.data.gamePlayResult.bitsScoreAfterPlay > -1) {
        updateBitsBalance(viewDataPayload.data.gamePlayResult.bitsScoreAfterPlay);
      }
    } else {
      toastError("ER2: Did not get a response from the game server");
      setIsFetchingDataMarshal(false);
    }
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
    // user does not have the data nft, so take them to the marketplace
    if (!hasGameDataNFT) {
      return (
        <div
          onClick={() => {
            if (gameDataNFT) {
              goToMarketplace(gameDataNFT.tokenIdentifier);
            }
          }}>
          <img className="rounded-[3rem] 3xl:h-[375px] w-full cursor-pointer" src={ImgGetDataNFT} alt={"Get <BiTS> Data NFT from Data NFT Marketplace"} />
        </div>
      );
    }

    // user has data nft, so load the "start game" view
    if (!loadBlankGameCanvas && !isFetchingDataMarshal) {
      return (
        <div
          onClick={() => {
            setLoadBlankGameCanvas(true);
          }}>
          <img className="rounded-[3rem] 3xl:h-[375px] w-full cursor-pointer" src={ImgPlayGame} alt={"Start Game"} />
        </div>
      );
    }

    // user clicked on the start game view, so load the empty blank game canvas
    if (loadBlankGameCanvas && !gameDataFetched) {
      return (
        <div className="relative">
          <img className="rounded-[3rem] 3xl:h-[375px] w-full cursor-pointer" src={ImgGameCanvas} alt={"Play Game"} />

          <div
            className="flex justify-center items-center mt-[10px] w-[100%] h-[300px] static top-[10%] left-[30%] rounded-[3rem] bg-slate-50 text-gray-950 p-[1rem] border border-primary/50
                        md:absolute md:p-[2rem] md:w-[400px] md:mt-0">
            {!isFetchingDataMarshal && (
              <div className="text-center text-xl text-gray-950 text-foreground cursor-pointer" onClick={() => playGame()}>
                <p>Hey Itheum DeGen! Are ready to grab yourself some of them sWeet sWeet {`<BiTS>`} points?</p>
                <p className="font-bold mt-5">Sacrifice a meme to the DeGen Gods and click here when you are ready...</p>
              </div>
            )}
            {isFetchingDataMarshal && (
              <div>
                <Loader noText />
                <p className="text-center text-xl text-gray-950 text-foreground">What will the DeGen Gods bestow on you??</p>
              </div>
            )}
          </div>

          {spritLayerPointsCloud()}
        </div>
      );
    }

    // we got the response from the game play
    if (loadBlankGameCanvas && !isFetchingDataMarshal && gameDataFetched) {
      return (
        <div className="relative">
          <img className="rounded-[3rem] 3xl:h-[375px] w-full cursor-pointer" src={ImgGameCanvas} alt={"Get <BiTS> Points"} />

          <div
            className="flex justify-center items-center mt-[10px] w-[100%] h-[300px] static top-[10%] left-[30%] rounded-[3rem] bg-slate-50 text-gray-950 p-[1rem] border border-primary/50
                        md:absolute md:p-[2rem] md:w-[400px] md:mt-0">
            {viewDataRes && !viewDataRes.error && (
              <>
                {viewDataRes.data.gamePlayResult.triedTooSoonTryAgainInMs > 0 && (
                  <div>
                    <p className="text-xl text-center">
                      You FOMOed in too fast, try again in: {getTimeUntilString(viewDataRes.data.gamePlayResult.triedTooSoonTryAgainInMs / 1000)}
                    </p>
                  </div>
                )}

                {viewDataRes.data.gamePlayResult.triedTooSoonTryAgainInMs === -1 && (
                  <div className="flex flex-col justify-around h-[100%] items-center text-center">
                    {(viewDataRes.data.gamePlayResult.bitsScoreBeforePlay && (
                      <p>
                        Previous {`<BiTS>`} Balance {viewDataRes.data.gamePlayResult.bitsScoreBeforePlay}
                      </p>
                    )) ||
                      null}

                    {(viewDataRes.data.gamePlayResult.bitsWon === 0 && <p className="text-xl">OPPS! You got Rugged! 0 Points this time... :(</p>) || null}

                    {(viewDataRes.data.gamePlayResult.bitsWon > 0 && (
                      <p className="text-xl text-gray-950">
                        w00t! w00t! You have won {viewDataRes.data.gamePlayResult.bitsWon} {` <BiTS>`}.
                      </p>
                    )) ||
                      null}

                    {viewDataRes.data.gamePlayResult.bitsWon > 0 && viewDataRes.data.gamePlayResult.bitsScoreAfterPlay ? (
                      <p>
                        New {`<BiTS>`} Balance: {viewDataRes.data.gamePlayResult.bitsScoreAfterPlay}
                      </p>
                    ) : null}
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

  const getTimeUntilString = (secondsUntil: number) => {
    const timeUntilObj = timeUntil(Math.floor(secondsUntil));

    return `${timeUntilObj.count} ${timeUntilObj.unit}`;
  };

  return (
    <>
      {gamePlayImageSprites()}

      <div className="flex flex-col max-w-[100%] border border-primary/50 p-[2rem] my-[3rem]">
        <div>
          <h2 className="text-center text-white">FAQs</h2>

          <div className="mt-[2rem]">
            <h3 className="text-white">What are {`<BiTS>`} Points?</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque imperdiet lorem congue, bibendum dui eget, lobortis purus. Donec faucibus, sapien
              eu rutrum eleifend, ipsum arcu pharetra lectus, eu tincidunt sapien quam et nunc. Fusce non diam mattis ipsum maximus feugiat. Ut hendrerit congue
              mi non convallis.{" "}
            </p>
          </div>

          <div className="mt-[2rem]">
            <h3 className="text-white">What can I do with {`<BiTS>`} Points?</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque imperdiet lorem congue, bibendum dui eget, lobortis purus. Donec faucibus, sapien
              eu rutrum eleifend, ipsum arcu pharetra lectus, eu tincidunt sapien quam et nunc. Fusce non diam mattis ipsum maximus feugiat. Ut hendrerit congue
              mi non convallis.{" "}
            </p>
          </div>

          <div className="mt-[2rem]">
            <h3 className="text-white">Are {`<BiTS>`} Points blockchain tokens?</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque imperdiet lorem congue, bibendum dui eget, lobortis purus. Donec faucibus, sapien
              eu rutrum eleifend, ipsum arcu pharetra lectus, eu tincidunt sapien quam et nunc. Fusce non diam mattis ipsum maximus feugiat. Ut hendrerit congue
              mi non convallis.{" "}
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
