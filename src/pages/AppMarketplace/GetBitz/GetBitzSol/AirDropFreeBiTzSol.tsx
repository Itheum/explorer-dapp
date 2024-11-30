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

  async function getAirdrop() {
    setAirdropInProgress(true);

    setAirdropInProgress(false);
  }

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

  return (
    <>
      <Modal
        triggerOpen={getAirdropWorkflow}
        triggerOnClose={() => {
          onCloseModal();
          setGetAirdropWorkflow(false);
        }}
        closeOnOverlayClick={false}
        title={"Get a free BiTz XP Data NFT Airdrop and earn BiTz XP"}
        hasFilter={false}
        filterData={[]}
        modalClassName={""}
        titleClassName={"p-4"}>
        {
          <div
            className="bg-1cyan-900"
            style={{
              minHeight: "10rem",
            }}>
            <div className="bg-1cyan-200 flex flex-col gap-2 p-10">
              <div className="bg-1green-200 flex items-center">
                <div className="bg-1blue-300 ml-5 text-xl font-bold">LOREM</div>
              </div>
            </div>
          </div>
        }
      </Modal>
    </>
  );
};
