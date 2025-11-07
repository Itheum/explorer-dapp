import React from "react";
import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { AuthenticatedRoutesWrapper } from "components";
import { routes, routeNames } from "routes";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { search } = useLocation();

  // Check for bypass query parameter
  const searchParams = new URLSearchParams(search);
  const bypassAlert = searchParams.get("bypassAlert") === "1";

  const content = (
    <>
      <Navbar />
      <main className="flex flex-col flex-auto xl:mx-[8rem] md:mx-[4rem] base:mx-[1.5rem min-h-[80dvh] px-4 md:px-0">
        <AuthenticatedRoutesWrapper routes={routes} unlockRoute={`${routeNames.unlock}${search}`}>
          {children}
        </AuthenticatedRoutesWrapper>
      </main>
      <Footer />
    </>
  );

  return (
    <div className="flex flex-col flex-auto min-h-[100dvh] relative">
      {bypassAlert ? (
        // Normal content when bypass is enabled
        content
      ) : (
        <>
          {/* Blurred background content - entire site */}
          <div className="blur-lg pointer-events-none select-none">{content}</div>

          {/* Full-page deprecation overlay - positioned at top */}
          <div className="absolute inset-0 flex items-start justify-center pt-8 px-4 pointer-events-none z-[10000]">
            <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white p-8 rounded-lg shadow-2xl max-w-4xl pointer-events-auto border-4 border-orange-400">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">⚠️ End-Of-Support Notice</h2>
              <p className="text-base md:text-lg leading-relaxed text-center">
                Itheum announces an upgraded roadmap and product suite as part of <strong>Itheum Aithra</strong>. This app is set to reach{" "}
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
          </div>
        </>
      )}

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
