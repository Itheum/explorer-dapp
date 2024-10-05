import React, { useEffect, useState } from "react";
import { DataNft, Offer } from "@itheum/sdk-mx-data-nft/out";
import { IAddress } from "@multiversx/sdk-core/out";
import { Address } from "@multiversx/sdk-core/out";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import BigNumber from "bignumber.js";
import toast from "react-hot-toast";
import { IS_DEVNET } from "appsConfig";
import { PulseLoader } from "libComponents/animated/PulseLoader";
import { convertWeiToEsdt } from "libs/utils";
import { ThreeDCard } from "./ThreeDCard";
import { getHealthCheckFromBackendApi, getRecentOffersFromBackendApi } from "../libs/backend-api";

export interface RecentDataNFTType {
  index: BigNumber.Value;
  owner: IAddress;
  tokenIdentifier: string;
  creator: IAddress;
  offeredTokenIdentifier: string;
  offeredTokenNonce: BigNumber.Value;
  offeredTokenAmount: BigNumber.Value;
  wantedTokenIdentifier: string;
  wantedTokenNonce: BigNumber.Value;
  wantedTokenAmount: BigNumber.Value;
  quantity: BigNumber.Value;
  tokenName?: string;
  title?: string;
  nftImgUrl?: string;
  royalties?: BigNumber.Value;
}

const RecentDataNFTsSection: React.FC = () => {
  const { chainID } = useGetNetworkConfig();
  const [latestOffers, setLatestOffers] = useState<RecentDataNFTType[]>([]);
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
    if (isApiUp) apiWrapper();
  }, [isApiUp]);

  const apiWrapper = async () => {
    DataNft.setNetworkConfig(IS_DEVNET ? "devnet" : "mainnet");
    setIsLoading(true);

    try {
      const offers = await getRecentOffersFromBackendApi(chainID);
      const recentNonces = offers.map((nft: any) => ({ nonce: nft.offeredTokenNonce }));
      const dataNfts: DataNft[] = await DataNft.createManyFromApi(recentNonces);
      const _latestOffers: RecentDataNFTType[] = [];
      offers.forEach((offer: Offer) => {
        const matchingDataNft = dataNfts.find(
          (dataNft: DataNft) => dataNft.nonce === offer.offeredTokenNonce && dataNft.collection === offer.offeredTokenIdentifier
        );
        if (matchingDataNft) {
          _latestOffers.push({
            tokenIdentifier: matchingDataNft.tokenIdentifier,
            index: offer.index,
            owner: new Address(offer.owner),
            creator: new Address(matchingDataNft?.owner),
            offeredTokenIdentifier: offer.offeredTokenIdentifier,
            offeredTokenNonce: offer.offeredTokenNonce,
            offeredTokenAmount: offer.offeredTokenAmount,
            wantedTokenIdentifier: offer.wantedTokenIdentifier,
            wantedTokenNonce: offer.wantedTokenNonce,
            wantedTokenAmount: offer.wantedTokenAmount,
            quantity: offer.quantity,
            tokenName: matchingDataNft?.tokenName,
            title: matchingDataNft?.title,
            nftImgUrl: matchingDataNft?.nftImgUrl,
            royalties: matchingDataNft?.royalties,
          });
        }
      });
      setLatestOffers(_latestOffers);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <>
      {!isApiUp ? (
        <div>
          <h2 className="mt-12 py-2 mb-0 !text-3xl text-center">Recent Data NFTs</h2>
          <div className={`w-full flex flex-row flex-wrap items-center justify-center`}>
            {isLoading ? (
              <PulseLoader cusStyle="my-10" />
            ) : latestOffers?.length === 0 ? (
              <div className="flex flex-col items-center justify-center w-full h-[20rem]">
                <h3 className="text-lg">No recent offers available...</h3>
              </div>
            ) : (
              latestOffers
                .slice(0, 10)
                .map((nft, index) => (
                  <ThreeDCard
                    key={index}
                    chainID={chainID}
                    tokenIdentifier={nft.tokenIdentifier}
                    title={nft.title || ""}
                    nftImgUrl={nft.nftImgUrl || ""}
                    supply={Number(nft.quantity)}
                    wantedTokenAmount={Number(convertWeiToEsdt(nft.wantedTokenAmount))}
                    offerIndex={Number(nft.index)}
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
export default RecentDataNFTsSection;
