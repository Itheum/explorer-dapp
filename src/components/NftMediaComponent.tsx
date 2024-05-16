import { NftMedia } from "libs/types";
import { cn } from "libs/utils";
import React from "react";
import ImageSlider from "./ImageSlider";

interface NftMediaComponentProps {
  nftMedia: NftMedia[];
  isLoading?: boolean;
  mediaStyle?: string;
}

const NftMediaComponent: React.FC<NftMediaComponentProps> = (props) => {
  const { nftMedia, isLoading, mediaStyle } = props;
  return (
    <div>
      {nftMedia.length === 0 && <img src="https://media.elrond.com/nfts/thumbnail/default.png" />}
      {nftMedia.length === 1 ? (
        <div className={cn("flex justify-center rounded-3xl overflow-hidden", mediaStyle)}>
          {nftMedia[0].fileType === "video/mp4" ? (
            <video autoPlay loop src={nftMedia[0]?.url} className="scale-[1.8]" />
          ) : (
            <img className="rounded-3xl" src={!isLoading ? nftMedia[0]?.url : "https://media.elrond.com/nfts/thumbnail/default.png"} />
          )}
        </div>
      ) : (
        <div className=" flex">
          <ImageSlider
            autoSlide={true}
            media={nftMedia.map((item) => ({
              url: item.url,
              type: item.fileType,
            }))}
          />
        </div>
      )}
    </div>
  );
};

export default NftMediaComponent;
