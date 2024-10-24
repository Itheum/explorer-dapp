import React, { useEffect, useState } from "react";
import { Music2, Pause, Play, Loader2, Gift, ShoppingCart } from "lucide-react";
import { Button } from "libComponents/Button";
import { gtagGo } from "libs/utils/misc";

const dataset = [
  {
    artistId: "ar1",
    name: "Hachi Mugen",
    slug: "hachi-mugen",
    bio: "Music saved my life. Not everyone gets a second chance. The Ethereal Enclave collapsed and mostly everyone was left for dead or thought to be now what’s left is us. Those who see opportunity despite tragedy and loss... We were BORN TO R1S3. Hachi Mugen was BORN TO R1S3. Welcome to my story.",
    img: "https://assetspublic-itheum-ecosystem.s3.eu-central-1.amazonaws.com/app_nftunes/images/artist_profile/hachi-mugen.jpg",
    dripLink: "https://drip.haus/mugenhachi",
    xLink: "https://x.com/mugenhachi",
    albums: [
      {
        albumId: "ar1_a1",
        solNftName: "MUSG3 - Mugen Cafe EP",
        title: "Mugen Cafe",
        desc: "Cafe-style, laid-back, Lo-fi tracks to sooth your soothe",
        ctaPreviewStream: "https://gateway.pinata.cloud/ipfs/QmU82pDyHJRey4YfwtyDDdgwFtubCd5Xg4wPwfKJR8JppQ",
        ctaBuy: "https://drip.haus/itheum/set/662d1e23-5bc2-454c-989a-123c403465cc",
        ctaAirdrop: "",
      },
    ],
  },
  {
    artistId: "ar2",
    name: "YFGP",
    slug: "yfgp",
    bio: "YFGP is a cutting-edge sound effects and music designer from Romania, known for merging unique music and art. Specializing in creating for commercials, NFTs, games, and videos, YFGP brings a fresh approach to digital and multimedia projects.",
    img: "https://assetspublic-itheum-ecosystem.s3.eu-central-1.amazonaws.com/app_nftunes/images/artist_profile/manu.jpg",
    dripLink: "",
    xLink: "https://x.com/Manu_Sounds",
    albums: [
      {
        albumId: "ar2_a1",
        solNftName: "MUSG4 - Retrofy YFGP",
        title: "Retrofy",
        desc: "Old-school instrumentals, fat boom-bap drums, 8-bit sounds, lofi flavor, and chill vibes. Take you back to the golden days with nostalgia-filled frequencies!",
        ctaPreviewStream: "https://gateway.pinata.cloud/ipfs/QmegnmMCUMAWaW4BdPBQvWFcXcNffKLa4DJo3jYpMg9Z6j",
        ctaBuy: "https://drip.haus/itheum/set/df074d5e-030f-4338-a2d6-ce430c6a86a9",
        ctaAirdrop: "",
      },
      {
        albumId: "ar2_a2",
        solNftName: "MUSG2 - Cranium Beats",
        title: "Cranium Beats",
        desc: "Dark Hip Hop Instrumentals Ultimate Album, produced by YFGP; sample-based with underground flavor and dark vibes!",
        ctaPreviewStream: "https://gateway.pinata.cloud/ipfs/QmRmMRDD8nEnmDpwpmnoadHrdbWrWradTg3jb4FnN1aWUv",
        ctaBuy: "https://drip.haus/itheum/set/325fab5f-83ad-4fdb-9a89-aba05452f54b",
        ctaAirdrop: "",
      },
    ],
  },
  {
    artistId: "ar3",
    name: "7g0Strike",
    slug: "7g0strike",
    bio: "7g0Strike transforms into a generative music artist, using AI tools to create unique tracks. By blending creativity with technology, 7g0Strike shows how AI can inspire new forms of artistic expression for everyone to experience.",
    img: "https://assetspublic-itheum-ecosystem.s3.eu-central-1.amazonaws.com/app_nftunes/images/artist_profile/7g0Strike.jpg",
    dripLink: "",
    xLink: "",
    albums: [
      {
        albumId: "ar3_a1",
        solNftName: "MUSG1 - DnB Music",
        title: "Love in Disasters",
        desc: "Blends lyrics about natural disasters and love, crafted entirely with AI tools",
        ctaPreviewStream: "https://gateway.pinata.cloud/ipfs/QmPRwT6Xt3pqtz7RbBfvaVevkZqgzXpKnVg5Hc115QBzfe",
        ctaBuy: "https://drip.haus/itheum/set/5baed2d8-9f49-41bc-af9e-a2364f79c32a",
        ctaAirdrop: "",
      },
    ],
  },
  {
    artistId: "ar4",
    name: "LLLUNA01",
    slug: "llluna01",
    bio: "LLLUNA01, a multimedia and multi-genre artist emerging from the streets of Los Angeles. From ghettos to galaxies, he has established himself as a creative force with a diverse skill set focusing on Audio, Visuals, and Culture. From the underground to professionalism, LLLUNA01 looks to help move the music industry forward with education, culture, and technology.",
    img: "https://assetspublic-itheum-ecosystem.s3.eu-central-1.amazonaws.com/app_nftunes/images/artist_profile/llluna01.jpg",
    dripLink: "https://drip.haus/llluna01",
    xLink: "https://twitter.com/0xLuna01",
    webLink: "https://linktr.ee/llluna01",
    albums: [
      {
        albumId: "ar4_a1",
        solNftName: "MUSG5 - Diaspora EP - LLLUNA01",
        title: "Diaspora EP",
        desc: "Diaspora by LLLUNA01 fuses Dubstep, Trap, and Drum & Bass Jungle into a high-energy, bass-heavy journey through global underground sounds.",
        ctaPreviewStream: "https://assetspublic-itheum-ecosystem.s3.eu-central-1.amazonaws.com/app_nftunes/music/preview/llluna01-diaspora.mp3",
        ctaBuy: "https://drip.haus/itheum/set/3866c693-3505-4ec1-b81f-7a4db8e4747d",
        ctaAirdrop: "",
      },
    ],
  },
  {
    artistId: "ar5",
    name: "Stephen Snodgrass",
    slug: "stephen-snodgrass",
    bio: "SF-based musician/recording artist, photographer and videographer, creating Music NFT's on the blockchain",
    img: "https://assetspublic-itheum-ecosystem.s3.eu-central-1.amazonaws.com/app_nftunes/images/artist_profile/stephen-snodgrass.jpg",
    dripLink: "",
    xLink: "https://x.com/the_economystic",
    webLink: "",
    albums: [
      {
        albumId: "ar5_a1",
        solNftName: "",
        mvxDataNftId: "DATANFTFT-e936d4-ae",
        title: "Two Weeks",
        desc: "A collection of 3 songs, was composed and recorded by myself over the course of two weeks in the Summer of 2024. The first song of the EP, Otherside, is the first song I ever wrote back in the Summer of 2021. All vocals and instrumentation performed by Stephen Snodgrass.",
        ctaPreviewStream: "https://gateway.pinata.cloud/ipfs/Qme3F97bs7MtkdshibxauHHDNLSvKtvw3nhJ3NiQXpGkGR",
        ctaBuy: "https://datadex.itheum.io/datanfts/marketplace/DATANFTFT-e936d4-ae",
        ctaAirdrop: "",
      },
    ],
  },
  {
    artistId: "ar6",
    name: "Deep Forest",
    slug: "deep-forest",
    bio: "Deep Forest, founded by composer, musician, and producer Eric Mouquet, is a pioneering group in electronic and world music and the first French artist to win a Grammy in 1995 for the album Bohème (Best World Music Album), and has also received a World Music Award and an MTV Award.",
    img: "https://assetspublic-itheum-ecosystem.s3.eu-central-1.amazonaws.com/app_nftunes/images/artist_profile/deep-forest.jpg",
    dripLink: "",
    xLink: "https://twitter.com/deep_forest",
    webLink: "https://www.deep-forest.fr/",
    albums: [
      {
        albumId: "ar6_a1",
        solNftName: "",
        mvxDataNftId: "DFEE-72425b",
        title: "Ethereal Echoes",
        desc: "The Chronicles of Deep Forest – an exclusive digital EP released to celebrate the 30th anniversary of their Grammy win.",
        ctaPreviewStream: "https://explorer.itheum.io/assets/deep-forest-preview-mix-D_1v3lz4.mp3",
        ctaBuy: "https://datadex.itheum.io/datanfts/marketplace/DFEE-72425b-13",
        ctaAirdrop: "",
      },
    ],
  },
  {
    artistId: "ar7",
    name: "3OE",
    slug: "3oe",
    bio: "Shaped by space and time, we create immersive soundscapes that reflect shifting moods and environments. Each piece is a journey through evolving expressions, offering a pleasant musical experience.",
    img: "https://assetspublic-itheum-ecosystem.s3.eu-central-1.amazonaws.com/app_nftunes/images/artist_profile/3oe.jpg",
    dripLink: "",
    xLink: "",
    webLink: "",
    albums: [
      {
        albumId: "ar7_a1",
        solNftName: "MUSG6 - Eternal Echo - 3OE",
        mvxDataNftId: "",
        title: "Eternal Echo",
        desc: "This is the premier Digital EP from 3OE - it delivers immersive soundscapes for a pleasant musical experience.",
        ctaPreviewStream: "https://gateway.pinata.cloud/ipfs/QmVc3L5J2x6RTuxTD3W5f83AEMXD6b9v2DELu5R9vhiStt",
        ctaBuy: "https://drip.haus/itheum/set/6f744afb-cc1f-4a66-8b85-aaa34da9af9f",
        ctaAirdrop: "",
      },
    ],
  },
  {
    artistId: "ar8",
    name: "Waveborn Luminex",
    slug: "waveborn-luminex",
    bio: " Waveborn Luminex emerges as a radiant force in the electronic music realm, embodying the essence of soundwaves that shape their very being. With an avatar crafted from vibrant frequencies and pulsating rhythms, they illuminate the dance floor with electrifying energy, that invites listeners to immerse themselves in a cosmic journey.",
    img: "https://assetspublic-itheum-ecosystem.s3.eu-central-1.amazonaws.com/app_nftunes/images/artist_profile/waveborn-luminex.jpg",
    dripLink: "",
    xLink: "",
    webLink: "",
    albums: [
      {
        albumId: "ar8_a1",
        solNftName: "MUSG7 - Galactic Gravity",
        mvxDataNftId: "",
        title: "Suno",
        desc: "This is the premier Digital EP from Waveborn Luminex that delivers a unique electro pop musical experience.",
        ctaPreviewStream: "https://gateway.pinata.cloud/ipfs/QmeTrvB5o5Ki8MALogN9tjHmJsai4wpBy8EYA38JHK2ceF",
        ctaBuy: "https://drip.haus/itheum/set/0bba5f0b-4449-458b-b717-083eefa53a2c",
        ctaAirdrop: "",
      },
    ],
  },
];

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
  const [audio] = useState(new Audio());
  const [isPreviewPlaying, setIsPreviewPlaying] = useState<boolean>(false);
  const [previewPlayingForAlbumId, setPreviewPlayingForAlbumId] = useState<string | undefined>();
  const [previewIsReadyToPlay, setPreviewIsReadyToPlay] = useState(false);
  const [selArtistId, setSelArtistId] = useState<string>("ar1");
  const [artistProfile, setArtistProfile] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("00:00");
  const [progress, setProgress] = useState(0);

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
    playPausePreview(); // with no params wil always go into the stop logic

    setArtistProfile(dataset.find((i) => i.artistId === selArtistId));
  }, [selArtistId]);

  useEffect(() => {
    if (featuredArtistDeepLinkSlug) {
      const findArtistBySlug = dataset.find((i) => i.slug === featuredArtistDeepLinkSlug);

      if (findArtistBySlug) {
        setSelArtistId(findArtistBySlug.artistId);
      }
    }
  }, [featuredArtistDeepLinkSlug]);

  useEffect(() => {
    if (stopPreviewPlayingNow) {
      playPausePreview(); // with no params wil always go into the stop logic
    }
  }, [stopPreviewPlayingNow]);

  async function playPausePreview(previewStreamUrl?: string, albumId?: string) {
    if (previewStreamUrl && albumId && (!isPreviewPlaying || previewPlayingForAlbumId !== albumId)) {
      onPlayHappened(true); // inform parent to stop any other playing streams on its ui

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
      audio.src = "";
      audio.currentTime = 0;
      audio.pause();
      setPreviewIsReadyToPlay(false);
      setIsPreviewPlaying(false);
      setPreviewPlayingForAlbumId(undefined);
    }
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

        <div className="flex flex-col md:flex-row w-[100%] items-start bgg-purple-900">
          <div className="artist-list flex py-2 pb-5 mb-5 md:mb-0 md:pt-0 md:flex-col md:justify-center items-center w-[320px] md:w-[350px] gap-5 overflow-x-scroll md:overflow-x-auto bbg-800">
            {dataset.map((artist: any) => (
              <div
                key={artist.artistId}
                className={`flex flex-col p-5 items-center w-[200px] md:w-[80%] xl:w-[100%] bg-background rounded-xl border border-primary/50 ${artist.artistId === selArtistId ? "bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-30% to-[#5D3899] to-95%" : "cursor-pointer"}`}
                onClick={() => {
                  if (artist.artistId !== selArtistId) {
                    setSelArtistId(artist.artistId);

                    gtagGo("NtuArAl", "ViewProfile", "Artist", artist.artistId);
                  }
                }}>
                <h2 className={`${artist.artistId === selArtistId ? "!text-white" : ""} !text-lg lg:!text-xl text-nowrap text-center`}>{artist.name}</h2>
              </div>
            ))}
          </div>

          <div className="artist-profile flex flex-col xl:flex-row justify-center items-center gap-8 w-full mt-2 md:mt-0 bbg-blue-700">
            <div className="flex flex-col gap-4 p-8 items-start md:w-[90%] bg-background rounded-xl border border-primary/50 min-h-[350px]">
              {!artistProfile ? (
                <div>Loading</div>
              ) : (
                <>
                  <div className="artist-bio w-[300px] md:w-full">
                    <div
                      className="border-[0.5px] border-neutral-500/90 h-[100px] md:h-[250px] md:w-[100%] bg-no-repeat bg-cover rounded-xl"
                      style={{
                        "backgroundImage": `url(${artistProfile.img})`,
                      }}></div>
                    <p className="artist-who mt-5">{artistProfile.bio}</p>
                    {(artistProfile.dripLink !== "" || artistProfile.xLink !== "" || artistProfile.webLink !== "") && (
                      <div className="flex flex-col md:flex-row mt-5">
                        {artistProfile.dripLink && (
                          <div>
                            +
                            <a className="underline hover:no-underline mx-2" href={artistProfile.dripLink} target="_blank">
                              Artist on Drip
                            </a>
                          </div>
                        )}
                        {artistProfile.xLink && (
                          <div>
                            +
                            <a className="underline hover:no-underline mx-2" href={artistProfile.xLink} target="_blank">
                              Artist on X
                            </a>
                          </div>
                        )}
                        {artistProfile.webLink && (
                          <div>
                            +
                            <a className="underline hover:no-underline mx-2" href={artistProfile.webLink} target="_blank">
                              Artist Web
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="album-list w-[300px] lg:w-full">
                    <p className="mt-5 mb-5 text-xl font-bold">NF-Tunes Discography</p>

                    {artistProfile.albums.map((album: any, idx: number) => (
                      <div key={album.albumId} className="album flex flex-col bbg-500 h-[100%] mb-3 p-5 border">
                        <h3 className="!text-xl mb-2">
                          <span className="text-3xl mr-1 opacity-50">{`${idx + 1}. `}</span>
                          {`${album.title}`}
                        </h3>
                        <p className="">{album.desc}</p>
                        <div className="album-actions mt-3 flex flex-col lg:flex-row space-y-2 lg:space-y-0">
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
                          <>
                            {checkOwnershipOfAlbum(album) > -1 && (
                              <Button
                                disabled={isPreviewPlaying && !previewIsReadyToPlay}
                                className="!text-black text-sm px-[2.35rem] bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100 mx-2"
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
                                  <span className="ml-2">Get Album for Free!</span>
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
        </div>
      </div>
    </div>
  );
};
