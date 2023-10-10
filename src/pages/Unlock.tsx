import React, { useEffect } from "react";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { NativeAuthConfigType } from "@multiversx/sdk-dapp/types";
import { useLocation } from "react-router-dom";
import {
  AuthRedirectWrapper,
  ExtensionLoginButton,
  LedgerLoginButton,
  OperaWalletLoginButton,
  WalletConnectLoginButton,
  WebWalletLoginButton,
} from "components";
import { walletConnectV2ProjectId } from "config";
import { getApi } from "libs/utils";
import { routeNames } from "routes";
import { useGetIsLoggedIn } from "../hooks";
import { useLocalStorageStore } from "../store/LocalStorageStore.ts";

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
  const isLoggedIn = useGetIsLoggedIn();
  const { appVersion } = useLocalStorageStore();

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("app-version", appVersion ?? "");
    }
  }, [appVersion]);

  const nativeAuthProps: NativeAuthConfigType = {
    apiAddress: `https://${getApi(chainID)}`,
    // origin: window.location.origin,
    expirySeconds: 3000,
  };
  const commonProps = {
    callbackRoute: getRouteNameBasedOnPathNameParam(location?.state?.from),
    nativeAuth: {
      ...nativeAuthProps,
    },
  };

  return (
    <div className="flex flex-auto items-center">
      <div className="m-auto" data-testid="unlockPage">
        <div className=" rounded-2xl my-4 text-center dark:bg-[#0a0a0a] bg-slate-100 drop-shadow-2xl">
          <div className=" py-5 px-2 px-sm-2 mx-lg-4">
            <h4 className="mb-4 font-weight-bold">Login</h4>

            <div className="d-flex flex-column" style={{ minWidth: "20rem", gap: "1rem" }}>
              <WalletConnectLoginButton loginButtonText="xPortal App" {...commonProps} {...(walletConnectV2ProjectId ? { isWalletConnectV2: true } : {})} />
              <ExtensionLoginButton loginButtonText="DeFi Wallet" {...commonProps} />

              <OperaWalletLoginButton loginButtonText="Opera Crypto Wallet" {...commonProps} />

              <WebWalletLoginButton loginButtonText="Web Wallet" {...commonProps} />
              <LedgerLoginButton loginButtonText="Ledger" className="test-class_name" {...commonProps} />
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
