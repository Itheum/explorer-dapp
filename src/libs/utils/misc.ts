declare const window: {
  ITH_GLOBAL_MVX_RPC_API_SESSION: string;
} & Window;

window.ITH_GLOBAL_MVX_RPC_API_SESSION = "";

export const getMvxRpcApi = (chainID: string) => {
  if (window.ITH_GLOBAL_MVX_RPC_API_SESSION !== "") {
    console.log("ITH_GLOBAL_MVX_RPC_API_SESSION served from session ", window.ITH_GLOBAL_MVX_RPC_API_SESSION);
    return window.ITH_GLOBAL_MVX_RPC_API_SESSION;
  }

  const defaultUrl = chainID === "1" ? "api.multiversx.com" : "devnet-api.multiversx.com";

  // 10% of chance, default to the Public API
  const defaultToPublic = Math.random() < 0.1; // math random gives you close to even distribution from 0 - 1

  if (defaultToPublic) {
    window.ITH_GLOBAL_MVX_RPC_API_SESSION = defaultUrl;

    console.log("ITH_GLOBAL_MVX_RPC_API_SESSION defaulted based on chance to public ", window.ITH_GLOBAL_MVX_RPC_API_SESSION);
  } else {
    // else, we revert to original logic of using ENV variable
    const envKey = chainID === "1" ? "VITE_ENV_API_MAINNET_KEY" : "VITE_ENV_API_DEVNET_KEY";

    window.ITH_GLOBAL_MVX_RPC_API_SESSION = import.meta.env[envKey] || defaultUrl;
    console.log("ITH_GLOBAL_MVX_RPC_API_SESSION fetched rom ENV ", window.ITH_GLOBAL_MVX_RPC_API_SESSION);
  }

  return window.ITH_GLOBAL_MVX_RPC_API_SESSION;
};

export function shortenAddress(value: string, length: number = 6): string {
  return value.slice(0, length) + " ... " + value.slice(-length);
}

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

export const gtagGo = (category: string, action: any, label?: any, value?: any) => {
  /*
  e.g.
  Category: 'Videos', Action: 'Play', Label: 'Gone With the Wind'
  Category: 'Videos'; Action: 'Play - Mac Chrome'
  Category: 'Videos', Action: 'Video Load Time', Label: 'Gone With the Wind', Value: downloadTime

  // AUTH
  Category: 'Auth', Action: 'Login', Label: 'Metamask'
  Category: 'Auth', Action: 'Login - Success', Label: 'Metamask'
  Category: 'Auth', Action: 'Login', Label: 'DeFi'
  Category: 'Auth', Action: 'Login', Label: 'Ledger'
  Category: 'Auth', Action: 'Login', Label: 'xPortalApp'
  Category: 'Auth', Action: 'Login', Label: 'WebWallet'

  Category: 'Auth', Action: 'Logout', Label: 'WebWallet'
  */

  if (!action || !category) {
    console.error("gtag tracking needs both action and category");
    return;
  }

  const eventObj: Record<string, string> = {
    event_category: category,
  };

  if (label) {
    eventObj["event_label"] = label;
  }

  if (value) {
    eventObj["event_value"] = value;
  }

  // only track mainnet so we have good data on GA
  if (window.location.hostname !== "localhost" && import.meta.env.VITE_ENV_NETWORK === "mainnet") {
    (window as any).gtag("event", action, eventObj);
  }
};
