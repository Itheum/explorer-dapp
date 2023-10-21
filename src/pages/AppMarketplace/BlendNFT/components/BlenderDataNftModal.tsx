import React from "react";
import { Canvas } from "@react-three/fiber";
import { Model } from "./Model";

type BlenderDataNftModalProps = {
  owned: boolean;
  isFetchingDataMarshal?: boolean;
  data: any;
};

export const BlenderDataNftModal: React.FC<BlenderDataNftModalProps> = (props) => {
  const { owned, isFetchingDataMarshal, data } = props;

  return (
    <>
      <Canvas>
        <Model data={data} />
      </Canvas>
    </>
  );
};
