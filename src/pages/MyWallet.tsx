import React, { useEffect, useState } from "react";
import { DataNft, ViewDataReturnType } from "@itheum/sdk-mx-data-nft";
import { Address, SignableMessage } from "@multiversx/sdk-core/out";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { useGetLastSignedMessageSession } from "@multiversx/sdk-dapp/hooks/signMessage/useGetLastSignedMessageSession";
import { useGetSignMessageInfoStatus } from "@multiversx/sdk-dapp/hooks/signMessage/useGetSignedMessageStatus";
import * as DOMPurify from "dompurify";
import { ModalBody } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import SVG from "react-inlinesvg";
import Modal from "react-modal";
import { useNavigate, useParams } from "react-router-dom";
import { DataNftCard, Loader, TrailBlazerModal } from "components";
import { MARKETPLACE_DETAILS_PAGE } from "config";
import { useGetAccount, useGetPendingTransactions, useSignMessage } from "hooks";
import { BlobDataType } from "libs/types";
import { modalStyles } from "libs/ui";
import { toastError } from "libs/utils";
import { sleep } from "libs/utils/legacyUtil";
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
  const { isPending: isSignMessagePending } = useGetSignMessageInfoStatus();
  const lastSignedMessageSession = useGetLastSignedMessageSession();
  console.log("isSignMessagePending", isSignMessagePending);
  console.log("lastSignedMessageSession", lastSignedMessageSession);

  const [dataNftCount, setDataNftCount] = useState<number>(0);
  const [dataNfts, setDataNfts] = useState<DataNft[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [viewDataRes, setViewDataRes] = useState<ExtendedViewDataReturnType>();
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  console.log("viewDataRes", viewDataRes);
  const [data, setData] = useState<any>();

  const [isModalOpened, setIsModalOpenend] = useState<boolean>(false);
  function openModal() {
    setIsModalOpenend(true);
  }
  function closeModal() {
    setIsModalOpenend(false);
    setData(undefined);
    setViewDataRes(undefined);
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
    if (!(index >= 0 && index < dataNfts.length)) {
      toastError("Data is not loaded");
      return;
    }

    setIsFetchingDataMarshal(true);
    setViewDataRes(undefined);
    openModal();

    const dataNft = dataNfts[index];
    const messageToBeSigned = await dataNft.getMessageToSign();

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

    const viewDataPayload: ExtendedViewDataReturnType = await obtainDataNFTData(dataNft, messageToBeSigned, signedMessage as any);

    setViewDataRes(viewDataPayload);
    setIsFetchingDataMarshal(false);
  }

  async function obtainDataNFTData(dataNft: DataNft, messageToBeSigned: string, signedMessage: SignableMessage) {
    const res = await dataNft.viewData(messageToBeSigned, signedMessage as any, true);

    let blobDataType = BlobDataType.TEXT;

    if (!res.error) {
      if (res.contentType.search("image") >= 0) {
        if (res.contentType == "image/svg+xml") {
          blobDataType = BlobDataType.SVG;
          res.data = DOMPurify.sanitize(await (res.data as Blob).text());
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
      } else if (res.contentType.search("application/json") >= 0) {
        res.data = DOMPurify.sanitize(await (res.data as Blob).text());
        res.data = JSON.stringify(JSON.parse(res.data), null, 4);
      } else if (res.contentType.search("text/plain") >= 0) {
        res.data = DOMPurify.sanitize(await (res.data as Blob).text());
      } else {
        // we don't support that format
        res.data = "Sorry, this file type is currently not supported by the Explorer File Viewer. The file type is: " + res.contentType;
      }
    } else {
      console.error(res.error);
      toastError(res.error);
    }

    return {
      ...res,
      blobDataType,
    };
  }

  async function processSignature(nonce: number, messageToBeSigned: string, signedMessage: SignableMessage) {
    try {
      setIsFetchingDataMarshal(true);
      openModal();

      const dataNft = await DataNft.createFromApi(nonce);
      const viewDataPayload: ExtendedViewDataReturnType = await obtainDataNFTData(dataNft, messageToBeSigned, signedMessage);

      setViewDataRes(viewDataPayload);
      setIsFetchingDataMarshal(false);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    const asyncFnc = async () => {
      await sleep(1); //temporary solution until we find out racing condition
      try {
        let signature = "";

        if (lastSignedMessageSession && lastSignedMessageSession.status == "signed" && lastSignedMessageSession.signature) {
          signature = lastSignedMessageSession.signature;
        } else {
          let signSessions = JSON.parse(sessionStorage.getItem("persist:sdk-dapp-signedMessageInfo") ?? "{'signedSessions':{}}");
          signSessions = JSON.parse(signSessions.signedSessions);
          console.log("signSessions", signSessions);

          // find the first 'signed' session
          for (const session of Object.values(signSessions) as any[]) {
            if (session.status && session.status == "signed" && session.signature) {
              signature = session.signature;
              break;
            }
          }
        }

        if (!signature) {
          throw Error("Signature is empty");
        }

        const signedMessage = new SignableMessage({
          address: new Address(address),
          message: Buffer.from(targetMessageToBeSigned || "", "ascii"),
          signature: Buffer.from(signature, "hex"),
          signer: loginMethod,
        });
        await processSignature(Number(targetNonce), targetMessageToBeSigned || "", signedMessage);
      } catch (e) {
        console.error(e);
      } finally {
        navigate(routeNames.mywallet);
      }
    };
    if (isWebWallet && !!targetNonce && !!targetMessageToBeSigned && !isSignMessagePending) {
      asyncFnc();
    }
  }, [isWebWallet, isSignMessagePending]);

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
                  viewData={viewNormalData}
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
    </div>
  );
};
