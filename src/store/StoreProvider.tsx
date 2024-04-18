import React, { PropsWithChildren, useEffect } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { GET_BITZ_TOKEN } from "appsConfig";
import { SUPPORTED_COLLECTIONS } from "config";
import { useGetAccount } from "hooks";
import { decodeNativeAuthToken } from "libs/utils";
import { computeRemainingCooldown } from "libs/utils/functions";
import { useAccountStore } from "./account";
import { useNftsStore } from "./nfts";
import { viewDataJSONCore } from "../pages/AppMarketplace/GetBitz";

export const StoreProvider = ({ children }: PropsWithChildren) => {
  const { address } = useGetAccount();
  const { tokenLogin } = useGetLoginInfo();

  // ACCOUNT STORE
  const updateBitzBalance = useAccountStore((state) => state.updateBitzBalance);
  const updateCooldown = useAccountStore((state) => state.updateCooldown);

  // NFT STORE
  const updateNfts = useNftsStore((state) => state.updateNfts);
  const nfts = useNftsStore((state) => state.nfts);

  useEffect(() => {
    async function fetchNfts() {
      if (!address || !(tokenLogin && tokenLogin.nativeAuthToken)) {
        updateNfts([]);
      } else {
        const collections = SUPPORTED_COLLECTIONS;
        const nftsT = await DataNft.ownedByAddress(address, collections);
        updateNfts(nftsT);
      }
    }
    fetchNfts();
  }, [address, tokenLogin]);

  useEffect(() => {
    if (!address || !(tokenLogin && tokenLogin.nativeAuthToken)) {
      return;
    }

    (async () => {
      // get the bitz game data nft details
      const bitzGameDataNFT = await DataNft.createFromApi(GET_BITZ_TOKEN);

      // does the logged in user actually OWN the bitz game data nft
      const _myDataNfts = nfts;
      const hasRequiredDataNFT = _myDataNfts.find((dNft) => bitzGameDataNFT.nonce === dNft.nonce && bitzGameDataNFT.collection === dNft.collection);
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
          updateCooldown(
            computeRemainingCooldown(
              getBitzGameResult.data.gamePlayResult.lastPlayedBeforeThisPlay,
              getBitzGameResult.data.gamePlayResult.configCanPlayEveryMSecs
            )
          );
        }
      } else {
        updateBitzBalance(-1);
        updateCooldown(-1);
      }
    })();
  }, [address, tokenLogin, nfts]);

  return <>{children}</>;
};
