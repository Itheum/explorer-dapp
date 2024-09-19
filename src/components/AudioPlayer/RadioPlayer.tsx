import { useEffect, useState } from "react";
import { Loader2, Pause, Play, RefreshCcwDot, SkipBack, SkipForward, Volume1, Volume2, VolumeX, Gift, ShoppingCart } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./AudioPlayer.css";
import DEFAULT_SONG_IMAGE from "assets/img/audio-player-image.png";
import DEFAULT_SONG_LIGHT_IMAGE from "assets/img/audio-player-light-image.png";
import { Button } from "libComponents/Button";
import { toastError } from "libs/utils";
import { useAppsStore } from "store/apps";

type RadioPlayerProps = {
  songs?: any;
  stopRadioNow?: boolean;
  onPlayHappened?: any;
};

export const RadioPlayer = (props: RadioPlayerProps) => {
  const { songs, stopRadioNow, onPlayHappened } = props;

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

  useEffect(() => {
    audio.addEventListener("ended", function () {
      setCurrentTrackIndex((prevCurrentTrackIndex) => (prevCurrentTrackIndex < songs.length - 1 ? prevCurrentTrackIndex + 1 : 0));
    });

    audio.addEventListener("timeupdate", function () {
      updateProgress();
    });

    audio.addEventListener("canplaythrough", function () {
      // Audio is ready to be played
      setIsLoaded(true);
      updateProgress();
      // play the song
      if (audio.currentTime == 0) togglePlay();
    });

    audio.addEventListener("playing", function () {
      setIsPlaying(true);

      if (onPlayHappened) {
        onPlayHappened(true);
      }
    });

    if (songs) {
      songs?.forEach((song: any) => {
        fetchSong(song.idx);
      });

      updateProgress();
    }

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("canplaythrough", function () {
        setIsLoaded(false);
      });
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
          console.log("nfTunesRadioFirstTrackCachedBlob ", nfTunesRadioFirstTrackCachedBlob);
        } else {
          console.log(`Track ${trackIndex} Loading on-Demand`);
          const blob = await fetch(songs[trackIndex].stream).then((r) => r.blob());
          blobUrl = URL.createObjectURL(blob);
        }

        console.log("blobUrl ", blobUrl);
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
        // Audio is loaded, play it.
        audio.play();
      } else {
        toastError("Audio not ready yet. Waiting for loading to complete...");
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
    const index = songs[currentTrackIndex]?.idx;

    if (songSource[index]) {
      // if we previously fetched the song and it was an error, show again the exact error.
      if (songSource[index].includes("Error:")) {
        toastError(songSource[index]);
      } else if (!(songSource[index] === "Fetching")) {
        audio.src = songSource[index];
        audio.load();
        updateProgress();
        audio.currentTime = 0;
      } else {
        return false;
      }
    } else {
      return false;
    }
    return true;
  };

  // is it a airdrop or buy option
  let currSongObj = null;
  let getAlbumActionText = null;
  let getAlbumActionLink = null;
  let isAlbumForFree = false;

  if (songs && songs.length > 0) {
    currSongObj = songs[currentTrackIndex];

    if (currSongObj?.buy) {
      getAlbumActionLink = currSongObj.buy;
      getAlbumActionText = "Buy Album";
    } else if (currSongObj?.airdrop) {
      getAlbumActionLink = currSongObj.airdrop;
      getAlbumActionText = "Get Album for Free!";
      isAlbumForFree = true;
    }
  }

  return (
    <div className="p-2 md:p-2 relative overflow-hidden">
      <div className="overflow-hidden w-full flex flex-col bg-bgWhite dark:bg-bgDark items-center justify-center">
        <div className="select-none h-[30%] bg-[#FaFaFa]/25 dark:bg-[#0F0F0F]/25 border-[1px] border-foreground/40 relative md:w-[100%] flex flex-col rounded-xl">
          <div className="px-5 pt-5 pb-4 flex flex-col md:flex-row items-center">
            <img
              src={songs ? songs[currentTrackIndex]?.cover_art_url : ""}
              alt="Album Cover"
              className="select-none w-24 h-24 rounded-md md:mr-6 border border-grey-900"
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
                <div className="flex flex-col">
                  <Button
                    className={`!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r ${isAlbumForFree ? "from-yellow-700 to-orange-800" : "from-yellow-300 to-orange-500"}  transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100`}
                    variant="ghost"
                    onClick={() => {
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
            <button className="cursor-pointer" onClick={handlePrevButton}>
              <SkipBack className="w-full hover:scale-105" />
            </button>
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900/0 border border-grey-300 shadow-xl flex items-center justify-center">
              <button onClick={togglePlay} className="focus:outline-none" disabled={!isLoaded}>
                {!isLoaded ? (
                  <Loader2 className="w-full text-center animate-spin hover:scale-105" />
                ) : isPlaying ? (
                  <Pause className="w-full text-center hover:scale-105" />
                ) : (
                  <Play className="w-full text-center hover:scale-105" />
                )}
              </button>
            </div>
            <button className="cursor-pointer" onClick={handleNextButton}>
              <SkipForward className="w-full hover:scale-105" />
            </button>
            <button className="cursor-pointer mr-2 xl:pr-8" onClick={repeatTrack}>
              <RefreshCcwDot className="w-full hover:scale-105" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
