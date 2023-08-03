import React from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft/out";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks/useGetNetworkConfig";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MARKETPLACE_DETAILS_PAGE } from "config";
import { convertToLocalString } from "libs/utils";
import { ElrondAddressLink } from "./ElrondAddressLink";

export function DataNftCard({
  index,
  dataNft,
  isLoading,
  owned,
  isWallet,
  viewData,
  showBalance = false,
}: {
  index: number;
  dataNft: DataNft;
  isLoading: boolean;
  owned: boolean;
  isWallet?: boolean;
  viewData: (e: number) => void;
  showBalance?: boolean,
}) {
  const {
    network: { explorerAddress },
  } = useGetNetworkConfig();

  function goToMarketplace(tokenIdentifier: string) {
    window.open(`${MARKETPLACE_DETAILS_PAGE}${tokenIdentifier}`)?.focus();
  }

  return (
    <div className="col-12 col-md-6 col-lg-4 mb-3 d-flex justify-content-center c-nft-tile">
      <div className="card shadow-sm border">
        <div className="card-body p-3">
          <div className="mb-4">
            <img
              className="data-nft-image"
              src={
                !isLoading
                  ? dataNft.nftImgUrl
                  : "https://media.elrond.com/nfts/thumbnail/default.png"
              }
            />
          </div>

          <div className="mb-1 row">
            <span className="col-4 opacity-6">Title:</span>
            <span className="col-8">{dataNft.title}</span>
          </div>
          <div className="mb-1 row">
            <span className="col-4 opacity-6">Description:</span>
            <span className="col-8">
              {dataNft.description.length > 20
                ? dataNft.description.slice(0, 20) + " ..."
                : dataNft.description}
            </span>
          </div>
          <div className="mb-1 row">
            <span className="col-4 opacity-6">Creator:</span>
            <span className="col-8 cs-creator-link">
              {
                <ElrondAddressLink
                  explorerAddress={explorerAddress}
                  address={dataNft.creator}
                  precision={6}
                />
              }
            </span>
          </div>
          <div className="mb-1 row">
            <span className="col-4 opacity-6">Created At:</span>
            <span className="col-8">
              {dataNft.creationTime.toLocaleString()}
            </span>
          </div>

          <div className="mb-1 row">
            <span className="col-4 opacity-6">Identifier:</span>
            <span className="col-8 c-identifier-link">
              <span>{dataNft.tokenIdentifier}</span>
              <a
                href={`${MARKETPLACE_DETAILS_PAGE}${dataNft.tokenIdentifier}`}
                className="ml-2 address-link text-decoration-none"
                target="_blank"
              >
                <FaExternalLinkAlt />
              </a>
            </span>
          </div>
          {
            showBalance && (
              <div className="mb-1 row">
                <span className="col-4 opacity-6">Balance:</span>
                <span className="col-8">{dataNft.balance}</span>
              </div>
            )
          }
          <div className="mb-1 row">
            <span className="col-4 opacity-6">Total Supply:</span>
            <span className="col-8">{dataNft.supply}</span>
          </div>
          <div className="mb-1 row">
            <span className="col-4 opacity-6">Royalties:</span>
            <span className="col-8">
              {convertToLocalString(dataNft.royalties * 100, 2) + "%"}
            </span>
          </div>

          <div className="c-actions">
            {!isWallet && (
              <div className="mt-3 text-center">
                <h6
                  className="font-title font-weight-bold"
                  style={{ visibility: owned ? "visible" : "hidden" }}
                >
                  You have this Data NFT
                </h6>
              </div>
            )}

            <div className="mt-3 text-center">
              {owned ? (
                <button
                  className="btn btn-primary"
                  onClick={() => viewData(index)}
                >
                  View Data
                </button>
              ) : (
                <button
                  className="btn btn-outline-primary"
                  onClick={() => goToMarketplace(dataNft.tokenIdentifier)}
                >
                  View in the Data NFT Marketplace
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
