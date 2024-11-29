import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import { SOL_ENV_ENUM } from "config";
import { BlobDataType } from "libs/types";
import { getApiDataMarshal } from "libs/utils";

export async function itheumSolPreaccess() {
  const chainId = import.meta.env.VITE_ENV_NETWORK === "devnet" ? SOL_ENV_ENUM.devnet : SOL_ENV_ENUM.mainnet;
  const preaccessUrl = `${getApiDataMarshal(chainId)}/preaccess?chainId=${chainId}`;
  const response = await fetch(preaccessUrl);
  const data = await response.json();
  return data.nonce;
}

export async function viewDataViaMarshalSol(
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
  const chainId = import.meta.env.VITE_ENV_NETWORK === "devnet" ? SOL_ENV_ENUM.devnet : SOL_ENV_ENUM.mainnet;
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
  const response = await viewDataViaMarshalSol(assetId, nonce, signature, address, import.meta.env.VITE_ENV_NETWORK);
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

// Any method that wants to open a data nft via the marshal, can call this wrapper with viewDataArgs and tokenId
export async function viewDataWrapperSol(publicKeySol: PublicKey, usedPreAccessNonce: string, usedPreAccessSignature: string, viewDataArgs: any, tokenId: any) {
  try {
    if (!publicKeySol) {
      throw new Error("Missing data for viewData");
    }

    const res = await viewDataViaMarshalSol(
      tokenId,
      usedPreAccessNonce,
      usedPreAccessSignature,
      publicKeySol,
      viewDataArgs.fwdHeaderKeys,
      viewDataArgs.headers
    );

    let blobDataType = BlobDataType.TEXT;
    let data;

    if (res.ok) {
      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      return { data, blobDataType, contentType };
    } else {
      console.log("viewData threw catch error");
      console.error(res.statusText);

      return undefined;
    }
  } catch (err) {
    return undefined;
  }
}
