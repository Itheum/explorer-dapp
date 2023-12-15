import React from "react";
import BigNumber from "bignumber.js";

type TradeVolumeProps = {
  totalVolume: BigNumber.Value;
  volumeHistory: any;
};

export const TradeVolume: React.FC<TradeVolumeProps> = (props) => {
  const { totalVolume, volumeHistory } = props;

  return (
    <div className="flex flex-col border border-amber-300 p-3 rounded-lg">
      <h3 className="pb-3">Trade volume Graph</h3>
      <div className="flex justify-between items-center">
        <div className="w-[33%] flex flex-col">
          <h5>Volume in selected period/s</h5>
          <div className="pt-3">{totalVolume.toString()}</div>
        </div>
        <div className="w-[66%] flex flex-col">
          <h5 className="text-center">Historic Volume</h5>
          <div className="flex justify-between">
            {volumeHistory.map((item: any, index: any) => {
              return (
                <div className="flex flex-col" key={index}>
                  <span>{item.headerText}</span>
                  {<span>{item.volume.toNumber()}</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
