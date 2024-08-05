import { EnvironmentsEnum } from "libs/types";

export const computeRemainingCooldown = (startTime: number, cooldown: number) => {
  const timePassedFromLastPlay = Date.now() - startTime;
  const _cooldown = cooldown - timePassedFromLastPlay;

  return _cooldown > 0 ? _cooldown + Date.now() : 0;
};

export function shortenAddress(value: string, length: number = 6): string {
  return value.slice(0, length) + " ... " + value.slice(-length);
}

export const getApiDataMarshal = (networkMode: string) => {
  const envKey = networkMode === EnvironmentsEnum.mainnet ? "NEXT_PUBLIC_DATAMARSHAL_MAINNET_API" : "NEXT_PUBLIC_DATAMARSHAL_DEVNET_API";
  const defaultUrl =
    networkMode === EnvironmentsEnum.mainnet
      ? "https://api.itheumcloud.com/datamarshalapi/router/v1"
      : "https://api.itheumcloud-stg.com/datamarshalapi/router/v1";
  return process.env[envKey] || defaultUrl;
};
export const sleep = (sec: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, sec * 1000);
  });
};

export const getApiWeb2Apps = (networkMode: string) => {
  const envKey = networkMode === EnvironmentsEnum.mainnet ? "NEXT_PUBLIC_WEB2_APPS_MAINNET_API" : "NEXT_PUBLIC_WEB2_APPS_DEVNET_API";
  const defaultUrl = networkMode === EnvironmentsEnum.mainnet ? "https://api.itheumcloud.com" : "https://api.itheumcloud-stg.com";

  return process.env[envKey] || defaultUrl;
};

export enum BlobDataType {
  TEXT,
  IMAGE,
  AUDIO,
  SVG,
  PDF,
  VIDEO,
}

export interface ViewDataReturnType {
  data: any;
  contentType: string;
  error?: string;
}

export interface ExtendedViewDataReturnType extends ViewDataReturnType {
  blobDataType: BlobDataType;
}

export const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);

  if (section) {
    window.scrollTo({
      top: section.offsetTop,
      behavior: "smooth",
    });
  }
};
