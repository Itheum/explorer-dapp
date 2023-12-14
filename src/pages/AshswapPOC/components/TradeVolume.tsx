import React from "react";

export const TradeVolume: React.FC = () => {
  return (
    <div className="flex flex-col border border-amber-300 p-3 rounded-lg">
      <h3>Trade volume Graph</h3>
      <div className="flex justify-between items-center">
        <div className="w-[33%] flex flex-col">
          <h5>Volume in selected period/s</h5>
        </div>
        <div className="w-[66%] flex flex-col">
          <h5 className="text-center">Historic Volume</h5>
        </div>
      </div>
    </div>
  );
};
