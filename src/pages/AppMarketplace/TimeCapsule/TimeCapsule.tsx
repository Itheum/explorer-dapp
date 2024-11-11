import React, { useEffect, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo, useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { TIMECAPSULE_TOKENS } from "appsConfig";
import headerHero from "assets/img/timecapsule/custom-app-header-timecapsule.png";
import { MvxDataNftCard, Loader } from "components";
import HelmetPageMeta from "components/HelmetPageMeta";
import { HeaderComponent } from "components/Layout/HeaderComponent";
import { SHOW_NFTS_STEP } from "config";
import { useGetPendingTransactions } from "hooks";
import { Button } from "libComponents/Button";
import { decodeNativeAuthToken, getApiDataMarshal } from "libs/utils";
import "react-vertical-timeline-component/style.min.css";
import { toastClosableError } from "libs/utils/uiShared";
import { useNftsStore } from "store/nfts";
import { TrailBlazerModal } from "../ItheumTrailblazer/components/TrailBlazerModal";

export const TimeCapsule = () => {
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { tokenLogin } = useGetLoginInfo();
  const {
    network: { chainId: chainID },
  } = useGetNetworkConfig();
  const [shownAppDataNfts, setShownAppDataNfts] = useState<DataNft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  const [owned, setOwned] = useState<boolean>(false);
  const [data, setData] = useState<any>();
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
      TIMECAPSULE_TOKENS.slice(shownAppDataNfts.length, shownAppDataNfts.length + SHOW_NFTS_STEP).map((v) => ({
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
        };
        if (!dataNft.dataMarshal || dataNft.dataMarshal === "") {
          dataNft.updateDataNft({ dataMarshal: getApiDataMarshal(chainID) });
        }
        res = await dataNft.viewDataViaMVXNativeAuth(arg);
        res.data = await (res.data as Blob).text();
        res.data = JSON.parse(res.data);

        const orderedDataByDateDesc = res.data.data.sort((a: any, b: any) => {
          return new Date(b.date).valueOf() - new Date(a.date).valueOf();
        });

        setData(orderedDataByDateDesc);
        setIsFetchingDataMarshal(false);
      }
    } catch (err) {
      console.error(err);
      toastClosableError((err as Error).message);
      setIsFetchingDataMarshal(false);
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <HelmetPageMeta title="Itheum Time Capsule App" shortTitle="Itheum Time Capsule App" desc="Own memories as collectibles." />

      <HeaderComponent
        pageTitle={"Time Capsule"}
        hasImage={true}
        imgSrc={headerHero}
        altImageAttribute={"Time Capsule"}
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
              modalContent={<TrailBlazerModal owned={owned} isFetchingDataMarshal={isFetchingDataMarshal} data={data} />}
              modalTitle={"Time Capsule"}
              modalTitleStyle="md:p-5 pt-5 pb-5 px-2"
              hasFilter={false}
            />
          ))
        ) : (
          <h3 className="text-center text-white">No Data NFTs</h3>
        )}
      </HeaderComponent>

      <div className="m-auto mb-5">
        {shownAppDataNfts.length < TIMECAPSULE_TOKENS.length && (
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
