import React, { Suspense, useEffect, useState } from "react";
import { Loader } from "../../../../components";

type ArcadeModalProps = {
  data: Record<any, any>;
  owned: boolean;
  isFetchingDataMarshal: boolean;
};

export const ArcadeModal: React.FC<ArcadeModalProps> = (props) => {
  const { data, owned, isFetchingDataMarshal } = props;
  const [iframeSrc, setIframeSrc] = useState<string>("");

  useEffect(() => {
    if (data) {
      setIframeSrc(data[0].file);
    }
  }, [isFetchingDataMarshal]);

  return (
    <>
      {!owned ? (
        <div className="flex flex-col items-center justify-center">
          <h4 className="mt-3 font-title">You do not own this Data NFT</h4>
          <h6>(Buy the Data NFT from the marketplace to unlock the data)</h6>
        </div>
      ) : isFetchingDataMarshal || !data ? (
        <div className="flex flex-col items-center justify-center min-w-[24rem] max-w-[100%] min-h-[40rem] max-h-[80svh]">
          <div>
            <Loader noText />
            <p className="text-center font-weight-bold">Loading...</p>
          </div>
        </div>
      ) : (
        <iframe src={iframeSrc} height="800" className="w-full rounded-bl-xl" />
      )}
    </>
  );
};
