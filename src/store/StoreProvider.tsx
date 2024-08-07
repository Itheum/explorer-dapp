import React, { PropsWithChildren, useEffect, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import { GET_BITZ_TOKEN } from "appsConfig";
import { SUPPORTED_MVX_COLLECTIONS, SUPPORTED_SOL_COLLECTIONS } from "config";
import { useGetAccount } from "hooks";
import { decodeNativeAuthToken, getApiSolNft } from "libs/utils";
import { computeRemainingCooldown } from "libs/utils/functions";
import { useAccountStore } from "./account";
import { useNftsStore } from "./nfts";
import { viewDataJSONCore } from "../pages/AppMarketplace/GetBitz";

export const StoreProvider = ({ children }: PropsWithChildren) => {
  const { address } = useGetAccount();
  const { tokenLogin } = useGetLoginInfo();

  const { publicKey } = useWallet();
  const addressSol = publicKey?.toBase58();
  const isLoggedInSol = !!addressSol;

  // flag to check locally if we got the MVX NFTs
  const [mvxNFTsFetched, setMvxNFTsFetched] = useState<boolean>(false);

  // ACCOUNT STORE
  const updateBitzBalance = useAccountStore((state) => state.updateBitzBalance);
  const updateCooldown = useAccountStore((state) => state.updateCooldown);
  const updateGivenBitzSum = useAccountStore((state) => state.updateGivenBitzSum);
  const updateCollectedBitzSum = useAccountStore((state) => state.updateCollectedBitzSum);
  const updateBonusBitzSum = useAccountStore((state) => state.updateBonusBitzSum);
  const updateBonusTries = useAccountStore((state) => state.updateBonusTries);

  // NFT STORE
  const { mvxNfts, updateMvxNfts, updateIsLoadingMvx, solNfts, updateSolNfts, updateIsLoadingSol } = useNftsStore();

  useEffect(() => {
    async function fetchMvxNfts() {
      updateIsLoadingMvx(true);
      if (!address || !(tokenLogin && tokenLogin.nativeAuthToken)) {
        updateMvxNfts([]);
      } else {
        const collections = SUPPORTED_MVX_COLLECTIONS;
        const nftsT = await DataNft.ownedByAddress(address, collections);
        updateMvxNfts(nftsT);
      }
      updateIsLoadingMvx(false);
      setMvxNFTsFetched(true);
    }
    fetchMvxNfts();
  }, [address, tokenLogin]);

  useEffect(() => {
    async function fetchSolNfts() {
      updateIsLoadingSol(true);
      if (!addressSol) {
        updateSolNfts([]);
      } else {
        const resp = await fetch(`${getApiSolNft()}/fetchNfts?publicKeyb58=${addressSol}`);
        const data = await resp.json();
        updateSolNfts(data.nfts);
      }
      updateIsLoadingSol(false);
    }
    fetchSolNfts();
  }, [publicKey]);

  useEffect(() => {
    (async () => {
      if (!address || !(tokenLogin && tokenLogin.nativeAuthToken)) {
        return;
      }

      const nativeAuthTokenData = decodeNativeAuthToken(tokenLogin.nativeAuthToken);

      if (nativeAuthTokenData.extraInfo.timestamp) {
        const currentTime = new Date().getTime();
        if (currentTime > (nativeAuthTokenData.extraInfo.timestamp + nativeAuthTokenData.ttl) * 1000) {
          return;
        }
      }

      // add all the balances into the loading phase
      updateBitzBalance(-2);
      updateGivenBitzSum(-2);
      updateCooldown(-2);
      updateCollectedBitzSum(-2);
      updateBonusBitzSum(-2);

      if (mvxNFTsFetched && mvxNfts.length > 0) {
        // get the bitz game data nft details
        const bitzGameDataNFT = await DataNft.createFromApi(GET_BITZ_TOKEN);

        // does the logged in user actually OWN the bitz game data nft
        const _myDataNfts = mvxNfts;
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
            let sumScoreBitz = getBitzGameResult.data.gamePlayResult.bitsScoreBeforePlay || 0;
            sumScoreBitz = sumScoreBitz < 0 ? 0 : sumScoreBitz;
            let sumGivenBitz = getBitzGameResult.data?.bitsMain?.bitsGivenSum || 0;
            sumGivenBitz = sumGivenBitz < 0 ? 0 : sumGivenBitz;
            let sumBonusBitz = getBitzGameResult.data?.bitsMain?.bitsBonusSum || 0;
            sumBonusBitz = sumBonusBitz < 0 ? 0 : sumBonusBitz;

            updateBitzBalance(sumScoreBitz + sumBonusBitz - sumGivenBitz);
            updateGivenBitzSum(sumGivenBitz);
            updateBonusBitzSum(sumBonusBitz);

            updateCooldown(
              computeRemainingCooldown(
                getBitzGameResult.data.gamePlayResult.lastPlayedBeforeThisPlay,
                getBitzGameResult.data.gamePlayResult.configCanPlayEveryMSecs
              )
            );

            updateCollectedBitzSum(getBitzGameResult.data.gamePlayResult.bitsScoreBeforePlay); // collected bits by playing

            updateBonusTries(getBitzGameResult.data.gamePlayResult.bonusTriesBeforeThisPlay || 0); // bonus tries awarded to user (currently only via referral code rewards)
          }
        } else {
          resetBitzValsToZero();
        }
      } else if (mvxNFTsFetched && mvxNfts.length === 0) {
        resetBitzValsToZero();
      }
    })();
  }, [address, tokenLogin, mvxNfts, mvxNFTsFetched]);

  function resetBitzValsToZero() {
    updateBitzBalance(-1);
    updateGivenBitzSum(-1);
    updateCooldown(-1);
    updateCollectedBitzSum(-1);
    updateBonusBitzSum(-1);
  }

  return <>{children}</>;
};
