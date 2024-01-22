import React from "react";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { NativeAuthConfigType } from "@multiversx/sdk-dapp/types";
import { useLocation } from "react-router-dom";
import { AuthRedirectWrapper, ExtensionLoginButton, WalletConnectLoginButton, WebWalletLoginButton, LedgerLoginButton } from "components";
import { walletConnectV2ProjectId } from "config";
import { getApi } from "libs/utils";
import { routeNames } from "routes";

// find a route name based on a pathname that comes in via React Router Link params
function getRouteNameBasedOnPathNameParam(pathname: string) {
  const matchPathnameToRouteName = Object.keys(routeNames).find((i: string) => {
    return (routeNames as any)[i] === pathname;
  });

  if (matchPathnameToRouteName && matchPathnameToRouteName !== "home") {
    // Note: if it's home route, better UX is to go the dashboard
    return (routeNames as any)[matchPathnameToRouteName];
  } else {
    return routeNames.home;
  }
}

const UnlockPage = () => {
  const location = useLocation();
  const { chainID } = useGetNetworkConfig();

  const nativeAuthProps: NativeAuthConfigType = {
    apiAddress: `https://${getApi(chainID)}`,
    expirySeconds: 3600,
  };
  const commonProps = {
    callbackRoute: getRouteNameBasedOnPathNameParam(location?.state?.from),
    nativeAuth: {
      ...nativeAuthProps,
    },
  };

  return (
    <div className="flex flex-auto items-center -z-1">
      <div className="m-auto" data-testid="unlockPage">
        <div className=" rounded-2xl my-4 text-center dark:bg-[#0a0a0a] bg-slate-100 drop-shadow-2xl">
          <div className=" py-10 px-5 px-sm-2 mx-lg-4">
            <h4 className="mb-4 font-weight-bold">Login</h4>

            <div className="flex flex-col min-w-[20rem] gap-4 px-3">
              <WalletConnectLoginButton
                className="w-full !m-0"
                loginButtonText="xPortal App"
                {...commonProps}
                {...(walletConnectV2ProjectId ? { isWalletConnectV2: true } : {})}
              />
              <ExtensionLoginButton className="w-full !m-0" loginButtonText="DeFi Wallet" {...commonProps} />
              <WebWalletLoginButton className="w-full !m-0" loginButtonText="Web Wallet" {...commonProps} />
              <LedgerLoginButton className="w-full !m-0" loginButtonText="Ledger" {...commonProps} />
              <WebWalletLoginButton
                loginButtonText={"Google (xAlias)"}
                className="w-full !m-0"
                customWalletAddress={import.meta.env.VITE_ENV_NETWORK === "mainnet" ? "https://xalias.com" : "https://devnet.xalias.com"}
                {...commonProps}></WebWalletLoginButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Unlock = () => (
  <AuthRedirectWrapper>
    <UnlockPage />
  </AuthRedirectWrapper>
);
