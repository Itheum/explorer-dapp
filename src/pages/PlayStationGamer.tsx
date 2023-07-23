import React, { useEffect, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { SignableMessage } from "@multiversx/sdk-core/out";
import { signMessage } from "@multiversx/sdk-dapp/utils/account";
import { ModalBody } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { IoClose } from "react-icons/io5";
import Modal from "react-modal";
import imgBlurChart from "assets/img/blur-chart.png";
import { DataNftCard, Loader } from "components";
import { PLAYSTATION_GAMER_PASSPORT_NONCES } from "config";
import { useGetAccount, useGetPendingTransactions } from "hooks";
import { modalStyles } from "libs/ui";
import { toastError } from "libs/utils";
import PlaystationGamerInsights from "./PlaystationGamerInsights";

export const PlayStationGamer = () => {
  const { address } = useGetAccount();
  const { hasPendingTransactions } = useGetPendingTransactions();

  const [ccDataNfts, setCcDataNfts] = useState<DataNft[]>([]);
  const [flags, setFlags] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [dataMarshalRes, setDataMarshalRes] = useState<string>("");
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] =
    useState<boolean>(true);
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

    const _nfts: DataNft[] = await DataNft.createManyFromApi(
      PLAYSTATION_GAMER_PASSPORT_NONCES
    );
    console.log("ccDataNfts", _nfts);
    setCcDataNfts(_nfts);

    setIsLoading(false);
  }

  async function fetchMyNfts() {
    const _dataNfts = await DataNft.ownedByAddress(address);
    console.log("myDataNfts", _dataNfts);

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
      setDataMarshalRes("");
      openModal();

      const dataNft = ccDataNfts[index];
      const messageToBeSigned = await dataNft.getMessageToSign();
      // console.log('messageToBeSigned', messageToBeSigned);
      const signedMessage = await signMessage({ message: messageToBeSigned });
      // console.log('signedMessage', signedMessage);
      const res = await dataNft.viewData(
        messageToBeSigned,
        signedMessage as any as SignableMessage
      );
      res.data = await (res.data as Blob).text();
      res.data = JSON.parse(res.data);
      // console.log('viewData', res);
      setDataMarshalRes(JSON.stringify(res.data, null, 4));

      fixData(res.data);

      setData(res.data);

      console.log(res.data);

      setIsFetchingDataMarshal(false);
    } else {
      openModal();
    }
  }

  const fixData = (rawData: any) => {
    console.log("rawData", rawData);

    const titleAndTrophies = rawData.trophy_titles.reduce(
      (total: any, item: any) => {
        if (!total[item.name]) {
          total[item.name] = {};
        }

        total[item.name].trophies = {
          ...item,
        };

        return total;
      },
      {}
    );

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
    <div className="d-flex flex-fill justify-content-center container py-4">
      <div className="row w-100">
        <div className="col-12 mx-auto">
          <h3 className="mt-5 text-center">PlayStation Gamer Passport</h3>
          <h4 className="mt-2 text-center">
            Data NFTs that Unlock this App: {ccDataNfts.length}
          </h4>

          <div className="row mt-5">
            {ccDataNfts.length > 0 ? (
              ccDataNfts.map((dataNft, index) => (
                <DataNftCard
                  key={index}
                  index={index}
                  dataNft={dataNft}
                  isLoading={isLoading}
                  owned={flags[index]}
                  viewData={viewData}
                />
              ))
            ) : (
              <h3 className="text-center text-white">No Data NFTs</h3>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpened}
        onRequestClose={closeModal}
        style={modalStyles}
        ariaHideApp={false}
      >
        <div style={{ height: "3rem" }}>
          <div
            style={{
              float: "right",
              cursor: "pointer",
              fontSize: "2rem",
            }}
            onClick={closeModal}
          >
            <IoClose />
          </div>
        </div>
        <ModalHeader>
          <h4 className="text-center font-title font-weight-bold">
            PlayStation Gamer Passport
          </h4>
        </ModalHeader>
        <ModalBody>
          {!owned ? (
            <div className="d-flex flex-column align-items-center justify-content-center">
              <img
                src={imgBlurChart}
                style={{ width: "90%", height: "auto" }}
              />
              <h4 className="mt-3 font-title">You do not own this Data NFT</h4>
              <h6>
                (Buy the Data NFT from marketplace if you want to see data)
              </h6>
            </div>
          ) : isFetchingDataMarshal || !data ? (
            <div
              className="d-flex flex-column align-items-center justify-content-center"
              style={{
                minWidth: "24rem",
                maxWidth: "100%",
                minHeight: "40rem",
                maxHeight: "80vh",
              }}
            >
              <Loader />
            </div>
          ) : (
            <div
              style={{
                minWidth: "26rem",
                maxWidth: "100%",
                minHeight: "36rem",
                maxHeight: "60vh",
                overflowY: "auto",
              }}
            >
              <PlaystationGamerInsights
                gamerId={"userId"}
                gamerData={activeGamerData}
              />
            </div>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};
