import React, { useEffect, useState } from "react";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { useGetAccount, useGetPendingTransactions } from "hooks";
import { Address, Transaction } from "@multiversx/sdk-core/out";
import { sendTransactions } from "@multiversx/sdk-dapp/services";
import { refreshAccount } from "@multiversx/sdk-dapp/utils/account";
// import { useGetAccountInfo, useGetLoginInfo } from "@multiversx/sdk-dapp/hooks/account";

import { DataNftMinter } from "@itheum/sdk-mx-data-nft";

const dataNftMinter = new DataNftMinter("devnet");

const REACT_APP_ENV_NFT_STORAGE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEFiZGVCMDhhZmREOEM0ZjJhRUFiQzhFNDVFMzA4ZjNjQjFjZTE0NTMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4NDgxMjk1MTgwOCwibmFtZSI6ImRhdGEtZGV4LWRldiJ9.0Mu_tMqTJxT4dALwFGBvW9LnOwcFLcAVuFb6iWm6OaQ";

export const MintNewCollection = () => {
  const { address } = useGetAccount();
  const { loginMethod, tokenLogin } = useGetLoginInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();

  const [sdkResponses, setSdkResponses] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [antiSpamTax, setAntiSpamTax] = useState<number | undefined>(-1);

  async function _viewMinterRequirements() {
    setLoading(true);
    setSdkResponses(null);
    // View minter smart contract requirements
    const requirements = await dataNftMinter.viewMinterRequirements(new Address(address));
    setSdkResponses(`Minter pause state is : ${JSON.stringify(requirements)}`);
    setLoading(false);
  }

  async function _viewLatestAntiSpamTax() {
    setLoading(true);
    setSdkResponses(null);
    // View minter smart contract requirements
    const requirements = await dataNftMinter.viewMinterRequirements(new Address(address));
    setAntiSpamTax(requirements?.antiSpamTaxValue);
    setSdkResponses(`Anti Spam TAX is : ${requirements?.antiSpamTaxValue}`);
    setLoading(false);
  }

  async function _viewContractPauseState() {
    setLoading(true);
    setSdkResponses(null);
    // View contract pause state
    const result = await dataNftMinter.viewContractPauseState();
    setSdkResponses(`Minter pause state is : ${result}`);
    setLoading(false);
  }

  async function _mintStandard() {
    setLoading(true);
    setSdkResponses(null);

    try {
      const mintTransaction: Transaction = await dataNftMinter.mint(
        new Address(address),
        "HELLOWORLDSDK1",
        "https://api.itheumcloud-stg.com/datamarshalapi/achilles/v1",
        "https://api.itheumcloud-stg.com/datadexapi/bespoke/dynamicSecureDataStreamDemo",
        "https://raw.githubusercontent.com/Itheum/data-assets/main/Misc/M1__FBI_Firearm_Background_Check_Data/pdf/preview.pdf",
        15,
        1000,
        "Hello World SDK Mint 1",
        "Hello World SDK Mint 1 Description",
        antiSpamTax || 0,
        {
          nftStorageToken: REACT_APP_ENV_NFT_STORAGE_KEY,
        }
      );

      await refreshAccount();

      const { sessionId, error } = await sendTransactions({
        transactions: mintTransaction,
        transactionsDisplayInfo: {
          processingMessage: "Minting Data NFT",
          errorMessage: "Data NFT minting error",
          successMessage: "Data NFT minted successfully",
        },
        redirectAfterSign: false,
      });

      console.log("mintTransaction", mintTransaction);
      console.log("sessionId", sessionId);
      console.log("error", error);

      setSdkResponses(`Mint session ID is : ${sessionId}`);
    } catch (e) {
      setSdkResponses(`_mintStandard has FAILED - see console for error`);
      console.log("_mintStandard has FAILED");
      console.error(e);
    }
    setLoading(false);
  }

  function reloadInitialState() {
    setAntiSpamTax(-1);
    setSdkResponses(null);
  }

  // if (tokenLogin) {
  //   console.log("tokenLogin.nativeAuthToken");
  //   console.log(tokenLogin?.nativeAuthToken);
  // }

  return (
    <div className="container d-flex flex-fill justify-content-center py-4 c-marketplace-app">
      <div className="row w-100">
        <div className="col-12 mx-auto">
          <h1 className="app-title">Using SDK to Mint Data NFT Collections</h1>

          <div className="body">
            <div className="p-2">Wallet Used to Login: {loginMethod}</div>
            <div className="p-2">Your Address (Data Creator): {address}</div>
            <div className="p-2">Your Native Auth Session: {tokenLogin?.nativeAuthToken || "N/A"}</div>

            <div className="p-2">
              Check if Minter Contract is Paused:{" "}
              <button className="btn btn-outline-primary" onClick={_viewContractPauseState}>
                Check
              </button>
            </div>
            <div className="p-2">
              Get Minter Contract requirements for Creator:{" "}
              <button className="btn btn-outline-primary" onClick={_viewMinterRequirements}>
                Get
              </button>
            </div>
            <div className="p-2">
              Find current Anti Spam TAX:{" "}
              <button className="btn btn-outline-primary" onClick={_viewLatestAntiSpamTax}>
                Get
              </button>
            </div>
            <div className="p-2">
              Mint a new Standard Data NFT Collection (Anti Spam Tax is {antiSpamTax}):{" "}
              <button className="btn btn-outline-primary" disabled={antiSpamTax === -1} onClick={_mintStandard}>
                Mint Standard
              </button>
            </div>

            <br />

            <div className="p-2">
              <div>SDK Responses</div>
              <button className="btn btn-outline-primary" onClick={reloadInitialState}>
                Clear All
              </button>
              <div>Has pending transactions? {hasPendingTransactions}</div>
              {(loading && <div>Loading...</div>) || <div>{sdkResponses}</div>}
            </div>
          </div>
          <div className="footer"></div>
        </div>
      </div>
    </div>
  );
};
