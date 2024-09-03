import axios from "axios";
import moment from "moment-timezone";
import { getApiWeb2Apps } from "libs/utils";

export const LoadingGraph = () => {
  return (
    <div className="flex items-center justify-center w-[100%] h-[280px]">
      <div className="px-3 py-1 text-xs font-medium leading-none text-center text-black-100 bg-[#CCCCCC] rounded-full animate-pulse dark:bg-[#4d5259] dark:text-[#FFFFFF]">
        loading...
      </div>
    </div>
  );
};

export async function getAggregatedAnalyticsData() {
  const responseAggregated = await axios.get(`${getApiWeb2Apps()}/datadexapi/bespoke/analytics/aggregated`);
  const dataAggregated = responseAggregated.data;

  return dataAggregated;
}

export function normalizeDataForMarshalUsage(dayData: any, day: string) {
  const chainMarshalUsageDataI = { name: day, mvx: -1, sol: -1 };

  let mvxNumbers = dayData["marshal_usage_events"]["mvx"];
  let solNumbers = dayData["marshal_usage_events"]["sol"];

  // on some days we had 0 incorrectly aggregated in raw data.
  // ... convert them to null so that the graph will "connectNulls"
  if (mvxNumbers === 0) {
    mvxNumbers = null;
    console.log(`ERR: mvx marshal events for ${day} was 0`);
  }

  if (solNumbers === 0) {
    solNumbers = null;
    console.log(`ERR: sol marshal events for ${day} was 0`);
  }

  chainMarshalUsageDataI["mvx"] = mvxNumbers;
  chainMarshalUsageDataI["sol"] = solNumbers;

  return chainMarshalUsageDataI;
}

export function formatYAxisDate(tickItem: any) {
  return moment(tickItem).format("MM-DD-YY");
}
