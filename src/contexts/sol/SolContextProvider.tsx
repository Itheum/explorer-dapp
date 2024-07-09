import { FC, ReactNode, useCallback, useMemo } from "react";
import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { SolAutoConnectProvider, useSolAutoConnect } from "./SolAutoConnectProvider";
import { SolNetworkConfigurationProvider, useNetworkConfiguration } from "./SolNetworkConfigurationProvider";
import "@solana/wallet-adapter-react-ui/styles.css";
// import { notify } from "../utils/notifications";

const SolWalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { autoConnect } = useSolAutoConnect();
  const { networkConfiguration } = useNetworkConfiguration();
  const network = networkConfiguration as WalletAdapterNetwork;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => [], [network]);

  const onError = useCallback((error: WalletError) => {
    // notify({
    //   type: "error",
    //   message: error.message ? `${error.name}: ${error.message}` : error.name,
    // });
    console.error(error);
  }, []);

  return (
    // TODO: updates needed for updating and referencing endpoint: wallet adapter rework
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={autoConnect}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const SolContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <SolNetworkConfigurationProvider>
        <SolAutoConnectProvider>
          <SolWalletContextProvider>{children}</SolWalletContextProvider>
        </SolAutoConnectProvider>
      </SolNetworkConfigurationProvider>
    </>
  );
};
