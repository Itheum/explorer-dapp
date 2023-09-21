import React from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft/out";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks/useGetNetworkConfig";
import { MARKETPLACE_DETAILS_PAGE } from "config";
import { convertToLocalString } from "libs/utils";
import { Button } from "../libComponents/Button";
import { Card, CardContent, CardFooter } from "../libComponents/Card";
import { Modal } from "./Modal/Modal";
import { MXAddressLink } from "./MXAddressLink";

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
}: {
  index: number;
  dataNft: DataNft;
  isLoading: boolean;
  owned: boolean;
  isWallet?: boolean;
  viewData: (e: number) => void;
  showBalance?: boolean;
  modalContent?: JSX.Element;
  modalTitle?: string;
  modalTitleStyle?: string;
}) {
  const {
    network: { explorerAddress },
  } = useGetNetworkConfig();
  const { tokenLogin } = useGetLoginInfo();
  function goToMarketplace(tokenIdentifier: string) {
    if (tokenLogin && tokenLogin.nativeAuthToken) {
      window.open(`${MARKETPLACE_DETAILS_PAGE}${tokenIdentifier}/?accessToken=${tokenLogin?.nativeAuthToken}`)?.focus();
    } else {
      window.open(`${MARKETPLACE_DETAILS_PAGE}${tokenIdentifier}`)?.focus();
    }
  }

  return (
    <div className="mb-3 ">
      <Card className="border-[0.5px] dark:border-slate-100/30 border-slate-300 bg-transparent rounded-[2.37rem] xl:w-[330px] w-[296px]">
        <CardContent className="flex flex-col p-3">
          <div className="mb-4">
            <img className="" src={!isLoading ? dataNft.nftImgUrl : "https://media.elrond.com/nfts/thumbnail/default.png"} />
          </div>

          <div className="h-[220px]">
            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6">Title:</span>
              <span className="col-span-8 text-left">{dataNft.title}</span>
            </div>
            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6">Description:</span>
              <span className="col-span-8 text-left">{dataNft.description.length > 20 ? dataNft.description.slice(0, 25) + " ..." : dataNft.description}</span>
            </div>
            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6">Creator:</span>
              <span className="col-span-8 text-left ">{<MXAddressLink explorerAddress={explorerAddress} address={dataNft.creator} precision={6} />}</span>
            </div>
            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6">Created At:</span>
              <span className="col-span-8 text-left">{dataNft.creationTime.toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6">Identifier:</span>
              <div className="col-span-8 w-full items-center justify-center">
                <a
                  href={
                    `${MARKETPLACE_DETAILS_PAGE}${dataNft.tokenIdentifier}` + (tokenLogin && tokenLogin.nativeAuthToken)
                      ? `/?accessToken=${tokenLogin?.nativeAuthToken}`
                      : ""
                  }
                  className="flex flex-row items-center text-decoration-none !text-blue-500"
                  target="_blank">
                  <p className="flex flex-row w-full items-center mb-0 text-sm xl:text-base">{dataNft.tokenIdentifier}</p>
                </a>
              </div>
            </div>
            {showBalance && (
              <div className="grid grid-cols-12 mb-1">
                <span className="col-span-4 opacity-6">Balance:</span>
                <span className="col-span-8 text-left">{dataNft.balance}</span>
              </div>
            )}
            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6">Total Supply:</span>
              <span className="col-span-8 text-left">{dataNft.supply}</span>
            </div>
            <div className="grid grid-cols-12 mb-1">
              <span className="col-span-4 opacity-6">Royalties:</span>
              <span className="col-span-8 text-left">{isNaN(dataNft.royalties) ? "0%" : convertToLocalString(dataNft.royalties * 100, 2) + "%"}</span>
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

            <CardFooter className="flex w-full justify-center mt-3 pb-2 text-center">
              {owned ? (
                <Modal
                  openTrigger={
                    <Button
                      className="bg-gradient-to-r from-yellow-300 to-orange-500 border-0 text-black rounded-lg font-medium tracking-wide !text-lg hover:opacity-80 hover:text-black"
                      variant="ghost"
                      onClick={() => viewData(index)}>
                      View Data
                    </Button>
                  }
                  closeOnOverlayClick={false}
                  title={modalTitle ?? ""}
                  titleClassName={modalTitleStyle}>
                  {modalContent}
                </Modal>
              ) : (
                <div className="bg-gradient-to-r from-yellow-300 to-orange-500 px-[1px] py-[1px] rounded-md justify-center">
                  <Button
                    className="dark:bg-[#0f0f0f] border-0 rounded-lg font-medium tracking-wide !text-lg hover:opacity-90"
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
