import React, { useState } from "react";

const weeks = [
  { week: 1701907200, isActive: true, translatedText: "This week" },
  { week: 1702007200, isActive: false, translatedText: "One week ago" },
  { week: 1702458768, isActive: false, translatedText: "Two week ago" },
];

export const WeekSelector: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState<number>(1702466932);
  const d = new Date(1701907200).toLocaleString();
  console.log(d);
  return (
    <div className="flex flex-col border border-amber-300 p-3 rounded-lg">
      <h3 className="uppercase">Week period selector</h3>
      <div className="flex flex-row"></div>
    </div>
  );
};
