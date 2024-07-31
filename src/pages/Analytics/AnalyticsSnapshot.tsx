import React, { useEffect, useState } from "react";
import { Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { LoadingGraph, getAggregatedAnalyticsData } from "./AnalyticsShared";

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
        const chainMarshalUsageDataI = { name: day, mvx: -1, sol: -1 };

        for (const nft of Object.keys(dataAggregated[day])) {
          switch (nft) {
            case "mvx_supply":
            case "sol_supply":
              chainSupplyDataI[nft] = dataAggregated[day][nft]["total"];

              chainSupplyDataT.push(chainSupplyDataI);
              break;
            case "marshal_usage_events":
              chainMarshalUsageDataI["mvx"] = dataAggregated[day]["marshal_usage_events"]["mvx"];
              chainMarshalUsageDataI["sol"] = dataAggregated[day]["marshal_usage_events"]["sol"];

              chainMarshalUsageDataT.push(chainMarshalUsageDataI);
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
    <div className="w-[100%] bg-green-000">
      <div className="bg-red-000">
        <div className="bg-red-000 flex flex-col md:flex-row">
          <div className="flex-1">
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
                          mvx_supply: "MultiversX Supply",
                          sol_supply: "Solana Supply",
                        };

                        return <span style={{ color }}>{labelsForKey[value]}</span>;
                      }}
                    />
                    <Area type="monotone" dataKey="mvx_supply" stroke="#31b3cd" strokeWidth={0.2} fillOpacity={1} fill="url(#colorUv)" stackId={1} />
                    <Area type="monotone" dataKey="sol_supply" stroke="#82ca9d" strokeWidth={0.2} fillOpacity={1} fill="url(#colorPv)" stackId={1} />
                  </AreaChart>
                </ResponsiveContainer>
              )) || <LoadingGraph />}
              <h2 className="!text-lg text-center">Data NFT Supply</h2>
            </div>
          </div>

          <div className="flex-1">
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
                    <Area type="monotone" dataKey="mvx" stroke="#31b3cd" strokeWidth={0.2} fillOpacity={1} fill="url(#colorUv)" stackId={1} />
                    <Area type="monotone" dataKey="sol" stroke="#82ca9d" strokeWidth={0.2} fillOpacity={1} fill="url(#colorPv)" stackId={1} />
                  </AreaChart>
                </ResponsiveContainer>
              )) || <LoadingGraph />}
              <h2 className="!text-lg text-center">Data Marshal Brokerage Events</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
