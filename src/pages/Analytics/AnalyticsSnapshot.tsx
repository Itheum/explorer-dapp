import React, { useEffect, useState } from "react";
import { Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { LoadingGraph, getAggregatedAnalyticsData, normalizeDataForMarshalUsage } from "./AnalyticsShared";

export const AnalyticsSnapshot = () => {
  const [fullChainSupplyData, setFullChainSupplyData] = useState<any[]>([]);
  const [fullChainMarshalUsageData, setFullChainMarshalUsageData] = useState<any[]>([]);

  useEffect(() => {
    async function getDataAndInitGraphData() {
      const dataAggregated = await getAggregatedAnalyticsData();

      // aggregations data
      const chainSupplyDataT = [];
      const chainMarshalUsageDataT = [];

      // S: load aggregated data
      for (const day of Object.keys(dataAggregated)) {
        const chainSupplyDataI: any = { name: day };

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
            default:
              break;
          }
        }
      }

      setFullChainSupplyData(chainSupplyDataT);
      setFullChainMarshalUsageData(chainMarshalUsageDataT);
      // E: load aggregated data
    }

    getDataAndInitGraphData();
  }, []);

  return (
    <div className="w-[100%]">
      <div className="">
        <div className=" flex flex-col space-y-5 md:space-y-0 md:flex-row md:space-x-10">
          <div className="flex-1 border-dotted border border-[#CCCCCC] dark:border-[#6a6a6a] rounded-3xl overflow-hidden">
            <div className="min-h-[300px]">
              {(fullChainSupplyData.length > 0 && (
                <ResponsiveContainer minWidth="100%" minHeight={300} style={{ marginBottom: "2.5rem" }}>
                  <AreaChart
                    width={200}
                    height={60}
                    data={fullChainSupplyData}
                    margin={{
                      top: 5,
                      right: 0,
                      left: 0,
                      bottom: 5,
                    }}>
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
                    <Legend
                      formatter={(value: any, entry: any) => {
                        const { color } = entry;
                        const labelsForKey: any = {
                          mvx_supply: "MultiversX",
                          sol_supply: "Solana",
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
                      strokeWidth={1}
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
                      strokeWidth={1}
                      fillOpacity={1}
                      fill="url(#colorPv)"
                      stackId={1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )) || <LoadingGraph />}
              <h2 className="!text-lg text-center mb-5">Data NFT Supply</h2>
            </div>
          </div>

          <div className="flex-1 bg-red-000 border-dotted border border-[#CCCCCC] dark:border-[#6a6a6a] rounded-3xl">
            <div className="min-h-[300px]">
              {(fullChainMarshalUsageData.length > 0 && (
                <ResponsiveContainer minWidth="100%" minHeight={300} style={{ marginBottom: "2.5rem" }}>
                  <AreaChart
                    width={200}
                    height={60}
                    data={fullChainMarshalUsageData}
                    margin={{
                      top: 5,
                      right: 0,
                      left: 0,
                      bottom: 5,
                    }}>
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
                    <Legend
                      formatter={(value: any, entry: any) => {
                        const { color } = entry;
                        const labelsForKey: any = {
                          mvx: "MultiversX",
                          sol: "Solana",
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
                      strokeWidth={1}
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
                      strokeWidth={1}
                      fillOpacity={1}
                      fill="url(#colorPv)"
                      stackId={1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )) || <LoadingGraph />}
              <h2 className="!text-lg text-center mb-5">Data Marshal Brokerage Events</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
