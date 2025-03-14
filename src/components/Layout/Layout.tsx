import React from "react";
import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { AuthenticatedRoutesWrapper } from "components";
import { routes, routeNames } from "routes";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { search } = useLocation();

  return (
    <div className="flex flex-col flex-auto min-h-[100dvh]">
      <Navbar />
      <main className="flex flex-col flex-auto xl:mx-[8rem] md:mx-[4rem] base:mx-[1.5rem min-h-[80dvh] px-4 md:px-0">
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
