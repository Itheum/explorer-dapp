import React, { useEffect, useState } from "react";
import { DataNft, Offer } from "@itheum/sdk-mx-data-nft";
import { Address } from "@multiversx/sdk-core/out";
import { FaExternalLinkAlt } from "react-icons/fa";
import { ElrondAddressLink, Loader } from "components";
import { MARKETPLACE_DETAILS_PAGE } from "config";
import {
  useGetAccount,
  useGetNetworkConfig,
  useGetPendingTransactions,
} from "hooks";
import { dataNftMarket } from "libs/mvx";
import { convertToLocalString, convertWeiToEsdt } from "libs/utils";
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

    const _totalOfferCount = await dataNftMarket.viewAddressTotalOffers(
      new Address(address)
    );
    setOfferCount(_totalOfferCount);

    const _offers = await dataNftMarket.viewAddressListedOffers(
      new Address(address)
    );
    console.log("_offers", _offers);
    setOffers(_offers);

    setIsLoading(false);
  }

  async function fetchDataNfts() {
    setIsNftLoading(true);

    const _dataNfts: DataNft[] = await DataNft.createManyFromApi(
      offers.map((offer) => offer.offeredTokenNonce)
    );
    console.log("_dataNfts", _dataNfts);
    setDataNfts(_dataNfts);

    setIsNftLoading(false);
  }

  useEffect(() => {
    if (!hasPendingTransactions) {
      fetchMyListed();
    }
  }, [hasPendingTransactions]);

  useEffect(() => {
    fetchDataNfts();
  }, [offers]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="d-flex flex-fill justify-content-center container py-4">
      <div className="row w-100">
        <div className="col-12 mx-auto">
          <h4 className="mt-5 text-center">My Listed Offers: {offerCount}</h4>

          <div className="row mt-5">
            {offers.length > 0 ? (
              offers.map((offer, index) => {
                const isDataNftLoaded =
                  !isNftLoading && dataNfts.length > index;
                const nftId = createNftId(offer.offeredTokenIdentifier, offer.offeredTokenNonce);

                return (
                  <div
                    className="col-12 col-md-6 col-lg-4 mb-3 d-flex justify-content-center"
                    key={`o-c-${index}`}
                  >
                    <div className="card shadow-sm border">
                      <div className="card-body p-3">
                        <div className="mb-4">
                          <img
                            src={
                              isDataNftLoaded
                                ? dataNfts[index].nftImgUrl
                                : "https://media.elrond.com/nfts/thumbnail/default.png"
                            }
                            className="data-nft-image"
                          />
                        </div>

                        <div className="mb-1">
                          <h5 className="text-center text-info">Offer Info</h5>
                        </div>
                        <div className="mb-1 row">
                          <span className="col-4 opacity-6">Offering:</span>
                          <span className="col-8">
                            <span>
                              {nftId}
                            </span>
                            <a
                              href={`${MARKETPLACE_DETAILS_PAGE}${nftId}`}
                              className="ml-2 address-link text-decoration-none"
                              target="_blank"
                            >
                              <FaExternalLinkAlt />
                            </a>
                          </span>
                        </div>
                        <div className="mb-1 row">
                          <span className="col-4 opacity-6">Amount:</span>
                          <span className="col-8">{offer.quantity}</span>
                        </div>
                        <div className="mb-1 row">
                          <span className="col-4 opacity-6">Wanting:</span>
                          <span className="col-8">
                            {convertWeiToEsdt(
                              offer.wantedTokenAmount
                            ).toNumber()}{" "}
                            {offer.wantedTokenIdentifier.split("-")[0]}
                          </span>
                        </div>

                        <div className="mt-4 mb-1">
                          <h5 className="text-center text-info">
                            Data NFT Info
                          </h5>
                        </div>
                        <div className="mb-1 row">
                          <span className="col-4 opacity-6">Title:</span>
                          <span className="col-8">
                            {isDataNftLoaded && dataNfts[index].title}
                          </span>
                        </div>
                        <div className="mb-1 row">
                          <span className="col-4 opacity-6">Description:</span>
                          <span className="col-8">
                            {isDataNftLoaded &&
                              (dataNfts[index].description.length > 20
                                ? dataNfts[index].description.slice(0, 20) +
                                  " ..."
                                : dataNfts[index].description)}
                          </span>
                        </div>
                        <div className="mb-1 row">
                          <span className="col-4 opacity-6">Creator:</span>
                          <span className="col-8 cs-creator-link">
                            {isDataNftLoaded && (
                              <ElrondAddressLink
                                explorerAddress={explorerAddress}
                                address={dataNfts[index].creator}
                                precision={6}
                              />
                            )}
                          </span>
                        </div>
                        <div className="mb-1 row">
                          <span className="col-4 opacity-6">Created At:</span>
                          <span className="col-8">
                            {isDataNftLoaded &&
                              dataNfts[index].creationTime.toLocaleString()}
                          </span>
                        </div>
                        <div className="mb-1 row">
                          <span className="col-4 opacity-6">Supply:</span>
                          <span className="col-8">
                            {isDataNftLoaded && dataNfts[index].supply}
                          </span>
                        </div>
                        <div className="mb-1 row">
                          <span className="col-4 opacity-6">Royalties:</span>
                          <span className="col-8">
                            {isDataNftLoaded && `${convertToLocalString(dataNfts[index].royalties * 100, 2)}%`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <h3 className="text-center text-white">
                You have not listed any offer
              </h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
