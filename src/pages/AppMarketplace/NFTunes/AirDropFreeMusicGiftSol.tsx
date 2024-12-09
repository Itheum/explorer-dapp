import React, { useEffect, useState } from "react";
import { DasApiAsset } from "@metaplex-foundation/digital-asset-standard-api";
import { useWallet } from "@solana/wallet-adapter-react";
import { confetti } from "@tsparticles/confetti";
import { Container } from "@tsparticles/engine";
import { Link } from "react-router-dom";
import MusicGiftPreview from "assets/img/nf-tunes/music-data-nft-gift-preview.png";
import { Modal } from "components/Modal/Modal";
import { Button } from "libComponents/Button";
import { getOrCacheAccessNonceAndSignature, mintMiscDataNft, fetchSolNfts, checkIfFreeDataNftGiftMinted } from "libs/sol/SolViewData";
import { sleep } from "libs/utils";
import { routeNames } from "routes";
import { useAccountStore } from "store/account";
import { useNftsStore } from "store/nfts";

type AirDropFreeMusicGiftSolSolProps = {
  onCloseModal: any;
};

export const AirDropFreeMusicGiftSol = (props: AirDropFreeMusicGiftSolSolProps) => {
  const { onCloseModal } = props;
  const { publicKey: publicKeySol, signMessage } = useWallet();
  const { updateSolNfts } = useNftsStore();
  const [getAirdropWorkflow, setGetAirdropWorkflow] = useState<boolean>(false);
  const [freeMintMusicGiftLoading, setFreeMintMusicGiftLoading] = useState<boolean>(false);
  const [errFreeMintGeneric, setErrFreeMintGeneric] = useState<string | null>(null);
  const [freeDropCheckNeededForMusicGift, setFreeDropCheckNeededForMusicGift] = useState<number>(0);
  const [freeMusicGiftClaimed, setFreeMusicGiftClaimed] = useState<boolean>(false);

  // S: Cached Signature Store Items
  const solPreaccessNonce = useAccountStore((state: any) => state.solPreaccessNonce);
  const solPreaccessSignature = useAccountStore((state: any) => state.solPreaccessSignature);
  const solPreaccessTimestamp = useAccountStore((state: any) => state.solPreaccessTimestamp);
  const updateSolPreaccessNonce = useAccountStore((state: any) => state.updateSolPreaccessNonce);
  const updateSolPreaccessTimestamp = useAccountStore((state: any) => state.updateSolPreaccessTimestamp);
  const updateSolSignedPreaccess = useAccountStore((state: any) => state.updateSolSignedPreaccess);
  // E: Cached Signature Store Items

  useEffect(() => {
    (async () => {
      if (!publicKeySol) {
        return;
      }

      setGetAirdropWorkflow(true);

      const freeNfMeIdMinted = await checkIfFreeDataNftGiftMinted("musicgift", publicKeySol.toBase58());

      if (freeNfMeIdMinted.alreadyGifted) {
        setFreeMusicGiftClaimed(true);
      }
    })();
  }, [publicKeySol]);

  useEffect(() => {
    const checkFreeClaim = async () => {
      if (publicKeySol) {
        const freeDataNftMinted = await checkIfFreeDataNftGiftMinted("musicgift", publicKeySol.toBase58());

        if (freeDataNftMinted.alreadyGifted) {
          setFreeMusicGiftClaimed(true);
        }

        await sleep(1);
      }
    };

    checkFreeClaim();
  }, [freeDropCheckNeededForMusicGift]);

  async function showConfetti() {
    const animation = await confetti({
      spread: 360,
      ticks: 100,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      particleCount: 200,
      scalar: 2,
      shapes: ["emoji"],
      shapeOptions: {
        emoji: {
          value: ["🤲🏼", "💎", "🤲🏼", "💎", "🎊", "🐸", "🐸", "🐸", "🐸", "🐹", "🐹"],
        },
      },
    });

    if (animation) {
      await sleep(10);

      animation.stop();
      // as its confetti, then we have to destroy it
      if ((animation as unknown as Container).destroy) {
        (animation as unknown as Container).destroy();
      }
    }
  }

  const handleFreeMintMusicGift = async () => {
    if (!publicKeySol) {
      return;
    }

    setFreeMintMusicGiftLoading(true);

    const { usedPreAccessNonce, usedPreAccessSignature } = await getOrCacheAccessNonceAndSignature({
      solPreaccessNonce,
      solPreaccessSignature,
      solPreaccessTimestamp,
      signMessage,
      publicKey: publicKeySol,
      updateSolPreaccessNonce,
      updateSolSignedPreaccess,
      updateSolPreaccessTimestamp,
    });

    let _errInWorkflow = null;

    try {
      const miscMintRes = await mintMiscDataNft("musicgift", publicKeySol.toBase58(), usedPreAccessSignature, usedPreAccessNonce);

      if (miscMintRes.error) {
        setErrFreeMintGeneric(miscMintRes.error || miscMintRes?.e?.toString() || "unknown error");
      } else if (miscMintRes?.newDBLogEntryCreateFailed) {
        _errInWorkflow = "Misc mint passed, but the db log failed.";
      }

      if (miscMintRes?.assetId) {
        // wait some delay in seconds and check if the API in the backend to mark the free mint as done
        await sleep(15);

        setFreeDropCheckNeededForMusicGift(freeDropCheckNeededForMusicGift + 1);

        // update the NFT store now as we have a new NFT
        const _allDataNfts: DasApiAsset[] = await fetchSolNfts(publicKeySol?.toBase58());
        updateSolNfts(_allDataNfts);
      } else {
        if (miscMintRes?.error) {
          _errInWorkflow = "Error! " + miscMintRes?.error;
        } else {
          _errInWorkflow = "Error! Free minting has failed, have you met all the requirements below? if so, please try again.";
        }
      }
    } catch (e: any) {
      _errInWorkflow = e.toString();
    }

    if (!_errInWorkflow) {
      await sleep(5);
      showConfetti();
    } else {
      setErrFreeMintGeneric(_errInWorkflow);
    }

    setFreeMintMusicGiftLoading(false);
  };

  return (
    <>
      <Modal
        triggerOpen={getAirdropWorkflow}
        triggerOnClose={() => {
          if (!freeMintMusicGiftLoading) {
            setGetAirdropWorkflow(false);
            setErrFreeMintGeneric(null);
            onCloseModal();
          }
        }}
        closeOnOverlayClick={false}
        title={"Get Your Free Sample Music Data NFT Airdrop!"}
        hasFilter={false}
        filterData={[]}
        modalClassName="-mt-5"
        titleClassName="p-4">
        {
          <div
            className="bg-1cyan-900"
            style={{
              minHeight: "10rem",
            }}>
            <div className="bgx-cyan-900 p-8">
              <div className="flex flex-col-reverse md:flex-row bgx-green-900 items-center">
                <div className="pr-5">
                  <div className="bgx-blue-900 text-2xl font-bold mb-2">Revolutionizing Music with AI 🚀</div>
                  <div className="bxg-blue-800 mt-5">
                    Itheum connects AI Agents, musicians, and fans to amplify music and train AI models, empowering real-world artists and enhancing music
                    content. Get your free Music Data NFT and join this initiative!
                  </div>

                  {errFreeMintGeneric && (
                    <div className="h-[100px] text-lg mt-10">
                      <div className="text-orange-700 dark:text-orange-300 text-sm">
                        Error! Free mint of Music Gift Data NFT is not possible right now. More Info = {errFreeMintGeneric}
                      </div>
                      <Button
                        className="text-sm mt-2 cursor-pointer !text-white"
                        variant="destructive"
                        onClick={(event: any) => {
                          // in case the modal is over another action button or method, we stop the click from propagating down to it as this may cause the state to change below the modal
                          event.stopPropagation();

                          setGetAirdropWorkflow(false);
                          setErrFreeMintGeneric(null);
                          onCloseModal();
                        }}>
                        Close & Try Again
                      </Button>
                    </div>
                  )}

                  {!errFreeMintGeneric && (
                    <div className="bgx-blue-300 mt-8">
                      {!freeMusicGiftClaimed ? (
                        <>
                          <Button
                            className="!text-white text-lg bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-30% to-[#5D3899] to-95% cursor-pointer w-[300px] h-[50px]"
                            disabled={freeMintMusicGiftLoading}
                            onClick={() => {
                              handleFreeMintMusicGift();
                            }}>
                            <span className="ml-2">{freeMintMusicGiftLoading ? "Minting..." : "LFG! Give Me My Airdrop!"}</span>
                          </Button>
                        </>
                      ) : (
                        <div className="bxg-blue-800 flex flex-col mt-5 text-white bg-teal-700 p-5 rounded-lg text-lg">
                          🙌 Success! {`Let's`} try it out now!
                          <Button
                            onClick={() => {
                              // we reload like this so that if the user is in nftunes, then we actually get the workflow into focus (or it wont)
                              location.href = `${routeNames.nftunes}/?artist-profile=waveborn-luminex&hl=sample`;

                              setGetAirdropWorkflow(false);
                              setErrFreeMintGeneric(null);
                              onCloseModal();
                            }}
                            className="!text-black mt-5 text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                            Use Music Data NFT on NF-Tunes
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {(!freeMusicGiftClaimed || errFreeMintGeneric) && (
                    <div className="text-xs mt-2">
                      Requirements: Only 1 per address, completely free to you, but you need SOL in your wallet, which will NOT be used but is to make sure your
                      wallet exists and can receive the NFT.
                    </div>
                  )}
                </div>
                <img src={MusicGiftPreview} className="w-[40%]" />
              </div>
            </div>
          </div>
        }
      </Modal>
    </>
  );
};
