import React from "react";
import { motion } from "framer-motion";
import { MousePointerClick } from "lucide-react";
import MouseFollower from "./Torch";

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
    <div className="cursor-none relative select-none">
      <MouseFollower />
      <motion.img
        className="rounded-[.5rem] w-[210px] md:w-[300px] max-h-[400px] m-auto -z-1"
        src={src}
        alt="Burning Image"
        variants={burningImageVariants}
        initial="initial"
        animate="burning"
        exit="consumed"
      />{" "}
      {burnProgress === 0 && <MousePointerClick className="text-[#35d9fa] w-10 h-10 animate-pulse absolute -mt-32 right-0" />}
    </div>
  );
};
