import React, { useEffect, useState } from "react";
import { DataNft, ViewDataReturnType } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { ModalBody } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { IoClose } from "react-icons/io5";
// import SVG from "react-inlinesvg";
import Modal from "react-modal";
import headerHero from "assets/img/custom-app-header-bubblemaps.png";
import { DataNftCard, Loader, ZoomableSvg } from "components";
import { MULTIVERSX_BUBBLE_NONCES } from "config";
import { useGetAccount, useGetPendingTransactions } from "hooks";
import { BlobDataType } from "libs/types";
import { modalStylesFull } from "libs/ui";
import { toastError } from "libs/utils";
import { HeaderComponent } from "../components/Layout/HeaderComponent";
import { Button } from "../libComponents/Button";

interface ExtendedViewDataReturnType extends ViewDataReturnType {
  blobDataType: BlobDataType;
}

export const MultiversxBubbles = () => {
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
  const [file, setFile] = useState<string | null>(null);

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
  }

  async function fetchDataNfts() {
    setIsLoading(true);

    const _nfts: DataNft[] = await DataNft.createManyFromApi(MULTIVERSX_BUBBLE_NONCES.map(v => ({ nonce: v })));
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
          stream: true,
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

              // create a file so it can also be loaded in a new window
              const pdfObject = window.URL.createObjectURL(new Blob([res.data], { type: res.contentType }));
              setFile(pdfObject);
            } else {
              blobDataType = BlobDataType.IMAGE;
              res.data = window.URL.createObjectURL(new Blob([res.data], { type: res.contentType }));
            }
          } else {
            throw Error("This content type is not supported");
          }
        } else {
          throw Error(res.error);
        }

        setViewDataRes({
          ...res,
          blobDataType,
        });
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
      pageTitle={"MultiversX Bubbles"}
      hasImage={true}
      imgSrc={headerHero}
      altImageAttribute={"bubbleMap"}
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
        className="absolute overflow-hidden !w-[80%] !top-[50%] !left-[50%] !right-auto !bottom-auto !-mr-[50%] !-translate-x-[50%] !-translate-y-[50%] h-[89vh] !bg-background !shadow-md  !shadow-foreground rounded-2xl"
        style={modalStylesFull}
        ariaHideApp={false}
        shouldCloseOnOverlayClick={false}>
        <div className="sticky-top flex flex-row justify-between backdrop-blur bg-background/60">
          <ModalHeader className="border-0">
            <h2 className="text-center p-3 text-foreground">MultiversX Bubbles</h2>
          </ModalHeader>
          <div className="flex flex-col items-end gap-4 h-[6rem]">
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
        <ModalBody className="h-full min-w-[26rem] p-0.5">
          {!owned ? (
            <div
              className="flex flex-col items-center justify-center"
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
            <div className="flex flex-col items-center justify-center min-h-[40rem]">
              <div>
                <Loader noText />
                <p className="text-center text-foreground ">
                  {"Loading..."}
                </p>
              </div>
            </div>
          ) : (
            <>
              {viewDataRes &&
                !viewDataRes.error &&
                (viewDataRes.blobDataType === BlobDataType.IMAGE ? (
                  <img src={viewDataRes.data} className="w-full h-auto" />
                ) : viewDataRes.blobDataType === BlobDataType.SVG ? (
                  // <SVG src={viewDataRes.data} preProcessor={(code) => preProcess(code)} style={{ width: "100%", height: "auto" }} />
                  <ZoomableSvg
                    data={viewDataRes.data}
                    preProcess={preProcess}
                  />
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
