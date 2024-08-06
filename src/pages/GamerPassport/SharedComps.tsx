import React from "react";
import { CartesianGrid, Tooltip, ResponsiveContainer, XAxis, YAxis, AreaChart, Area, ReferenceLine } from "recharts";
import { Button } from "libComponents/Button";
import { LoadingGraph } from "../Analytics/AnalyticsShared";

export const ActionButton = ({ mlAdjustment, btnText, disableBtn }: { mlAdjustment?: string; btnText: string; disableBtn?: boolean }) => {
  return (
    <div className={`pt-5 ${mlAdjustment ? mlAdjustment : ""}`}>
      <div className={`w-[7.5rem] relative bg-gradient-to-r from-[#006ee4] to-blue-200 px-[1px] py-[1px] rounded-md ${disableBtn ? "bg-none" : ""}`}>
        <div className="bg-background rounded-md">
          <Button
            disabled={!!disableBtn}
            className="text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-[#006ee4] to-blue-200 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
            {btnText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export function GameTitleSnapShotGrid({ snapShotData }: { snapShotData: any[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-h-[1000px] overflow-auto">
      {snapShotData &&
        snapShotData.length > 0 &&
        snapShotData.map((title: any, idx: number) => (
          <div key={idx}>
            <img className="h-auto max-w-full rounded-lg" src={title.image_url} alt={title.name} />
            <div className="h-[80px] -mt-[50px] bg-black opacity-75 p-2">
              <p className="text-[12px]">Times Played: {title.play_count}</p>
              <p className="text-[12px]">Total Time Spent: {title.play_time}</p>
            </div>
          </div>
        ))}
    </div>
  );
}

export function VolumeChartAnalytics({
  dataLakeUserGrowthData,
  dataLakeDataVolumeGrowthData,
  dataVolumeGamerReferenceBytes,
}: {
  dataLakeUserGrowthData: any[];
  dataLakeDataVolumeGrowthData: any[];
  dataVolumeGamerReferenceBytes?: number;
}) {
  const totalUsersToShow = dataLakeUserGrowthData?.[dataLakeUserGrowthData.length - 1]?.totalUsers;

  return (
    <>
      {/* Data Lake Passive Data Collected From Users Growth */}
      <div className="flex-1">
        <h2 className="!text-lg text-center">
          Total Gamers Plugged-In {totalUsersToShow && <span className="text-xl">{dataLakeUserGrowthData[dataLakeUserGrowthData.length - 1].totalUsers}</span>}
        </h2>
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
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip formatter={(value, name) => [value, "Users"]} wrapperStyle={{ color: "#333" }} />
                <Area
                  connectNulls
                  animationDuration={3000}
                  animationEasing="ease-in"
                  type="monotone"
                  dataKey="totalUsers"
                  stroke="#006ee4"
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
        {dataVolumeGamerReferenceBytes ? (
          <h2 className="!text-lg text-center">Your Data vs Total Gaming Data Volume (Bytes)</h2>
        ) : (
          <h2 className="!text-lg text-center">Total Gaming Data Volume (Bytes)</h2>
        )}
        <div className="min-h-[300px]">
          {(dataLakeDataVolumeGrowthData.length > 0 && (
            <ResponsiveContainer minWidth={"100%"} height={300} style={{ marginBottom: "2.5rem" }}>
              <AreaChart data={dataLakeDataVolumeGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" hide />
                <YAxis label="Total Volume (Bytes)" hide />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip formatter={(value, name) => [value.toLocaleString(), "Data Collected (in Bytes)"]} wrapperStyle={{ color: "#333" }} />
                {dataVolumeGamerReferenceBytes && <ReferenceLine y={dataVolumeGamerReferenceBytes} label="Your Data" stroke="red" />}
                <Area
                  connectNulls
                  animationDuration={3000}
                  animationEasing="ease-in"
                  type="monotone"
                  dataKey="totalBytes"
                  stroke="#006ee4"
                  fillOpacity={1}
                  fill="url(#colorUv)"
                  stackId={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          )) || <LoadingGraph />}
        </div>
      </div>
    </>
  );
}
