import React from "react";
import { MvxSolSwitch } from "components/MvxSolSwitch";
import { useLocalStorageStore } from "store/LocalStorageStore.ts";
import { GetBitzMvx } from "./GetBitzMvx";
import GetBitzSol from "./GetBitzSol";

const GetBitz: React.FC<any> = (props) => {
  const { modalMode } = props;

  const defaultChain = useLocalStorageStore((state) => state.defaultChain);
  return (
    <div>
      <MvxSolSwitch />
      {defaultChain === "multiversx" ? <GetBitzMvx modalMode={modalMode} /> : <GetBitzSol modalMode={modalMode} />}
    </div>
  );
};

export default GetBitz;
