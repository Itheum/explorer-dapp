import React, { useEffect, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { SignableMessage } from "@multiversx/sdk-core/out";
import { signMessage } from "@multiversx/sdk-dapp/utils/account";
import { ModalBody } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import {
  FaCalendarCheck,
  FaHandshake,
  FaTrophy,
  FaMoneyBillAlt,
  FaChessKnight,
  FaChartBar,
  FaShopify,
  FaShoppingCart,
  FaFlagCheckered,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Modal from "react-modal";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import imgBlurChart from "assets/img/blur-chart.png";
import { DataNftCard, ElrondAddressLink, Loader } from "components";
import { MARKETPLACE_DETAILS_PAGE, TRAILBLAZER_NONCES } from "config";
import {
  useGetAccount,
  useGetNetworkConfig,
  useGetPendingTransactions,
} from "hooks";
import { toastError } from "libs/utils";
import "react-vertical-timeline-component/style.min.css";
import headerHero from "assets/img/custom-app-header-trailblazer.png";

const customStyles = {
  overlay: {
    backgroundColor: "var(--light-20) !important",
    backdropFilter: "blur(10px)",
  },
  content: {
    width: "80%",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxHeight: "80vh",
    backgroundColor: "var(--light)",
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
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] =
    useState<boolean>(true);
  const [owned, setOwned] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

  function openModal() {
    setIsModalOpened(true);
  }
  function closeModal() {
    setIsModalOpened(false);
  }

  async function fetchAppNfts() {
    setIsLoading(true);

    const _nfts: DataNft[] = await DataNft.createManyFromApi(
      TRAILBLAZER_NONCES
    );

    setItDataNfts(_nfts);
    setIsLoading(false);
  }

  async function fetchMyNfts() {
    setIsNftLoading(true);

    const _dataNfts = await DataNft.ownedByAddress(address);
    const _flags = [];

    for (const cnft of itDataNfts) {
      const matches = _dataNfts.filter((mnft) => cnft.nonce === mnft.nonce);
      _flags.push(matches.length > 0);
    }

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
    if (!(index >= 0 && index < itDataNfts.length)) {
      toastError("Data is not loaded");
      return;
    }

    const _owned = flags[index];
    setOwned(_owned);

    if (_owned) {
      setIsFetchingDataMarshal(true);
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
      res.data = await (res.data as Blob).text();
      res.data = JSON.parse(res.data);

      console.log("viewData", res);
      console.log(JSON.stringify(res.data, null, 4));

      setData(res.data.data.reverse());
      setIsFetchingDataMarshal(false);
    } else {
      openModal();
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  const getIconForCategory = (dataItem: any) => {
    switch (dataItem.category) {
      case "Partnership":
        return <FaHandshake />;
        break;
      case "Achievement":
        return <FaTrophy />;
        break;
      case "Offer":
        return <FaMoneyBillAlt />;
        break;
      case "Quest":
        return <FaChessKnight />;
        break;
      case "Leaderboard":
        return <FaChartBar />;
        break;
      default:
        return <FaCalendarCheck />;
        break;
    }
  };

  const getTileForCategory = (dataItem: any) => {
    let tileCode: any = null;

    switch (dataItem.category) {
      case "Offer":
        tileCode = (
          <div className="base-tile offer">
            <div className="header">
              <div className="title">
                Congratulations! You've unlocked a special offer.
              </div>
            </div>
            <div className="body">
              <div className="icon">
                <FaShoppingCart />
              </div>
              <div className="item">{dataItem.title}</div>
              <a className="action" href={dataItem.link} target="_blank">
                <div>Grab your offer now!</div>
              </a>
            </div>
            <div className="footer">
              <div className="added">
                Added on: {new Date(dataItem.date).toUTCString()}
              </div>
              <div className="platform">
                Claimable On:{" "}
                <span className="icon">
                  <FaShopify />
                </span>
              </div>
            </div>
          </div>
        );
        break;
      case "Quest":
        tileCode = (
          <div className="base-tile quest">
            <div className="header">
              <div className="title">Psst! A secret quest is underway.</div>
            </div>
            <div className="body">
              <div className="icon">
                <FaFlagCheckered />
              </div>
              <div className="item">{dataItem.title}</div>
              <a className="action" href={dataItem.link} target="_blank">
                <div>Join quest!</div>
              </a>
            </div>
            <div className="footer">
              <div className="added">
                Added on: {new Date(dataItem.date).toUTCString()}
              </div>
            </div>
          </div>
        );
        break;
      case "Leaderboard":
        tileCode = (
          <div className="base-tile leaderboard">
            <div className="header">
              <div className="title">Secret Leaderboard</div>
              <div className="sub-title">{dataItem.title}</div>
            </div>
            <div className="body">
              {(normalizeLeaderboardData(dataItem.link).processedSuccess ===
                false && (
                <div className="process-error">
                  {normalizeLeaderboardData(dataItem.link).processMsg}
                </div>
              )) || (
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Address</th>
                      <th scope="col">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {normalizeLeaderboardData(dataItem.link).tableData.map(
                      (rowData: any, idx: number) => {
                        return (
                          <tr>
                            <th scope="row">{++idx}</th>
                            <td>{rowData.leaderAddress}</td>
                            <td>{rowData.points}</td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              )}
            </div>
            <div className="footer">
              <div className="added">
                Added on: {new Date(dataItem.date).toUTCString()}
              </div>
            </div>
          </div>
        );
        break;
      default:
        tileCode = (
          <>
            <h2>
              {dataItem.category} - {new Date(dataItem.date).toUTCString()}
            </h2>
            <h3>{dataItem.title}</h3>
            <a href={dataItem.link} target="_blank">
              <h6>See more...</h6>
            </a>
          </>
        );
        break;
    }

    return tileCode;
  };

  function normalizeLeaderboardData(rawData: string) {
    const leaderBoard: {
      processedSuccess: boolean;
      tableData: any;
      processMsg: string;
    } = {
      processedSuccess: false,
      tableData: [],
      processMsg: "",
    };

    try {
      const addressPointAry = rawData
        .split(":")
        .map((i: string) => {
          const [leaderAddress, points] = i.split("_");
          return { leaderAddress, points: parseInt(points, 10) };
        })
        .sort(function (x, y) {
          return y.points - x.points; // sort in descending order of points
        });

      leaderBoard.processedSuccess = true;
      leaderBoard.tableData = addressPointAry;
    } catch (e) {
      leaderBoard.processMsg = `ERROR processing leaderBoard. Check console for error details.`;
      console.log("----------- ERROR (S) -----------");
      console.log("Processing leaderBoard data =", rawData);
      console.log("Error =");
      console.error(e);
      console.log("----------- ERROR (E) -----------");
    }

    return leaderBoard;
  }

  return (
    <div className="container d-flex flex-fill justify-content-center py-4 c-marketplace-app">
      <div className="row w-100">
        <div className="col-12 mx-auto">
          <div className="hero">
            {" "}
            <img src={headerHero} style={{ width: "100%", height: "auto" }} />
          </div>
          <div className="body">
            {/* <h3 className="mt-5 text-center">TrailBlazer</h3> */}
            <h4 className="my-3 text-center">
              Data NFTs that Unlock this App: {itDataNfts.length}
            </h4>

            <div className="row mt-5">
              {itDataNfts.length > 0 ? (
                itDataNfts.map((dataNft, index) => (
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
          <div className="footer"></div>
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
          <h4 className="text-center font-title font-weight-bold">
            Itheum TrailBlazer
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
            <div className="trailblazer-view">
              <VerticalTimeline>
                {data?.map((_dataItem: any, _index: any) => {
                  return (
                    <VerticalTimelineElement
                      key={_index}
                      icon={getIconForCategory(_dataItem)}
                    >
                      {getTileForCategory(_dataItem)}
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
