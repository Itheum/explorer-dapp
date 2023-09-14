import React, { useEffect, useState } from "react";
import { DataNft, ViewDataReturnType } from "@itheum/sdk-mx-data-nft";
import { Address, SignableMessage } from "@multiversx/sdk-core/out";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { useGetLastSignedMessageSession } from "@multiversx/sdk-dapp/hooks/signMessage/useGetLastSignedMessageSession";
import { useGetSignMessageInfoStatus } from "@multiversx/sdk-dapp/hooks/signMessage/useGetSignedMessageStatus";
import { useSignMessage } from "@multiversx/sdk-dapp/hooks/signMessage/useSignMessage";
import { ModalBody } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { IoClose } from "react-icons/io5";
import Modal from "react-modal";
import { useNavigate, useParams } from "react-router-dom";
import headerHero from "assets/img/custom-app-header-infographs.png";
import { DataNftCard, Loader } from "components";
import { MULTIVERSX_INFOGRAPHICS_NONCES, MUSICX_NONCES } from "config";
import { useGetAccount, useGetPendingTransactions } from "hooks";
import { BlobDataType } from "libs/types";
import { modalStylesFull } from "libs/ui";
import { toastError } from "libs/utils";
import { sleep } from "libs/utils/legacyUtil";
import { routeNames } from "routes";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "./MultiversxInfographics.scss";
import { HeaderComponent } from "../../../components/Layout/HeaderComponent";
import { Button } from "../../../libComponents/Button";

import DEFAULT_SONG_IMAGE from "assets/img/audio-player-image.png";
import { AudioPlayer } from "components/AudioPlayer";

interface ExtendedViewDataReturnType extends ViewDataReturnType {
  blobDataType: BlobDataType;
}

// maybe add audio type - type PDFFile = string | File | null;

