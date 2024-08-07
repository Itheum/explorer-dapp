import React from "react";
import { MvxSolSwitch } from "components/MvxSolSwitch";
import { useLocalStorageStore } from "store/LocalStorageStore.ts";
import { GetBitzMvx } from "./GetBitzMvx";
import GetBitzSol from "./GetBitzSol";

const GetBitz: React.FC = () => {
  const defaultChain = useLocalStorageStore((state) => state.defaultChain);
  return (
    <div>
      <MvxSolSwitch />
      {defaultChain === "multiversx" ? <GetBitzMvx /> : <GetBitzSol />}
    </div>
  );
};

export default GetBitz;
