import React, { useEffect, useState } from "react";
import { SignableMessage } from "@multiversx/sdk-core/out";
import { useSignMessage } from "@multiversx/sdk-dapp/hooks/signMessage/useSignMessage";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { ModalBody, Table } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { Radar } from "react-chartjs-2";
import { IoClose } from "react-icons/io5";
import Modal from "react-modal";
import imgBlurChart from "assets/img/blur-chart.png";
import { DataNftCard, ElrondAddressLink, Loader } from "components";
import { CANTINA_CORNER_NONCES, CC_SHOW_SIZE } from "config";
import {
  useGetAccount,
  useGetNetworkConfig,
  useGetPendingTransactions,
} from "hooks";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { toastError } from "libs/utils";
import { modalStyles } from "libs/ui";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export const BORDER_COLORS = [
  "#ff6384",
  "#3366CC",
  "#DC3912",
  "#FF9900",
  "#109618",
  "#990099",
  "#3B3EAC",
  "#0099C6",
  "#DD4477",
  "#66AA00",
  "#B82E2E",
  "#316395",
  "#994499",
  "#22AA99",
  "#AAAA11",
  "#6633CC",
  "#E67300",
  "#8B0707",
  "#329262",
  "#5574A6",
  "#3B3EAC",
  "#ffa600",
  "#ff7c43",
];

export const BACKGROUND_COLORS = [
  "#ff638433",
  "#3366CC33",
  "#DC391233",
  "#FF990033",
  "#10961833",
  "#99009933",
  "#3B3EAC33",
  "#0099C633",
  "#DD447733",
  "#66AA0033",
  "#B82E2E33",
  "#31639533",
  "#99449933",
  "#22AA9933",
  "#AAAA1133",
  "#6633CC33",
  "#E6730033",
  "#8B070733",
  "#32926233",
  "#5574A633",
  "#3B3EAC33",
  "#ffa60033",
  "#ff7c4333",
];

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Cantina Corner Ranking",
    },
  },
};

export const CantinaCorner = () => {
  const {
    network: { explorerAddress },
  } = useGetNetworkConfig();
  const { address } = useGetAccount();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { loginMethod } = useGetLoginInfo();
  const { signMessage } = useSignMessage();

  const [ccDataNfts, setCcDataNfts] = useState<DataNft[]>([]);
  const [flags, setFlags] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNftLoading, setIsNftLoading] = useState(false);

  const [dataMarshalRes, setDataMarshalRes] = useState<string>("");
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] =
    useState<boolean>(true);
  const [owned, setOwned] = useState<boolean>(false);

  const [players, setPlayers] = useState<any[]>([]);
  const [data, setData] = useState<any>();

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
      CANTINA_CORNER_NONCES
    );
    console.log("ccDataNfts", _nfts);
    setCcDataNfts(_nfts);

    setIsLoading(false);
  }

  async function fetchMyNfts() {
    setIsNftLoading(true);

    const _dataNfts = await DataNft.ownedByAddress(address);
    console.log("myDataNfts", _dataNfts);

    const _flags = [];
    for (const cnft of ccDataNfts) {
      const matches = _dataNfts.filter((mnft) => cnft.nonce === mnft.nonce);
      _flags.push(matches.length > 0);
    }
    console.log("_flags", _flags);
    setFlags(_flags);

    setIsNftLoading(false);
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
      console.log("messageToBeSigned", messageToBeSigned);
      const signedMessage = await signMessage({ message: messageToBeSigned });
      console.log("signedMessage", signedMessage);
      if (!signedMessage) {
        toastError("Wallet signing failed.");
        return;
      }

      const res = await dataNft.viewData(
        messageToBeSigned,
        signedMessage as any
      );
      res.data = await (res.data as Blob).text();
      res.data = JSON.parse(res.data);
      console.log("viewData", res);
      setDataMarshalRes(JSON.stringify(res.data, null, 4));

      const players = res.data.sort((pa: any, pb: any) => pa.rank - pb.rank);

      const datasets = [];
      for (let i = 0; i < CC_SHOW_SIZE; i++) {
        if (i + 1 >= players.length) break;
        const player = players[i];
        datasets.push({
          label: player.nickname,
          data: [player.kills, player.deaths, player.wins, player.losses],
          backgroundColor: BACKGROUND_COLORS[i % BACKGROUND_COLORS.length],
          borderColor: BORDER_COLORS[i % BORDER_COLORS.length],
          borderWidth: 1,
        });
      }
      setPlayers(players);

      const _data = {
        labels: ["Kills", "Deaths", "Wins", "Losses"],
        datasets,
      };
      setData(_data);

      setIsFetchingDataMarshal(false);
    } else {
      openModal();
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="d-flex flex-fill justify-content-center container py-4">
      <div className="row w-100">
        <div className="col-12 mx-auto">
          <h4 className="mt-5 text-center">
            Cantina Corner NFTs: {ccDataNfts.length}
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
              <h3 className="text-center text-white">No DataNFT</h3>
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
          <h4 className="text-center font-title font-weight-bold">View Data</h4>
        </ModalHeader>
        <ModalBody>
          {!owned ? (
            <div
              className="d-flex flex-column align-items-center justify-content-center"
              style={{
                minWidth: "24rem",
                maxWidth: "50vw",
                minHeight: "40rem",
                maxHeight: "80vh",
              }}
            >
              <img
                src={imgBlurChart}
                style={{ width: "24rem", height: "auto" }}
              />
              <h4 className="mt-3 font-title">You do not own this Data NFT</h4>
              <h6>
                (Buy the Data NFT from the marketplace to unlock the data)
              </h6>
            </div>
          ) : isFetchingDataMarshal || !data ? (
            <div
              className="d-flex flex-column align-items-center justify-content-center"
              style={{
                minWidth: "24rem",
                maxWidth: "50vw",
                minHeight: "40rem",
                maxHeight: "80vh",
              }}
            >
              <div>
                <Loader noText />
                <p className="text-center font-weight-bold">
                  {["ledger", "walletconnectv2", "extra"].includes(loginMethod)
                    ? "Please sign the message using xPortal or Ledger"
                    : "Loading..."}
                </p>
              </div>
            </div>
          ) : (
            <div
              style={{
                minWidth: "26rem",
                maxWidth: "50vw",
                minHeight: "36rem",
                maxHeight: "60vh",
                overflowY: "auto",
                // backgroundColor: "#f6f8fa",
              }}
            >
              <h5 className="mt-3 mb-4 text-center font-title font-weight-bold">
                TOP {CC_SHOW_SIZE} Players
              </h5>
              <Radar options={chartOptions} data={data} />
              {/* <p className='p-2' style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{dataMarshalRes}</p> */}
              <Table striped responsive className="mt-3">
                <thead>
                  <tr className="bg-info">
                    <th>#</th>
                    <th>Nickname</th>
                    <th>Rank</th>
                    <th>Kills</th>
                    <th>Deaths</th>
                    <th>Wins</th>
                    <th>Losses</th>
                  </tr>
                </thead>
                <tbody>
                  {players
                    .slice(0, CC_SHOW_SIZE)
                    .map((player: any, index: number) => (
                      <tr key={`c-c-p-${index}`}>
                        <td>{index + 1}</td>
                        <td>{player.nickname}</td>
                        <td>{player.rank}</td>
                        <td>{player.kills}</td>
                        <td>{player.deaths}</td>
                        <td>{player.wins}</td>
                        <td>{player.losses}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};
