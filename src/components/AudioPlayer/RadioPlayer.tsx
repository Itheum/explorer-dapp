import React, { useEffect, useState, memo } from "react";
import { faHandPointer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Loader2, Pause, Music2, Play, RefreshCcwDot, SkipBack, SkipForward, Volume1, Volume2, VolumeX, Gift, ShoppingCart } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./AudioPlayer.css";
import DEFAULT_SONG_IMAGE from "assets/img/audio-player-image.png";
import DEFAULT_SONG_LIGHT_IMAGE from "assets/img/audio-player-light-image.png";
import { Button } from "libComponents/Button";
import { getApiWeb2Apps } from "libs/utils";
import { gtagGo } from "libs/utils/misc";
import { toastClosableError } from "libs/utils/uiShared";
import { useAppsStore } from "store/apps";

type RadioPlayerProps = {
  songs?: any;
  stopRadioNow?: boolean;
  noAutoPlay?: boolean;
  onPlayHappened?: any;
  checkOwnershipOfAlbum: (e: any) => any;
  mvxNetworkSelected: boolean;
  viewSolData: (e: number) => void;
  viewMvxData: (e: number) => void;
  openActionFireLogic?: any;
};

let firstInteractionWithPlayDone = false; // a simple flag so we can track usage on 1st time user clicks on play (as the usage for first track wont capture like other tracks)
let firstMusicQueueDone = false;

