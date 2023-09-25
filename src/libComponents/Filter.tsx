import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "./Card";
import { ChevronDown, X } from "lucide-react";
import { Badge } from "./Badge";
import { Button } from "./Button";

type FilterProps = {
  filterData?: Array<string>;
};

export const Filter: React.FC<FilterProps> = (props) => {
  const { filterData } = props;

  const [isFilterShown, setIsFilterShown] = useState<boolean>(false);

  return (
    <div className="flex flex-row items-center gap-3">
      <span className="">Filter timeline</span>
      <div className="w-[11rem] relative bottom-5">
        <div className="absolute top-full left-0">
          <Button variant="outline" className="border-[1px] border-slate-100/20 text-foreground w-full" onClick={() => setIsFilterShown(!isFilterShown)}>
            All Categories
            <ChevronDown className="w-5 h-5 mt-1" />
          </Button>
          {isFilterShown && (
            <div className="pt-1">
              <Card className="absolute top-full bg-background text-foreground border-[1px] border-slate-300/40 max-w-[22rem] min-w-[16rem] rounded-xl">
                <CardHeader className="flex flex-row justify-between">
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-500 bg-clip-text text-transparent text-xl">Filter by:</span>
                  <X className="w-5 h-5 cursor-pointer" />
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3 w-[20rem]">
                  {filterData?.map((item, index) => (
                    <Badge className="cursor-pointer">{item}</Badge>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
