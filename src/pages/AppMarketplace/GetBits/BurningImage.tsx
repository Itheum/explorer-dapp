import React from "react";
import { AnimatePresence, motion, AnimatePresenceProps } from "framer-motion";

const burningImageVariants = {
  initial: {
    opacity: 1,
    scale: 1,
    filter: "none",
  },
  burning: {
    opacity: [1, 1, 0.7, 0.3, 0],
    scale: [1, 1, 0.7, 0.3, 0.0],
    filter: ["blur(0px)", "blur(1px)", "blur(2px)", "blur(4px)", "blur(8px)"],
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
