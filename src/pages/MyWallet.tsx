import React, { useEffect, useState } from "react";
import { DataNft, ViewDataReturnType } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import * as DOMPurify from "dompurify";
import SVG from "react-inlinesvg";
import imgGuidePopup from "assets/img/guide-unblock-popups.png";

import { DataNftCard, Loader } from "components";
import { MARKETPLACE_DETAILS_PAGE } from "config";
import { useGetAccount, useGetPendingTransactions } from "hooks";
import { BlobDataType } from "libs/types";
import { modalStyles } from "libs/ui";
import { nativeAuthOrigins, toastError } from "libs/utils";
import { HeaderComponent } from "../components/Layout/HeaderComponent";

interface ExtendedViewDataReturnType extends ViewDataReturnType {
  blobDataType: BlobDataType;
}

export const MyWallet = () => {
  const { address } = useGetAccount();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { tokenLogin } = useGetLoginInfo();
  const [dataNftCount, setDataNftCount] = useState<number>(0);
  const [dataNfts, setDataNfts] = useState<DataNft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewDataRes, setViewDataRes] = useState<ExtendedViewDataReturnType>();
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
  const [isAutoOpenFormat, setIsAutoOpenFormat] = useState<boolean>(false);
  const [isDomPurified, setIsDomPurified] = useState<boolean>(false);

  useEffect(() => {
    if (!hasPendingTransactions) {
      fetchData();
    }
  }, [hasPendingTransactions]);

  function openModal() {
    setIsModalOpened(true);
  }

  function closeModal() {
    setIsModalOpened(false);
    setViewDataRes(undefined);
    setIsAutoOpenFormat(false);
    setIsDomPurified(false);
  }

  async function fetchData() {
    setIsLoading(true);

    const _dataNfts = await DataNft.ownedByAddress(address);
    setDataNftCount(_dataNfts.length);
    setDataNfts(_dataNfts);

    setIsLoading(false);
  }

  async function viewNormalData(index: number) {
    if (!(index >= 0 && index < dataNfts.length)) {
      toastError("Data is not loaded");
      return;
    }

    setIsFetchingDataMarshal(true);
    setViewDataRes(undefined);
    openModal();

    const dataNft = dataNfts[index];
    let res: any;
    if (!(tokenLogin && tokenLogin.nativeAuthToken)) {
      throw Error("No nativeAuth token");
    }

    const arg = {
      mvxNativeAuthOrigins: nativeAuthOrigins(),
      mvxNativeAuthMaxExpirySeconds: 3000,
      fwdHeaderMapLookup: {
        "authorization": `Bearer ${tokenLogin.nativeAuthToken}`,
      },
    };

    res = await dataNft.viewDataViaMVXNativeAuth(arg);

    let blobDataType = BlobDataType.TEXT;

    if (!res.error) {
      if (res.contentType.search("image") >= 0) {
        if (res.contentType == "image/svg+xml") {
          blobDataType = BlobDataType.SVG;
          res.data = DOMPurify.sanitize(await (res.data as Blob).text());
          setIsDomPurified(true);
        } else {
          blobDataType = BlobDataType.IMAGE;
          res.data = window.URL.createObjectURL(new Blob([res.data], { type: res.contentType }));
        }
      } else if (res.contentType.search("audio") >= 0) {
        // res.data = window.URL.createObjectURL(new Blob([res.data], { type: res.contentType }));
        // blobDataType = BlobDataType.AUDIO;
        const purifiedJSONStr = DOMPurify.sanitize(await (res.data as Blob).text());
        res.data = JSON.stringify(JSON.parse(purifiedJSONStr), null, 4);
        setIsDomPurified(true);
      } else if (res.contentType.search("application/pdf") >= 0) {
        const pdfObject = window.URL.createObjectURL(new Blob([res.data], { type: res.contentType }));
        res.data = pdfObject;
        blobDataType = BlobDataType.PDF;
        window.open(pdfObject, "_blank");
        setIsAutoOpenFormat(true);
      } else if (res.contentType.search("application/json") >= 0) {
        const purifiedJSONStr = DOMPurify.sanitize(await (res.data as Blob).text());
        res.data = JSON.stringify(JSON.parse(purifiedJSONStr), null, 4);
        setIsDomPurified(true);
      } else if (res.contentType.search("text/plain") >= 0) {
        res.data = DOMPurify.sanitize(await (res.data as Blob).text());
        setIsDomPurified(true);
      } else {
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
    <HeaderComponent pageTitle={"My Data NFT's"} hasImage={false} pageSubtitle={"My Data NFTs"} dataNftCount={dataNftCount}>
      {dataNfts.length > 0 ? (
        dataNfts.map((dataNft, index) => (
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
                  <div className="alert alert-warning" role="alert">
                    <strong>⚠️ Important:</strong> For your protection, this content has been automatically filtered locally in your browser for potential
                    common security risks; unfortunately, this may mean that even valid and safe content may appear different from the original format.{" "}
                    <strong>If you know and trust this Data Creator,</strong> then it is advisable to the use the Data DEX "Wallet" feature to download the
                    original file (at your own risk). <br />
                    <br />
                    Alternatively, <strong>as the safest option, only use official apps in the App Marketplace</strong> (accessible via the Header Menu in this
                    Explorer app). These apps automatically and safely visualize Data NFTs from verified Data Creators.
                  </div>
                )}

                {isFetchingDataMarshal ? (
                  <div
                    className="d-flex flex-column align-items-center justify-content-center"
                    style={{
                      minWidth: "24rem",
                      maxWidth: "100% !important",
                      minHeight: "40rem",
                      maxHeight: "80vh",
                    }}>
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
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "30rem" }}>
                      <audio controls autoPlay src={viewDataRes.data} />
                    </div>
                  ) : viewDataRes.blobDataType === BlobDataType.SVG ? (
                    <SVG src={viewDataRes.data} style={{ width: "100%", height: "auto" }} />
                  ) : (
                    <div className="p-2">
                      {(isAutoOpenFormat && (
                        <>
                          <p className="p-2">
                            This Data NFT content was automatically opened in a new browser window. If your browser is prompting you to allow popups, please
                            select <b>Always allow pop-ups</b> and then close this and click on <b>View Data</b> again.
                          </p>
                          <img src={imgGuidePopup} style={{ width: "250px", height: "auto", borderRadius: "5px" }} />
                          <button
                            className="btn btn-outline-primary mt-3"
                            onClick={() => {
                              if (viewDataRes.data) {
                                window.open(viewDataRes.data as string, "_blank");
                              }
                            }}>
                            Or, manually open the file by clicking here
                          </button>
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
            <a
              href={`${MARKETPLACE_DETAILS_PAGE}` + (tokenLogin && tokenLogin.nativeAuthToken) ? `/?accessToken=${tokenLogin?.nativeAuthToken}` : ""}
              className="ml-2 address-link text-decoration-none"
              target="_blank">
              Data DEX
            </a>
          </div>
        </h4>
      )}
    </HeaderComponent>
  );
};
