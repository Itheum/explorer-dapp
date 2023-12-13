import React, { useEffect, useState } from "react";
import { DataNft, ViewDataReturnType } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import { MULTIVERSX_INFOGRAPHICS_TOKENS } from "appsConfig";
import headerHero from "assets/img/custom-app-header-infographs.png";
import { DataNftCard, Loader } from "components";
import { useGetAccount, useGetPendingTransactions } from "hooks";
import { BlobDataType } from "libs/types";
import { decodeNativeAuthToken, nativeAuthOrigins, toastError } from "libs/utils";
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
        };
        console.log("arg", arg);
        res = await dataNft.viewDataViaMVXNativeAuth(arg);

        let blobDataType = BlobDataType.TEXT;

        if (!res.error) {
          const pdfObject = window.URL.createObjectURL(new Blob([res.data], { type: res.contentType }));
          res.data = "PDF opened in new tab";
          blobDataType = BlobDataType.PDF;
          // window.open(pdfObject, "_blank");

          setFile(pdfObject);
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
    } catch (err) {
      console.error(err);
      toastError((err as Error).message);
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
                <div className="flex flex-column items-center justify-center min-w-[24rem] max-w-[50dvw] min-h-[40rem] max-h-[80svh]">
                  <h4 className="mt-3 font-title">You do not own this Data NFT</h4>
                  <h6>(Buy the Data NFT from the marketplace to unlock the data)</h6>
                </div>
              ) : isFetchingDataMarshal ? (
                <div className="flex flex-col items-center justify-center min-h-[40rem]">
                  <div>
                    <Loader noText />
                    <p className="text-center text-foreground">{"Loading..."}</p>
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
                    </div>
                  )}
                </>
              )
            }
            modalTitle={"MultiversX Infographics"}
            modalTitleStyle="p-4"
          />
        ))
      ) : (
        <h3 className="text-center text-white">No DataNFT</h3>
      )}
    </HeaderComponent>
  );
};
