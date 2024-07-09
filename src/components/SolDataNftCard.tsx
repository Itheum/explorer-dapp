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
  isWallet,
  viewData,
  modalContent,
  modalTitle,
  modalTitleStyle,
  hasFilter,
  filterData,
  cardStyles,
  modalStyles,
}: {
  index: number;
  dataNft: DasApiAsset;
  owned: boolean;
  isWallet?: boolean;
  isLoading?: boolean;
  viewData: (e: number) => void;
  modalContent?: React.ReactElement;
  modalTitle?: string;
  modalTitleStyle?: string;
  hasFilter?: boolean;
  filterData?: Array<IFilterData>;
  cardStyles?: string;
  modalStyles?: string;
}) {
  function goToDrip() {
    window.open(DRIP_PAGE)?.focus();
  }
  const imageSrc: string = (dataNft.content.links && dataNft.content.links["image" as any] ? dataNft.content.links["image" as any] : "") as string;
  const title = dataNft.content.metadata.name;
  const description = dataNft.content.metadata.description ?? "";
  const id = dataNft.id.toString();
  const royalties = dataNft.royalty;
  return (
    <div className="mb-3">
      <Card
        className={cn(
          cardStyles,
          "border-[0.5px]  dark:border-slate-100/30 border-slate-300  bg-transparent rounded-[2.37rem] base:w-[18.5rem] md:w-[20.6rem]"
        )}>
        <CardContent className="flex flex-col p-3">
          <img src={imageSrc} className="mb-8 base:h-[15rem] md:h-[18rem] rounded-3xl" />

          <div className="md:h-[15rem] h-[13rem]">
            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6 base:text-sm md:text-base">Title:</span>
              <span className="col-span-8 text-left base:text-sm md:text-base">{title}</span>
            </div>
            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6 base:text-sm md:text-base">Description:</span>
              <span className="col-span-8 text-left base:text-sm md:text-base">
                {description.length > 20 ? description.slice(0, 22) + " ..." : description}
              </span>
            </div>

            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6 base:text-sm md:text-base">ID:</span>
              <div className="col-span-8 w-full items-center justify-center">
                <p className="flex flex-row w-full items-center mb-0 base:text-sm md:text-base">{id.slice(0, 6) + " ... " + id.slice(-6)}</p>
              </div>
            </div>
            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6 base:text-sm md:text-base">Royalties:</span>
              <span className="col-span-8 text-left base:text-sm md:text-base">{royalties.percent * 100}%</span>
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
