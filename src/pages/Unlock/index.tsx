import React, { useState, useEffect } from "react";
import { useGetAccount, useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { NativeAuthConfigType } from "@multiversx/sdk-dapp/types";
import { logout } from "@multiversx/sdk-dapp/utils/logout";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import axios from "axios";
import { ArrowBigLeft } from "lucide-react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthRedirectWrapper, ExtensionLoginButton, WalletConnectLoginButton, WebWalletLoginButton, LedgerLoginButton } from "components";
import { walletConnectV2ProjectId } from "config";
import { SOL_ENV_ENUM, MVX_ENV_ENUM } from "config";
import { Button } from "libComponents/Button";
import { getMvxRpcApi, getApiWeb2Apps } from "libs/utils";
import { useAccountStore } from "store/account";

/* 
we use global vars here so we can maintain this state across routing back and forth to this unlock page
these vars are used to detect a "new login", i.e a logged out user logged in. we can use this to enable
"user accounts" type activity, i.e. check if its a new user or returning user etc
*/
let solGotConnected = false;
let mvxGotConnected = false;

const loggingInMsgs = ["Logging you in", "Taking you to Web3", "Plugging you in", "Letting you in the backdoor"];

const UnlockPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    network: { chainId: chainID },
  } = useGetNetworkConfig();
  const { address: addressMvx } = useGetAccount();
  const isLoggedInMvX = !!addressMvx;
  const { publicKey: publicKeySol, signMessage } = useWallet();
  const addressSol = publicKeySol?.toBase58();
  const { pathname } = useLocation();
  const [userAccountLoggingIn, setIsUserAccountLoggingIn] = useState<boolean>(false);

  const nativeAuthProps: NativeAuthConfigType = {
    apiAddress: `https://${getMvxRpcApi(chainID)}`,
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
        setIsUserAccountLoggingIn(true);

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
        setIsUserAccountLoggingIn(true);

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
        let isTriggerFreeGift = ""; // should we trigger the "free gift" for new users?
        const celebrateEmojis = ["🥳", "🎊", "🍾", "🥂", "🍻", "🍾"];

        if (userLoggedInCallData?.newUserAccountCreated) {
          toast.success("Welcome New User! Its Great To Have You Here.", {
            position: "bottom-center",
            duration: 6000,
            icon: celebrateEmojis[Math.floor(Math.random() * celebrateEmojis.length)],
          });

          isTriggerFreeGift = "g=1";
        } else if (userLoggedInCallData?.existingUserAccountLastLoginUpdated) {
          let userMessage = "";

          if (isMvx) {
            userMessage = "Welcome Back MultiversX Champion!";
          } else {
            userMessage = "Welcome Back Solana Legend!";
          }

          toast.success(userMessage, {
            position: "bottom-center",
            duration: 6000,
            icon: celebrateEmojis[Math.floor(Math.random() * celebrateEmojis.length)],
          });
        }

        // where can we send them back?
        let fromWhere = location.state?.from || "/";

        if (fromWhere.includes("?")) {
          if (isTriggerFreeGift !== "") {
            isTriggerFreeGift = `&${isTriggerFreeGift}`;
          }

          fromWhere = `${fromWhere}${isTriggerFreeGift}`;
        } else {
          if (isTriggerFreeGift !== "") {
            isTriggerFreeGift = `?${isTriggerFreeGift}`;
          }

          fromWhere = `${fromWhere}${isTriggerFreeGift}`;
        }

        // login was a success, so we take them back to where they were if possible
        navigate(fromWhere);
      }
    } catch (e) {
      console.error(e);
    }

    setIsUserAccountLoggingIn(false);
  };

  const loggingInMsg = loggingInMsgs[Math.floor(Math.random() * loggingInMsgs.length)] + "...";

  return (
    <div className="flex flex-auto items-center -z-1]">
      <div className="m-auto" data-testid="unlockPage">
        <div className="rounded-2xl my-4 text-center dark:bg-[#0a0a0a] bg-slate-100 drop-shadow-2xl">
          {userAccountLoggingIn ? (
            <div className="p-20 flex flex-col items-center mb-[300px] mt-[100px]">
              <Loader2 className="animate-spin" />
              <p className="mt-2">{loggingInMsg}</p>
            </div>
          ) : (
            <>
              <Button
                className="mt-4" // Add your styling here
                onClick={handleGoBack}>
                <ArrowBigLeft /> Go Back
              </Button>
              <div className="pt-10 px-5 px-sm-2 mx-lg-4">
                <h4 className="mb-4 font-weight-bold">Solana</h4>

                <div className="flex flex-col min-w-[20rem] gap-4 px-3 items-center">
                  <WalletMultiButton className="w-full !m-0" />
                </div>
              </div>
              <div className="pt-10 pb-10 px-5 px-sm-2 mx-lg-4">
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
            </>
          )}
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
