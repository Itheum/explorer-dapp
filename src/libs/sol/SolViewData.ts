import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import { getApiDataMarshal } from "libs/utils";

export enum SolEnvEnum {
  devnet = "SD",
  mainnet = "S1",
}

export async function itheumSolPreaccess() {
  const chainId = import.meta.env.VITE_ENV_NETWORK === "devnet" ? SolEnvEnum.devnet : SolEnvEnum.mainnet;
  const preaccessUrl = `${getApiDataMarshal(chainId)}/preaccess?chainId=${chainId}`;
  const response = await fetch(preaccessUrl);
  const data = await response.json();
  return data.nonce;
}

export async function itheumSolViewData(
  assetId: string,
  nonce: string,
  signature: string,
  address: PublicKey,
  fwdHeaderKeys?: string[],
  headers?: any,
  streamInLine?: boolean,
  nestedIdxToStream?: number,
  cacheDurationSeconds?: number
): Promise<Response> {
  const chainId = import.meta.env.VITE_ENV_NETWORK === "devnet" ? SolEnvEnum.devnet : SolEnvEnum.mainnet;
  let accessUrl = `${getApiDataMarshal(chainId)}/access?nonce=${nonce}&NFTId=${assetId}&signature=${signature}&chainId=${chainId}&accessRequesterAddr=${address.toBase58()}`;
  if (streamInLine) {
    accessUrl += `&streamInLine=1`;
  }
  if (nestedIdxToStream !== undefined) {
    accessUrl += `&nestedIdxToStream=${nestedIdxToStream}`;
  }
  if (fwdHeaderKeys && fwdHeaderKeys.length > 0) {
    accessUrl += `&fwdHeaderKeys=${fwdHeaderKeys.join(",")}`;
  }
  if (cacheDurationSeconds && cacheDurationSeconds > 0) {
    accessUrl += `&cacheDurationSeconds=${cacheDurationSeconds}`;
  }
  const response = await fetch(accessUrl, { headers });
  return response;
}

export async function itheumSolViewDataInNewTab(assetId: string, nonce: string, signature: string, address: PublicKey) {
  const response = await itheumSolViewData(assetId, nonce, signature, address, import.meta.env.VITE_ENV_NETWORK);
  const data = await response.blob();
  const url = window.URL.createObjectURL(data);
  window.open(url, "_blank");
}

/*
This method will get the Solana Data Marshal access nonce and Signature
from local app cache (so we don't have to keep asking for a signature)
or if the cache is not suitable, then get a fresh nonce and sig and cache it again
*/
export async function getOrCacheAccessNonceAndSignature({
  solPreaccessNonce,
  solPreaccessSignature,
  solPreaccessTimestamp,
  signMessage,
  publicKey,
  updateSolPreaccessNonce,
  updateSolSignedPreaccess,
  updateSolPreaccessTimestamp,
}: {
  solPreaccessNonce: string;
  solPreaccessSignature: string;
  solPreaccessTimestamp: number;
  signMessage: any;
  publicKey: any;
  updateSolPreaccessNonce: any;
  updateSolSignedPreaccess: any;
  updateSolPreaccessTimestamp: any;
}) {
  let usedPreAccessNonce = solPreaccessNonce;
  let usedPreAccessSignature = solPreaccessSignature;

  // Marshal Access lasts for 30 Mins. We cache it for this amount of time
  const minsMarshalAllowsForNonceCaching = 20;

  if (solPreaccessSignature === "" || solPreaccessTimestamp === -2 || solPreaccessTimestamp + minsMarshalAllowsForNonceCaching * 60 * 1000 < Date.now()) {
    const preAccessNonce = await itheumSolPreaccess();
    const message = new TextEncoder().encode(preAccessNonce);

    if (signMessage === undefined) {
      throw new Error("signMessage is undefined");
    }

    const signature = await signMessage(message);

    if (!preAccessNonce || !signature || !publicKey) {
      throw new Error("Missing data for viewData");
    }

    const encodedSignature = bs58.encode(signature);

    updateSolPreaccessNonce(preAccessNonce);
    updateSolSignedPreaccess(encodedSignature);
    updateSolPreaccessTimestamp(Date.now()); // in MS

    usedPreAccessNonce = preAccessNonce;
    usedPreAccessSignature = encodedSignature;

    console.log("------> Access NOT FROM Cache");
  } else {
    console.log("------> Access FROM Cache");
  }

  return {
    usedPreAccessNonce,
    usedPreAccessSignature,
  };
}
