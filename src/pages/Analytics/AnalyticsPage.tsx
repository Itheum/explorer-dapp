import React, { useEffect, useState } from "react";
import { CartesianGrid, Legend, Tooltip, ResponsiveContainer, XAxis, YAxis, AreaChart, Area } from "recharts";
import { HeaderComponent } from "components/Layout/HeaderComponent";
import { convertWeiToEsdt, DEFAULT_DECIMALS } from "libs/utils";
import { LoadingGraph, getAggregatedAnalyticsData, normalizeDataForMarshalUsage, formatYAxisDate } from "./AnalyticsShared";

export const AnalyticsPage = () => {
  const [fullChainSupplyData, setFullChainSupplyData] = useState<any[]>([]);
  const [fullChainCirculatingSupplyData, setFullChainCirculatingSupplyData] = useState<any[]>([]);
  const [fullChainMarshalUsageData, setFullChainMarshalUsageData] = useState<any[]>([]);
  const [dataLakeUserGrowthData, setDataLakeUserGrowthData] = useState<any[]>([]);
  const [dataLakeDataVolumeGrowthData, setDataLakeDataVolumeGrowthData] = useState<any[]>([]);
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
      const chainCirculatingSupplyDataT = [];
      const chainMarshalUsageDataT = [];
      const dataLakeUserGrowthDataT = [];
      const dataLakeDataVolumeGrowthDataT = [];
      const livelinessTVLDataT = [];

      // S: load aggregated data
      for (const day of Object.keys(dataAggregated)) {
        const chainSupplyDataI: any = { name: day };
        const chainCirculatingSupplyDataI: any = { name: day };
        const dataLakeUserGrowthDataI: any = { name: day };
        const dataLakeDataVolumeGrowthDataI: any = { name: day };
        const livelinessTVLDataI: any = { name: day };

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
              chainMarshalUsageDataT.push(normalizeDataForMarshalUsage(dataAggregated[day], day));
              break;
            case "data_lake_metrics":
              dataLakeUserGrowthDataI["totalUsers"] = dataAggregated[day][nft]["totalUsers"];
              dataLakeDataVolumeGrowthDataI["totalBytes"] = dataAggregated[day][nft]["totalBytes"];

              dataLakeUserGrowthDataT.push(dataLakeUserGrowthDataI);
              dataLakeDataVolumeGrowthDataT.push(dataLakeDataVolumeGrowthDataI);
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
      setFullChainCirculatingSupplyData(chainCirculatingSupplyDataT);
      setFullChainMarshalUsageData(chainMarshalUsageDataT);
      setDataLakeUserGrowthData(dataLakeUserGrowthDataT);
      setDataLakeDataVolumeGrowthData(dataLakeDataVolumeGrowthDataT);
      setLivelinessTVLData(livelinessTVLDataT);
      // E: load aggregated data
    }

    getDataAndInitGraphData();
  }, []);

  return (
    <HeaderComponent
      pageTitle={"Protocol Analytics"}
      subTitle={"View key growth metrics of the Itheum Protocol across the multiple chains it operates on."}
      hasImage={false}>
      <div className="w-[100%] bg-green-000">
        <div className="mt-10 bg-red-000">
          <div className="mb-10 bg-red-000">
            <h2 className="flex flex-row !text-3xl">Data NFTs</h2>
            <p className="opacity-50">
              Each Data NFT acts as a web3 license for data usage. Data NFTs can unlock 'Active or Passive' data. Here is the total supply of Data NFTs.
            </p>
          </div>

          {/* Data NFT Total Supply Across Chains */}
          <div>
            <h2 className="flex flex-row !text-2xl">Data NFT Total Supply Across Chains</h2>
            <p className="opacity-50">This is the total supply of Data NFTs minted across the chains that the Itheum Protocol operates on.</p>
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

          {/* Data NFT Circulating Supply Across Chains */}
          <div>
            <h2 className="flex flex-row !text-2xl">Data NFT Circulating Supply Across Chains</h2>
            <p className="opacity-50">This is the circulating supply of Data NFTs across the chains that the Itheum Protocol operates on.</p>
            <div className="min-h-[300px]">
              {(fullChainCirculatingSupplyData.length > 0 && (
                <ResponsiveContainer minWidth="100%" minHeight={300} style={{ marginBottom: "2.5rem" }}>
                  <AreaChart data={fullChainCirculatingSupplyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
            <h2 className="flex flex-row !text-2xl">Data Marshal Brokerage Events Across Chains</h2>
            <p className="opacity-50">
              Data Marshal nodes are brokerage nodes that allow data streams within Data NFTs to be securely accessed. They operate across all the chains that
              the Itheum Protocol is on.
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

        <div className="mt-10 bg-red-000">
          <div className="mb-5 bg-red-000">
            <h2 className="flex flex-row !text-3xl">AI Workforce</h2>
            <p className="opacity-50">
              Users bond $ITHEUM tokens, mint a{" "}
              <a className="underline hover:no-underline" href="https://datadex.itheum.io/nfmeid" target="_blank">
                NFMe ID
              </a>{" "}
              to boost their "Liveliness" and farm reputation staking rewards as part of the{" "}
              <a className="underline hover:no-underline" href="/aiworkforce" target="_blank">
                Itheum AI Workforce
              </a>
            </p>
          </div>

          {/* Liveliness TVL */}
          <div>
            <h2 className="flex flex-row !text-2xl">Liveliness Staking TVL (Total Value Locked)</h2>
            <p className="opacity-50">
              Total $ITHEUM staked by users who are part of the{" "}
              <a className="underline hover:no-underline" href="/aiworkforce" target="_blank">
                Itheum AI Workforce
              </a>
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

        <hr className="w-48 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-10 dark:bg-gray-700"></hr>

        <div className="mt-10 bg-blue-000">
          <h2 className="flex flex-row !text-3xl">Itheum Data Realm</h2>
          <p className="opacity-50">
            The Itheum Data Realm is a bulk pool of 'Passive' Data collected from users, currently being populated by gaming data. Data Coalition DAOs broker
            the trade of the bulk data and share earnings with users who contribute their data to the pool.
          </p>
          <div className="mt-10 bg-red-000 flex flex-col md:flex-row">
            {/* Data Lake Passive Data Collected From Users Growth */}
            <div className="flex-1">
              <h2 className="flex flex-row !text-xl">User Plugged-In</h2>
              <div className="min-h-[300px]">
                {(dataLakeUserGrowthData.length > 0 && (
                  <ResponsiveContainer minWidth={"100%"} height={300} style={{ marginBottom: "2.5rem" }}>
                    <AreaChart data={dataLakeUserGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <XAxis dataKey="name" tickFormatter={formatYAxisDate} tick={{ fontSize: 10 }} />
                      <YAxis hide />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip formatter={(value, name) => [value, "Users"]} wrapperStyle={{ color: "#333" }} />
                      <Area
                        connectNulls
                        animationDuration={3000}
                        animationEasing="ease-in"
                        type="monotone"
                        dataKey="totalUsers"
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

            {/* Data Lake Data Collected Volume Growth (Bytes) */}
            <div className="flex-1">
              <h2 className="flex flex-row !text-xl">Data Volume (Bytes)</h2>
              <div className="min-h-[300px]">
                {(dataLakeDataVolumeGrowthData.length > 0 && (
                  <ResponsiveContainer minWidth={"100%"} height={300} style={{ marginBottom: "2.5rem" }}>
                    <AreaChart data={dataLakeDataVolumeGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <XAxis dataKey="name" tickFormatter={formatYAxisDate} tick={{ fontSize: 10 }} />
                      <YAxis label="Total Volume (Bytes)" hide />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip formatter={(value, name) => [value.toLocaleString(), "Data Collected (in Bytes)"]} wrapperStyle={{ color: "#333" }} />
                      <Area
                        connectNulls
                        animationDuration={3000}
                        animationEasing="ease-in"
                        type="monotone"
                        dataKey="totalBytes"
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
      </div>
    </HeaderComponent>
  );
};
