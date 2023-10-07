import React from "react";
import NoDataFoundImg from "assets/img/NoDataFoundNoBG.png";

type NoDataFoundProps = {
  height?: string;
};

export const NoDataFound: React.FC<NoDataFoundProps> = ({ height = "[60dvh]" }) => {
  return (
    <div className={`flex flex-col justify-center items-center h-${height} w-full`}>
      <img src={NoDataFoundImg} alt="No Data Found" />
      <span className="text-2xl font-[Clash-Medium] pb-3">No Data Found</span>
    </div>
  );
};
