import React, { useEffect, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo, useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { TRAILBLAZER_TOKENS } from "appsConfig";
import headerHero from "assets/img/custom-app-header-trailblazer.png";
import { DataNftCard, Loader } from "components";
import { HeaderComponent } from "components/Layout/HeaderComponent";
import { useGetPendingTransactions } from "hooks";
import { decodeNativeAuthToken, getApiDataMarshal, toastError } from "libs/utils";
import "react-vertical-timeline-component/style.min.css";
import { useNftsStore } from "store/nfts";
import { TrailBlazerModal } from "./components/TrailBlazerModal";

export const ItheumTrailblazer = () => {
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { tokenLogin } = useGetLoginInfo();
  const { chainID } = useGetNetworkConfig();

  const [appDataNfts, setAppDataNfts] = useState<DataNft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  const [owned, setOwned] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const nfts = useNftsStore((state) => state.nfts);

  useEffect(() => {
    if (!hasPendingTransactions) {
      fetchAppNfts();
    }
  }, [hasPendingTransactions]);

  async function fetchAppNfts() {
    setIsLoading(true);

    const _nfts: DataNft[] = await DataNft.createManyFromApi(TRAILBLAZER_TOKENS.map((v) => ({ nonce: v.nonce, tokenIdentifier: v.tokenIdentifier })));

    setAppDataNfts(_nfts);
    setIsLoading(false);
  }

  async function viewData(index: number) {
    try {
      if (!(index >= 0 && index < appDataNfts.length)) {
        toastError("Data is not loaded");
        return;
      }

      const dataNft = appDataNfts[index];
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
        console.log(res.data);

        setData(res.data.data.reverse());
        setIsFetchingDataMarshal(false);
      }
    } catch (err) {
      console.error(err);
      toastError((err as Error).message);
      setIsFetchingDataMarshal(false);
    }
  }

  const filterData = [
    { id: 2, value: "Achievement" },
    { id: 3, value: "Offer" },
    { id: 4, value: "Quest" },
    { id: 5, value: "Leaderboard" },
    { id: 7, value: "Ecosystem" },
    { id: 8, value: "Community" },
    { id: 9, value: "Event" },
    { id: 10, value: "Tech Team" },
    { id: 11, value: "Feature" },
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <HeaderComponent
      pageTitle={"Trailblazer"}
      hasImage={true}
      imgSrc={headerHero}
      altImageAttribute={"itheumTrailblazer"}
      pageSubtitle={"Data NFTs that Unlock this Itheum Data Widget"}
      dataNftCount={appDataNfts.length}>
      {appDataNfts.length > 0 ? (
        appDataNfts.map((dataNft, index) => (
          <DataNftCard
            key={index}
            index={index}
            dataNft={dataNft}
            isLoading={isLoading}
            owned={nfts.find((nft) => nft.tokenIdentifier === dataNft.tokenIdentifier) ? true : false}
            viewData={viewData}
            modalContent={<TrailBlazerModal owned={owned} isFetchingDataMarshal={isFetchingDataMarshal} data={data} />}
            modalTitle={"Trailblazer"}
            modalTitleStyle="md:p-5 pt-5 pb-5 px-2"
            hasFilter={true}
            filterData={filterData}
          />
        ))
      ) : (
        <h3 className="text-center text-white">No Data NFTs</h3>
      )}
    </HeaderComponent>
  );
};
