import React from "react";
import { motion } from "framer-motion";

const burningImageVariants = {
  initial: {
    opacity: 1,
    scale: 1,
    filter: "none",
  },
  burning: {
    opacity: [1, 1, 0.7, 0.2, 0],
    scale: [1, 0.9, 0.7, 0.5, 0],
    filter: ["brightness(100%)", "brightness(15%)", "brightness(5%)", "brightness(0%)", "brightness(0%)"],
    transition: {
      duration: 20,
      ease: "easeInOut",
    },
  },
  consumed: {
    opacity: 0,
    scale: 1,
    filter: "blur(8px)",
  },
};

export const BurningImage: React.FC<{ src: string }> = ({ src }) => {
  return (
    <motion.img
      className="rounded-[.5rem] w-[210px] md:w-[300px] m-auto -z-1"
      src={src}
      alt="Burning Image"
      variants={burningImageVariants}
      initial="initial"
      animate="burning"
      exit="consumed"
    />
  );
};
