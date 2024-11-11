import { FC, ReactNode } from "react";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { NotificationModal } from "@multiversx/sdk-dapp/UI/NotificationModal/NotificationModal";
import { SignTransactionsModals } from "@multiversx/sdk-dapp/UI/SignTransactionsModals/SignTransactionsModals";
import { TransactionsToastList } from "@multiversx/sdk-dapp/UI/TransactionsToastList/TransactionsToastList";
import { DappProvider } from "@multiversx/sdk-dapp/wrappers/DappProvider/DappProvider";
import { ELROND_NETWORK, apiTimeout, walletConnectV2ProjectId } from "config";
import { getMvxRpcApi } from "libs/utils";

export const MvxContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const {
    network: { chainId: chainID },
  } = useGetNetworkConfig();

  return (
    <>
      <DappProvider
        environment={ELROND_NETWORK}
        customNetworkConfig={{
          name: "itheumExplorer",
          apiTimeout,
          walletConnectV2ProjectId,
          apiAddress: `https://${getMvxRpcApi(chainID)}`,
        }}
        dappConfig={{
          shouldUseWebViewProvider: true,
        }}>
        <TransactionsToastList />
        <NotificationModal />
        <SignTransactionsModals className="custom-class-for-modals" />
        {children}
      </DappProvider>
    </>
  );
};
