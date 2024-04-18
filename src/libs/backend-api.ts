import { Offer } from "@itheum/sdk-mx-data-nft/out";
import axios from "axios";
import { TrendingNft } from "./types";
import { uxConfig } from "./utils/constant";

export const backendApi = (chainID: string) => {
  const envKey = chainID === "1" ? "VITE_ENV_BACKEND_MAINNET_API" : "VITE_ENV_BACKEND_API";
  const defaultUrl = chainID === "1" ? "https://production-itheum-api.up.railway.app" : "https://staging-itheum-api.up.railway.app";

  return import.meta.env[envKey] || defaultUrl;
};

export async function getHealthCheckFromBackendApi(chainID: string): Promise<boolean> {
  try {
    const url = `${backendApi(chainID)}/health-check`;
    const { data } = await axios.get<string>(url, {
      timeout: uxConfig.mxAPITimeoutMs,
    });

    return data == "OK";
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getTrendingFromBackendApi(chainID: string): Promise<TrendingNft[]> {
  try {
    const url = `${backendApi(chainID)}/trending`;
    const { data } = await axios.get<TrendingNft[]>(url, {
      timeout: uxConfig.mxAPITimeoutMs,
    });
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
export async function getRecentOffersFromBackendApi(chainID: string): Promise<Offer[]> {
  try {
    const url = `${backendApi(chainID)}/offers/recent`;
    const { data } = await axios.get<Offer[]>(url, {
      timeout: uxConfig.mxAPITimeoutMs,
    });

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
