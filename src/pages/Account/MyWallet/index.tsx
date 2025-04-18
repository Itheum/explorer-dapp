import React, { useEffect, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { DasApiAsset } from "@metaplex-foundation/digital-asset-standard-api";
import { useGetLoginInfo, useGetNetworkConfig, useGetAccount } from "@multiversx/sdk-dapp/hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import DOMPurify from "dompurify";
import SVG from "react-inlinesvg";
import imgGuidePopup from "assets/img/guide-unblock-popups.png";
import { MvxDataNftCard, Loader } from "components";
import HelmetPageMeta from "components/HelmetPageMeta";
import { HeaderComponent } from "components/Layout/HeaderComponent";
import { SolDataNftCard } from "components/SolDataNftCard";
import { DRIP_PAGE, MARKETPLACE_DETAILS_PAGE, SHOW_NFTS_STEP } from "config";
import { Button } from "libComponents/Button";
import { viewDataViaMarshalSol, getOrCacheAccessNonceAndSignature } from "libs/sol/SolViewData";
import { BlobDataType, ExtendedViewDataReturnType } from "libs/types";
import { decodeNativeAuthToken, getApiDataMarshal } from "libs/utils";
import { toastClosableError } from "libs/utils/uiShared";
import { useAccountStore } from "store/account";
import { useNftsStore } from "store/nfts";

export const MyWallet = () => {
  const { tokenLogin } = useGetLoginInfo();
  const {
    network: { chainId: chainID },
  } = useGetNetworkConfig();
  const [viewDataRes, setViewDataRes] = useState<ExtendedViewDataReturnType>();
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  const [isAutoOpenFormat, setIsAutoOpenFormat] = useState<boolean>(false);
  const [isDomPurified, setIsDomPurified] = useState<boolean>(false);
  const { mvxNfts, isLoadingMvx, solNfts, isLoadingSol } = useNftsStore();
  const [numberOfMvxNftsShown, setNumberOfMvxNftsShown] = useState<number>(SHOW_NFTS_STEP);
  const [shownMvxDataNfts, setShownMvxDataNfts] = useState<DataNft[]>(mvxNfts.slice(0, SHOW_NFTS_STEP));
  const [numberOfSolNftsShown, setNumberOfSolNftsShown] = useState<number>(SHOW_NFTS_STEP);
  const [shownSolDataNfts, setShownSolDataNfts] = useState<DasApiAsset[]>(solNfts.slice(0, SHOW_NFTS_STEP));
  const { publicKey: publicKeySol, signMessage } = useWallet();
  const { solBitzNfts } = useNftsStore();
  const { address: addressMvx } = useGetAccount();

  // S: Cached Signature Store Items
  const solPreaccessNonce = useAccountStore((state: any) => state.solPreaccessNonce);
  const solPreaccessSignature = useAccountStore((state: any) => state.solPreaccessSignature);
  const solPreaccessTimestamp = useAccountStore((state: any) => state.solPreaccessTimestamp);
  const updateSolPreaccessNonce = useAccountStore((state: any) => state.updateSolPreaccessNonce);
  const updateSolPreaccessTimestamp = useAccountStore((state: any) => state.updateSolPreaccessTimestamp);
  const updateSolSignedPreaccess = useAccountStore((state: any) => state.updateSolSignedPreaccess);
  // E: Cached Signature Store Items

  useEffect(() => {
    setShownMvxDataNfts(mvxNfts.slice(0, numberOfMvxNftsShown));
  }, [numberOfMvxNftsShown, mvxNfts]);

  useEffect(() => {
    setShownSolDataNfts(solNfts.slice(0, numberOfSolNftsShown));
  }, [numberOfSolNftsShown, solNfts]);

  async function viewDataMvx(index: number) {
    if (!(index >= 0 && index < shownMvxDataNfts.length)) {
      toastClosableError("Data is not loaded");
      return;
    }

    setIsFetchingDataMarshal(true);
    setViewDataRes(undefined);

    const dataNft = shownMvxDataNfts[index];
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
      toastClosableError(res.error);
    }

    const viewDataPayload: ExtendedViewDataReturnType = {
      ...res,
      blobDataType,
    };

    setViewDataRes(viewDataPayload);
    setIsFetchingDataMarshal(false);
  }

  async function viewDataSol(index: number) {
    if (!(index >= 0 && index < shownSolDataNfts.length)) {
      toastClosableError("Data is not loaded");
      return;
    }

    setIsFetchingDataMarshal(true);
    setViewDataRes(undefined);

    const dataNft = shownSolDataNfts[index];

    try {
      const { usedPreAccessNonce, usedPreAccessSignature } = await getOrCacheAccessNonceAndSignature({
        solPreaccessNonce,
        solPreaccessSignature,
        solPreaccessTimestamp,
        signMessage,
        publicKey: publicKeySol,
        updateSolPreaccessNonce,
        updateSolSignedPreaccess,
        updateSolPreaccessTimestamp,
      });

      const viewDataArgs = {
        headers: { "dmf-custom-sol-collection-id": dataNft.grouping[0].group_value },
        fwdHeaderKeys: ["dmf-custom-sol-collection-id"],
      };

      if (!publicKeySol) {
        throw new Error("Missing data for viewData");
      }

      const res = await viewDataViaMarshalSol(
        dataNft.id,
        usedPreAccessNonce,
        usedPreAccessSignature,
        publicKeySol,
        viewDataArgs.fwdHeaderKeys,
        viewDataArgs.headers
      );

      const contentType = res.headers.get("content-type");
      let blobDataType = BlobDataType.TEXT;
      let finalResp;

      if (res.ok) {
        const blob = await res.blob();

        if (contentType?.includes("image")) {
          if (contentType == "image/svg+xml") {
            setIsAutoOpenFormat(false);
            blobDataType = BlobDataType.SVG;
            finalResp = DOMPurify.sanitize(await blob.text());
            setIsDomPurified(true);
          } else {
            setIsAutoOpenFormat(false);
            blobDataType = BlobDataType.IMAGE;
            finalResp = window.URL.createObjectURL(await res.blob());
          }
        } else if (contentType?.includes("audio")) {
          setIsAutoOpenFormat(false);
          finalResp = window.URL.createObjectURL(blob);
          blobDataType = BlobDataType.AUDIO;
        } else if (contentType?.includes("application/pdf")) {
          const pdfObject = window.URL.createObjectURL(blob);
          finalResp = pdfObject;
          blobDataType = BlobDataType.PDF;
          window.open(pdfObject, "_blank");
          setIsAutoOpenFormat(true);
        } else if (contentType?.includes("application/json")) {
          setIsAutoOpenFormat(false);
          const purifiedJSONStr = DOMPurify.sanitize(await blob.text());
          finalResp = JSON.stringify(JSON.parse(purifiedJSONStr), null, 4);
          setIsDomPurified(true);
        } else if (contentType?.includes("text/plain")) {
          setIsAutoOpenFormat(false);
          finalResp = DOMPurify.sanitize(await blob.text());
          setIsDomPurified(true);
        } else if (contentType?.includes("video/mp4")) {
          setIsAutoOpenFormat(false);
          const videoObject = window.URL.createObjectURL(blob);
          finalResp = videoObject;
          blobDataType = BlobDataType.VIDEO;
        } else if (contentType?.includes("text/html")) {
          const blobUrl = URL.createObjectURL(blob);
          window.open(blobUrl, "_blank");
        } else {
          setIsAutoOpenFormat(false);
          // we don't support that format
          finalResp = "Sorry, this file type is currently not supported by the Explorer File Viewer. The file type is: " + contentType;
        }
      } else {
        console.error(res.status + " " + res.statusText);
        toastClosableError(res.status + " " + res.statusText);
      }

      const viewDataPayload: ExtendedViewDataReturnType = {
        data: finalResp,
        contentType: contentType!,
        blobDataType,
      };

      setViewDataRes(viewDataPayload);
      setIsFetchingDataMarshal(false);
    } catch (err) {
      toastClosableError((err as Error).message);
    }
  }

  if ((isLoadingMvx && addressMvx) || (isLoadingSol && publicKeySol)) {
    return <Loader />;
  }

  return (
    <>
      <HelmetPageMeta title="Collected Itheum Data NFTs" shortTitle="Collected Itheum Data NFTs" desc="Your collected Itheum Data NFTs" />

      {addressMvx && (
        <HeaderComponent
          pageTitle={"My MultiversX Data NFTs"}
          hasImage={false}
          modalContentClass="mt-2 flex justify-center md:block"
          pageSubtitle={mvxNfts.length > 0 ? `You have collected ${mvxNfts.length} Data NFTs` : undefined}>
          {shownMvxDataNfts.length > 0 ? (
            <>
              <div className="md:grid md:grid-cols-3 3xl:grid-cols-5">
                {shownMvxDataNfts.map((dataNft, index) => (
                  <MvxDataNftCard
                    key={index}
                    index={index}
                    dataNft={dataNft}
                    isLoading={isLoadingMvx}
                    owned={true}
                    viewData={viewDataMvx}
                    isWallet={true}
                    showBalance={true}
                    modalContent={
                      <>
                        {isDomPurified && (
                          <div className="p-4 bg-[#fff3cd] text-[#ae9447] text-sm" role="alert">
                            <strong>⚠️ Important:</strong> For your protection, this content has been automatically filtered locally in your browser for
                            potential common security risks; unfortunately, this may mean that even valid and safe content may appear different from the
                            original format. <strong>If you know and trust this Data Creator,</strong> then it is advisable to the use the Data DEX "Wallet"
                            feature to download the original file (at your own risk). <br />
                            <br />
                            Alternatively, <strong>as the safest option, only use official apps in the Apps Marketplace</strong> (accessible via the Header Menu
                            in this Explorer app). These apps automatically and safely visualize Data NFTs from verified Data Creators.
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
                                    This Data NFT content was automatically opened in a new browser window. If your browser is prompting you to allow popups,
                                    please select <b>Always allow pop-ups</b> and then close this and click on <b>View Data</b> again.
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
                ))}
              </div>
            </>
          ) : (
            <h4 className="no-items">
              <div>
                You do not own any Data NFTs yet. Browse and procure Data NFTs by visiting the
                <a href={`${MARKETPLACE_DETAILS_PAGE}`} className="ml-2 address-link underline hover:no-underline" target="_blank">
                  Data DEX
                </a>
              </div>
            </h4>
          )}
        </HeaderComponent>
      )}

      {publicKeySol && (
        <HeaderComponent
          pageTitle={"My Solana Data NFTs"}
          hasImage={false}
          modalContentClass="mt-2 flex justify-center md:block"
          pageSubtitle={solNfts.length > 0 ? `You have collected ${solNfts.length} Data NFTs` : undefined}>
          {shownSolDataNfts.length > 0 ? (
            <>
              <div className="md:grid md:grid-cols-3 3xl:grid-cols-5">
                {shownSolDataNfts.map((dataNft, index) => (
                  <SolDataNftCard
                    key={dataNft.id}
                    index={index}
                    dataNft={dataNft}
                    isLoading={isLoadingSol}
                    owned={true}
                    viewData={viewDataSol}
                    isWallet={true}
                    modalContent={
                      <>
                        {isDomPurified && (
                          <div className="p-4 bg-[#fff3cd] text-[#ae9447] text-sm" role="alert">
                            <strong>⚠️ Important:</strong> For your protection, this content has been automatically filtered locally in your browser for
                            potential common security risks; unfortunately, this may mean that even valid and safe content may appear different from the
                            original format. <strong>If you know and trust this Data Creator,</strong> then it is advisable to the use the Data DEX "Wallet"
                            feature to download the original file (at your own risk). <br />
                            <br />
                            Alternatively, <strong>as the safest option, only use official apps in the Apps Marketplace</strong> (accessible via the Header Menu
                            in this Explorer app). These apps automatically and safely visualize Data NFTs from verified Data Creators.
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
                                    This Data NFT content was automatically opened in a new browser window. If your browser is prompting you to allow popups,
                                    please select <b>Always allow pop-ups</b> and then close this and click on <b>View Data</b> again.
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
                ))}
              </div>
            </>
          ) : (
            <div className="w-[100%]">
              <div className="text-center md:text-left">
                You do not own any Data NFTs yet. Browse and procure Data NFTs by visiting
                <a href={DRIP_PAGE} className="ml-2 address-link underline hover:no-underline" target="_blank">
                  DRiP Haus
                </a>
              </div>
            </div>
          )}
        </HeaderComponent>
      )}

      <div className="m-auto mb-5">
        {/* MVX Data NFTs */}
        {addressMvx && numberOfMvxNftsShown < mvxNfts.length && (
          <Button
            className="border-0 text-background rounded-lg font-medium tracking-tight base:!text-sm md:!text-base hover:opacity-80 hover:text-black"
            onClick={() => {
              setNumberOfMvxNftsShown(numberOfMvxNftsShown + SHOW_NFTS_STEP);
            }}
            disabled={false}>
            Load more
          </Button>
        )}

        {/* Solana Data NFTs */}
        {publicKeySol && numberOfSolNftsShown < solNfts.length && (
          <Button
            className="border-0 text-background rounded-lg font-medium tracking-tight base:!text-sm md:!text-base hover:opacity-80 hover:text-black"
            onClick={() => {
              setNumberOfSolNftsShown(numberOfSolNftsShown + SHOW_NFTS_STEP);
            }}
            disabled={false}>
            Load more
          </Button>
        )}
      </div>
    </>
  );
};
