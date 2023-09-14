import { useEffect, useState } from "react";
import { Swiper as SwiperObject } from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { Play, Pause, Library, RefreshCcwDot, Volume2, Volume1, VolumeX, SkipBack, SkipForward } from "lucide-react";

import { SwiperSlide, Swiper } from "swiper/react";
//import { Swiper as SwiperComponent } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import DEFAULT_SONG_IMAGE from "assets/img/audio-player-image.png";
import { toastError } from "libs/utils";
import { ViewDataReturnType } from "@itheum/sdk-mx-data-nft/out";

const data_marshal = {
  "data_stream": {
    "name": "tokentunes:musiverse:musicx",
    "creator": "Manu",
    "created_on": "2023-05-22T05:37:17Z",
    "last_modified_on": "2023-06-10T14:00:19Z",
    "marshalManifest": {
      "totalItems": 3,
      "nestedStream": true,
    },
  },
  "data": [
    {
      "idx": 1,
      "date": "2023-01-02T00:00:00Z",
      "category": "Beats",
      "artist": "Emancipator",
      "album": "Soon It Will Be Cold Enough",
      "title": "Beats are best",
      "file": "https://itheum-static.s3.ap-southeast-2.amazonaws.com/hosteddataassets/musicblazer/manu-song-1.mp3",
      "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/soon-it-will-be-cold-enough.jpg",
    },
    {
      "idx": 2,
      "date": "2023-01-09T00:00:00Z",
      "category": "Funk",
      "artist": "Emancipator",
      "album": "Soon It Will Be Cold Enough",
      "title": "Funk is best",
      "file": "https://itheum-static.s3.ap-southeast-2.amazonaws.com/hosteddataassets/musicblazer/manu-song-2.mp3",
      "cover_art_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0hBNmQVoxqDWLdEKSZPnmbanHXKFMjzDrYA&usqp=CAU",
    },
    {
      "idx": 3,
      "date": "2023-01-16T00:00:00Z",
      "category": "Rock",
      "artist": "Emancipator",
      "album": "Soon It Will Be Cold Enough",
      "title": "Rock is best",
      "file": "https://itheum-static.s3.ap-southeast-2.amazonaws.com/hosteddataassets/musicblazer/manu-song-3.mp3",
      "cover_art_url": "https://coverartworks.com/wp-content/uploads/2021/05/yeter-750px.jpg",
    },
  ],
};

///TODO   refactor the current song, only keep the index
// add a songs props here // maybe add an object of data_stream and an array with songs
///add lucide react icons

