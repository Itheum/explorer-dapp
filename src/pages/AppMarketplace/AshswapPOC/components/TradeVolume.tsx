import React from "react";
import BigNumber from "bignumber.js";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

type TradeVolumeProps = {
  totalVolume: BigNumber.Value;
  volumeHistory: any;
};

export const TradeVolume: React.FC<TradeVolumeProps> = (props) => {
  const { totalVolume, volumeHistory } = props;

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

  const takeLineLabels = volumeHistory.map((volumeHistory: any) => {
    return { volumeHistory: volumeHistory.headerText, volumeAmount: volumeHistory.volume.toNumber() };
  });
  // console.log(takeLineLabels);

  const data = {
    labels: takeLineLabels.map((item: any) => item.volumeHistory),
    datasets: [
      {
        label: "Dataset 1",
        data: takeLineLabels.map((item: any) => item.volumeAmount),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderDashOffset: 0.0,
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
      },
    ],
  };

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
          <div className="w-[100%]">
            <Line options={options} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};
