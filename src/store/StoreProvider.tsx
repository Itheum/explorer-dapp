import React, { PropsWithChildren, useEffect, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { DasApiAsset } from "@metaplex-foundation/digital-asset-standard-api";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import { GET_BITZ_TOKEN_MVX, IS_DEVNET } from "appsConfig";
import { SUPPORTED_MVX_COLLECTIONS, SUPPORTED_SOL_COLLECTIONS } from "config";
import { useGetAccount } from "hooks";
import { decodeNativeAuthToken, getApiWeb2Apps } from "libs/utils";
import { computeRemainingCooldown } from "libs/utils/functions";
// import { viewDataToOnlyGetReadOnlyBitz } from "pages/AppMarketplace/GetBitz/GetBitzSol";
import { viewDataWrapperSol } from "libs/sol/SolViewData";
import useSolBitzStore from "store/solBitz";
import { useAccountStore } from "./account";
import { useAppsStore } from "./apps";
import { useNftsStore } from "./nfts";
import { viewDataJSONCore } from "../pages/AppMarketplace/GetBitz/GetBitzMvx";

export const StoreProvider = ({ children }: PropsWithChildren) => {
  const { address: addressMvx } = useGetAccount();
  const { tokenLogin } = useGetLoginInfo();
  const { publicKey: publicKeySol } = useWallet();
  const addressSol = publicKeySol?.toBase58();

  // flag to check locally if we got the MVX NFTs
  const [mvxNFTsFetched, setMvxNFTsFetched] = useState<boolean>(false);

  // ACCOUNT Store
  const updateBitzBalance = useAccountStore((state) => state.updateBitzBalance);
  const updateCooldown = useAccountStore((state) => state.updateCooldown);
  const updateGivenBitzSum = useAccountStore((state) => state.updateGivenBitzSum);
  const updateCollectedBitzSum = useAccountStore((state) => state.updateCollectedBitzSum);
  const updateBonusBitzSum = useAccountStore((state) => state.updateBonusBitzSum);
  const updateBonusTries = useAccountStore((state) => state.updateBonusTries);
  const {
    updateBitzBalance: updateBitzBalanceSol,
    updateCooldown: updateCooldownSol,
    updateGivenBitzSum: updateGivenBitzSumSol,
    updateCollectedBitzSum: updateCollectedBitzSumSol,
    updateBonusBitzSum: updateBonusBitzSumSol,
    updateBonusTries: updateBonusTriesSol,
  } = useSolBitzStore();
  const { solPreaccessNonce, solPreaccessSignature } = useAccountStore();

  // APPs Store
  const updateNfTunesRadioFirstTrackCachedBlob = useAppsStore((state) => state.updateNfTunesRadioFirstTrackCachedBlob);

  // NFT Store
  const { mvxNfts, updateMvxNfts, updateIsLoadingMvx, solBitzNfts, updateSolNfts, updateIsLoadingSol, updateSolBitzNfts } = useNftsStore();

  // MVX Logged in - bootstrap store
  useEffect(() => {
    async function fetchMvxNfts() {
      updateIsLoadingMvx(true);
      if (!addressMvx || !(tokenLogin && tokenLogin.nativeAuthToken)) {
        updateMvxNfts([]);
      } else {
        const collections = SUPPORTED_MVX_COLLECTIONS;
        const nftsT = await DataNft.ownedByAddress(addressMvx, collections, 15 * 1000);
        updateMvxNfts(nftsT);
      }
      updateIsLoadingMvx(false);
      setMvxNFTsFetched(true);
    }

    fetchMvxNfts();
  }, [addressMvx, tokenLogin]);

  // SOL Logged in - bootstrap store
  useEffect(() => {
    async function fetchSolNfts() {
      updateIsLoadingSol(true);

      if (!addressSol) {
        updateSolNfts([]);
      } else {
        const resp = await fetch(`${getApiWeb2Apps()}/datadexapi/bespoke/sol/getDataNFTsByOwner?publicKeyb58=${addressSol}`);
        const data = await resp.json();
        const _allDataNfts: DasApiAsset[] = data.nfts;

        updateSolNfts(_allDataNfts);

        const _bitzDataNfts: DasApiAsset[] = IS_DEVNET
          ? _allDataNfts.filter((nft) => nft.content.metadata.name.includes("XP"))
          : _allDataNfts.filter((nft) => nft.content.metadata.name.includes("IXPG2"));

        updateSolBitzNfts(_bitzDataNfts);
      }

      updateIsLoadingSol(false);
    }

    fetchSolNfts();
  }, [publicKeySol]);

  // MVX - Bitz Bootstrap
  useEffect(() => {
    (async () => {
      if (!addressMvx || !(tokenLogin && tokenLogin.nativeAuthToken)) {
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
        const bitzGameDataNFT = await DataNft.createFromApi(GET_BITZ_TOKEN_MVX);

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
  }, [addressMvx, tokenLogin, mvxNfts, mvxNFTsFetched]);

  // SOL - Bitz Bootstrap
  useEffect(() => {
    (async () => {
      if (solBitzNfts.length > 0 && solPreaccessNonce !== "" && solPreaccessSignature !== "" && publicKeySol) {
        const viewDataArgs = {
          headers: {
            "dmf-custom-only-state": "1",
            "dmf-custom-sol-collection-id": solBitzNfts[0].grouping[0].group_value,
          },
          fwdHeaderKeys: ["dmf-custom-only-state", "dmf-custom-sol-collection-id"],
        };

        // const getBitzGameResult = await viewDataToOnlyGetReadOnlyBitz(solBitzNfts[0], solPreaccessNonce, solPreaccessSignature, publicKeySol);
        const getBitzGameResult = await viewDataWrapperSol(publicKeySol!, solPreaccessNonce, solPreaccessSignature, viewDataArgs, solBitzNfts[0].id);

        if (getBitzGameResult) {
          const bitzBeforePlay = getBitzGameResult.data.gamePlayResult.bitsScoreBeforePlay || 0;
          const sumGivenBits = getBitzGameResult.data?.bitsMain?.bitsGivenSum || 0;
          const sumBonusBitz = getBitzGameResult.data?.bitsMain?.bitsBonusSum || 0;

          updateBitzBalanceSol(bitzBeforePlay + sumBonusBitz - sumGivenBits); // collected bits - given bits
          updateGivenBitzSumSol(sumGivenBits); // given bits -- for power-ups
          updateBonusBitzSumSol(sumBonusBitz);

          updateCooldownSol(
            computeRemainingCooldown(
              getBitzGameResult.data.gamePlayResult.lastPlayedBeforeThisPlay,
              getBitzGameResult.data.gamePlayResult.configCanPlayEveryMSecs
            )
          );

          updateCollectedBitzSumSol(getBitzGameResult.data.gamePlayResult.bitsScoreBeforePlay); // collected bits by playing
          updateBonusTriesSol(getBitzGameResult.data.gamePlayResult.bonusTriesBeforeThisPlay || 0); // bonus tries awarded to user (currently only via referral code rewards)
        }
      } else {
        resetBitzValsToZero();
      }
    })();
  }, [publicKeySol, solBitzNfts, solPreaccessNonce, solPreaccessSignature]);

  function resetBitzValsToZero() {
    updateBitzBalance(-1);
    updateGivenBitzSum(-1);
    updateCooldown(-1);
    updateCollectedBitzSum(-1);
    updateBonusBitzSum(-1);
  }

  return <>{children}</>;
};
