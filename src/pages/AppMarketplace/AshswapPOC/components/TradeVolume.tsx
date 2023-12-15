import React from "react";
import BigNumber from "bignumber.js";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

type TradeVolumeProps = {
  totalVolume: BigNumber.Value;
  volumeHistory: any;
  chartItem: any;
};

export const TradeVolume: React.FC<TradeVolumeProps> = (props) => {
  const { totalVolume, volumeHistory, chartItem } = props;

  // console.log(chartItem);

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Volume history",
      },
    },
  };

  const takeLineLabels = chartItem.map((volumeHistory: any) => {
    return { volumeHistory: volumeHistory.headerText, volumeAmount: volumeHistory.volume.toNumber() };
  });
  // console.log(volumeHistory);

  const data = {
    labels: takeLineLabels.map((item: any) => item.volumeHistory),
    datasets: [
      {
        label: "Dataset 1",
        data: takeLineLabels.map((item: any) => item.volumeAmount),
        borderColor: "rgb(45 212 191)",
        backgroundColor: "rgb(45 212 191)",
      },
    ],
  };

  return (
    <div className="flex flex-col border border-amber-300 p-3 rounded-lg">
      <h3 className="pb-3 !font-bold">Trade volume Graph</h3>
      <div className="flex justify-between items-start">
        <div className="w-[33%] flex flex-col">
          <h5 className="!font-semibold">Volume in selected period/s</h5>
          <div className="pt-3 text-lg font-bold">{totalVolume.toString()}</div>
        </div>
        <div className="w-[66%] flex flex-col pb-4">
          <h5 className="text-center !font-semibold">Historic Volume</h5>
          <div className="flex justify-between py-3">
            {volumeHistory.map((item: any, index: any) => {
              return (
                <div className="flex flex-col" key={index}>
                  <span>{item.headerText}</span>
                  <span className="">{item.volume.toNumber()}</span>
                </div>
              );
            })}
          </div>
          <div className="w-[100%]">
            <Line options={options} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};
