import { useEffect, useState } from "react";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { ArrowBigLeft, Loader2, Play, Pause, Library, RefreshCcwDot, Volume2, Volume1, VolumeX, SkipBack, SkipForward } from "lucide-react";

import DEFAULT_SONG_IMAGE from "assets/img/audio-player-image.png";
import DEFAULT_SONG_LIGHT_IMAGE from "assets/img/audio-player-light-image.png";
import { toastError } from "libs/utils";
import { DataNft, ViewDataReturnType } from "@itheum/sdk-mx-data-nft/out";

type AudioPlayerProps = {
  dataNftToOpen: DataNft;
  songs: any;
  tokenLogin: any;
};

export const AudioPlayer = (props: AudioPlayerProps) => {
  useEffect(() => {
    audio.onended = function () {
      setIsPlaying(false);
    };
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("canplaythrough", function () {
      // Audio is ready to be played
      setIsLoaded(true);
      updateProgress();
      // play the song
      if (audio.currentTime == 0) togglePlay();
    });
    props.songs?.forEach((song: any) => {
      ///TODO if there are more than 10 songs, analyze this
      fetchMarshalForSong(song.idx);
    });
    updateProgress();

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("canplaythrough", function () {
        setIsLoaded(false);
      });
    };
  }, []);

  let settings = {
    infinite: false,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1800,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide:0,
        },
      },
      {
        breakpoint: 980,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide: 0,
        },
      },

      {
        breakpoint: 730,
        settings: {
          slidesToShow: 2,
          slidesToScroll:2,
        },
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 1,
          slidesToScroll:1,
        },
      },
    ],
  };

  const theme = localStorage.getItem("explorer-ui-theme");
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [displayPlaylist, setDisplayPlaylist] = useState(false);

  const [audio] = useState(new Audio());

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState("00:00");
  const [isLoaded, setIsLoaded] = useState(false);

  // map to keep the already fetched songs
  const [songSource, setSongSource] = useState<{ [key: number]: string }>({});

  /// format time as minutes:seconds
  const formatTime = (_seconds: number) => {
    const minutes = Math.floor(_seconds / 60);
    const remainingSeconds = Math.floor(_seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, "0"); // Ensure two digits
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  /// fetch song from Marshal
  const fetchMarshalForSong = async (index: number) => {
    if (songSource[index] === undefined) {
      try {
        setSongSource((prevState) => ({
          ...prevState, // keep all other key-value pairs
          [index]: "Fetching", // update the value of specific key
        }));
        /// if not previously fetched, fetch now and save the url of the blob
        const res: ViewDataReturnType = await props.dataNftToOpen.viewDataViaMVXNativeAuth({
          mvxNativeAuthOrigins: [window.location.origin],
          mvxNativeAuthMaxExpirySeconds: 3000,

          fwdHeaderMapLookup: {
            "authorization": `Bearer ${props.tokenLogin?.nativeAuthToken}`,
          },

          stream: true,
          nestedIdxToStream: index, ///   get the song for the current index
        });

        if (!res.error) {
          const blobUrl = URL.createObjectURL(res.data);

          setSongSource((prevState) => ({
            ...prevState, // keep all other key-value pairs
            [index]: blobUrl, // update the value of specific key
          }));
        } else {
          setSongSource((prevState) => ({
            ...prevState,
            [index]: "Error: " + res.error,
          }));
        }
      } catch (err) {
        setSongSource((prevState) => ({
          ...prevState,
          [index]: "Error: " + (err as Error).message,
        }));
        console.error("error : ", err);
      }
    }
  };

  const updateProgress = () => {
    setCurrentTime(audio.currentTime ? formatTime(audio.currentTime) : "00:00");
    setDuration(audio.duration ? formatTime(audio.duration) : "00:00");
    let _percentage = (audio.currentTime / audio.duration) * 100;
    if (isNaN(_percentage)) _percentage = 0;
    setProgress(_percentage);
  };

  useEffect(() => {
    updateProgress();
  }, [audio.src]);

  const togglePlay = () => {
    if (isPlaying) {
      if (!audio.paused) {
        audio.pause();
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
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (newVolume: number) => {
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const handlePrevButton = () => {
    if (currentTrackIndex <= 0) {
      setCurrentTrackIndex(props.songs.length - 1);
      return;
    }
    setCurrentTrackIndex((prevCurrentTrackIndex) => prevCurrentTrackIndex - 1);
  };

  const handleNextButton = () => {
    if (currentTrackIndex >= props.songs.length - 1) {
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
    const index = props.songs[currentTrackIndex]?.idx;

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

  useEffect(() => {
    audio.pause();
    setIsPlaying(false);
    setIsLoaded(false);
    handleChangeSong();
  }, [currentTrackIndex, songSource[props.songs[currentTrackIndex]?.idx]]);

  const showPlaylist = () => {
    setDisplayPlaylist(true);
  };

  return (
    <div className="p-12 relative overflow-hidden">
      {displayPlaylist ? (
        <div className="w-full h-[500px] overflow-hidden">
          <button
            className="border-[1px] border-foreground/40 select-none flex flex-col items-center justify-center md:flex-row bg-[#fafafa]/50 dark:bg-[#0f0f0f]/25  p-2 gap-2 text-xs relative cursor-pointer  transition-shadow duration-300 shadow-xl hover:shadow-inner hover:shadow-sky-200 dark:hover:shadow-teal-200   bg-[#27293d] rounded-2xl overflow-hidden   "
            onClick={() => setDisplayPlaylist(false)}>
            <ArrowBigLeft />
          </button>
          <div className=" grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mx-4  mt-6 mb-20">
            {props.songs.map((song: any, index: number) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    setCurrentTrackIndex(index);
                    setDisplayPlaylist(false);
                  }}
                  className={`border-[1px] border-foreground/40 select-none flex flex-col items-center justify-center md:flex-row bg-[#fafafa]/50 dark:bg-[#0f0f0f]/25  p-2 gap-2 text-xs relative cursor-pointer  transition-shadow duration-300 shadow-xl hover:shadow-inner hover:shadow-sky-200 dark:hover:shadow-teal-200   bg-[#27293d] rounded-2xl overflow-hidden text-white `}>
                  <div className="w-[80%] md:w-[60%] h-32 flex items-center justify-center">
                    <img
                      src={song.cover_art_url}
                      alt={"Not Loaded"}
                      className={`flex items-center justify-center w-24 h-24 rounded-md border border-grey-900 `}
                      onError={({ currentTarget }) => {
                        currentTarget.src = theme === "light" ? DEFAULT_SONG_LIGHT_IMAGE : DEFAULT_SONG_IMAGE;
                      }}
                    />
                  </div>

                  <div className="w-8/12 flex flex-col items-center justify-center">
                    <h6 className=" truncate text-base text-gray-700 dark:text-slate-300">{song.title}</h6>

                    <p className="truncate text-sm text-center text-gray-700 dark:text-slate-300 ">{song.artist}</p>
                    <p className="text-xs text-center text-gray-400">{song.album}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="overflow-hidden  w-full   flex flex-col bg-bgWhite dark:bg-bgDark items-center justify-center">
          <div className=" select-none h-[30%] bg-[#FaFaFa]/25 dark:bg-[#0F0F0F]/25   border-[1px] border-foreground/40  relative md:w-[60%] flex flex-col rounded-xl">
            <div className="px-10 pt-10 pb-4 flex items-center">
              <img
                src={props.songs[currentTrackIndex]?.cover_art_url}
                alt="Album Cover"
                className=" select-none w-24 h-24 rounded-md mr-6 border border-grey-900"
                onError={({ currentTarget }) => {
                  currentTarget.src = theme === "light" ? DEFAULT_SONG_LIGHT_IMAGE : DEFAULT_SONG_IMAGE;
                }}
              />

              <div className="flex flex-col select-text">
                <div>
                  <span className="font-sans text-lg font-medium leading-7 text-slate-900 dark:text-white">{props.songs[currentTrackIndex]?.title}</span>{" "}
                  <span className="ml-2 font-sans text-base font-medium   text-gray-500 dark:text-gray-400">
                    {props.songs[currentTrackIndex]?.date.split("T")[0]}
                  </span>
                </div>

                <span className="font-sans text-base font-medium text-gray-500 dark:text-gray-400">{props.songs[currentTrackIndex]?.category}</span>
                <span className="font-sans text-lg font-medium leading-6 text-slate-900 dark:text-white">{props.songs[currentTrackIndex]?.artist}</span>
                <span className="font-sans text-base font-medium leading-6 text-gray-500 dark:text-gray-400">{props.songs[currentTrackIndex]?.album}</span>
              </div>
            </div>

            <div className="gap-2 text-white select-none w-full flex flex-row justify-center items-center px-10 pb-6 ">
              <span className="w-12 p-2 text-xs font-sans font-medium  text-gray-500 ">{currentTime}</span>
              <input
                type="range"
                min="0"
                max="100"
                step="0.01"
                value={progress}
                onChange={(e) => handleProgressChange(Number(e.target.value))}
                className="accent-black dark:accent-white w-full bg-white mx-auto  focus:outline-none cursor-pointer"
              />{" "}
              <span className="p-2 text-xs font-sans font-medium text-gray-500 ">{duration}</span>
            </div>

            <div className="select-none p-2 bg-[#0f0f0f]/10 dark:bg-[#0F0F0F]/50 rounded-b-xl   border-t border-gray-400 dark:border-gray-900  flex items-center justify-between z-10 ">
              <div className="ml-2 xl:pl-8 flex w-[20%]">
                {volume === 0 ? <VolumeX /> : volume >= 0.5 ? <Volume2 /> : <Volume1 />}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="accent-black dark:accent-white  w-[70%] cursor-pointer ml-2 "></input>
              </div>
              <button className="cursor-pointer" onClick={handlePrevButton}>
                <SkipBack />
              </button>
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900/0 border border-grey-300 shadow-xl flex items-center justify-center">
                <button onClick={togglePlay} className="focus:outline-none" disabled={!isLoaded}>
                  {!isLoaded ? <Loader2 className="animate-spin " /> : isPlaying ? <Pause /> : <Play className="ml-1" />}
                </button>
              </div>
              <button className="cursor-pointer" onClick={handleNextButton}>
                <SkipForward />
              </button>
              <button className="cursor-pointer   " onClick={repeatTrack}>
                <RefreshCcwDot />
              </button>
              <button className="mr-2  xl:pr-8" onClick={showPlaylist}>
                <Library />
              </button>
            </div>
          </div>
          <div className="w-[80%] 2xl:w-[70%] mt-8 mx-auto">
            <h4 className="select-none flex justify-start font-semibold dark:text-white mt-4 mb-2   ">{`Tracklist ${props.songs.length} songs`} </h4>
            <Slider {...settings}>
              {props.songs.map((song: any, index: number) => {
                return (
                  <div key={index} className=" w-32 xl:w-64 shadow-none flex items-center justify-center">
                    <div
                      onClick={() => {
                        setCurrentTrackIndex(index);
                      }}
                      className={`mx-auto w-32 xl:w-64 select-none flex flex-col xl:flex-row items-center justify-center
                     bg-[#fafafa]/25 dark:bg-[#0f0f0f]/25
                     cursor-pointer transition-shadow duration-300 shadow-xl hover:shadow-inner hover:shadow-teal-200   rounded-2xl text dark:text-white border-[1px] border-foreground/40  `}>
                      <div className="w-[80%] xl:w-[40%] justify-center">
                        <img
                          src={song.cover_art_url}
                          alt="Album Cover"
                          className="h-24 p-2 rounded-md"
                          onError={({ currentTarget }) => {
                            currentTarget.src = theme === "light" ? DEFAULT_SONG_LIGHT_IMAGE : DEFAULT_SONG_IMAGE;
                          }}
                        />
                      </div>
                      <div className=" xl:w-[60%] flex flex-col justify-center text-center  ">
                        <h6 className="font-semibold truncate ">{song.title}</h6>
                        <p className="aray-400 truncate">{song.artist}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
            <style>
              {`
              
                /* CSS styles for Swiper navigation arrows  */
                .slick-prev:before,
                .slick-next:before {
                color: ${theme === "light" ? "black;" : "white;"},
                    }`}
            </style>
          </div>
        </div>
      )}
      <div className="z-[-1]   ml-[-10%]  mt-[-25%] h-[50%] w-[60%] opacity-75 blur-[300px] absolute bg-[#00C797] rounded-full"> </div>
      <div className="z-[-1]   mt-[-15%] ml-[40%] h-[50%] w-[60%] opacity-75 blur-[300px] absolute bg-[#3D00EA] rounded-full "> </div>
    </div>
  );
};
