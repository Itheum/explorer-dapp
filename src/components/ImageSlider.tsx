import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Image } from "lucide-react";
import { cn } from "libs/utils";

interface ImageSliderProps {
  imageUrls: string[];
  autoSlide?: boolean;
  autoSlideInterval?: number;
  imageWidth?: string;
  imageHeight?: string;
  onLoad?: () => void;
  openNftDetailsDrawer?: () => void;
}

//Spring animation parameters
const spring = {
  type: "spring",
  stiffness: 300,
  damping: 40,
};

const ImageSlider: React.FC<ImageSliderProps> = (props) => {
  const { imageUrls, autoSlide = false, autoSlideInterval = 6000, imageWidth = "210px", imageHeight = "210px", onLoad, openNftDetailsDrawer } = props;
  const [imageIndex, setImageIndex] = useState(0);
  const [switchedImageManually, setSwitchedImageManually] = useState(false);
  const [nextImageIndex, setNextImageIndex] = useState(0);
  const makeFlip = nextImageIndex !== imageIndex;

  useEffect(() => {
    if (autoSlide && imageUrls.length > 1 && !switchedImageManually) {
      const interval = setInterval(() => {
        goToNextImage();
      }, autoSlideInterval);
      return () => clearInterval(interval);
    }
  }, [switchedImageManually]);

  function goToPreviousImage(autoSwitch = false) {
    setNextImageIndex((prevIndex) => (prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1));
    setSwitchedImageManually(autoSwitch);
  }

  function goToNextImage(autoSwitch = false) {
    setNextImageIndex((prevIndex) => (prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1));
    setSwitchedImageManually(autoSwitch);
  }

  return (
    <div className="mb-8 w-full justify-center base:h-[15rem] md:h-[18rem] object-cover relative ">
      <div className="perspective-1200 transform-style-preserve-3d ">
        <motion.div
          transition={spring}
          style={{
            width: "100%",
            height: "100%",
            opacity: makeFlip ? 0 : 1,
            backfaceVisibility: "hidden",
            position: "absolute",
          }}>
          <img className="md:w-auto base:w-[15rem] rounded-3xl base:h-[15rem] md:h-[18rem] mx-auto" src={imageUrls[imageIndex]} onLoad={onLoad} />
        </motion.div>
        <motion.div
          initial={{ rotateY: 180 }}
          animate={{ rotateY: makeFlip ? 0 : 180 }}
          transition={spring}
          style={{
            width: "100%",
            height: "100%",
            opacity: makeFlip ? 1 : 0,
            backfaceVisibility: "hidden",
            position: "absolute",
          }}
          onAnimationComplete={() => {
            setImageIndex(nextImageIndex);
          }}>
          <img className="md:w-auto base:w-[15rem] rounded-3xl base:h-[15rem] md:h-[18rem] mx-auto" src={imageUrls[nextImageIndex]} onLoad={onLoad} />
        </motion.div>
      </div>
      {imageUrls.length > 1 && (
        <div className="z-10 flex flex-row h-full w-full justify-center items-end my-2 mt-6 gap-2 ">
          <ArrowLeft onClick={() => goToPreviousImage(true)} />

          <ArrowRight onClick={() => goToNextImage(true)} />
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