export const AudioPlayer = (dataNftToOpen: any, data_marshal: any, mvxNativeAuthOrigins: any, mvxNativeAuthMaxExpirySeconds: any, tokenLogin: any) => {
  ///TODO PROPS or get just the tokenLogin?.nativeAuthToken directly

  ///TODO https://developer.chrome.com/blog/play-request-was-interrupted/
  ///some problems with the audio player, sometimes it gets stuck bcs the auudio does not get loaded
  ///When fetching the urls use a try catch and show an error if not fetched - maybe as in the above link
  let songs: any;
  let dataStream: any;
  dataStream = data_marshal.data_stream;
  songs = data_marshal.data; // songs without the actual song
  useEffect(() => {
    dataStream = data_marshal.data_stream;
    songs = data_marshal.data;
    setAudio(new Audio(songs[currentTrackIndex].file));
  }, []);

  let swiper = new SwiperObject(".my-swiper", {
    init: false,
    loop: true,
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 0,
      modifier: 1,
      slideShadows: false,
    },
    mousewheel: true,
    keyboard: {
      enabled: true,
    },

    breakpoints: {
      240: { slidesPerView: 2 },
      560: { slidesPerView: 2.5 },
      768: { slidesPerView: 3 },
      1024: { slidesPerView: 3 },
      1536: { slidesPerView: 3 },
    },
    modules: [Navigation, Pagination],
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [displayPlaylist, setDisplayPlaylist] = useState(false);

  const [audio, setAudio] = useState(new Audio(songs[currentTrackIndex].file));

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState("00:00");

  const formatTime = (_seconds: number) => {
    const minutes = Math.floor(_seconds / 60);
    const remainingSeconds = Math.floor(_seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, "0"); // Ensure two digits
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const fetchMarshalForSong = async () => {
    try {
      const res: ViewDataReturnType = await dataNftToOpen.viewDataViaMVXNativeAuth({
        mvxNativeAuthOrigins: ["http://localhost:3000"],
        mvxNativeAuthMaxExpirySeconds: 3000,
        fwdHeaderMapLookup: {
          "authorization": `Bearer ${tokenLogin?.nativeAuthToken}`,
        },
        nestedIdxToStream: currentTrackIndex, /// get the song for the current index
      });
    } catch (err) {
      console.error(err);
      //toastError(err.message);
      // ALL SDK error appear here
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
  }, [audio]);

  useEffect(() => {
    //setAudio(new Audio(songs[currentTrackIndex].url));

    audio.addEventListener("timeupdate", updateProgress);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, [audio]);

  useEffect(() => {
    swiper.init();
  }, [displayPlaylist]);

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
    if (currentTrackIndex <= 0) return;
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
    console.log(newProgress);
    if (!audio.duration) return;
    const newTime = (newProgress / 100) * audio.duration;
    audio.currentTime = newTime;
    setCurrentTime(formatTime(audio.currentTime));
    setProgress(newProgress);
  };

  useEffect(() => {
    //fetchMarshalForSong(); hhere get the song ftom marshal wiht index..

    audio.pause();
    console.log("START FROM BEGINNING : ", currentTrackIndex, "index  ", songs[currentTrackIndex].file);
    setAudio(new Audio(songs[currentTrackIndex].file));
    audio.load();
    updateProgress();

    setIsPlaying(false);
    audio.currentTime = 0;
  }, [currentTrackIndex]);

  const showPlaylist = () => {
    console.log("Showing... ");
    setDisplayPlaylist(true);
  };

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  async function checkImage(url: string) {
    const res = await fetch(url);
    const buff = await res.blob();
    const isOk = buff.type.startsWith("image/");
    return isOk;
  }

  return (
    <div className="h-full p-12 relative overflow-hidden">
      {displayPlaylist ? (
        <div className="w-full h-screen overflow-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mx-4  mt-6 mb-20">
            {songs.map((song: any, index: number) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    setCurrentTrackIndex(index);
                    setDisplayPlaylist(false);
                  }}
                  className={`select-none flex flex-col items-center justify-center md:flex-row bg-slate-300 dark:bg-[rgba(15,15,15,0.5)]  p-2 gap-2 text-xs relative cursor-pointer transition-shadow duration-300 shadow-xl hover:shadow-sky-500/20  bg-[#27293d] rounded-2xl overflow-hidden text-white border-1 border-sky-700`}>
                  <div className="w-[60%] h-32 flex items-center justify-center">
                    <img
                      src={song.cover_art_url}
                      alt={"Not Loaded"}
                      className={`flex items-center justify-center w-24 h-24 rounded-md border border-grey-900 `}
                      onLoad={handleImageLoad}
                      onError={({ currentTarget }) => {
                        currentTarget.src = DEFAULT_SONG_IMAGE;
                      }}
                    />
                  </div>

                  <div className="w-8/12 flex flex-col items-center justify-center">
                    <h6 className=" text-center font-semibold text-sm">{song.title}</h6>
                    {/* <p className="text-xs text-gray-400">
                      {
                        song.date.split("T")[0] // Splits the string at "T" and takes the first part
                      }
                    </p> */}
                    <p className="text-sm text-center ">{song.artist}</p>
                    <p className="text-xs text-center text-gray-400">{song.album}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="overflow-hidden  w-full h-[60%] flex flex-col bg-bgWhite dark:bg-bgDark items-center justify-center">
          <div className="  h-[30%] bg-slate-300 dark:bg-[#0F0F0F]/20  border border-white relative md:w-[60%] flex flex-col rounded-xl">
            <div className="px-10 pt-10 pb-4 flex items-center">
              <img
                src={songs[currentTrackIndex].cover_art_url}
                alt="Album Cover"
                className=" select-none w-24 h-24 rounded-md mr-6 border border-grey-900"
                onLoad={handleImageLoad}
                onError={({ currentTarget }) => {
                  currentTarget.src = DEFAULT_SONG_IMAGE;
                }}
              />

              <div className="flex flex-col">
                <div>
                  <span className="font-sans text-lg font-medium leading-7 text-slate-900 dark:text-white">{songs[currentTrackIndex].title}</span>{" "}
                  <span className="ml-2 font-sans text-base font-medium   text-gray-500 dark:text-gray-400">{songs[currentTrackIndex].date.split("T")[0]}</span>
                </div>

                <span className="font-sans text-base font-medium   text-gray-500 dark:text-gray-400">{songs[currentTrackIndex].category}</span>
                <span className="font-sans text-lg font-medium leading-6 text-slate-900 dark:text-white">{songs[currentTrackIndex].artist}</span>
                <span className="font-sans text-base font-medium leading-6 text-gray-500 dark:text-gray-400">{songs[currentTrackIndex].album}</span>
              </div>
            </div>

            <div className="gap-2 text-white select-none w-full flex flex-row justify-center items-center px-10 pb-6 ">
              <span className="w-12 p-2 text-xs font-sans font-medium text-sky-500 dark:text-slate-600">{currentTime}</span>
              <input
                type="range"
                min="0"
                max="100"
                step="0.01"
                value={progress}
                onChange={(e) => handleProgressChange(Number(e.target.value))}
                className="text-white w-full bg-white mx-auto  focus:outline-none cursor-pointer"
              />{" "}
              <span className="p-2 text-xs font-sans font-medium text-gray-500 ">{duration}</span>
            </div>

            <div className=" select-none p-2  bg-[rgba(250,250,250,0.25)] dark:bg-[rgba(15,15,15,0.5)]    rounded-b-xl   border-t border-gray-400 dark:border-gray-900  flex items-center justify-between z-10 ">
              <div className="ml-4 flex w-[20%] ">
                {volume === 0 ? <VolumeX /> : volume >= 0.5 ? <Volume2 /> : <Volume1 />}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="bg-white w-[70%] cursor-pointer ml-2 "></input>
              </div>
              <button className="cursor-pointer" onClick={handlePrevButton}>
                <SkipBack />
              </button>
              <div className="w-16 h-16 rounded-full  border border-grey-300 shadow-xl flex items-center justify-center">
                <button onClick={togglePlay} className="focus:outline-none">
                  {isPlaying ? ( // add a loading here until the song is fetched
                    <Pause />
                  ) : (
                    <Play className="ml-1" />
                  )}
                </button>
              </div>
              <button className="cursor-pointer" onClick={handleNextButton}>
                <SkipForward />
              </button>
              <button className="cursor-pointer   " onClick={repeatTrack}>
                <RefreshCcwDot />
              </button>
              <button className="mr-4" onClick={showPlaylist}>
                <Library />
              </button>
            </div>
          </div>
          <h4 className="select-none mt-4 md:ml-[-65%] ">{`Tracklist   ${songs.length} songs`} </h4>
          {songs.length > 1 && (
            <Swiper className="w-[90%] ml-[5%] mt-2  my-swiper">
              {songs.map((song: any, index: number) => {
                return (
                  <SwiperSlide
                    onClick={() => {
                      setCurrentTrackIndex(index);
                    }}
                    key={index}>
                    <div
                      className={`flex flex-col md:flex-row items-center justify-center ml-[10%] w-[80%] h-[30%] 
                     bg-[rgba(250,250,250,0.25)] dark:bg-[rgba(15,15,15,0.25)]    
                    p-2 gap-2   cursor-pointer transition-shadow duration-300 shadow-Xl hover:shadow-inner hover:shadow-sky-300   rounded-2xl  text-white border  border-white`}>
                      <div className="w-[40%] justify-center">
                        <img
                          src={song.cover_art_url}
                          alt="Album Cover"
                          className="  p-2 md:h-24 rounded-md "
                          onLoad={handleImageLoad}
                          onError={({ currentTarget }) => {
                            currentTarget.src = DEFAULT_SONG_IMAGE;
                          }}
                        />
                      </div>
                      <div className=" md:w-[60%] flex flex-col   justify-center">
                        <h6 className="font-semibold truncate text-center">{song.title}</h6>
                        <p className="text-gray-400 truncate text-center">{song.artist}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
              <div className="swiper-button-prev scale-50 "></div>

              <div className="swiper-button-next scale-50"> </div>
              <style>
                {`
          /* CSS styles for Swiper navigation arrows set light theme  */
          .swiper-button-next,
          .swiper-button-prev { 
            color: white;
          }
          .swiper-button-prev{
              margin-left: -15px;
          }
          .swiper-button-next{
              margin-right: -15px  
          }
          
        `}
              </style>
            </Swiper>
          )}
        </div>
      )}
      <div className="   h-[45%] w-[55%] opacity-1 blur-[350px] absolute bg-[#00C797]   rounded-full "> </div>
      <div className=" mt-16 ml-[40%]  h-[45%] w-[55%] opacity-1 blur-[350px] absolute bg-[#3D00EA]  rounded-full "> </div>
    </div>
  );
};
