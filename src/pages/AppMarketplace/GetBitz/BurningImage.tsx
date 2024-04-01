import React from "react";
import { motion } from "framer-motion";
import { MousePointerClick } from "lucide-react";
import clickHere from "assets/img/getbitz/hand-apple.gif";
export const BurningImage: React.FC<{ src: string; burnProgress: number }> = ({ src, burnProgress }) => {
  const burningImageVariants = {
    initial: {
      opacity: 1,
      scale: 1,
      filter: "none",
    },
    burning: {
      opacity: 1 - burnProgress / 12,
      scale: 1 - burnProgress / 12,
      filter: `brightness(${100 - burnProgress * 8}%)`,
      transition: {
        duration: 5,
        ease: "easeInOut",
      },
    },
    consumed: {
      opacity: 0,
      scale: 1,
      filter: "blur(8px)",
    },
  };

  return (
    <div className="cursor-none relative select-none  ">
      <motion.img
        className="rounded-[.5rem] w-[210px] md:w-[300px] max-h-[400px] m-auto -z-1"
        src={src}
        alt="Burning Image"
        variants={burningImageVariants}
        initial="initial"
        animate="burning"
        exit="consumed"
      />{" "}
      {burnProgress === 0 && (
        <div className="absolute -mt-32 bottom-16 ">
          <img src={clickHere} className="w-32 h-32 z-10" />
        </div>
      )}
    </div>
  );
};
