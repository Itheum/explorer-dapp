import React, { useEffect, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft/out";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import BigNumber from "bignumber.js";
import { TradeVolume } from "./components/TradeVolume";
import { WeekSelector } from "./components/WeekSelector";
import { ASHSWAP_POC_TOKEN } from "../../../appsConfig";
import { DataNftCard } from "../../../components";
import { HeaderComponent } from "../../../components/Layout/HeaderComponent";
import { useGetAccount, useGetPendingTransactions } from "../../../hooks";
import { decodeNativeAuthToken, toastError } from "../../../libs/utils";

export const AshswapPoc: React.FC = () => {
  const { address } = useGetAccount();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { tokenLogin } = useGetLoginInfo();

  const [itDataNfts, setItDataNfts] = useState<DataNft[]>([]);
  const [flags, setFlags] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [volumeHistory, setVolumeHistory] = useState<any>([
    { week: 1701907200, volume: new BigNumber(0), headerText: "This week" },
    { week: 1701302400, volume: new BigNumber(100), headerText: "One week ago" },
    { week: 1700697600, volume: new BigNumber(200), headerText: "Two week ago" },
    { week: 1700092800, volume: new BigNumber(400), headerText: "Three week ago" },
  ]);
  const [selectedWeeks, setSelectedWeeks] = useState<Set<number>>(new Set([]));
  const [totalVolume, setTotalVolume] = useState<BigNumber>(new BigNumber(0));

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
      const matches = _dataNfts.filter((mnft: any) => cnft.nonce === mnft.nonce);
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

      if (_owned) {
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
        console.log(parsedData);
        setVolumeHistory((prev: any) => {
          const newHistory = [...prev];
          newHistory[0].volume = new BigNumber(parsedData.data.nftDelegator?.getNftVolumeByWeek).div(Math.pow(10, 18)).decimalPlaces(2);
          return newHistory;
        });
      }
    } catch (err) {
      console.error(err);
      toastError((err as Error).message);
    }
  }

  // select object from volumeHistory based on selected week
  const selectFromVolumeHistory = (timestamp: number) => {
    return volumeHistory.find((item: any) => item.week === timestamp);
  };

  useEffect(() => {
    let newTotalVolume = new BigNumber(0);
    selectedWeeks.forEach((week) => {
      const weekData = selectFromVolumeHistory(week);
      newTotalVolume = newTotalVolume.plus(weekData.volume);
    });
    setTotalVolume(newTotalVolume);
  }, [selectedWeeks]);

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
                  <WeekSelector selectedWeeks={selectedWeeks} setSelectedWeeks={setSelectedWeeks} />
                  <TradeVolume
                    totalVolume={totalVolume}
                    volumeHistory={volumeHistory}
                    chartItem={volumeHistory.filter((item: any) => selectedWeeks.has(item.week))}
                  />
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
