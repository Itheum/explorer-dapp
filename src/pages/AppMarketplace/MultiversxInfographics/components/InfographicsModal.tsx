import React, { useEffect, useState } from "react";
import { Loader } from "../../../../components";
import { Button } from "../../../../libComponents/Button";
import { Document, Page } from "react-pdf";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { PDFDocumentProxy } from "pdfjs-dist";
import { sleep } from "../../../../libs/utils/legacyUtil";
import { Address, SignableMessage } from "@multiversx/sdk-core/out";
import { routeNames } from "../../../../routes";
import { MULTIVERSX_INFOGRAPHICS_NONCES } from "../../../../config";
import { toastError } from "../../../../libs/utils";
import { BlobDataType } from "../../../../libs/types";
import { useGetAccount, useGetPendingTransactions } from "../../../../hooks";
import { useSignMessage } from "@multiversx/sdk-dapp/hooks/signMessage/useSignMessage";
import { useGetSignMessageInfoStatus } from "@multiversx/sdk-dapp/hooks/signMessage/useGetSignedMessageStatus";
import { useGetLastSignedMessageSession } from "@multiversx/sdk-dapp/hooks/signMessage/useGetLastSignedMessageSession";
import { useNavigate, useParams } from "react-router-dom";
import { DataNft, ViewDataReturnType } from "@itheum/sdk-mx-data-nft/out";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

interface ExtendedViewDataReturnType extends ViewDataReturnType {
  blobDataType: BlobDataType;
}

