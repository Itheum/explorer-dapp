import React, { useEffect, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo, useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { MULTIVERSX_BUBBLE_TOKENS } from "appsConfig";
import headerHero from "assets/img/custom-app-header-bubblemaps.png";
import { MvxDataNftCard, Loader } from "components";
import { HeaderComponent } from "components/Layout/HeaderComponent";
import { ZoomableSvg } from "components/ZoomableSvg";
import { SHOW_NFTS_STEP } from "config";
import { useGetPendingTransactions } from "hooks";
import { Button } from "libComponents/Button";
import { BlobDataType, ExtendedViewDataReturnType } from "libs/types";
import { decodeNativeAuthToken, getApiDataMarshal, toastError } from "libs/utils";
import { useNftsStore } from "store/nfts";

export const MultiversxBubbles = () => {
  const { tokenLogin } = useGetLoginInfo();
  const { chainID } = useGetNetworkConfig();
  const { hasPendingTransactions } = useGetPendingTransactions();

  const [shownAppDataNfts, setShownAppDataNfts] = useState<DataNft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  const [owned, setOwned] = useState<boolean>(false);
  const [viewDataRes, setViewDataRes] = useState<ExtendedViewDataReturnType>();
  const [file, setFile] = useState<string | null>(null);
  const { mvxNfts: nfts, isLoadingMvx: isLoadingUserNfts } = useNftsStore();

  useEffect(() => {
    if (!hasPendingTransactions) {
      fetchAppNfts();
    }
  }, [hasPendingTransactions, nfts]);

  async function fetchAppNfts(activeIsLoading = true) {
    if (activeIsLoading) {
      setIsLoading(true);
    }

    const _nfts: DataNft[] = await DataNft.createManyFromApi(
      MULTIVERSX_BUBBLE_TOKENS.slice(shownAppDataNfts.length, shownAppDataNfts.length + SHOW_NFTS_STEP).map((v) => ({
        nonce: v.nonce,
        tokenIdentifier: v.tokenIdentifier,
      }))
    );

    setShownAppDataNfts((oldNfts) => oldNfts.concat(_nfts));
    if (activeIsLoading) {
      setIsLoading(false);
    }
  }

  async function viewData(index: number) {
    try {
      if (!(index >= 0 && index < shownAppDataNfts.length)) {
        toastError("Data is not loaded");
        return;
      }

      const dataNft = shownAppDataNfts[index];
      const _owned = nfts.find((nft) => nft.tokenIdentifier === dataNft.tokenIdentifier) ? true : false;
      setOwned(_owned);

      if (_owned) {
        setIsFetchingDataMarshal(true);

        let res: any;
        if (!(tokenLogin && tokenLogin.nativeAuthToken)) {
          throw Error("No nativeAuth token");
        }

        const arg = {
          mvxNativeAuthOrigins: [decodeNativeAuthToken(tokenLogin.nativeAuthToken).origin],
          mvxNativeAuthMaxExpirySeconds: 3600,
          fwdHeaderMapLookup: {
            "authorization": `Bearer ${tokenLogin.nativeAuthToken}`,
          },
          stream: true,
        };

        if (!dataNft.dataMarshal || dataNft.dataMarshal === "") {
          dataNft.updateDataNft({ dataMarshal: getApiDataMarshal(chainID) });
        }
        res = await dataNft.viewDataViaMVXNativeAuth(arg);

        let blobDataType = BlobDataType.TEXT;
        if (!res.error) {
          if (res.contentType.search("image") >= 0) {
            if (res.contentType == "image/svg+xml") {
              blobDataType = BlobDataType.SVG;
              res.data = await (res.data as Blob).text();

              // create a file so it can also be loaded in a new window
              const pdfObject = window.URL.createObjectURL(new Blob([res.data], { type: res.contentType }));
              setFile(pdfObject);
            } else {
              blobDataType = BlobDataType.IMAGE;
              res.data = window.URL.createObjectURL(new Blob([res.data], { type: res.contentType }));
            }
          } else {
            throw Error("This content type is not supported");
          }
        } else {
          throw Error(res.error);
        }

        setViewDataRes({
          ...res,
          blobDataType,
        });
        setIsFetchingDataMarshal(false);
      }
    } catch (err) {
      console.error(err);
      toastError((err as Error).message);
      setIsFetchingDataMarshal(false);
    }
  }

  function preProcess(code: any) {
    // let newCode = code.replace(/fill=".*?"/g, 'fill="red"');
    let newCode = code.replace(/height="1080pt"/, 'height="100%"');
    newCode = newCode.replace(/width="1080pt"/, 'width="100%"');
    newCode = newCode.replace(/<a/g, '<a xlink:show="new"'); // makes all link open in new tab

    return newCode;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <HeaderComponent
        pageTitle={"MultiversX Bubbles"}
        hasImage={true}
        imgSrc={headerHero}
        altImageAttribute={"bubbleMap"}
        pageSubtitle={"Data NFTs that Unlock this Itheum App"}
        dataNftCount={shownAppDataNfts.length}>
        {shownAppDataNfts.length > 0 ? (
          shownAppDataNfts.map((dataNft, index) => (
            <MvxDataNftCard
              key={index}
              index={index}
              dataNft={dataNft}
              isLoading={isLoading || isLoadingUserNfts}
              isDataWidget={true}
              owned={nfts.find((nft) => nft.tokenIdentifier === dataNft.tokenIdentifier) ? true : false}
              viewData={viewData}
              modalContent={
                !owned ? (
                  <div className="flex flex-col items-center justify-center min-w-[24rem] max-w-[50dvw] min-h-[40rem] max-h-[80svh]">
                    <h4 className="mt-3 font-title">You do not own this Data NFT</h4>
                    <h6>(Buy the Data NFT from the marketplace to unlock the data)</h6>
                  </div>
                ) : isFetchingDataMarshal ? (
                  <div className="flex flex-col items-center justify-center min-h-[40rem]">
                    <div>
                      <Loader noText />
                      <p className="text-center text-foreground ">{"Loading..."}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-end mr-3 mb-2">
                      {file && (
                        <Button
                          className="text-xs md:text-base text-black bg-gradient-to-r from-yellow-300 to-orange-500 py-6 sm:py-0"
                          onClick={() => {
                            if (file) {
                              window.open(file as string, "_blank");
                            }
                          }}>
                          Open in full screen
                        </Button>
                      )}
                    </div>
                    {viewDataRes &&
                      !viewDataRes.error &&
                      (viewDataRes.blobDataType === BlobDataType.IMAGE ? (
                        <img src={viewDataRes.data} className="w-full h-auto p-4" />
                      ) : viewDataRes.blobDataType === BlobDataType.SVG ? (
                        <ZoomableSvg data={viewDataRes.data} preProcess={preProcess} />
                      ) : (
                        <p className="p-2" style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
                          {viewDataRes.data}
                        </p>
                      ))}
                  </>
                )
              }
              modalTitle={"MultiversX Bubbles"}
              modalTitleStyle="p-4"
            />
          ))
        ) : (
          <h3 className="text-center text-white">No DataNFT</h3>
        )}
      </HeaderComponent>
      <div className="m-auto mb-5">
        {shownAppDataNfts.length < MULTIVERSX_BUBBLE_TOKENS.length && (
          <Button
            className="border-0 text-background rounded-lg font-medium tracking-tight base:!text-sm md:!text-base hover:opacity-80 hover:text-black"
            onClick={() => {
              fetchAppNfts(false);
            }}
            disabled={false}>
            Load more
          </Button>
        )}
      </div>
    </>
  );
};
