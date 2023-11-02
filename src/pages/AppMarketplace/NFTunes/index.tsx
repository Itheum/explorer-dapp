import React, { useEffect, useMemo, useState } from "react";
import { DataNft, ViewDataReturnType } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { NF_TUNES_TOKENS } from "appsConfig";
import nfTunesBanner from "assets/img/nf-tunes-banner.png";
import disk from "assets/img/nf-tunes-logo-disk.png";
import { DataNftCard, Loader } from "components";
import { AudioPlayer } from "components/AudioPlayer";
import { HeaderComponent } from "components/Layout/HeaderComponent";
import { useGetAccount, useGetPendingTransactions } from "hooks";
import { BlobDataType } from "libs/types";
import { nativeAuthOrigins, toastError } from "libs/utils";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import stick from "../../../assets/img/nf-tunes-logo-stick.png";

interface ExtendedViewDataReturnType extends ViewDataReturnType {
  blobDataType: BlobDataType;
}

export const NFTunes = () => {
  const { address } = useGetAccount();
  const { loginMethod } = useGetLoginInfo();

  ///native auth
  const { tokenLogin } = useGetLoginInfo();

  const { hasPendingTransactions } = useGetPendingTransactions();

  const [dataNfts, setDataNfts] = useState<DataNft[]>([]);
  const [flags, setFlags] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  const [owned, setOwned] = useState<boolean>(false);
  const [viewDataRes, setViewDataRes] = useState<ExtendedViewDataReturnType>();
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [dataMarshalResponse, setDataMarshalResponse] = useState({ "data_stream": {}, "data": [] });

  const imgAnimation = useMemo(
    () => (
      <div className="relative  top-[15%]">
        <img className="animate-spin-slow w-[20%] left-[40%] max-w-[300px] absolute" src={disk} alt="disk" />
        <img className="rotate-[20deg] absolute top-[-10px] md:top-[-15px] max-w-[200px] left-[52%] 3xl:left-[50%] w-[15%] " src={stick} alt="stick" />
      </div>
    ),
    []
  );

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

  ///get the nfts that are able to open nfTunes app
  async function fetchDataNfts() {
    setIsLoading(true);

    const _nfts: DataNft[] = await DataNft.createManyFromApi(NF_TUNES_TOKENS.map((v) => ({ nonce: v.nonce, tokenIdentifier: v.tokenIdentifier })));
    setDataNfts(_nfts);

    setIsLoading(false);
  }

  ///fetch the nfts owned by the logged in address and if the user has any of them set flag to true,
  //on those will be shown view data otherwise show market place explore button
  async function fetchMyNfts() {
    const _dataNfts = await DataNft.ownedByAddress(address);
    const _flags = [];

    for (const cnft of dataNfts) {
      const matches = _dataNfts.filter((mnft) => cnft.nonce === mnft.nonce);
      _flags.push(matches.length > 0);
    }

    setFlags(_flags);
  }

  /// after pressing the button to view data open modal
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
          mvxNativeAuthOrigins: nativeAuthOrigins(),
          mvxNativeAuthMaxExpirySeconds: 3000,
          fwdHeaderMapLookup: {
            "authorization": `Bearer ${tokenLogin.nativeAuthToken}`,
          },
          stream: true,
        };
        setCurrentIndex(index);

        res = await dataNft.viewDataViaMVXNativeAuth(arg);
        let blobDataType = BlobDataType.TEXT;

        if (!res.error) {
          if (res.contentType.search("application/json") >= 0) {
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
        setDataMarshalResponse(JSON.parse(res.data));

        setViewDataRes(viewDataPayload);
        setIsFetchingDataMarshal(false);
      }
    } catch (err) {
      console.error(err);
      toastError((err as Error).message);
      setIsFetchingDataMarshal(false);
    }
  }

  return (
    <HeaderComponent
      pageTitle={"NF-Tunes"}
      isAnimated
      hasImage={true}
      imgSrc={nfTunesBanner}
      animation={imgAnimation}
      altImageAttribute={"NF-Tunes application"}
      pageSubtitle={"Data NFTs that Unlock this App"}
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
              isFetchingDataMarshal ? (
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
                <>
                  {viewDataRes && !viewDataRes.error && tokenLogin && currentIndex > -1 && (
                    <AudioPlayer dataNftToOpen={dataNfts[currentIndex]} songs={dataMarshalResponse ? dataMarshalResponse.data : []} tokenLogin={tokenLogin} />
                  )}
                </>
              )
            }
            modalTitle={"NF-Tunes"}
            modalTitleStyle="p-4"
          />
        ))
      ) : (
        <h3 className="text-center text-white">No DataNFT</h3>
      )}
    </HeaderComponent>
  );
};
