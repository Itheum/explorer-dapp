import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Link } from "react-router-dom";
import { Button } from "libComponents/Button";
import { checkIfFreeDataNftGiftMinted } from "libs/sol/SolViewData";
import { sleep } from "libs/utils";
import { AirDropFreeMusicGiftSol } from "pages/AppMarketplace/NFTunes/AirDropFreeMusicGiftSol";
import { routeNames } from "routes";
import { useNftsStore } from "store/nfts";

export function DataNftAirdropsBannerCTA() {
  const { publicKey: publicKeySol } = useWallet();
  const [freeDropCheckLoading, setFreeDropCheckLoading] = useState<boolean>(false);
  const [freeBitzClaimed, setFreeBitzClaimed] = useState<boolean>(false);
  const [freeNfMeIdClaimed, setFreeNfMeIdClaimed] = useState<boolean>(false);
  const [freeMusicGiftClaimed, setFreeMusicGiftClaimed] = useState<boolean>(false);
  const [freeMintMusicGiftIntroToAction, setFreeMintMusicGiftIntroToAction] = useState<boolean>(false);
  const { solBitzNfts } = useNftsStore();

  useEffect(() => {
    const checkFreeClaims = async () => {
      if (publicKeySol) {
        setFreeDropCheckLoading(true);
        const freeNfMeIdMinted = await checkIfFreeDataNftGiftMinted("nfmeid", publicKeySol.toBase58());

        if (freeNfMeIdMinted.alreadyGifted) {
          setFreeNfMeIdClaimed(true);
        }

        await sleep(1);

        const freeBitzMinted = await checkIfFreeDataNftGiftMinted("bitzxp", publicKeySol.toBase58());

        if (freeBitzMinted.alreadyGifted) {
          setFreeBitzClaimed(true);
        }

        await sleep(1);

        const freeMusicGiftMinted = await checkIfFreeDataNftGiftMinted("musicgift", publicKeySol.toBase58());

        if (freeMusicGiftMinted.alreadyGifted) {
          setFreeMusicGiftClaimed(true);
        }

        setFreeDropCheckLoading(false);
      }
    };

    checkFreeClaims();
  }, [publicKeySol]);

  useEffect(() => {
    // if the user didn't have one and claimed it, the nft store will update and we can change the CTA below
    if (solBitzNfts.length > 0) {
      setFreeBitzClaimed(true);
    }
  }, [solBitzNfts]);

  // should we show the banner?
  const shouldShowBanner = (!freeBitzClaimed && !freeMusicGiftClaimed) || (location.pathname === routeNames.home && !freeNfMeIdClaimed);

  return (
    <>
      {!freeDropCheckLoading && shouldShowBanner && (
        <div className="mt-5 py-2 md:py-0 mb-3 border p-2 rounded-lg bg-[#fa882157] w-[100%]">
          <div className="flex flex-col md:flex-col items-center">
            <div className="flex flex-col justify-center p-2">
              <p className="dark:text-white text-2xl mb-1 text-center">Hello Human, You Have Some Free Data NFTs to Claim!</p>
              <p className="dark:text-white text-md text-center">
                Claim the free Data NFTs, join the AI Data Workforce, prove your reputation, co-create creative data with AI and get rewarded
              </p>
            </div>
            <div className="flex flex-row justify-center p-2">
              <div className="flex md:flex-col justify-center mt-3 ml-auto mr-auto md:mr-2">
                <Link to={routeNames.getbitz}>
                  <Button
                    disabled={freeBitzClaimed || location.pathname === routeNames.getbitz}
                    className="!text-black text-sm tracking-tight relative px-[2.35rem] bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                    {`${location.pathname === routeNames.getbitz ? "Claim Below" : "Claim BiTz XP Data NFT"}`}
                  </Button>
                </Link>
              </div>
              <div className="flex md:flex-col justify-center mt-3 ml-auto mr-auto md:mr-2">
                <Button
                  disabled={freeMusicGiftClaimed}
                  onClick={() => {
                    setFreeMintMusicGiftIntroToAction(true);
                  }}
                  className="!text-black text-sm tracking-tight relative px-[2.35rem] bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                  Claim Music Data NFT
                </Button>
              </div>
              <div className="flex md:flex-col justify-center mt-3 ml-auto mr-auto md:mr-2">
                <Link
                  to={`${publicKeySol ? "https://workforce.itheum.io/nfmeid" : "https://datadex.itheum.io/nfmeid"}`}
                  target="_blank"
                  className="text-base hover:!no-underline hover:text-black">
                  <Button
                    disabled={freeNfMeIdClaimed}
                    className="!text-black text-sm tracking-tight relative px-[2.35rem] bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                    Claim NFMe ID
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {freeMintMusicGiftIntroToAction && (
        <>
          <AirDropFreeMusicGiftSol
            onCloseModal={() => {
              setFreeMintMusicGiftIntroToAction(false);
            }}
          />
        </>
      )}
    </>
  );
}
