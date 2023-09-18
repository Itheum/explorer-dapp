import React, { useState } from "react";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { ModalBody, ModalHeader } from "react-bootstrap";
import { FaCalendarCheck, FaChartBar, FaChessKnight, FaFlagCheckered, FaHandshake, FaMoneyBillAlt, FaShopify, FaShoppingCart, FaTrophy } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Modal from "react-modal";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import { Loader } from "components";
import { IFrameModal } from "./IFrameModal";
import { TwModal } from "./Modal/TwModal";

const customStyles = {
  overlay: {
    backgroundColor: "var(--light-20) !important",
    backdropFilter: "blur(10px)",
  },
  // dark: {
  //   backgroundColor: "var(--background)",
  // },
  // content: {
  //   width: "80%",
  //   top: "50%",
  //   left: "50%",
  //   right: "auto",
  //   bottom: "auto",
  //   marginRight: "-50%",
  //   transform: "translate(-50%, -50%)",
  //   maxHeight: "80vh",
  //   backgroundColor: "var(--light)",
  //   color: "var(--dark)",
  // },
};

export const TrailBlazerModal = ({
  isModalOpened,
  closeModal,
  owned,
  isFetchingDataMarshal,
  data,
}: {
  isModalOpened: boolean;
  closeModal: () => void;
  owned: boolean;
  isFetchingDataMarshal: boolean;
  data: any;
}) => {
  const { loginMethod } = useGetLoginInfo();
  const [content, setContent] = useState<React.ReactElement>(<></>);
  // const [title, setTitle] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleIFrameModal = (link: string) => {
    setContent(<IFrameModal link={link} />);
    setIsModalOpen(true);
  };

  // const handleCloseModal = () => {
  //   setContent(<></>);
  // };

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
              <div className="title">Congratulations! You've unlocked a special offer.</div>
            </div>
            <div className="body">
              <div className="icon">
                <FaShoppingCart />
              </div>
              <div className="item">{dataItem.title}</div>
              <a className="bg-yellow-300 px-1.5 py-2 rounded-lg" href={dataItem.link} target="_blank">
                <div>Grab your offer now!</div>
              </a>
            </div>
            <div className="footer">
              <div className="added">Added on: {new Date(dataItem.date).toDateString()}</div>
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

              <button
                className="bg-[#ff7201] rounded-lg"
                onClick={() => {
                  handleIFrameModal(dataItem.link);
                }}>
                <TwModal isModalOpen={isModalOpen} content={content} setIsModalOpen={setIsModalOpen} />
              </button>
            </div>
            <div className="footer">
              <div className="added">Added on: {new Date(dataItem.date).toDateString()}</div>
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
              {(normalizeLeaderboardData(dataItem.link).processedSuccess === false && (
                <div className="process-error">{normalizeLeaderboardData(dataItem.link).processMsg}</div>
              )) || (
                <table className="table">
                  <thead className="!text-black">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Address</th>
                      <th scope="col">Points</th>
                    </tr>
                  </thead>
                  <tbody className="!text-black">
                    {normalizeLeaderboardData(dataItem.link).tableData.map((rowData: any, idx: number) => {
                      return (
                        <tr>
                          <th scope="row">{++idx}</th>
                          <td>{rowData.leaderAddress}</td>
                          <td>{rowData.points}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
            <div className="footer">
              <div className="added">Added on: {new Date(dataItem.date).toDateString()}</div>
            </div>
          </div>
        );
        break;
      default:
        tileCode = (
          <div className="news-tile">
            <h2>
              {dataItem.category} - {new Date(dataItem.date).toDateString()}
            </h2>
            <h3>{dataItem.title}</h3>
            <a href={dataItem.link} target="_blank" className="!text-blue-500">
              See more...
            </a>
          </div>
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
    <Modal
      isOpen={isModalOpened}
      onRequestClose={closeModal}
      className="absolute overflow-y-scroll scrollbar !w-[80%] !top-[50%] !left-[50%] !right-auto !bottom-auto !-mr-[50%] !-translate-x-[50%] !-translate-y-[50%] !max-h-[79vh] !bg-background !shadow-md  !shadow-foreground rounded-2xl"
      style={customStyles}
      ariaHideApp={false}
      shouldCloseOnOverlayClick={false}>
      <div className="sticky-top flex flex-row justify-between backdrop-blur bg-background/60">
        <ModalHeader className="border-0">
          <h2 className="text-center p-3 text-card-foreground">Trailblazer</h2>
        </ModalHeader>
        <div className="flex items-center h-[6rem]">
          <div className="flex justify-center cursor-pointer text-[2rem] text-card-foreground" onClick={closeModal}>
            <IoClose />
          </div>
        </div>
      </div>
      <ModalBody>
        {!owned ? (
          <div className="flex flex-col items-center justify-center">
            <h4 className="mt-3 font-title">You do not own this Data NFT</h4>
            <h6>(Buy the Data NFT from the marketplace to unlock the data)</h6>
          </div>
        ) : isFetchingDataMarshal || !data ? (
          <div
            className="flex flex-col items-center justify-center"
            style={{
              minWidth: "24rem",
              maxWidth: "100%",
              minHeight: "40rem",
              maxHeight: "80vh",
            }}>
            <div>
              <Loader noText />
              <p className="text-center font-weight-bold">
                {["ledger", "walletconnectv2", "extra"].includes(loginMethod) ? "Please sign the message using xPortal or Ledger" : "Loading..."}
              </p>
            </div>
          </div>
        ) : (
          <div className="trailblazer-view text-black">
            <VerticalTimeline>
              {data?.map((_dataItem: any, _index: any) => {
                return (
                  <VerticalTimelineElement key={_index} icon={getIconForCategory(_dataItem)}>
                    {getTileForCategory(_dataItem)}
                  </VerticalTimelineElement>
                );
              })}
            </VerticalTimeline>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};
