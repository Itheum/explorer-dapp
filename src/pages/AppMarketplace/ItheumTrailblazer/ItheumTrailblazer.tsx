import React, { useEffect, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import headerHero from "assets/img/custom-app-header-trailblazer.png";
import { DataNftCard, Loader } from "components";
import { TRAILBLAZER_TOKENS } from "config";
import { useGetAccount, useGetPendingTransactions } from "hooks";
import { nativeAuthOrigins, toastError } from "libs/utils";
import "react-vertical-timeline-component/style.min.css";
import { HeaderComponent } from "components/Layout/HeaderComponent";
import { TrailBlazerModal } from "./components/TrailBlazerModal";

export const ItheumTrailblazer = () => {
  const { address } = useGetAccount();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { tokenLogin } = useGetLoginInfo();

  const [itDataNfts, setItDataNfts] = useState<DataNft[]>([]);
  const [flags, setFlags] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  const [owned, setOwned] = useState<boolean>(false);
  const [data, setData] = useState<any>();

  useEffect(() => {
    if (!hasPendingTransactions) {
      fetchAppNfts();
    }
  }, [hasPendingTransactions]);

  useEffect(() => {
    if (!isLoading && address) {
      fetchMyNfts();
    }
  }, [isLoading, address]);

  async function fetchAppNfts() {
    setIsLoading(true);

    const _nfts: DataNft[] = await DataNft.createManyFromApi(TRAILBLAZER_TOKENS.map((v) => ({ nonce: v.nonce, tokenIdentifier: v.tokenIdentifier })));

    setItDataNfts(_nfts);
    setIsLoading(false);
  }

  async function fetchMyNfts() {
    const _dataNfts = await DataNft.ownedByAddress(address);
    const _flags = [];

    for (const cnft of itDataNfts) {
      const matches = _dataNfts.filter((mnft) => cnft.nonce === mnft.nonce);
      _flags.push(matches.length > 0);
    }

    setFlags(_flags);
  }

  async function viewData(index: number) {
    try {
      if (!(index >= 0 && index < itDataNfts.length)) {
        toastError("Data is not loaded");
        return;
      }

      const dataNft = itDataNfts[index];
      const _owned = flags[index];
      setOwned(_owned);

      if (_owned) {
        setIsFetchingDataMarshal(true);

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
        };

        res = await dataNft.viewDataViaMVXNativeAuth(arg);
        res.data = await (res.data as Blob).text();
        res.data = JSON.parse(res.data);

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

  // async function processSignature(nonce: number, messageToBeSigned: string, signedMessage: SignableMessage) {
  //   try {
  //     setIsFetchingDataMarshal(true);
  //     setOwned(true);
  //     openModal();
  //
  //     const dataNft = await DataNft.createFromApi(nonce);
  //     const res = await dataNft.viewData(messageToBeSigned, signedMessage as any);
  //     res.data = await (res.data as Blob).text();
  //     res.data = JSON.parse(res.data);
  //
  //     setData(res.data.data.reverse());
  //     setIsFetchingDataMarshal(false);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <HeaderComponent
      pageTitle={"Trailblazer"}
      hasImage={true}
      imgSrc={headerHero}
      altImageAttribute={"itheumTrailblazer"}
      pageSubtitle={"Data NFTs that Unlock this App"}
      dataNftCount={itDataNfts.length}>
      {itDataNfts.length > 0 ? (
        itDataNfts.map((dataNft, index) => (
          <DataNftCard
            key={index}
            index={index}
            dataNft={dataNft}
            isLoading={isLoading}
            owned={flags[index]}
            viewData={viewData}
            modalContent={<TrailBlazerModal owned={owned} isFetchingDataMarshal={isFetchingDataMarshal} data={data} />}
            modalTitle={"Trailblazer"}
            modalTitleStyle="md:!p-5 !pt-5 !pb-5 px-2"
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
