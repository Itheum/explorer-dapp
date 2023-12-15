import React, { useEffect, useState } from "react";
import { Button } from "../../../../libComponents/Button";

type WeekSelectorProps = {
  setCustomObject: React.Dispatch<React.SetStateAction<Set<number>>>;
};

export const WeekSelector: React.FC<WeekSelectorProps> = (props) => {
  const { setCustomObject } = props;
  const initialWeekObject = [
    { week: 1701907200, isActive: true, translatedText: "This week" },
    { week: 1701302400, isActive: false, translatedText: "One week ago" },
    { week: 1700697600, isActive: false, translatedText: "Two week ago" },
    { week: 1700092800, isActive: false, translatedText: "Three week ago" },
  ];

  const [weeks, setWeeks] = useState<Array<Record<any, any>>>(initialWeekObject);

  const selectedWeek = new Set([1701907200]);
  const [selectedWeekState, setSelectedWeekState] = useState<Set<number>>(selectedWeek);

  const handleWeekClick = (weekObject: Record<any, any>) => {
    const newSelectedWeek = new Set(selectedWeekState);

    if (newSelectedWeek.has(weekObject.week)) {
      newSelectedWeek.delete(weekObject.week);
      weekObject.isActive = !weekObject.isActive;
    } else {
      newSelectedWeek.add(weekObject.week);
      weekObject.isActive = !weekObject.isActive;
    }

    setSelectedWeekState(newSelectedWeek);
    setCustomObject(newSelectedWeek);
  };

  useEffect(() => {
    // console.log(selectedWeekState);
    // console.log(weeks);
  }, [selectedWeek]);

  const WEKK_SECONDS = 3 * 604800;
  const variable = 1701907200 - WEKK_SECONDS;
  const d = new Date(variable).toLocaleString();
  // console.log(variable);
  return (
    <div className="flex flex-col border border-amber-300 p-3 rounded-lg mt-3">
      <h3 className="uppercase">Week period selector</h3>
      <div className="flex flex-row gap-10 pt-2">
        {weeks.map((week, index) => {
          return (
            <Button variant="ghost" className={week.isActive ? "text-teal-400" : ""} key={index} onClick={() => handleWeekClick(week)}>
              {week.translatedText}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
