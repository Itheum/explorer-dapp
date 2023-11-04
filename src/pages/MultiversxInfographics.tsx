import React, { useEffect, useState } from "react";
import { DataNft, ViewDataReturnType } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { ModalBody } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { IoClose } from "react-icons/io5";
import SVG from "react-inlinesvg";
import Modal from "react-modal";
import { MULTIVERSX_INFOGRAPHICS_TOKENS } from "appsConfig";
import headerHero from "assets/img/custom-app-header-infographs.png";
import { DataNftCard, Loader } from "components";
import { useGetAccount, useGetPendingTransactions } from "hooks";
import { BlobDataType } from "libs/types";
import { modalStylesFull } from "libs/ui";
import { nativeAuthOrigins, toastError } from "libs/utils";
import { HeaderComponent } from "../components/Layout/HeaderComponent";

interface ExtendedViewDataReturnType extends ViewDataReturnType {
  blobDataType: BlobDataType;
}

export const MultiversxInfographics = () => {
  const { address } = useGetAccount();
  const { tokenLogin } = useGetLoginInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();

  const [dataNfts, setDataNfts] = useState<DataNft[]>([]);
  const [flags, setFlags] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  const [owned, setOwned] = useState<boolean>(false);
  const [viewDataRes, setViewDataRes] = useState<ExtendedViewDataReturnType>();
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

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

  function openModal() {
    setIsModalOpened(true);
  }

  function closeModal() {
    setIsModalOpened(false);
    setViewDataRes(undefined);
  }

  async function fetchDataNfts() {
    setIsLoading(true);

    const _nfts: DataNft[] = await DataNft.createManyFromApi(
      MULTIVERSX_INFOGRAPHICS_TOKENS.map((v) => ({ nonce: v.nonce, tokenIdentifier: v.tokenIdentifier }))
    );
    setDataNfts(_nfts);

    setIsLoading(false);
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
        console.log("arg", arg);

        res = await dataNft.viewDataViaMVXNativeAuth(arg);
        console.log("res", res);

        let blobDataType = BlobDataType.TEXT;

        if (!res.error) {
          if (res.contentType.search("image") >= 0) {
            if (res.contentType == "image/svg+xml") {
              blobDataType = BlobDataType.SVG;
              res.data = await (res.data as Blob).text();
            } else {
              blobDataType = BlobDataType.IMAGE;
              res.data = window.URL.createObjectURL(new Blob([res.data], { type: res.contentType }));
            }
          } else if (res.contentType.search("audio") >= 0) {
            res.data = window.URL.createObjectURL(new Blob([res.data], { type: res.contentType }));
            blobDataType = BlobDataType.AUDIO;
          } else if (res.contentType.search("application/pdf") >= 0) {
            const pdfObject = window.URL.createObjectURL(new Blob([res.data], { type: res.contentType }));
            res.data = "PDF opened in new tab";
            blobDataType = BlobDataType.PDF;
            window.open(pdfObject, "_blank");
            closeModal();
          } else {
            res.data = await (res.data as Blob).text();
            res.data = JSON.stringify(JSON.parse(res.data), null, 4);
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
      } else {
        openModal();
      }
    } catch (err) {
      console.error(err);
      toastError((err as Error).message);
      closeModal();
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
      pageTitle={"MultiversX Infographics"}
      hasImage={true}
      imgSrc={headerHero}
      altImageAttribute={"mvxInfographics"}
      pageSubtitle={"Data NFTs that Unlock this App"}
      dataNftCount={dataNfts.length}>
      {dataNfts.length > 0 ? (
        dataNfts.map((dataNft, index) => (
          <DataNftCard key={index} index={index} dataNft={dataNft} isLoading={isLoading} owned={flags[index]} viewData={viewData} />
        ))
      ) : (
        <h3 className="text-center text-white">No DataNFT</h3>
      )}

      <Modal isOpen={isModalOpened} onRequestClose={closeModal} style={modalStylesFull} ariaHideApp={false} shouldCloseOnOverlayClick={false}>
        <div style={{ height: "3rem" }}>
          <div
            style={{
              float: "right",
              cursor: "pointer",
              fontSize: "2rem",
            }}
            onClick={closeModal}>
            <IoClose />
          </div>
        </div>
        <ModalHeader>
          <h4 className="text-center font-title font-weight-bold">MultiversX Infographics</h4>
        </ModalHeader>
        <ModalBody
          style={{
            minWidth: "26rem",
            minHeight: "36rem",
            maxHeight: "80vh",
            overflowY: "scroll",
          }}>
          {!owned ? (
            <div
              className="d-flex flex-column align-items-center justify-content-center"
              style={{
                minWidth: "24rem",
                maxWidth: "50vw",
                minHeight: "40rem",
                maxHeight: "80vh",
              }}>
              <h4 className="mt-3 font-title">You do not own this Data NFT</h4>
              <h6>(Buy the Data NFT from the marketplace to unlock the data)</h6>
            </div>
          ) : isFetchingDataMarshal ? (
            <div
              className="d-flex flex-column align-items-center justify-content-center"
              style={{
                minHeight: "40rem",
              }}>
              <div>
                <Loader noText />
                <p className="text-center font-weight-bold">{"Loading..."}</p>
              </div>
            </div>
          ) : (
            <>
              {viewDataRes &&
                !viewDataRes.error &&
                (viewDataRes.blobDataType === BlobDataType.IMAGE ? (
                  <img src={viewDataRes.data} style={{ width: "100%", height: "auto" }} />
                ) : viewDataRes.blobDataType === BlobDataType.AUDIO ? (
                  <div className="d-flex justify-content-center align-items-center" style={{ height: "30rem" }}>
                    <audio controls autoPlay src={viewDataRes.data} />
                  </div>
                ) : viewDataRes.blobDataType === BlobDataType.SVG ? (
                  <SVG src={viewDataRes.data} preProcessor={(code) => preProcess(code)} style={{ width: "100%", height: "auto" }} />
                ) : (
                  <p className="p-2" style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
                    {viewDataRes.data}
                  </p>
                ))}
            </>
          )}
        </ModalBody>
      </Modal>
    </HeaderComponent>
  );
};
