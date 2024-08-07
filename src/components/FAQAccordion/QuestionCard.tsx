import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "libs/utils";

interface QuestionCardProps {
  title: string;
  content: JSX.Element;
  borderStyleStr?: string;
  shadowStyleStr?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ title, content, borderStyleStr, shadowStyleStr }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const borderStyleStrToUse = borderStyleStr || "border border-[#35d9fa]";
  const shadowStyleStrToUse = shadowStyleStr || "shadow-md shadow-black/20 dark:shadow-[#35d9fa]/20";

  return (
    <div className={`p-4 px-6 rounded-3xl w-full lg:max-w-[80%] ${shadowStyleStrToUse} ${borderStyleStrToUse}`}>
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => {
          setShowAnswer((prev) => !prev);
        }}>
        <h3 className={"text-4xl font-semibold"}>{title}</h3>
        <div
          className={cn(
            "w-8 justify-end flex text-[#ffffff] -mt-1  ",
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
