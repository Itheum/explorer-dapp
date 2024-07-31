export function shortenAddress(value: string, length: number = 6): string {
  return value.slice(0, length) + " ... " + value.slice(-length);
}

export const getApi = (chainID: string) => {
  const envKey = chainID === "1" ? "VITE_ENV_API_MAINNET_KEY" : "VITE_ENV_API_DEVNET_KEY";
  const defaultUrl = chainID === "1" ? "api.multiversx.com" : "devnet-api.multiversx.com";

  return import.meta.env[envKey] || defaultUrl;
};

const unescape = (str: string) => {
  return str.replace(/-/g, "+").replace(/_/g, "/");
};

const decodeValue = (str: string) => {
  return Buffer.from(unescape(str), "base64").toString("utf8");
};

export const decodeNativeAuthToken = (accessToken: string) => {
  const tokenComponents = accessToken.split(".");
  if (tokenComponents.length !== 3) {
    throw new Error("Native Auth Token has invalid length");
  }

  const [address, body, signature] = accessToken.split(".");
  const parsedAddress = decodeValue(address);
  const parsedBody = decodeValue(body);
  const bodyComponents = parsedBody.split(".");
  if (bodyComponents.length !== 4) {
    throw new Error("Native Auth Token Body has invalid length");
  }

  const [origin, blockHash, ttl, extraInfo] = bodyComponents;

  let parsedExtraInfo;
  try {
    parsedExtraInfo = JSON.parse(decodeValue(extraInfo));
  } catch {
    throw new Error("Extra Info INvalid");
  }

  const parsedOrigin = decodeValue(origin);

  const result = {
    ttl: Number(ttl),
    origin: parsedOrigin,
    address: parsedAddress,
    extraInfo: parsedExtraInfo,
    signature,
    blockHash,
    body: parsedBody,
  };

  // if empty object, delete extraInfo ('e30' = encoded '{}')
  if (extraInfo === "e30") {
    delete result.extraInfo;
  }

  return result;
};

export const getApiDataMarshal = (chainID: string) => {
  const envKey = chainID.includes("1") ? "VITE_ENV_DATAMARSHAL_MAINNET_API" : "VITE_ENV_DATAMARSHAL_DEVNET_API";
  const defaultUrl = chainID.includes("1")
    ? "https://api.itheumcloud.com/datamarshalapi/router/v1"
    : "https://api.itheumcloud-stg.com/datamarshalapi/router/v1";
  return import.meta.env[envKey] || defaultUrl;
};

export const sleep = (sec: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, sec * 1000);
  });
};

export const getApiWeb2Apps = (chainID?: string) => {
  // we can call this without chainID (e.g. solana mode or no login mode), and we get the API endpoint based on ENV
  if (!chainID) {
    if (import.meta.env.VITE_ENV_NETWORK === "mainnet") {
      return "https://api.itheumcloud.com";
    } else {
      return "https://api.itheumcloud-stg.com";
    }
  }

  const envKey = chainID === "1" ? "VITE_ENV_WEB2_APPS_MAINNET_API" : "VITE_ENV_WEB2_APPS_DEVNET_API";
  const defaultUrl = chainID === "1" ? "https://api.itheumcloud.com" : "https://api.itheumcloud-stg.com";

  return import.meta.env[envKey] || defaultUrl;
};

export const getApiSolNft = () => {
  if (import.meta.env.VITE_ENV_NETWORK === "mainnet") {
    return "https://bitzxp.itheum.io/api";
  } else {
    return "https://test.bitzxp.itheum.io/api";
  }
};

export const isMostLikelyMobile = () => {
  return window?.screen?.width <= 450;
};
