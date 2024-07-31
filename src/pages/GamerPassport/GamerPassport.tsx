import React, { useEffect, useState } from "react";
import { CartesianGrid, Legend, Tooltip, ResponsiveContainer, XAxis, YAxis, AreaChart, Area } from "recharts";
import hero from "assets/img/gamer-passport/gamer-passport-adaptor-hero.png";
import { HeaderComponent } from "../../components/Layout/HeaderComponent";
import { LoadingGraph, getAggregatedAnalyticsData } from "../Analytics/AnalyticsShared";

export const GamerPassport = () => {
  const [dataLakeUserGrowthData, setDataLakeUserGrowthData] = useState<any[]>([]);
  const [dataLakeDataVolumeGrowthData, setDataLakeDataVolumeGrowthData] = useState<any[]>([]);

  useEffect(() => {
    // window.scrollTo({
    //   top: 0,
    //   behavior: "smooth",
    // });

    async function getDataAndInitGraphData() {
      const dataAggregated = await getAggregatedAnalyticsData();

      // aggregations data
      const dataLakeUserGrowthDataT = [];
      const dataLakeDataVolumeGrowthDataT = [];

      // S: load aggregated data
      for (const day of Object.keys(dataAggregated)) {
        const dataLakeUserGrowthDataI: any = { name: day };
        const dataLakeDataVolumeGrowthDataI: any = { name: day };

        for (const nft of Object.keys(dataAggregated[day])) {
          switch (nft) {
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

      setDataLakeUserGrowthData(dataLakeUserGrowthDataT);
      setDataLakeDataVolumeGrowthData(dataLakeDataVolumeGrowthDataT);
      // E: load aggregated data
    }

    getDataAndInitGraphData();
  }, []);

  return (
    <HeaderComponent pageTitle={""} subTitle={""} hasImage={false}>
      <div className="w-[100%] bg-green-000">
        <div id="hero" className="mt-10 bg-red-000 h-[500px] bg-no-repeat bg-contain bg-top bg-fixed rounded-3xl" style={{ "backgroundImage": `url(${hero})` }}>
          <div className="flex flex-col bg-red-000 h-[100%] justify-center items-center">
            <h1 className="">Gamer Passport</h1>
            <h2 className="!text-xl w-[400px] text-center mt-2">On-board as a gamer and earn monthly rewards for sharing your gaming data</h2>
          </div>
        </div>

        <div id="data-stats" className="mt-10">
          <h2 className="!text-3xl text-center">Plug into the Gaming Data Realm</h2>
          <p className="opacity-50 text-center">
            The Itheum Data Realm is a bulk pool of 'Passive' Data collected from users, the realm will be populated by various forms of data but it is
            currently actively being populated by gaming data. Data Coalition DAOs broker the trade of the bulk data and share earnings with users who
            contribute their data to the pool.
          </p>
          <div className="mt-10 bg-red-000 flex flex-col md:flex-row">
            {/* Data Lake Passive Data Collected From Users Growth */}
            <div className="flex-1">
              <h2 className="!text-xl text-center">Gamers Plugged-In</h2>
              <div className="min-h-[300px]">
                {(dataLakeUserGrowthData.length > 0 && (
                  <ResponsiveContainer minWidth={"100%"} height={300} style={{ marginBottom: "2.5rem" }}>
                    <AreaChart data={dataLakeUserGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#006ee4" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#006ee4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" />
                      <YAxis hide />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip formatter={(value, name) => [value, "Users"]} wrapperStyle={{ color: "#333" }} />
                      <Area type="monotone" dataKey="totalUsers" stroke="#006ee4" fillOpacity={1} fill="url(#colorUv)" stackId={1} />
                    </AreaChart>
                  </ResponsiveContainer>
                )) || <LoadingGraph />}
              </div>
            </div>

            {/* Data Lake Data Collected Volume Growth (Bytes) */}
            <div className="flex-1">
              <h2 className="!text-xl text-center">Gaming Data Volume (Bytes)</h2>
              <div className="min-h-[300px]">
                {(dataLakeDataVolumeGrowthData.length > 0 && (
                  <ResponsiveContainer minWidth={"100%"} height={300} style={{ marginBottom: "2.5rem" }}>
                    <AreaChart data={dataLakeDataVolumeGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <XAxis dataKey="name" />
                      <YAxis label="Total Volume (Bytes)" hide />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip formatter={(value, name) => [value, "Data Collected (in Bytes)"]} wrapperStyle={{ color: "#333" }} />
                      <Area type="monotone" dataKey="totalBytes" stroke="#006ee4" fillOpacity={1} fill="url(#colorUv)" stackId={1} />
                    </AreaChart>
                  </ResponsiveContainer>
                )) || <LoadingGraph />}
              </div>
            </div>
          </div>

          <div className="mt-2 bg-red-000 flex flex-col justify-around space-x-4 md:flex-row">
            <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] bg-red-000 flex-1 h-[200px]">
              <p className="text-3xl">Supported Platforms</p>
              <p className="text-xl">Live: PlayStation, Coming: XBOX, Steam</p>
            </div>
            <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] bg-red-000 flex-1 h-[200px]">
              <p className="text-3xl">Reward Pool</p>
              <p className="text-2xl">1,000,000 ITHEUM</p>
            </div>
            <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] bg-red-000 flex-1 h-[200px]">
              <p className="text-3xl">Rewards Emitted</p>
              <p className="text-2xl">100 ITHEUM</p>
            </div>
          </div>
        </div>

        <div id="join-process" className="mt-10">
          <h2 className="!text-3xl text-center">Joining is simple as 1-2-3</h2>
          <p className="opacity-50 text-center">Check if you are eligible, login with your Google Account and you're in! Told you it's easy...</p>

          <div className="mt-2 bg-red-000 flex flex-col justify-around space-x-4 md:flex-row">
            <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] bg-red-000 flex-1 h-[200px]">
              <p className="text-3xl">1.</p>
              <p className="text-2xl">[__________] [Check Eligibility]</p>
            </div>
            <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] bg-red-000 flex-1 h-[200px]">
              <p className="text-3xl">2.</p>
              <p className="text-2xl">[Connect Google via TapLink]</p>
            </div>
            <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] bg-red-000 flex-1 h-[200px]">
              <p className="text-3xl">3.</p>
              <p className="text-2xl">[Agree and Proceed]</p>
            </div>
          </div>
        </div>

        <div id="benefits" className="mt-10">
          <h2 className="!text-3xl text-center">Why should you join?</h2>
          <p className="opacity-50 text-center">Cause gaming data ownership is the future! blah blah blah... but seriously, there are some cool perks!</p>

          <div className="mt-2 bg-red-000 flex flex-col justify-around space-x-4 md:flex-row">
            <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] bg-red-000 flex-1 h-[200px]">
              <p className="text-2xl w-[80%] text-center">Free data insight on your gaming data</p>
              <p className="text-md w-[80%] text-center">Compare your performance to other gamers, see what other gamers like you are playing etc</p>
            </div>
            <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] bg-red-000 flex-1 h-[200px]">
              <p className="text-2xl w-[80%] text-center">Seamless!</p>
              <p className="text-md w-[80%] text-center">
                You data is collected passively, so you don't need to do anything! Just play games like you normally do
              </p>
            </div>
            <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] bg-red-000 flex-1 h-[200px]">
              <p className="text-2xl w-[80%] text-center">Earn $ITHEUM rewards</p>
              <p className="text-md w-[80%] text-center">Your data is valuable, earn rewards for playing games just like you usually do</p>
            </div>
          </div>
        </div>

        <div id="how-it-works" className="mt-10">
          <h2 className="!text-2xl text-center">I earn rewards for my gaming data? What black magic is this?!</h2>
          <p className="opacity-50 text-center">
            Yes, your data is valuable and it is exploited by big corporations, Itheum wants to break this cycle... here is how the "black magic" works under
            the hood:
          </p>

          <div className="mt-2 bg-red-000 flex flex-col justify-around space-x-4 md:flex-row">
            <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] bg-red-000 flex-1 h-[200px]">
              <p className="text-2xl w-[80%] text-center">Itheum Data Realm</p>
              <p className="text-md w-[80%] text-center">
                We are currently populating our Data Realm with your passive gaming data. This is the phase we are at now, in return for your data, we emit
                ITHEUM rewards from the protocol
              </p>
            </div>
            <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] bg-red-000 flex-1 h-[200px]">
              <p className="text-2xl w-[80%] text-center">Data Coalition DAO</p>
              <p className="text-md w-[80%] text-center">
                Once the data realm reaches an optimum level, a Data Coalition DAO (DC DAO) will be appointed to oversee the massive bulk pool of data
              </p>
            </div>
            <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] bg-red-000 flex-1 h-[200px]">
              <p className="text-2xl w-[80%] text-center">Broker Trade the Bulk Data</p>
              <p className="text-md w-[80%] text-center">
                The DC DAO will represent you and bulk trade your data with AI companies. All earning are shared with the users who provided the data
              </p>
            </div>
          </div>
        </div>

        <div id="footer" className="mt-10 p-10"></div>
      </div>
    </HeaderComponent>
  );
};
