import React, { useEffect, useState } from "react";
import axios from "axios";
import { CartesianGrid, Legend, Tooltip, ResponsiveContainer, XAxis, YAxis, AreaChart, Area, LineChart, Line } from "recharts";

export const AnalyticsSnapshot = () => {
  const [fullChainSupplyData, setFullChainSupplyData] = useState<any[]>([]);
  const [fullChainCirculatingSupplyData, setFullChainCirculatingSupplyData] = useState<any[]>([]);
  const [fullChainMarshalUsageData, setFullChainMarshalUsageData] = useState<any[]>([]);

  useEffect(() => {
    async function getNorthStarMetricsData() {
      const responseAggregated = await axios.get(
        "https://misc-dev-s3-data-nft-stats-harvestor-file-db.s3.eu-central-1.amazonaws.com/output/data-nft-stats-aggregated.json"
      );
      const dataAggregated = responseAggregated.data;

      // aggregations data
      const chainSupplyDataT = [];
      const chainCirculatingSupplyDataT = [];
      const chainMarshalUsageDataT = [];
      const dataLakeUserGrowthDataT = [];
      const dataLakeDataVolumeGrowthDataT = [];

      // S: load aggregated data
      for (const day of Object.keys(dataAggregated)) {
        const chainSupplyDataI: any = { name: day };
        const chainCirculatingSupplyDataI: any = { name: day };
        const chainMarshalUsageDataI = { name: day, mvx: -1, sol: -1 };
        const dataLakeUserGrowthDataI: any = { name: day };
        const dataLakeDataVolumeGrowthDataI: any = { name: day };

        for (const nft of Object.keys(dataAggregated[day])) {
          switch (nft) {
            case "mvx_supply":
            case "sol_supply":
              chainSupplyDataI[nft] = dataAggregated[day][nft]["total"];
              chainCirculatingSupplyDataI[nft] = dataAggregated[day][nft]["circulating"];

              chainSupplyDataT.push(chainSupplyDataI);
              chainCirculatingSupplyDataT.push(chainCirculatingSupplyDataI);
              break;
            case "marshal_usage_events":
              chainMarshalUsageDataI["mvx"] = dataAggregated[day]["marshal_usage_events"]["mvx"];
              chainMarshalUsageDataI["sol"] = dataAggregated[day]["marshal_usage_events"]["sol"];

              chainMarshalUsageDataT.push(chainMarshalUsageDataI);
              break;
            case "data_lake_metrics":
              dataLakeUserGrowthDataI["totalUsers"] = dataAggregated[day][nft]["totalUsers"];
              dataLakeDataVolumeGrowthDataI["totalBytes"] = dataAggregated[day][nft]["totalBytes"];

              dataLakeUserGrowthDataT.push(dataLakeUserGrowthDataI);
              dataLakeDataVolumeGrowthDataT.push(dataLakeDataVolumeGrowthDataI);
              break;
            default:
              console.log("default case hit");
              break;
          }
        }
      }

      setFullChainSupplyData(chainSupplyDataT);
      setFullChainCirculatingSupplyData(chainCirculatingSupplyDataT);
      setFullChainMarshalUsageData(chainMarshalUsageDataT);
      // E: load aggregated data
    }

    getNorthStarMetricsData();
  }, []);

  console.log(fullChainSupplyData);

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
                    <Area type="monotone" dataKey="mvx_supply" stroke="#8884d8" strokeWidth={0.1} fillOpacity={1} fill="url(#colorUv)" stackId={1} />
                    <Area type="monotone" dataKey="sol_supply" stroke="#82ca9d" strokeWidth={0.1} fillOpacity={1} fill="url(#colorPv)" stackId={1} />
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
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
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
                    <Area type="monotone" dataKey="mvx" stroke="#8884d8" strokeWidth={0.1} fillOpacity={1} fill="url(#colorUv)" stackId={1} />
                    <Area type="monotone" dataKey="sol" stroke="#82ca9d" strokeWidth={0.1} fillOpacity={1} fill="url(#colorPv)" stackId={1} />
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

const LoadingGraph = () => {
  return (
    <div className="flex items-center justify-center w-[100%] h-[280px]">
      <div className="px-3 py-1 text-xs font-medium leading-none text-center text-blue-900 bg-[#CCCCCC] rounded-full animate-pulse dark:bg-[#4d5259] dark:text-blue-300">
        loading...
      </div>
    </div>
  );
};
