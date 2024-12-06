import React from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft/out";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks/useGetNetworkConfig";
import { Link } from "react-router-dom";
import { MARKETPLACE_DETAILS_PAGE } from "config";
import { useGetIsLoggedIn } from "hooks";
import { NftMedia } from "libs/types";
import { cn } from "libs/utils";
import { routeNames } from "routes";
import { Modal } from "./Modal/Modal";
import { MXAddressLink } from "./MXAddressLink";
import NftMediaComponent from "./NftMediaComponent";
import { Button } from "../libComponents/Button";
import { Card, CardContent, CardFooter } from "../libComponents/Card";
import { IFilterData } from "../libComponents/Filter";

export function MvxDataNftCard({
  index,
  dataNft,
  isLoading,
  owned,
  isWallet,
  viewData,
  isDataWidget = false,
  showBalance = false,
  modalContent,
  modalTitle,
  modalTitleStyle,
  hasFilter,
  filterData,
  cardStyles,
  modalStyles,
  openActionBtnText,
  openActionFireLogic,
  hideIsInWalletSection,
}: {
  index: number;
  dataNft: DataNft;
  isLoading: boolean;
  owned: boolean;
  isWallet?: boolean;
  viewData: (e: number) => void;
  isDataWidget?: boolean;
  showBalance?: boolean;
  modalContent?: React.ReactElement;
  modalTitle?: string;
  modalTitleStyle?: string;
  hasFilter?: boolean;
  filterData?: Array<IFilterData>;
  cardStyles?: string;
  modalStyles?: string;
  openActionBtnText?: string;
  openActionFireLogic?: any;
  hideIsInWalletSection?: boolean;
}) {
  const isLoggedIn = useGetIsLoggedIn();

  const {
    network: { explorerAddress },
  } = useGetNetworkConfig();

  function goToMarketplace(tokenIdentifier: string) {
    window.open(`${MARKETPLACE_DETAILS_PAGE}${tokenIdentifier}`)?.focus();
  }

  return (
    <div className="mb-3">
      <Card
        className={cn(cardStyles, "border-[0.5px] dark:border-slate-100/30 border-slate-300  bg-transparent rounded-[2.37rem] base:w-[18rem] md:w-[19rem]")}>
        <CardContent className="flex flex-col p-3">
          <NftMediaComponent nftMedia={dataNft.media as NftMedia[]} isLoading={isLoading} mediaStyle="mb-8 base:h-[12rem] md:h-[15rem]" />

          <div>
            <div className="grid grid-cols-12 mb-2 mt-2">
              <span className="col-span-12 text-left text-md font-weight-bold">{dataNft.title}</span>
            </div>

            {dataNft.description && dataNft.description.trim() !== "" && (
              <div className="grid grid-cols-12 mb-1">
                <span className="col-span-12 text-left text-sm">
                  {dataNft.description.length > 36 ? dataNft.description.slice(0, 38) + " ..." : dataNft.description}
                  <div className="tooltip hidden md:block">
                    {dataNft.description.length > 36 && (
                      <>
                        <span className="ml-2 italic hover:underline cursor-pointer text-xs opacity-45">[ more ]</span>
                        <span className="tooltiptext">{dataNft.description}</span>
                      </>
                    )}
                  </div>
                </span>
              </div>
            )}

            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6 text-sm">Creator:</span>
              <span className="col-span-8 text-left text-sm">
                {<MXAddressLink explorerAddress={explorerAddress} address={dataNft.creator} precision={6} />}
              </span>
            </div>

            {dataNft.creationTime && (
              <div className="grid grid-cols-12 mb-1">
                <span className="col-span-4 opacity-6 text-sm">Created At:</span>
                <span className="col-span-8 text-left text-sm">{dataNft.creationTime.toLocaleString()}</span>
              </div>
            )}

            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6 text-sm">Identifier:</span>
              <div className="col-span-8 w-full items-center justify-center">
                <a
                  href={`${MARKETPLACE_DETAILS_PAGE}${dataNft.tokenIdentifier}`}
                  className="flex flex-row items-center text-decoration-none !text-blue-500"
                  target="_blank">
                  <p className="flex flex-row w-full items-center mb-0 text-sm">{dataNft.tokenIdentifier}</p>
                </a>
              </div>
            </div>

            {showBalance && (
              <div className="grid grid-cols-12 mb-1">
                <span className="col-span-4 opacity-6 text-sm">Balance:</span>
                <span className="col-span-8 text-left text-sm">{dataNft.balance !== 0 ? dataNft.balance.toString() : "1"}</span>
              </div>
            )}

            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6 text-sm">Total Supply:</span>
              <span className="col-span-8 text-left text-sm">{dataNft.supply.toString()}</span>
            </div>

            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6 text-sm">Royalties:</span>
              <span className="col-span-8 text-left text-sm">{isNaN(dataNft.royalties) ? "0%" : (dataNft.royalties * 100).toFixed(2) + "%"}</span>
            </div>
          </div>

          <div className="">
            {!hideIsInWalletSection && (
              <>
                {!isWallet ? (
                  <div className="pt-5 pb-3 text-center">
                    <h6 className="!text-sm" style={{ visibility: owned ? "visible" : "hidden" }}>
                      You have this Data NFT
                    </h6>
                  </div>
                ) : (
                  <div></div>
                )}
              </>
            )}

            <CardFooter className="flex w-full justify-center py-2 text-center">
              {owned ? (
                <Modal
                  openTrigger={
                    <Button
                      className="!text-black bg-gradient-to-r from-yellow-300 to-orange-500 border-0 text-background rounded-lg font-medium tracking-tight !text-sm hover:opacity-80 hover:text-black"
                      variant="ghost"
                      onClick={() => {
                        viewData(index);

                        if (openActionFireLogic) {
                          openActionFireLogic();
                        }
                      }}>
                      {openActionBtnText ? openActionBtnText : isDataWidget ? "Open App" : "View Data"}
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
                <>
                  {!isLoggedIn ? (
                    <Link to={routeNames.unlock} state={{ from: `${location.pathname}${location.search}` }}>
                      <div className="bg-gradient-to-r from-yellow-300 to-orange-500 p-[1px] px-[2px] rounded-lg justify-center">
                        <Button
                          className="bg-background text-foreground hover:bg-background/90 border-0 rounded-md font-medium tracking-wide !text-lg"
                          variant="outline">
                          Login to Check
                        </Button>
                      </div>
                    </Link>
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
                </>
              )}
            </CardFooter>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
