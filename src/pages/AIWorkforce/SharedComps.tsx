import React from "react";

export function WorkersSnapShotGrid({ snapShotData }: { snapShotData: any[] }) {
  const flattenedFixedData: any[] = [];

  if (snapShotData) {
    snapShotData.map((worker: any) => {
      flattenedFixedData.push(worker);
    });
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
      {flattenedFixedData &&
        flattenedFixedData.length > 0 &&
        flattenedFixedData.map((worker: any, idx: number) => (
          <div key={idx}>
            <div className="">
              <span className="bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300 pb-3 ml-[10px]">
                Rank: {idx + 1}
              </span>
            </div>
            <img className="h-auto max-w-full" src={worker.vaultImg} alt={worker.vault} />
            <div className="h-[78px] -mt-[78px] bg-black opacity-75 p-[10px] pl-[15px] text-white rounded-[20px] md:rounded-[27px]">
              <p className="text-[10px]">{worker.vault}</p>
              <p className="text-[10px]">Score: {worker.rankScore}</p>
              <p className="text-[10px]">Bonded Amount: {worker.bondAmount}</p>
              <p className="text-[10px]">Liveliness Score: {worker.livelinessScore}</p>
            </div>
          </div>
        ))}
    </div>
  );
}
