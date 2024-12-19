import React, { useEffect, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { useGetAccount } from "@multiversx/sdk-dapp/hooks";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import { confetti } from "@tsparticles/confetti";
import { Container } from "@tsparticles/engine";
import { ExternalLinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { GET_BITZ_TOKEN_MVX } from "appsConfig";
import { Modal } from "components/Modal/Modal";
import { Button } from "libComponents/Button";
import { getOrCacheAccessNonceAndSignature, viewDataWrapperSol } from "libs/sol/SolViewData";
import { sleep, decodeNativeAuthToken } from "libs/utils";
import { toastClosableError } from "libs/utils/uiShared";
import { routeNames } from "routes";
import { useAccountStore } from "store/account";
import { useNftsStore } from "store/nfts";
import useSolBitzStore from "store/solBitz";
import { viewDataJSONCore } from "../GetBitz/GetBitzMvx/index";

type SendBitzPowerUpProps = {
  mvxNetworkSelected: boolean;
  giveBitzForMusicBountyConfig: {
    creatorIcon?: string | undefined;
    creatorName?: string | undefined;
    giveBitzToWho: string;
    giveBitzToCampaignId: string;
    isLikeMode?: boolean;
  };
  onCloseModal: any;
};

export const SendBitzPowerUp = (props: SendBitzPowerUpProps) => {
  const { giveBitzForMusicBountyConfig, onCloseModal } = props;
  const { creatorIcon, creatorName, giveBitzToWho, giveBitzToCampaignId, isLikeMode } = giveBitzForMusicBountyConfig;
  const { publicKey: publicKeySol, signMessage } = useWallet();
  const { address: addressMvx } = useGetAccount();
  const [giftBitzWorkflow, setGiftBitzWorkflow] = useState<boolean>(false);
  const [bitzValToGift, setBitzValToGift] = useState<number>(0);
  const [minBitzValNeeded, setMinBitzValNeeded] = useState<number>(1);
  const [poweringUpInProgress, setPoweringUpInProgress] = useState<boolean>(false);
  const [powerUpSuccessfullyDone, setPowerUpSuccessfullyDone] = useState<boolean>(false);
  const [poweringUpError, setPoweringUpError] = useState<boolean>(false);
  const { solBitzNfts } = useNftsStore();
  const { tokenLogin } = useGetLoginInfo();
  const [gameDataNFT, setGameDataNFT] = useState<DataNft>();
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const {
    bitzBalance: solBitzBalance,
    givenBitzSum: givenBitzSumSol,
    updateBitzBalance: updateBitzBalanceSol,
    updateGivenBitzSum: updateGivenBitzSumSol,
  } = useSolBitzStore();
  const {
    bitzBalance: mvxBitzBalance,
    givenBitzSum: givenBitzSumMvx,
    updateBitzBalance: updateBitzBalanceMvx,
    updateGivenBitzSum: updateGivenBitzSumMvx,
  } = useAccountStore();
  // const bitzBalance = defaultChain === "multiversx" ? mvxBitzBalance : solBitzBalance;
  const [bitBalanceOnChain, setBitBalanceOnChain] = useState<number>(0);

  // S: Cached Signature Store Items
  const solPreaccessNonce = useAccountStore((state: any) => state.solPreaccessNonce);
  const solPreaccessSignature = useAccountStore((state: any) => state.solPreaccessSignature);
  const solPreaccessTimestamp = useAccountStore((state: any) => state.solPreaccessTimestamp);
  const updateSolPreaccessNonce = useAccountStore((state: any) => state.updateSolPreaccessNonce);
  const updateSolPreaccessTimestamp = useAccountStore((state: any) => state.updateSolPreaccessTimestamp);
  const updateSolSignedPreaccess = useAccountStore((state: any) => state.updateSolSignedPreaccess);
  // E: Cached Signature Store Items

  useEffect(() => {
    if (addressMvx) {
      fetchGameDataNftsMvx();
    }
  }, [addressMvx]);

  useEffect(() => {
    if (gameDataNFT) {
      setBitBalanceOnChain(mvxBitzBalance);
    }
  }, [gameDataNFT, mvxBitzBalance]);

  useEffect(() => {
    if (publicKeySol) {
      setBitBalanceOnChain(solBitzBalance);
    }
  }, [publicKeySol, solBitzBalance]);

  useEffect(() => {
    // if we don't do the powerUpSuccessfullyDone and poweringUpInProgress check, this block gets triggered even after a success and bitzValToGift and minBitzValNeeded get reset
    if (!powerUpSuccessfullyDone && !poweringUpInProgress && giveBitzToWho && giveBitzToWho !== "" && giveBitzToCampaignId && giveBitzToCampaignId !== "") {
      if (isLikeMode) {
        setBitzValToGift(5);
        setMinBitzValNeeded(5);
      } else {
        if (bitBalanceOnChain > 5) {
          setBitzValToGift(5);
        } else {
          setBitzValToGift(bitBalanceOnChain);
        }
      }

      setGiftBitzWorkflow(true);
    }
  }, [giveBitzToWho, giveBitzToCampaignId, bitBalanceOnChain, powerUpSuccessfullyDone]);

  async function fetchGameDataNftsMvx() {
    const _gameDataNFT = await DataNft.createFromApi(GET_BITZ_TOKEN_MVX);
    setGameDataNFT(_gameDataNFT);
  }

  async function sendPowerUpSol() {
    setPoweringUpInProgress(true);

    try {
      const headersToSend: Record<string, any> = {
        "dmf-custom-give-bits": "1",
        "dmf-custom-give-bits-val": bitzValToGift,
        "dmf-custom-give-bits-to-who": giveBitzToWho,
        "dmf-custom-give-bits-to-campaign-id": giveBitzToCampaignId,
        "dmf-custom-sol-collection-id": solBitzNfts[0].grouping[0].group_value,
      };

      const keysToSend = [
        "dmf-custom-give-bits",
        "dmf-custom-give-bits-val",
        "dmf-custom-give-bits-to-who",
        "dmf-custom-give-bits-to-campaign-id",
        "dmf-custom-sol-collection-id",
      ];

      const viewDataArgs = {
        headers: headersToSend,
        fwdHeaderKeys: keysToSend,
      };

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

      const giveBitzGameResult = await viewDataWrapperSol(publicKeySol!, usedPreAccessNonce, usedPreAccessSignature, viewDataArgs, solBitzNfts[0].id);

      if (giveBitzGameResult) {
        if (giveBitzGameResult?.data?.statusCode && giveBitzGameResult?.data?.statusCode != 200) {
          toastClosableError("Error: Not possible to send power-up. Error code returned. Do you have enough BiTz to give?");
          setPoweringUpError(true);
        } else {
          // we can "locally" estimate and update the balance counts (no need to get it from the marshal as it will be synced when user reloads page or logs in/out or plays the get bitz game)
          updateBitzBalanceSol(bitBalanceOnChain - bitzValToGift); // current balance - what they donated
          updateGivenBitzSumSol(givenBitzSumSol + bitzValToGift); // given bits + what they donated

          setPowerUpSuccessfullyDone(true);
          showConfetti();
        }
      } else {
        toastClosableError("Error: Not possible to send power-up");
        setPoweringUpError(true);
      }
    } catch (err: any) {
      toastClosableError(`Error: Not possible to send power-up. ${err.toString()}`);
      setPoweringUpError(true);
    }

    setPoweringUpInProgress(false);
  }

  async function sendPowerUpMvx() {
    setPoweringUpInProgress(true);

    if (tokenLogin && gameDataNFT) {
      try {
        const viewDataArgs = {
          mvxNativeAuthOrigins: [decodeNativeAuthToken(tokenLogin.nativeAuthToken || "").origin],
          mvxNativeAuthMaxExpirySeconds: 3600,
          fwdHeaderMapLookup: {
            "authorization": `Bearer ${tokenLogin.nativeAuthToken}`,
            "dmf-custom-give-bits": "1",
            "dmf-custom-give-bits-val": bitzValToGift,
            "dmf-custom-give-bits-to-who": giveBitzToWho,
            "dmf-custom-give-bits-to-campaign-id": giveBitzToCampaignId,
          },
          fwdHeaderKeys: "authorization, dmf-custom-give-bits, dmf-custom-give-bits-val, dmf-custom-give-bits-to-who, dmf-custom-give-bits-to-campaign-id",
        };

        const giveBitzGameResult = await viewDataJSONCore(viewDataArgs, gameDataNFT);

        if (giveBitzGameResult) {
          if (giveBitzGameResult?.data?.statusCode && giveBitzGameResult?.data?.statusCode != 200) {
            toastClosableError("Error: Not possible to send power-up. Error code returned. Do you have enough BiTz to give?");
            setPoweringUpError(true);
          } else {
            // we can "locally" estimate and update the balance counts (no need to get it from the marshal as it will be synced when user reloads page or logs in/out or plays the get bitz game)
            updateBitzBalanceMvx(bitBalanceOnChain - bitzValToGift); // current balance - what they donated
            updateGivenBitzSumMvx(givenBitzSumMvx + bitzValToGift); // given bits + what they donated

            setPowerUpSuccessfullyDone(true);
            showConfetti();
          }
        } else {
          toastClosableError("Error: Not possible to send power-up");
          setPoweringUpError(true);
        }
      } catch (err: any) {
        toastClosableError(`Error: Not possible to send power-up. ${err.toString()}`);
        setPoweringUpError(true);
      }
    }

    setPoweringUpInProgress(false);
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
        triggerOpen={giftBitzWorkflow}
        triggerOnClose={() => {
          onCloseModal(powerUpSuccessfullyDone ? { bitzValToGift, giveBitzToCampaignId } : undefined);
          setGiftBitzWorkflow(false);
        }}
        closeOnOverlayClick={false}
        title={!isLikeMode ? "Power-Up This Creator With BiTz" : "Like This Album With 5 BiTz"}
        hasFilter={false}
        filterData={[]}
        modalClassName={""}
        titleClassName={"p-6 md:!p-4 !text-2xl md:!text-3xl"}>
        {
          <div
            className="bg1-cyan-900"
            style={{
              minHeight: "10rem",
            }}>
            <div className="bg1-cyan-200 flex flex-col gap-2 p-8">
              <div className="text-md mb-2">
                {" "}
                {isLikeMode ? (
                  <>
                    <span className="font-bold cursor-pointer" onClick={() => setShowDetails((prev) => !prev)}>
                      ℹ️ Why should you like albums?
                    </span>{" "}
                    {showDetails && (
                      <div>
                        Most liked albums get promoted and featured more on NF-Tunes and other social channels (this supports the Musician) and in return, you
                        can earn monthly badges that can earn you rewards. Learn more about the rewards program{" "}
                        <a href="https://docs.itheum.io/product-docs/product/ai-data-workforce/badges" target="_blank" className="text-blue-500">
                          here
                        </a>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <span className="font-bold cursor-pointer" onClick={() => setShowDetails((prev) => !prev)}>
                      ℹ️ Why should you power-up musicians?
                    </span>{" "}
                    {showDetails && (
                      <div>
                        Musicians with the most Bitz powering them will be featured more on NF-Tunes and other social channels and they will get monthly badges
                        that can earn them rewards (this supports the Musician) and in return, you can also earn monthly badges that can earn you rewards. Learn
                        more about the rewards program{" "}
                        <a href="https://docs.itheum.io/product-docs/product/ai-data-workforce/badges" target="_blank" className="text-blue-500">
                          here
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="bg1-green-200 flex flex-col md:flex-row md:items-center">
                <div className="bg1-blue-200">
                  <div
                    className="border-[0.5px] border-neutral-500/90 w-[150px] h-[150px] md:h-[150px] md:w-[150px] bg-no-repeat bg-cover rounded-xl"
                    style={{
                      "backgroundImage": `url(${creatorIcon})`,
                    }}></div>
                </div>
                <div className="bg1-blue-300 md:ml-5 mt-5 md:mt-0 text-xl font-bold">{creatorName}</div>
              </div>
              {!powerUpSuccessfullyDone && bitBalanceOnChain < minBitzValNeeded && (
                <>
                  {bitBalanceOnChain === -2 && (
                    <div className="mt-2">
                      ⚠️ Do you get your free BiTz XP Data NFT yet? You will need this for this action. To get a free one, click on the button below.
                    </div>
                  )}
                  {bitBalanceOnChain > -1 && bitBalanceOnChain < minBitzValNeeded && (
                    <div className="mt-2">⚠️ You don't have enough BiTz for this action. To play the BiTz game and get free XP, click on the button below.</div>
                  )}
                  <Link to={routeNames.getbitz} className="text-base hover:!no-underline hover:text-black">
                    <Button className="text-sm mt-2 cursor-pointer !text-orange-500 dark:!text-yellow-300" variant="secondary">
                      Get BiTz XP
                    </Button>
                  </Link>
                </>
              )}
              {(bitBalanceOnChain >= minBitzValNeeded || powerUpSuccessfullyDone) && (
                <>
                  <div className="mt-2 text-lg">
                    <div className="">Your BiTz Balance: {bitBalanceOnChain} BiTz</div>
                  </div>

                  {poweringUpError && (
                    <div className="h-[100px] text-lg mt-3">
                      <div>Error! Power-up not possible.</div>
                      <Button
                        className="text-sm mt-2 cursor-pointer !text-yellow-300"
                        variant="destructive"
                        onClick={() => {
                          onCloseModal(powerUpSuccessfullyDone ? { bitzValToGift, giveBitzToCampaignId } : undefined);
                          setGiftBitzWorkflow(false);
                        }}>
                        Close & Try Again
                      </Button>
                    </div>
                  )}

                  {powerUpSuccessfullyDone && (
                    <div className="h-[100px] text-lg mt-3">
                      <div>Success! thank you for supporting this creator.</div>
                      <Button
                        className="text-sm mt-2 cursor-pointer !text-orange-500 dark:!text-yellow-300"
                        variant="secondary"
                        onClick={() => {
                          onCloseModal(powerUpSuccessfullyDone ? { bitzValToGift, giveBitzToCampaignId } : undefined);
                          setGiftBitzWorkflow(false);
                        }}>
                        Close
                      </Button>
                    </div>
                  )}

                  {!powerUpSuccessfullyDone && !poweringUpError && (
                    <>
                      {!isLikeMode && (
                        <div className="">
                          <div className="">
                            <div className="flex flex-row gap-2 justify-center items-center">
                              <input
                                type="range"
                                id="rangeBitz"
                                min="1"
                                max={bitBalanceOnChain}
                                step="1"
                                value={bitzValToGift}
                                disabled={poweringUpInProgress}
                                onChange={(e) => setBitzValToGift(Number(e.target.value))}
                                className="accent-black dark:accent-white w-full cursor-pointer custom-range-slider"
                              />
                              <input
                                type="number"
                                min="1"
                                max={bitBalanceOnChain}
                                step="1"
                                value={bitzValToGift}
                                disabled={poweringUpInProgress}
                                onChange={(e) => setBitzValToGift(Math.min(Number(e.target.value), bitBalanceOnChain))}
                                className="bg-[#fde047]/30 focus:none focus:outline-none focus:border-transparent text-center border-[#35d9fa] rounded-md text-[2rem] p-2"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="">
                        <div className="">
                          <Button
                            disabled={bitBalanceOnChain < minBitzValNeeded || bitzValToGift < 1 || poweringUpInProgress}
                            className="!text-white text-lg bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-30% to-[#5D3899] to-95% cursor-pointer w-[200px] md:w-[300px] md:h-[50px]"
                            onClick={() => {
                              if (publicKeySol) {
                                sendPowerUpSol();
                              } else {
                                sendPowerUpMvx();
                              }
                            }}>
                            <span className="ml-2">
                              {poweringUpInProgress
                                ? "Sending, Please Wait..."
                                : !isLikeMode
                                  ? `Gift Creator ${bitzValToGift} BiTz`
                                  : `Like with ${bitzValToGift} BiTz`}
                            </span>
                          </Button>
                        </div>
                        <div className="bg1-blue-300 mt-5">
                          <div className="flex flex-col md:flex-row">
                            By gifting, you agree to our a
                            <br />
                            <a
                              className="!text-[#35d9fa] hover:underline ml-2 flex"
                              href="https://docs.itheum.io/product-docs/legal/ecosystem-tools-terms/bitz-xp/give-bitz"
                              target="blank">
                              Give BiTz terms of use <ExternalLinkIcon width={16} className="ml-2" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        }
      </Modal>
    </>
  );
};
