import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "./Card";
import { ChevronDown, RotateCcw, X } from "lucide-react";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { useFilterStore } from "../store/FilterStore";

export interface IFilterData {
  id: number;
  value: string;
}

type FilterProps = {
  filterData?: Array<IFilterData>;
  selectedFilterCallback?: Array<string> | string | null;
};

export const Filter: React.FC<FilterProps> = (props) => {
  const { filter, setFilter } = useFilterStore();
  const [isFilterShown, setIsFilterShown] = useState<boolean>(false);
  // const [selectedFilter, setSelectedFilter] = useState<Array<string> | string | null>(null);
  // console.log(filter);

  const { filterData } = props;

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
                  {/*<Button variant="ghost" className="mt-0 !pt-0">*/}
                  <RotateCcw
                    className="w-6 h-6 cursor-pointer hover:text-muted-foreground"
                    onClick={() => {
                      setFilter(null);
                      setIsFilterShown(!isFilterShown);
                    }}
                  />
                  {/*</Button>*/}
                  {/*<Button variant="ghost" onClick={() => setIsFilterShown(!isFilterShown)} className="mt-0 !pt-0">*/}
                  <X className="w-6 h-6 cursor-pointer hover:text-muted-foreground" onClick={() => setIsFilterShown(!isFilterShown)} />
                  {/*</Button>*/}
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3 w-[20rem]">
                  {filterData?.map((item, index) => (
                    <>
                      {item.value !== filter ? (
                        <Badge
                          className="cursor-pointer"
                          key={item.id}
                          onClick={() => {
                            setFilter(item.value);
                            setIsFilterShown(!isFilterShown);
                          }}>
                          {item.value}
                        </Badge>
                      ) : (
                        <Badge
                          className="cursor-pointer bg-gradient-to-r from-yellow-300 to-orange-500 text-background"
                          key={item.id}
                          onClick={() => {
                            setFilter(item.value);
                            setIsFilterShown(!isFilterShown);
                          }}>
                          {item.value}
                        </Badge>
                      )}
                    </>
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
