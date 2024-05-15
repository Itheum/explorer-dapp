import React from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft/out";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks/useGetNetworkConfig";
import { MARKETPLACE_DETAILS_PAGE } from "config";
import { cn } from "libs/utils";
import { Modal } from "./Modal/Modal";
import { MXAddressLink } from "./MXAddressLink";
import NftMediaComponent from "./NftMediaComponent";
import { Button } from "../libComponents/Button";
import { Card, CardContent, CardFooter } from "../libComponents/Card";
import { IFilterData } from "../libComponents/Filter";
import { NftMedia } from "libs/types";

export function DataNftCard({
  index,
  dataNft,
  isLoading,
  owned,
  isWallet,
  viewData,
  showBalance = false,
  modalContent,
  modalTitle,
  modalTitleStyle,
  hasFilter,
  filterData,
  cardStyles,
  modalStyles,
}: {
  index: number;
  dataNft: DataNft;
  isLoading: boolean;
  owned: boolean;
  isWallet?: boolean;
  viewData: (e: number) => void;
  showBalance?: boolean;
  modalContent?: React.ReactElement;
  modalTitle?: string;
  modalTitleStyle?: string;
  hasFilter?: boolean;
  filterData?: Array<IFilterData>;
  cardStyles?: string;
  modalStyles?: string;
}) {
  const {
    network: { explorerAddress },
  } = useGetNetworkConfig();

  function goToMarketplace(tokenIdentifier: string) {
    window.open(`${MARKETPLACE_DETAILS_PAGE}${tokenIdentifier}`)?.focus();
  }
  return (
    <div className="mb-3">
      <Card
        className={cn(
          cardStyles,
          "border-[0.5px]  dark:border-slate-100/30 border-slate-300  bg-transparent rounded-[2.37rem] base:w-[18.5rem] md:w-[20.6rem]"
        )}>
        <CardContent className="flex flex-col p-3">
          <NftMediaComponent nftMedia={dataNft.media as NftMedia[]} isLoading={isLoading} mediaStyle="mb-8 base:h-[15rem]  md:h-[18rem]" />

          <div className="md:h-[15rem] h-[13rem]">
            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6 base:text-sm md:text-base">Title:</span>
              <span className="col-span-8 text-left base:text-sm md:text-base">{dataNft.title}</span>
            </div>
            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6 base:text-sm md:text-base">Description:</span>
              <span className="col-span-8 text-left base:text-sm md:text-base">
                {dataNft.description.length > 20 ? dataNft.description.slice(0, 22) + " ..." : dataNft.description}
              </span>
            </div>
            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6 base:text-sm md:text-base">Creator:</span>
              <span className="col-span-8 text-left base:text-sm md:text-base">
                {<MXAddressLink explorerAddress={explorerAddress} address={dataNft.creator} precision={6} />}
              </span>
            </div>
            {dataNft.creationTime && (
              <div className="grid grid-cols-12 mb-1">
                <span className="col-span-4 opacity-6 base:text-sm md:text-base">Created At:</span>
                <span className="col-span-8 text-left base:text-sm md:text-base">{dataNft.creationTime.toLocaleString()}</span>
              </div>
            )}

            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6 base:text-sm md:text-base">Identifier:</span>
              <div className="col-span-8 w-full items-center justify-center">
                <a
                  href={`${MARKETPLACE_DETAILS_PAGE}${dataNft.tokenIdentifier}`}
                  className="flex flex-row items-center text-decoration-none !text-blue-500"
                  target="_blank">
                  <p className="flex flex-row w-full items-center mb-0 base:text-sm md:text-base">{dataNft.tokenIdentifier}</p>
                </a>
              </div>
            </div>
            {showBalance && (
              <div className="grid grid-cols-12 mb-1">
                <span className="col-span-4 opacity-6 base:text-sm md:text-base">Balance:</span>
                <span className="col-span-8 text-left base:text-sm md:text-base">{dataNft.balance !== 0 ? dataNft.balance.toString() : "1"}</span>
              </div>
            )}
            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6 base:text-sm md:text-base">Total Supply:</span>
              <span className="col-span-8 text-left base:text-sm md:text-base">{dataNft.supply.toString()}</span>
            </div>
            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6 base:text-sm md:text-base">Royalties:</span>
              <span className="col-span-8 text-left base:text-sm md:text-base">
                {isNaN(dataNft.royalties) ? "0%" : (dataNft.royalties * 100).toFixed(2) + "%"}
              </span>
            </div>
          </div>

          <div className="">
            {!isWallet ? (
              <div className="pt-5 pb-3 text-center">
                <h6 className="base:!text-sm md:!text-base" style={{ visibility: owned ? "visible" : "hidden" }}>
                  You have this Data NFT
                </h6>
              </div>
            ) : (
              <div></div>
            )}

            <CardFooter className="flex w-full justify-center py-2 text-center">
              {owned ? (
                <Modal
                  openTrigger={
                    <Button
                      className="bg-gradient-to-r from-yellow-300 to-orange-500 border-0 text-background rounded-lg font-medium tracking-tight base:!text-sm md:!text-base hover:opacity-80 hover:text-black"
                      variant="ghost"
                      onClick={() => viewData(index)}>
                      View Data
                    </Button>
                  }
                  closeOnOverlayClick={false}
                  title={modalTitle ?? ""}
                  hasFilter={hasFilter ?? false}
                  filterData={filterData ?? []}
                  modalClassName={modalStyles}
                  titleClassName={modalTitleStyle}>
                  {modalContent}
                </Modal>
              ) : (
                <div className="text-foreground bg-gradient-to-r from-yellow-300 to-orange-500 p-[1px] rounded-md ">
                  <Button
                    className="dark:bg-[#0f0f0f] border-0 rounded-md font-medium tracking-tight !text-sm hover:opacity-90"
                    variant="outline"
                    onClick={() => goToMarketplace(dataNft.tokenIdentifier)}>
                    View in Marketplace
                  </Button>
                </div>
              )}
            </CardFooter>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
