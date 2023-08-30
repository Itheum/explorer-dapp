import React from "react";
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
    return routeNames.dashboard;
  }
}

const UnlockPage = () => {
  const location = useLocation();

  const commonProps = {
    callbackRoute: getRouteNameBasedOnPathNameParam(location?.state?.from),
    nativeAuth: {
      apiAddress: "https://devnet-api.multiversx.com",
      expirySeconds: 300,
      origin: "http://localhost:3000",
    },
  };

  return (
    <div className="home d-flex flex-fill align-items-center c-unlock">
      <div className="m-auto" data-testid="unlockPage">
        <div className="card my-4 text-center">
          <div className="card-body py-5 px-2 px-sm-2 mx-lg-4">
            <h4 className="mb-4 font-title font-weight-bold login-title">Login</h4>

            <div className="d-flex flex-column" style={{ minWidth: "20rem", gap: "1rem" }}>
              <WalletConnectLoginButton loginButtonText="xPortal App" {...commonProps} {...(walletConnectV2ProjectId ? { isWalletConnectV2: true } : {})} />
              <ExtensionLoginButton loginButtonText="Browser Wallet" {...commonProps} />

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
