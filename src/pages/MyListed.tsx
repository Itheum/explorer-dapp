import React, { useEffect, useState } from "react";
import { DataNft, Offer } from "@itheum/sdk-mx-data-nft";
import { Address } from "@multiversx/sdk-core/out";
import { FaExternalLinkAlt } from "react-icons/fa";
import { ElrondAddressLink, Loader } from "components";
import { MARKETPLACE_DETAILS_PAGE } from "config";
import { useGetAccount, useGetNetworkConfig, useGetPendingTransactions } from "hooks";
import { dataNftMarket } from "libs/mvx";
import { convertToLocalString } from "libs/utils";
import { createNftId } from "libs/utils/token";
import { Card, CardContent } from "../libComponents/Card";

export const MyListed = () => {
  const {
    network: { explorerAddress },
  } = useGetNetworkConfig();
  const { address } = useGetAccount();
  const { hasPendingTransactions } = useGetPendingTransactions();

  const [offerCount, setOfferCount] = useState<number>(0);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [dataNfts, setDataNfts] = useState<DataNft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNftLoading, setIsNftLoading] = useState(true);

  async function fetchMyListed() {
    setIsLoading(true);

    const _totalOfferCount = await dataNftMarket.viewAddressTotalOffers(new Address(address));
    setOfferCount(_totalOfferCount);

    const _offers = await dataNftMarket.viewAddressListedOffers(new Address(address));
    console.log("_offers", _offers);
    setOffers(_offers);

    setIsLoading(false);
  }

  async function fetchDataNfts() {
    setIsNftLoading(true);

    const _dataNfts: DataNft[] = await DataNft.createManyFromApi(offers.map((offer) => offer.offeredTokenNonce));
    console.log("_dataNfts", _dataNfts);
    setDataNfts(_dataNfts);

    setIsNftLoading(false);
  }

  useEffect(() => {
    if (!address || hasPendingTransactions) return;

    fetchMyListed();
  }, [address, hasPendingTransactions]);

  useEffect(() => {
    if (!offers.length) {
      return;
    }
    fetchDataNfts();
  }, [offers]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex justify-center py-4">
        <div className="flex flex-col w-full">
          <h1 className="py-4 mb-0">My listed data</h1>
          {offerCount > 0 && <h4 className="my-4 text-center text-2xl">My Listed Offers: {offerCount}</h4>}

          <div className="flex flex-wrap justify-center md:justify-normal gap-5 ">
            {offers.length > 0 ? (
              offers.map((offer, index) => {
                const isDataNftLoaded = !isNftLoading && dataNfts.length > index;
                const nftId = createNftId(offer.offeredTokenIdentifier, offer.offeredTokenNonce);

                return (
                  <div className="mb-3" key={`o-c-${index}`}>
                    <Card className="border-[0.5px] dark:border-slate-100/30 border-slate-300 bg-transparent rounded-[2.37rem] xl:w-[330px] w-[296px]">
                      <CardContent className="flex flex-col p-3">
                        <div className="mb-4">
                          <img
                            src={isDataNftLoaded ? dataNfts[index].nftImgUrl : "https://media.elrond.com/nfts/thumbnail/default.png"}
                            alt="dataNftImage"
                          />
                        </div>
                        <div className="xl:h-[300px] h-[315px]">
                        <div className="mb-1">
                          <h5 className="text-center !text-xl !font-[Clash-Medium] pb-2">Offer Detail</h5>
                        </div>
                        <div className="grid grid-cols-12 mb-1">
                          <span className="col-span-4 opacity-6">Identifier:</span>
                          <span className="col-span-8 text-center">
                            <div className="flex flex-row items-center gap-1">
                            <span className="xl:text-base text-sm">{nftId}</span>
                            <a href={`${MARKETPLACE_DETAILS_PAGE}${nftId}`} className="!text-blue-500 text-decoration-none hover:!text-blue-500/80" target="_blank">
                              <FaExternalLinkAlt />
                            </a></div>
                          </span>
                        </div>
                        <div className="grid grid-cols-12 mb-1">
                          <span className="col-span-4 opacity-6">Listed:</span>
                          <span className="col-span-8 text-center">{offer.quantity}</span>
                        </div>
                        {/* <div className="mb-1 row">
                          <span className="col-4 opacity-6">Wanting:</span>
                          <span className="col-8">
                            {convertWeiToEsdt(
                              offer.wantedTokenAmount
                            ).toNumber()}{" "}
                            {offer.wantedTokenIdentifier.split("-")[0]}
                          </span>
                        </div> */}

                        <div className="mt-4 mb-1">
                          <h5 className="text-center !text-xl !font-[Clash-Medium] pb-2">Data NFT Detail</h5>
                        </div>
                        <div className="grid grid-cols-12 mb-1">
                          <span className="col-span-4 opacity-6">Title:</span>
                          <span className="col-span-8 text-center">{isDataNftLoaded && dataNfts[index].title}</span>
                        </div>
                        <div className="grid grid-cols-12 mb-1">
                          <span className="col-span-4 opacity-6">Description:</span>
                          <span className="col-span-8 text-center">
                            {isDataNftLoaded &&
                              (dataNfts[index].description.length > 20 ? dataNfts[index].description.slice(0, 20) + " ..." : dataNfts[index].description)}
                          </span>
                        </div>
                        <div className="grid grid-cols-12 mb-1">
                          <span className="col-span-4 opacity-6">Creator:</span>
                          <span className="col-span-8 text-center">
                            {isDataNftLoaded && <ElrondAddressLink explorerAddress={explorerAddress} address={dataNfts[index].creator} precision={6} />}
                          </span>
                        </div>
                        <div className="grid grid-cols-12 mb-1">
                          <span className="col-span-4 opacity-6">Created At:</span>
                          <span className="col-span-8 text-center">{isDataNftLoaded && dataNfts[index].creationTime.toLocaleString()}</span>
                        </div>
                        <div className="grid grid-cols-12 mb-1">
                          <span className="col-span-4 opacity-6">Total Supply:</span>
                          <span className="col-span-8 text-center">{isDataNftLoaded && dataNfts[index].supply}</span>
                        </div>
                        <div className="grid grid-cols-12 mb-1">
                          <span className="col-span-4 opacity-6">Royalties:</span>
                          <span className="col-span-8 text-center">{isDataNftLoaded && `${convertToLocalString(dataNfts[index].royalties * 100, 2)}%`}</span>
                        </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })
            ) : (
              <h4 className="no-items">You do not have any listed Data NFTs offers.</h4>
            )}
          </div>
        </div>
    </div>
  );
};
