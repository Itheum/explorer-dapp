import React, { useEffect, useState } from "react";
import { DataNft, ViewDataReturnType } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { MULTIVERSX_BUBBLE_TOKENS } from "appsConfig";
import headerHero from "assets/img/custom-app-header-bubblemaps.png";
import { DataNftCard, Loader } from "components";
import { HeaderComponent } from "components/Layout/HeaderComponent";
import { ZoomableSvg } from "components/ZoomableSvg";
import { useGetAccount, useGetPendingTransactions } from "hooks";
import { Button } from "libComponents/Button";
import { BlobDataType } from "libs/types";
import { decodeNativeAuthToken, toastError } from "libs/utils";

interface ExtendedViewDataReturnType extends ViewDataReturnType {
  blobDataType: BlobDataType;
}

export const MultiversxBubbles = () => {
  const { address } = useGetAccount();
  const { tokenLogin } = useGetLoginInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();

  const [dataNfts, setDataNfts] = useState<DataNft[]>([]);
  const [flags, setFlags] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  const [owned, setOwned] = useState<boolean>(false);
  const [viewDataRes, setViewDataRes] = useState<ExtendedViewDataReturnType>();
  const [file, setFile] = useState<string | null>(null);

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
    if (MULTIVERSX_BUBBLE_TOKENS.length > 0) {
      const _nfts: DataNft[] = await DataNft.createManyFromApi(MULTIVERSX_BUBBLE_TOKENS.map((v) => ({ nonce: v.nonce, tokenIdentifier: v.tokenIdentifier })));
      setDataNfts(_nfts);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      toastError("No identifier for this Widget.");
    }
  }

  async function fetchMyNfts() {
    const _dataNfts = await DataNft.ownedByAddress(address);
    const _flags = [];

    for (const cnft of dataNfts) {
      const matches = _dataNfts.filter((mnft) => cnft.nonce === mnft.nonce);
      _flags.push(matches.length > 0);
    }

    setFlags(_flags);
  }

  async function viewData(index: number) {
    try {
      if (!(index >= 0 && index < dataNfts.length)) {
        toastError("Data is not loaded");
        return;
      }

      const _owned = flags[index];
      setOwned(_owned);

      if (_owned) {
        setIsFetchingDataMarshal(true);

        const dataNft = dataNfts[index];

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
    <HeaderComponent
      pageTitle={"MultiversX Bubbles"}
      hasImage={true}
      imgSrc={headerHero}
      altImageAttribute={"bubbleMap"}
      pageSubtitle={"Data NFTs that Unlock this Itheum Data Widget"}
      dataNftCount={dataNfts.length}>
      {dataNfts.length > 0 ? (
        dataNfts.map((dataNft, index) => (
          <DataNftCard
            key={index}
            index={index}
            dataNft={dataNft}
            isLoading={isLoading}
            owned={flags[index]}
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
  );
};
