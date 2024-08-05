import React, { useState, useEffect } from "react";
import torch from "assets/img/getbitz/torch.webp";

const Torch: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        const { clientX, clientY } = touch;
        setPosition({ x: clientX, y: clientY });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const offsetX = window.scrollX || document.documentElement.scrollLeft;
      const offsetY = window.scrollY || document.documentElement.scrollTop;
      setPosition({ x: clientX + offsetX, y: clientY + offsetY });
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <img
      src={torch}
      className="w-16 h-32 z-[30] absolute -ml-[50px] md:-ml-[100px] xl:-ml-[150px] -mt-[60px]"
      style={{ left: position.x, top: position.y }}
      alt="torch"
    />
  );
};

export default Torch;
