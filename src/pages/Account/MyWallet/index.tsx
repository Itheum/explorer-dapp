import React, { useEffect, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo, useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import DOMPurify from "dompurify";
import SVG from "react-inlinesvg";
import imgGuidePopup from "assets/img/guide-unblock-popups.png";

import { DataNftCard, Loader } from "components";
import { HeaderComponent } from "components/Layout/HeaderComponent";
import { MARKETPLACE_DETAILS_PAGE, SHOW_NFTS_STEP } from "config";
import { Button } from "libComponents/Button";
import { BlobDataType, ExtendedViewDataReturnType } from "libs/types";
import { decodeNativeAuthToken, getApiDataMarshal, toastError } from "libs/utils";
import { useNftsStore } from "store/nfts";

export const MyWallet = () => {
  const { tokenLogin } = useGetLoginInfo();
  const { chainID } = useGetNetworkConfig();
  const [viewDataRes, setViewDataRes] = useState<ExtendedViewDataReturnType>();
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  const [isAutoOpenFormat, setIsAutoOpenFormat] = useState<boolean>(false);
  const [isDomPurified, setIsDomPurified] = useState<boolean>(false);

  const nfts = useNftsStore((state) => state.nfts);
  const [numberOfNftsShown, setNumberOfNftsShown] = useState<number>(SHOW_NFTS_STEP);
  const [shownDataNfts, setShownDataNfts] = useState<DataNft[]>(nfts.slice(0, SHOW_NFTS_STEP));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setShownDataNfts(nfts.slice(0, numberOfNftsShown));
  }, [numberOfNftsShown, nfts]);

  async function viewNormalData(index: number) {
    if (!(index >= 0 && index < shownDataNfts.length)) {
      toastError("Data is not loaded");
      return;
    }

    setIsFetchingDataMarshal(true);
    setViewDataRes(undefined);

    const dataNft = shownDataNfts[index];
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
    };
    if (!dataNft.dataMarshal || dataNft.dataMarshal === "") {
      dataNft.updateDataNft({ dataMarshal: getApiDataMarshal(chainID) });
    }
    res = await dataNft.viewDataViaMVXNativeAuth(arg);
    let blobDataType = BlobDataType.TEXT;

    if (!res.error) {
      if (res.contentType.search("image") >= 0) {
        if (res.contentType == "image/svg+xml") {
          setIsAutoOpenFormat(false);
          blobDataType = BlobDataType.SVG;
          res.data = DOMPurify.sanitize(await (res.data as Blob).text());
          setIsDomPurified(true);
        } else {
          setIsAutoOpenFormat(false);
          blobDataType = BlobDataType.IMAGE;
          res.data = window.URL.createObjectURL(new Blob([res.data], { type: res.contentType }));
        }
      } else if (res.contentType.search("audio") >= 0) {
        setIsAutoOpenFormat(false);
        res.data = window.URL.createObjectURL(new Blob([res.data], { type: res.contentType }));
        blobDataType = BlobDataType.AUDIO;
        // const purifiedStr = DOMPurify.sanitize(await (res.data as Blob).text());
        // res.data = window.URL.createObjectURL(new Blob([purifiedStr], { type: res.contentType }));
        // blobDataType = BlobDataType.AUDIO;
        // setIsDomPurified(true);
      } else if (res.contentType.search("application/pdf") >= 0) {
        const pdfObject = window.URL.createObjectURL(new Blob([res.data], { type: res.contentType }));
        res.data = pdfObject;
        blobDataType = BlobDataType.PDF;
        window.open(pdfObject, "_blank");
        setIsAutoOpenFormat(true);
      } else if (res.contentType.search("application/json") >= 0) {
        setIsAutoOpenFormat(false);
        const purifiedJSONStr = DOMPurify.sanitize(await (res.data as Blob).text());
        res.data = JSON.stringify(JSON.parse(purifiedJSONStr), null, 4);
        setIsDomPurified(true);
      } else if (res.contentType.search("text/plain") >= 0) {
        setIsAutoOpenFormat(false);
        res.data = DOMPurify.sanitize(await (res.data as Blob).text());
        setIsDomPurified(true);
      } else if (res.contentType.search("video/mp4") >= 0) {
        setIsAutoOpenFormat(false);
        const videoObject = window.URL.createObjectURL(new Blob([res.data], { type: res.contentType }));
        res.data = videoObject;
        blobDataType = BlobDataType.VIDEO;
      } else if (res.contentType.search("text/html") >= 0) {
        const blobUrl = URL.createObjectURL(res.data);
        window.open(blobUrl, "_blank");
      } else {
        setIsAutoOpenFormat(false);
        // we don't support that format
        res.data = "Sorry, this file type is currently not supported by the Explorer File Viewer. The file type is: " + res.contentType;
      }
    } else {
      console.error(res.error);
      toastError(res.error);
    }

    const viewDataPayload: ExtendedViewDataReturnType = {
      ...res,
      blobDataType,
    };

    setViewDataRes(viewDataPayload);
    setIsFetchingDataMarshal(false);
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <HeaderComponent pageTitle={"My Data NFT's"} hasImage={false} pageSubtitle={"My Data NFTs"} dataNftCount={nfts.length}>
        {shownDataNfts.length > 0 ? (
          shownDataNfts.map((dataNft, index) => (
            <DataNftCard
              key={index}
              index={index}
              dataNft={dataNft}
              isLoading={isLoading}
              owned={true}
              viewData={viewNormalData}
              isWallet={true}
              showBalance={true}
              modalContent={
                <>
                  {isDomPurified && (
                    <div className="p-4 bg-[#fff3cd] text-[#ae9447] text-sm" role="alert">
                      <strong>⚠️ Important:</strong> For your protection, this content has been automatically filtered locally in your browser for potential
                      common security risks; unfortunately, this may mean that even valid and safe content may appear different from the original format.{" "}
                      <strong>If you know and trust this Data Creator,</strong> then it is advisable to the use the Data DEX "Wallet" feature to download the
                      original file (at your own risk). <br />
                      <br />
                      Alternatively, <strong>as the safest option, only use official apps in the Data Widget Marketplace</strong> (accessible via the Header
                      Menu in this Explorer app). These apps automatically and safely visualize Data NFTs from verified Data Creators.
                    </div>
                  )}

                  {isFetchingDataMarshal ? (
                    <div className="flex flex-col items-center justify-center min-w-[24rem] max-w-[100%] min-h-[40rem] max-h-[80svh]">
                      <div>
                        <Loader noText />
                        <p className="text-center font-weight-bold">{"Loading..."}</p>
                      </div>
                    </div>
                  ) : (
                    viewDataRes &&
                    !viewDataRes.error &&
                    (viewDataRes.blobDataType === BlobDataType.IMAGE ? (
                      <img src={viewDataRes.data} style={{ width: "100%", height: "auto" }} />
                    ) : viewDataRes.blobDataType === BlobDataType.AUDIO ? (
                      <div className="flex justify-center items-center" style={{ height: "30rem" }}>
                        <audio controls autoPlay src={viewDataRes.data} />
                      </div>
                    ) : viewDataRes.blobDataType === BlobDataType.SVG ? (
                      <SVG src={viewDataRes.data} style={{ width: "100%", height: "auto" }} />
                    ) : viewDataRes.blobDataType === BlobDataType.VIDEO ? (
                      <video className="w-auto h-auto mx-auto my-4" style={{ maxHeight: "600px" }} controls autoPlay>
                        <source src={viewDataRes.data} type="video/mp4"></source>
                      </video>
                    ) : (
                      <div className="p-2">
                        {(isAutoOpenFormat && (
                          <>
                            <p className="p-2">
                              This Data NFT content was automatically opened in a new browser window. If your browser is prompting you to allow popups, please
                              select <b>Always allow pop-ups</b> and then close this and click on <b>View Data</b> again.
                            </p>
                            <img src={imgGuidePopup} style={{ width: "250px", height: "auto", borderRadius: "5px" }} />
                            <Button
                              variant="outline"
                              className="mt-3"
                              onClick={() => {
                                if (viewDataRes.data) {
                                  window.open(viewDataRes.data as string, "_blank");
                                }
                              }}>
                              Or, manually open the file by clicking here
                            </Button>
                          </>
                        )) || (
                          <p className="p-2" style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
                            {viewDataRes.data}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </>
              }
              modalTitle={"File Viewer"}
              modalTitleStyle="p-4"
            />
          ))
        ) : (
          <h4 className="no-items">
            <div>
              You do not own any Data NFTs yet. Browse and procure Data NFTs by visiting the
              <a href={`${MARKETPLACE_DETAILS_PAGE}`} className="ml-2 address-link text-decoration-none" target="_blank">
                Data DEX
              </a>
            </div>
          </h4>
        )}
      </HeaderComponent>
      <div className="m-auto mb-5">
        {numberOfNftsShown < nfts.length && (
          <Button
            className="border-0 text-background rounded-lg font-medium tracking-tight base:!text-sm md:!text-base hover:opacity-80 hover:text-black"
            onClick={() => {
              setNumberOfNftsShown(numberOfNftsShown + SHOW_NFTS_STEP);
              console.log(nfts.length, numberOfNftsShown);
            }}
            disabled={false}>
            Load more
          </Button>
        )}
      </div>
    </>
  );
};
