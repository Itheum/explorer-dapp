import React, { PropsWithChildren, useEffect } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { GET_BITS_TOKEN } from "appsConfig";
import { useGetAccount } from "hooks";
import { decodeNativeAuthToken } from "libs/utils";
import { useAccountStore } from "./account";
import { viewDataJSONCore } from "../pages/AppMarketplace/GetBits";

export const StoreProvider = ({ children }: PropsWithChildren) => {
  const { address } = useGetAccount();
  const { tokenLogin } = useGetLoginInfo();

  // ACCOUNT STORE
  const updateBitsBalance = useAccountStore((state) => state.updateBitsBalance);

  useEffect(() => {
    if (!address || !(tokenLogin && tokenLogin.nativeAuthToken)) {
      return;
    }

    (async () => {
      // get the bits game data nft details
      const bitsGameDataNFT = await DataNft.createFromApi(GET_BITS_TOKEN);

      // does the logged in user actually OWN the bits game data nft
      const _myDataNfts = await DataNft.ownedByAddress(address);
      const hasRequiredDataNFT = _myDataNfts.find((dNft) => bitsGameDataNFT.nonce === dNft.nonce);
      const hasGameDataNFT = hasRequiredDataNFT ? true : false;

      // only get the bits balance if the user owns the token
      if (hasGameDataNFT) {
        console.log("info: user OWNs the bits score data nft, so get balance");

        const viewDataArgs = {
          mvxNativeAuthOrigins: [decodeNativeAuthToken(tokenLogin.nativeAuthToken || "").origin],
          mvxNativeAuthMaxExpirySeconds: 3600,
          fwdHeaderMapLookup: {
            "authorization": `Bearer ${tokenLogin.nativeAuthToken}`,
            "dmf-custom-only-state": "1",
          },
          fwdHeaderKeys: "authorization, dmf-custom-only-state",
        };

        const getBitsGameResult = await viewDataJSONCore(viewDataArgs, bitsGameDataNFT);

        if (getBitsGameResult) {
          updateBitsBalance(getBitsGameResult.data.gamePlayResult.bitsScoreBeforePlay);
        }
      } else {
        console.log("info: user does NOT OWN the bits score data nft");
        updateBitsBalance(-1);
      }
    })();
  }, [address, tokenLogin]);

  return <>{children}</>;
};
