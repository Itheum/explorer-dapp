import * as React from "react";
import { useLocation } from "react-router-dom";
import { Search } from "lucide-react";

export const PageNotFound = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex w-full h-[90svh] justify-center items-center">
      <div className="w-4/12 shadow-accent-foreground/40 shadow-md rounded p-4 border-0 bg-background">
        <div className="text-center flex flex-col justify-center p-10">
          <Search strokeWidth={2.5} className="mx-auto w-20 h-20" />
          <span className="text-xl mt-3">Page not found</span>
          <span className="text-lg text-muted-foreground">{pathname}</span>
        </div>
      </div>
    </div>
  );
};
