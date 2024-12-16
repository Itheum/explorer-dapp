import React, { useEffect, useState } from "react";
import { faHandPointer, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGetAccount } from "@multiversx/sdk-dapp/hooks";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import { Music2, Pause, Play, Loader2, Gift, ShoppingCart, WalletMinimal, Twitter, Youtube, Link2, Globe, Droplet, Heart, Zap } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import ratingR from "assets/img/nf-tunes/rating-R.png";
import { Loader } from "components";
import { Button } from "libComponents/Button";
import { sleep } from "libs/utils";
import { gtagGo } from "libs/utils/misc";
import { routeNames } from "routes";
import { useNftsStore } from "store/nfts";
import { getArtistsAlbumsData } from "./";
import { fetchBitzPowerUpsAndLikesForSelectedArtist } from "./index";
import { GiftBitzToArtistMeta } from "./types/common";

// e.g. artist + albums data
//   {
//     artistId: "ar1",
//     name: "Hachi Mugen",
//     slug: "hachi-mugen",
//     bio: "Music saved my life. Not everyone gets a second chance. The Ethereal Enclave collapsed and mostly everyone was left for dead or thought to be now what’s left is us. Those who see opportunity despite tragedy and loss... We were BORN TO R1S3. Hachi Mugen was BORN TO R1S3. Welcome to my story.",
//     img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/hachi-mugen.jpg",
//     dripLink: "https://drip.haus/mugenhachi",
//     xLink: "https://x.com/mugenhachi",
//     creatorWallet: "3ibP6nxaKocQPA8S5ntXSo1Xd4aYSa93QKjPzDaPqAmB",
//     bountyId: "mus_ar1",
//     albums: [
//       {
//         albumId: "ar1_a2",
//         solNftName: "MUSG8 - Infinity Series - Hachi",
//         title: "Infinity Series",
//         desc: "Hachi Mugen meditates on four vibrations to unlock his true potential.",
//         img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/hachi-mugen.jpg",
//         ctaPreviewStream: "https://gateway.pinata.cloud/ipfs/QmX1GASRSSqProbmN61RBcz72EPKh687zumm8FJsaTWEHt",
//         ctaBuy: "https://drip.haus/itheum/set/58ad11e3-a410-4ac0-8b24-88c5fadb6df9",
//         ctaAirdrop: "",
//         bountyId: "mus_ar1_a2",
//       },
//       {
//         albumId: "ar1_a1",
//         solNftName: "MUSG3 - Mugen Cafe EP",
//         title: "Mugen Cafe",
//         desc: "Cafe-style, laid-back, lo-fi tracks to sooth your soothe",
//         img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/hachi-mugen.jpg",
//         ctaPreviewStream: "https://gateway.pinata.cloud/ipfs/QmU82pDyHJRey4YfwtyDDdgwFtubCd5Xg4wPwfKJR8JppQ",
//         ctaBuy: "https://drip.haus/itheum/set/662d1e23-5bc2-454c-989a-123c403465cc",
//         ctaAirdrop: "",
//         bountyId: "mus_ar1_a1",
//       },
//     ],
//   },

type FeaturedArtistsAndAlbumsProps = {
  mvxNetworkSelected: boolean;
  viewSolData: (e: number) => void;
  viewMvxData: (e: number) => void;
  stopPreviewPlayingNow?: boolean;
  featuredArtistDeepLinkSlug?: string;
  onPlayHappened?: any;
  checkOwnershipOfAlbum: (e: any) => any;
  openActionFireLogic?: any;
  onSendBitzForMusicBounty: (e: any) => any;

  bountyBitzSumGlobalMapping: any;
  setMusicBountyBitzSumGlobalMapping: any;
};

