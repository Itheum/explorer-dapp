import React from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft/out";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks/useGetNetworkConfig";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MARKETPLACE_DETAILS_PAGE } from "config";
import { convertToLocalString } from "libs/utils";
import { ElrondAddressLink } from "./ElrondAddressLink";
import { Button } from "../libComponents/Button";

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
  showBalance?: boolean;
}) {
  const {
    network: { explorerAddress },
  } = useGetNetworkConfig();
  function goToMarketplace(tokenIdentifier: string) {
    window.open(`${MARKETPLACE_DETAILS_PAGE}${tokenIdentifier}`)?.focus();
  }

  return (
    <div className="mb-3 ">
      <div className="border-[0.5px] dark:border-slate-100/30 border-slate-300 rounded-[2.37rem] xl:w-[330px] w-[296px]">
        <div className="flex flex-col p-3">
          <div className="mb-4">
            <img className="" src={!isLoading ? dataNft.nftImgUrl : "https://media.elrond.com/nfts/thumbnail/default.png"} />
          </div>

          <div className="h-[260px]">
            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6">Title:</span>
              <span className="col-span-8 text-center">{dataNft.title}</span>
            </div>
            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6">Description:</span>
              <span className="col-span-8 text-center">
                {dataNft.description.length > 20 ? dataNft.description.slice(0, 25) + " ..." : dataNft.description}
              </span>
            </div>
            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6">Creator:</span>
              <span className="col-span-8 text-center">{<ElrondAddressLink explorerAddress={explorerAddress} address={dataNft.creator} precision={6} />}</span>
            </div>
            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6">Created At:</span>
              <span className="col-span-8 text-center">{dataNft.creationTime.toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6">Identifier:</span>
              <span className="col-span-8">
                <div className="w-full items-center justify-center">
                  <a href={`${MARKETPLACE_DETAILS_PAGE}${dataNft.tokenIdentifier}`} className="flex flex-row items-center text-decoration-none" target="_blank">
                    <p className="flex flex-row items-center ">{dataNft.tokenIdentifier}</p>
                  </a>
                </div>
              </span>
            </div>
            {showBalance && (
              <div className="grid grid-cols-12 mb-1">
                <span className="col-span-4 opacity-6">Balance:</span>
                <span className="col-span-8 text-center">{dataNft.balance}</span>
              </div>
            )}
            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6">Total Supply:</span>
              <span className="col-span-8 text-center">{dataNft.supply}</span>
            </div>
            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6">Royalties:</span>
              <span className="col-span-8 text-center">{convertToLocalString(dataNft.royalties * 100, 2) + "%"}</span>
            </div>
          </div>

          <div className="">
            {!isWallet && (
              <div className="mt-3 text-center">
                <h6 className="font-weight-bold" style={{ visibility: owned ? "visible" : "hidden" }}>
                  You have this Data NFT
                </h6>
              </div>
            )}

            <div className="flex w-full justify-center mt-3 text-center">
              {owned ? (
                <div className="bg-gradient-to-r from-yellow-300 to-orange-500 p-[1px] rounded-md justify-center">
                  <Button
                    className="dark:bg-[#0f0f0f] border-0 rounded-lg font-medium tracking-wide !text-lg"
                    variant="outline"
                    onClick={() => viewData(index)}>
                    View Data
                  </Button>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-yellow-300 to-orange-500 px-[1px] py-[1px] rounded-md justify-center">
                  <Button
                    className="dark:bg-[#0f0f0f] border-0 rounded-lg font-medium tracking-wide !text-lg"
                    variant="outline"
                    onClick={() => goToMarketplace(dataNft.tokenIdentifier)}>
                    View in Marketplace
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
