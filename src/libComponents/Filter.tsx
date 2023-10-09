import React, { Fragment, useState } from "react";
import { Card, CardContent, CardHeader } from "./Card";
import { ChevronDown, ListFilter, RotateCcw, X } from "lucide-react";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { useFilterStore } from "../store/FilterStore";

export interface IFilterData {
  id: number;
  value: string;
}

type FilterProps = {
  filterData?: Array<IFilterData>;
};

export const Filter: React.FC<FilterProps> = (props) => {
  const { filter, setFilter } = useFilterStore();
  const [isFilterShown, setIsFilterShown] = useState<boolean>(false);

  const { filterData } = props;

  return (
    <div className="flex flex-row items-center gap-3 pb-2">
      <span className="md:flex hidden">Filter timeline</span>
      <div className="w-[11rem] relative bottom-5">
        <div className="absolute top-full left-0">
          <Button
            variant="outline"
            className="md:flex hidden border-[1px] border-slate-100/20 text-foreground w-full"
            onClick={() => setIsFilterShown(!isFilterShown)}>
            All Categories
            <ChevronDown className="w-5 h-5 mt-1" />
          </Button>
          <Button variant="ghost" className="md:hidden flex bg-foreground/10 text-foreground w-full" onClick={() => setIsFilterShown(!isFilterShown)}>
            <ListFilter className="w-5 h-5 mt-1" />
          </Button>
          {isFilterShown && (
            <div className="pt-1">
              <Card className="absolute top-full bg-background text-foreground border-[1px] border-slate-300/40 md:max-w-[22rem] min-w-[16rem] rounded-xl">
                <CardHeader className="flex flex-row justify-between">
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-500 bg-clip-text text-transparent text-xl">Filter by:</span>
                  <RotateCcw
                    className="w-6 h-6 cursor-pointer hover:text-muted-foreground"
                    onClick={() => {
                      setFilter(null);
                      setIsFilterShown(!isFilterShown);
                    }}
                  />
                  <X className="w-6 h-6 cursor-pointer hover:text-muted-foreground" onClick={() => setIsFilterShown(!isFilterShown)} />
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3 w-[20rem]">
                  {filterData?.map((item, index) => (
                    <Fragment key={index}>
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
                    </Fragment>
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
