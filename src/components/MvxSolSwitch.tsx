import { useWallet } from "@solana/wallet-adapter-react";
import { useGetAccountInfo } from "hooks";
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLocalStorageStore } from "store/LocalStorageStore.ts";

export function MvxSolSwitch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { address: mvxAddress } = useGetAccountInfo();
  const { publicKey } = useWallet();
  const defaultChain = useLocalStorageStore((state) => state.defaultChain);
  const setDefaultChain = useLocalStorageStore((state) => state.setDefaultChain);

  function handleChainChange() {
    setDefaultChain(defaultChain === "solana" ? "multiversx" : "solana");
  }

  useEffect(() => {
    const chainParam = searchParams.get("chain");
    if (chainParam === "solana") {
      setDefaultChain("solana");
    } else if (chainParam === "multiversx") {
      setDefaultChain("multiversx");
    } else {
      if (mvxAddress && !publicKey) {
        setDefaultChain("multiversx");
      } else {
        setDefaultChain("solana");
      }
    }
  }, []);

  return (
    <label className="inline-flex items-center cursor-pointer m-3">
      <span className="me-3 text-xl font-medium text-gray-900 dark:text-gray-300">MultiversX</span>
      <input
        type="checkbox"
        checked={defaultChain === "solana" ? true : false}
        value=""
        className="sr-only peer"
        onChange={() => {
          handleChainChange();
        }}
      />
      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      <span className="ms-3 text-xl font-medium text-gray-900 dark:text-gray-300">Solana</span>
    </label>
  );
}
