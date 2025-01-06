import React, { useEffect, useState } from "react";
import { CartesianGrid, Legend, Tooltip, ResponsiveContainer, XAxis, YAxis, AreaChart, Area } from "recharts";
import HelmetPageMeta from "components/HelmetPageMeta";
import { HeaderComponent } from "components/Layout/HeaderComponent";
import { convertWeiToEsdt, DEFAULT_DECIMALS } from "libs/utils";
import { LoadingGraph, getAggregatedAnalyticsData, normalizeDataForMarshalUsage, formatYAxisDate } from "./AnalyticsShared";

export const AnalyticsPage = () => {
  const [fullChainSupplyData, setFullChainSupplyData] = useState<any[]>([]);
  const [fullChainMarshalUsageData, setFullChainMarshalUsageData] = useState<any[]>([]);
  const [livelinessTVLData, setLivelinessTVLData] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    async function getDataAndInitGraphData() {
      const dataAggregated = await getAggregatedAnalyticsData();

      // aggregations data
      const chainSupplyDataT = [];
      const chainMarshalUsageDataT = [];
      const livelinessTVLDataT = [];

      // S: load aggregated data
      for (const day of Object.keys(dataAggregated)) {
        const chainSupplyDataI: any = { name: day };
        const livelinessTVLDataI: any = { name: day };

        for (const nft of Object.keys(dataAggregated[day])) {
          switch (nft) {
            case "mvx_supply":
            case "sol_supply":
              chainSupplyDataI[nft] = dataAggregated[day][nft]["total"];

              chainSupplyDataT.push(chainSupplyDataI);
              break;
            case "marshal_usage_events":
              chainMarshalUsageDataT.push(normalizeDataForMarshalUsage(dataAggregated[day], day));
              break;
            case "bonding_tvl":
              livelinessTVLDataI["bal"] = Number(convertWeiToEsdt(dataAggregated[day][nft]["bal"], DEFAULT_DECIMALS, 0));

              livelinessTVLDataT.push(livelinessTVLDataI);
              break;
            default:
              // console.log("default case hit");
              break;
          }
        }
      }

      setFullChainSupplyData(chainSupplyDataT);
      setFullChainMarshalUsageData(chainMarshalUsageDataT);
      setLivelinessTVLData(livelinessTVLDataT);
      // E: load aggregated data
    }

    getDataAndInitGraphData();
  }, []);

  const getLatestTVL = (data: any[]) => {
    if (!data.length) return null;
    return data.reduce((latest, current) => (new Date(latest.name) > new Date(current.name) ? latest : current)).bal;
  };

  const getLatestTotalSupply = (data: any[]) => {
    if (!data.length) return null;
    const latest = data.reduce((latest, current) => (new Date(latest.name) > new Date(current.name) ? latest : current));
    return (latest.mvx_supply || 0) + (latest.sol_supply || 0);
  };

  const getTotalMarshalEvents = (data: any[], days?: number) => {
    if (!data.length) return null;

    if (days) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      return data
        .filter((day) => new Date(day.name) >= cutoffDate)
        .reduce((total, day) => {
          const mvxEvents = day.mvx || 0;
          const solEvents = day.sol || 0;
          return total + mvxEvents + solEvents;
        }, 0);
    }

    return data.reduce((total, day) => {
      const mvxEvents = day.mvx || 0;
      const solEvents = day.sol || 0;
      return total + mvxEvents + solEvents;
    }, 0);
  };

  return (
    <>
      <HelmetPageMeta
        title="Itheum Protocol Analytics"
        shortTitle="Itheum Protocol Analytics"
        desc="View key growth metrics of the Itheum Protocol across the multiple chains it operates on."
      />

      <HeaderComponent
        pageTitle={"Protocol Analytics"}
        subTitle={"View key growth metrics of the Itheum Protocol across the multiple chains it operates on."}
        hasImage={false}>
        <div className="w-[100%]">
          <div className="mt-10">
            <div className="mb-10">
              <h2 className="flex flex-row !text-3xl">Data NFTs</h2>
              <p className="opacity-50">
                Each Data NFT acts as a web3 license for data usage. Data NFTs can unlock 'Active or Passive' data. Here is the total supply of Data NFTs.
              </p>
            </div>

            {/* Data NFT Total Supply Across Chains */}
            <div>
              <h2 className="flex flex-row !text-xl">Data NFT Total Supply Across Chains</h2>
              <h2 className="flex flex-row !text-3xl mt-2">
                <span className="bg-gradient-to-r from-[#31b3cd] to-[#82ca9d] text-transparent bg-clip-text">
                  {fullChainSupplyData.length > 0 ? `${getLatestTotalSupply(fullChainSupplyData).toLocaleString()} Data NFTs` : "Loading..."}
                </span>
              </h2>
              <p className="opacity-50 my-3">
                This is the total supply of Data NFTs minted across the chains that the Itheum Protocol operates on. Increasing supply indicated that more
                Itheum sourced data is being created
              </p>
              <div className="min-h-[300px]">
                {(fullChainSupplyData.length > 0 && (
                  <ResponsiveContainer minWidth="100%" minHeight={300} style={{ marginBottom: "2.5rem" }}>
                    <AreaChart data={fullChainSupplyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#31b3cd" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#31b3cd" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" tickFormatter={formatYAxisDate} tick={{ fontSize: 10 }} />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip
                        formatter={(value: any, name: any, props: any) => {
                          const labelsForKey: any = {
                            mvx_supply: "MultiversX Supply",
                            sol_supply: "Solana Supply",
                          };

                          return [value, labelsForKey[name]];
                        }}
                        wrapperStyle={{ color: "#333" }}
                      />
                      <Legend
                        formatter={(value: any, entry: any) => {
                          const { color } = entry;
                          const labelsForKey: any = {
                            mvx_supply: "MultiversX Supply",
                            sol_supply: "Solana Supply",
                          };

                          return <span style={{ color }}>{labelsForKey[value]}</span>;
                        }}
                      />
                      <Area
                        connectNulls
                        animationDuration={3000}
                        animationEasing="ease-in"
                        type="monotone"
                        dataKey="mvx_supply"
                        stroke="#31b3cd"
                        fillOpacity={1}
                        fill="url(#colorUv)"
                        stackId={1}
                      />
                      <Area
                        connectNulls
                        animationDuration={3000}
                        animationEasing="ease-in"
                        type="monotone"
                        dataKey="sol_supply"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorPv)"
                        stackId={1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )) || <LoadingGraph />}
              </div>
            </div>

            <hr className="w-48 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-10 dark:bg-gray-700"></hr>

            {/* Data Marshal Brokerage Events Across Chains */}
            <div>
              <h2 className="flex flex-row !text-xl">Data Marshal Brokerage Events Across Chains</h2>

              <h2 className="flex flex-row !text-3xl mt-2">
                <span className="bg-gradient-to-r from-[#31b3cd] to-[#82ca9d] text-transparent bg-clip-text">
                  {fullChainMarshalUsageData.length > 0 ? (
                    <div className="flex flex-col">
                      <div>{`${getTotalMarshalEvents(fullChainMarshalUsageData).toLocaleString()} Total Events`}</div>
                      <div className="text-lg mt-2">Last 7 days: {getTotalMarshalEvents(fullChainMarshalUsageData, 7).toLocaleString()} events</div>
                      <div className="text-lg">Last 30 days: {getTotalMarshalEvents(fullChainMarshalUsageData, 30).toLocaleString()} events</div>
                    </div>
                  ) : (
                    "Loading..."
                  )}
                </span>
              </h2>

              <p className="opacity-50 my-3">
                Data Marshal nodes are brokerage nodes that allow data streams within Data NFTs to be securely accessed. They operate across all the chains that
                the Itheum Protocol is on. This chart is a good indicator om how much Itheum sourced data is being consumed.
              </p>
              <div className="min-h-[300px]">
                {(fullChainMarshalUsageData.length > 0 && (
                  <ResponsiveContainer minWidth="100%" minHeight={300} style={{ marginBottom: "2.5rem" }}>
                    <AreaChart data={fullChainMarshalUsageData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#31b3cd" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#31b3cd" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" tickFormatter={formatYAxisDate} tick={{ fontSize: 10 }} />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip
                        formatter={(value: any, name: any, props: any) => {
                          const labelsForKey: any = {
                            mvx: "MultiversX Events",
                            sol: "Solana Events",
                          };

                          return [value, labelsForKey[name]];
                        }}
                        wrapperStyle={{ color: "#333" }}
                      />
                      <Legend
                        formatter={(value: any, entry: any) => {
                          const { color } = entry;
                          const labelsForKey: any = {
                            mvx: "MultiversX Events",
                            sol: "Solana Events",
                          };

                          return <span style={{ color }}>{labelsForKey[value]}</span>;
                        }}
                      />
                      <Area
                        connectNulls
                        animationDuration={3000}
                        animationEasing="ease-in"
                        type="monotone"
                        dataKey="mvx"
                        stroke="#31b3cd"
                        fillOpacity={1}
                        fill="url(#colorUv)"
                        stackId={1}
                      />
                      <Area
                        connectNulls
                        animationDuration={3000}
                        animationEasing="ease-in"
                        type="monotone"
                        dataKey="sol"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorPv)"
                        stackId={1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )) || <LoadingGraph />}
              </div>
            </div>
          </div>

          <hr className="w-48 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-10 dark:bg-gray-700"></hr>

          <div className="mt-10">
            <div className="mb-5">
              <h2 className="flex flex-row !text-3xl">AI Data Workforce</h2>
              <p className="opacity-50">
                Users bond $ITHEUM tokens, mint a{" "}
                <a className="underline hover:no-underline" href="https://datadex.itheum.io/nfmeid" target="_blank">
                  NFMe ID
                </a>{" "}
                to boost their "Liveliness" and farm reputation staking rewards as part of the{" "}
                <a className="underline hover:no-underline" href="/aiworkforce" target="_blank">
                  Itheum AI Data Workforce
                </a>
              </p>
            </div>

            {/* Liveliness TVL */}
            <div>
              <h2 className="flex flex-row !text-xl">Liveliness Staking TVL (Total Value Locked): </h2>
              <h2 className="flex flex-row !text-3xl mt-2">
                <span className="bg-gradient-to-r from-[#31b3cd] to-[#82ca9d] text-transparent bg-clip-text">
                  {livelinessTVLData.length > 0 ? `${getLatestTVL(livelinessTVLData).toLocaleString()} $ITHEUM` : "Loading..."}
                </span>
              </h2>
              <p className="opacity-50 my-3">
                Total $ITHEUM staked by users who are part of the{" "}
                <a className="underline hover:no-underline" href="/aiworkforce" target="_blank">
                  Itheum AI Data Workforce
                </a>
                . Increasing Liveliness TVL indicated that more users want to provide or use Itheum sourced data.
              </p>
              <div className="mt-10">
                {(livelinessTVLData.length > 0 && (
                  <ResponsiveContainer minWidth={"100%"} height={300} style={{ marginBottom: "2.5rem" }}>
                    <AreaChart data={livelinessTVLData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <XAxis dataKey="name" tickFormatter={formatYAxisDate} tick={{ fontSize: 10 }} />
                      <YAxis
                        tickFormatter={(tickItem: any) => {
                          return tickItem.toLocaleString();
                        }}
                        tick={{ fontSize: 10 }}
                      />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip formatter={(value, name) => [value.toLocaleString(), "$ITHEUM"]} wrapperStyle={{ color: "#333" }} />
                      <Area
                        connectNulls
                        animationDuration={3000}
                        animationEasing="ease-in"
                        type="monotone"
                        dataKey="bal"
                        stroke="#31b3cd"
                        fillOpacity={1}
                        fill="url(#colorUv)"
                        stackId={1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )) || <LoadingGraph />}
              </div>
            </div>
          </div>
        </div>
      </HeaderComponent>
    </>
  );
};
