import React from "react";
import { useGetAccount } from "@multiversx/sdk-dapp/hooks";
import HelmetPageMeta from "components/HelmetPageMeta";
import { GetBitzMvx } from "./GetBitzMvx";
import GetBitzSol from "./GetBitzSol";

const GetBitz: React.FC<any> = (props) => {
  const { modalMode } = props;
  const { address: addressMvx } = useGetAccount();

  return (
    <div>
      <HelmetPageMeta
        title="Itheum BiTz XP App"
        shortTitle="Itheum BiTz XP App"
        desc="Earn Itheum XP for playing a simple proof-of-activity game every few hours."
        shareImgUrl="https://explorer.itheum.io/socialshare/itheum_bitzxp_social_hero.png"
      />

      {addressMvx ? <GetBitzMvx modalMode={modalMode} /> : <GetBitzSol modalMode={modalMode} />}
    </div>
  );
};

export default GetBitz;
