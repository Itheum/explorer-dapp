import React from "react";
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
  const { chainID, tokenIdentifier, title, nftImgUrl, supply, rating, wantedTokenAmount, offerIndex } = props;
  return (
    <CardContainer className="inter-var h-84 w-64" containerClassName="py-8">
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
        <CardItem translateZ="100" className=" w-full flex flex-row items-center justify-center mt-4">
          <a
            href={`https://${chainID === "D" ? "test." : ""}datadex.itheum.io/datanfts/marketplace/${tokenIdentifier}${offerIndex ? "/offer-" + offerIndex : ""}`}
            target="_blank"
            className="cursor-pointer">
            <img src={nftImgUrl} className="h-48 w-48 object-cover rounded-3xl group-hover/card:shadow-xl" alt="thumbnail" />
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
          <CardItem as="p" translateZ="60" className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300">
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
