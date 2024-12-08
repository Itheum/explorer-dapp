import React, { useEffect, useState } from "react";
import { useGetAccount } from "@multiversx/sdk-dapp/hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import { Music2, Pause, Play, Loader2, Gift, ShoppingCart, WalletMinimal, Twitter, Youtube, Link2, Globe, Droplet } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import ratingR from "assets/img/nf-tunes/rating-R.png";
import { Loader } from "components";
import { Button } from "libComponents/Button";
import { sleep } from "libs/utils";
import { gtagGo } from "libs/utils/misc";
import { routeNames } from "routes";
import { getArtistsAlbumsData } from "./";

type FeaturedArtistsAndAlbumsProps = {
  mvxNetworkSelected: boolean;
  viewSolData: (e: number) => void;
  viewMvxData: (e: number) => void;
  stopPreviewPlayingNow?: boolean;
  featuredArtistDeepLinkSlug?: string;
  onPlayHappened?: any;
  checkOwnershipOfAlbum: (e: any) => any;
  openActionFireLogic?: any;
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
  } = props;
  const { publicKey } = useWallet();
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
  const [artistAlbumDataset, setArtistAlbumDataset] = useState<any[]>([]);
  const [artistAlbumDataLoading, setArtistAlbumDataLoading] = useState<boolean>(true);

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

  useEffect(() => {
    audio.addEventListener("ended", eventToAttachEnded);
    audio.addEventListener("timeupdate", eventToAttachTimeUpdate);
    audio.addEventListener("canplaythrough", eventToAttachCanPlayThrough);

    (async () => {
      sleep(5);
      const allArtistsAlbumsData = await getArtistsAlbumsData();
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
      console.log("FeaturedArtistsAndAlbums unmount");
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
  }, [selArtistId, artistAlbumDataset]);

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

              <div className="flex flex-col xl:flex-row justify-center items-center gap-8 w-full mt-2 md:mt-0 bgx-blue-700">
                <div className="flex flex-col gap-4 p-8 items-start md:w-[90%] bg-background rounded-xl border border-primary/50 min-h-[350px]">
                  {!artistProfile ? (
                    <div>Loading</div>
                  ) : (
                    <>
                      <div className="artist-bio w-[300px] md:w-full">
                        <div
                          className="border-[0.5px] border-neutral-500/90 h-[100px] md:h-[320px] md:w-[100%] bg-no-repeat bg-cover rounded-xl"
                          style={{
                            "backgroundImage": `url(${artistProfile.img !== "" ? artistProfile.img : "https://api.itheumcloud.com/app_nftunes/images/artist_profile/no-image.png"})`,
                          }}></div>
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

                      <div className="album-list w-[300px] lg:w-full">
                        <p className="mt-5 mb-5 text-xl font-bold">NF-Tunes Discography</p>

                        {artistProfile.albums.map((album: any, idx: number) => (
                          <div key={album.albumId} className="album flex flex-col bbg-500 h-[100%] mb-3 p-5 border">
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
                            <p className="">{album.desc}</p>
                            <div className="album-actions mt-3 flex flex-col flex-wrap lg:flex-row space-y-2 lg:space-y-0">
                              {album.ctaPreviewStream && (
                                <Button
                                  disabled={isPreviewPlaying && !previewIsReadyToPlay}
                                  className="!text-white text-sm mx-2 bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-30% to-[#5D3899] to-95% cursor-pointer !mt-[10px]"
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
                              {!mvxNetworkSelected && !publicKey && (
                                <Link to={routeNames.unlock} state={{ from: `${location.pathname}${location.search}` }}>
                                  <Button className="text-sm mx-2 cursor-pointer !text-orange-500 dark:!text-yellow-300 !mt-[10px]" variant="outline">
                                    <>
                                      <WalletMinimal />
                                      <span className="ml-2">Login to Check Ownership</span>
                                    </>
                                  </Button>
                                </Link>
                              )}

                              {mvxNetworkSelected && !addressMvx && (
                                <Link to={routeNames.unlock} state={{ from: `${location.pathname}${location.search}` }}>
                                  <Button className="text-sm mx-2 cursor-pointer !text-orange-500 dark:!text-yellow-300 !mt-[10px]" variant="outline">
                                    <>
                                      <WalletMinimal />
                                      <span className="ml-2">Login to Check Ownership</span>
                                    </>
                                  </Button>
                                </Link>
                              )}

                              <>
                                {checkOwnershipOfAlbum(album) > -1 && (
                                  <Button
                                    disabled={isPreviewPlaying && !previewIsReadyToPlay}
                                    className="!text-black text-sm px-[2.35rem] bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100 mx-2 !mt-[10px]"
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
                                        openActionFireLogic();
                                      }

                                      gtagGo("NtuArAl", "PlayAlbum", "Album", album.albumId);
                                    }}>
                                    <>
                                      <Music2 />
                                      <span className="ml-2">Play Album</span>
                                    </>
                                  </Button>
                                )}
                                {album.ctaBuy && (
                                  <Button
                                    className="!text-black text-sm px-[2.35rem] bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100 mx-2 cursor-pointer !mt-[10px]"
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
                                    className="!text-white text-sm px-[2.35rem] bottom-1.5 bg-gradient-to-r from-yellow-700 to-orange-800 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100 mx-2 cursor-pointer !mt-[10px]"
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