export const MusicX = () => {
  const { address } = useGetAccount();
  const { loginMethod } = useGetLoginInfo();

  ///audioPlayer nested stream
  const { tokenLogin } = useGetLoginInfo();
  const mvxNativeAuthOrigins = "http://localhost:3000";
  const mvxNativeAuthMaxExpirySeconds = 3000;

  const { hasPendingTransactions } = useGetPendingTransactions();
  const { signMessage } = useSignMessage();
  const { isPending: isSignMessagePending } = useGetSignMessageInfoStatus();
  const lastSignedMessageSession = useGetLastSignedMessageSession();
  const [dataNfts, setDataNfts] = useState<DataNft[]>([]);
  const [flags, setFlags] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  const [owned, setOwned] = useState<boolean>(false);
  const [viewDataRes, setViewDataRes] = useState<ExtendedViewDataReturnType>();
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
  const navigate = useNavigate();
  const isWebWallet = loginMethod === "wallet";
  const { targetNonce, targetMessageToBeSigned } = useParams();
  const audio = {};

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
        navigate(routeNames.multiversxinfographics);
      }
    };
    if (isWebWallet && !!targetNonce && !!targetMessageToBeSigned && !isSignMessagePending) {
      asyncFnc();
    }
  }, [isWebWallet, isSignMessagePending]);

  function openModal() {
    setIsModalOpened(true);
  }

  function closeModal() {
    setIsModalOpened(false);
    setViewDataRes(undefined);
    // set audio to null
  }

  ///get the nfts that are able to open musicX app
  async function fetchDataNfts() {
    setIsLoading(true);

    const _nfts: DataNft[] = await DataNft.createManyFromApi(MUSICX_NONCES);
    setDataNfts(_nfts);

    setIsLoading(false);
  }

  ///fetch the nfts owned by the logged in address and if the user has any of them set flag to true,
  // on those can be used view data
  async function fetchMyNfts() {
    const _dataNfts = await DataNft.ownedByAddress(address);
    const _flags = [];

    for (const cnft of dataNfts) {
      const matches = _dataNfts.filter((mnft) => cnft.nonce === mnft.nonce);
      _flags.push(matches.length > 0);
    }

    setFlags(_flags);
  }

  /// after pressing the button to view data do this
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
        ///HERE ADD THE NEW FUNCTION
        const dataNft = dataNfts[index]; ///THIS COULD BE An ALBUM NFT
        const messageToBeSigned = await dataNft.getMessageToSign();

        const callbackRoute = `${window.location.href}/${dataNft.nonce}/${messageToBeSigned}`;
        const signedMessage = await signMessage({
          ///no need of this anymore
          message: messageToBeSigned,
          callbackRoute: isWebWallet ? callbackRoute : undefined,
        });
        if (isWebWallet) return;
        if (!signedMessage) {
          toastError("Wallet signing failed.");
          return;
        }

        // just get the res form marshal //
        const viewDataPayload: ExtendedViewDataReturnType = await obtainDataNFTData(dataNft, messageToBeSigned, signedMessage as any);

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

  //this should be te answer from marshall
  async function obtainDataNFTData(dataNft: DataNft, messageToBeSigned: string, signedMessage: SignableMessage) {
    //if I have stream as true i dont need anymore the headers?

    const res = await dataNft.viewData(messageToBeSigned, signedMessage as any, true);
    /*.viewDataViaMVXNativeAuth({
        mvxNativeAuthOrigins: ["http://localhost:3000"],
        mvxNativeAuthMaxExpirySeconds: 3000,
        fwdHeaderMapLookup: {
        "authorization": `Bearer ${tokenLogin?.nativeAuthToken}`,
        },
        });
        x-amz-meta-marshal-deep-fetch: 1 // this is set in mareshal 
        */
    let blobDataType = BlobDataType.TEXT;

    if (!res.error) {
      const pdfObject = window.URL.createObjectURL(new Blob([res.data], { type: res.contentType }));
      res.data = "PDF opened in new tab";
      blobDataType = BlobDataType.PDF;
      // window.open(pdfObject, "_blank");

      // setFile(pdfObject);
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
      setOwned(true);
      openModal();

      const dataNft = await DataNft.createFromApi(nonce);
      const viewDataPayload: ExtendedViewDataReturnType = await obtainDataNFTData(dataNft, messageToBeSigned, signedMessage);

      setViewDataRes(viewDataPayload);
      setIsFetchingDataMarshal(false);
    } catch (err) {
      console.error(err);
    }
  }

  function onAUdioLoadSuccess() {
    return;
  }

  const dataMarshalResponse = {
    "data_stream": {
      "name": "tokentunes:musiverse:musicx",
      "creator": "Manu",
      "created_on": "2023-05-22T05:37:17Z",
      "last_modified_on": "2023-06-10T14:00:19Z",
      "marshalManifest": {
        "totalItems": 3,
        "nestedStream": true,
      },
    },
  };
  ///TODO
  //ask about nonces from config file, is any minted ?
  //  createManyFromApi?
  //createManyFromApi updated to allow for multiple data NFT collections.
  //e.g. you can send a nonce array AND an optional custom collection string to locate these nonces. This is to make early support for "Itheum enterprise" launching soon
  // ask about doc is ok to continue like that?  ?
  // ASK if this should not be set to true:  nativeAuth: true, // optional
  //ASK COMMONPROPS SHOULD BE CHANGED ?

  return (
    <HeaderComponent
      pageTitle={"MusicX"}
      hasImage={true}
      imgSrc={DEFAULT_SONG_IMAGE}
      altImageAttribute={"MusicX application"}
      pageSubtitle={"Data NFTs that Unlock this App"}
      dataNftCount={dataNfts.length}>
      {dataNfts.length > 0 ? (
        dataNfts.map((dataNft, index) => (
          <DataNftCard key={index} index={index} dataNft={dataNft} isLoading={isLoading} owned={flags[index]} viewData={viewData} />
        ))
      ) : (
        <h3 className="text-center text-white">No DataNFT</h3>
      )}

      <Modal
        isOpen={isModalOpened}
        onRequestClose={closeModal}
        className="absolute overflow-y-scroll scrollbar !w-[80%] !top-[50%] !left-[50%] !right-auto !bottom-auto !-mr-[50%] !-translate-x-[50%] !-translate-y-[50%] !max-h-[79vh] !bg-background !shadow-md  !shadow-foreground rounded-2xl"
        style={modalStylesFull}
        ariaHideApp={false}
        shouldCloseOnOverlayClick={false}>
        <div className="sticky-top flex flex-row justify-between backdrop-blur bg-background/60">
          <ModalHeader className="border-0">
            <h2 className="text-foreground p-3 text-center">MusicX</h2>
          </ModalHeader>
          <div className="flex flex-col items-end gap-6 h-[6rem]">
            <div className="flex justify-center cursor-pointer text-[2rem] text-foreground mr-3 mt-1" onClick={closeModal}>
              <IoClose />
            </div>
            <div className="mr-3 mb-2">
              {audio && (
                <Button
                  className="text-xs md:text-base text-black bg-gradient-to-r from-yellow-300 to-orange-500 py-6 sm:py-0"
                  onClick={() => {
                    if (audio) {
                      //<AudioPlayer />;
                    }
                  }}>
                  Open in full screen
                </Button>
              )}
            </div>
          </div>
        </div>
        <ModalBody className="max-h-[80vh] min-h-[36rem] min-w-[26rem] p-0.5">
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
                <p className="text-center text-foreground">
                  {["ledger", "walletconnectv2", "extra"].includes(loginMethod) ? "Please sign the message using xPortal or Ledger" : "Loading..."}
                </p>
              </div>
            </div>
          ) : (
            <>{viewDataRes && !viewDataRes.error && <div>audioplayeru </div>}</>
          )}
        </ModalBody>
      </Modal>
    </HeaderComponent>
  );
};
