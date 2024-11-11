import React, { useEffect, useState } from "react";
import { DataNft, ViewDataReturnType } from "@itheum/sdk-mx-data-nft";
import { DasApiAsset } from "@metaplex-foundation/digital-asset-standard-api";
import { useGetLoginInfo, useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { motion } from "framer-motion";
import { Music, Music2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useThrottledCallback } from "use-debounce";
import { NF_TUNES_TOKENS } from "appsConfig";
import benefitsLogo1 from "assets/img/nf-tunes/benefits-logo1.png";
import benefitsLogo2 from "assets/img/nf-tunes/benefits-logo2.png";
import benefitsLogo3 from "assets/img/nf-tunes/benefits-logo3.png";
import megaphoneLight from "assets/img/nf-tunes/megaphone-light.png";
import megaphone from "assets/img/nf-tunes/megaphone.png";
import musicNoteBlack from "assets/img/nf-tunes/music-note-black.png";
import musicNote from "assets/img/nf-tunes/music-note-white.png";
import disk from "assets/img/nf-tunes-logo-disk.png";
import stick from "assets/img/nf-tunes-logo-stick.png";
import backCube from "assets/img/zstorage/back.png";
import cubes from "assets/img/zstorage/cubes.png";
import dataLines from "assets/img/zstorage/data-lines.png";
import frontCube from "assets/img/zstorage/front.png";
import vault from "assets/img/zstorage/vault-dots.png";
import { MvxDataNftCard, Loader } from "components";
import { MvxAudioPlayer } from "components/AudioPlayer/MvxAudioPlayer";
import { RadioPlayer } from "components/AudioPlayer/RadioPlayer";
import { SolAudioPlayer } from "components/AudioPlayer/SolAudioPlayer";
import HelmetPageMeta from "components/HelmetPageMeta";
import { HeaderComponent } from "components/Layout/HeaderComponent";
import { Modal } from "components/Modal/Modal";
import { MvxSolSwitch } from "components/MvxSolSwitch";
import { SolDataNftCard } from "components/SolDataNftCard";
import YouTubeEmbed from "components/YouTubeEmbed";
import { SHOW_NFTS_STEP, MARSHAL_CACHE_DURATION_SECONDS } from "config";
import { useTheme } from "contexts/ThemeProvider";
import { useGetPendingTransactions } from "hooks";
import { Button } from "libComponents/Button";
import { itheumSolViewData, getOrCacheAccessNonceAndSignature } from "libs/sol/SolViewData";
import { BlobDataType, ExtendedViewDataReturnType } from "libs/types";
import { decodeNativeAuthToken, getApiDataMarshal, getApiWeb2Apps } from "libs/utils";
import { gtagGo } from "libs/utils/misc";
import { scrollToSection } from "libs/utils/ui";
import { toastClosableError } from "libs/utils/uiShared";
import { useAccountStore } from "store/account";
import { useLocalStorageStore } from "store/LocalStorageStore.ts";
import { useNftsStore } from "store/nfts";
import { FeaturedArtistsAndAlbums } from "./FeaturedArtistsAndAlbums";

export const NFTunes = () => {
  const { theme } = useTheme();
  const currentTheme = theme !== "system" ? theme : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const { tokenLogin } = useGetLoginInfo();
  const {
    network: { chainId: chainID },
  } = useGetNetworkConfig();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const [shownMvxAppDataNfts, setShownMvxAppDataNfts] = useState<DataNft[]>([]);
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  const [viewDataRes, setViewDataRes] = useState<ExtendedViewDataReturnType>();
  const [currentDataNftIndex, setCurrentDataNftIndex] = useState(-1);
  const [dataMarshalResponse, setDataMarshalResponse] = useState({ "data_stream": {}, "data": [] });
  const [firstSongBlobUrl, setFirstSongBlobUrl] = useState<string>();
  const { mvxNfts, isLoadingMvx, solNfts, isLoadingSol, updateIsLoadingMvx } = useNftsStore();
  const nfTunesTokens = [...NF_TUNES_TOKENS].filter((v) => mvxNfts.find((nft) => nft.collection === v.tokenIdentifier && nft.nonce === v.nonce));
  const [stopRadio, setStopRadio] = useState<boolean>(false);
  const [noRadioAutoPlay, setNoRadioAutoPlay] = useState<boolean>(true);
  const [stopPreviewPlaying, setStopPreviewPlaying] = useState<boolean>(false);
  const [radioTracksLoading, setRadioTracksLoading] = useState<boolean>(false);
  const [radioTracks, setRadioTracks] = useState<any[]>([]);
  const [featuredArtistDeepLinkSlug, setFeaturedArtistDeepLinkSlug] = useState<string | undefined>();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultChain = useLocalStorageStore((state) => state.defaultChain);
  const mvxNetworkSelected = defaultChain === "multiversx";
  const [shownSolAppDataNfts, setShownSolAppDataNfts] = useState<DasApiAsset[]>(solNfts.slice(0, SHOW_NFTS_STEP));
  const { publicKey, signMessage } = useWallet();
  const solPreaccessNonce = useAccountStore((state: any) => state.solPreaccessNonce);
  const solPreaccessSignature = useAccountStore((state: any) => state.solPreaccessSignature);
  const solPreaccessTimestamp = useAccountStore((state: any) => state.solPreaccessTimestamp);
  const updateSolPreaccessNonce = useAccountStore((state: any) => state.updateSolPreaccessNonce);
  const updateSolPreaccessTimestamp = useAccountStore((state: any) => state.updateSolPreaccessTimestamp);
  const updateSolSignedPreaccess = useAccountStore((state: any) => state.updateSolSignedPreaccess);

  const [ownedSolDataNftNameAndIndexMap, setOwnedSolDataNftNameAndIndexMap] = useState<any>(null);
  const [ownedMvxDataNftNameAndIndexMap, setOwnedMvxDataNftNameAndIndexMap] = useState<any>(null);

  // control the visibility base level music player model
  const [launchBaseLevelMusicPlayer, setLaunchBaseLevelMusicPlayer] = useState<boolean>(false);

  useEffect(() => {
    const isFeaturedArtistDeepLink = searchParams.get("artist-profile");

    if (isFeaturedArtistDeepLink) {
      scrollToSection("artist-profile", 50);
      setNoRadioAutoPlay(true); // don't auto-play radio when we deep scroll to artist as its confusing
      setFeaturedArtistDeepLinkSlug(isFeaturedArtistDeepLink.trim());
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    async function getRadioTracksData() {
      setRadioTracksLoading(true);

      const allRadioTracks = await getRadioStreamsData();

      setRadioTracks(allRadioTracks);
      setRadioTracksLoading(false);
    }

    getRadioTracksData();
  }, []);

  useEffect(() => {
    if (!hasPendingTransactions) {
      fetchMvxAppNfts();
    }
  }, [hasPendingTransactions, mvxNfts]);

  useEffect(() => {
    if (!hasPendingTransactions) {
      setShownSolAppDataNfts(solNfts.filter((nft: DasApiAsset) => nft.content.metadata.name.includes("MUS")));
    }
  }, [solNfts]);

  useEffect(() => {
    if (shownSolAppDataNfts && shownSolAppDataNfts.length > 0) {
      const nameToIndexMap = shownSolAppDataNfts.reduce((t: any, solDataNft: DasApiAsset, idx: number) => {
        if (solDataNft?.content?.metadata?.name) {
          t[solDataNft.content.metadata.name] = idx;
        }
        return t;
      }, {});

      setOwnedSolDataNftNameAndIndexMap(nameToIndexMap);
    }
  }, [shownSolAppDataNfts]);

  useEffect(() => {
    if (shownMvxAppDataNfts && shownMvxAppDataNfts.length > 0) {
      const nameToIndexMap = shownMvxAppDataNfts.reduce((t: any, mvxDataNft: DataNft, idx: number) => {
        if (mvxDataNft?.tokenIdentifier) {
          t[mvxDataNft?.tokenIdentifier] = idx;
        }
        return t;
      }, {});

      setOwnedMvxDataNftNameAndIndexMap(nameToIndexMap);
    }
  }, [shownMvxAppDataNfts]);

  // get the nfts that are able to open nfTunes app
  async function fetchMvxAppNfts(activeIsLoading = true) {
    if (activeIsLoading) {
      updateIsLoadingMvx(true);
    }

    const _nfts: DataNft[] = await DataNft.createManyFromApi(
      nfTunesTokens.slice(shownMvxAppDataNfts.length, shownMvxAppDataNfts.length + SHOW_NFTS_STEP).map((v) => ({
        nonce: v.nonce,
        tokenIdentifier: v.tokenIdentifier,
      }))
    );

    setShownMvxAppDataNfts((oldNfts) => oldNfts.concat(_nfts));

    if (activeIsLoading) {
      updateIsLoadingMvx(false);
    }
  }

  // after pressing the button to view data open modal
  async function viewMvxData(index: number) {
    try {
      if (!(index >= 0 && index < shownMvxAppDataNfts.length)) {
        toastClosableError("Data is not loaded");
        return;
      }

      setFirstSongBlobUrl(undefined);

      const dataNft = shownMvxAppDataNfts[index];
      const _owned = mvxNfts.find((nft) => nft.tokenIdentifier === dataNft.tokenIdentifier) ? true : false;

      if (_owned) {
        setIsFetchingDataMarshal(true);

        let res: any;
        if (!(tokenLogin && tokenLogin.nativeAuthToken)) {
          throw Error("No nativeAuth token");
        }

        const arg = {
          mvxNativeAuthOrigins: [decodeNativeAuthToken(tokenLogin.nativeAuthToken).origin],
          mvxNativeAuthMaxExpirySeconds: 3600,
          fwdHeaderMapLookup: {
            "authorization": `Bearer ${tokenLogin.nativeAuthToken}`,
          },
          stream: true,
          cacheDurationSeconds: MARSHAL_CACHE_DURATION_SECONDS,
        };

        setCurrentDataNftIndex(index);

        if (!dataNft.dataMarshal || dataNft.dataMarshal === "") {
          dataNft.updateDataNft({ dataMarshal: getApiDataMarshal(chainID) });
        }

        // start the request for the first song
        const firstSongResPromise: any = dataNft.viewDataViaMVXNativeAuth({
          mvxNativeAuthOrigins: [decodeNativeAuthToken(tokenLogin.nativeAuthToken).origin],
          mvxNativeAuthMaxExpirySeconds: 3600,
          fwdHeaderMapLookup: { "authorization": `Bearer ${tokenLogin?.nativeAuthToken}` },
          stream: true,
          nestedIdxToStream: 1, // get the song for the first index
          cacheDurationSeconds: MARSHAL_CACHE_DURATION_SECONDS,
        });

        // start the request for the manifest file from marshal
        res = await dataNft.viewDataViaMVXNativeAuth(arg);

        let blobDataType = BlobDataType.TEXT;

        if (!res.error) {
          if (res.contentType.search("application/json") >= 0) {
            res.data = await (res.data as Blob).text();
            res.data = JSON.stringify(JSON.parse(res.data), null, 4);
          }
        } else {
          console.error(res.error);
          toastClosableError(res.error);
        }

        const viewDataPayload: ExtendedViewDataReturnType = {
          ...res,
          blobDataType,
        };

        setDataMarshalResponse(JSON.parse(res.data));
        setViewDataRes(viewDataPayload);
        setIsFetchingDataMarshal(false);

        // await the first song response and set the firstSongBlobUrl state
        const firstSongRes: ViewDataReturnType = await firstSongResPromise;
        const blobUrl = URL.createObjectURL(firstSongRes.data);
        setFirstSongBlobUrl(blobUrl);
      }
    } catch (err) {
      console.error(err);
      toastClosableError((err as Error).message);
      setIsFetchingDataMarshal(false);
    }
  }

  async function viewSolData(index: number) {
    try {
      if (!(index >= 0 && index < shownSolAppDataNfts.length)) {
        toastClosableError("Data is not loaded");
        return;
      }

      setFirstSongBlobUrl(undefined);
      setIsFetchingDataMarshal(true);

      const dataNft = shownSolAppDataNfts[index];

      const { usedPreAccessNonce, usedPreAccessSignature } = await getOrCacheAccessNonceAndSignature({
        solPreaccessNonce,
        solPreaccessSignature,
        solPreaccessTimestamp,
        signMessage,
        publicKey,
        updateSolPreaccessNonce,
        updateSolSignedPreaccess,
        updateSolPreaccessTimestamp,
      });

      const viewDataArgs = {
        headers: {},
        fwdHeaderKeys: [],
      };

      if (!publicKey) throw new Error("Missing data for viewData");
      setCurrentDataNftIndex(index);

      // start the request for the first song
      const firstSongResPromise = itheumSolViewData(
        dataNft.id,
        usedPreAccessNonce,
        usedPreAccessSignature,
        publicKey,
        viewDataArgs.fwdHeaderKeys,
        viewDataArgs.headers,
        true,
        1,
        MARSHAL_CACHE_DURATION_SECONDS
      );

      // start the request for the manifest file from marshal
      const res = await itheumSolViewData(
        dataNft.id,
        usedPreAccessNonce,
        usedPreAccessSignature,
        publicKey,
        viewDataArgs.fwdHeaderKeys,
        viewDataArgs.headers,
        false,
        undefined,
        MARSHAL_CACHE_DURATION_SECONDS
      );

      let blobDataType = BlobDataType.TEXT;

      if (res.ok) {
        const contentType = res.headers.get("content-type") ?? "";

        if (contentType.search("application/json") >= 0) {
          const data = await res.json();
          const viewDataPayload: ExtendedViewDataReturnType = {
            data,
            contentType,
            blobDataType,
          };
          setDataMarshalResponse(data);
          setViewDataRes(viewDataPayload);
          setIsFetchingDataMarshal(false);

          // await the first song response and set the firstSongBlobUrl state
          const firstSongRes = await firstSongResPromise;
          const blobUrl = URL.createObjectURL(await firstSongRes.blob());
          setFirstSongBlobUrl(blobUrl);
        }
      } else {
        console.error(res.status + " " + res.statusText);
        toastClosableError(res.status + " " + res.statusText);
      }
    } catch (err) {
      console.error(err);
      toastClosableError((err as Error).message);
      setIsFetchingDataMarshal(false);
    }
  }

  function checkOwnershipOfAlbum(album: any) {
    console.log("checkOwnershipOfAlbum");
    let albumInOwnershipListIndex = -1; // note -1 means we don't own it

    if (!mvxNetworkSelected) {
      if (album?.solNftName && ownedSolDataNftNameAndIndexMap && typeof ownedSolDataNftNameAndIndexMap[album.solNftName] !== "undefined") {
        albumInOwnershipListIndex = ownedSolDataNftNameAndIndexMap[album.solNftName];
      }
    } else {
      if (album?.mvxDataNftId && ownedMvxDataNftNameAndIndexMap) {
        // Data NFT-FT checks
        if (typeof ownedMvxDataNftNameAndIndexMap[album.mvxDataNftId] !== "undefined") {
          albumInOwnershipListIndex = ownedMvxDataNftNameAndIndexMap[album.mvxDataNftId];
        } else {
          // Data NFT PH Checks (mvxDataNftId is actually the entire collection and not collection-nonce like in FT)
          Object.keys(ownedMvxDataNftNameAndIndexMap).forEach((i) => {
            if (i.includes(album.mvxDataNftId)) {
              albumInOwnershipListIndex = ownedMvxDataNftNameAndIndexMap[i];
              return;
            }
          });
        }
      }
    }

    return albumInOwnershipListIndex;
  }

  // in Radio, checkOwnershipOfAlbum get called when user clicks on play, as the radio comp is rerendering each time the progress bar moves (memo not working)
  // ... so we throttle each call by 2000 to improve some performance
  const debouncedCheckOwnershipOfAlbum = useThrottledCallback(checkOwnershipOfAlbum, 2000, { "trailing": false });

  return (
    <>
      <HelmetPageMeta
        title="Itheum NF-Tunes : Web3 Music Streaming Service"
        shortTitle="Itheum NF-Tunes"
        desc="NF-Tunes uses web3 tech to let you stream music, support your favorite artists, and disrupt the music industry."
        shareImgUrl="https://explorer.itheum.io/socialshare/itheum_nftunes_social_hero.png"
      />

      <div className="flex flex-col justify-center items-center w-full overflow-hidden md:overflow-visible">
        <div className="w-full h-[2px] bg-[linear-gradient(to_right,#737373,#A76262,#5D3899,#5D3899,#A76262,#737373)] animate-gradient bg-[length:200%_auto]"></div>
        <div className="flex flex-col justify-center items-center font-[Clash-Regular] w-full max-w-[100rem] pb-6">
          <div className="flex flex-col justify-center items-center xl:items-start h-[100vsh] w-[100%] pt-2 xl:pt-4 mb-16 xl:mb-32 pl-4">
            <div className="flex flex-col w-full xl:w-[60%]">
              <MvxSolSwitch />
            </div>

            {/* New Artists Join CTA */}
            <div className="flex flex-col md:flex-row items-center justify-between p-[15px] rounded-lg w-full bg-[#333] dark:bg-primary text-primary-foreground">
              <img className="w-[50px] md:w-70px" src={currentTheme === "dark" ? megaphone : megaphoneLight} alt="megaphone" />
              <p className="text-lg md:text-xl my-3 md:my-0">Are you an Indie Musician? NF-Tunes is growing fast and we are onboarding new musicians!</p>
              <Button
                onClick={() => {
                  scrollToSection("join-nf-tunes");

                  gtagGo("NtuHm", "CTA", "LearnJoin");
                }}
                className="w-[240px] hover:scale-110 transition duration-700 text-sm md:text-lg text-center p-2 md:p-4 bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-30% to-[#5D3899] to-95% rounded-lg text-white">
                Learn More and Join
              </Button>
            </div>

            <div className="flex flex-col w-full xl:w-[100%] mt-10 mb-[80px]">
              <div>
                <div className="px-2">NF-Tunes Radio</div>
                {radioTracksLoading || radioTracks.length === 0 ? (
                  <div className="select-none h-[30%] bg-[#FaFaFa]/25 dark:bg-[#0F0F0F]/25 border-[1px] border-foreground/40 relative md:w-[100%] flex flex-col rounded-xl mt-2 p-3">
                    {radioTracksLoading ? "Radio service powering up..." : "Radio service unavailable."}
                  </div>
                ) : (
                  <RadioPlayer
                    noAutoPlay={noRadioAutoPlay}
                    stopRadioNow={stopRadio}
                    onPlayHappened={(isPlaying: boolean) => {
                      if (isPlaying) {
                        setStopRadio(false);
                      }

                      if (!stopPreviewPlaying) {
                        setStopPreviewPlaying(true);
                      }
                    }}
                    songs={radioTracks}
                    checkOwnershipOfAlbum={debouncedCheckOwnershipOfAlbum}
                    mvxNetworkSelected={mvxNetworkSelected}
                    viewSolData={viewSolData}
                    viewMvxData={viewMvxData}
                    openActionFireLogic={() => {
                      setLaunchBaseLevelMusicPlayer(true);
                      setStopRadio(true);
                      setStopPreviewPlaying(true);
                    }}
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col w-full xl:w-[60%] gap-6">
              <div className="flex-row flex items-center">
                <span className="text-5xl xl:text-[8rem] text-primary">NF-Tunes</span>
                <img className="max-h-[30%] mb-6" src={currentTheme === "dark" ? musicNote : musicNoteBlack} />
              </div>

              <div className="flex flex-row justify-between">
                <span className="text-base md:text-xl text-primary text-light w-[60%]">
                  Empowering Indie musicians to engage with a fresh fan community and discover alternative avenues for music distribution{" "}
                </span>
              </div>
            </div>

            <div className="flex flex-col xl:flex-row  w-full justify-between items-center h-full">
              <div className="p-6 pl-32">
                <Music className="md:scale-[2] mb-8 ml-[14%] text-primary" />
              </div>

              <div className="relative min-h-[10rem] h-full w-full xl:-mt-[15%] -z-10">
                <div className="absolute w-[60%] max-w-[500px]  -mt-[10%] left-[20%] xl:left-[35%] h-[300px] xl:h-[500px] bg-gradient-to-br from-[#737373] from-20% via-[#A76262] via-40% to-[#5D3899] to-80% rounded-full filter blur-2xl opacity-25   "></div>
                <img className="animate-spin-slow w-[60%] left-[20%] xl:left-[40%] max-w-[350px] absolute" src={disk} alt="disk" />
                <img className="absolute left-[60%] lg:left-[50%] xl:left-[70%] top-[-30px] xl:top-[-50px] w-[30%] max-w-[200px]" src={stick} alt="stick" />
              </div>

              <div className="flex flex-col items-center h-full">
                <div className=" flex justify-start xl:justify-end w-full md:-mt-32 xl:-ml-8 -z-10">
                  <img className="scale-50 md:scale-75 -ml-4 -mt-6" src={musicNote} />
                  <Music className="md:scale-[2] text-primary" />
                </div>
                <span className="text-primary text-xl text-center xl:text-start p-8 pt-16 md:pt-32">Driven by the innovation of Itheum Music Data NFTs</span>
              </div>
            </div>
          </div>

          {/* Artists and their Albums */}
          <div id="artist-profile" className="md:mt-[50px] w-full">
            <FeaturedArtistsAndAlbums
              mvxNetworkSelected={mvxNetworkSelected}
              viewSolData={viewSolData}
              viewMvxData={viewMvxData}
              stopPreviewPlayingNow={stopPreviewPlaying}
              featuredArtistDeepLinkSlug={featuredArtistDeepLinkSlug}
              onPlayHappened={(isPlaying: boolean) => {
                if (isPlaying) {
                  setStopPreviewPlaying(false);
                }

                if (!stopRadio) {
                  setStopRadio(true);
                }
              }}
              checkOwnershipOfAlbum={checkOwnershipOfAlbum}
              openActionFireLogic={() => {
                setLaunchBaseLevelMusicPlayer(true);
                setStopRadio(true);
                setStopPreviewPlaying(true);
              }}
            />
          </div>

          {/* Data NFT list shown here */}
          {(shownMvxAppDataNfts.length > 0 || shownSolAppDataNfts.length > 0) && (
            <div id="data-nfts" className="flex justify-center items-center pb-16">
              <div className="flex flex-col">
                {mvxNetworkSelected && (
                  <HeaderComponent
                    pageTitle={""}
                    hasImage={false}
                    pageSubtitle={`You have collected ${shownMvxAppDataNfts.length} Music Data NFTs`}
                    alwaysCenterTitleAndSubTitle={true}>
                    <div className="flex flex-col md:flex-row flex-wrap justify-center">
                      {shownMvxAppDataNfts.length > 0 ? (
                        shownMvxAppDataNfts.map((dataNft, index) => {
                          return (
                            <MvxDataNftCard
                              key={index}
                              index={index}
                              dataNft={dataNft}
                              isLoading={isLoadingMvx}
                              isDataWidget={true}
                              owned={mvxNfts.find((nft) => nft.tokenIdentifier === dataNft.tokenIdentifier) ? true : false}
                              viewData={viewMvxData}
                              modalContent={
                                isFetchingDataMarshal ? (
                                  <div
                                    className="flex flex-col items-center justify-center"
                                    style={{
                                      minHeight: "40rem",
                                    }}>
                                    <div>
                                      <Loader noText />
                                      <p className="text-center text-foreground">Loading...</p>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    {mvxNetworkSelected && viewDataRes && !viewDataRes.error && tokenLogin && currentDataNftIndex > -1 && (
                                      <MvxAudioPlayer
                                        dataNftToOpen={shownMvxAppDataNfts[currentDataNftIndex]}
                                        songs={dataMarshalResponse ? dataMarshalResponse.data : []}
                                        tokenLogin={tokenLogin}
                                        firstSongBlobUrl={firstSongBlobUrl}
                                        chainID={chainID}
                                      />
                                    )}
                                  </>
                                )
                              }
                              modalTitle="Music Player"
                              modalTitleStyle="p-4"
                              openActionBtnText="Play Album"
                              openActionFireLogic={() => {
                                setStopRadio(true);
                                setStopPreviewPlaying(true);
                              }}
                              cardStyles="mx-3"
                              hideIsInWalletSection={true}
                            />
                          );
                        })
                      ) : (
                        <>&nbsp;</>
                      )}
                    </div>
                  </HeaderComponent>
                )}

                {!mvxNetworkSelected && (
                  <HeaderComponent
                    pageTitle={""}
                    hasImage={false}
                    pageSubtitle={`You have collected ${shownSolAppDataNfts.length} Music Data NFTs`}
                    alwaysCenterTitleAndSubTitle={true}>
                    <div className="flex flex-col md:flex-row flex-wrap justify-center">
                      {shownSolAppDataNfts.length > 0 ? (
                        shownSolAppDataNfts.map((dataNft, index) => {
                          return (
                            <SolDataNftCard
                              key={index}
                              index={index}
                              dataNft={dataNft}
                              isLoading={isLoadingSol}
                              isDataWidget={true}
                              owned={true}
                              viewData={viewSolData}
                              modalContent={
                                isFetchingDataMarshal ? (
                                  <div
                                    className="flex flex-col items-center justify-center"
                                    style={{
                                      minHeight: "40rem",
                                    }}>
                                    <div>
                                      <Loader noText />
                                      <p className="text-center text-foreground">Loading...</p>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    {!mvxNetworkSelected && viewDataRes && !viewDataRes.error && currentDataNftIndex > -1 && (
                                      <SolAudioPlayer
                                        dataNftToOpen={shownSolAppDataNfts[currentDataNftIndex]}
                                        songs={dataMarshalResponse ? dataMarshalResponse.data : []}
                                        firstSongBlobUrl={firstSongBlobUrl}
                                        chainID={chainID}
                                      />
                                    )}
                                  </>
                                )
                              }
                              modalTitle="Music Player"
                              modalTitleStyle="p-4"
                              openActionBtnText="Play Album"
                              openActionFireLogic={() => {
                                setStopRadio(true);
                                setStopPreviewPlaying(true);
                              }}
                              cardStyles="mx-3"
                              hideIsInWalletSection={true}
                            />
                          );
                        })
                      ) : (
                        <h3 className="text-center text-white">&nbsp;</h3>
                      )}
                    </div>
                  </HeaderComponent>
                )}

                <div className="m-auto mb-5">
                  {mvxNetworkSelected && shownMvxAppDataNfts.length < nfTunesTokens.length && (
                    <Button
                      className="border-0 text-background rounded-lg font-medium tracking-tight base:!text-sm md:!text-base hover:opacity-80 hover:text-black"
                      onClick={() => {
                        fetchMvxAppNfts(false);

                        gtagGo("NtuHm", "LoadMore", "MVX");
                      }}
                      disabled={false}>
                      Load more
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Benefits of NF-Tunes */}
          <div className="flex flex-col justify-center items-center w-full gap-12 p-6 xl:p-12 xl:pb-0">
            <div className="flex flex-col mb-16 xl:mb-32 justify-center w-[100%] items-center xl:items-start">
              <div className="flex flex-row rounded-lg mb-12 px-8 xl:px-16 text-center gap-4 bg-[#333] dark:bg-primary md:text-2xl xl:text-3xl  justify-center items-center ">
                <Music2 className="text-secondary" />
                <span className="text-secondary">Benefits of NF-Tunes</span>
                <Music2 className="text-secondary" />
              </div>
              <div className="flex flex-col xl:flex-row justify-center items-center gap-8 w-full">
                <div className="flex flex-col gap-4 p-8 items-start md:w-[80%] xl:w-[30%] bg-background rounded-[3rem] border border-primary/50">
                  <div className="flex justify-center items-center rounded-full h-24 w-24 bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-40% to-[#5D3899] to-100%">
                    <img src={benefitsLogo1} />
                  </div>
                  <span className="text-primary text-2xl min-h-24">Transform your music streams into NFT Masterpieces</span>
                  <span className="text-primary text-sm h-40 md:h-32 font-[Clash-Light]">
                    Release single tracks, playlists, or mixes through a unified Music Data NFT, allowing instant updates for NFT holders with the latest
                    content.{" "}
                  </span>
                </div>
                <div className="flex flex-col gap-4 p-8 items-start md:w-[80%] xl:w-[30%] bg-background rounded-[3rem] border border-primary/50">
                  <div className="flex justify-center items-center rounded-full h-24 w-24 bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-40% to-[#5D3899] to-100%">
                    <img src={benefitsLogo2} />
                  </div>
                  <span className="text-primary text-2xl min-h-24">Cultivate a DeGeN Fan Community for Your Music NFTs</span>
                  <span className="text-primary text-sm h-40 md:h-32 font-[Clash-Light]">
                    Discover Music Data NFTs on various platforms, connecting with new fans and building direct relationships with your audience.{" "}
                  </span>
                </div>
                <div className="flex flex-col gap-4 p-8 items-start md:w-[80%] xl:w-[30%] bg-background rounded-[3rem] border border-primary/50">
                  <div className="flex justify-start w-full">
                    <div className="flex justify-center items-center rounded-full h-24 w-24 bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-40% to-[#5D3899] to-100%">
                      <img src={benefitsLogo3} />
                    </div>
                  </div>
                  <span className="text-primary text-2xl min-h-24 ">Take Command of Royalties and Distribution</span>
                  <span className="text-primary text-sm h-40 md:h-32 font-[Clash-Light]">
                    Forge a direct connection with your fans, experiment with diverse royalty and distribution approaches, showcase the demand for your music.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Calling Musicians Section */}
          <div
            id="join-nf-tunes"
            className="flex flex-col gap-4 justify-center items-center bg-[#333] dark:bg-primary w-full px-[20px] py-[50px] text-center rounded-t-lg">
            <span className="text-secondary font-[Clash-Medium] text-2xl xl:text-6xl"> Calling all Indie Musicians!</span>
            <span className="xl:w-[50%] text-primary-foreground xl:text-2xl ">
              Be a true Web3 music innovator! We provide you with full support to launch your music on NF-Tunes
            </span>

            <img className="w-[200px] md:w-400px" src={currentTheme === "dark" ? megaphone : megaphoneLight} alt="megaphone" />

            <div className="flex flex-col md:flex-row">
              <Link
                to={`https://assetspublic-itheum-ecosystem.s3.eu-central-1.amazonaws.com/app_nftunes/other/nf-tunes-bizdev-deck-V2.pdf`}
                target="_blank"
                className="mt-10 md:mx-3 hover:scale-110 transition duration-700 text-sm md:text-xl text-center p-2 md:p-4 bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-30% to-[#5D3899] to-95% rounded-lg md:max-w-[50%] text-white">
                Why NF-Tunes? <div className="text-sm">(Perks and Benefits)</div>
              </Link>
              <Link
                to={`https://docs.google.com/forms/d/e/1FAIpQLScSnDHp7vHvj9N8mcdI4nWFle2NDY03Tf128AePwVMhnOp1ag/viewform`}
                target="_blank"
                className="flex items-center mt-5 md:mt-10 md:mx-3 hover:scale-110 transition duration-700 text-sm md:text-xl text-center p-2 md:p-4 bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-30% to-[#5D3899] to-95% rounded-lg md:max-w-[50%] text-white">
                Launch Your Music!
              </Link>
            </div>
          </div>

          {/* What Musicians are saying */}
          <div className="flex flex-col gap-4 justify-center items-center bg-[#333] dark:bg-primary w-full px-[20px] md:py-[50px] text-center rounded-b-lg">
            <div className="py-8 flex flex-col w-[100%] justify-center items-center xl:items-start xl:p-12 xl:pt-0">
              <div className="flex flex-col xl:flex-row w-full items-center justify-center h-[300px]">
                <div className="flex flex-col gap-8 xl:w-[50%] justify-start items-center xl:items-start w-[330px] md:w-[auto]">
                  <div className="text-2xl xl:text-4xl text-primary-foreground">Hear what Indie Musicians are saying about Music Data NFTs and NF-Tunes</div>
                </div>
                <div className="flex justify-center items-center h-[30rem] w-full xl:w-[50%]">
                  <div className="w-[380px] h-[170px] md:w-[480px] md:h-[270px]">
                    <YouTubeEmbed embedId="sDTBpwSu33I" title="Meet Manu" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Storage Solution Zedge Storage */}
          <div className="flex flex-col justify-center items-center mt-10">
            <div className=" py-8 flex flex-col w-[100%] justify-center items-center xl:items-start p-8 xl:p-12">
              <div className="flex flex-row rounded-lg mb-4 px-8 xl:px-16 text-center gap-4 bg-[#333] dark:bg-foreground md:text-2xl xl:text-3xl justify-center items-center ">
                <Music2 className="text-secondary" />
                <span className="text-secondary">Storage Solution for your Music Data NFT</span>
                <Music2 className="text-secondary" />
              </div>
              <div className="flex flex-col xl:flex-row  w-full h-[100vsh] items-center justify-center">
                <div className="flex flex-col gap-8 xl:w-[50%] justify-start items-center xl:items-start">
                  <div className="text-primary text-3xl xl:text-6xl">
                    Integrate with <br></br>
                    <span className="ml-2 font-bold bg-clip-text text-transparent bg-[linear-gradient(to_right,#737373,#A76262,#5D3899,#5D3899,#A76262,#737373)] animate-gradient bg-[length:200%_auto]">
                      Zedge Storage
                    </span>
                  </div>
                  <div className="text-primary text-center xl:text-start xl:text-xl xl:w-[60%]">
                    Searching for a streamlined solution to store your Music Data NFTs?{" "}
                  </div>

                  <Link
                    to={`https://www.zedgestorage.com/itheum-music-data-nft`}
                    target="_blank"
                    className="hover:scale-110 transition duration-700 text-sm md:text-xl text-center p-2 md:p-4 bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-30%  to-[#5D3899] to-95% rounded-lg  max-w-[50%] text-white">
                    Try Zedge Storage today
                  </Link>
                </div>
                <div className="flex justify-center items-center h-[30rem] w-full xl:w-[50%] scale-100 ">
                  <motion.div className="flex min-w-[20rem] xl:w-[30rem] xl:h-[20rem] overflow-hidden">
                    <motion.img
                      src={frontCube}
                      initial={{ x: -150, y: 160, opacity: 0 }}
                      whileInView={{ opacity: 1, x: -40, y: 130, transition: { duration: 3 } }}
                      className="absolute z-[11]"></motion.img>
                    <img src={vault} className="z-10  w-[25rem] h-[20rem]" />

                    <motion.img
                      src={dataLines}
                      initial={{ x: -25, y: 25, opacity: 0 }}
                      whileInView={{ opacity: [0, 1] }}
                      transition={{ duration: 4 }}
                      className="absolute ml-8 xl:ml-0 -z-10  xl:w-[30rem] h-[20rem] "></motion.img>

                    <motion.img
                      src={cubes}
                      initial={{ x: 100, y: -100 }}
                      whileInView={{ opacity: 1, x: 100, y: 0, transition: { duration: 3 } }}
                      className="absolute"></motion.img>

                    <motion.img
                      src={backCube}
                      initial={{ x: 350, y: -100 }}
                      whileInView={{ opacity: 1, x: 250, y: 0, transition: { duration: 3 } }}
                      transition={{ duration: 5 }}
                      className="absolute -ml-16 xl:-ml-0"></motion.img>

                    <motion.div
                      initial={{ x: 280, y: 250 }}
                      whileInView={{ opacity: 1, x: 220, y: 180, transition: { duration: 3 } }}
                      transition={{ duration: 5 }}
                      className="z-[11] absolute">
                      <img src={cubes} className="" />
                      <img src={cubes} className="-mt-[35px]" />
                    </motion.div>
                  </motion.div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center border-t border-muted-foreground pb-16">
                <div className="flex flex-col xl:flex-row justify-between w-full gap-2 xl:gap-16 xl:h-32 p-2 border-b border-muted-foreground">
                  <div className="text-5xl flex ">
                    <span>01.</span>
                  </div>
                  <div className="flex text-2xl font-[Clash-Medium] max-w-[80%] xl:max-w-[20%] justify-end xl:justify-start xl:text-start">
                    <span>Effortless Music Management</span>
                  </div>
                  <div className="text-md text-muted-foreground w-full xl:max-w-[30%] flex justify-center items-start">
                    Effortlessly add, update, and manage your music files, art, and music metadata. Simplify your workflow with seamless control and
                    organization{" "}
                  </div>
                </div>
                <div className="flex flex-col xl:flex-row justify-between w-full gap-2 xl:gap-16 xl:h-32 p-2 border-b border-muted-foreground">
                  <div className="text-5xl flex ">
                    <span>02.</span>
                  </div>
                  <div className="flex text-2xl font-[Clash-Medium] max-w-[80%] xl:max-w-[20%] justify-end xl:justify-start xl:text-start">
                    <span>Eternal Resonance with Zedge Storage</span>
                  </div>
                  <div className="text-md text-muted-foreground w-full xl:max-w-[30%] flex justify-center items-start">
                    Safeguard your data on a resilient, censorship-resistant network or choose traditional web2-style storage for ultimate versatility and
                    control{" "}
                  </div>
                </div>

                <div className="flex flex-col xl:flex-row justify-between w-full gap-2 xl:gap-16 xl:h-32 p-2 border-b border-muted-foreground">
                  <div className="text-5xl flex ">
                    <span>03.</span>
                  </div>
                  <div className="flex text-2xl font-[Clash-Medium] max-w-[80%] xl:max-w-[20%] justify-end xl:justify-start xl:text-start ">
                    <span>Link Music Streams to Itheum Data NFTs</span>
                  </div>
                  <div className="text-md text-muted-foreground w-full xl:max-w-[30%] flex justify-center items-start">
                    Easily mint, manage, and showcase your Music Data NFT collection on all platforms and marketplaces where NFTs are supported{" "}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The base level modal music player that children components can trigger (Solana Only) */}
        <>
          <Modal
            triggerOpen={launchBaseLevelMusicPlayer}
            triggerOnClose={() => {
              setLaunchBaseLevelMusicPlayer(false);
            }}
            closeOnOverlayClick={false}
            title={"Music Player"}
            hasFilter={false}
            filterData={[]}
            modalClassName={""}
            titleClassName={"p-4"}>
            {isFetchingDataMarshal ? (
              <div
                className="flex flex-col items-center justify-center"
                style={{
                  minHeight: "40rem",
                }}>
                <div>
                  <Loader noText />
                  <p className="text-center text-foreground">Loading...</p>
                </div>
              </div>
            ) : (
              <>
                {!mvxNetworkSelected && viewDataRes && !viewDataRes.error && currentDataNftIndex > -1 ? (
                  <SolAudioPlayer
                    dataNftToOpen={shownSolAppDataNfts[currentDataNftIndex]}
                    songs={dataMarshalResponse ? dataMarshalResponse.data : []}
                    firstSongBlobUrl={firstSongBlobUrl}
                    chainID={chainID}
                  />
                ) : (
                  <MvxAudioPlayer
                    dataNftToOpen={shownMvxAppDataNfts[currentDataNftIndex]}
                    songs={dataMarshalResponse ? dataMarshalResponse.data : []}
                    tokenLogin={tokenLogin}
                    firstSongBlobUrl={firstSongBlobUrl}
                    chainID={chainID}
                  />
                )}
              </>
            )}
          </Modal>
        </>
      </div>
    </>
  );
};

export async function getRadioStreamsData(firstNTracks?: number) {
  try {
    let getRadioStreamAPI = `${getApiWeb2Apps()}/datadexapi/nfTunesApp/getRadioStreams`;

    if (firstNTracks) {
      getRadioStreamAPI += `?firstNTracks=${firstNTracks}`;
    }

    const tracksRes = await axios.get(getRadioStreamAPI);
    const tracksData = tracksRes.data;

    return tracksData;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getNFTuneFirstTrackBlobData() {
  try {
    const firstNFTuneRadioTrackData = await getRadioStreamsData(1);

    if (firstNFTuneRadioTrackData && firstNFTuneRadioTrackData.length > 0) {
      const blob = await fetch(firstNFTuneRadioTrackData[0].stream).then((r) => r.blob());
      const blobUrl = URL.createObjectURL(blob);

      return blobUrl;
    }
  } catch (e) {
    console.error(e);
    return "";
  }
}
