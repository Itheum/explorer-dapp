import React, { useEffect, useState } from "react";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Loader } from "components";
import { dataNftMarket } from "libs/mvx";
import { useGetNetworkConfig, useGetPendingTransactions } from "hooks";
import { MarketplaceRequirements } from "@itheum/sdk-mx-data-nft";
import { convertWeiToEsdt } from "libs/utils";

export const Dashboard = () => {
  const {
    network: { explorerAddress },
  } = useGetNetworkConfig();
  const { hasPendingTransactions } = useGetPendingTransactions();

  const [scAddress, setScAddress] = useState<string>("");
  const [marketRequirements, setMarketRequirements] =
    useState<MarketplaceRequirements>();
  const [isLoading, setIsLoading] = useState(true);

  async function fetchMarketplaceRequirements() {
    setIsLoading(true);

    const _scAddress = dataNftMarket.getContractAddress().bech32();
    setScAddress(_scAddress);
    const _marketRequirements = await dataNftMarket.viewRequirements();
    console.log("_marketRequirements", _marketRequirements);
    setMarketRequirements(_marketRequirements);

    setIsLoading(false);
  }

  useEffect(() => {
    if (!hasPendingTransactions) {
      fetchMarketplaceRequirements();
    }
  }, [hasPendingTransactions]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="d-flex flex-fill align-items-center justify-content-center container py-4">
      <div className="row w-100">
        <div className="col-12 col-md-10 col-lg-9 mx-auto">
          <div className="card shadow-sm border-0">
            <div
              className="card-body border-0 bg-primary p-1"
              style={{ borderRadius: "5px" }}
            >
              <div
                className="card-body p-4 d-flex flex-column justify-content-center"
                style={{ minHeight: "360px" }}
              >
                <div className="text-white container">
                  <div className="mb-1 row">
                    <span className="col-4 opacity-6">
                      Data-DEX SC Address:
                    </span>
                    <span className="col-8">
                      <a
                        className="text-white text-decoration-none"
                        href={`${explorerAddress}/accounts/${scAddress}`}
                        target="_blank"
                      >
                        {scAddress.slice(0, 24) +
                          " ... " +
                          scAddress.slice(-24)}
                        <FontAwesomeIcon icon={faLink} className="ml-2" />
                      </a>
                    </span>
                  </div>
                  <div className="mb-1 row">
                    <span className="col-4 opacity-6">Accepted Payments:</span>
                    <span className="col-8">
                      {marketRequirements
                        ? marketRequirements.acceptedPayments.toString()
                        : ""}
                    </span>
                  </div>
                  <div className="mb-1 row">
                    <span className="col-4 opacity-6">Accepted Tokens:</span>
                    <span className="col-8">
                      {marketRequirements
                        ? marketRequirements.acceptedTokens.toString()
                        : ""}
                    </span>
                  </div>
                  <div className="mb-1 row">
                    <span className="col-4 opacity-6">Buyer Tax Percent:</span>
                    <span className="col-8">
                      {marketRequirements
                        ? marketRequirements.buyerTaxPercentage / 100 + "%"
                        : ""}
                    </span>
                  </div>
                  <div className="mb-1 row">
                    <span className="col-4 opacity-6">
                      Buyer Tax Percent Discount:
                    </span>
                    <span className="col-8">
                      {marketRequirements
                        ? marketRequirements.buyerTaxPercentageDiscount / 100 +
                          "%"
                        : ""}
                    </span>
                  </div>
                  <div className="mb-1 row">
                    <span className="col-4 opacity-6">
                      Maximum Payment Fees:
                    </span>
                    <span className="col-8">
                      {marketRequirements &&
                      marketRequirements.maximumPaymentFees.length > 0
                        ? marketRequirements.maximumPaymentFees.map(
                            (v, index) =>
                              convertWeiToEsdt(v).toNumber() +
                              " " +
                              marketRequirements.acceptedPayments[
                                index
                              ].toString()
                          )
                        : ""}
                    </span>
                  </div>
                  <div className="mb-1 row">
                    <span className="col-4 opacity-6">Seller Tax Percent:</span>
                    <span className="col-8">
                      {marketRequirements
                        ? marketRequirements.sellerTaxPercentage / 100 + "%"
                        : ""}
                    </span>
                  </div>
                  <div className="mb-1 row">
                    <span className="col-4 opacity-6">
                      Seller Tax Percent Discount:
                    </span>
                    <span className="col-8">
                      {marketRequirements
                        ? marketRequirements.sellerTaxPercentageDiscount / 100 +
                          "%"
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
