import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "libComponents/Button";

interface ImageSliderProps {
  media: { url: string; type: string }[];
  autoSlide?: boolean;
  autoSlideInterval?: number;
  onLoad?: () => void;
}

//Spring animation parameters
const spring = {
  type: "spring",
  stiffness: 300,
  damping: 40,
};

const ImageSlider: React.FC<ImageSliderProps> = (props) => {
  const { media, autoSlide = false, autoSlideInterval = 6000, onLoad } = props;
  const [imageIndex, setImageIndex] = useState(0);
  const [switchedImageManually, setSwitchedImageManually] = useState(false);
  const [nextImageIndex, setNextImageIndex] = useState(0);
  const makeFlip = nextImageIndex !== imageIndex;

  useEffect(() => {
    if (autoSlide && media.length > 1 && !switchedImageManually) {
      const interval = setInterval(() => {
        goToNextImage();
      }, autoSlideInterval);
      return () => clearInterval(interval);
    }
  }, [switchedImageManually]);

  function goToPreviousImage(autoSwitch = false) {
    setNextImageIndex((prevIndex) => (prevIndex === 0 ? media.length - 1 : prevIndex - 1));
    setSwitchedImageManually(autoSwitch);
  }

  function goToNextImage(autoSwitch = false) {
    setNextImageIndex((prevIndex) => (prevIndex === media.length - 1 ? 0 : prevIndex + 1));
    setSwitchedImageManually(autoSwitch);
  }

  return (
    <div className="mb-8 w-full justify-center base:h-[15rem] md:h-[18rem] relative ">
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
          {media[imageIndex].type.includes("video") ? (
            <video
              autoPlay
              loop
              muted
              controls
              webkit-playsinline
              playsInline
              className=" md:w-auto base:w-[15rem] rounded-3xl base:h-[15rem] md:h-[18rem] mx-auto">
              <source src={media[imageIndex]?.url} type="video/mp4" />
            </video>
          ) : (
            <img className="md:w-auto base:w-[15rem] rounded-3xl base:h-[15rem] md:h-[18rem] mx-auto" src={media[imageIndex].url} onLoad={onLoad} />
          )}
        </motion.div>
        {makeFlip && (
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
            {media[nextImageIndex].type.includes("video") ? (
              <video
                autoPlay
                loop
                muted
                controls
                webkit-playsinline
                playsInline
                className=" md:w-auto base:w-[15rem] rounded-3xl base:h-[15rem] md:h-[18rem] mx-auto">
                <source src={media[nextImageIndex]?.url} type="video/mp4" />
              </video>
            ) : (
              <img className="md:w-auto base:w-[15rem] rounded-3xl base:h-[15rem] md:h-[18rem] mx-auto" src={media[nextImageIndex].url} onLoad={onLoad} />
            )}
          </motion.div>
        )}
      </div>
      {media.length > 1 && (
        <div className="z-10 flex flex-row h-full w-full justify-center items-end my-2 mt-8 gap-2 ">
          <Button className="p-1 h-6 !rounded-3xl" disabled={makeFlip}>
            <ArrowLeft onClick={() => goToPreviousImage(true)} />
          </Button>
          <Button className="p-1 h-6 !rounded-3xl" disabled={makeFlip}>
            <ArrowRight onClick={() => goToNextImage(true)} />{" "}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
