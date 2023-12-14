import React, { useEffect, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { IoClose } from "react-icons/io5";
import { ESDT_BUBBLE_TOKENS, PLAYSTATION_GAMER_PASSPORT_TOKENS } from "appsConfig";
import { DataNftCard, Loader } from "components";
import { useGetAccount, useGetPendingTransactions } from "hooks";
import { modalStyles } from "libs/ui";
import { decodeNativeAuthToken, nativeAuthOrigins, toastError } from "libs/utils";
import PlaystationGamerInsights from "./PlaystationGamerInsights";
import { HeaderComponent } from "../components/Layout/HeaderComponent";

export const PlayStationGamer = () => {
  const { address } = useGetAccount();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { tokenLogin } = useGetLoginInfo();

  const [ccDataNfts, setCcDataNfts] = useState<DataNft[]>([]);
  const [flags, setFlags] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  const [owned, setOwned] = useState<boolean>(false);

  const [data, setData] = useState<any>();

  const [activeGamerData, setActiveGamerData] = useState<any>(null);

  const [isModalOpened, setIsModalOpenend] = useState<boolean>(false);
  function openModal() {
    setIsModalOpenend(true);
  }
  function closeModal() {
    setIsModalOpenend(false);
  }

  async function fetchAppNfts() {
    setIsLoading(true);

    if (PLAYSTATION_GAMER_PASSPORT_TOKENS.length > 0) {
      const _nfts: DataNft[] = await DataNft.createManyFromApi(
        PLAYSTATION_GAMER_PASSPORT_TOKENS.map((v) => ({ nonce: v.nonce, tokenIdentifier: v.tokenIdentifier }))
      );
      // console.log("ccDataNfts", _nfts);
      setCcDataNfts(_nfts);
      setIsLoading(false);
    } else {
      toastError("No identifier for this Widget.");
      setIsLoading(false);
    }
  }

  async function fetchMyNfts() {
    const _dataNfts = await DataNft.ownedByAddress(address);

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
    setOwned(_owned);

    if (_owned) {
      setIsFetchingDataMarshal(true);
      openModal();

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

      res = await dataNft.viewDataViaMVXNativeAuth(arg);
      res.data = await (res.data as Blob).text();
      res.data = JSON.parse(res.data);

      fixData(res.data);
      setData(res.data);

      setIsFetchingDataMarshal(false);
    } else {
      openModal();
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

    // if (rawData.items.length > 0) {
    //   const readingsInGroups = rawData.metaData.getDataConfig.dataToGather.allApplicableDataTypes.reduce((t:any, i:any) => {
    //     t[i.toString()] = [];
    //     return t;
    //   }, {});

    //   rawData.items.forEach((i : any) => {
    //     readingsInGroups[i.dataType].push(i);
    //   });

    //   const gamingActivityAll : any = [];
    //   const socialActivityAll : any = [];

    //   const onChainManualDataSets : any = {
    //     onChainAddrTxOnCon: [],
    //     onChainAddrTxOnConErd: []
    //   };

    //   const thirdPartyManualDataSets : any = {
    //     discordBotUserOnGuildActivity: [],
    //     trdPtyWonderHeroGameApi: [],
    //   };

    //   Object.keys(readingsInGroups).forEach(dataType => {
    //     switch (dataType) {
    //       case '4': {
    //         if (readingsInGroups['4'].length > 0) {
    //           const programOnChainReadingsWithInsights = onChainDataInsights_LIB({
    //             rawReadings: readingsInGroups['4'],
    //             userTz: ''
    //           });

    //           const readingsWithInsights : any = programOnChainReadingsWithInsights.readings;

    //           // S: Time Data graphs
    //           for (let i = 0; i < readingsWithInsights.length; i++) {
    //             if (readingsWithInsights[i].manual === 'OnChainAddrTxOnCon') {
    //               const item = {
    //                 group: readingsWithInsights[i].scoreGroup,
    //                 time: readingsWithInsights[i].time,
    //                 when: readingsWithInsights[i].friendyCreatedAt,
    //                 val: 0,
    //                 data: readingsWithInsights[i].data
    //               };

    //               onChainManualDataSets.onChainAddrTxOnCon.push(item);
    //               gamingActivityAll.push(item);
    //             }
    //             else if (readingsWithInsights[i].manual === 'OnChainAddrTxOnConErd') {
    //               const item = {
    //                 group: readingsWithInsights[i].scoreGroup,
    //                 time: readingsWithInsights[i].time,
    //                 when: readingsWithInsights[i].friendyCreatedAt,
    //                 val: 0,
    //                 data: readingsWithInsights[i].data
    //               };

    //               onChainManualDataSets.onChainAddrTxOnConErd.push(item);
    //               gamingActivityAll.push(item);
    //             }
    //           }
    //           // E: Time Data graphs
    //         }
    //       }

    //         break;

    //       case '5': {
    //         if (readingsInGroups['5'].length > 0) {
    //           const thirdPartyReadingsWithInsights = thirdPartyDataInsights_LIB({
    //             rawReadings: readingsInGroups['5'],
    //             userTz: ''
    //           });

    //           const readingsWithInsights : any = thirdPartyReadingsWithInsights.readings;

    //           // S: Time Data graphs
    //           for (let i = 0; i < readingsWithInsights.length; i++) {
    //             if (readingsWithInsights[i].manual === 'DiscordBotUserOnGuildActivity') {
    //               thirdPartyManualDataSets.discordBotUserOnGuildActivity.push(
    //                 {
    //                   // group: parseInt(readingsWithInsights[i].val, 10),
    //                   when: readingsWithInsights[i].friendyCreatedAt,
    //                   data: readingsWithInsights[i].data,
    //                   val: parseInt(readingsWithInsights[i].val, 10)
    //                 }
    //               );

    //               socialActivityAll.push(parseInt(readingsWithInsights[i].val, 10));

    //             } else if (readingsWithInsights[i].manual === 'TrdPtyWonderHeroGameApi') {
    //               const item : any = {
    //                 group: readingsWithInsights[i].scoreGroup,
    //                 time: readingsWithInsights[i].time,
    //                 when: readingsWithInsights[i].friendyCreatedAt,
    //                 val: 0,
    //                 data: readingsWithInsights[i].data
    //               };

    //               thirdPartyManualDataSets.trdPtyWonderHeroGameApi.push(item);
    //               gamingActivityAll.push(item);
    //             }
    //           }
    //           // E: Time Data graphs
    //         }
    //       }

    //         break;
    //     }
    //   });

    //   setActiveGamerData({
    //     readingsOnChainAddrTxOnCon: onChainManualDataSets.onChainAddrTxOnCon,
    //     readingsOnChainAddrTxOnConErd: onChainManualDataSets.onChainAddrTxOnConErd,
    //     readingsDiscordBotUserOnGuildActivity: thirdPartyManualDataSets.discordBotUserOnGuildActivity,
    //     readingsTrdPtyWonderHeroGameApi: thirdPartyManualDataSets.trdPtyWonderHeroGameApi,
    //     socialActivityAllData: socialActivityAll,
    //     gamingActivityAllData: gamingActivityAll,
    //   });
    // }
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
      {/*<>*/}
      {/*  /!*<Modal isOpen={isModalOpened} onRequestClose={closeModal} style={modalStyles} ariaHideApp={false}>*!/*/}
      {/*  <div style={{ height: "3rem" }}>*/}
      {/*    <div*/}
      {/*      style={{*/}
      {/*        float: "right",*/}
      {/*        cursor: "pointer",*/}
      {/*        fontSize: "2rem",*/}
      {/*      }}*/}
      {/*      onClick={closeModal}>*/}
      {/*      <IoClose />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <h4 className="text-center font-title font-weight-bold">PlayStation Gamer Passport</h4>*/}
      {/*  /!*<ModalBody>*!/*/}
      {/*  {!owned ? (*/}
      {/*    <div className="flex flex-col items-center justify-center">*/}
      {/*      <h4 className="mt-3 font-title">You do not own this Data NFT</h4>*/}
      {/*      <h6>(Buy the Data NFT from the marketplace to unlock the data)</h6>*/}
      {/*    </div>*/}
      {/*  ) : isFetchingDataMarshal || !data ? (*/}
      {/*    <div className="flex flex-col items-center justify-center min-w-[24rem] max-w-[100%] min-h-[40rem] max-h-[80svh]">*/}
      {/*      <div>*/}
      {/*        <Loader noText />*/}
      {/*        <p className="text-center font-weight-bold">{"Loading..."}</p>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  ) : (*/}
      {/*    <div*/}
      {/*      style={{*/}
      {/*        minWidth: "26rem",*/}
      {/*        maxWidth: "100%",*/}
      {/*        minHeight: "36rem",*/}
      {/*        maxHeight: "60vh",*/}
      {/*        overflowY: "auto",*/}
      {/*      }}>*/}
      {/*      <PlaystationGamerInsights gamerId={"userId"} gamerData={activeGamerData} />*/}
      {/*    </div>*/}
      {/*  )}*/}
      {/*  /!*</ModalBody>*!/*/}
      {/*  /!*</Modal>*!/*/}
      {/*</>*/}
    </HeaderComponent>
  );
};
