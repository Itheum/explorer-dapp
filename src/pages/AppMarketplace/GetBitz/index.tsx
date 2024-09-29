import React from "react";
import HelmetPageMeta from "components/HelmetPageMeta";
import { MvxSolSwitch } from "components/MvxSolSwitch";
import { useLocalStorageStore } from "store/LocalStorageStore.ts";
import { GetBitzMvx } from "./GetBitzMvx";
import GetBitzSol from "./GetBitzSol";

const GetBitz: React.FC<any> = (props) => {
  const { modalMode } = props;
  const defaultChain = useLocalStorageStore((state) => state.defaultChain);

  return (
    <div>
      <HelmetPageMeta
        title="Itheum BiTz XP App"
        shortTitle="Itheum BiTz XP App"
        desc="Earn Itheum XP for playing a simple proof-of-activity game every few hours."
        shareImgUrl="https://explorer.itheum.io/socialshare/itheum_bitzxp_social_hero.png"
      />

      <MvxSolSwitch />
      {defaultChain === "multiversx" ? <GetBitzMvx modalMode={modalMode} /> : <GetBitzSol modalMode={modalMode} />}
    </div>
  );
};

export default GetBitz;
