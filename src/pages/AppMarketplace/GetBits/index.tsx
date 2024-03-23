import React, { useEffect, useState } from "react";
import { DataNft, ViewDataReturnType } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { GET_BITS_TOKEN } from "appsConfig";
import { Loader } from "components";
import { useGetAccount, useGetPendingTransactions } from "hooks";
import { BlobDataType } from "libs/types";
import { decodeNativeAuthToken, toastError, sleep } from "libs/utils";
import { MARKETPLACE_DETAILS_PAGE } from "config";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "./GetBits.css";

import ImgPlayGame from "assets/img/getbits/getbits-play.gif";
import ImgGetDataNFT from "assets/img/getbits/getbits-get-datanft.gif";
import ImgGameCanvas from "assets/img/getbits/getbits-game-canvas.gif";

interface ExtendedViewDataReturnType extends ViewDataReturnType {
  blobDataType: BlobDataType;
}

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

  async function fetchDataNfts() {
    setIsLoading(true);

    const _gameDataNFT = await DataNft.createFromApi(GET_BITS_TOKEN);
    setGameDataNFT(_gameDataNFT);

    setIsLoading(false);
  }

  async function fetchMyNfts() {
    if (gameDataNFT) {
      const _dataNfts = await DataNft.ownedByAddress(address);
      const hasRequiredDataNFT = _dataNfts.find((dNft) => gameDataNFT.nonce === dNft.nonce);
      setHasGameDataNFT(hasRequiredDataNFT ? true : false);
    }
  }

  async function viewData() {
    try {
      if (!gameDataNFT) {
        toastError("Data is not loaded");
        return;
      }

      setIsFetchingDataMarshal(true);

      await sleep(5);

      if (hasGameDataNFT) {
        const dataNft = gameDataNFT;

        let res: any;
        if (!(tokenLogin && tokenLogin.nativeAuthToken)) {
          throw Error("No Native Auth token");
        }

        const arg = {
          mvxNativeAuthOrigins: [decodeNativeAuthToken(tokenLogin.nativeAuthToken).origin],
          mvxNativeAuthMaxExpirySeconds: 3600,
          fwdHeaderMapLookup: {
            "authorization": `Bearer ${tokenLogin.nativeAuthToken}`,
          },
          fwdHeaderKeys: "authorization",
        };

        res = await dataNft.viewDataViaMVXNativeAuth(arg);

        let blobDataType = BlobDataType.TEXT;

        if (!res.error) {
          if (res.contentType.search("application/json") >= 0) {
            res.data = JSON.parse(await (res.data as Blob).text());
          }
        } else {
          console.error(res.error);
          toastError(res.error);
        }

        const viewDataPayload: ExtendedViewDataReturnType = {
          ...res,
          blobDataType,
        };

        setGameDataFetched(true);
        setIsFetchingDataMarshal(false);
        setViewDataRes(viewDataPayload);
      }
    } catch (err) {
      console.error(err);
      toastError((err as Error).message);
      setIsFetchingDataMarshal(false);
    }
  }

  if (isLoading) {
    return <Loader />;
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

          <div className="flex justify-center items-center w-[400px] h-[300px] absolute top-[10%] left-[30%] rounded-[3rem] bg-slate-50 text-gray-950 p-[2rem]">
            {!isFetchingDataMarshal && (
              <div onClick={() => viewData()}>
                <p className="text-center text-xl text-gray-950 text-foreground cursor-pointer">
                  Hey Itheum DeGen! Are ready to grab yourself some of them sWeet sWeet {`<BiTS>`} points? Sacrifice a meme to the DeGen Gods and click when you
                  are ready...
                </p>
              </div>
            )}
            {isFetchingDataMarshal && (
              <div>
                <Loader noText />
                <p className="text-center text-xl text-gray-950 text-foreground">What will the DeGen Gods bestow on you??</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    // we got the response from the game play
    if (loadBlankGameCanvas && !isFetchingDataMarshal && gameDataFetched) {
      return (
        <div className="relative">
          <img className="rounded-[3rem] 3xl:h-[375px] w-full cursor-pointer" src={ImgGameCanvas} alt={"Get <BiTS> Points"} />

          <div className="flex justify-center items-center w-[400px] h-[300px] absolute top-[10%] left-[30%] rounded-[3rem] bg-slate-50 text-gray-950 p-[2rem]">
            {viewDataRes && !viewDataRes.error && (
              <>
                {viewDataRes.data.gamePlayResult.triedTooSoonTryAgainInMs > 0 && (
                  <div>
                    <p className="text-xl text-center">
                      You FOMOed in too fast, try again in: {Math.floor(viewDataRes.data.gamePlayResult.triedTooSoonTryAgainInMs / 1000 / 60)} Mins
                    </p>
                  </div>
                )}

                {viewDataRes.data.gamePlayResult.triedTooSoonTryAgainInMs === -1 && (
                  <div className="flex flex-col justify-around h-[100%] items-center text-center">
                    {viewDataRes.data.gamePlayResult.bitsScoreBeforePlay && (
                      <p>
                        Previous {`<BiTS>`} Balance {viewDataRes.data.gamePlayResult.bitsScoreBeforePlay}
                      </p>
                    )}

                    {viewDataRes.data.gamePlayResult.bitsWon === 0 && <p className="text-xl">OPPS! You got Rugged! 0 Points this time... :(</p>}

                    {viewDataRes.data.gamePlayResult.bitsWon > 0 && (
                      <p className="text-xl text-gray-950">
                        w00t! w00t! You have won {viewDataRes.data.gamePlayResult.bitsWon} {` <BiTS>`}.
                      </p>
                    )}

                    {viewDataRes.data.gamePlayResult.bitsWon > 0 && viewDataRes.data.gamePlayResult.bitsScoreAfterPlay && (
                      <p>
                        New {`<BiTS>`} Balance: {viewDataRes.data.gamePlayResult.bitsScoreAfterPlay}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      );
    }
  };

  return <>{gamePlayImageSprites()}</>;
};

{
  /* <h4 className="mt-3 font-title">You do not own this Data NFT</h4>
          <h6>(Buy the Data NFT from the marketplace to unlock the data)</h6> */
}
