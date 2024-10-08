import React from "react";
import { MARKETPLACE_DETAILS_PAGE } from "config";
import { CardBody, CardContainer, CardItem } from "libComponents/animated/CardEffect3D";

interface ThreeDCardProps {
  chainID: string;
  tokenIdentifier: string;
  title: string;
  nftImgUrl: string;
  supply?: number;
  rating?: number;
  wantedTokenAmount?: number;
  offerIndex?: number;
}

export function ThreeDCard(props: ThreeDCardProps) {
  const { tokenIdentifier, title, nftImgUrl, supply, rating, wantedTokenAmount, offerIndex } = props;

  return (
    <CardContainer className="inter-var h-84 w-64 mx-2" containerClassName="py-8">
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
        <CardItem translateZ="100" className=" w-full flex flex-row items-center justify-center mt-4">
          <a href={`${MARKETPLACE_DETAILS_PAGE}${tokenIdentifier}${offerIndex ? "/offer-" + offerIndex : ""}`} target="_blank" className="cursor-pointer">
            {nftImgUrl.includes(".mp4") ? (
              <div className="flex relative h-48 w-48 rounded-3xl overflow-hidden justify-center items-center">
                <video autoPlay loop muted webkit-playsinline={"true"} playsInline className="scale-[1.8]  ">
                  <source src={nftImgUrl} type="video/mp4" />
                </video>
              </div>
            ) : (
              <img src={nftImgUrl} className="h-48 w-48 object-cover rounded-3xl group-hover/card:shadow-xl" alt="thumbnail" />
            )}
          </a>
        </CardItem>
        <CardItem translateZ="50" className=" max-w-48 elipsis truncate mt-4 text-md font-bold text-neutral-600 dark:text-white">
          {title}
        </CardItem>
        {supply && (
          <CardItem as="p" translateZ="60" className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300">
            {`Supply Available: ${supply}`}
          </CardItem>
        )}
        {wantedTokenAmount && (
          <CardItem as="p" translateZ="60" className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300 text-[12px]">
            {` Unlock for ${wantedTokenAmount === 0 ? "Free" : `${wantedTokenAmount} ITHEUM/NFT`}`}
          </CardItem>
        )}
        {rating && (
          <CardItem as="p" translateZ="60" className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300">
            Trending score: {rating.toFixed(2)}
          </CardItem>
        )}
      </CardBody>
    </CardContainer>
  );
}
