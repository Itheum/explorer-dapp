import React from "react";
import { Button } from "../../../../libComponents/Button";

type WeekSelectorProps = {
  setSelectedWeeks: React.Dispatch<React.SetStateAction<Set<number>>>;
  selectedWeeks: Set<number>;
};

export const WeekSelector: React.FC<WeekSelectorProps> = (props) => {
  const { setSelectedWeeks, selectedWeeks } = props;
  const arrayOfWeeks = [
    { week: 1701907200, translatedText: "This week" },
    { week: 1701302400, translatedText: "One week ago" },
    { week: 1700697600, translatedText: "Two week ago" },
    { week: 1700092800, translatedText: "Three week ago" },
  ];

  const handleWeekClick = (weekObject: Record<any, any>) => {
    const newSelectedWeek = new Set(selectedWeeks);

    if (newSelectedWeek.has(weekObject.week)) {
      newSelectedWeek.delete(weekObject.week);
      weekObject.isActive = !weekObject.isActive;
    } else {
      newSelectedWeek.add(weekObject.week);
      weekObject.isActive = !weekObject.isActive;
    }

    setSelectedWeeks(newSelectedWeek);
  };

  const isWeekSelected = (weekObject: Record<any, any>) => {
    return selectedWeeks.has(weekObject.week);
  };

  return (
    <div className="flex flex-col border border-amber-300 p-3 rounded-lg mt-3">
      <h3 className="uppercase !font-bold">Week period selector</h3>
      <div className="flex flex-row gap-10 pt-2">
        {arrayOfWeeks.map((week, index) => {
          return (
            <Button variant="ghost" className={isWeekSelected(week) ? "text-teal-400" : ""} key={index} onClick={() => handleWeekClick(week)}>
              {week.translatedText}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
