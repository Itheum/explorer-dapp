import React, { useEffect, useState } from "react";
import { FaCalendarCheck, FaChartBar, FaChessKnight, FaFlagCheckered, FaHandshake, FaMoneyBillAlt, FaShopify, FaTrophy } from "react-icons/fa";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import { Loader } from "components";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { Button } from "../../../../libComponents/Button";
import { Modal } from "../../../../components/Modal/Modal";
import { Card, CardHeader } from "../../../../libComponents/Card";
import { ChevronDown, ShoppingCart } from "lucide-react";
import { useFilterStore } from "../../../../store/FilterStore";
import { NoDataFound } from "../../../../components/NoDataFound";

export const TrailBlazerModal = ({ owned, isFetchingDataMarshal, data }: { owned: boolean; isFetchingDataMarshal?: boolean; data: any }) => {
  const { filter } = useFilterStore();
  const { loginMethod } = useGetLoginInfo();
  const [filteredData, setFilteredData] = useState<number>(1000);

  useEffect(() => {
    const filteredData = new Set();
    const allData = new Set(data);
    allData.forEach((data: any) => {
      // console.log(data.category);
      if (data.category === filter) {
        filteredData.add(data);
        console.log("da");
      } else {
        console.log("nu");
        setFilteredData(0);
      }
      setFilteredData(filteredData.size);
    });
  }, [filter]);

  // console.log(allData);

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
          <div className="bg-gradient-to-r from-yellow-300 to-orange-500 p-[1px] rounded-xl">
            <Card className="flex flex-col items-center justify-center !p-4 text-foreground bg-background border-0 rounded-xl">
              <div className="flex flex-row justify-between items-center w-full">
                <span className="text-2xl text-uppercase font-[Satoshi-Medium]">Offer</span>
                <span className="text-muted-foreground text-sm">{new Date(dataItem.date).toDateString()}</span>
              </div>
              <hr className="border border-muted-foreground w-full my-2" />
              <div className="text-xl pt-1">Congratulations! You've unlocked a special offer.</div>
              <div className="flex md:flex-row flex-col w-full justify-around items-center py-4 gap-3">
                <div className="">
                  <ShoppingCart className="w-12 h-12" />
                </div>
                <div className="flex flex-col space-y-2">
                  <span>{dataItem.title}</span>
                  <div className="flex flex-row items-center">
                    <span>Claimable On:</span>
                    <div className="pl-2">
                      <FaShopify className="h-5 w-5" />
                    </div>
                  </div>
                </div>
                <a className=" !no-underline" href={dataItem.link} target="_blank">
                  <Button
                    className="bg-gradient-to-r from-yellow-300 to-orange-500 h-auto px-3 border-0 text-black rounded-lg font-medium tracking-tight hover:opacity-80 hover:text-black"
                    variant="ghost">
                    Grab now!
                  </Button>
                </a>
              </div>
              <div className="footer"></div>
            </Card>
          </div>
        );
        break;
      case "Quest":
        tileCode = (
          <div className="bg-gradient-to-r from-yellow-300 to-orange-500 p-[1px] rounded-xl">
            <Card className="flex flex-col items-center justify-center !p-4 text-foreground bg-background border-0 rounded-xl">
              <div className="flex flex-row justify-between items-center w-full">
                <span className="text-2xl text-uppercase font-[Satoshi-Medium]">Quest</span>
                <span className="text-muted-foreground text-sm">{new Date(dataItem.date).toDateString()}</span>
              </div>
              <hr className="border border-muted-foreground w-full my-2" />
              <div className="text-xl pt-1">Psst! A secret quest is underway.</div>
              <div className="flex md:flex-row flex-col w-full justify-around items-center py-4 gap-3">
                <div className="">
                  <FaFlagCheckered className="w-12 h-12" />
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="w-48 leading-relaxed text-[14px]">{dataItem.title}</div>
                </div>
                <Modal
                  openTrigger={
                    <Button
                      className="bg-gradient-to-r from-yellow-300 to-orange-500 h-auto px-3 border-0 text-black rounded-lg font-se tracking-normal hover:opacity-80 hover:text-black"
                      variant="ghost">
                      Join quest!
                    </Button>
                  }>
                  <div className="bg-background p-5 rounded shadow-lg">
                    <iframe title="Modal Content" src={dataItem.link} className="w-full h-[85dvh]" />
                  </div>
                </Modal>
              </div>
            </Card>
          </div>
        );
        break;
      case "Leaderboard":
        tileCode = (
          <div className="bg-gradient-to-r from-yellow-300 to-orange-500 p-[1px] rounded-xl">
            <Card className="flex flex-col items-center justify-center !p-4 text-foreground bg-background border-0 rounded-xl">
              <CardHeader className="flex flex-row justify-between items-center w-full">
                <span className="text-2xl text-uppercase font-[Satoshi-Medium]">Secret Leaderboard</span>
                <span className="text-muted-foreground text-sm">{new Date(dataItem.date).toDateString()}</span>
              </CardHeader>
              <hr className="border border-muted-foreground w-full my-2" />
              <div className="w-full text-xl pt-1 pb-2 text-center">{dataItem.title}</div>
              <div className="w-full">
                {(!normalizeLeaderboardData(dataItem.link).processedSuccess && (
                  <div className="process-error">{normalizeLeaderboardData(dataItem.link).processMsg}</div>
                )) || (
                  <table className="w-full">
                    <thead className="text-muted-foreground border-b border-muted-foreground">
                      <tr>
                        <th>#</th>
                        <th>Address</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {normalizeLeaderboardData(dataItem.link).tableData.map((rowData: any, idx: number) => {
                        return (
                          <tr className="border-b border-muted-foreground">
                            <th>{++idx}</th>
                            <td>{rowData.leaderAddress}</td>
                            <td>{rowData.points}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>
          </div>
        );
        break;
      default:
        tileCode = (
          <div className="bg-gradient-to-r from-yellow-300 to-orange-500 p-[1px] rounded-xl">
            <Card className="flex flex-col items-start justify-center !p-4 text-foreground bg-background border-0 rounded-xl">
              <h2>
                {dataItem.category} - {new Date(dataItem.date).toDateString()}
              </h2>
              <h3>{dataItem.title}</h3>
              <a href={dataItem.link} target="_blank" className="!text-blue-500">
                See more...
              </a>
            </Card>
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
    <>
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
        <>
          {filteredData === 0 && filter !== null ? (
            <NoDataFound />
          ) : (
            <VerticalTimeline>
              {filter === null || filter === undefined
                ? data?.map((_dataItem: any, _index: any) => {
                    console.log(_dataItem);
                    return (
                      <VerticalTimelineElement key={_index} icon={getIconForCategory(_dataItem)}>
                        {getTileForCategory(_dataItem)}
                      </VerticalTimelineElement>
                    );
                  })
                : data
                    ?.filter((newValues: any) => newValues.category === filter)
                    .map((_dataItem: any, _index: any) => {
                      console.log(_dataItem);
                      return (
                        <VerticalTimelineElement key={_index} icon={getIconForCategory(_dataItem)}>
                          {getTileForCategory(_dataItem)}
                        </VerticalTimelineElement>
                      );
                    })}
            </VerticalTimeline>
          )}
        </>
      )}
    </>
  );
};
