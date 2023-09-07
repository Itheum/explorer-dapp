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
import { HeaderComponent } from "../components/Layout/HeaderComponent";

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
    const nonces: number[] = offers.map((offer) => offer.offeredTokenNonce);
    const _dataNfts: DataNft[] = await DataNft.createManyFromApi(nonces);
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
                <Card className="border-[0.5px] dark:border-slate-100/30 border-slate-300 bg-transparent rounded-[2.37rem] xl:w-[330px] w-[296px]">
                  <CardContent className="flex flex-col p-3">
                    <div className="mb-4">
                      <img src={isDataNftLoaded ? dataNft.nftImgUrl : "https://media.elrond.com/nfts/thumbnail/default.png"} alt="dataNftImage" />
                    </div>
                    <div className="xl:h-[300px] h-[315px]">
                      <div className="mb-1">
                        <h5 className="text-center !text-xl !font-[Clash-Medium] pb-2">Offer Detail</h5>
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
                              <FaExternalLinkAlt />
                            </a>
                          </div>
                        </span>
                      </div>
                      <div className="grid grid-cols-12 mb-1">
                        <span className="col-span-4 opacity-6">Listed:</span>
                        <span className="col-span-8 text-left">{offer.quantity}</span>
                      </div>
                      {/* <div className="mb-1 row">
                const dataNft = dataNfts.find((nft) => nft.tokenIdentifier == nftId);

                if (dataNft) {
                  return (
                    <div className="col-12 col-md-6 col-lg-4 mb-3 d-flex justify-content-center c-nft-tile" key={`o-c-${index}`}>
                      <div className="card shadow-sm border">
                        <div className="card-body p-3">
                          <div className="mb-4">
                            <img src={isDataNftLoaded ? dataNft.nftImgUrl : "https://media.elrond.com/nfts/thumbnail/default.png"} className="data-nft-image" />
                          </div>

                          <div className="mb-1">
                            <h5 className="text-center text-info">Offer Detail</h5>
                          </div>
                          <div className="mb-1 row">
                            <span className="col-4 opacity-6">Identifier:</span>
                            <span className="col-8 c-identifier-link">
                              <span>{nftId}</span>
                              <a href={`${MARKETPLACE_DETAILS_PAGE}${nftId}`} className="ml-2 address-link text-decoration-none" target="_blank">
                                <FaExternalLinkAlt />
                              </a>
                            </span>
                          </div>
                          <div className="mb-1 row">
                            <span className="col-4 opacity-6">Listed:</span>
                            <span className="col-8">{offer.quantity}</span>
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
                        <span className="col-span-8 text-left">{isDataNftLoaded && dataNft.title}</span>
                      </div>
                      <div className="grid grid-cols-12 mb-1">
                        <span className="col-span-4 opacity-6">Description:</span>
                        <span className="col-span-8 text-left">
                          {isDataNftLoaded && (dataNft.description.length > 20 ? dataNft.description.slice(0, 20) + " ..." : dataNft.description)}
                        </span>
                      </div>
                      <div className="grid grid-cols-12 mb-1">
                        <span className="col-span-4 opacity-6">Creator:</span>
                        <span className="col-span-8 text-left">
                          {isDataNftLoaded && <ElrondAddressLink explorerAddress={explorerAddress} address={dataNft.creator} precision={6} />}
                        </span>
                      </div>
                      <div className="grid grid-cols-12 mb-1">
                        <span className="col-span-4 opacity-6">Created At:</span>
                        <span className="col-span-8 text-left">{isDataNftLoaded && dataNft.creationTime.toLocaleString()}</span>
                      </div>
                      <div className="grid grid-cols-12 mb-1">
                        <span className="col-span-4 opacity-6">Total Supply:</span>
                        <span className="col-span-8 text-left">{isDataNftLoaded && dataNft.supply}</span>
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
