import React from "react";
import { DasApiAsset } from "@metaplex-foundation/digital-asset-standard-api";
import { DRIP_PAGE } from "config";
import { cn } from "libs/utils";
import { Modal } from "./Modal/Modal";
import { Button } from "../libComponents/Button";
import { Card, CardContent, CardFooter } from "../libComponents/Card";
import { IFilterData } from "../libComponents/Filter";

export function SolDataNftCard({
  index,
  dataNft,
  owned,
  isLoading,
  isDataWidget = false,
  isWallet,
  viewData,
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
  dataNft: DasApiAsset;
  owned: boolean;
  isWallet?: boolean;
  isLoading?: boolean;
  isDataWidget?: boolean;
  viewData: (e: number) => void;
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
  function goToDrip() {
    window.open(DRIP_PAGE)?.focus();
  }

  const imageSrc: string = (dataNft.content.links && dataNft.content.links["image" as any] ? dataNft.content.links["image" as any] : "") as string;
  const title = dataNft.content.metadata.name;
  const description = dataNft.content.metadata.description ?? "";

  return (
    <div className="mb-3">
      <Card className={cn(cardStyles, "border-[0.5px] dark:border-slate-100/30 border-slate-300 bg-transparent rounded-[2.37rem] base:w-[18rem] md:w-[19rem]")}>
        <CardContent className="flex flex-col p-3">
          <img src={imageSrc} className="base:h-[12rem] md:h-[15rem] rounded-3xl p-5" />

          <div>
            <div className="grid grid-cols-12 mb-2 mt-2">
              <span className="col-span-12 text-left text-md">{title}</span>
            </div>

            {description && description.trim() !== "" && (
              <div className="grid grid-cols-12 mb-1">
                <div className="col-span-12 text-left text-sm">
                  {description.length > 53 ? description.slice(0, 55) + " ..." : description}
                  <div className="tooltip !hidden md:!inline-block">
                    {description.length > 53 && (
                      <>
                        <span className="ml-2 italic hover:underline cursor-pointer text-xs opacity-45">[ more ]</span>
                        <span className="tooltiptext">{description}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
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
                <div className="text-foreground bg-gradient-to-r from-yellow-300 to-orange-500 p-[1px] rounded-md ">
                  <Button
                    className="dark:bg-[#0f0f0f] border-0 rounded-md font-medium tracking-tight !text-sm hover:opacity-90"
                    variant="outline"
                    onClick={() => goToDrip()}>
                    View on DRiP
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
