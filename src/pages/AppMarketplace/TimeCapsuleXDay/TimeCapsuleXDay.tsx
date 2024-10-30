import React, { useEffect, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo, useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { TIMECAPSULE_XDAY_TOKENS } from "appsConfig";
import headerHero from "assets/img/timecapsule/custom-app-header-timecapsule-xday.png";
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

export const TimeCapsuleXDay = () => {
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { tokenLogin } = useGetLoginInfo();
  const { chainID } = useGetNetworkConfig();
  const [shownAppDataNfts, setShownAppDataNfts] = useState<DataNft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  const [owned, setOwned] = useState<boolean>(false);
  const [dataHadIndexTitleQueues, setDataHadIndexTitleQueues] = useState<boolean>(false);
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
      TIMECAPSULE_XDAY_TOKENS.slice(shownAppDataNfts.length, shownAppDataNfts.length + SHOW_NFTS_STEP).map((v) => ({
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

        console.log("A ----------");
        console.log(orderedDataByDateDesc);
        console.log("----------");

        /* as TB template on Zedge Storage has an issue where the exact sec/ms is not stored (only yy, mm, dd)
        if have a work around on ordering correctly, where the titles can have a [1], [2] etc to indicate order.
        we try to do this, and for any reason we fail, then we abort it all
        */
        let orderedDataTitleIndexQueues = null;

        try {
          const clonesData = [...res.data.data];
          const getAItemTitle = clonesData?.[0]?.title;

          if (getAItemTitle) {
            const getItsFirstChar = getAItemTitle.trim().charAt(0);

            if (!isNaN(parseInt(getItsFirstChar, 10))) {
              // this means, we should now order the orderedDataByDateDesc by the title index queues
              orderedDataTitleIndexQueues = clonesData.sort((a: any, b: any) => {
                return parseInt(b.title.trim().charAt(0), 10) - parseInt(a.title.trim().charAt(0), 10);
              });
            }
          }

          console.log("B ----------");
          console.log(orderedDataTitleIndexQueues);
          console.log("----------");
        } catch (e) {
          console.log("Tried to order data by index queues in the title, but hit a error");
          console.error(e);
        }

        if (orderedDataTitleIndexQueues !== null && orderedDataTitleIndexQueues.length === res.data.data.length) {
          setDataHadIndexTitleQueues(true);
          setData(orderedDataTitleIndexQueues);
        } else {
          setDataHadIndexTitleQueues(false);
          setData(orderedDataByDateDesc);
        }

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
      <HelmetPageMeta
        title="MultiversX xDay Time Capsule App"
        shortTitle="MultiversX xDay Time Capsule App"
        desc="Own memories from MultiversX xDay as collectibles."
      />

      <HeaderComponent
        pageTitle={"MultiversX xDay Time Capsule"}
        hasImage={true}
        imgSrc={headerHero}
        altImageAttribute={"Time Capsule"}
        pageSubtitle={"Data NFTs that Unlock this Itheum App"}
        dataNftCount={shownAppDataNfts.length}
        alwaysLeftAlignBodyContentOnMD={true}
        showNFMeIdBanner={true}>
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
                <TrailBlazerModal owned={owned} isFetchingDataMarshal={isFetchingDataMarshal} data={data} dataHadIndexTitleQueues={dataHadIndexTitleQueues} />
              }
              modalTitle={"xDay Time Capsule"}
              modalTitleStyle="md:p-5 pt-5 pb-5 px-2"
              hasFilter={false}
            />
          ))
        ) : (
          <h3 className="text-center text-white">No Data NFTs</h3>
        )}
      </HeaderComponent>

      <div className="m-auto mb-5">
        {shownAppDataNfts.length < TIMECAPSULE_XDAY_TOKENS.length && (
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
