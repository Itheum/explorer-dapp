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
            <div className="flex justify-center">
              <span className="bg-yellow-100 text-yellow-800 text-xs md:text-sm font-medium rounded dark:bg-yellow-900 dark:text-yellow-300 p-1">
                Rank: {idx + 1}
              </span>
            </div>
            <div className="group">
              <img className="h-auto max-w-full" src={worker.vaultImg} alt={worker.vault} />
              <div className="h-[95px] -mt-[95px] bg-black opacity-75 p-[10px] pl-[15px] rounded-b-3xl text-white hidden group-hover:block">
                <p className="text-[10px]">{worker.vault}</p>
                <p className="text-[10px]">Rank Score: {worker.rankScore?.toLocaleString()}</p>
                <p className="text-[10px]">Total Bond: {worker.bondAmount?.toLocaleString()}</p>
                <p className="text-[10px]">Liveliness Score: {worker.livelinessScore?.toLocaleString()}</p>
                <p className="text-[10px]">BiTz XP: {worker.bitzXp?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
