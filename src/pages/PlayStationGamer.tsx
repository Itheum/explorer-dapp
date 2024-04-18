import React, { useEffect, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo, useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { PLAYSTATION_GAMER_PASSPORT_TOKENS } from "appsConfig";
import { DataNftCard, Loader } from "components";
import { useGetAccount, useGetPendingTransactions } from "hooks";
import { decodeNativeAuthToken, getApiDataMarshal, toastError } from "libs/utils";
import { HeaderComponent } from "../components/Layout/HeaderComponent";
import { useNftsStore } from "store/nfts";

export const PlayStationGamer = () => {
  const { address } = useGetAccount();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { tokenLogin } = useGetLoginInfo();
  const { chainID } = useGetNetworkConfig();

  const [ccDataNfts, setCcDataNfts] = useState<DataNft[]>([]);
  const [flags, setFlags] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);

  const [data, setData] = useState<any>();
  const nfts = useNftsStore((state) => state.nfts);

  const [activeGamerData, setActiveGamerData] = useState<any>(null);

  async function fetchAppNfts() {
    setIsLoading(true);

    if (PLAYSTATION_GAMER_PASSPORT_TOKENS.length > 0) {
      const _nfts: DataNft[] = await DataNft.createManyFromApi(
        PLAYSTATION_GAMER_PASSPORT_TOKENS.map((v) => ({ nonce: v.nonce, tokenIdentifier: v.tokenIdentifier }))
      );
      setCcDataNfts(_nfts);
      setIsLoading(false);
    } else {
      toastError("No identifier for this Widget.");
      setIsLoading(false);
    }
  }

  async function fetchMyNfts() {
    const _dataNfts = nfts;

    const _flags = [];
    for (const cnft of ccDataNfts) {
      const matches = _dataNfts.filter((mnft) => cnft.nonce === mnft.nonce);
      _flags.push(matches.length > 0);
    }
    console.log("_flags", _flags);
    setFlags(_flags);
  }

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

  async function viewData(index: number) {
    if (!(index >= 0 && index < ccDataNfts.length)) {
      toastError("Data is not loaded");
      return;
    }

    const _owned = flags[index];

    if (_owned) {
      setIsFetchingDataMarshal(true);

      const dataNft = ccDataNfts[index];
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
      if (!dataNft.dataMarshal || dataNft.dataMarshal === "") {
        dataNft.updateDataNft({ dataMarshal: getApiDataMarshal(chainID) });
      }
      res = await dataNft.viewDataViaMVXNativeAuth(arg);
      res.data = await (res.data as Blob).text();
      res.data = JSON.parse(res.data);

      fixData(res.data);
      setData(res.data);

      setIsFetchingDataMarshal(false);
    }
  }

  const fixData = (rawData: any) => {
    console.log("rawData", rawData);

    const titleAndTrophies = rawData.trophy_titles.reduce((total: any, item: any) => {
      if (!total[item.name]) {
        total[item.name] = {};
      }

      total[item.name].trophies = {
        ...item,
      };

      return total;
    }, {});

    rawData.title_stats.forEach((title: any) => {
      if (!titleAndTrophies[title.name]) {
        titleAndTrophies[title.name] = {
          trophies: null,
        };
      }

      titleAndTrophies[title.name].title = { ...title };
    });

    console.log("titleAndTrophies");
    console.log(titleAndTrophies);

    console.log(Object.keys(titleAndTrophies));

    setActiveGamerData({
      account_devices: rawData.account_devices,
      profile_legacy: rawData.profile_legacy,
      title_stats: rawData.title_stats,
      trophy_summary: rawData.trophy_summary,
      trophy_titles: rawData.trophy_titles,
      titleAndTrophies,
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  console.log("isFetchingDataMarshal", isFetchingDataMarshal);
  console.log("data", data);
  console.log("activeGamerData", activeGamerData);

  return (
    <HeaderComponent
      pageTitle={"PlayStation Gamer Passport"}
      hasImage={false}
      pageSubtitle={"Data NFTs that Unlock this Itheum Data Widget"}
      dataNftCount={ccDataNfts.length}>
      {ccDataNfts.length > 0 ? (
        ccDataNfts.map((dataNft, index) => (
          <DataNftCard key={index} index={index} dataNft={dataNft} isLoading={isLoading} owned={flags[index]} viewData={viewData} />
        ))
      ) : (
        <h3 className="text-center text-white">No Data NFTs</h3>
      )}
    </HeaderComponent>
  );
};
