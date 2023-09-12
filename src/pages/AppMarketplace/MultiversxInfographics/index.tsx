import React, { useEffect, useState } from "react";
import { DataNft, ViewDataReturnType } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { ModalBody } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { IoClose } from "react-icons/io5";
import Modal from "react-modal";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import headerHero from "assets/img/custom-app-header-infographs.png";
import { DataNftCard, Loader } from "components";
import { MULTIVERSX_INFOGRAPHICS_NONCES } from "config";
import { useGetAccount, useGetPendingTransactions } from "hooks";
import { BlobDataType } from "libs/types";
import { modalStylesFull } from "libs/ui";
import { toastError } from "libs/utils";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "./MultiversxInfographics.scss";
import { HeaderComponent } from "../../../components/Layout/HeaderComponent";
import { Button } from "../../../libComponents/Button";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

interface ExtendedViewDataReturnType extends ViewDataReturnType {
  blobDataType: BlobDataType;
}

type PDFFile = string | File | null;

// we are using react-pdf : https://levelup.gitconnected.com/displaying-pdf-in-react-app-6e9d1fffa1a9

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

  const [file, setFile] = useState<PDFFile>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1); //setting 1 to show first page
  
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
    setFile(null);
    setNumPages(0);
    setPageNumber(1);
  }

  async function fetchDataNfts() {
    setIsLoading(true);

    const _nfts: DataNft[] = await DataNft.createManyFromApi(MULTIVERSX_INFOGRAPHICS_NONCES.map(v => ({ nonce: v })));
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
          mvxNativeAuthOrigins: [window.location.origin],
          mvxNativeAuthMaxExpirySeconds: 3000,
          fwdHeaderMapLookup: {
            "authorization": `Bearer ${tokenLogin.nativeAuthToken}`,
          },
        };
        console.log('arg', arg);

        res = await dataNft.viewDataViaMVXNativeAuth(arg);
        console.log('res', res);

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

  function onDocumentLoadSuccess({ numPages: totalPages }: PDFDocumentProxy): void {
    setNumPages(totalPages);
    setPageNumber(1);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
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

      <Modal
        isOpen={isModalOpened}
        onRequestClose={closeModal}
        className="absolute overflow-y-scroll scrollbar !w-[80%] !top-[50%] !left-[50%] !right-auto !bottom-auto !-mr-[50%] !-translate-x-[50%] !-translate-y-[50%] !max-h-[79vh] !bg-background !shadow-md  !shadow-foreground rounded-2xl"
        style={modalStylesFull}
        ariaHideApp={false}
        shouldCloseOnOverlayClick={false}>
        <div className="sticky-top flex flex-row justify-between backdrop-blur bg-background/60">
          <ModalHeader className="border-0">
            <h2 className="text-foreground p-3 text-center">MultiversX Infographics</h2>
          </ModalHeader>
          <div className="flex flex-col items-end gap-6 h-[6rem]">
            <div className="flex justify-center cursor-pointer text-[2rem] text-foreground mr-3 mt-1" onClick={closeModal}>
              <IoClose />
            </div>
            <div className="mr-3 mb-2">
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
                  {"Loading..."}
                </p>
              </div>
            </div>
          ) : (
            <>
              {viewDataRes && !viewDataRes.error && (
                <div>
                  <div className="flex justify-center items-center">
                    <Button className="text-foreground mr-3" variant="outline" disabled={pageNumber <= 1} onClick={previousPage}>
                      Previous
                    </Button>
                    <p className="text-foreground">
                      Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
                    </p>
                    <Button className="text-foreground ml-3" variant="outline" disabled={pageNumber >= numPages} onClick={nextPage}>
                      Next
                    </Button>
                  </div>

                  <div className="c-container-document">
                    <Document file={file} onLoadSuccess={onDocumentLoadSuccess} options={options}>
                      <Page pageNumber={pageNumber} />
                    </Document>
                  </div>

                  {/* <div className="c-container-document">
                      <Document file={file} onLoadSuccess={onDocumentLoadSuccess} options={options}>
                        {Array.from(new Array(numPages), (el, index) => (
                          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                        ))}
                      </Document>
                    </div> */}
                </div>
              )}
            </>
          )}
        </ModalBody>
      </Modal>
    </HeaderComponent>
  );
};
