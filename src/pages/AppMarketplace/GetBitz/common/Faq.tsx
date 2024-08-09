import React from "react";
import { useLocalStorageStore } from "store/LocalStorageStore.ts";
import QuestionCard from "./QuestionCard";
import { faqs as mvxFaqs } from "../GetBitzMvx/configMvx";
import { faqs as solFaqs } from "../GetBitzSol/configSol";

const Faq: React.FC = () => {
  const defaultChain = useLocalStorageStore((state) => state.defaultChain);
  const faqs = defaultChain === "multiversx" ? mvxFaqs : solFaqs;
  return (
    <div id="faq" className="flex flex-col max-w-[100%] border border-[#35d9fa] p-[2rem] rounded-[1rem] mt-[3rem]">
      <div className="flex flex-col mb-8 items-center justify-center">
        <span className="text-foreground text-4xl mb-2">FAQs</span>
        <span className="text-base text-foreground/75 text-center ">Explore our frequently asked questions and answers.</span>
      </div>
      <div className="flex flex-col gap-4 justify-center items-center ">
        {faqs.map((pair, index) => (
          <QuestionCard key={index} title={pair.title} content={pair.content} />
        ))}
      </div>
    </div>
  );
};

export default Faq;
