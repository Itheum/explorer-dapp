import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
// import { parse } from "gltfjsx";

type ModelProps = {
  data: any;
};

export function Model(props: ModelProps) {
  const { data } = props;

  const gltfLoader = new GLTFLoader();
  const dracoloader = new DRACOLoader();
  const test = dracoloader.setDecoderPath("https://bafkreiglctgeanpeacpwew5bhin2ldm4ifbot5n2kaufvllweddvcsd77u.ipfs.nftstorage.link/");
  gltfLoader.setDRACOLoader(dracoloader);

  console.log(test);
  // gltfLoader.load(url, (gltf) => {
  //   const jsx = parse(gltf, optionalConfig);
  // });

  // const nodes = parse("https://bafkreiglctgeanpeacpwew5bhin2ldm4ifbot5n2kaufvllweddvcsd77u.ipfs.nftstorage.link/");
  // console.log(data);
  // console.log(nodes);
  return (
    <>
      {/*<mesh castShadow receiveShadow geometry={nodes.mvx.geometry} material={nodes.mvx.material} />*/}
      <mesh castShadow receiveShadow />
    </>
  );
}
