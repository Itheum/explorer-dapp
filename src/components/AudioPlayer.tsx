import { useEffect, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";
import { Swiper as SwiperObject } from "swiper";
import { Navigation, Pagination } from "swiper/modules";

import { SwiperSlide, Swiper } from "swiper/react";
//import { Swiper as SwiperComponent } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import DEFAULT_SONG_IMAGE from "../assets/img/audio-player-image.png";
import { toastError } from "libs/utils";

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

export const AudioPlayer1 = () => {
  ///TODO https://developer.chrome.com/blog/play-request-was-interrupted/
  ///some problems with the audio player, sometimes it gets stuck bcs the auudio does not get loaded
  ///When fetching the urls use a try catch and show an error if not fetched - maybe as in the above link
  let songs: any;
  let dataStream: any;
  dataStream = data_marshal.data_stream;
  songs = data_marshal.data;
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
    centeredSlides: false,
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
      1024: { slidesPerView: 3, slidesPerGroup: 3 },
      1536: { slidesPerView: 4 },
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
  const [errorWhilePlaying, setErrorWhilePlaying] = useState(false);

  const formatTime = (_seconds: number) => {
    const minutes = Math.floor(_seconds / 60);
    const remainingSeconds = Math.floor(_seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, "0"); // Ensure two digits
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const updateProgress = () => {
    setCurrentTime(audio.currentTime ? formatTime(audio.currentTime) : "00:00");
    setDuration(audio.duration ? formatTime(audio.duration) : "00:00");
    let _percentage = (audio.currentTime / audio.duration) * 100;
    if (isNaN(_percentage)) _percentage = 0;
    setProgress(_percentage);
  };
  const playAudio = () => {
    audio.play();
    setErrorWhilePlaying(false);
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
        setErrorWhilePlaying(false);
      } else {
        setErrorWhilePlaying(true);
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
    audio.pause();
    setErrorWhilePlaying(false);
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
    <div>
      {displayPlaylist ? (
        <div className="w-full h-full overflow-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mx-4  mt-6 mb-20">
            {songs.map((song: any, index: number) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    setCurrentTrackIndex(index);
                    setDisplayPlaylist(false);
                  }}
                  className={`select-none flex flex-col items-center justify-center lg:flex-row bg-slate-300 dark:bg-gradient-to-r from-[#0A1122]  to-[#0A1122] p-2 gap-2 text-xs relative cursor-pointer transition-shadow duration-300 shadow-Xl hover:shadow-sky-400 bg-[#27293d] rounded-2xl overflow-hidden text-white border-1 border-sky-700`}>
                  <div className="w-[60%] h-24 flex items-center justify-center">
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
                    <h6 className="font-semibold text-sm">{song.title}</h6>
                    <p className="text-xs text-gray-400">
                      {
                        song.date.split("T")[0] // Splits the string at "T" and takes the first part
                      }
                    </p>
                    <p className="text-sm ">{song.artist}</p>
                    <p className="text-xs text-gray-400">{song.album}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className=" w-full h-full flex flex-col bg-bgWhite dark:bg-bgDark items-center justify-center">
          <div className=" h-[30%] bg-slate-300 dark:bg-[rgba(15,15,15,0.25)]  border border-white relative md:w-[60%] flex flex-col rounded-xl">
            <div className="px-10 pt-10 pb-4 flex items-center  ">
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

            <div className="text-white select-none w-full flex flex-row justify-center items-center px-10 pb-6 ">
              <span className=" p-2 text-xs font-sans font-medium text-sky-500 dark:text-slate-600">{currentTime}</span>
              <input
                type="range"
                min="0"
                max="100"
                step="0.01"
                value={progress}
                onChange={(e) => handleProgressChange(Number(e.target.value))}
                className="w-full bg-white mx-auto  focus:outline-none cursor-pointer"
              />{" "}
              <span className="p-2 text-xs font-sans font-medium text-gray-500 ">{duration}</span>
            </div>
            {errorWhilePlaying && <p className="z-50 text-red-500 text-center  "> Audio not ready yet. Waiting for loading to complete...</p>}

            <div className=" select-none p-2  bg-slate-300 dark:bg-[rgba(15,15,15,0.5)] px-6  rounded-b-xl   border-t border-gray-400 dark:border-gray-900  flex items-center justify-between z-10 ">
              <div className="flex w-[20%] px-2">
                <FaVolumeUp className="mt-1"></FaVolumeUp>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="bg-white w-[70%] cursor-pointer ml-2 z-50"></input>
              </div>
              <button className="cursor-pointer" onClick={handlePrevButton}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M26 7C26 5.76393 24.5889 5.05836 23.6 5.8L11.6 14.8C10.8 15.4 10.8 16.6 11.6 17.2L23.6 26.2C24.5889 26.9416 26 26.2361 26 25V7Z"
                    fill="#94A3B8"
                    stroke="#94A3B8"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                  <path d="M6 5L6 27" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <div className="w-16 h-16 rounded-full bg-white   border border-grey-300 shadow-xl flex items-center justify-center">
                <button onClick={togglePlay} className="focus:outline-none  ">
                  {isPlaying ? (
                    <svg id="pause-icon" width="16" height="20" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="6" height="36" rx="3" className="fill-black  " />
                      <rect x="18" width="6" height="36" rx="3" className="fill-black " />
                    </svg>
                  ) : (
                    <svg id="play-icon" className="ml-[5px]" width="16" height="20" viewBox="0 0 31 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M29.6901 16.6608L4.00209 0.747111C2.12875 -0.476923 0.599998 0.421814 0.599998 2.75545V33.643C0.599998 35.9728 2.12747 36.8805 4.00209 35.6514L29.6901 19.7402C29.6901 19.7402 30.6043 19.0973 30.6043 18.2012C30.6043 17.3024 29.6901 16.6608 29.6901 16.6608Z"
                        className="fill-black"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <button className="cursor-pointer" onClick={handleNextButton}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 7C6 5.76393 7.41115 5.05836 8.4 5.8L20.4 14.8C21.2 15.4 21.2 16.6 20.4 17.2L8.4 26.2C7.41115 26.9416 6 26.2361 6 25V7Z"
                    fill="#94A3B8"
                    stroke="#94A3B8"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                  <path d="M26 5L26 27" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <button className="cursor-pointer   " onClick={repeatTrack}>
                <svg width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M17.7071 15.7071C18.0976 15.3166 18.0976 14.6834 17.7071 14.2929C17.3166 13.9024 16.6834 13.9024 16.2929 14.2929L17.7071 15.7071ZM13 19L12.2929 18.2929C11.9024 18.6834 11.9024 19.3166 12.2929 19.7071L13 19ZM16.2929 23.7071C16.6834 24.0976 17.3166 24.0976 17.7071 23.7071C18.0976 23.3166 18.0976 22.6834 17.7071 22.2929L16.2929 23.7071ZM19.9359 18.7035L19.8503 17.7072L19.9359 18.7035ZM8.95082 19.9005C9.50243 19.9277 9.97163 19.5025 9.99879 18.9509C10.026 18.3993 9.6008 17.9301 9.04918 17.9029L8.95082 19.9005ZM6.06408 18.7035L5.97851 19.6998L6.06408 18.7035ZM1.07501 13.4958L0.075929 13.5387L1.07501 13.4958ZM1.07501 6.50423L0.0759292 6.46127L1.07501 6.50423ZM6.06409 1.29649L6.14965 2.29282L6.06409 1.29649ZM19.9359 1.29649L19.8503 2.29283L19.9359 1.29649ZM24.925 6.50423L23.9259 6.54718L24.925 6.50423ZM24.925 13.4958L25.9241 13.5387V13.5387L24.925 13.4958ZM16.2929 14.2929L12.2929 18.2929L13.7071 19.7071L17.7071 15.7071L16.2929 14.2929ZM12.2929 19.7071L16.2929 23.7071L17.7071 22.2929L13.7071 18.2929L12.2929 19.7071ZM19.8503 17.7072C17.5929 17.901 15.3081 18 13 18V20C15.3653 20 17.7072 19.8986 20.0215 19.6998L19.8503 17.7072ZM9.04918 17.9029C8.07792 17.8551 7.1113 17.7898 6.14964 17.7072L5.97851 19.6998C6.96438 19.7845 7.95525 19.8515 8.95082 19.9005L9.04918 17.9029ZM2.07408 13.4528C2.02486 12.3081 2 11.157 2 10H0C0 11.1856 0.0254804 12.3654 0.075929 13.5387L2.07408 13.4528ZM2 10C2 8.84302 2.02486 7.69192 2.07408 6.54718L0.0759292 6.46127C0.0254806 7.63461 0 8.81436 0 10H2ZM6.14965 2.29282C8.4071 2.09896 10.6919 2 13 2V0C10.6347 0 8.29281 0.101411 5.97853 0.30016L6.14965 2.29282ZM13 2C15.3081 2 17.5929 2.09896 19.8503 2.29283L20.0215 0.30016C17.7072 0.101411 15.3653 0 13 0V2ZM23.9259 6.54718C23.9751 7.69192 24 8.84302 24 10H26C26 8.81436 25.9745 7.63461 25.9241 6.46127L23.9259 6.54718ZM24 10C24 11.157 23.9751 12.3081 23.9259 13.4528L25.9241 13.5387C25.9745 12.3654 26 11.1856 26 10H24ZM19.8503 2.29283C22.092 2.48534 23.8293 4.29889 23.9259 6.54718L25.9241 6.46127C25.7842 3.20897 23.2653 0.578736 20.0215 0.30016L19.8503 2.29283ZM6.14964 17.7072C3.90797 17.5147 2.17075 15.7011 2.07408 13.4528L0.075929 13.5387C0.215764 16.791 2.7347 19.4213 5.97851 19.6998L6.14964 17.7072ZM2.07408 6.54718C2.17075 4.29889 3.90798 2.48534 6.14965 2.29282L5.97853 0.30016C2.73471 0.578735 0.215764 3.20897 0.0759292 6.46127L2.07408 6.54718ZM20.0215 19.6998C23.2653 19.4213 25.7842 16.791 25.9241 13.5387L23.9259 13.4528C23.8292 15.7011 22.092 17.5147 19.8503 17.7072L20.0215 19.6998Z"
                    fill="#94A3B8"
                  />
                </svg>
              </button>
              <button className="px-2" onClick={showPlaylist}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7.5 7H24.5V5H7.5V7ZM7.5 12H24.5V10H7.5V12ZM24.5 12C26.433 12 28 10.433 28 8.5H26C26 9.32843 25.3284 10 24.5 10V12ZM7.5 10C6.67157 10 6 9.32843 6 8.5H4C4 10.433 5.567 12 7.5 12V10ZM24.5 7C25.3284 7 26 7.67157 26 8.5H28C28 6.567 26.433 5 24.5 5V7ZM7.5 5C5.567 5 4 6.567 4 8.5H6C6 7.67157 6.67157 7 7.5 7V5Z"
                    fill="#94A3B8"
                  />
                  <path
                    d="M5 15C4.44772 15 4 15.4477 4 16C4 16.5523 4.44772 17 5 17V15ZM27 17C27.5523 17 28 16.5523 28 16C28 15.4477 27.5523 15 27 15V17ZM5 17H27V15H5V17Z"
                    fill="#94A3B8"
                  />
                  <path
                    d="M5 20C4.44772 20 4 20.4477 4 21C4 21.5523 4.44772 22 5 22V20ZM27 22C27.5523 22 28 21.5523 28 21C28 20.4477 27.5523 20 27 20V22ZM5 22H27V20H5V22Z"
                    fill="#94A3B8"
                  />
                  <path
                    d="M5 25C4.44772 25 4 25.4477 4 26C4 26.5523 4.44772 27 5 27V25ZM27 27C27.5523 27 28 26.5523 28 26C28 25.4477 27.5523 25 27 25V27ZM5 27H27V25H5V27Z"
                    fill="#94A3B8"
                  />
                </svg>
              </button>
            </div>
            <div className="hidden top-14 w-full absolute ml-auto mr-auto left-0 right-0 text-center max-w-lg h-72 rounded-full bg-highlight blur-2xl dark:block"></div>
          </div>

          {songs.length > 1 && (
            <Swiper className="w-full select-none mt-16  my-swiper">
              {songs.map((song: any, index: number) => {
                return (
                  <SwiperSlide
                    onClick={() => {
                      setCurrentTrackIndex(index);
                    }}
                    key={index}>
                    <div
                      className={`flex flex-col lg:flex-row items-center justify-center ml-[10%] w-[80%] h-[30%] 
                     bg-[rgba(250,250,250,0.25)] dark:bg-[rgba(15,15,15,0.25)]    
                    p-2 gap-2   cursor-pointer transition-shadow duration-300 shadow-Xl hover:shadow-inner hover:shadow-sky-300   rounded-2xl  text-white border  border-white`}>
                      <div className=" w-[40%] justify-center">
                        <img
                          src={song.cover_art_url}
                          alt="Album Cover"
                          className=" select-none p-2 md:h-24 rounded-md mr-2 "
                          onLoad={handleImageLoad}
                          onError={({ currentTarget }) => {
                            currentTarget.src = DEFAULT_SONG_IMAGE;
                          }}
                        />
                      </div>
                      <div className="w-[60%] flex flex-col gap-2 justify-center">
                        <h6 className="font-semibold truncate text-center">{song.title}</h6>
                        <p className="text-gray-400 truncate text-center">{song.artist}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
              <div className="swiper-button-prev scale-50 "></div>

              <div className="swiper-button-next scale-50"> </div>
            </Swiper>
          )}

          <div className="ml-[-30%] mt-[45%] h-[45%] w-[55%] opacity-75    blur-[250px]  absolute bg-[#00C797]   rounded-full "> </div>
          <div className="ml-[30%] mt-[60%] h-[45%] w-[55%] opacity-75  blur-[250px]   absolute bg-[#3D00EA]  rounded-full "> </div>
        </div>
      )}
    </div>
  );
};
