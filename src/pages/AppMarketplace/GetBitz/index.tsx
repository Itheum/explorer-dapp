import React from "react";
import { useGetAccount } from "@multiversx/sdk-dapp/hooks";
import HelmetPageMeta from "components/HelmetPageMeta";
import { GetBitzMvx } from "./GetBitzMvx";
import GetBitzSol from "./GetBitzSol";

const GetBitz: React.FC<any> = (props) => {
  const { modalMode } = props;
  const { address: addressMvx } = useGetAccount();

  return (
    <div className="relative">
      <HelmetPageMeta
        title="Itheum BiTz XP App"
        shortTitle="Itheum BiTz XP App"
        desc="Earn Itheum XP for playing a simple proof-of-activity game every few hours."
        shareImgUrl="https://explorer.itheum.io/socialshare/itheum_bitzxp_social_hero.png"
      />

      {/* Blurred background content */}
      <div className="blur-lg pointer-events-none select-none">{addressMvx ? <GetBitzMvx modalMode={modalMode} /> : <GetBitzSol modalMode={modalMode} />}</div>

      {/* Deprecation overlay */}
      <div className="absolute inset-0 flex items-start justify-center pt-8 px-4 pointer-events-none">
        <div className="bg-red-600/95 text-white p-6 rounded-lg shadow-2xl max-w-3xl pointer-events-auto border-2 border-red-400">
          <h3 className="!text-xl font-bold mb-3 !text-white">⚠️ End-Of-Support Notice</h3>
          <p className="text-base leading-relaxed">
            As this app reaches End-Of-Support (EOS) soon as part of the Itheum Aithra upgrade, BitZ XP on MultiversX is no longer supported. We have an option
            to migrate your XP to Solana where it can be used in ecosystem apps. Learn more here:{" "}
            <a
              href="https://docs.itheum.io/product-docs/itheum-aithra/sunsetting-earlier-versions-v0-v2"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-red-200 font-semibold">
              Migration Steps
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GetBitz;
