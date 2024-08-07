import React from "react";
import QuestionCard from "./QuestionCard";

interface FAQAccordionProps {
  faqList: any[];
  borderStyleStr?: string;
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({ borderStyleStr, faqList }) => {
  const borderStyleStrToUse = borderStyleStr || "border border-[#FFFFFF]";

  return (
    <div id="faq" className={`flex flex-col max-w-[100%] p-[2rem] rounded-[1rem] mt-[3rem] ${borderStyleStrToUse}`}>
      <div className="flex flex-col mb-8 items-center justify-center">
        <span className="text-foreground text-4xl mb-2">FAQs</span>
        <span className="text-base text-foreground/75 text-center ">Explore our frequently asked questions and answers.</span>
      </div>
      <div className="flex flex-col gap-4 justify-center items-center ">
        {faqList.map((pair, index) => (
          <QuestionCard
            key={index}
            title={pair.title}
            content={pair.content}
            borderStyleStr={"border-dotted border border-[#006ee4]"}
            shadowStyleStr="shadow-sm"
          />
        ))}
      </div>
    </div>
  );
};

export default FAQAccordion;
