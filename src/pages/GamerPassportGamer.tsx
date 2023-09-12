import React, { useEffect, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { ModalBody } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { IoClose } from "react-icons/io5";
import Modal from "react-modal";
import { DataNftCard, Loader } from "components";
import { GAMER_PASSPORT_GAMER_NONCES } from "config";
import { useGetAccount, useGetPendingTransactions } from "hooks";
import { modalStyles } from "libs/ui";
import { toastError } from "libs/utils";
import { onChainDataInsights_LIB, thirdPartyDataInsights_LIB } from "libs/utils/core";
import GamerInsights from "./GamerInsights";

export const GamerPassportGamer = () => {
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

    const _nfts: DataNft[] = await DataNft.createManyFromApi(GAMER_PASSPORT_GAMER_NONCES.map(v => ({ nonce: v })));
    console.log("ccDataNfts", _nfts);
    setCcDataNfts(_nfts);

    setIsLoading(false);
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
        mvxNativeAuthOrigins: [window.location.origin],
        mvxNativeAuthMaxExpirySeconds: 3000,
        fwdHeaderMapLookup: {
          "authorization": `Bearer ${tokenLogin.nativeAuthToken}`,
        },
      };
      console.log('arg', arg);

      res = await dataNft.viewDataViaMVXNativeAuth(arg);
      res.data = await (res.data as Blob).text();
      res.data = JSON.parse(res.data);
      console.log('res', res);

      fixData(res.data);
      setData(res.data);

      setIsFetchingDataMarshal(false);
    } else {
      openModal();
    }
  }

  const fixData = (rawData: any) => {
    if (rawData.items.length > 0) {
      const readingsInGroups = rawData.metaData.getDataConfig.dataToGather.allApplicableDataTypes.reduce((t: any, i: any) => {
        t[i.toString()] = [];
        return t;
      }, {});

      rawData.items.forEach((i: any) => {
        readingsInGroups[i.dataType].push(i);
      });

      const gamingActivityAll: any = [];
      const socialActivityAll: any = [];

      const onChainManualDataSets: any = {
        onChainAddrTxOnCon: [],
        onChainAddrTxOnConErd: [],
      };

      const thirdPartyManualDataSets: any = {
        discordBotUserOnGuildActivity: [],
        trdPtyWonderHeroGameApi: [],
      };

      Object.keys(readingsInGroups).forEach((dataType) => {
        switch (dataType) {
          case "4":
            {
              if (readingsInGroups["4"].length > 0) {
                const programOnChainReadingsWithInsights = onChainDataInsights_LIB({
                  rawReadings: readingsInGroups["4"],
                  userTz: "",
                });

                const readingsWithInsights: any = programOnChainReadingsWithInsights.readings;

                // S: Time Data graphs
                for (let i = 0; i < readingsWithInsights.length; i++) {
                  if (readingsWithInsights[i].manual === "OnChainAddrTxOnCon") {
                    const item = {
                      group: readingsWithInsights[i].scoreGroup,
                      time: readingsWithInsights[i].time,
                      when: readingsWithInsights[i].friendyCreatedAt,
                      val: 0,
                      data: readingsWithInsights[i].data,
                    };

                    onChainManualDataSets.onChainAddrTxOnCon.push(item);
                    gamingActivityAll.push(item);
                  } else if (readingsWithInsights[i].manual === "OnChainAddrTxOnConErd") {
                    const item = {
                      group: readingsWithInsights[i].scoreGroup,
                      time: readingsWithInsights[i].time,
                      when: readingsWithInsights[i].friendyCreatedAt,
                      val: 0,
                      data: readingsWithInsights[i].data,
                    };

                    onChainManualDataSets.onChainAddrTxOnConErd.push(item);
                    gamingActivityAll.push(item);
                  }
                }
                // E: Time Data graphs
              }
            }

            break;

          case "5":
            {
              if (readingsInGroups["5"].length > 0) {
                const thirdPartyReadingsWithInsights = thirdPartyDataInsights_LIB({
                  rawReadings: readingsInGroups["5"],
                  userTz: "",
                });

                const readingsWithInsights: any = thirdPartyReadingsWithInsights.readings;

                // S: Time Data graphs
                for (let i = 0; i < readingsWithInsights.length; i++) {
                  if (readingsWithInsights[i].manual === "DiscordBotUserOnGuildActivity") {
                    thirdPartyManualDataSets.discordBotUserOnGuildActivity.push({
                      // group: parseInt(readingsWithInsights[i].val, 10),
                      when: readingsWithInsights[i].friendyCreatedAt,
                      data: readingsWithInsights[i].data,
                      val: parseInt(readingsWithInsights[i].val, 10),
                    });

                    socialActivityAll.push(parseInt(readingsWithInsights[i].val, 10));
                  } else if (readingsWithInsights[i].manual === "TrdPtyWonderHeroGameApi") {
                    const item: any = {
                      group: readingsWithInsights[i].scoreGroup,
                      time: readingsWithInsights[i].time,
                      when: readingsWithInsights[i].friendyCreatedAt,
                      val: 0,
                      data: readingsWithInsights[i].data,
                    };

                    thirdPartyManualDataSets.trdPtyWonderHeroGameApi.push(item);
                    gamingActivityAll.push(item);
                  }
                }
                // E: Time Data graphs
              }
            }

            break;
        }
      });

      setActiveGamerData({
        readingsOnChainAddrTxOnCon: onChainManualDataSets.onChainAddrTxOnCon,
        readingsOnChainAddrTxOnConErd: onChainManualDataSets.onChainAddrTxOnConErd,
        readingsDiscordBotUserOnGuildActivity: thirdPartyManualDataSets.discordBotUserOnGuildActivity,
        readingsTrdPtyWonderHeroGameApi: thirdPartyManualDataSets.trdPtyWonderHeroGameApi,
        socialActivityAllData: socialActivityAll,
        gamingActivityAllData: gamingActivityAll,
      });
    }
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
          <h3 className="mt-5 text-center">Web3 Gamer Passport</h3>
          <h4 className="mt-2 text-center">Data NFTs that Unlock this App: {ccDataNfts.length}</h4>

          <div className="row mt-5">
            {ccDataNfts.length > 0 ? (
              ccDataNfts.map((dataNft, index) => (
                <DataNftCard key={index} index={index} dataNft={dataNft} isLoading={isLoading} owned={flags[index]} viewData={viewData} />
              ))
            ) : (
              <h3 className="text-center text-white">No Data NFTs</h3>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpened} onRequestClose={closeModal} style={modalStyles} ariaHideApp={false}>
        <div style={{ height: "3rem" }}>
          <div
            style={{
              float: "right",
              cursor: "pointer",
              fontSize: "2rem",
            }}
            onClick={closeModal}>
            <IoClose />
          </div>
        </div>
        <ModalHeader>
          <h4 className="text-center font-title font-weight-bold">Web3 Gamer Passport</h4>
        </ModalHeader>
        <ModalBody>
          {!owned ? (
            <div className="d-flex flex-column align-items-center justify-content-center">
              <h4 className="mt-3 font-title">You do not own this Data NFT</h4>
              <h6>(Buy the Data NFT from the marketplace to unlock the data)</h6>
            </div>
          ) : isFetchingDataMarshal || !data ? (
            <div
              className="d-flex flex-column align-items-center justify-content-center"
              style={{
                minWidth: "24rem",
                maxWidth: "100%",
                minHeight: "40rem",
                maxHeight: "80vh",
              }}>
              <div>
                <Loader noText />
                <p className="text-center font-weight-bold">
                  {"Loading..."}
                </p>
              </div>
            </div>
          ) : (
            <div
              style={{
                minWidth: "26rem",
                maxWidth: "100%",
                minHeight: "36rem",
                maxHeight: "60vh",
                overflowY: "auto",
              }}>
              <GamerInsights gamerId={"userId"} gamerData={activeGamerData} />
            </div>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};
