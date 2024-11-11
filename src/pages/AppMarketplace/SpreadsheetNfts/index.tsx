import React, { useEffect, useState } from "react";
import { DataNft, ViewDataReturnType } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo, useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { SPREADSHEET_NFTS_TOKENS } from "appsConfig";
import imgGuidePopup from "assets/img/guide-unblock-popups.png";
import headerHero from "assets/img/spreadsheet-nfts/banner.png";
import { MvxDataNftCard, Loader } from "components";
import HelmetPageMeta from "components/HelmetPageMeta";
import { HeaderComponent } from "components/Layout/HeaderComponent";
import { SHOW_NFTS_STEP } from "config";
import { useGetPendingTransactions } from "hooks";
import { Button } from "libComponents/Button";
import { decodeNativeAuthToken, getApiDataMarshal } from "libs/utils";
import { toastClosableError } from "libs/utils/uiShared";
import "./SpreadsheetNfts.css";
import { useNftsStore } from "store/nfts";

export const SpreadsheetNfts = () => {
  const { tokenLogin } = useGetLoginInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const {
    network: { chainId: chainID },
  } = useGetNetworkConfig();
  const [owned, setOwned] = useState<boolean>(false);
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  const [viewDataRes, setViewDataRes] = useState<ViewDataReturnType>();
  const [shownAppDataNfts, setShownAppDataNfts] = useState<DataNft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { mvxNfts: nfts, isLoadingMvx: isLoadingUserNfts } = useNftsStore();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

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
        toastClosableError("Data is not loaded");
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
          toastClosableError(res.error);
        }

        setViewDataRes(res);
        setIsFetchingDataMarshal(false);
      }
    } catch (err) {
      console.error(err);
      toastClosableError((err as Error).message);
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <HelmetPageMeta title="Itheum Spreadsheets App" shortTitle="Itheum Spreadsheets App" desc="Use this app to open spreadsheet Data NFTs." />

      <HeaderComponent
        pageTitle={"Spreadsheet NFTs"}
        hasImage={true}
        imgSrc={headerHero}
        altImageAttribute={"spreadsheetNfts"}
        pageSubtitle={"Data NFTs that Unlock this Itheum App"}
        dataNftCount={shownAppDataNfts.length}
        alwaysLeftAlignBodyContentOnMD={true}>
        {shownAppDataNfts.length > 0 ? (
          shownAppDataNfts.map((dataNft, index) => (
            <MvxDataNftCard
              key={index}
              index={index}
              dataNft={dataNft}
              isLoading={isLoading || isLoadingUserNfts}
              isDataWidget={true}
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
                      <div className="p-5">
                        <p className="p-2">
                          This Data NFT file should have downloaded successfully, but if your browser is prompting you to allow popups, please select{" "}
                          <b>Always allow pop-ups</b> and then close this and click on <b>View Data</b> again. If you are on a mobile device that does not allow
                          file downloads, please try on a desktop machine.
                        </p>
                        <img src={imgGuidePopup} style={{ width: "250px", height: "auto", borderRadius: "5px" }} />
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
          <h3 className="text-center text-white m-auto mt-2">No Data NFTs found that can unlock this app</h3>
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
