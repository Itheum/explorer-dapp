import React, { useEffect, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { useGetAccount, useGetLoginInfo, useGetPendingTransactions } from "@multiversx/sdk-dapp/hooks";
import BigNumber from "bignumber.js";
import { Chart as ChartJS, Legend, LinearScale, PointElement, Tooltip } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { ESDT_BUBBLE_TOKENS } from "appsConfig";
import { DataNftCard, Loader } from "components";
import { decodeNativeAuthToken, toastError } from "libs/utils";
import { HeaderComponent } from "../components/Layout/HeaderComponent";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, zoomPlugin);

export const ChartDescription = () => (
  <div className="d-flex justify-content-center">
    <div className="d-flex flex-row align-items-center">
      <div className="d-flex justify-content-center align-items-center p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: "1rem",
            height: "1rem",
            marginRight: "0.25rem",
          }}>
          <circle cx=".5rem" cy=".5rem" r=".5rem" fill="#f00" />
        </svg>
        <span>{"> 1%"}</span>
      </div>
      <div className="d-flex justify-content-center align-items-center p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: "1rem",
            height: "1rem",
            marginRight: "0.25rem",
          }}>
          <circle cx=".5rem" cy=".5rem" r=".5rem" fill="#0f0" />
        </svg>
        <span>{"> 0.1%"}</span>
      </div>
      <div className="d-flex justify-content-center align-items-center p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: "1rem",
            height: "1rem",
            marginRight: "0.25rem",
          }}>
          <circle cx=".5rem" cy=".5rem" r=".5rem" fill="#00f" />
        </svg>
        <span>{"> 0.01%"}</span>
      </div>
      <div className="d-flex justify-content-center align-items-center p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: "1rem",
            height: "1rem",
            marginRight: "0.25rem",
          }}>
          <circle cx=".5rem" cy=".5rem" r=".5rem" fill="#f0f" />
        </svg>
        <span>{"< 0.01%"}</span>
      </div>
    </div>
  </div>
);

export const EsdtBubble = () => {
  const { address } = useGetAccount();
  const { tokenLogin } = useGetLoginInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();

  const [dataNfts, setDataNfts] = useState<DataNft[]>([]);
  const [flags, setFlags] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchDataNfts() {
    setIsLoading(true);

    if (ESDT_BUBBLE_TOKENS.length > 0) {
      const _nfts: DataNft[] = await DataNft.createManyFromApi(
        ESDT_BUBBLE_TOKENS.map((v) => ({
          nonce: v.nonce,
          tokenIdentifier: v.tokenIdentifier,
        }))
      );
      setDataNfts(_nfts);
      setIsLoading(false);
    } else {
      toastError("No identifier for this Widget.");
      setIsLoading(false);
    }
  }

  async function fetchMyNfts() {
    const _dataNfts = await DataNft.ownedByAddress(address);

    const _flags = [];
    for (const cnft of dataNfts) {
      const matches = _dataNfts.filter((mnft) => cnft.nonce === mnft.nonce);
      _flags.push(matches.length > 0);
    }
    setFlags(_flags);
  }

  useEffect(() => {
    if (!hasPendingTransactions) {
      fetchDataNfts();
    }
  }, [hasPendingTransactions]);

  useEffect(() => {
    if (!isLoading && address) {
      fetchMyNfts();
    }
  }, [isLoading, address]);

  async function viewData(index: number) {
    if (!(index >= 0 && index < dataNfts.length)) {
      toastError("Data is not loaded");
      return;
    }

    const _owned = flags[index];

    if (_owned) {
      const dataNft = dataNfts[index];

      let res: any;
      if (!(tokenLogin && tokenLogin.nativeAuthToken)) {
        throw Error("No nativeAuth token");
      }

      const arg = {
        mvxNativeAuthOrigins: [decodeNativeAuthToken(tokenLogin.nativeAuthToken).origin],
        mvxNativeAuthMaxExpirySeconds: 3600,
        fwdHeaderMapLookup: {
          "authorization": `Bearer ${tokenLogin.nativeAuthToken}`,
        },
      };
      console.log("arg", arg);

      res = await dataNft.viewDataViaMVXNativeAuth(arg);
      res.data = await (res.data as Blob).text();
      res.data = JSON.parse(res.data);
      console.log("res", res);

      processData(res.data);
    }
  }

  function processData(rawData: any[]) {
    let sum = new BigNumber(0);
    rawData.forEach((row) => (sum = sum.plus(row["balance"])));
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <HeaderComponent pageTitle={"ESDT Bubbles"} hasImage={false} pageSubtitle={"ESDT Bubbles NFTs"} dataNftCount={dataNfts.length}>
      {dataNfts.length > 0 ? (
        dataNfts.map((dataNft, index) => (
          <DataNftCard key={index} index={index} dataNft={dataNft} isLoading={isLoading} owned={flags[index]} viewData={viewData} />
        ))
      ) : (
        <h3 className="text-center text-white">No DataNFT</h3>
      )}
    </HeaderComponent>
  );
};
