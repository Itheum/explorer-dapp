import React, { useEffect, useState } from "react";
import { Banknote, BarChart3, CalendarCheck, Flag, HeartHandshake, Map, ShoppingCart, Trophy, Drama } from "lucide-react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import { Loader } from "components";
import { Modal } from "components/Modal/Modal";
import { NoDataFound } from "components/NoDataFound";
import YouTubeEmbed from "components/YouTubeEmbed";
import { Button } from "libComponents/Button";
import { Card } from "libComponents/Card";
import { useFilterStore } from "store/FilterStore";

export const TrailBlazerModal = ({ owned, isFetchingDataMarshal, data }: { owned: boolean; isFetchingDataMarshal?: boolean; data: any }) => {
  const { filter } = useFilterStore();
  const [filteredData, setFilteredData] = useState<number>(1000);

  useEffect(() => {
    const filteredDataTemp = new Set();
    const allData = new Set(data);
    allData.forEach((dataT: any) => {
      if (dataT.category === filter) {
        filteredDataTemp.add(dataT);
      } else {
        setFilteredData(0);
      }
      setFilteredData(filteredDataTemp.size);
    });
  }, [filter]);

  const getIconForCategory = (dataItem: any) => {
    switch (dataItem.category) {
      case "Partnership":
        return <HeartHandshake strokeWidth={2.5} />;
        break;
      case "Achievement":
        return <Trophy strokeWidth={2.5} />;
        break;
      case "Offer":
        return <Banknote strokeWidth={2.5} />;
        break;
      case "Quest":
        return <Map strokeWidth={2.5} />;
        break;
      case "Leaderboard":
        return <BarChart3 strokeWidth={2.5} />;
        break;
      case "Meme":
        return <Drama />;
        break;
      default:
        return <CalendarCheck strokeWidth={2.5} />;
        break;
    }
  };

  /* Videos may take time to load, if the user put a unlisted YouTube as a "link" then show that with a notice to user (for better YX) */
  const showVideoContent = (dataItem: any) => {
    let youTubeVideoID = null;

    if (dataItem?.link && dataItem.link.includes("youtdu.be")) {
      // work with this: "https://youtu.be/6PBSGckWA1M"
      const splitParts = dataItem.link.trim().split("/");
      youTubeVideoID = splitParts[splitParts.length - 1];
    }

    return (
      <>
        {dataItem.file && dataItem["file_mimeType"] && (
          <>
            <video className="w-auto h-auto mx-auto my-4" style={{ maxHeight: "600px" }} controls>
              <source src={dataItem.file} type={dataItem["file_mimeType"]}></source>
            </video>

            {youTubeVideoID && (
              <>
                <div className="text-[11px] mb-[20px] text-center">
                  The above TimeCapsule videos stream from decentralized storage, giving you permanent ownership! Larger videos may load slowly, so feel free to
                  watch on YouTube below. But remember, if YouTube disappears, your video memory still remains securely yours forever.
                </div>
                <div className="w-[100%] h-[170px] md:h-[270px]">
                  <YouTubeEmbed embedId={youTubeVideoID} title={dataItem.title} />
                </div>
              </>
            )}
          </>
        )}
      </>
    );
  };

  const getTileForCategory = (dataItem: any) => {
    let tileCode: any = null;

    console.log(dataItem);

    switch (dataItem.category) {
      case "Offer":
        tileCode = (
          <div className="bg-gradient-to-r from-yellow-300 to-orange-500 p-[1px] rounded-xl">
            <Card className="flex flex-col items-center justify-center !p-4 text-foreground bg-background border-0 rounded-xl">
              <div className="flex md:flex-row flex-col justify-between items-center w-full">
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
                    <div className="pl-1 font-semibold">Shopify</div>
                  </div>
                </div>
                <a className="!no-underline" href={dataItem.link} target="_blank">
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
              <div className="flex md:flex-row flex-col justify-between items-center w-full">
                <span className="text-2xl text-uppercase font-[Satoshi-Medium]">Quest</span>
                <span className="text-muted-foreground text-sm">{new Date(dataItem.date).toDateString()}</span>
              </div>
              <hr className="border border-muted-foreground w-full my-2" />
              <div className="text-xl pt-1">Psst! A secret quest is underway.</div>
              <div className="flex md:flex-row flex-col w-full justify-around items-center py-4 gap-3">
                <div className="">
                  <Flag className="w-12 h-12" />
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
              <div className="flex md:flex-row flex-col justify-between items-center w-full">
                <span className="text-2xl text-uppercase font-[Satoshi-Medium]">Secret Leaderboard</span>
                <span className="text-muted-foreground text-sm">{new Date(dataItem.date).toDateString()}</span>
              </div>
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
                          <tr className="border-b border-muted-foreground" key={idx}>
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
      case "Meme":
        tileCode = (
          <div className="bg-gradient-to-r from-yellow-300 to-orange-500 p-[1px] rounded-xl">
            <Card className="flex flex-col items-start justify-center !p-4 text-foreground bg-background border-0 rounded-xl">
              <h2>{dataItem.title}</h2>
              <h3>{new Date(dataItem.date).toDateString()}</h3>

              {showVideoContent(dataItem)}

              {/* {dataItem.file && dataItem["file_mimeType"] && (
                <video className="w-auto h-auto mx-auto my-4" style={{ maxHeight: "600px" }} controls>
                  <source src={dataItem.file} type={dataItem["file_mimeType"]}></source>
                </video>
              )}

              {dataItem.file && dataItem["file_mimeType"] && (
                <div className="w-[380px] h-[170px] md:w-[480px] md:h-[270px]">
                  <YouTubeEmbed embedId="6PBSGckWA1M" title={dataItem.title} />
                </div>
              )} */}

              <a href={dataItem.link} target="_blank" className="!text-blue-500">
                See more...
              </a>
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
        <div className="flex flex-col items-center justify-center min-w-[24rem] max-w-[100%] min-h-[40rem] max-h-[80svh]">
          <div>
            <Loader noText />
            <p className="text-center font-weight-bold">Loading...</p>
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
                    return (
                      <VerticalTimelineElement key={_index} icon={getIconForCategory(_dataItem)}>
                        {getTileForCategory(_dataItem)}
                      </VerticalTimelineElement>
                    );
                  })
                : data
                    ?.filter((newValues: any) => newValues.category === filter)
                    .map((_dataItem: any, _index: any) => {
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
