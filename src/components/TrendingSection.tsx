import { DataNft } from "@itheum/sdk-mx-data-nft/out";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { getHealthCheckFromBackendApi, getTrendingFromBackendApi } from "libs/backend-api";
import { TrendingNft } from "libs/types";
import React, { useEffect, useState } from "react";
import { ThreeDCard } from "./TreeDCard";
import { convertWeiToEsdt } from "libs/utils";
import toast from "react-hot-toast";

interface NftItem {
  title: string;
  supply: number;
  price: number;
}
type TrendingDataCreationNftsType = {
  nonce: number;
  tokenIdentifier: string;
};

type TrendingDataNftsType = {
  rating: number;
} & DataNft;

const TrendingSection: React.FC = () => {
  const { chainID } = useGetNetworkConfig();
  const [trendingDataNfts, setTrendingDataNfts] = useState<TrendingDataNftsType[]>([]);
  const [isApiUp, setIsApiUp] = useState(false);

  useEffect(() => {
    async function fetchApiHealthCheck() {
      try {
        const healthCheck = await getHealthCheckFromBackendApi(chainID);
        if (healthCheck) {
          setIsApiUp(true);
        }
      } catch (error) {
        setIsApiUp(false);
        toast.error("Backend API is down. Recent Data NFTs will not be available");
      }
    }
    fetchApiHealthCheck();
  }, []);

  useEffect(() => {
    if (isApiUp) fetchTrendingNfts();
  }, [isApiUp]);

  async function fetchTrendingNfts() {
    DataNft.setNetworkConfig(chainID === "1" ? "mainnet" : "devnet");
    const getTrendingData = await getTrendingFromBackendApi(chainID);
    const _trendingData: Array<TrendingDataCreationNftsType> = [];
    getTrendingData.forEach((parseTrendingData) => {
      const splitedString = parseTrendingData.tokenIdentifier.split("-");
      const nonce = parseInt(splitedString[2], 16);
      const tokenIdentifier = splitedString[0] + "-" + splitedString[1];
      _trendingData.push({ nonce: nonce, tokenIdentifier: tokenIdentifier });
    });
    const dataNfts: DataNft[] = await DataNft.createManyFromApi(_trendingData);
    const trending = getTrendingData.map((dataNft) => {
      const ratingNfts = dataNfts.find((nft) => nft.tokenIdentifier === dataNft.tokenIdentifier);
      if (ratingNfts) {
        return { ...ratingNfts, rating: dataNft.rating };
      }
    });
    setTrendingDataNfts(trending as TrendingDataNftsType[]);
  }

  return (
    <>
      {isApiUp ? (
        <div>
          <h2 className="mt-12 py-2 mb-0 ">Trending Offers</h2>
          <div className="w-full flex flex-row flex-wrap items-center justify-center md:items-start md:justify-start">
            {trendingDataNfts &&
              trendingDataNfts
                .slice(0, 10)
                .map((nft, index) => (
                  <ThreeDCard
                    key={index}
                    chainID={chainID}
                    tokenIdentifier={nft.tokenIdentifier}
                    title={nft.title || ""}
                    nftImgUrl={nft.nftImgUrl || ""}
                    rating={nft.rating}
                  />
                ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default TrendingSection;
