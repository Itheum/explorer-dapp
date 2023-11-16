export function shortenAddress(value: string, length: number = 6): string {
  return value.slice(0, length) + " ... " + value.slice(-length);
}

export const getApi = (chainID: string) => {
  const envKey = chainID === "1" ? "REACT_APP_ENV_API_MAINNET_KEY" : "REACT_APP_ENV_API_DEVNET_KEY";
  const defaultUrl = chainID === "1" ? "api.multiversx.com" : "devnet-api.multiversx.com";

  return process.env[envKey] || defaultUrl;
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
