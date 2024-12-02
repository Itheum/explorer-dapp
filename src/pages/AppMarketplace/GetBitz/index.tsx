import React from "react";
import HelmetPageMeta from "components/HelmetPageMeta";
// import { MvxSolSwitch } from "components/MvxSolSwitch";
// import { useLocalStorageStore } from "store/LocalStorageStore.ts";
import { GetBitzMvx } from "./GetBitzMvx";
import GetBitzSol from "./GetBitzSol";
import { useGetAccount, useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { useWallet } from "@solana/wallet-adapter-react";

const GetBitz: React.FC<any> = (props) => {
  const { modalMode } = props;
  // const defaultChain = useLocalStorageStore((state) => state.defaultChain);
  const { address: addressMvx } = useGetAccount();
  const { publicKey: publicKeySol } = useWallet();

  return (
    <div>
      <HelmetPageMeta
        title="Itheum BiTz XP App"
        shortTitle="Itheum BiTz XP App"
        desc="Earn Itheum XP for playing a simple proof-of-activity game every few hours."
        shareImgUrl="https://explorer.itheum.io/socialshare/itheum_bitzxp_social_hero.png"
      />

      {/* <MvxSolSwitch /> */}
      {/* {defaultChain === "multiversx" ? <GetBitzMvx modalMode={modalMode} /> : <GetBitzSol modalMode={modalMode} />} */}

      {addressMvx ? <GetBitzMvx modalMode={modalMode} /> : <GetBitzSol modalMode={modalMode} />}
    </div>
  );
};

export default GetBitz;
