import React from "react";
import {
  AuthRedirectWrapper,
  ExtensionLoginButton,
  LedgerLoginButton,
  OperaWalletLoginButton,
  WalletConnectLoginButton,
  WebWalletLoginButton,
} from "components";
import { routeNames } from "routes";

const UnlockPage = () => {
  const commonProps = {
    callbackRoute: routeNames.dashboard,
    nativeAuth: true, // optional
  };

  return (
    <div className="home d-flex flex-fill align-items-center">
      <div className="m-auto" data-testid="unlockPage">
        <div className="card my-4 text-center">
          <div className="card-body py-5 px-2 px-sm-2 mx-lg-4">
            <h4 className="mb-4 font-title font-weight-bold">Login</h4>

            <div
              className="d-flex flex-column"
              style={{ minWidth: "20rem", gap: "1rem" }}
            >
              <WalletConnectLoginButton
                loginButtonText="xPortal App"
                {...commonProps}
              />
              <ExtensionLoginButton
                loginButtonText="Browser Wallet"
                {...commonProps}
              />

              <OperaWalletLoginButton
                loginButtonText="Opera Crypto Wallet"
                {...commonProps}
              />

              <WebWalletLoginButton
                loginButtonText="Web Wallet"
                {...commonProps}
              />
              <LedgerLoginButton
                loginButtonText="Ledger"
                className="test-class_name"
                {...commonProps}
              />
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
