import React, { useEffect, useState } from "react";
import { DataNft, ViewDataReturnType } from "@itheum/sdk-mx-data-nft";
import { Address, SignableMessage } from "@multiversx/sdk-core/out";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { useGetLastSignedMessageSession } from "@multiversx/sdk-dapp/hooks/signMessage/useGetLastSignedMessageSession";
import { ModalBody } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import SVG from "react-inlinesvg";
import Modal from "react-modal";
import { useNavigate, useParams } from "react-router-dom";
import { DataNftCard, Loader, TrailBlazerModal } from "components";
import { TRAILBLAZER_NONCES, MARKETPLACE_DETAILS_PAGE } from "config";
import { useGetAccount, useGetPendingTransactions, useSignMessage } from "hooks";
import { getMessageSignatureFromWalletUrl } from "libs/mvx";
import { BlobDataType } from "libs/types";
import { modalStyles } from "libs/ui";
import { toastError } from "libs/utils";
import { routeNames } from "routes";

interface ExtendedViewDataReturnType extends ViewDataReturnType {
  blobDataType: BlobDataType;
}

export const MyWallet = () => {
  const { address } = useGetAccount();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { signMessage } = useSignMessage();
  const { loginMethod } = useGetLoginInfo();
  const navigate = useNavigate();
  const isWebWallet = loginMethod == "wallet";
  const { targetNonce, targetMessageToBeSigned } = useParams();
  const lastSignedMessageSession = useGetLastSignedMessageSession();

  const [dataNftCount, setDataNftCount] = useState<number>(0);
  const [dataNfts, setDataNfts] = useState<DataNft[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [viewDataRes, setViewDataRes] = useState<ExtendedViewDataReturnType>();
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  console.log("viewDataRes", viewDataRes);
  const [data, setData] = useState<any>();
  const [isTrailBlazer, setIsTrailBlazer] = useState<boolean>(false);
  console.log("isTrailBlazer", isTrailBlazer);

  const [isModalOpened, setIsModalOpenend] = useState<boolean>(false);
  function openModal() {
    setIsModalOpenend(true);
  }
  function closeModal() {
    setIsModalOpenend(false);
    setData(undefined);
    setViewDataRes(undefined);
    setIsTrailBlazer(false);
  }

  async function fetchData() {
    setIsLoading(true);

    const _dataNfts = await DataNft.ownedByAddress(address);
    console.log("_dataNfts", _dataNfts);
    setDataNftCount(_dataNfts.length);
    setDataNfts(_dataNfts);

    setIsLoading(false);
  }

  useEffect(() => {
    if (!hasPendingTransactions) {
      fetchData();
    }
  }, [hasPendingTransactions]);

  async function viewNormalData(index: number) {
    if (isWebWallet) {
      toast.error(
        <div>
          Web Wallet is yet to be supported as an option to <b>View Data</b> on this page (it's coming very soon). In the meantime: <br />
          <br />
          <div>
            1) You can use Web Wallet to <b>View Data</b> in <b>Itheum Explorer</b> by using a custom app in the <b>App Marketplace</b> section by{" "}
            <a href="/" target="_blank">
              heading here
            </a>
          </div>
          <br />
          <div>
            2) Or head over to the <b>Data DEX</b> at{" "}
            <a href="https://datadex.itheum.io" target="_blank">
              datadex.itheum.io
            </a>
            , login, and then navigate to the <b>Wallet</b> section to view and open your Data NFTs.
          </div>
        </div>,
        {
          position: "top-right",
        }
      );
      return;
    }
    if (!(index >= 0 && index < dataNfts.length)) {
      toastError("Data is not loaded");
      return;
    }

    setIsFetchingDataMarshal(true);
    setViewDataRes(undefined);
    openModal();

    const dataNft = dataNfts[index];
    const messageToBeSigned = await dataNft.getMessageToSign();
    console.log("messageToBeSigned", messageToBeSigned);
    const signedMessage = await signMessage({ message: messageToBeSigned });
    console.log("signedMessage", signedMessage);
    if (!signedMessage) {
      toastError("Wallet signing failed.");
      return;
    }

    const res = await dataNft.viewData(messageToBeSigned, signedMessage as any, true);
    console.log("viewData", res);

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
      } else {
        res.data = await (res.data as Blob).text();
        res.data = JSON.stringify(JSON.parse(res.data), null, 4);
      }
    } else {
      console.error(res.error);
      toastError(res.error);
    }

    setViewDataRes({
      ...res,
      blobDataType,
    });

    setIsFetchingDataMarshal(false);
  }

  async function viewTrailBlazerData(index: number) {
    console.log("viewTrailBlazerData");
    try {
      if (!(index >= 0 && index < dataNfts.length)) {
        toastError("Data is not loaded");
        return;
      }

      setIsFetchingDataMarshal(true);
      setIsTrailBlazer(true);
      openModal();

      const dataNft = dataNfts[index];

      const messageToBeSigned = await dataNft.getMessageToSign();
      console.log("messageToBeSigned", messageToBeSigned);

      // const signedMessage = await signMessage({ message: messageToBeSigned });
      // console.log("signedMessage", signedMessage);
      const callbackRoute = `${window.location.href}/${dataNft.nonce}/${messageToBeSigned}`;
      const signedMessage = await signMessage({
        message: messageToBeSigned,
        callbackRoute: isWebWallet ? callbackRoute : undefined,
      });
      if (isWebWallet) return;
      if (!signedMessage) {
        toastError("Wallet signing failed.");
        return;
      }

      const res = await dataNft.viewData(messageToBeSigned, signedMessage as any);
      res.data = await (res.data as Blob).text();
      res.data = JSON.parse(res.data);

      console.log("viewData", res);
      console.log(JSON.stringify(res.data, null, 4));

      setData(res.data && res.data.data ? res.data.data.reverse() : undefined);
      setIsFetchingDataMarshal(false);
    } catch (err) {
      console.error(err);
      toastError((err as Error).message);
      closeModal();
      setIsFetchingDataMarshal(false);
    }
  }

  async function processSignature(nonce: number, messageToBeSigned: string, signedMessage: SignableMessage) {
    try {
      setIsFetchingDataMarshal(true);
      openModal();

      const dataNft = await DataNft.createFromApi(nonce);
      const res = await dataNft.viewData(messageToBeSigned, signedMessage as any);
      res.data = await (res.data as Blob).text();
      res.data = JSON.parse(res.data);

      console.log("viewData", res);
      console.log(JSON.stringify(res.data, null, 4));

      setData(res.data.data);
      setIsFetchingDataMarshal(false);

      if (isWebWallet) {
        navigate(routeNames.mywallet);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (isWebWallet && !!targetNonce && !!targetMessageToBeSigned && lastSignedMessageSession) {
      (async () => {
        console.log("Sign", {
          isWebWallet,
          targetNonce,
          targetMessageToBeSigned,
        });
        const signature = lastSignedMessageSession.signature ?? '';
        const signedMessage = new SignableMessage({
          address: new Address(address),
          message: Buffer.from(targetMessageToBeSigned, "ascii"),
          signature: Buffer.from(signature, "hex"),
          signer: loginMethod,
        });

        setIsTrailBlazer(true);
        await processSignature(Number(targetNonce), targetMessageToBeSigned, signedMessage);
      })();
    }
  }, [isWebWallet, targetNonce]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="d-flex flex-fill justify-content-center container py-4 c-my-wallet">
      <div className="row w-100">
        <div className="col-12 mx-auto">
          {dataNftCount > 0 && <h4 className="mt-5 text-center count-title">My Data NFTs: {dataNftCount}</h4>}

          <div className="row mt-5">
            {dataNfts.length > 0 ? (
              dataNfts.map((dataNft, index) => (
                <DataNftCard
                  key={index}
                  index={index}
                  dataNft={dataNft}
                  isLoading={isLoading}
                  owned={true}
                  viewData={TRAILBLAZER_NONCES.indexOf(dataNft.nonce) >= 0 ? viewTrailBlazerData : viewNormalData}
                  isWallet={true}
                  showBalance={true}
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
          </div>
        </div>
      </div>

      {isTrailBlazer || targetNonce ? (
        <TrailBlazerModal isModalOpened={isModalOpened} closeModal={closeModal} owned={true} isFetchingDataMarshal={isFetchingDataMarshal} data={data} />
      ) : (
        <Modal isOpen={isModalOpened} onRequestClose={closeModal} style={modalStyles} ariaHideApp={false} shouldCloseOnOverlayClick={false}>
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
            <h4 className="text-center font-title font-weight-bold">File Viewer</h4>
          </ModalHeader>
          <ModalBody
            style={{
              minWidth: "26rem",
              minHeight: "36rem",
              maxHeight: "80vh",
              overflowY: "auto",
            }}>
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
                  <p className="text-center font-weight-bold">
                    {["ledger", "walletconnectv2", "extra"].includes(loginMethod) ? "Please sign the message using xPortal or Ledger" : "Loading..."}
                  </p>
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
                <p className="p-2" style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
                  {viewDataRes.data}
                </p>
              ))
            )}
          </ModalBody>
        </Modal>
      )}
    </div>
  );
};
