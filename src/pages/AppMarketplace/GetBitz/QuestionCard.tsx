import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { TextGenerateEffect } from "libComponents/Animated/TextGenerateEffect";

interface QuestionCardProps {
  title: string;
  content: string[];
}

const QuestionCard: React.FC<QuestionCardProps> = ({ title, content }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="p-4 px-6 rounded-3xl border border-[#35d9fa] ">
      <div className="flex justify-between items-center">
        <h3 className="text-[#35d9fa] text-4xl fond-bold ">{title}</h3>
        <div className="w-8 justify-end flex">
          {showAnswer ? (
            <Minus
              className="cursor-pointer text-[#35d9fa]"
              onClick={() => {
                setShowAnswer(false);
              }}
            />
          ) : (
            <Plus
              className="cursor-pointer text-[#35d9fa]"
              onClick={() => {
                setShowAnswer(true);
              }}
            />
          )}
        </div>
      </div>
      {showAnswer && (
        <div className="w-[90%] ">
          {content.map((answer, idx) => (
            <TextGenerateEffect key={idx} words={answer} className="font-light text-sm mb-2" />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
