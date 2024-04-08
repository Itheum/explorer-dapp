import React, { PropsWithChildren, useEffect } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { GET_BITZ_TOKEN } from "appsConfig";
import { useGetAccount } from "hooks";
import { decodeNativeAuthToken } from "libs/utils";
import { useAccountStore } from "./account";
import { viewDataJSONCore } from "../pages/AppMarketplace/GetBitz";
import { computeRemainingCooldown } from "libs/utils/functions";

export const StoreProvider = ({ children }: PropsWithChildren) => {
  const { address } = useGetAccount();
  const { tokenLogin } = useGetLoginInfo();

  // ACCOUNT STORE
  const updateBitzBalance = useAccountStore((state) => state.updateBitzBalance);
  const updateCooldown = useAccountStore((state) => state.updateCooldown);
  const updateGivenBitzSum = useAccountStore((state) => state.updateGivenBitzSum);

  useEffect(() => {
    if (!address || !(tokenLogin && tokenLogin.nativeAuthToken)) {
      return;
    }

    (async () => {
      // get the bitz game data nft details
      const bitzGameDataNFT = await DataNft.createFromApi(GET_BITZ_TOKEN);

      // does the logged in user actually OWN the bitz game data nft
      const _myDataNfts = await DataNft.ownedByAddress(address);
      const hasRequiredDataNFT = _myDataNfts.find((dNft) => bitzGameDataNFT.nonce === dNft.nonce);
      const hasGameDataNFT = hasRequiredDataNFT ? true : false;

      // only get the bitz balance if the user owns the token
      if (hasGameDataNFT) {
        const viewDataArgs = {
          mvxNativeAuthOrigins: [decodeNativeAuthToken(tokenLogin.nativeAuthToken || "").origin],
          mvxNativeAuthMaxExpirySeconds: 3600,
          fwdHeaderMapLookup: {
            "authorization": `Bearer ${tokenLogin.nativeAuthToken}`,
            "dmf-custom-only-state": "1",
          },
          fwdHeaderKeys: "authorization, dmf-custom-only-state",
        };

        const getBitzGameResult = await viewDataJSONCore(viewDataArgs, bitzGameDataNFT);

        if (getBitzGameResult) {
          updateBitzBalance(getBitzGameResult.data.gamePlayResult.bitsScoreBeforePlay);
          updateGivenBitzSum(getBitzGameResult.data.bitsMain.bitsGivenSum);
          updateCooldown(
            computeRemainingCooldown(
              getBitzGameResult.data.gamePlayResult.lastPlayedBeforeThisPlay,
              getBitzGameResult.data.gamePlayResult.configCanPlayEveryMSecs
            )
          );
        }
      } else {
        updateBitzBalance(-1);
        updateGivenBitzSum(-1);
        updateCooldown(-1);
      }
    })();
  }, [address, tokenLogin]);

  return <>{children}</>;
};
