import React, { useEffect, useState } from "react";
import { useGetAccount } from "@multiversx/sdk-dapp/hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import { ExternalLinkIcon } from "lucide-react";
import { Modal } from "components/Modal/Modal";
import { Button } from "libComponents/Button";
import { useAccountStore } from "store/account";
import { useLocalStorageStore } from "store/LocalStorageStore.ts";
import useSolBitzStore from "store/solBitz";

type SendBitzPowerUpProps = {
  mvxNetworkSelected: boolean;
  givePowerConfig: { creatorIcon?: string | undefined; creatorName?: string | undefined; giveBitzToWho: string; giveBitzToCampaignId: string };
};

export const SendBitzPowerUp = (props: SendBitzPowerUpProps) => {
  const { mvxNetworkSelected, givePowerConfig } = props;
  const { creatorIcon, creatorName, giveBitzToWho, giveBitzToCampaignId } = givePowerConfig;
  const { publicKey } = useWallet();
  const { address: addressMvx } = useGetAccount();
  const defaultChain = useLocalStorageStore((state) => state.defaultChain);
  const [giftBitzWorkflow, setGiftBitzWorkflow] = useState<boolean>(false);
  const solBitzBalance = useSolBitzStore((state) => state.bitzBalance);
  const mvxBitzBalance = useAccountStore((state) => state.bitzBalance);
  const bitzBalance = defaultChain === "multiversx" ? mvxBitzBalance : solBitzBalance;
  const [bitzVal, setBitzVal] = useState<number>(0);

  useEffect(() => {
    if (giveBitzToWho && giveBitzToWho !== "" && giveBitzToCampaignId && giveBitzToCampaignId !== "") {
      if (bitzBalance > 5) {
        setBitzVal(5);
      } else {
        setBitzVal(bitzBalance);
      }
      setGiftBitzWorkflow(true);
    }
  }, [giveBitzToWho, giveBitzToCampaignId]);

  return (
    <>
      <Modal
        triggerOpen={giftBitzWorkflow}
        triggerOnClose={() => {
          setGiftBitzWorkflow(false);
        }}
        closeOnOverlayClick={false}
        title={"Power-Up A Creator with BiTz"}
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
                <div className="bg-1blue-200">
                  <div
                    className="border-[0.5px] border-neutral-500/90 h-[150px] md:h-[150px] md:w-[150px] bg-no-repeat bg-cover rounded-xl"
                    style={{
                      "backgroundImage": `url(${creatorIcon})`,
                    }}></div>
                </div>
                <div className="bg-1blue-300 ml-5 text-xl font-bold">{creatorName}</div>
              </div>

              <div className="bg-1green-300 mt-2 text-lg">
                <div className="bg-1blue-300">Your BiTz Balance: {bitzBalance} BiTz</div>
              </div>

              <div className="bg-1green-400">
                <div className="bg-1blue-200">
                  <div className="flex flex-row gap-2 justify-center items-center">
                    <input
                      type="range"
                      id="rangeBitz"
                      min="1"
                      max={bitzBalance}
                      step="1"
                      value={bitzVal}
                      onChange={(e) => setBitzVal(Number(e.target.value))}
                      className="accent-black dark:accent-white w-full cursor-pointer custom-range-slider"
                    />
                    <input
                      type="number"
                      min="1"
                      max={bitzBalance}
                      step="1"
                      value={bitzVal}
                      onChange={(e) => setBitzVal(Math.min(Number(e.target.value), bitzBalance))}
                      className="bg-[#35d9fa]/30 text- dark:text-[#35d9fa] focus:none focus:outline-none focus:border-transparent text-center border-[#35d9fa] rounded-md text-[2rem] p-2"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-1green-400">
                <div className="bg-1blue-300">
                  <Button
                    disabled={bitzVal > 4}
                    className="!text-white text-lg bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-30% to-[#5D3899] to-95% cursor-pointer"
                    onClick={() => {
                      alert("give");
                    }}>
                    <span className="ml-2">Submit</span>
                  </Button>
                </div>
                <div className="bg-1blue-300 mt-2">
                  <div className="flex">
                    By gifting, you agree to our <br />
                    <a
                      className="!text-[#35d9fa] hover:underline ml-2 flex"
                      href="https://docs.itheum.io/product-docs/legal/ecosystem-tools-terms/bitz-xp/give-bitz"
                      target="blank">
                      Give BiTz terms of use <ExternalLinkIcon width={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </Modal>
    </>
  );
};
