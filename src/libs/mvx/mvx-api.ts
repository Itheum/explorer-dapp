import { NftType } from "@multiversx/sdk-dapp/types/tokens.types";
import axios, { AxiosError } from "axios";
import { apiTimeout } from "config";

export const axoisConfig = {
  timeout: apiTimeout
};

export async function getNftsByCollectionFromApi(
  apiAddress: string,
  address: string,
  collection_id: string
): Promise<NftType[]> {
  const configUrl = `${apiAddress}/accounts/${address}/nfts?size=200&collections=${collection_id}`;

  try {
    const { data } = await axios.get<NftType[]>(configUrl, axoisConfig);

    return data;
  } catch (err) {
    const message = 'getNftsByCollectionFromApi failed:' + (err as AxiosError).message;
    console.error(message);
  }

  return [];
}

export async function getNftCountByCollectionFromApi(
  apiAddress: string,
  address: string,
  collection_id: string
): Promise<number> {
  const configUrl = `${apiAddress}/accounts/${address}/nfts/count?search=${collection_id}`;

  try {
    const { data } = await axios.get<number>(configUrl, axoisConfig);

    return data;
  } catch (err) {
    const message = 'getNftCountByCollectionFromApi failed:' + (err as AxiosError).message;
    console.error(message);
  }

  return 0;
}
