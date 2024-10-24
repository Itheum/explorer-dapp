import React, { useEffect } from "react";
import { useGetAccount, useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { NativeAuthConfigType } from "@multiversx/sdk-dapp/types";
import { logout } from "@multiversx/sdk-dapp/utils/logout";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import axios from "axios";
import { ArrowBigLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthRedirectWrapper, ExtensionLoginButton, WalletConnectLoginButton, WebWalletLoginButton, LedgerLoginButton } from "components";
import { walletConnectV2ProjectId } from "config";
import { SOL_ENV_ENUM, MVX_ENV_ENUM } from "config";
import { Button } from "libComponents/Button";
import { getApi, getApiWeb2Apps } from "libs/utils";

// import { routeNames } from "routes";

// // find a route name based on a pathname that comes in via React Router Link params
// function getRouteNameBasedOnPathNameParam(pathname: string) {
//   const matchPathnameToRouteName = Object.keys(routeNames).find((i: string) => {
//     return (routeNames as any)[i] === pathname;
//   });

//   if (matchPathnameToRouteName && matchPathnameToRouteName !== "home") {
//     // Note: if it's home route, better UX is to go the dashboard
//     return (routeNames as any)[matchPathnameToRouteName];
//   } else {
//     return routeNames.home;
//   }
// }

/* 
we use global vars here so we can maintain this state across routing back and forth to this unlock page
these vars are used to detect a "new login", i.e a logged out user logged in. we can use this to enable
"user accounts" type activity, i.e. check if its a new user or returning user etc
*/
let solGotConnected = false;
let mvxGotConnected = false;

const UnlockPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { chainID } = useGetNetworkConfig();
  const { address: addressMvx } = useGetAccount();
  const isLoggedInMvX = !!addressMvx;
  const { publicKey } = useWallet();
  const addressSol = publicKey?.toBase58();
  const { pathname } = useLocation();

  const nativeAuthProps: NativeAuthConfigType = {
    apiAddress: `https://${getApi(chainID)}`,
    expirySeconds: 3600,
  };

  const commonProps = {
    nativeAuth: {
      ...nativeAuthProps,
    },
    callbackRoute: pathname,
  };

  useEffect(() => {
    console.log("==== effect for addressSol. addressSol = ", addressSol);

    if (!addressSol) {
      solGotConnected = false;
    } else {
      if (!solGotConnected) {
        // the user came to the unlock page without a solana connection and then connected a wallet,
        // ... i.e a non-logged in user, just logged in using SOL
        console.log("==== User JUST logged in with addressSol = ", addressSol);

        const chainId = import.meta.env.VITE_ENV_NETWORK === "devnet" ? SOL_ENV_ENUM.devnet : SOL_ENV_ENUM.mainnet;
        logUserLoggedInInUserAccounts(addressSol, chainId);
      }

      solGotConnected = true;
    }
  }, [addressSol]);

  useEffect(() => {
    console.log("==== effect for addressMvx. addressMvx = ", addressMvx);

    if (!addressMvx) {
      mvxGotConnected = false;
    } else {
      if (!mvxGotConnected) {
        // the user came to the unlock page without a mvx connection and then connected a wallet,
        // ... i.e a non-logged in user, just logged in using MVX
        console.log("==== User JUST logged in with addressMvx = ", addressMvx);

        const chainId = import.meta.env.VITE_ENV_NETWORK === "devnet" ? MVX_ENV_ENUM.devnet : MVX_ENV_ENUM.mainnet;
        logUserLoggedInInUserAccounts(addressMvx, chainId, true);
      }

      mvxGotConnected = true;
    }
  }, [addressMvx]);

  const handleLogout = () => {
    logout(location.pathname, undefined, false);
  };

  const handleGoBack = () => {
    navigate(location.state?.from || "/");
    // navigate(-1); // This will take the user back to the previous page
  };

  const logUserLoggedInInUserAccounts = async (addr: string, chainId: string, isMvx?: boolean) => {
    try {
      const callRes = await axios.post(`${getApiWeb2Apps()}/datadexapi/userAccounts/userLoggedIn`, {
        addr,
        chainId,
      });

      const userLoggedInCallData = callRes.data;

      if (userLoggedInCallData?.error) {
        console.error("User account login call failed");
      } else {
        const celebrateEmojis = ["🥳", "🎊", "🍾", "🥂", "🍻", "🍾"];

        if (userLoggedInCallData?.newUserAccountCreated) {
          toast.success("Welcome New User! Its Great To Have You Here.", {
            position: "top-center",
            duration: 6000,
            icon: celebrateEmojis[Math.floor(Math.random() * celebrateEmojis.length)],
          });
        } else if (userLoggedInCallData?.existingUserAccountLastLoginUpdated) {
          let userMessage = "";

          if (isMvx) {
            userMessage = "Welcome Back MultiversX Champion!";
          } else {
            userMessage = "Welcome Back Solana Legend!";
          }

          toast.success(userMessage, {
            position: "top-center",
            duration: 6000,
            icon: celebrateEmojis[Math.floor(Math.random() * celebrateEmojis.length)],
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-auto items-center -z-1">
      <div className="m-auto" data-testid="unlockPage">
        <div className=" rounded-2xl my-4 text-center dark:bg-[#0a0a0a] bg-slate-100 drop-shadow-2xl">
          <Button
            className="mt-4" // Add your styling here
            onClick={handleGoBack}>
            <ArrowBigLeft /> Go Back
          </Button>
          <div className="pt-10 pb-5 px-5 px-sm-2 mx-lg-4">
            <h4 className="mb-4 font-weight-bold">MultiversX</h4>
            <div className="flex flex-col min-w-[20rem] gap-4 px-3 items-center">
              {isLoggedInMvX ? (
                <div className="w-full flex bg-gradient-to-r from-yellow-300 to-orange-500 p-[1px] px-[2px] rounded-lg justify-center items-center w-full">
                  <Button
                    className="w-full dark:bg-[#0f0f0f] bg-slate-50 dark:text-white hover:dark:bg-transparent/10 hover:bg-transparent border-0 rounded-md font-medium tracking-wide !text-lg"
                    variant="outline"
                    onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <WalletConnectLoginButton
                    className="w-full !m-0"
                    loginButtonText="xPortal App"
                    {...commonProps}
                    {...(walletConnectV2ProjectId ? { isWalletConnectV2: true } : {})}
                  />
                  <ExtensionLoginButton className="w-full !m-0" loginButtonText="DeFi Wallet" {...commonProps} />
                  <WebWalletLoginButton className="w-full !m-0" loginButtonText="Web Wallet" {...commonProps} />
                  <LedgerLoginButton className="w-full !m-0" loginButtonText="Ledger" {...commonProps} />
                </>
              )}
            </div>
          </div>
          <div className="pb-10 pt-5 px-5 px-sm-2 mx-lg-4">
            <h4 className="mb-4 font-weight-bold">Solana</h4>

            <div className="flex flex-col min-w-[20rem] gap-4 px-3 items-center">
              <WalletMultiButton className="w-full !m-0" />
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
