import { DataNft } from "@itheum/sdk-mx-data-nft/out";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { getHealthCheckFromBackendApi, getTrendingFromBackendApi } from "libs/backend-api";
import React, { useEffect, useState } from "react";
import { ThreeDCard } from "./ThreeDCard";
import toast from "react-hot-toast";
import { Loader } from "./sdkDappComponents";

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
  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(true);
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
    setIsLoading(false);
  }

  return (
    <>
      {isApiUp ? (
        <div>
          <h2 className="mt-12 py-2 mb-0 !text-3xl md:text-center">Trending Offers</h2>
          <div
            className={`w-full flex flex-row flex-wrap items-center justify-center md:items-start md:justify-around ${!isLoading ? "md:after:content-[''] md:after:flex-auto" : ""}`}>
            {isLoading ? (
              <Loader className="h-[20rem]" />
            ) : trendingDataNfts?.length === 0 ? (
              <div className="flex flex-col items-center justify-center w-full h-[20rem]">
                <h3 className="text-lg">No trending offers available...</h3>
              </div>
            ) : (
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
                ))
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default TrendingSection;
