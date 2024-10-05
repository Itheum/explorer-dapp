import React from "react";
import { cn } from "libs/utils";

export const PulseLoader = ({ cusStyle }: { cusStyle?: string }) => {
  return (
    <div
      className={cn(
        "px-3 py-1 text-xs font-medium leading-none text-center text-black-100 bg-[#CCCCCC] rounded-full animate-pulse dark:bg-[#4d5259] dark:text-[#FFFFFF]",
        cusStyle
      )}>
      Loading...
    </div>
  );
};
