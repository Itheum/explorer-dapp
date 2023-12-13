import React, { useState } from "react";
import { WeekSelector } from "./components/WeekSelector";
import { TradeVolume } from "./components/TradeVolume";

export const AshswapPoc: React.FC = () => {
  const [getWeekVolume, setGetWeekVolume] = useState<Record<any, any>>({});
  const [totalObject, setTotalObject] = useState<Array<Record<any, any>>>([{}]);
  return (
    <div className="flex flex-col">
      <WeekSelector />
      <TradeVolume />
    </div>
  );
};
