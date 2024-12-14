import { useEffect, useState } from "react";
import { DataNft, ViewDataReturnType } from "@itheum/sdk-mx-data-nft/out";
import { ArrowBigLeft, Library, Loader2, Pause, Play, RefreshCcwDot, SkipBack, SkipForward, Volume1, Volume2, VolumeX, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./AudioPlayer.css";
import DEFAULT_SONG_IMAGE from "assets/img/audio-player-image.png";
import DEFAULT_SONG_LIGHT_IMAGE from "assets/img/audio-player-light-image.png";
import { MARSHAL_CACHE_DURATION_SECONDS } from "config";
import { decodeNativeAuthToken, getApiDataMarshal } from "libs/utils";
import { toastClosableError } from "libs/utils/uiShared";

type MvxAudioPlayerProps = {
  dataNftToOpen?: DataNft;
  songs?: any;
  tokenLogin?: any;
  firstSongBlobUrl?: string;
  previewUrl?: string;
  chainID?: string;
};

export const MvxAudioPlayer = (props: MvxAudioPlayerProps) => {
  const { dataNftToOpen, songs, tokenLogin, firstSongBlobUrl, previewUrl, chainID } = props;

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
  const [songSource, setSongSource] = useState<{ [key: number]: string }>({}); // map to keep the already fetched songs
  const settings = {
    infinite: false,
    speed: 1000,
    slidesToShow: 4,
    responsive: [
      {
        breakpoint: 1800,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 980,
        settings: {
          slidesToShow: 3,
        },
      },

      {
        breakpoint: 730,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  const [imgLoading, setImgLoading] = useState(false);

  useEffect(() => {
    if (firstSongBlobUrl) {
      setSongSource((prevState) => ({
        ...prevState, // keep all other key-value pairs
        [1]: firstSongBlobUrl, // update the value of the first index
      }));
    }

    audio.addEventListener("ended", function () {
      setCurrentTrackIndex((prevCurrentTrackIndex) => (prevCurrentTrackIndex < songs.length - 1 ? prevCurrentTrackIndex + 1 : 0));
    });

    audio.addEventListener("timeupdate", updateProgress);

    audio.addEventListener("canplaythrough", function () {
      // Audio is ready to be played
      setIsLoaded(true);
      updateProgress();
      // play the song
      if (audio.currentTime == 0) togglePlay();
    });

    if (songs) {
      songs?.forEach((song: any) => {
        if (song.idx === 1) return;
        fetchMarshalForSong(song.idx);
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
    updateProgress();
  }, [audio.src]);

  useEffect(() => {
    if (firstSongBlobUrl)
      setSongSource((prevState) => ({
        ...prevState, // keep all other key-value pairs
        [1]: firstSongBlobUrl, // update the value of the first index
      }));
  }, [firstSongBlobUrl]);

  useEffect(() => {
    audio.pause();
    audio.src = "";
    setIsPlaying(false);
    setIsLoaded(false);
    handleChangeSong();
  }, [currentTrackIndex, songSource[songs[currentTrackIndex]?.idx]]);

  useEffect(() => {
    if (previewUrl) {
      audio.pause();
      audio.src = previewUrl;
      setIsPlaying(false);
      setIsLoaded(false);
      handleChangeSong();
    }
  }, [previewUrl]);

  // format time as minutes:seconds
  const formatTime = (_seconds: number) => {
    const minutes = Math.floor(_seconds / 60);
    const remainingSeconds = Math.floor(_seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, "0"); // Ensure two digits
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  // fetch song from Marshal
  const fetchMarshalForSong = async (index: number) => {
    if (songSource[index] === undefined) {
      try {
        setSongSource((prevState) => ({
          ...prevState, // keep all other key-value pairs
          [index]: "Fetching", // update the value of specific key
        }));

        // if not previously fetched, fetch now and save the url of the blob
        if (dataNftToOpen) {
          if (!dataNftToOpen.dataMarshal || dataNftToOpen.dataMarshal === "") {
            dataNftToOpen.updateDataNft({ dataMarshal: getApiDataMarshal(chainID ?? "D") });
          }
          const res: ViewDataReturnType = await dataNftToOpen.viewDataViaMVXNativeAuth({
            mvxNativeAuthOrigins: [decodeNativeAuthToken(tokenLogin.nativeAuthToken).origin],
            mvxNativeAuthMaxExpirySeconds: 3600,

            fwdHeaderMapLookup: {
              "authorization": `Bearer ${tokenLogin?.nativeAuthToken}`,
            },

            stream: true,
            nestedIdxToStream: index, // get the song for the current index
            cacheDurationSeconds: MARSHAL_CACHE_DURATION_SECONDS,
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
        toastClosableError("Audio not ready yet. Waiting for loading to complete...");
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
    setImgLoading(true);

    if (currentTrackIndex <= 0) {
      setCurrentTrackIndex(songs.length - 1);
      return;
    }
    setCurrentTrackIndex((prevCurrentTrackIndex) => prevCurrentTrackIndex - 1);
  };

  const handleNextButton = () => {
    setImgLoading(true);

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
    if (previewUrl) {
      audio.src = previewUrl;
      audio.load();
      updateProgress();
      audio.currentTime = 0;
      return true;
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
      } else {
        return false;
      }
    } else {
      return false;
    }
    return true;
  };

  const showPlaylist = () => {
    if (previewUrl) {
      toast.error("This is just a preview. You have to buy the Music Data Nft to see all the songs.", {
        icon: (
          <button onClick={() => toast.dismiss()}>
            <XCircle color="red" />
          </button>
        ),
      });
    } else {
      setDisplayPlaylist(true);
    }
  };

  return (
    <div className="bg-background">
      <div className="">
        <div className="p-2 md:p-12 relative overflow-hidden">
          {displayPlaylist ? (
            <div className="w-full h-[500px] ">
              <button
                className="border-[1px] border-foreground/40 select-none flex flex-col items-center justify-center md:flex-row bg-[#fafafa]/50 dark:bg-[#0f0f0f]/25 p-2 gap-2 text-xs relative cursor-pointer transition-shadow duration-300 shadow-xl hover:shadow-inner hover:shadow-sky-200 dark:hover:shadow-teal-200 bg-[#27293d] rounded-2xl overflow-hidden   "
                onClick={() => setDisplayPlaylist(false)}>
                <ArrowBigLeft />
              </button>
              <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mx-4 mt-6 mb-20">
                {songs.map((song: any, index: number) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setCurrentTrackIndex(index);
                        setDisplayPlaylist(false);
                      }}
                      className={`border-[1px] border-foreground/40 select-none flex flex-col items-center justify-center md:flex-row bg-[#fafafa]/50 dark:bg-[#0f0f0f]/25 p-2 gap-2 text-xs cursor-pointer duration-300 shadow-xl hover:shadow-inner hover:shadow-sky-200 dark:hover:shadow-teal-200 rounded-2xl overflow-hidden text-foreground`}>
                      <div className="w-[80%] md:w-[60%] h-32 flex items-center justify-center">
                        <img
                          src={song.cover_art_url}
                          alt={"Not Loaded"}
                          className={`flex items-center justify-center w-24 h-24 rounded-md border border-grey-900`}
                          onError={({ currentTarget }) => {
                            currentTarget.src = theme === "light" ? DEFAULT_SONG_LIGHT_IMAGE : DEFAULT_SONG_IMAGE;
                          }}
                        />
                      </div>

                      <div className="w-8/12 flex flex-col items-center justify-center md:items-start">
                        <h6 className="!w-[90px] md:!w-[90%] truncate !text-sm text-foreground">{song.title}</h6>
                        <p className="!w-[90px] md:!w-[90%] truncate !text-sm text-foreground">{song.artist}</p>
                        <p className="!w-[90px] md:!w-[90%] text-xs text-muted-foreground">{song.album}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="overflow-hidden  w-full flex flex-col bg-bgWhite dark:bg-bgDark items-center justify-center">
              <div className=" select-none h-[30%] bg-[#FaFaFa]/25 dark:bg-[#0F0F0F]/25   border-[1px] border-foreground/40  relative md:w-[60%] flex flex-col rounded-xl">
                <div className="px-10 pt-10 pb-4 flex flex-col md:flex-row  items-center">
                  <img
                    src={songs ? songs[currentTrackIndex]?.cover_art_url : ""}
                    alt="Album Cover"
                    className={`select-none w-[130px] md:w-[250px] h-[auto] rounded-md md:mr-6 border border-grey-900 ${imgLoading ? "blur-sm" : "blur-none"}`}
                    onLoad={() => {
                      setImgLoading(false);
                    }}
                    onError={({ currentTarget }) => {
                      currentTarget.src = theme === "light" ? DEFAULT_SONG_LIGHT_IMAGE : DEFAULT_SONG_IMAGE;
                    }}
                  />
                  {previewUrl ? (
                    <div className="flex flex-col select-text justify-center">
                      <span className="font-sans text-lg font-medium leading-7 text-foreground">{songs[currentTrackIndex]?.title}</span>{" "}
                      <span className="font-sans text-base font-medium text-foreground/60">Preview</span>
                      <span className="font-sans text-base font-medium leading-6 text-muted-foreground overflow-ellipsis overflow-y-auto  max-w-[90%] max-h-32 ">
                        {songs[currentTrackIndex]?.description}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col select-text mt-2">
                      <div>
                        <span className="font-sans text-lg font-medium leading-7 text-foreground">{songs[currentTrackIndex]?.title}</span>{" "}
                      </div>

                      <span className="font-sans text-base font-medium text-foreground/60">{songs[currentTrackIndex]?.category}</span>
                      <span className="font-sans text-lg font-medium leading-6 text-foreground">{songs[currentTrackIndex]?.artist}</span>
                      <span className="font-sans text-base font-medium leading-6 text-muted-foreground">{songs[currentTrackIndex]?.album}</span>
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
                        <Loader2 className="w-full text-center animate-spin  hover:scale-105" />
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
                  <button className="cursor-pointer" onClick={repeatTrack}>
                    <RefreshCcwDot className="w-full hover:scale-105" />
                  </button>
                  <button className="mr-2  xl:pr-8" onClick={showPlaylist}>
                    <Library className="w-full hover:scale-105" />
                  </button>
                </div>
              </div>
              {!previewUrl && (
                <div className="w-[80%] 2xl:w-[70%] mt-8 mx-auto">
                  <h4 className="select-none flex justify-start font-semibold text-foreground mt-4 mb-2">{`Tracklist ${songs.length} songs`} </h4>
                  <Slider {...settings}>
                    {songs.map((song: any, index: number) => {
                      return (
                        <div key={index} className=" w-32 xl:w-64 shadow-none flex items-center justify-center">
                          <div
                            onClick={() => {
                              setCurrentTrackIndex(index);
                            }}
                            className="mx-auto w-32 xl:w-64 select-none flex flex-col xl:flex-row items-center justify-center bg-[#fafafa]/25 dark:bg-[#0f0f0f]/25 cursor-pointer transition-shadow duration-300 shadow-xl hover:shadow-inner hover:shadow-teal-200 rounded-2xl text-foreground border-[1px] border-foreground/40">
                            <div className="w-[70%] xl:w-[40%] justify-center">
                              <img
                                src={song.cover_art_url}
                                alt="Album Cover"
                                className="h-20 p-2 rounded-xl m-auto"
                                onError={({ currentTarget }) => {
                                  currentTarget.src = theme === "light" ? DEFAULT_SONG_LIGHT_IMAGE : DEFAULT_SONG_IMAGE;
                                }}
                              />
                            </div>
                            <div className="xl:w-[60%] flex flex-col justify-center text-center">
                              <h6 className="!w-[90px] md:!w-auto !text-sm text-foreground truncate mr-2 text-center md:text-left">{song.title}</h6>
                              <p className="font-sans text-sm font-medium leading-6 text-muted-foreground truncate text-center md:text-left">{song.artist}</p>
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
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
