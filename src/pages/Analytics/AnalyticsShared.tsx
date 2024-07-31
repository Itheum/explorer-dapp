import axios from "axios";
import { getApiWeb2Apps } from "libs/utils";

export const LoadingGraph = () => {
  return (
    <div className="flex items-center justify-center w-[100%] h-[280px]">
      <div className="px-3 py-1 text-xs font-medium leading-none text-center text-black-100 bg-[#CCCCCC] rounded-full animate-pulse dark:bg-[#4d5259] dark:text-[#82ca9d]">
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
