import React, { useEffect } from "react";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { logout } from "@multiversx/sdk-dapp/utils/logout";
import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { AuthenticatedRoutesWrapper } from "components";
import { sleep } from "libs/utils/legacyUtil";
import { routes, routeNames } from "routes";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { search } = useLocation();
  const { isLoggedIn: isMxLoggedIn } = useGetLoginInfo();
  const appVersion = process.env.REACT_APP_VERSION;

  useEffect(() => {
    const handleAppVersioningLogin = async () => {
      await sleep(0.5);
      const localStorageAppVersion = localStorage.getItem("app-version");
      console.log(appVersion, localStorageAppVersion);
      const currentLocalStorageVersion = localStorageAppVersion;
      if (appVersion !== localStorageAppVersion) {
        if (isMxLoggedIn) {
          localStorage.setItem("app-version", appVersion || "");
          if (currentLocalStorageVersion !== null) {
            logout(undefined, undefined, false);
          }
        }
      }
    };
    handleAppVersioningLogin();
  }, [isMxLoggedIn]);

  return (
    <div className="flex flex-col flex-auto min-h-[100dvh]">
      <Navbar />
      <main className="flex flex-col flex-grow-1 2xl:mx-[20rem] xl:mx-[8rem] md:mx-[4rem] base:mx-[1.5rem]">
        <AuthenticatedRoutesWrapper routes={routes} unlockRoute={`${routeNames.unlock}${search}`}>
          {children}
        </AuthenticatedRoutesWrapper>
      </main>
      <Footer />
      <Toaster
        toastOptions={{
          // Default options for specific types
          error: {
            duration: 30000,
          },
        }}
      />
    </div>
  );
};
