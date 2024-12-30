import React, { useEffect, useState } from "react";
import { faHandPointer, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGetAccount } from "@multiversx/sdk-dapp/hooks";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import { Music2, WalletMinimal, Twitter, Youtube, Link2, Globe, Droplet, Zap, CircleArrowLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { Loader } from "components";
import { Button } from "libComponents/Button";
import { sleep } from "libs/utils";
import { gtagGo } from "libs/utils/misc";
import { scrollToSection } from "libs/utils/ui";
import { routeNames } from "routes";
import { useNftsStore } from "store/nfts";
import { getArtistsAlbumsData } from "./";
import { ArtistDiscography } from "./ArtistDiscography";
import { fetchBitzPowerUpsAndLikesForSelectedArtist } from "./index";
import { GiftBitzToArtistMeta } from "./types/common";

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
  userHasNoBitzDataNftYet: boolean;
  onFeaturedArtistDeepLinkSlug: (e: string | undefined) => any;
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
    userHasNoBitzDataNftYet,
    onFeaturedArtistDeepLinkSlug,
  } = props;
  const { publicKey: publicKeySol } = useWallet();
  const { address: addressMvx } = useGetAccount();
  const [audio] = useState(new Audio());
  const [isPreviewPlaying, setIsPreviewPlaying] = useState<boolean>(false);
  const [previewPlayingForAlbumId, setPreviewPlayingForAlbumId] = useState<string | undefined>();
  const [previewIsReadyToPlay, setPreviewIsReadyToPlay] = useState(false);
  const [selArtistId, setSelArtistId] = useState<string | undefined>();
  const [userInteractedWithTabs, setUserInteractedWithTabs] = useState<boolean>(false);
  const [artistProfile, setArtistProfile] = useState<any>(null);
  const [inArtistProfileView, setInArtistProfileView] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("00:00");
  const [progress, setProgress] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFreeDropSampleWorkflow, setIsFreeDropSampleWorkflow] = useState(false);
  const [isSigmaWorkflow, setIsSigmaWorkflow] = useState(false);
  const { solBitzNfts } = useNftsStore();
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
    if (artistAlbumDataset.length === 0 || !selArtistId) {
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

    console.log("&&& selDataItem ", selDataItem);

    // we clone selDataItem here so as to no accidentally mutate things
    // we debounce this, so that - if the user is jumping tabs.. it wait until they stop at a tab for 2.5 S before running the complex logic
    debounced_fetchBitzPowerUpsAndLikesForSelectedArtist({ ...selDataItem });
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

      setInArtistProfileView(true);
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
    <div className="flex flex-col justify-center items-center w-full p-3 xl:pb-0">
      <div className="flex flex-col mb-8 justify-center w-[100%] items-center xl:items-start">
        <div
          className="flex flex-row rounded-lg mb-6 md:mb-6 px-8 xl:px-16 text-center gap-4 bg-[#333] dark:bg-primary md:text-2xl xl:text-3xl justify-center items-center cursor-pointer"
          onClick={() => {
            setInArtistProfileView(false);
          }}>
          <Music2 className="text-secondary" />
          <span className="text-secondary">Artists</span>
          <Music2 className="text-secondary" />
        </div>

        <div id="artist-profile" className="flex flex-col md:flex-row w-[100%] items-start">
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
            <div className="">
              {!inArtistProfileView && (
                <div className="flex flex-col gap-4 p-8 items-start bg-background rounded-xl border border-primary/50 min-h-[350px]">
                  <div className="artist-boxes flex flex-wrap justify-around p-2 after:content-[''] after:w-[300px] after:m-2">
                    {artistAlbumDataset.map((artist: any) => (
                      <div
                        key={artist.artistId}
                        className={`flex w-[300px] h-[300px] m-2 cursor-pointer`}
                        onClick={() => {
                          if (artist.artistId !== selArtistId) {
                            // notify the home page, which then triggers an effect to setSelArtistId
                            onFeaturedArtistDeepLinkSlug(artist.slug);

                            setUserInteractedWithTabs(true);
                            scrollToSection("artist-profile");

                            gtagGo("NtuArAl", "ViewProfile", "Artist", artist.artistId);
                          }

                          setInArtistProfileView(true);
                        }}>
                        <div
                          className="relative h-[100%] w-[100%] bg-no-repeat bg-cover rounded-xl cursor-pointer"
                          style={{
                            "backgroundImage": `url(${artist.img})`,
                          }}>
                          <div className="bg-black absolute bottom-0 w-[100%] p-2 rounded-b-xl">
                            <h2 className={`!text-lg !text-white lg:!text-xl text-nowrap text-center`}>{artist.name}</h2>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {inArtistProfileView && (
                <div className="flex flex-col gap-4 p-8 items-start bg-background rounded-xl border border-primary/50 min-h-[350px]">
                  {!artistProfile ? (
                    <div>Loading</div>
                  ) : (
                    <>
                      {/* back to all artists  */}
                      <Button
                        className="text-sm mb-2 cursor-pointer"
                        variant="outline"
                        onClick={() => {
                          setInArtistProfileView(false);

                          // remove the artist-profile param from the url
                          const currentParams = Object.fromEntries(searchParams.entries());
                          delete currentParams["artist-profile"];
                          setSearchParams(currentParams);

                          // reset the featuredArtistDeepLinkSlug
                          onFeaturedArtistDeepLinkSlug(undefined);
                        }}>
                        <>
                          <CircleArrowLeft />
                          <span className="ml-2">Back to All Artists</span>
                        </>
                      </Button>

                      <div className="artist-bio w-[300px] md:w-full flex flex-row">
                        <div
                          className="relative border-[0.5px] border-neutral-500/90 h-[100px] md:h-[320px] w-[400px] flex-1 bg-no-repeat bg-cover rounded-xl"
                          style={{
                            "backgroundImage": `url(${artistProfile.img})`,
                          }}>
                          <div className="bg-black absolute bottom-0 w-[100%] p-2 rounded-b-xl">
                            <h2 className={`!text-lg !text-white lg:!text-xl text-nowrap text-center`}>{artistProfile.name}</h2>
                          </div>
                        </div>

                        {/* artists details and power up */}
                        <div className="p-5 flex-1">
                          <div className="flex flex-col md:flex-row items-center">
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
                              <div className="flex flex-col md:flex-row mt-5 flex-wrap">
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
                      </div>

                      <div className="artist-discography w-[300px] lg:w-full">
                        <p className="mt-5 mb-5 text-xl font-bold">NF-Tunes Discography</p>

                        <ArtistDiscography
                          albums={artistProfile.albums}
                          bountyBitzSumGlobalMapping={bountyBitzSumGlobalMapping}
                          onSendBitzForMusicBounty={onSendBitzForMusicBounty}
                          artistProfile={artistProfile}
                          isPreviewPlaying={isPreviewPlaying}
                          previewIsReadyToPlay={previewIsReadyToPlay}
                          playPausePreview={playPausePreview}
                          previewPlayingForAlbumId={previewPlayingForAlbumId}
                          currentTime={currentTime}
                          mvxNetworkSelected={mvxNetworkSelected}
                          isFreeDropSampleWorkflow={isFreeDropSampleWorkflow}
                          checkOwnershipOfAlbum={checkOwnershipOfAlbum}
                          viewSolData={viewSolData}
                          viewMvxData={viewMvxData}
                          openActionFireLogic={openActionFireLogic}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
