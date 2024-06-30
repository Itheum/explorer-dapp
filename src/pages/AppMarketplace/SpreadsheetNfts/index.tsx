import React, { useEffect, useState } from "react";
import { DataNft, ViewDataReturnType } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo, useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { SPREADSHEET_NFTS_TOKENS } from "appsConfig";
import headerHero from "assets/img/spreadsheet-nfts/banner.jpg";
import { DataNftCard, Loader } from "components";
import { SHOW_NFTS_STEP } from "config";
import { useGetPendingTransactions } from "hooks";
import { decodeNativeAuthToken, getApiDataMarshal, toastError } from "libs/utils";
import "./SpreadsheetNfts.css";
import { useNftsStore } from "store/nfts";
import { HeaderComponent } from "../../../components/Layout/HeaderComponent";
import { Button } from "../../../libComponents/Button";

export const SpreadsheetNfts = () => {
  const { tokenLogin } = useGetLoginInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { chainID } = useGetNetworkConfig();
  const [owned, setOwned] = useState<boolean>(false);
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  const [viewDataRes, setViewDataRes] = useState<ViewDataReturnType>();

  const [shownAppDataNfts, setShownAppDataNfts] = useState<DataNft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { mvxNfts: nfts, isLoadingMvx: isLoadingUserNfts } = useNftsStore();

  useEffect(() => {
    if (!hasPendingTransactions) {
      fetchAppNfts();
    }
  }, [hasPendingTransactions, nfts]);

  async function fetchAppNfts(activeIsLoading = true) {
    if (activeIsLoading) {
      setIsLoading(true);
    }

    const _nfts: DataNft[] = await DataNft.createManyFromApi(
      SPREADSHEET_NFTS_TOKENS.slice(shownAppDataNfts.length, shownAppDataNfts.length + SHOW_NFTS_STEP).map((v) => ({
        nonce: v.nonce,
        tokenIdentifier: v.tokenIdentifier,
      }))
    );

    setShownAppDataNfts((oldNfts) => oldNfts.concat(_nfts));
    if (activeIsLoading) {
      setIsLoading(false);
    }
  }

  async function viewData(index: number) {
    try {
      if (!(index >= 0 && index < shownAppDataNfts.length)) {
        toastError("Data is not loaded");
        return;
      }
      const dataNft = shownAppDataNfts[index];
      const _owned = nfts.find((nft) => nft.tokenIdentifier === dataNft.tokenIdentifier) ? true : false;
      setOwned(_owned);
      if (_owned) {
        setIsFetchingDataMarshal(true);
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
          nestedStream: true,
          nestedIdxToStream: 1,
        };

        if (!dataNft.dataMarshal || dataNft.dataMarshal === "") {
          dataNft.updateDataNft({ dataMarshal: getApiDataMarshal(chainID) });
        }
        res = await dataNft.viewDataViaMVXNativeAuth(arg);

        if (!res.error) {
          const excelObject = window.URL.createObjectURL(new Blob([res.data], { type: res.contentType }));
          res.data = "File Downloaded Successfully";
          window.open(excelObject, "_blank");
        } else {
          console.error(res.error);
          toastError(res.error);
        }

        setViewDataRes(res);
        setIsFetchingDataMarshal(false);
      }
    } catch (err) {
      console.error(err);
      toastError((err as Error).message);
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <HeaderComponent
        pageTitle={"Spreadsheet NFTs"}
        hasImage={true}
        imgSrc={headerHero}
        altImageAttribute={"spreadsheetNfts"}
        pageSubtitle={"Data NFTs that Unlock this Itheum Data Widget"}
        dataNftCount={shownAppDataNfts.length}>
        {shownAppDataNfts.length > 0 ? (
          shownAppDataNfts.map((dataNft, index) => (
            <DataNftCard
              key={index}
              index={index}
              dataNft={dataNft}
              isLoading={isLoading || isLoadingUserNfts}
              owned={nfts.find((nft) => nft.tokenIdentifier === dataNft.tokenIdentifier) ? true : false}
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
                    {viewDataRes && !viewDataRes.error && (
                      <div>
                        <div className="flex justify-center items-center">
                          <p className="text-foreground text-4xl">File Downloaded Successfully!</p>
                        </div>
                      </div>
                    )}
                  </>
                )
              }
              modalTitle={"Spreadsheet NFT Data"}
              modalTitleStyle="p-4"
            />
          ))
        ) : (
          <h3 className="text-center text-white">No DataNFT</h3>
        )}
      </HeaderComponent>
      <div className="m-auto mb-5">
        {shownAppDataNfts.length < SPREADSHEET_NFTS_TOKENS.length && (
          <Button
            className="border-0 text-background rounded-lg font-medium tracking-tight base:!text-sm md:!text-base hover:opacity-80 hover:text-black"
            onClick={() => {
              fetchAppNfts(false);
            }}
            disabled={false}>
            Load more
          </Button>
        )}
      </div>
    </>
  );
};
