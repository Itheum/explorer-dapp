import React from "react";
import NoDataFoundImg from "assets/img/NoDataFound.jpg";

export const NoDataFound: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[30dvh] w-full">
      <img src={NoDataFoundImg} alt="No Data Found" />
    </div>
  );
};
