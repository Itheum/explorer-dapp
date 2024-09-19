import React, { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSearchParams } from "react-router-dom";
import solLogo from "assets/img/solana-sol-logo.png";
import { useGetAccountInfo } from "hooks";
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
    <>
      <div className="my-5 mx-3">
        <p className="items-center cursor-pointer my-2 text-sm opacity-50">This app works on multiple chains:</p>
        <label className="inline-flex items-center cursor-pointer">
          <div className="me-3 text-xl font-medium text-gray-900 dark:text-gray-300 flex">
            <svg className="mt-[1px]" width="25" height="25" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M158.482 149.928L228.714 112.529L216.919 90L152.575 115.854C150.923 116.523 149.077 116.523 147.425 115.854L83.0814 90L71.25 112.602L141.482 150L71.25 187.398L83.0814 210L147.425 183.948C149.077 183.279 150.923 183.279 152.575 183.948L216.919 209.874L228.75 187.272L158.482 149.928Z"
                fill="#23F7DD"></path>
            </svg>

            <p className="ml-1">MultiversX</p>
          </div>
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

          <div className="ms-3 text-xl font-medium text-gray-900 dark:text-gray-300 flex">
            <img src={solLogo} className="mt-[4px] w-[20px] h-[20px]" />
            <p className="ml-2">Solana</p>
          </div>
        </label>
      </div>
    </>
  );
}
