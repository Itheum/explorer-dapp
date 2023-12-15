import React, { useEffect, useState } from "react";
import { HeaderComponent } from "../../../components/Layout/HeaderComponent";
import { DataNft } from "@itheum/sdk-mx-data-nft/out";
import { ASHSWAP_POC_TOKEN } from "../../../appsConfig";
import { decodeNativeAuthToken, toastError } from "../../../libs/utils";
import { useGetAccount, useGetPendingTransactions } from "../../../hooks";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { DataNftCard } from "../../../components";
import { WeekSelector } from "./components/WeekSelector";
import { TradeVolume } from "./components/TradeVolume";

export const AshswapPoc: React.FC = () => {
  const { address } = useGetAccount();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { tokenLogin } = useGetLoginInfo();

  const [itDataNfts, setItDataNfts] = useState<DataNft[]>([]);
  const [flags, setFlags] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  const [owned, setOwned] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [customObject, setCustomObject] = useState<Set<number>>(new Set([1701907200]));

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

    const _nfts: DataNft[] = await DataNft.createManyFromApi(ASHSWAP_POC_TOKEN.map((v) => ({ nonce: v.nonce, tokenIdentifier: v.tokenIdentifier })));

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
          mvxNativeAuthOrigins: [decodeNativeAuthToken(tokenLogin.nativeAuthToken).origin],
          mvxNativeAuthMaxExpirySeconds: 3600,
          fwdHeaderMapLookup: {
            "authorization": `Bearer ${tokenLogin.nativeAuthToken}`,
          },
        };

        res = await dataNft.viewDataViaMVXNativeAuth(arg);
        const textData = await (res.data as Blob).text();
        const parsedData = JSON.parse(textData);
        console.log(parsedData.data);
        setData(parsedData.data);
        setIsFetchingDataMarshal(false);
      }
    } catch (err) {
      console.error(err);
      toastError((err as Error).message);
      setIsFetchingDataMarshal(false);
    }
  }

  return (
    <div className="flex flex-col gap-7">
      <HeaderComponent pageTitle={"Ashswap POC"} hasImage={false} pageSubtitle={"Data NFTs that Unlock this App"} dataNftCount={itDataNfts.length}>
        {itDataNfts.length > 0 ? (
          itDataNfts.map((dataNft, index) => (
            <DataNftCard
              key={index}
              index={index}
              dataNft={dataNft}
              isLoading={isLoading}
              owned={flags[index]}
              viewData={viewData}
              modalContent={
                <div className="flex flex-col gap-5 p-3">
                  <WeekSelector setCustomObject={setCustomObject} />
                  <TradeVolume jsonData={data && Number(data.nftDelegator?.getNftVolumeByWeek)} customObject={customObject} />
                </div>
              }
              modalTitle={"Ashswap POC"}
              modalTitleStyle="md:!p-5 !pt-5 !pb-5 px-2"
            />
          ))
        ) : (
          <h3 className="text-center text-white">No Data NFTs</h3>
        )}
      </HeaderComponent>
    </div>
  );
};