// @TODO figure out why memo does not work, when we play, this comp keeps rerendering
export const RadioPlayer = memo(function RadioPlayerBase(props: RadioPlayerProps) {
  const { songs, stopRadioNow, onPlayHappened, checkOwnershipOfAlbum, mvxNetworkSelected, viewSolData, viewMvxData, openActionFireLogic } = props;

  const theme = localStorage.getItem("explorer-ui-theme");
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [audio] = useState(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState("00:00");
  const [isLoaded, setIsLoaded] = useState(false);
  const [songSource, setSongSource] = useState<{ [key: number]: string }>({}); // map to keep the already fetched songs
  const appsStore = useAppsStore();
  const [radioPlayPromptHide, setRadioPlayPromptHide] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  function eventToAttachEnded() {
    setCurrentTrackIndex((prevCurrentTrackIndex) => (prevCurrentTrackIndex < songs.length - 1 ? prevCurrentTrackIndex + 1 : 0));
  }

  function eventToAttachTimeUpdate() {
    updateProgress();
  }

  function eventToAttachCanPlayThrough() {
    // Audio is ready to be played
    setIsLoaded(true);
    updateProgress();
    // play the song
    if (audio.currentTime == 0) togglePlay();
  }

  function eventToAttachPlaying() {
    setIsPlaying(true);

    if (onPlayHappened) {
      onPlayHappened(true);
    }
  }

  useEffect(() => {
    audio.addEventListener("ended", eventToAttachEnded);
    audio.addEventListener("timeupdate", eventToAttachTimeUpdate);
    audio.addEventListener("canplaythrough", eventToAttachCanPlayThrough);
    audio.addEventListener("playing", eventToAttachPlaying);

    if (songs) {
      songs?.forEach((song: any) => {
        fetchSong(song.idx);
      });

      updateProgress();
    }

    return () => {
      firstMusicQueueDone = false; // reset it here so when user leaves app and comes back, we don't auto play again
      firstInteractionWithPlayDone = false;
      audio.pause();
      audio.removeEventListener("ended", eventToAttachEnded);
      audio.removeEventListener("timeupdate", eventToAttachTimeUpdate);
      audio.removeEventListener("canplaythrough", eventToAttachCanPlayThrough);
      audio.removeEventListener("playing", eventToAttachPlaying);
    };
  }, []);

  useEffect(() => {
    if (stopRadioNow) {
      stopPlaybackNow();
    }
  }, [stopRadioNow]);

  useEffect(() => {
    updateProgress();
  }, [audio.src]);

  useEffect(() => {
    audio.pause();
    audio.src = "";
    setIsPlaying(false);
    setIsLoaded(false);
    handleChangeSong();
  }, [currentTrackIndex, songSource[songs[currentTrackIndex]?.idx]]);

  // format time as minutes:seconds
  const formatTime = (_seconds: number) => {
    const minutes = Math.floor(_seconds / 60);
    const remainingSeconds = Math.floor(_seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, "0"); // Ensure two digits
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const fetchSong = async (index: number) => {
    try {
      setSongSource((prevState) => ({
        ...prevState, // keep all other key-value pairs
        [index]: "Fetching", // update the value of specific key
      }));

      let errMsg = null;
      let blobUrl = "";

      try {
        const trackIndex = index - 1;
        const nfTunesRadioFirstTrackCachedBlob = appsStore.nfTunesRadioFirstTrackCachedBlob;

        // if we have cached the first song blob when Explorer loaded, then just load that from the cache direct to start the playback fast
        if (trackIndex === 0 && nfTunesRadioFirstTrackCachedBlob && nfTunesRadioFirstTrackCachedBlob.trim() !== "") {
          blobUrl = nfTunesRadioFirstTrackCachedBlob;
          console.log(`Track ${trackIndex} Loaded from cache`);
        } else {
          console.log(`Track ${trackIndex} Loading on-Demand`);
          const blob = await fetch(songs[trackIndex].stream).then((r) => r.blob());
          blobUrl = URL.createObjectURL(blob);
        }
      } catch (error: any) {
        errMsg = error.toString();
      }

      if (!errMsg) {
        setSongSource((prevState) => ({
          ...prevState, // keep all other key-value pairs
          [index]: blobUrl, // update the value of specific key
        }));
      } else {
        setSongSource((prevState) => ({
          ...prevState,
          [index]: "Error: " + errMsg,
        }));
      }
    } catch (err) {
      setSongSource((prevState) => ({
        ...prevState,
        [index]: "Error: " + (err as Error).message,
      }));
      console.error("error : ", err);
    }
  };

  const updateProgress = () => {
    setCurrentTime(audio.currentTime ? formatTime(audio.currentTime) : "00:00");
    setDuration(audio.duration ? formatTime(audio.duration) : "00:00");
    let _percentage = (audio.currentTime / audio.duration) * 100;
    if (isNaN(_percentage)) _percentage = 0;
    setProgress(_percentage);
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (!audio.paused) {
        audio.pause();
        setIsPlaying(false);
      }
    } else {
      if (audio.readyState >= 2) {
        if (!firstMusicQueueDone) {
          // its the first time the radio loaded and the first track is ready, but we don't auto play
          // ... we use a local global variable here instead of state var as its only needed once
          firstMusicQueueDone = true;
        } else {
          // Audio is loaded, play it.
          audio.play();

          // once they interact with the radio play, then no longer need to show the bouncing animation
          if (!radioPlayPromptHide) {
            setRadioPlayPromptHide(true);
          }
        }
      } else {
        toastClosableError("Audio not ready yet. Waiting for loading to complete...");
        return;
      }
    }
  };

  const stopPlaybackNow = () => {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const handlePrevButton = () => {
    if (currentTrackIndex <= 0) {
      setCurrentTrackIndex(songs.length - 1);
      return;
    }
    setCurrentTrackIndex((prevCurrentTrackIndex) => prevCurrentTrackIndex - 1);
  };

  const handleNextButton = () => {
    if (currentTrackIndex >= songs.length - 1) {
      setCurrentTrackIndex(0);
      return;
    }

    setCurrentTrackIndex((prevCurrentTrackIndex) => prevCurrentTrackIndex + 1);
  };

  const repeatTrack = () => {
    audio.currentTime = 0;
    if (isPlaying) audio.play();
  };

  const handleProgressChange = (newProgress: number) => {
    if (!audio.duration) return;
    const newTime = (newProgress / 100) * audio.duration;
    audio.currentTime = newTime;
    setCurrentTime(formatTime(audio.currentTime));
    setProgress(newProgress);
  };

  const handleChangeSong = () => {
    console.log("image loading... ");

    // we should not do the image loading logic on until user interacts with play, or there is a race condition and 1st image stays blurred
    if (firstMusicQueueDone) {
      setImgLoading(true);
    }

    const index = songs[currentTrackIndex]?.idx;

    if (songSource[index]) {
      // if we previously fetched the song and it was an error, show again the exact error.
      if (songSource[index].includes("Error:")) {
        toastClosableError(songSource[index]);
      } else if (!(songSource[index] === "Fetching")) {
        audio.src = songSource[index];
        audio.load();
        updateProgress();
        audio.currentTime = 0;

        // doing the radioPlayPromptHide checks makes sure track 1 usage does not get sent until user actually plays
        if (radioPlayPromptHide) {
          logTrackUsageMetrics(index);
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
    return true;
  };

  const logTrackUsageMetrics = async (trackIdx?: number) => {
    console.log(`====> log usage metrics for trackIdx ${trackIdx}`);

    try {
      let logMetricsAPI = `${getApiWeb2Apps()}/datadexapi/nfTunesApp/logMusicTrackStreamMetrics?trackIdx=${trackIdx}`;

      const logRes = await axios.get(logMetricsAPI);
      const logResData = logRes.data;

      if (logResData?.error) {
        console.error("NF-Tunes Radio logTrackUsageMetrics failed");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // is it a airdrop or buy option
  let currSongObj = null;
  let getAlbumActionText = null;
  let getAlbumActionLink = null;
  let isAlbumForFree = false;
  let checkedOwnershipOfAlbumAndItsIndex = -1;

  if (songs && songs.length > 0) {
    currSongObj = songs[currentTrackIndex];
    checkedOwnershipOfAlbumAndItsIndex = checkOwnershipOfAlbum(currSongObj);

    if (currSongObj?.buy) {
      getAlbumActionLink = currSongObj.buy;
      getAlbumActionText = checkedOwnershipOfAlbumAndItsIndex > -1 ? "Buy More Album Copies" : "Buy Album";
      getAlbumActionText = "Buy Album";
    } else if (currSongObj?.airdrop) {
      getAlbumActionLink = currSongObj.airdrop;
      getAlbumActionText = "Get Album for Free!";
      isAlbumForFree = true;
    }
  }

  return (
    <div className="p-2 md:p-2 relative overflow-visible">
      <div className="overflow-visible w-full flex flex-col bg-bgWhite dark:bg-bgDark items-center justify-center relative">
        <div className="select-none h-[30%] bg-[#FaFaFa]/25 dark:bg-[#0F0F0F]/25 border-[1px] border-foreground/40 relative md:w-[100%] flex flex-col rounded-xl">
          <div className="px-5 pt-5 pb-4 flex flex-col md:flex-row items-center">
            <img
              src={songs ? songs[currentTrackIndex]?.cover_art_url : ""}
              alt="Album Cover"
              className={`select-none w-24 h-24 rounded-md md:mr-6 border border-grey-900 ${imgLoading ? "blur-sm" : "blur-none"}`}
              onLoad={() => {
                console.log("image loaded");
                setImgLoading(false);
              }}
              onError={({ currentTarget }) => {
                currentTarget.src = theme === "light" ? DEFAULT_SONG_LIGHT_IMAGE : DEFAULT_SONG_IMAGE;
              }}
            />

            <div className="flex flex-col select-text text-center md:text-left">
              <div>
                <span className="font-sans text-lg font-medium leading-7 text-foreground">{songs[currentTrackIndex]?.title}</span>{" "}
              </div>

              <span className="font-sans text-lg font-medium leading-6 text-foreground">{songs[currentTrackIndex]?.artist}</span>
              <span className="font-sans text-base font-medium leading-6 text-muted-foreground">{songs[currentTrackIndex]?.album}</span>
            </div>

            {getAlbumActionLink && (
              <div className="flex mt-3 md:mt-0 flex-grow justify-end">
                <div className="mt-3 flex flex-col lg:flex-row space-y-2 lg:space-y-0">
                  {checkedOwnershipOfAlbumAndItsIndex > -1 && (
                    <Button
                      className={`${isAlbumForFree ? "!text-white" : "!text-black"} text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r ${isAlbumForFree ? "from-yellow-700 to-orange-800" : "from-yellow-300 to-orange-500"}  transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100 md:mr-[12px]`}
                      variant="ghost"
                      onClick={() => {
                        const albumInOwnershipListIndex = checkedOwnershipOfAlbumAndItsIndex;

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

                        gtagGo("NtuRadio", "CTA", "PlayAlbum");
                      }}>
                      <>
                        <Music2 />
                        <span className="ml-2">Play Full Album</span>
                      </>
                    </Button>
                  )}

                  <Button
                    className={`${isAlbumForFree ? "!text-white" : "!text-black"} text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r ${isAlbumForFree ? "from-yellow-700 to-orange-800" : "from-yellow-300 to-orange-500"}  transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100`}
                    variant="ghost"
                    onClick={() => {
                      if (isAlbumForFree) {
                        gtagGo("NtuRadio", "CTA", "GetAlbum");
                      } else {
                        gtagGo("NtuRadio", "CTA", "BuyAlbum");
                      }

                      window.open(getAlbumActionLink)?.focus();
                    }}>
                    <>
                      {isAlbumForFree ? <Gift /> : <ShoppingCart />}
                      <span className="ml-2">{getAlbumActionText}</span>
                    </>
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="gap-2 text-foreground select-none w-full flex flex-row justify-center items-center px-10 pb-6">
            <span className="w-[4rem] p-2 text-xs font-sans font-medium text-muted-foreground">{currentTime}</span>
            <input
              type="range"
              min="0"
              max="100"
              step="0.01"
              value={progress}
              onChange={(e) => handleProgressChange(Number(e.target.value))}
              className="accent-black dark:accent-white w-full bg-white mx-auto  focus:outline-none cursor-pointer"
            />{" "}
            <span className="w-[4rem] p-2 text-xs font-sans font-medium text-muted-foreground ">{duration}</span>
          </div>

          <div className="select-none p-2 bg-[#0f0f0f]/10 dark:bg-[#0F0F0F]/50 rounded-b-xl border-t border-gray-400 dark:border-gray-900  flex items-center justify-between z-10 ">
            <div className="ml-2 xl:pl-8 flex w-[20%]">
              {volume === 0 ? <VolumeX /> : volume >= 0.5 ? <Volume2 /> : <Volume1 />}
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="accent-black dark:accent-white w-[70%] cursor-pointer ml-2 "></input>
            </div>

            <button
              className="cursor-pointer"
              onClick={() => {
                handlePrevButton();

                gtagGo("NtuRadio", "Controls", "Prev");
              }}>
              <SkipBack className="w-full hover:scale-105" />
            </button>

            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900/0 border border-grey-300 shadow-xl flex items-center justify-center">
                <button
                  onClick={() => {
                    // for the first time user clicks on play only, track the usage of the first track
                    if (!firstInteractionWithPlayDone) {
                      firstInteractionWithPlayDone = true;
                      logTrackUsageMetrics(1);
                    }

                    togglePlay();

                    gtagGo("NtuRadio", "Controls", "PlayToggle");
                  }}
                  className="focus:outline-none"
                  disabled={!isLoaded}>
                  {!isLoaded ? (
                    <Loader2 className="w-full text-center animate-spin hover:scale-105" />
                  ) : isPlaying ? (
                    <Pause className="w-full text-center hover:scale-105" />
                  ) : (
                    <Play className="w-full text-center hover:scale-105" />
                  )}
                </button>
              </div>

              {isLoaded && !isPlaying && !radioPlayPromptHide && (
                <div className="animate-bounce p-3 text-sm absolute w-[100px] ml-[-18px] mt-[12px] text-center">
                  <div className="m-auto mb-[2px] bg-white dark:bg-slate-800 p-2 w-10 h-10 ring-1 ring-slate-900/5 dark:ring-slate-200/20 shadow-lg rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faHandPointer} />
                  </div>
                  <span className="text-center">Play Radio</span>
                </div>
              )}
            </div>

            <button
              className="cursor-pointer"
              onClick={() => {
                handleNextButton();

                gtagGo("NtuRadio", "Controls", "Next");
              }}>
              <SkipForward className="w-full hover:scale-105" />
            </button>

            <button
              className="cursor-pointer mr-2 xl:pr-8"
              onClick={() => {
                repeatTrack();

                gtagGo("NtuRadio", "Controls", "Repeat");
              }}>
              <RefreshCcwDot className="w-full hover:scale-105" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
