import React, { useEffect, useState } from "react";

type TradeVolumeProps = {
  jsonData: number;
  customObject: Set<number>;
};

export const TradeVolume: React.FC<TradeVolumeProps> = (props) => {
  const { jsonData, customObject } = props;

  const historyVolume = [
    { week: 1701907200, volume: jsonData && Number(jsonData) / 10 ** 18, headerText: "This week" },
    { week: 1701302400, volume: 100, headerText: "One week ago" },
    { week: 1700697600, volume: 200, headerText: "Two week ago" },
    { week: 1700092800, volume: 400, headerText: "Three week ago" },
  ];

  const [totalVolume, setTotalVolume] = useState<number>(jsonData);

  const test = () => {
    if (totalVolume !== undefined) {
      let newTotalVolume = totalVolume;
      historyVolume.forEach((item) => {
        console.log(item);
        if (jsonData && customObject.has(item.week)) {
          console.log("inainte de add", newTotalVolume);
          newTotalVolume += item.volume;
          setTotalVolume(newTotalVolume);
        } else {
          newTotalVolume -= item.volume;
          setTotalVolume(newTotalVolume);
        }
      });
    }
  };

  useEffect(() => {
    console.log(totalVolume);

    let newTotalVolume = jsonData && Number(jsonData) / 10 ** 18;
    historyVolume.forEach((item) => {
      console.log(item);
      if (jsonData && customObject.has(item.week)) {
        console.log("inainte de add", newTotalVolume);
        newTotalVolume += item.volume;
        setTotalVolume(newTotalVolume);
      } else {
        newTotalVolume -= item.volume;
        setTotalVolume(newTotalVolume);
      }
    });
    console.log(newTotalVolume);
  }, [customObject, jsonData]);

  return (
    <div className="flex flex-col border border-amber-300 p-3 rounded-lg">
      <h3 className="pb-3">Trade volume Graph</h3>
      <div className="flex justify-between items-center">
        <div className="w-[33%] flex flex-col">
          <h5>Volume in selected period/s</h5>
          <div className="pt-3">
            {!jsonData && <div>Loading...</div>}
            {jsonData && totalVolume}
          </div>
        </div>
        <div className="w-[66%] flex flex-col">
          <h5 className="text-center">Historic Volume</h5>
          <div className="flex justify-between">
            {historyVolume.map((item, index) => {
              return (
                <div className="flex flex-col" key={index}>
                  <span>{item.headerText}</span>
                  {!jsonData ? <div>Loading...</div> : <span>{item.volume}</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