type PDFFile = string | File | null;
export const InfographicsModal: React.FC = () => {
  // const { address } = useGetAccount();
  // const { loginMethod } = useGetLoginInfo();
  // const { hasPendingTransactions } = useGetPendingTransactions();
  // const { signMessage } = useSignMessage();
  // const { isPending: isSignMessagePending } = useGetSignMessageInfoStatus();
  // const lastSignedMessageSession = useGetLastSignedMessageSession();
  //
  // const [dataNfts, setDataNfts] = useState<DataNft[]>([]);
  // const [flags, setFlags] = useState<boolean[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  // const [owned, setOwned] = useState<boolean>(false);
  // const [viewDataRes, setViewDataRes] = useState<ExtendedViewDataReturnType>();
  // const navigate = useNavigate();
  // const isWebWallet = loginMethod === "wallet";
  // const { targetNonce, targetMessageToBeSigned } = useParams();
  //
  // const [file, setFile] = useState<PDFFile>(null);
  // const [numPages, setNumPages] = useState<number>(0);
  // const [pageNumber, setPageNumber] = useState(1); //setting 1 to show first page
  //
  // useEffect(() => {
  //   if (!hasPendingTransactions) {
  //     fetchDataNfts();
  //   }
  // }, [hasPendingTransactions]);
  //
  // useEffect(() => {
  //   if (!isLoading && address) {
  //     fetchMyNfts();
  //   }
  // }, [isLoading, address]);
  //
  // useEffect(() => {
  //   const asyncFnc = async () => {
  //     await sleep(1); //temporary solution until we find out racing condition
  //     try {
  //       let signature = "";
  //
  //       if (lastSignedMessageSession && lastSignedMessageSession.status == "signed" && lastSignedMessageSession.signature) {
  //         signature = lastSignedMessageSession.signature;
  //       } else {
  //         let signSessions = JSON.parse(sessionStorage.getItem("persist:sdk-dapp-signedMessageInfo") ?? "{'signedSessions':{}}");
  //         signSessions = JSON.parse(signSessions.signedSessions);
  //
  //         // find the first 'signed' session
  //         for (const session of Object.values(signSessions) as any[]) {
  //           if (session.status && session.status == "signed" && session.signature) {
  //             signature = session.signature;
  //             break;
  //           }
  //         }
  //       }
  //
  //       if (!signature) {
  //         throw Error("Signature is empty");
  //       }
  //
  //       const signedMessage = new SignableMessage({
  //         address: new Address(address),
  //         message: Buffer.from(targetMessageToBeSigned || "", "ascii"),
  //         signature: Buffer.from(signature, "hex"),
  //         signer: loginMethod,
  //       });
  //       await processSignature(Number(targetNonce), targetMessageToBeSigned || "", signedMessage);
  //     } catch (e) {
  //       console.error(e);
  //     } finally {
  //       navigate(routeNames.multiversxinfographics);
  //     }
  //   };
  //   if (isWebWallet && !!targetNonce && !!targetMessageToBeSigned && !isSignMessagePending) {
  //     asyncFnc();
  //   }
  // }, [isWebWallet, isSignMessagePending]);
  //
  // async function fetchDataNfts() {
  //   setIsLoading(true);
  //
  //   const _nfts: DataNft[] = await DataNft.createManyFromApi(MULTIVERSX_INFOGRAPHICS_NONCES);
  //   setDataNfts(_nfts);
  //
  //   setIsLoading(false);
  // }
  //
  // async function fetchMyNfts() {
  //   const _dataNfts = await DataNft.ownedByAddress(address);
  //   const _flags = [];
  //
  //   for (const cnft of dataNfts) {
  //     const matches = _dataNfts.filter((mnft) => cnft.nonce === mnft.nonce);
  //     _flags.push(matches.length > 0);
  //   }
  //
  //   setFlags(_flags);
  // }
  //
  // async function viewData(index: number) {
  //   try {
  //     if (!(index >= 0 && index < dataNfts.length)) {
  //       toastError("Data is not loaded");
  //       return;
  //     }
  //
  //     const _owned = flags[index];
  //     setOwned(_owned);
  //
  //     if (_owned) {
  //       setIsFetchingDataMarshal(true);
  //
  //       const dataNft = dataNfts[index];
  //       const messageToBeSigned = await dataNft.getMessageToSign();
  //
  //       const callbackRoute = `${window.location.href}/${dataNft.nonce}/${messageToBeSigned}`;
  //       const signedMessage = await signMessage({
  //         message: messageToBeSigned,
  //         callbackRoute: isWebWallet ? callbackRoute : undefined,
  //       });
  //
  //       if (isWebWallet) return;
  //       if (!signedMessage) {
  //         toastError("Wallet signing failed.");
  //         return;
  //       }
  //
  //       const viewDataPayload: ExtendedViewDataReturnType = await obtainDataNFTData(dataNft, messageToBeSigned, signedMessage as any);
  //
  //       setViewDataRes(viewDataPayload);
  //       setIsFetchingDataMarshal(false);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     toastError((err as Error).message);
  //     setIsFetchingDataMarshal(false);
  //   }
  // }
  //
  // async function obtainDataNFTData(dataNft: DataNft, messageToBeSigned: string, signedMessage: SignableMessage) {
  //   const res = await dataNft.viewData(messageToBeSigned, signedMessage as any, true);
  //
  //   let blobDataType = BlobDataType.TEXT;
  //
  //   if (!res.error) {
  //     const pdfObject = window.URL.createObjectURL(new Blob([res.data], { type: res.contentType }));
  //     res.data = "PDF opened in new tab";
  //     blobDataType = BlobDataType.PDF;
  //     // window.open(pdfObject, "_blank");
  //
  //     setFile(pdfObject);
  //   } else {
  //     console.error(res.error);
  //     toastError(res.error);
  //   }
  //
  //   return {
  //     ...res,
  //     blobDataType,
  //   };
  // }
  //
  // async function processSignature(nonce: number, messageToBeSigned: string, signedMessage: SignableMessage) {
  //   try {
  //     setIsFetchingDataMarshal(true);
  //     setOwned(true);
  //
  //     const dataNft = await DataNft.createFromApi(nonce);
  //     const viewDataPayload: ExtendedViewDataReturnType = await obtainDataNFTData(dataNft, messageToBeSigned, signedMessage);
  //
  //     setViewDataRes(viewDataPayload);
  //     setIsFetchingDataMarshal(false);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
  //
  // function onDocumentLoadSuccess({ numPages: totalPages }: PDFDocumentProxy): void {
  //   setNumPages(totalPages);
  //   setPageNumber(1);
  // }
  //
  // function changePage(offset: number) {
  //   setPageNumber((prevPageNumber) => prevPageNumber + offset);
  // }
  //
  // function previousPage() {
  //   changePage(-1);
  // }
  //
  // function nextPage() {
  //   changePage(1);
  // }
  //
  // if (isLoading) {
  //   return <Loader />;
  // }

  return (
    <>
      {/*{!owned ? (*/}
      {/*  <div className="flex flex-col items-center justify-center w-full min-h-[40rem] max-h-[80dvh]">*/}
      {/*    <h4 className="mt-3 font-title">You do not own this Data NFT</h4>*/}
      {/*    <h6>(Buy the Data NFT from the marketplace to unlock the data)</h6>*/}
      {/*  </div>*/}
      {/*) : isFetchingDataMarshal ? (*/}
      {/*  <div className="d-flex flex-column align-items-center justify-content-center min-h-[40rem]">*/}
      {/*    <div>*/}
      {/*      <Loader noText />*/}
      {/*      <p className="text-center text-foreground">*/}
      {/*        {["ledger", "walletconnectv2", "extra"].includes(loginMethod) ? "Please sign the message using xPortal or Ledger" : "Loading..."}*/}
      {/*      </p>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*) : (*/}
      {/*  <>*/}
      {/*    <div className="flex justify-end mr-3 mb-2">*/}
      {/*      {file && (*/}
      {/*        <Button*/}
      {/*          className="text-xs md:text-base text-black bg-gradient-to-r from-yellow-300 to-orange-500 py-6 sm:py-0"*/}
      {/*          onClick={() => {*/}
      {/*            if (file) {*/}
      {/*              window.open(file as string, "_blank");*/}
      {/*            }*/}
      {/*          }}>*/}
      {/*          Open in full screen*/}
      {/*        </Button>*/}
      {/*      )}*/}
      {/*    </div>*/}
      {/*    {viewDataRes && !viewDataRes.error && (*/}
      {/*      <div>*/}
      {/*        <div className="flex justify-center items-center">*/}
      {/*          <Button className="text-foreground mr-3" variant="outline" disabled={pageNumber <= 1} onClick={previousPage}>*/}
      {/*            Previous*/}
      {/*          </Button>*/}
      {/*          <p className="text-foreground">*/}
      {/*            Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}*/}
      {/*          </p>*/}
      {/*          <Button className="text-foreground ml-3" variant="outline" disabled={pageNumber >= numPages} onClick={nextPage}>*/}
      {/*            Next*/}
      {/*          </Button>*/}
      {/*        </div>*/}

      {/*        <div className="c-container-document">*/}
      {/*          <Document file={file} onLoadSuccess={onDocumentLoadSuccess} options={options}>*/}
      {/*            <Page pageNumber={pageNumber} />*/}
      {/*          </Document>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    )}*/}
      {/*  </>*/}
      {/*)}*/}
    </>
  );
};
