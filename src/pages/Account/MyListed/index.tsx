import React, { useEffect, useState } from "react";
import { DataNft, Offer } from "@itheum/sdk-mx-data-nft";
import { Address } from "@multiversx/sdk-core/out";
import { ExternalLink } from "lucide-react";
import { Loader, MXAddressLink } from "components";
import { HeaderComponent } from "components/Layout/HeaderComponent";
import NftMediaComponent from "components/NftMediaComponent";
import { MARKETPLACE_DETAILS_PAGE } from "config";
import { useGetAccount, useGetNetworkConfig, useGetPendingTransactions } from "hooks";
import { Card, CardContent } from "libComponents/Card";
import { dataNftMarket } from "libs/mvx";
import { NftMedia } from "libs/types";
import { convertToLocalString } from "libs/utils";
import { createNftId } from "libs/utils/token";

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
    setOffers(_offers);
    setIsLoading(false);
  }

  async function fetchDataNfts() {
    setIsNftLoading(true);
    const _dataNfts: DataNft[] = await DataNft.createManyFromApi(
      offers.map((offer) => ({ nonce: offer.offeredTokenNonce, tokenIdentifier: offer.offeredTokenIdentifier }))
    );
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
    <HeaderComponent pageTitle={"My listed data"} hasImage={false} pageSubtitle={"My Listed Offers"} dataNftCount={offerCount}>
      {offers.length > 0 ? (
        offers.map((offer, index) => {
          const isDataNftLoaded = !isNftLoading;
          const nftId = createNftId(offer.offeredTokenIdentifier, offer.offeredTokenNonce);
          const dataNft = dataNfts.find((nft) => nft.tokenIdentifier == nftId);
          if (dataNft) {
            return (
              <div className="mb-3" key={`o-c-${index}`}>
                <Card className="border-[0.5px] dark:border-slate-100/30 border-slate-300 bg-transparent rounded-[2.37rem] xl:w-[330px] w-[296px] pb-5">
                  <CardContent className="flex flex-col p-6 ">
                    <div className="mb-4">
                      <NftMediaComponent nftMedia={dataNft.media as NftMedia[]} isLoading={isLoading} mediaStyle="mb-2 base:h-[15rem] md:h-[18rem]" />
                    </div>
                    <div className="xl:h-[300px] h-[315px]">
                      <div className="mb-1">
                        <h5 className="text-start !text-xl !font-[Clash-Medium] pb-2">Offer Detail</h5>
                      </div>
                      <div className="grid grid-cols-12 mb-1">
                        <span className="col-span-4 opacity-6">Identifier:</span>
                        <span className="col-span-8 text-left">
                          <div className="flex flex-row items-center gap-1">
                            <span className="xl:text-base text-sm">{nftId}</span>
                            <a
                              href={`${MARKETPLACE_DETAILS_PAGE}${nftId}`}
                              className="!text-blue-500 text-decoration-none hover:!text-blue-500/80"
                              target="_blank">
                              <ExternalLink strokeWidth={2.5} size={16} />
                            </a>
                          </div>
                        </span>
                      </div>
                      <div className="grid grid-cols-12 mb-1">
                        <span className="col-span-4 opacity-6">Listed:</span>
                        <span className="col-span-8 text-left">{offer.quantity}</span>
                      </div>

                      <div className="mt-4 mb-1 text-start">
                        <h5 className="text-start !text-xl !font-[Clash-Medium] pb-2">Data NFT Detail</h5>
                      </div>
                      <div className="grid grid-cols-12 mb-1">
                        <span className="col-span-4 opacity-6">Title:</span>
                        <span className="col-span-8 text-left">{isDataNftLoaded && dataNft.title}</span>
                      </div>
                      {dataNft.description && dataNft.description.trim() !== "" && (
                        <div className="grid grid-cols-12 mb-1">
                          <span className="col-span-4 opacity-6">Description:</span>
                          <span className="col-span-8 text-left">
                            {isDataNftLoaded && (dataNft.description.length > 20 ? dataNft.description.slice(0, 20) + " ..." : dataNft.description)}
                          </span>
                        </div>
                      )}
                      <div className="grid grid-cols-12 mb-1">
                        <span className="col-span-4 opacity-6">Creator:</span>
                        <span className="col-span-8 text-left">
                          {isDataNftLoaded && <MXAddressLink explorerAddress={explorerAddress} address={dataNft.creator} precision={6} />}
                        </span>
                      </div>
                      <div className="grid grid-cols-12 mb-1">
                        <span className="col-span-4 opacity-6">Created At:</span>
                        <span className="col-span-8 text-left">{isDataNftLoaded && dataNft.creationTime.toLocaleString()}</span>
                      </div>
                      <div className="grid grid-cols-12 mb-1">
                        <span className="col-span-4 opacity-6">Total Supply:</span>
                        <span className="col-span-8 text-left">{isDataNftLoaded && dataNft.supply.toString()}</span>
                      </div>
                      <div className="grid grid-cols-12 mb-1">
                        <span className="col-span-4 opacity-6">Royalties:</span>
                        <span className="col-span-8 text-left">{isDataNftLoaded && `${convertToLocalString(dataNft.royalties * 100, 2)}%`}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          }
        })
      ) : (
        <h4 className="no-items">You do not have any listed Data NFTs offers.</h4>
      )}
    </HeaderComponent>
  );
};
