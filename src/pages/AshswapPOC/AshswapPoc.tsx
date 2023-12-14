import React, { useEffect, useState } from "react";
import { WeekSelector } from "./components/WeekSelector";
import { TradeVolume } from "./components/TradeVolume";
import axios from "axios";

export const AshswapPoc: React.FC = () => {
  const [getWeekVolume, setGetWeekVolume] = useState<Record<any, any>>({});
  const [totalObject, setTotalObject] = useState<Array<Record<any, any>>>([{}]);

  const fetchWeeklyVolume = async (timestamp: string, nonce: string, collection: string) => {
    const url: string = "https://staging-itheum-api.up.railway.app/ashswap-poc";
    try {
      const { data } = await axios.get(url, {
        headers: {
          "x-week-timestamp": `${timestamp}`,
          "x-nft-nonce": `${nonce}`,
          "x-nft-collection": `${collection}`,
        },
      });
      setTotalObject(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchWeeklyVolume("1701907200", "3", "APNFT-2f808f");
    console.log(totalObject);
  }, []);

  return (
    <div className="flex flex-col gap-7">
      <WeekSelector />
      <TradeVolume />
    </div>
  );
};
