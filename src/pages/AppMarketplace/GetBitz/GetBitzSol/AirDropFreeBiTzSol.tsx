import React, { useEffect, useState } from "react";
import { DasApiAsset } from "@metaplex-foundation/digital-asset-standard-api";
import { useWallet } from "@solana/wallet-adapter-react";
import { confetti } from "@tsparticles/confetti";
import { Container } from "@tsparticles/engine";
import { Modal } from "components/Modal/Modal";
import { Button } from "libComponents/Button";
import { getOrCacheAccessNonceAndSignature, mintMiscDataNft, fetchSolNfts, checkIfFreeDataNftGiftMinted } from "libs/sol/SolViewData";
import { sleep } from "libs/utils";
import { useAccountStore } from "store/account";
import { useNftsStore } from "store/nfts";

type AirDropFreeBiTzSolProps = {
  onCloseModal: any;
};

export const AirDropFreeBiTzSol = (props: AirDropFreeBiTzSolProps) => {
  const { onCloseModal } = props;
  const { publicKey: publicKeySol, signMessage } = useWallet();
  const { solBitzNfts, updateSolNfts } = useNftsStore();
  const [getAirdropWorkflow, setGetAirdropWorkflow] = useState<boolean>(false);
  const [freeMintBitzXpLoading, setFreeMintBitzXpLoading] = useState<boolean>(false);
  const [freeMintBitzXpGameComingUp, setFreeMintBitzXpGameComingUp] = useState<boolean>(false);
  const [errFreeMintGeneric, setErrFreeMintGeneric] = useState<string | null>(null);
  const [freeDropCheckNeededForBitz, setFreeDropCheckNeededForBitz] = useState<number>(0);
  const [freeNfMeIdClaimed, setFreeNfMeIdClaimed] = useState<boolean>(false);

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

      // only allow to proceed with user does not have any bitz nfts AND we also double confirm via our free mint log API
      if (solBitzNfts.length === 0) {
        setGetAirdropWorkflow(true);

        const freeNfMeIdMinted = await checkIfFreeDataNftGiftMinted("bitzxp", publicKeySol.toBase58());

        if (freeNfMeIdMinted.alreadyGifted) {
          setFreeNfMeIdClaimed(true);
        }
      }
    })();
  }, [publicKeySol, solBitzNfts]);

  useEffect(() => {
    (async () => {
      if (freeMintBitzXpGameComingUp) {
        await sleep(10);
        setFreeMintBitzXpGameComingUp(false);
        onCloseModal();
      }
    })();
  }, [freeMintBitzXpGameComingUp]);

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

  const handleFreeMintBitzXP = async () => {
    if (!publicKeySol) {
      return;
    }

    setFreeMintBitzXpLoading(true);

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
      const miscMintRes = await mintMiscDataNft("bitzxp", publicKeySol.toBase58(), usedPreAccessSignature, usedPreAccessNonce);

      if (miscMintRes.error) {
        setErrFreeMintGeneric(miscMintRes.error || miscMintRes?.e?.toString() || "unknown error");
      } else if (miscMintRes?.newDBLogEntryCreateFailed) {
        _errInWorkflow = "Misc mint passed, but the db log failed.";
      }

      if (miscMintRes?.mintDoneMintMetaSkipped) {
        // wait some delay in seconds and check if the API in the backend to mark the free mint as done
        await sleep(15);

        setFreeDropCheckNeededForBitz(freeDropCheckNeededForBitz + 1);

        // update the NFT store now as we have a new NFT (the bitz nft collection will also update via an effect in store provider)
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
      setFreeMintBitzXpGameComingUp(true);
    } else {
      setErrFreeMintGeneric(_errInWorkflow);
    }

    setFreeMintBitzXpLoading(false);
  };

  return (
    <>
      <Modal
        triggerOpen={getAirdropWorkflow}
        triggerOnClose={() => {
          if (!freeMintBitzXpLoading) {
            setFreeMintBitzXpGameComingUp(false);
            setGetAirdropWorkflow(false);
            setErrFreeMintGeneric(null);
            onCloseModal();
          }
        }}
        closeOnOverlayClick={false}
        title={"Get Your Free BiTz XP Data NFT Airdrop!"}
        hasFilter={false}
        filterData={[]}
        modalClassName=""
        titleClassName={"p-6 md:!p-4 !text-2xl md:!text-3xl"}>
        {
          <div
            className=""
            style={{
              minHeight: "10rem",
            }}>
            <div className="flex flex-col gap-2 p-10">
              <div className="items-center">
                <div className="text-2xl font-bold mb-2">With Itheum, your XP Data is yours to own! 🚀</div>
                <div className="mt-5">
                  {" "}
                  BiTz are Itheum XP stored as Data NFTs in your wallet. Use them to curate, power up, and interact with data while earning rewards. Your BiTz
                  NFT unlocks access to the Itheum Protocol and the Web3 AI Data Era.
                </div>

                {freeNfMeIdClaimed && (
                  <div className="h-[100px] text-lg mt-10">
                    <div className="text-orange-700 dark:text-orange-300 text-sm">
                      Error! You have already claimed your free BiTz XP Data NFT. If it's not being detected, please logout and reload your browser and try
                      again.
                    </div>
                    <Button
                      className="text-sm mt-2 cursor-pointer !text-white"
                      variant="destructive"
                      onClick={(event: any) => {
                        // in case the modal is over another action button or method, we stop the click from propagating down to it as this may cause the state to change below the modal
                        event.stopPropagation();

                        setFreeMintBitzXpGameComingUp(false);
                        setGetAirdropWorkflow(false);
                        setErrFreeMintGeneric(null);
                        onCloseModal();
                      }}>
                      Close, Logout, Reload and Try Again
                    </Button>
                  </div>
                )}

                {errFreeMintGeneric && (
                  <div className="h-[100px] text-lg mt-10">
                    <div className="text-orange-700 dark:text-orange-300 text-sm">
                      Error! Free mint of BiTz XP Data NFT is not possible right now. More Info = {errFreeMintGeneric}
                    </div>
                    <Button
                      className="text-sm mt-2 cursor-pointer !text-white"
                      variant="destructive"
                      onClick={(event: any) => {
                        // in case the modal is over another action button or method, we stop the click from propagating down to it as this may cause the state to change below the modal
                        event.stopPropagation();

                        setFreeMintBitzXpGameComingUp(false);
                        setGetAirdropWorkflow(false);
                        setErrFreeMintGeneric(null);
                        onCloseModal();
                      }}>
                      Close & Try Again
                    </Button>
                  </div>
                )}

                {!errFreeMintGeneric && !freeNfMeIdClaimed && (
                  <div className="mt-8">
                    {!freeMintBitzXpGameComingUp ? (
                      <>
                        <Button
                          className="!text-white md:text-lg bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-30% to-[#5D3899] to-95% cursor-pointer md:w-[300px] h-[50px]"
                          disabled={freeMintBitzXpLoading}
                          onClick={() => {
                            handleFreeMintBitzXP();
                          }}>
                          <span className="ml-2">{freeMintBitzXpLoading ? "Minting..." : "LFG! Give Me My Airdrop!"}</span>
                        </Button>
                      </>
                    ) : (
                      <div className="bxg-blue-800 mt-5 text-white bg-teal-700 p-5 rounded-lg text-lg">
                        🙌 Success! {`Let's`} get you your first BiTz XP, game coming up in 5,4,3,2,1...
                      </div>
                    )}
                  </div>
                )}

                {((!freeNfMeIdClaimed && !freeMintBitzXpGameComingUp) || errFreeMintGeneric) && (
                  <div className="text-xs mt-4">
                    Requirements: Only 1 per address, completely free to you, but you need SOL in your wallet, which will NOT be used but is to make sure your
                    wallet exists and can receive the NFT. {freeMintBitzXpLoading && <>(⏳ Please wait, this can take a few minutes.)</>}
                  </div>
                )}
              </div>
            </div>
          </div>
        }
      </Modal>
    </>
  );
};
