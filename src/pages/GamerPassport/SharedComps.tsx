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

export const faqList = [
  {
    title: "I've joined, but my submission is being reviewed, what next?",
    content: (
      <>
        <p>
          Once your submission is received, it can take around 12 hours for your submission to be approved and for the first data snapshot to be collected and
          to appear on this app page. So, please come back in some time and it should be available. (We are working to speed things up)
        </p>
      </>
    ),
  },
  {
    title: "I've joined, but no data is shown yet, how long will it take?",
    content: (
      <>
        <p>
          Once your submission is approved, it can take around 12 hours for your first data snapshot to be collected and to appear on this app page. So, please
          come back in some time and it should be available. (We are working to speed things up)
        </p>
      </>
    ),
  },
  {
    title: "I'm not a PlayStation gamer, can I join?",
    content: (
      <>
        <p>
          Right now, we're all about PlayStation! But don’t worry, XBOX, Steam, and others are on the way. If you’re eager for those,{" "}
          <a
            className="!text-[#7a98df] hover:underline"
            href="https://docs.google.com/forms/d/e/1FAIpQLSdC_HBveamuFiHjI3dGIIXkOnODyYXxtZdJQCmTyzSfRY2i8A/viewform"
            target="blank">
            register your interest here
          </a>
          . We’ll give you a heads-up when they launch!
        </p>
      </>
    ),
  },
  {
    title: "Why do I need to connect a Solana wallet?",
    content: (
      <>
        <p>
          We need a way to connect your de-identified gaming data to you for future rewards. But hey, no worries! You can use your Google Account to create a
          session wallet via our TipLink integration. Easy peasy!
        </p>
      </>
    ),
  },
  {
    title: "I've registered and my data is being collected, Wen Rewards?",
    content: (
      <>
        {" "}
        <p>
          We're in the early stages of onboarding and aiming for 500 gamers before the reward train leaves the station! Why 500? Because data is only valuable
          in bulk! Rewards are coming, but the exact details are top secret (for now). Metrics like time in the program, data shared, gaming performance, and
          engagement will all play a part.
        </p>
      </>
    ),
  },
  {
    title: "What data is being collected and how is it stored and used?",
    content: (
      <>
        <p>
          We’re all about transparency and data ownership. Check out our{" "}
          <a
            className="!text-[#7a98df] hover:underline"
            href="https://docs.itheum.io/product-docs/legal/ecosystem-tools-terms/gamer-passport/data-collection-and-storage"
            target="blank">
            Data Collection and Storage strategy here
          </a>
          . Your data helps create awesome analytics reports that may be showcased publicly, fully de-identified, of course. And don't worry, your data won't be
          sold without your consent and a collective vote on profit-sharing!
        </p>
      </>
    ),
  },
  {
    title: "I've joined and my data is being collected, how can I opt out as I want to exit the system?",
    content: (
      <>
        <p>
          Please don't 😢. But if you must, reach out to us first to address any concerns. If you still want to opt-out, email us at "privacy@itheum.io" with
          your gaming platform username (e.g., PlayStation username), blockchain wallet used to sign up (e.g., Solana wallet), and any other relevant details.
          We’ll verify your identity and remove your data within 30 days. Note: Data in decentralized storage will only be deleted when the storage protocol
          naturally purges it.
        </p>
      </>
    ),
  },
  {
    title: "Is my gaming data really worth money?",
    content: (
      <>
        <p>
          The gaming industry is one of the fastest-growing industries in the world! It's super competitive, with studios and platforms vying to personalize and
          expand their market share. AI plays a big role in this personalization, and guess what? It's all possible thanks to your data. The value of your data
          skyrockets when combined with data from multiple gamers. So yes, your data is incredibly valuable, especially when it's part of a bulk pool!
        </p>
      </>
    ),
  },
  {
    title: "I want to increase the amount of data I generate to get more rewards, can I do this?",
    content: (
      <p>
        Right now, we’re in passive data collection mode, automatically gathering data from your connected platforms. But stay tuned! We're working on letting
        you check in additional data to add more context and make your gaming data even more valuable.
      </p>
    ),
  },
  {
    title: "Do you have a Discord? I want to hand out with other gamers and get exclusive Alpha.",
    content: (
      <p>
        Of course Bruh! We'd love to have you in our{" "}
        <a className="!text-[#7a98df] hover:underline" href="https://itheum.io/discord" target="blank">
          discord
        </a>
      </p>
    ),
  },
];
