import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "libs/utils";

interface QuestionCardProps {
  title: string;
  content: JSX.Element;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ title, content }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="p-4 px-6 rounded-3xl border border-[#35d9fa] w-full shadow-md shadow-black/20 dark:shadow-[#35d9fa]/20">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => {
          setShowAnswer((prev) => !prev);
        }}>
        <h3 className={"text-4xl font-semibold"}>{title}</h3>
        <div
          className={cn(
            "w-8 justify-end flex text-[#35d9fa] -mt-1  ",
            showAnswer ? "transform origin-center transition duration-200 ease-out" : " transform rotate-90 origin-center transition duration-200 ease-out"
          )}>
          {showAnswer ? <Minus /> : <Plus />}
        </div>
      </div>
      {showAnswer && <div className=" mt-6  "> {content}</div>}
    </div>
  );
};

export default QuestionCard;
