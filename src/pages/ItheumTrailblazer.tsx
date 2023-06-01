import React, { useEffect, useState } from "react";
import { SignableMessage } from "@multiversx/sdk-core/out";
import { signMessage } from "@multiversx/sdk-dapp/utils/account";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { ModalBody, Table } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { Radar } from "react-chartjs-2";
import { IoClose } from "react-icons/io5";
import Modal from "react-modal";
import imgBlurChart from "assets/img/blur-chart.png";
import { ElrondAddressLink, Loader } from "components";
import {
  CANTINA_CORNER_NONCES,
  CC_SHOW_SIZE,
  TRAILBLAZER_NONCES,
} from "config";
import {
  useGetAccount,
  useGetNetworkConfig,
  useGetPendingTransactions,
} from "hooks";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { toastError } from "libs/utils";
import "react-vertical-timeline-component/style.min.css";
import { FaCalendarCheck, FaHandshake, FaTrophy } from "react-icons/fa";

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

const customStyles = {
  content: {
    width: "80%",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxHeight: "80vh",
  },
};

export const ItheumTrailblazer = () => {
  const {
    network: { explorerAddress },
  } = useGetNetworkConfig();
  const { address } = useGetAccount();
  const { hasPendingTransactions } = useGetPendingTransactions();

  const [itDataNfts, setItDataNfts] = useState<DataNft[]>([]);
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

  async function fetchCantinaCornerNfts() {
    setIsLoading(true);

    const _nfts: DataNft[] = [];
    for (const nonce of TRAILBLAZER_NONCES) {
      const _nft = await DataNft.createFromApi(nonce);
      _nfts.push(_nft);
    }
    console.log("itDataNfts", _nfts);
    setItDataNfts(_nfts);

    setIsLoading(false);
  }

  async function fetchMyNfts() {
    setIsNftLoading(true);

    const _dataNfts = await DataNft.ownedByAddress(address);
    console.log("myDataNfts", _dataNfts);

    const _flags = [];
    for (const cnft of itDataNfts) {
      const matches = _dataNfts.filter((mnft) => cnft.nonce === mnft.nonce);
      _flags.push(matches.length > 0);
    }
    console.log("_flags", _flags);
    setFlags(_flags);

    setIsNftLoading(false);
  }

  useEffect(() => {
    if (!hasPendingTransactions) {
      fetchCantinaCornerNfts();
    }
  }, [hasPendingTransactions]);

  useEffect(() => {
    if (!isLoading && address) {
      fetchMyNfts();
    }
  }, [isLoading, address]);

  async function viewData(index: number) {
    if (!(index >= 0 && index < itDataNfts.length)) {
      toastError("Data is not loaded");
      return;
    }

    const _owned = flags[index];
    setOwned(_owned);

    if (_owned) {
      setIsFetchingDataMarshal(true);
      setDataMarshalRes("");
      openModal();

      const dataNft = itDataNfts[index];
      const messageToBeSigned = await dataNft.getMessageToSign();
      console.log("messageToBeSigned", messageToBeSigned);
      const signedMessage = await signMessage({ message: messageToBeSigned });
      console.log("signedMessage", signedMessage);
      const res = await dataNft.viewData(
        messageToBeSigned,
        signedMessage as any as SignableMessage
      );
      console.log("viewData", res);
      setDataMarshalRes(JSON.stringify(res, null, 4));
      setData(res.data);
      console.log("data", res.data);

      setIsFetchingDataMarshal(false);
    } else {
      openModal();
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  const getIconForCategory = (category: string) => {
    if (category === "Partnership") {
      return <FaHandshake />;
    } else if (category === "Achievement") {
      return <FaTrophy />;
    } else {
      return <FaCalendarCheck />;
    }
  };

  return (
    <div className="d-flex flex-fill justify-content-center container py-4">
      <div className="row w-100">
        <div className="col-12 mx-auto">
          <h4 className="mt-5 text-center">
            Itheum Trailblazer NFTs: {itDataNfts.length}
          </h4>

          <div className="row mt-5">
            {itDataNfts.length > 0 ? (
              itDataNfts.map((dataNft, index) => {
                return (
                  <div
                    className="col-12 col-md-6 col-lg-4 mb-3 d-flex justify-content-center"
                    key={`o-c-${index}`}
                  >
                    <div
                      className="card shadow-sm border-0"
                      style={{ backgroundColor: "#f6f8fa" }}
                    >
                      <div className="card-body p-3">
                        <div className="mb-4">
                          <img
                            className="data-nft-image"
                            src={
                              !isLoading
                                ? dataNft.nftImgUrl
                                : "https://media.elrond.com/nfts/thumbnail/default.png"
                            }
                          />
                        </div>

                        <div className="mt-4 mb-1">
                          <h5 className="text-center text-info">
                            Data NFT Info
                          </h5>
                        </div>
                        <div className="mb-1 row">
                          <span className="col-4 opacity-6">Title:</span>
                          <span className="col-8">{dataNft.title}</span>
                        </div>
                        <div className="mb-1 row">
                          <span className="col-4 opacity-6">Description:</span>
                          <span className="col-8">
                            {dataNft.description.length > 20
                              ? dataNft.description.slice(0, 20) + " ..."
                              : dataNft.description}
                          </span>
                        </div>
                        <div className="mb-1 row">
                          <span className="col-4 opacity-6">Creator:</span>
                          <span className="col-8">
                            {
                              <ElrondAddressLink
                                explorerAddress={explorerAddress}
                                address={dataNft.creator}
                                precision={6}
                              />
                            }
                          </span>
                        </div>
                        <div className="mb-1 row">
                          <span className="col-4 opacity-6">Created At:</span>
                          <span className="col-8">
                            {dataNft.creationTime.toLocaleString()}
                          </span>
                        </div>

                        <div className="mb-1 row">
                          <span className="col-4 opacity-6">Identifier:</span>
                          <span className="col-8">
                            {dataNft.tokenIdentifier}
                          </span>
                        </div>
                        <div className="mb-1 row">
                          <span className="col-4 opacity-6">Supply:</span>
                          <span className="col-8">{dataNft.supply}</span>
                        </div>
                        <div className="mb-1 row">
                          <span className="col-4 opacity-6">Royalties:</span>
                          <span className="col-8">
                            {dataNft.royalties + "%"}
                          </span>
                        </div>

                        <div className="mt-3 text-center">
                          {flags[index] ? (
                            <h6 className="font-title font-weight-bold">
                              You have this Data NFT
                            </h6>
                          ) : (
                            <h6 className="font-title font-weight-bold opacity-6">
                              You do not have this Data NFT
                            </h6>
                          )}
                        </div>

                        <div className="mt-4 mb-1 d-flex justify-content-center">
                          <button
                            className="btn btn-primary"
                            onClick={() => viewData(index)}
                          >
                            View Data
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <h3 className="text-center text-white">No DataNFT</h3>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpened}
        onRequestClose={closeModal}
        style={customStyles}
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
                (Buy the Data NFT from marketplace if you want to see data)
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
              <Loader />
            </div>
          ) : (
            <div>
              <VerticalTimeline>
                {data.map((_dataItem: any, _index: any) => {
                  return (
                    <VerticalTimelineElement
                      icon={getIconForCategory(_dataItem.category)}
                    >
                      <h2>
                        {_dataItem.category} -{" "}
                        {new Date(_dataItem.date).toUTCString()}
                      </h2>
                      <h3>{_dataItem.title}</h3>
                      <a href={_dataItem.link} target="_blank">
                        <h6>See more...</h6>
                      </a>
                    </VerticalTimelineElement>
                  );
                })}
              </VerticalTimeline>
            </div>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};
