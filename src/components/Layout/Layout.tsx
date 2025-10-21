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
      {/* EOS Alert Banner */}
      <div className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 py-3 px-4 text-center sticky top-0 z-[10000]">
        <p className="text-white text-base md:text-xl font-medium">
          ⚠️ Itheum announces an upgraded roadmap and product suite as part of <strong>Itheum Aithra</strong>. <br /> This app is set to reach{" "}
          <strong>End-Of-Support (EOS)</strong> soon as part of this upgrade.{" "}
          <a
            href="https://docs.itheum.io/product-docs/itheum-aithra/sunsetting-earlier-versions-v0-v2"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold text-white hover:text-orange-100">
            Learn what you need to do →
          </a>
        </p>
      </div>
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
