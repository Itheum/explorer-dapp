import { precisionPrefix } from "d3";
import React, { useEffect, useState } from "react";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeDown, FaVolumeMute } from "react-icons/fa";
import { SliderView } from "./SongsSliderView/SliderView";
import { Swiper } from "swiper";
import { SwiperSlide } from "swiper/react";
import { Swiper as SwiperComponent } from "swiper/react";

let swiper = new Swiper(".swiper", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 100,
    modifier: 4,
    slideShadows: true,
  },
  loop: true,
  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  keyboard: {
    enabled: true,
  },
  mousewheel: {
    thresholdDelta: 70,
  },
  breakpoints: {
    560: {
      slidesPerView: 2.5,
    },
    768: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

const songs = [
  {
    "name": "Intro / Sweet Glory",
    "artist": "Jimkata",
    "album": "Die Digital",
    "url": "https://521dimensions.com/song/IntroSweetGlory-Jimkata.mp3",
    "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/die-digital.jpg",
  },
  {
    "name": "Anthem",
    "artist": "Emancipator",
    "album": "Soon It Will Be Cold Enough",
    "url": "https://521dimensions.com/song/Anthem-Emancipator.mp3",
    "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/soon-it-will-be-cold-enough.jpg",
  },
  {
    "name": "First Snow",
    "artist": "Emancipator",
    "album": "Soon It Will Be Cold Enough",
    "url": "https://521dimensions.com/song/FirstSnow-Emancipator.mp3",
    "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/soon-it-will-be-cold-enough.jpg",
  },
  {
    "name": "Offcut #6",
    "artist": "Little People",
    "album": "We Are But Hunks of Wood Remixes",
    "url": "https://521dimensions.com/song/Offcut6-LittlePeople.mp3",
    "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/we-are-but-hunks-of-wood.jpg",
  },
  {
    "name": "Dusk To Dawn",
    "artist": "Emancipator",
    "album": "Dusk To Dawn",
    "url": "https://521dimensions.com/song/DuskToDawn-Emancipator.mp3",
    "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/from-dusk-to-dawn.jpg",
  },
  {
    "name": "Intro / Sweet Glory",
    "artist": "Jimkata",
    "album": "Die Digital",
    "url": "https://521dimensions.com/song/IntroSweetGlory-Jimkata.mp3",
    "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/die-digital.jpg",
  },
  {
    "name": "Anthem",
    "artist": "Emancipator",
    "album": "Soon It Will Be Cold Enough",
    "url": "https://521dimensions.com/song/Anthem-Emancipator.mp3",
    "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/soon-it-will-be-cold-enough.jpg",
  },
  {
    "name": "First Snow",
    "artist": "Emancipator",
    "album": "Soon It Will Be Cold Enough",
    "url": "https://521dimensions.com/song/FirstSnow-Emancipator.mp3",
    "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/soon-it-will-be-cold-enough.jpg",
  },
  {
    "name": "Offcut #6",
    "artist": "Little People",
    "album": "We Are But Hunks of Wood Remixes",
    "url": "https://521dimensions.com/song/Offcut6-LittlePeople.mp3",
    "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/we-are-but-hunks-of-wood.jpg",
  },
  {
    "name": "Dusk To Dawn",
    "artist": "Emancipator",
    "album": "Dusk To Dawn",
    "url": "https://521dimensions.com/song/DuskToDawn-Emancipator.mp3",
    "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/from-dusk-to-dawn.jpg",
  },
  {
    "name": "Intro / Sweet Glory",
    "artist": "Jimkata",
    "album": "Die Digital",
    "url": "https://521dimensions.com/song/IntroSweetGlory-Jimkata.mp3",
    "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/die-digital.jpg",
  },
  {
    "name": "Anthem",
    "artist": "Emancipator",
    "album": "Soon It Will Be Cold Enough",
    "url": "https://521dimensions.com/song/Anthem-Emancipator.mp3",
    "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/soon-it-will-be-cold-enough.jpg",
  },
  {
    "name": "First Snow",
    "artist": "Emancipator",
    "album": "Soon It Will Be Cold Enough",
    "url": "https://521dimensions.com/song/FirstSnow-Emancipator.mp3",
    "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/soon-it-will-be-cold-enough.jpg",
  },
  {
    "name": "Offcut #6",
    "artist": "Little People",
    "album": "We Are But Hunks of Wood Remixes",
    "url": "https://521dimensions.com/song/Offcut6-LittlePeople.mp3",
    "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/we-are-but-hunks-of-wood.jpg",
  },
  {
    "name": "Dusk To Dawn",
    "artist": "Emancipator",
    "album": "Dusk To Dawn",
    "url": "https://521dimensions.com/song/DuskToDawn-Emancipator.mp3",
    "cover_art_url": "https://521dimensions.com/img/open-source/amplitudejs/album-art/from-dusk-to-dawn.jpg",
  },
];

// add a songs props here
export const AudioPlayer1 = () => {
  ///TODO https://developer.chrome.com/blog/play-request-was-interrupted/
  ///some problems with the audio player, sometimes it gets stuck bcs the auudio does not get loaded
  ///When fetching the urls use a try catch and show an error if not fetched - maybe as in the above link
  const [currentTrack, setCurrentTrack] = useState(songs[0]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [displayPlaylist, setDisplayPlaylist] = useState(false);
  let theme = localStorage.getItem("is-dark-mode") == "true" ? "dark" : "light";
  console.log(theme);

  const [audio] = useState(new Audio(currentTrack.url));
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

  useEffect(() => {
    const updateProgress = () => {
      setCurrentTime(formatTime(audio.currentTime));
      setDuration(audio.duration ? formatTime(audio.duration) : "00:00");
      let _percentage = (audio.currentTime / audio.duration) * 100;
      if (isNaN(_percentage)) _percentage = 0;
      setProgress(_percentage);
    };

    audio.addEventListener("timeupdate", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, [audio]);

  const togglePlay = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (newVolume: number) => {
    audio.volume = newVolume;
    setVolume(newVolume);
  };
  const handlePrevButton = () => {
    if (currentTrackIndex <= 0) return;
    setCurrentTrack(songs[currentTrackIndex - 1]);
    setCurrentTrackIndex((prevCurrentTrackIndex) => prevCurrentTrackIndex - 1);
    startFromBeginning();
  };
  const handleNextButton = () => {
    if (currentTrackIndex >= songs.length - 1) {
      setCurrentTrack(songs[0]);
      console.log(songs[0].url);
      setCurrentTrackIndex(0);
      return;
    }
    setCurrentTrack(songs[currentTrackIndex + 1]);
    setCurrentTrackIndex((prevCurrentTrackIndex) => prevCurrentTrackIndex + 1);
    startFromBeginning();
  };

  const handleProgressChange = (newProgress: number) => {
    const newTime = (newProgress / 100) * audio.duration;
    audio.currentTime = newTime;
    setCurrentTime(formatTime(audio.currentTime));
    setProgress(newProgress);
  };
  const startFromBeginning = () => {
    setCurrentTime("00:00");
    audio.currentTime = 0;
  };

  const showPlaylist = () => {
    console.log("Showing... ");
    setDisplayPlaylist(true);
  };

  return (
    <div>
      {displayPlaylist ? (
        <div className="w-full h-full overflow-auto flex items-center justify-center">
          <div className="flex flex-col max-w-lg gap-4 mx-4 md:mx-auto mt-6 mb-20">
            {songs.map((song, index) => {
              return (
                <div
                  onClick={() => {
                    setCurrentTrack(song);
                    setCurrentTrackIndex(index);
                    setDisplayPlaylist(false);
                  }}
                  className={`

            flex bg-slate-300 dark:bg-gradient-to-r from-[#0A1122]  to-[#0A1122] p-2 gap-2 text-xs relative cursor-pointer transition-shadow duration-300 shadow-Xl hover:shadow-sky-400 bg-[#27293d] rounded-2xl overflow-hidden text-white border-1 border-sky-700`}>
                  <div className="w-3/12 h-24">
                    <img src={song.cover_art_url} alt="Album Cover" className=" select-none w-24 h-24 rounded-md mr-6 border border-grey-900" />
                  </div>
                  <div className="z-100 mt-[10%] ml-[10%] h-[100%] w-[80%] opacity-25 absolute bg-sky-500 blur-2xl rounded-full "> </div>

                  <div className="w-8/12 flex flex-col gap-2 justify-center">
                    <h6 className="font-semibold text-sm">{song.name}</h6>
                    <p className="text-xs text-gray-400">{song.artist}</p>
                    <p className="text-xs text-gray-400">{song.album}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className=" w-full h-full flex flex-col items-center justify-center">
          <div className=" h-[30%] bg-slate-300 dark:bg-gradient-to-r from-[#0A1122] to-[#0A1122] relative md:w-[60%] flex flex-col rounded-xl">
            <div className="  px-10 pt-10 pb-4 flex items-center z-50">
              <img src={currentTrack.cover_art_url} alt="Album Cover" className=" select-none w-24 h-24 rounded-md mr-6 border border-grey-900" />

              <div className="flex flex-col">
                <span className="font-sans text-lg font-medium leading-7 text-slate-900 dark:text-white">{currentTrack.name}</span>
                <span className="font-sans text-base font-medium leading-6 text-gray-500 dark:text-gray-400">{currentTrack.artist}</span>
                <span className="font-sans text-base font-medium leading-6 text-gray-500 dark:text-gray-400">{currentTrack.album}</span>
              </div>
            </div>
            <div className="z-100 mt-[10%] ml-[10%] h-[100%] w-[80%] opacity-25 absolute bg-sky-500 blur-2xl rounded-full "> </div>

            <div className="select-none w-fullflex flex-col px-10 pb-6 z-50">
              <input
                type="range"
                min="0"
                max="100"
                step="0.01"
                value={progress}
                onChange={(e) => handleProgressChange(Number(e.target.value))}
                className="w-full bg-grey-300 mx-auto mt-2 cursor-pointer"
              />{" "}
              <div className="  flex w-full justify-between">
                <span className=" text-xs font-sans font-medium text-sky-500 dark:text-sky-300">{currentTime}</span>
                <span className=" text-xs font-sans font-medium text-gray-500 ">{duration}</span>
              </div>
            </div>
            <div className=" select-none h-16 z-50 bg-slate-300 dark:bg-[#171f3280]  px-10 rounded-b-xl   border-t border-gray-400 dark:border-gray-900  flex items-center justify-between z-10 ">
              <div className="flex w-[20%]">
                <FaVolumeUp></FaVolumeUp>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className=" w-[70%] cursor-pointer ml-2"></input>
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
              <div
                className="w-24 h-24 rounded-full bg-slate-200 z-50 opacity-75 dark:bg-[#2F3B4F] dark:opacity-100 border border-grey-300 shadow-xl flex items-center justify-center
           ">
                <button onClick={togglePlay} className="text-2xl focus:outline-none z-10">
                  {isPlaying ? (
                    <svg id="pause-icon" width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="6" height="36" rx="3" className="fill-slate-500 dark:fill-slate-400" />
                      <rect x="18" width="6" height="36" rx="3" className="fill-slate-500 dark:fill-slate-400" />
                    </svg>
                  ) : (
                    <svg id="play-icon" className="ml-[10px]" width="31" height="37" viewBox="0 0 31 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M29.6901 16.6608L4.00209 0.747111C2.12875 -0.476923 0.599998 0.421814 0.599998 2.75545V33.643C0.599998 35.9728 2.12747 36.8805 4.00209 35.6514L29.6901 19.7402C29.6901 19.7402 30.6043 19.0973 30.6043 18.2012C30.6043 17.3024 29.6901 16.6608 29.6901 16.6608Z"
                        className="fill-slate-500 dark:fill-slate-400"
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
              <button className="cursor-pointer " onClick={startFromBeginning}>
                <svg width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M17.7071 15.7071C18.0976 15.3166 18.0976 14.6834 17.7071 14.2929C17.3166 13.9024 16.6834 13.9024 16.2929 14.2929L17.7071 15.7071ZM13 19L12.2929 18.2929C11.9024 18.6834 11.9024 19.3166 12.2929 19.7071L13 19ZM16.2929 23.7071C16.6834 24.0976 17.3166 24.0976 17.7071 23.7071C18.0976 23.3166 18.0976 22.6834 17.7071 22.2929L16.2929 23.7071ZM19.9359 18.7035L19.8503 17.7072L19.9359 18.7035ZM8.95082 19.9005C9.50243 19.9277 9.97163 19.5025 9.99879 18.9509C10.026 18.3993 9.6008 17.9301 9.04918 17.9029L8.95082 19.9005ZM6.06408 18.7035L5.97851 19.6998L6.06408 18.7035ZM1.07501 13.4958L0.075929 13.5387L1.07501 13.4958ZM1.07501 6.50423L0.0759292 6.46127L1.07501 6.50423ZM6.06409 1.29649L6.14965 2.29282L6.06409 1.29649ZM19.9359 1.29649L19.8503 2.29283L19.9359 1.29649ZM24.925 6.50423L23.9259 6.54718L24.925 6.50423ZM24.925 13.4958L25.9241 13.5387V13.5387L24.925 13.4958ZM16.2929 14.2929L12.2929 18.2929L13.7071 19.7071L17.7071 15.7071L16.2929 14.2929ZM12.2929 19.7071L16.2929 23.7071L17.7071 22.2929L13.7071 18.2929L12.2929 19.7071ZM19.8503 17.7072C17.5929 17.901 15.3081 18 13 18V20C15.3653 20 17.7072 19.8986 20.0215 19.6998L19.8503 17.7072ZM9.04918 17.9029C8.07792 17.8551 7.1113 17.7898 6.14964 17.7072L5.97851 19.6998C6.96438 19.7845 7.95525 19.8515 8.95082 19.9005L9.04918 17.9029ZM2.07408 13.4528C2.02486 12.3081 2 11.157 2 10H0C0 11.1856 0.0254804 12.3654 0.075929 13.5387L2.07408 13.4528ZM2 10C2 8.84302 2.02486 7.69192 2.07408 6.54718L0.0759292 6.46127C0.0254806 7.63461 0 8.81436 0 10H2ZM6.14965 2.29282C8.4071 2.09896 10.6919 2 13 2V0C10.6347 0 8.29281 0.101411 5.97853 0.30016L6.14965 2.29282ZM13 2C15.3081 2 17.5929 2.09896 19.8503 2.29283L20.0215 0.30016C17.7072 0.101411 15.3653 0 13 0V2ZM23.9259 6.54718C23.9751 7.69192 24 8.84302 24 10H26C26 8.81436 25.9745 7.63461 25.9241 6.46127L23.9259 6.54718ZM24 10C24 11.157 23.9751 12.3081 23.9259 13.4528L25.9241 13.5387C25.9745 12.3654 26 11.1856 26 10H24ZM19.8503 2.29283C22.092 2.48534 23.8293 4.29889 23.9259 6.54718L25.9241 6.46127C25.7842 3.20897 23.2653 0.578736 20.0215 0.30016L19.8503 2.29283ZM6.14964 17.7072C3.90797 17.5147 2.17075 15.7011 2.07408 13.4528L0.075929 13.5387C0.215764 16.791 2.7347 19.4213 5.97851 19.6998L6.14964 17.7072ZM2.07408 6.54718C2.17075 4.29889 3.90798 2.48534 6.14965 2.29282L5.97853 0.30016C2.73471 0.578735 0.215764 3.20897 0.0759292 6.46127L2.07408 6.54718ZM20.0215 19.6998C23.2653 19.4213 25.7842 16.791 25.9241 13.5387L23.9259 13.4528C23.8292 15.7011 22.092 17.5147 19.8503 17.7072L20.0215 19.6998Z"
                    fill="#94A3B8"
                  />
                </svg>
              </button>
              <button onClick={showPlaylist}>
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
          /// de aici e swiper-ul
          <div className="swiper w-full h-full overflow-auto flex items-center justify-center">
            <div className="flex flex-row max-w-lg gap-4 mx-4 md:mx-auto mt-6 mb-20">
              {songs.map((song, index) => {
                return (
                  <div
                    onClick={() => {
                      setCurrentTrack(song);
                      setCurrentTrackIndex(index);
                      setDisplayPlaylist(false);
                    }}
                    className={`

            flex bg-slate-300 dark:bg-gradient-to-r from-[#0A1122]  to-[#0A1122] p-2 gap-2 text-xs relative cursor-pointer transition-shadow duration-300 shadow-Xl hover:shadow-sky-400 bg-[#27293d] rounded-2xl overflow-hidden text-white border-1 border-sky-700`}>
                    <div className="w-3/12 h-24">
                      <img src={song.cover_art_url} alt="Album Cover" className=" select-none w-24 h-24 rounded-md mr-6 border border-grey-900" />
                    </div>
                    <div className="z-100 mt-[10%] ml-[10%] h-[100%] w-[80%] opacity-25 absolute bg-sky-500 blur-2xl rounded-full "> </div>

                    <div className="w-8/12 flex flex-col gap-2 justify-center">
                      <h6 className="font-semibold text-sm">{song.name}</h6>
                      <p className="text-xs text-gray-400">{song.artist}</p>
                      <p className="text-xs text-gray-400">{song.album}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
