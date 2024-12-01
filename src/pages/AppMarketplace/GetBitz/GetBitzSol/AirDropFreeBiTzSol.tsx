import React, { useEffect, useState } from "react";
import { useGetAccount } from "@multiversx/sdk-dapp/hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import { confetti } from "@tsparticles/confetti";
import { Container } from "@tsparticles/engine";
import { ExternalLinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Modal } from "components/Modal/Modal";
import { Button } from "libComponents/Button";
import { getOrCacheAccessNonceAndSignature, viewDataWrapperSol } from "libs/sol/SolViewData";
import { sleep } from "libs/utils";
import { toastClosableError } from "libs/utils/uiShared";
import { routeNames } from "routes";
import { useAccountStore } from "store/account";
import { useNftsStore } from "store/nfts";
import useSolBitzStore from "store/solBitz";

type AirDropFreeBiTzSolProps = {
  onCloseModal: any;
};

export const AirDropFreeBiTzSol = (props: AirDropFreeBiTzSolProps) => {
  const { onCloseModal } = props;
  const { publicKey: publicKeySol, signMessage } = useWallet();
  const [airdropInProgress, setAirdropInProgress] = useState<boolean>(false);
  const [airdropSuccessfullyDone, setAirdropSuccessfullyDone] = useState<boolean>(false);
  const [airdropError, setAirdropError] = useState<boolean>(false);
  const { solBitzNfts } = useNftsStore();
  const [getAirdropWorkflow, setGetAirdropWorkflow] = useState<boolean>(false);

  const [freeMintBitzXpLoading, setFreeMintBitzXpLoading] = useState<boolean>(false);
  const [freeMintBitzXpGameComingUp, setFreeMintBitzXpGameComingUp] = useState<boolean>(false);

  // S: Cached Signature Store Items
  const solPreaccessNonce = useAccountStore((state: any) => state.solPreaccessNonce);
  const solPreaccessSignature = useAccountStore((state: any) => state.solPreaccessSignature);
  const solPreaccessTimestamp = useAccountStore((state: any) => state.solPreaccessTimestamp);
  const updateSolPreaccessNonce = useAccountStore((state: any) => state.updateSolPreaccessNonce);
  const updateSolPreaccessTimestamp = useAccountStore((state: any) => state.updateSolPreaccessTimestamp);
  const updateSolSignedPreaccess = useAccountStore((state: any) => state.updateSolSignedPreaccess);
  // E: Cached Signature Store Items

  useEffect(() => {
    console.log("OPEN");
    if (solBitzNfts.length === 0) {
      setGetAirdropWorkflow(true);
    }
  }, []);

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
    await sleep(5);

    // const { usedPreAccessNonce, usedPreAccessSignature } = await getOrCacheAccessNonceAndSignature({
    //   solPreaccessNonce,
    //   solPreaccessSignature,
    //   solPreaccessTimestamp,
    //   signMessage,
    //   publicKey: userPublicKey,
    //   updateSolPreaccessNonce,
    //   updateSolSignedPreaccess,
    //   updateSolPreaccessTimestamp,
    // });

    // const miscMintRes = await mintMiscDataNft(mintTemplate, userPublicKey.toBase58(), usedPreAccessSignature, usedPreAccessNonce);

    // if (miscMintRes.error) {
    //   setErrFreeMintGeneric(miscMintRes.error || miscMintRes?.e?.toString() || "unknown error");
    // } else if (miscMintRes?.newDBLogEntryCreateFailed) {
    //   setErrFreeMintGeneric("Misc mint passed, but the db log failed");
    // }

    // if (miscMintRes?.assetId) {
    //   // check 10 seconds and check if the API in the backend to mark the free mint as done
    //   await sleep(10);

    //   switch (mintTemplate) {
    //     case "bitzxp":
    //       setFreeDropCheckNeededForBitz(freeDropCheckNeededForBitz + 1);
    //       break;
    //     case "musicgift":
    //       setFreeDropCheckNeededForMusicGift(freeDropCheckNeededForMusicGift + 1);
    //       break;
    //     default:
    //       break;
    //   }

    //   // update the NFT store now as we have a new NFT
    //   const _allDataNfts: DasApiAsset[] = await fetchSolNfts(userPublicKey?.toBase58());
    //   updateAllDataNfts(_allDataNfts);

    //   // fetchSolNfts(userPublicKey?.toBase58()).then((nfts) => {
    //   //   console.log("nfts B", nfts);

    //   //   updateAllDataNfts(nfts);
    //   // });

    //   onProgressModalClose();
    // } else {
    //   setErrFreeMintGeneric("Free minting has failed");
    // }

    setFreeMintBitzXpLoading(false);
    showConfetti();
    setFreeMintBitzXpGameComingUp(true);
  };

  useEffect(() => {
    (async () => {
      if (freeMintBitzXpGameComingUp) {
        await sleep(5);
        setFreeMintBitzXpGameComingUp(false);
        onCloseModal();
      }
    })();
  }, [freeMintBitzXpGameComingUp]);

  return (
    <>
      <Modal
        triggerOpen={getAirdropWorkflow}
        triggerOnClose={() => {
          onCloseModal();
          setGetAirdropWorkflow(false);
        }}
        closeOnOverlayClick={false}
        title={"Get Your Free BiTz XP Data NFT Airdrop!"}
        hasFilter={false}
        filterData={[]}
        modalClassName=""
        titleClassName="p-4">
        {
          <div
            className="bg-1cyan-900"
            style={{
              minHeight: "10rem",
            }}>
            <div className="bgx-cyan-900 flex flex-col gap-2 p-10">
              <div className="bgx-green-900  items-center">
                <div className="bgx-blue-900 text-2xl font-bold mb-2">With Itheum, your XP Data is yours to own! 🚀</div>
                <div className="bxg-blue-800 mt-5">
                  {" "}
                  {`BiTz`} are Itheum XP stored in a Data NFT in your wallet. Collect them to curate, power-up, and like data—and earn rewards! Your BiTz NFT is
                  your gateway to the Itheum Protocol and the Web3 AI Data Era {`we're`} enabling.
                </div>
                <div className="bgx-blue-300 mt-8">
                  {!freeMintBitzXpGameComingUp ? (
                    <Button
                      className="!text-white text-lg bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-30% to-[#5D3899] to-95% cursor-pointer w-[300px] h-[50px]"
                      disabled={freeMintBitzXpLoading}
                      onClick={() => {
                        handleFreeMintBitzXP();
                      }}>
                      <span className="ml-2">{freeMintBitzXpLoading ? "Minting..." : "LFG! Give Me My Airdrop!"}</span>
                    </Button>
                  ) : (
                    <div className="bxg-blue-800 mt-5 bg-teal-700 p-5 rounded-lg text-lg">
                      🙌 Success! {`Let's`} get you for first BiTz XP, game coming up in 3,2,1...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        }
      </Modal>
    </>
  );
};