export const FeaturedArtistsAndAlbums = (props: FeaturedArtistsAndAlbumsProps) => {
  const {
    mvxNetworkSelected,
    viewSolData,
    viewMvxData,
    openActionFireLogic,
    stopPreviewPlayingNow,
    featuredArtistDeepLinkSlug,
    onPlayHappened,
    checkOwnershipOfAlbum,
    onSendBitzForMusicBounty,

    bountyBitzSumGlobalMapping,
    setMusicBountyBitzSumGlobalMapping,
  } = props;
  const { publicKey: publicKeySol } = useWallet();
  const { address: addressMvx } = useGetAccount();
  const [audio] = useState(new Audio());
  const [isPreviewPlaying, setIsPreviewPlaying] = useState<boolean>(false);
  const [previewPlayingForAlbumId, setPreviewPlayingForAlbumId] = useState<string | undefined>();
  const [previewIsReadyToPlay, setPreviewIsReadyToPlay] = useState(false);
  const [selArtistId, setSelArtistId] = useState<string>("ar1");
  const [userInteractedWithTabs, setUserInteractedWithTabs] = useState<boolean>(false);
  const [artistProfile, setArtistProfile] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("00:00");
  const [progress, setProgress] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFreeDropSampleWorkflow, setIsFreeDropSampleWorkflow] = useState(false);
  const [isSigmaWorkflow, setIsSigmaWorkflow] = useState(false);
  const { solBitzNfts } = useNftsStore();
  const [userHasNoBitzDataNftYet, setUserHasNoBitzDataNftYet] = useState(false);
  const [artistAlbumDataset, setArtistAlbumDataset] = useState<any[]>([]);
  const [artistAlbumDataLoading, setArtistAlbumDataLoading] = useState<boolean>(true);
  const {
    network: { chainId: chainID },
  } = useGetNetworkConfig();

  function eventToAttachEnded() {
    audio.src = "";
    audio.currentTime = 0;
    audio.pause();
    setPreviewIsReadyToPlay(false);
    setIsPreviewPlaying(false);
    setPreviewPlayingForAlbumId(undefined);
  }

  function eventToAttachTimeUpdate() {
    updateProgress();
  }

  function eventToAttachCanPlayThrough() {
    // Audio is ready to be played
    setPreviewIsReadyToPlay(true);
    // play the song
    if (audio.currentTime == 0) {
      audio.play();
    }
  }

  const debounced_fetchBitzPowerUpsAndLikesForSelectedArtist = useDebouncedCallback((giftBitzToArtistMeta: GiftBitzToArtistMeta) => {
    fetchBitzPowerUpsAndLikesForSelectedArtist({
      giftBitzToArtistMeta,
      addressMvx,
      chainID,
      userHasNoBitzDataNftYet,
      solBitzNfts,
      bountyBitzSumGlobalMapping,
      setMusicBountyBitzSumGlobalMapping,
      isSingleAlbumBounty: false,
    });
  }, 2500);

  useEffect(() => {
    const isHlWorkflowDeepLink = searchParams.get("hl");

    if (isHlWorkflowDeepLink === "sample") {
      setIsFreeDropSampleWorkflow(true);
    } else if (isHlWorkflowDeepLink === "sigma") {
      setIsSigmaWorkflow(true);
    }

    audio.addEventListener("ended", eventToAttachEnded);
    audio.addEventListener("timeupdate", eventToAttachTimeUpdate);
    audio.addEventListener("canplaythrough", eventToAttachCanPlayThrough);

    (async () => {
      sleep(5);
      const allArtistsAlbumsData = await getArtistsAlbumsData();
      // const allArtistsAlbumsData = dataset;
      sleep(5);
      setArtistAlbumDataset(allArtistsAlbumsData);
      setArtistAlbumDataLoading(false);
    })();

    return () => {
      audio.pause();
      audio.removeEventListener("ended", eventToAttachEnded);
      audio.removeEventListener("timeupdate", eventToAttachTimeUpdate);
      audio.removeEventListener("canplaythrough", eventToAttachCanPlayThrough);
    };
  }, []);

  useEffect(
    () => () => {
      // on unmount we have to stp playing as for some reason the play continues always otherwise
      playPausePreview(); // with no params wil always go into the stop logic
    },
    []
  );

  useEffect(() => {
    if (artistAlbumDataset.length === 0) {
      return;
    }

    playPausePreview(); // with no params wil always go into the stop logic

    const selDataItem = artistAlbumDataset.find((i) => i.artistId === selArtistId);

    setArtistProfile(selDataItem);

    // if we don't do the userInteractedWithTabs, then even on page load, we go update the url with artist-profile which we don't want
    if (selDataItem && selDataItem.slug && userInteractedWithTabs) {
      // update the deep link param
      setSearchParams({ "artist-profile": selDataItem.slug });
    }

    // we clone selDataItem here so as to no accidentally mutate things
    // we debounce this, so that - if the user is jumping tabs.. it wait until they stop at a tab for 2.5 S before running the complex logic
    debounced_fetchBitzPowerUpsAndLikesForSelectedArtist({ ...selDataItem });
  }, [selArtistId, artistAlbumDataset]);

  useEffect(() => {
    if (solBitzNfts.length === 0) {
      setUserHasNoBitzDataNftYet(true);
    } else {
      setUserHasNoBitzDataNftYet(false);
    }
  }, [solBitzNfts]);

  useEffect(() => {
    if (artistAlbumDataset.length === 0) {
      return;
    }

    if (featuredArtistDeepLinkSlug) {
      const findArtistBySlug = artistAlbumDataset.find((i) => i.slug === featuredArtistDeepLinkSlug);

      if (findArtistBySlug) {
        setSelArtistId(findArtistBySlug.artistId);
      }
    }
  }, [featuredArtistDeepLinkSlug, artistAlbumDataset]);

  useEffect(() => {
    if (stopPreviewPlayingNow) {
      playPausePreview(); // with no params wil always go into the stop logic
    }
  }, [stopPreviewPlayingNow]);

  async function playPausePreview(previewStreamUrl?: string, albumId?: string) {
    if (previewStreamUrl && albumId && (!isPreviewPlaying || previewPlayingForAlbumId !== albumId)) {
      onPlayHappened(true); // inform parent to stop any other playing streams on its ui

      resetPreviewPlaying();
      // await sleep(0.1); // this seems to help when some previews overlapped (took it out as it did not seem to do much when testing)

      setPreviewIsReadyToPlay(false);
      setIsPreviewPlaying(true);
      setPreviewPlayingForAlbumId(albumId);

      try {
        const blob = await fetch(previewStreamUrl).then((r) => r.blob());
        let blobUrl = URL.createObjectURL(blob);

        console.log("Music preview playing via BLOB");

        // ios safari seems to not play the music so tried to use blobs like in the other Audio component like Radio
        // but still does not play -- need to debug more (see https://corevo.io/the-weird-case-of-video-streaming-in-safari/)
        audio.src = blobUrl;
      } catch (e) {
        console.log("Music preview playing via original URL");

        audio.src = previewStreamUrl; // this fetches the data, but it may not be ready to play yet until canplaythrough fires
      }

      audio.load();
      updateProgress();
      audio.currentTime = 0;
    } else {
      resetPreviewPlaying();
    }
  }

  function resetPreviewPlaying() {
    audio.src = "";
    audio.currentTime = 0;
    audio.pause();
    setPreviewIsReadyToPlay(false);
    setIsPreviewPlaying(false);
    setPreviewPlayingForAlbumId(undefined);
  }

  const updateProgress = () => {
    setCurrentTime(audio.currentTime ? formatTime(audio.currentTime) : "00:00");
    setDuration(audio.duration ? formatTime(audio.duration) : "00:00");
    let _percentage = (audio.currentTime / audio.duration) * 100;
    if (isNaN(_percentage)) _percentage = 0;
    setProgress(_percentage);
  };

  const formatTime = (_seconds: number) => {
    const minutes = Math.floor(_seconds / 60);
    const remainingSeconds = Math.floor(_seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, "0"); // Ensure two digits
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const userLoggedInWithWallet = publicKeySol || addressMvx;

  return (
    <div className="flex flex-col justify-center items-center w-full p-3 md:p-6 xl:pb-0">
      <div className="flex flex-col mb-16 xl:mb-32 justify-center w-[100%] items-center xl:items-start">
        <div className="flex flex-row rounded-lg mb-6 md:mb-12 px-8 xl:px-16 text-center gap-4 bg-[#333] dark:bg-primary md:text-2xl xl:text-3xl justify-center items-center ">
          <Music2 className="text-secondary" />
          <span className="text-secondary">Artists & Albums</span>
          <Music2 className="text-secondary" />
        </div>

        <div id="artist-profile" className="flex flex-col md:flex-row w-[100%] items-start bgx-purple-900">
          {artistAlbumDataLoading || artistAlbumDataset.length === 0 ? (
            <div className="flex flex-col justify-center w-[100%]">
              {artistAlbumDataLoading ? (
                <div className="m-auto">
                  <Loader noText />
                  Artist and Albums powering up...
                </div>
              ) : (
                <div className="m-auto">⚠️ Artist and Albums unavailable</div>
              )}
            </div>
          ) : (
            <>
              <div className="artist-list flex py-2 pb-5 mb-5 md:mb-0 md:pt-0 md:flex-col md:justify-center items-center w-[320px] md:w-[350px] gap-5 overflow-x-scroll md:overflow-x-auto bbg-800">
                {artistAlbumDataset.map((artist: any) => (
                  <div
                    key={artist.artistId}
                    className={`flex flex-col p-5 items-center w-[200px] md:w-[80%] xl:w-[100%] bg-background rounded-xl border border-primary/50 ${artist.artistId === selArtistId ? "bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-30% to-[#5D3899] to-95%" : "cursor-pointer"}`}
                    onClick={() => {
                      if (artist.artistId !== selArtistId) {
                        setSelArtistId(artist.artistId);
                        setUserInteractedWithTabs(true);

                        gtagGo("NtuArAl", "ViewProfile", "Artist", artist.artistId);
                      }
                    }}>
                    <h2 className={`${artist.artistId === selArtistId ? "!text-white" : ""} !text-lg lg:!text-xl text-nowrap text-center`}>{artist.name}</h2>
                  </div>
                ))}
              </div>

              <div className="flex flex-col xl:flex-row justify-center items-center gap-8 w-full mt-2 md:mt-0 bbg-blue-700">
                <div className="flex flex-col gap-4 p-8 items-start md:w-[90%] bg-background rounded-xl border border-primary/50 min-h-[350px]">
                  {!artistProfile ? (
                    <div>Loading</div>
                  ) : (
                    <>
                      <div className="artist-bio w-[300px] md:w-full">
                        <div
                          className="border-[0.5px] border-neutral-500/90 h-[100px] md:h-[320px] md:w-[100%] bg-no-repeat bg-cover rounded-xl"
                          style={{
                            "backgroundImage": `url(${artistProfile.img})`,
                          }}></div>

                        <div className="mt-5 flex flex-col md:flex-row items-center">
                          <div className="relative">
                            {userLoggedInWithWallet ? (
                              <Button
                                className="!text-black text-sm px-[2.35rem] bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 mx-2 cursor-pointer rounded-none rounded-l-sm"
                                disabled={!publicKeySol && !addressMvx}
                                onClick={() => {
                                  onSendBitzForMusicBounty({
                                    creatorIcon: artistProfile.img,
                                    creatorName: artistProfile.name,
                                    giveBitzToWho: artistProfile.creatorWallet,
                                    giveBitzToCampaignId: artistProfile.bountyId,
                                  });
                                }}>
                                <>
                                  <Zap className="w-4 h-4" />
                                  <span className="ml-2">Power-Up Musician</span>
                                </>
                              </Button>
                            ) : (
                              <Link to={routeNames.unlock} state={{ from: `${location.pathname}${location.search}` }}>
                                <Button
                                  className="text-sm mx-2 cursor-pointer !text-orange-500 dark:!text-yellow-300 rounded-none rounded-l-sm"
                                  variant="outline">
                                  <>
                                    <WalletMinimal />
                                    <span className="ml-2">Login to Power-Up Musician</span>
                                  </>
                                </Button>
                              </Link>
                            )}
                            {isSigmaWorkflow && (
                              <div className="animate-bounce p-3 text-sm absolute w-[110px] ml-[-18px] mt-[12px] text-center">
                                <div className="m-auto mb-[2px] bg-white dark:bg-slate-800 p-2 w-10 h-10 ring-1 ring-slate-900/5 dark:ring-slate-200/20 shadow-lg rounded-full flex items-center justify-center">
                                  <FontAwesomeIcon icon={faHandPointer} />
                                </div>
                                <span className="text-center">Click To Vote</span>
                              </div>
                            )}
                          </div>

                          <div
                            className={`${userLoggedInWithWallet && typeof bountyBitzSumGlobalMapping[artistProfile.bountyId]?.bitsSum !== "undefined" ? "-ml-[12px] hover:bg-orange-100 dark:hover:text-orange-500 cursor-pointer" : "ml-0"} text-center text-lg h-[40px] text-orange-500 dark:text-[#fde047] border border-orange-500 dark:border-yellow-300 mt-2 md:mt-0 rounded-r md:min-w-[100px] flex items-center justify-center `}>
                            {typeof bountyBitzSumGlobalMapping[artistProfile.bountyId]?.bitsSum === "undefined" ? (
                              <FontAwesomeIcon spin={true} color="#fde047" icon={faSpinner} size="lg" className="m-2" />
                            ) : (
                              <div
                                className="p-10 md:p-10"
                                onClick={() => {
                                  if (userLoggedInWithWallet) {
                                    onSendBitzForMusicBounty({
                                      creatorIcon: artistProfile.img,
                                      creatorName: artistProfile.name,
                                      giveBitzToWho: artistProfile.creatorWallet,
                                      giveBitzToCampaignId: artistProfile.bountyId,
                                    });
                                  }
                                }}>
                                <span className="font-bold text-sm">Total Power</span>
                                <span className="ml-1 mt-[10px] text-sm">{bountyBitzSumGlobalMapping[artistProfile.bountyId]?.bitsSum}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className={`${isSigmaWorkflow ? "opacity-[0.1]" : ""}`}>
                          <p className="artist-who mt-5">{artistProfile.bio}</p>

                          {(artistProfile.dripLink !== "" ||
                            artistProfile.xLink !== "" ||
                            artistProfile.webLink !== "" ||
                            artistProfile.ytLink !== "" ||
                            artistProfile.otherLink1 !== "") && (
                            <div className="flex flex-col md:flex-row mt-5">
                              {artistProfile.dripLink && (
                                <a className="underline hover:no-underline mx-2 text-sm mt-1" href={artistProfile.dripLink} target="_blank">
                                  <div className="border-[0.5px] text-center p-2 m-2 flex flex-col justify-center align-middle">
                                    <Droplet className="m-auto w-5" />
                                    Artist on Drip
                                  </div>
                                </a>
                              )}
                              {artistProfile.xLink && (
                                <a className="underline hover:no-underline mx-2 text-sm mt-1" href={artistProfile.xLink} target="_blank">
                                  <div className="border-[0.5px] text-center p-2 m-2 flex flex-col justify-center align-middle">
                                    <Twitter className="m-auto w-5" />
                                    Artist on X
                                  </div>
                                </a>
                              )}
                              {artistProfile.ytLink && (
                                <a className="underline hover:no-underline mx-2 text-sm mt-1" href={artistProfile.ytLink} target="_blank">
                                  <div className="border-[0.5px] text-center p-2 m-2 flex flex-col justify-center align-middle">
                                    <Youtube className="m-auto w-5" />
                                    Artist on YouTube
                                  </div>
                                </a>
                              )}
                              {artistProfile.webLink && (
                                <a className="underline hover:no-underline mx-2 text-sm mt-1" href={artistProfile.webLink} target="_blank">
                                  <div className="border-[0.5px] text-center p-2 m-2 flex flex-col justify-center align-middle">
                                    <Globe className="m-auto w-5" />
                                    Artist Website
                                  </div>
                                </a>
                              )}
                              {artistProfile.otherLink1 && (
                                <a className="underline hover:no-underline mx-2 text-sm mt-1" href={artistProfile.otherLink1} target="_blank">
                                  <div className="border-[0.5px] text-center p-2 m-2 flex flex-col justify-center align-middle">
                                    <Link2 className="m-auto w-5" />
                                    More Content
                                  </div>
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="album-list w-[300px] lg:w-full">
                        <p className="mt-5 mb-5 text-xl font-bold">NF-Tunes Discography</p>

                        {artistProfile.albums.map((album: any, idx: number) => (
                          <div key={album.albumId} className="album flex flex-col h-[100%] mb-3 p-5 border">
                            <div className="albumDetails flex flex-col md:flex-row">
                              <div
                                className="albumImg bg1-red-200 border-[0.5px] border-neutral-500/90 h-[150px] w-[150px] bg-no-repeat bg-cover rounded-xl m-auto"
                                style={{
                                  "backgroundImage": `url(${album.img})`,
                                }}></div>

                              <div className="albumText bg1-red-300 flex flex-col mt-5 md:mt-0 md:ml-5 md:pr-2 flex-1 mb-5 md:mb-0">
                                <h3 className="!text-xl mb-2 flex items-baseline">
                                  <span className="text-3xl mr-1 opacity-50">{`${idx + 1}. `}</span>
                                  <span>{`${album.title}`}</span>
                                  {album.isExplicit && album.isExplicit === "1" && (
                                    <img
                                      className="max-h-[20px] ml-[10px] dark:bg-white"
                                      src={ratingR}
                                      alt="Warning: Explicit Content"
                                      title="Warning: Explicit Content"
                                    />
                                  )}
                                </h3>
                                <p className="ml-2">{album.desc}</p>
                              </div>

                              <div className="albumLikes bg1-red-600 md:w-[135px] flex flex-col items-center">
                                <div
                                  className={`${userLoggedInWithWallet && typeof bountyBitzSumGlobalMapping[album.bountyId]?.bitsSum !== "undefined" ? " hover:bg-orange-100 cursor-pointer dark:hover:text-orange-500" : ""} text-center mb-1 text-lg h-[40px] text-orange-500 dark:text-[#fde047] border border-orange-500 dark:border-yellow-300 rounded w-[100px] flex items-center justify-center`}
                                  onClick={() => {
                                    if (userLoggedInWithWallet && typeof bountyBitzSumGlobalMapping[album.bountyId]?.bitsSum !== "undefined") {
                                      onSendBitzForMusicBounty({
                                        creatorIcon: album.img,
                                        creatorName: `${artistProfile.name}'s ${album.title}`,
                                        giveBitzToWho: artistProfile.creatorWallet,
                                        giveBitzToCampaignId: album.bountyId,
                                        isLikeMode: true,
                                      });
                                    }
                                  }}>
                                  {typeof bountyBitzSumGlobalMapping[album.bountyId]?.bitsSum === "undefined" ? (
                                    <FontAwesomeIcon spin={true} color="#fde047" icon={faSpinner} size="lg" className="m-2" />
                                  ) : (
                                    <div
                                      className="p-5 md:p-0 flex items-center gap-2"
                                      title={userLoggedInWithWallet ? "Like This Album With 5 BiTz" : "Login to Like This Album"}
                                      onClick={() => {
                                        if (userLoggedInWithWallet) {
                                          onSendBitzForMusicBounty({
                                            creatorIcon: album.img,
                                            creatorName: `${artistProfile.name}'s ${album.title}`,
                                            giveBitzToWho: artistProfile.creatorWallet,
                                            giveBitzToCampaignId: album.bountyId,
                                            isLikeMode: true,
                                          });
                                        }
                                      }}>
                                      {bountyBitzSumGlobalMapping[album.bountyId]?.bitsSum}
                                      <Heart className="w-4 h-4" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="albumActions bg1-red-500 mt-3 flex flex-col lg:flex-row space-y-2 lg:space-y-0">
                              {album.ctaPreviewStream && (
                                <Button
                                  disabled={isPreviewPlaying && !previewIsReadyToPlay}
                                  className="!text-white text-sm mx-2 bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-30% to-[#5D3899] to-95% cursor-pointer"
                                  onClick={() => {
                                    playPausePreview(album.ctaPreviewStream, album.albumId);

                                    gtagGo("NtuArAl", "PlayPausePrev", "Album", album.albumId);
                                  }}>
                                  {isPreviewPlaying && previewPlayingForAlbumId === album.albumId ? (
                                    <>
                                      {!previewIsReadyToPlay ? <Loader2 className="animate-spin" /> : <Pause />}
                                      <span className="ml-2"> {currentTime} - Stop Playing </span>
                                    </>
                                  ) : (
                                    <>
                                      <Play />
                                      <span className="ml-2">Play Preview</span>
                                    </>
                                  )}
                                </Button>
                              )}

                              {/* when not logged in, show this to convert the wallet into user account */}
                              {!mvxNetworkSelected && !publicKeySol && (
                                <div className="relative">
                                  <Link to={routeNames.unlock} state={{ from: `${location.pathname}${location.search}` }}>
                                    <Button className="text-sm mx-2 cursor-pointer !text-orange-500 dark:!text-yellow-300" variant="outline">
                                      <>
                                        <WalletMinimal />
                                        <span className="ml-2">Login to Check Ownership</span>
                                      </>
                                    </Button>
                                  </Link>
                                  {isFreeDropSampleWorkflow && (
                                    <div className="animate-bounce p-3 text-sm absolute w-[110px] ml-[-18px] mt-[12px] text-center">
                                      <div className="m-auto mb-[2px] bg-white dark:bg-slate-800 p-2 w-10 h-10 ring-1 ring-slate-900/5 dark:ring-slate-200/20 shadow-lg rounded-full flex items-center justify-center">
                                        <FontAwesomeIcon icon={faHandPointer} />
                                      </div>
                                      <span className="text-center">Click To Play</span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {mvxNetworkSelected && !addressMvx && (
                                <Link to={routeNames.unlock} state={{ from: `${location.pathname}${location.search}` }}>
                                  <Button className="text-sm mx-2 cursor-pointer !text-orange-500 dark:!text-yellow-300" variant="outline">
                                    <>
                                      <WalletMinimal />
                                      <span className="ml-2">Login to Check Ownership</span>
                                    </>
                                  </Button>
                                </Link>
                              )}

                              <>
                                {checkOwnershipOfAlbum(album) > -1 && (
                                  <div className="relative p-2 md:p-0">
                                    <Button
                                      disabled={isPreviewPlaying && !previewIsReadyToPlay}
                                      className="!text-black w-full text-sm px-[2.35rem] bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100 cursor-pointer"
                                      onClick={() => {
                                        const albumInOwnershipListIndex = checkOwnershipOfAlbum(album);

                                        if (albumInOwnershipListIndex > -1) {
                                          if (!mvxNetworkSelected) {
                                            viewSolData(albumInOwnershipListIndex);
                                          } else {
                                            viewMvxData(albumInOwnershipListIndex);
                                          }
                                        }

                                        if (openActionFireLogic) {
                                          openActionFireLogic({
                                            giveBitzToCampaignId: album.bountyId,
                                            bountyBitzSum: bountyBitzSumGlobalMapping[album.bountyId]?.bitsSum,
                                            creatorWallet: artistProfile.creatorWallet,
                                          });
                                        }

                                        gtagGo("NtuArAl", "PlayAlbum", "Album", album.albumId);
                                      }}>
                                      <>
                                        <Music2 />
                                        <span className="ml-2">Play Album</span>
                                      </>
                                    </Button>
                                    {isFreeDropSampleWorkflow && (
                                      <div className="animate-bounce p-3 text-sm absolute w-[110px] ml-[-18px] mt-[12px] text-center">
                                        <div className="m-auto mb-[2px] bg-white dark:bg-slate-800 p-2 w-10 h-10 ring-1 ring-slate-900/5 dark:ring-slate-200/20 shadow-lg rounded-full flex items-center justify-center">
                                          <FontAwesomeIcon icon={faHandPointer} />
                                        </div>
                                        <span className="text-center">Click To Play</span>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {album.ctaBuy && (
                                  <Button
                                    className="!text-black text-sm px-[2.35rem] bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100 mx-2 cursor-pointer"
                                    onClick={() => {
                                      gtagGo("NtuArAl", "BuyAlbum", "Album", album.albumId);

                                      window.open(album.ctaBuy)?.focus();
                                    }}>
                                    <>
                                      <ShoppingCart />
                                      <span className="ml-2">{checkOwnershipOfAlbum(album) > -1 ? "Buy More Album Copies" : "Buy Album"}</span>
                                    </>
                                  </Button>
                                )}
                                {album.ctaAirdrop && (
                                  <Button
                                    className="!text-white text-sm px-[2.35rem] bottom-1.5 bg-gradient-to-r from-yellow-700 to-orange-800 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100 mx-2 cursor-pointer"
                                    onClick={() => {
                                      gtagGo("NtuArAl", "GetAlbum", "Album", album.albumId);

                                      window.open(album.ctaAirdrop)?.focus();
                                    }}>
                                    <>
                                      <Gift />
                                      <span className="ml-2">Get Album Airdrop!</span>
                                    </>
                                  </Button>
                                )}
                              </>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
