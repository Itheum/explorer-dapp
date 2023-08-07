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
    <div className="d-flex flex-column flex-fill wrapper">
      <Navbar />
      <main className="d-flex flex-column flex-grow-1">
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
