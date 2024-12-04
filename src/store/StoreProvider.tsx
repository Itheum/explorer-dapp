import React, { PropsWithChildren, useEffect, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { DasApiAsset } from "@metaplex-foundation/digital-asset-standard-api";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import { GET_BITZ_TOKEN_MVX, IS_DEVNET } from "appsConfig";
import { SUPPORTED_MVX_COLLECTIONS } from "config";
import { useGetAccount } from "hooks";
import { viewDataWrapperSol, fetchSolNfts } from "libs/sol/SolViewData";
import { decodeNativeAuthToken } from "libs/utils";
import { computeRemainingCooldown } from "libs/utils/functions";
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
  const { mvxNfts, updateMvxNfts, updateIsLoadingMvx, solBitzNfts, solNfts, updateSolNfts, updateIsLoadingSol, updateSolBitzNfts } = useNftsStore();

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

  // SOL Logged in - bootstrap nft store
  useEffect(() => {
    async function getAllUsersSolNfts() {
      updateIsLoadingSol(true);

      if (!addressSol) {
        updateSolNfts([]);
      } else {
        const _allDataNfts = await fetchSolNfts(addressSol);

        updateSolNfts(_allDataNfts);
      }

      updateIsLoadingSol(false);
    }

    getAllUsersSolNfts();
  }, [publicKeySol]);

  // SOL: if someone updates data nfts (i.e. at the start when app loads and we get nfts OR they get a free mint during app session), we go over them and find bitz nfts etc
  useEffect(() => {
    if (!publicKeySol || solNfts.length === 0) {
      return;
    }

    (async () => {
      updateIsLoadingSol(true);

      // get users bitz data nfts
      const _bitzDataNfts: DasApiAsset[] = IS_DEVNET
        ? solNfts.filter((nft) => nft.content.metadata.name.includes("XP"))
        : solNfts.filter((nft) => nft.content.metadata.name.includes("IXPG")); // @TODO, what is the user has multiple BiTz? IXPG2 was from drip and IXPG3 will be from us direct via the airdrop

      updateSolBitzNfts(_bitzDataNfts);

      updateIsLoadingSol(false);
    })();
  }, [publicKeySol, solNfts]);

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

      resetBitzValsToLoadingMVX();

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
          resetBitzValsToZeroMVX();
        }
        // } else if (mvxNFTsFetched && mvxNfts.length === 0) {
      } else if (mvxNFTsFetched && mvxNfts.length === 0) {
        resetBitzValsToZeroMVX();
      }
    })();
  }, [addressMvx, tokenLogin, mvxNfts, mvxNFTsFetched]);

  // SOL - Bitz Bootstrap
  useEffect(() => {
    (async () => {
      resetBitzValsToLoadingSOL();

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
          let bitzBeforePlay = getBitzGameResult.data.gamePlayResult.bitsScoreBeforePlay || 0;
          let sumGivenBits = getBitzGameResult.data?.bitsMain?.bitsGivenSum || 0;
          let sumBonusBitz = getBitzGameResult.data?.bitsMain?.bitsBonusSum || 0;

          // some values can be -1 during first play or other situations, so we make it 0 or else we get weird numbers like 1 for the some coming up
          if (bitzBeforePlay < 0) {
            bitzBeforePlay = 0;
          }

          if (sumGivenBits < 0) {
            sumGivenBits = 0;
          }

          if (sumBonusBitz < 0) {
            sumBonusBitz = 0;
          }

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
        resetBitzValsToZeroSOL();
      }
    })();
  }, [publicKeySol, solBitzNfts, solPreaccessNonce, solPreaccessSignature]);

  function resetBitzValsToZeroMVX() {
    updateBitzBalance(-1);
    updateGivenBitzSum(-1);
    updateCooldown(-1);
    updateCollectedBitzSum(-1);
    updateBonusBitzSum(-1);
  }

  function resetBitzValsToLoadingMVX() {
    updateBitzBalance(-2);
    updateGivenBitzSum(-2);
    updateCooldown(-2);
    updateCollectedBitzSum(-2);
    updateBonusBitzSum(-2);
  }

  function resetBitzValsToZeroSOL() {
    updateBitzBalanceSol(-1);
    updateGivenBitzSumSol(-1);
    updateCooldownSol(-1);
    updateCollectedBitzSumSol(-1);
    updateBonusBitzSumSol(-1);
  }

  function resetBitzValsToLoadingSOL() {
    updateBitzBalanceSol(-2);
    updateGivenBitzSumSol(-2);
    updateCooldownSol(-2);
    updateCollectedBitzSumSol(-2);
    updateBonusBitzSumSol(-2);
  }

  return <>{children}</>;
};
