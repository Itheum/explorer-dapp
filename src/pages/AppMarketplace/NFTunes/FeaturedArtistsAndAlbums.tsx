import React, { useEffect, useState } from "react";
import { DasApiAsset } from "@metaplex-foundation/digital-asset-standard-api";
import { Music2, Pause, Play, Loader2, Gift, ShoppingCart } from "lucide-react";
import { Button } from "libComponents/Button";

const dataset = [
  {
    artistId: "ar1",
    name: "Hachi Mugen",
    bio: "Music saved my life. Not everyone gets a second chance. The Ethereal Enclave collapsed and mostly everyone was left for dead or thought to be now what’s left is us. Those who see opportunity despite tragedy and loss... We were BORN TO R1S3. Hachi Mugen was BORN TO R1S3. Welcome to my story.",
    img: "https://assetspublic-itheum-ecosystem.s3.eu-central-1.amazonaws.com/app_nftunes/images/artist_profile/hachi-mugen.jpg",
    dripLink: "https://drip.haus/mugenhachi",
    xLink: "https://x.com/mugenhachi",
    albums: [
      {
        albumId: "ar1_a1",
        solNftNameDrip: "MUSG3 - Mugen Cafe EP",
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
    bio: "Sound Effects/Music Designer for Commercial, NFTs, Games, Videos, Clips",
    img: "https://assetspublic-itheum-ecosystem.s3.eu-central-1.amazonaws.com/app_nftunes/images/artist_profile/manu.jpg",
    dripLink: "",
    xLink: "https://x.com/Manu_Sounds",
    albums: [
      {
        albumId: "ar2_a1",
        solNftNameDrip: "",
        title: "Retrofy",
        desc: "Old-school instrumentals, fat boom-bap drums, 8-bit sounds, lofi flavor, and chill vibes. Take you back to the golden days with nostalgia-filled frequencies!",
        ctaPreviewStream: "https://gateway.pinata.cloud/ipfs/QmegnmMCUMAWaW4BdPBQvWFcXcNffKLa4DJo3jYpMg9Z6j",
        ctaBuy: "",
        ctaAirdrop: "https://drip.haus/itheum",
      },
      {
        albumId: "ar2_a2",
        solNftNameDrip: "MUSG2 - Cranium Beats",
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
    bio: "Mastering AI Tools to Craft cool content for everyone to access!",
    img: "https://assetspublic-itheum-ecosystem.s3.eu-central-1.amazonaws.com/app_nftunes/images/artist_profile/7g0Strike.jpg",
    dripLink: "",
    xLink: "",
    albums: [
      {
        albumId: "ar3_a1",
        solNftNameDrip: "MUSG1 - DnB Music",
        title: "7g0Strike Cafe",
        desc: "Blends lyrics about natural disasters and love, crafted entirely with AI tools",
        ctaPreviewStream: "https://gateway.pinata.cloud/ipfs/QmPRwT6Xt3pqtz7RbBfvaVevkZqgzXpKnVg5Hc115QBzfe",
        ctaBuy: "https://drip.haus/itheum/set/5baed2d8-9f49-41bc-af9e-a2364f79c32a",
        ctaAirdrop: "",
      },
    ],
  },
];

type FeaturedArtistsAndAlbumsProps = {
  mySolAppDataNfts?: DasApiAsset[];
  viewData: (e: number) => void;
  openActionFireLogic?: any;
  stopPreviewPlayingNow?: boolean;
  onPlayHappened?: any;
};

export const FeaturedArtistsAndAlbums = (props: FeaturedArtistsAndAlbumsProps) => {
  const { mySolAppDataNfts, viewData, openActionFireLogic, stopPreviewPlayingNow, onPlayHappened } = props;
  const [audio] = useState(new Audio());
  const [isPreviewPlaying, setIsPreviewPlaying] = useState<boolean>(false);
  const [previewPlayingForAlbumId, setPreviewPlayingForAlbumId] = useState<string | undefined>();
  const [previewIsReadyToPlay, setPreviewIsReadyToPlay] = useState(false);
  const [selArtistId, setSelArtistId] = useState<string>("ar1");
  const [artistProfile, setArtistProfile] = useState<any>(null);
  const [ownedSolDataNftNameAndIndexMap, setOwnedSolDataNftNameAndIndexMap] = useState<any>(null);

  useEffect(() => {
    audio.addEventListener("canplaythrough", function () {
      // Audio is ready to be played
      setPreviewIsReadyToPlay(true);
      // play the song
      if (audio.currentTime == 0) {
        audio.play();
      }
    });
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
    if (mySolAppDataNfts && mySolAppDataNfts.length > 0) {
      console.log("mySolAppDataNfts ");
      console.log(mySolAppDataNfts);

      const nameToIndexMap = mySolAppDataNfts.reduce((t: any, solDataNft: DasApiAsset, idx: number) => {
        if (solDataNft?.content?.metadata?.name) {
          t[solDataNft.content.metadata.name] = idx;
        }
        return t;
      }, {});

      console.log("nameToIndexMap");
      console.log(nameToIndexMap);

      setOwnedSolDataNftNameAndIndexMap(nameToIndexMap);
    }
  }, [mySolAppDataNfts]);

  useEffect(() => {
    if (stopPreviewPlayingNow) {
      playPausePreview(); // with no params wil always go into the stop logic
    }
  }, [stopPreviewPlayingNow]);

  function playPausePreview(previewStreamUrl?: string, albumId?: string) {
    if (previewStreamUrl && albumId && (!isPreviewPlaying || previewPlayingForAlbumId !== albumId)) {
      onPlayHappened(true); // inform parent to stop any other playing streams on its ui

      audio.src = previewStreamUrl; // this fetches the data, but it may not be ready to play yet until canplaythrough fires
      setPreviewIsReadyToPlay(false);

      setIsPreviewPlaying(true);
      setPreviewPlayingForAlbumId(albumId);
    } else {
      audio.src = "";
      audio.currentTime = 0;
      setPreviewIsReadyToPlay(false);
      audio.pause();
      setIsPreviewPlaying(false);
      setPreviewPlayingForAlbumId(undefined);
    }
  }

  function checkOwnershipOfAlbum(solNftName: string) {
    let albumInOwnershipListIndex = -1; // note -1 means we don't own it

    if (ownedSolDataNftNameAndIndexMap && ownedSolDataNftNameAndIndexMap[solNftName]) {
      albumInOwnershipListIndex = ownedSolDataNftNameAndIndexMap[solNftName];
    }

    return albumInOwnershipListIndex;
  }

  return (
    <div className="flex flex-col justify-center items-center w-full p-6 xl:pb-0 bbg-blue-900">
      <div className="flex flex-col mb-16 xl:mb-32 justify-center w-[100%] items-center xl:items-start">
        <div className="flex flex-row rounded-lg mb-12 px-8 xl:px-16 text-center gap-4 bg-primary md:text-2xl xl:text-3xl justify-center items-center ">
          <Music2 className="text-secondary" />
          <span className="text-secondary">Featured Artists & Albums</span>
          <Music2 className="text-secondary" />
        </div>

        <div className="flex flex-col md:flex-row w-[100%] items-start bgg-purple-900">
          <div className="artist-list flex py-2 md:pt-0 md:flex-col md:justify-center items-center w-[350px] md:w-[350px] gap-5 overflow-x-scroll md:overflow-x-auto bbg-800">
            {dataset.map((artist: any) => (
              <div
                key={artist.artistId}
                className={`flex flex-col p-5 items-center w-[200px] md:w-[80%] xl:w-[100%] bg-background rounded-xl border border-primary/50 ${artist.artistId === selArtistId ? "bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-30% to-[#5D3899] to-95%" : "cursor-pointer"}`}
                onClick={() => {
                  if (artist.artistId !== selArtistId) {
                    setSelArtistId(artist.artistId);
                  }
                }}>
                <h2 className={`${artist.artistId === selArtistId ? "!text-white" : ""} !text-lg md:!text-2xl text-nowrap text-center`}>{artist.name}</h2>
              </div>
            ))}
          </div>

          <div className="artist-profile flex flex-col xl:flex-row justify-center items-center gap-8 w-full bbg-blue-700">
            <div className="flex flex-col gap-4 p-8 items-start md:w-[90%] bg-background rounded-xl border border-primary/50 min-h-[350px]">
              {!artistProfile ? (
                <div>Loading</div>
              ) : (
                <>
                  <div className="artist-bio w-full">
                    <div
                      className="border-[0.5px] border-neutral-500/90 h-[100px] md:h-[250px] md:w-[100%] bg-no-repeat bg-contain md:bg-cover rounded-xl"
                      style={{
                        "backgroundImage": `url(${artistProfile.img})`,
                      }}></div>
                    <p className="artist-who mt-2">{artistProfile.bio}</p>
                    <div className="flex mt-2">
                      {artistProfile.dripLink && (
                        <a className="underline hover:no-underline mx-2" href={artistProfile.dripLink} target="_blank">
                          Artist on Drip
                        </a>
                      )}
                      {artistProfile.xLink && (
                        <a className="underline hover:no-underline mx-2" href={artistProfile.xLink} target="_blank">
                          Artist on X
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="album-list w-full">
                    <p className="mt-10 mb-5 text-xl font-bold">NF-Tunes Discography</p>

                    {artistProfile.albums.map((album: any, idx: number) => (
                      <div key={album.albumId} className="album flex flex-col bbg-500 h-[100%] mb-3 p-5 border">
                        <h3 className="!text-xl mb-2">
                          <span className="text-3xl mr-1 opacity-50">{`${idx + 1}. `}</span>
                          {`${album.title}`}
                        </h3>
                        <p className="">{album.desc}</p>
                        {/* <p className="">previewIsReadyToPlay {previewIsReadyToPlay.toString()}</p> */}
                        <div className="album-actions mt-3 flex">
                          {album.ctaPreviewStream && (
                            <Button
                              disabled={isPreviewPlaying && !previewIsReadyToPlay}
                              className="!text-white text-sm mx-2 bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-30% to-[#5D3899] to-95% cursor-pointer"
                              onClick={() => {
                                playPausePreview(album.ctaPreviewStream, album.albumId);
                              }}>
                              {isPreviewPlaying && previewPlayingForAlbumId === album.albumId ? (
                                <>
                                  {!previewIsReadyToPlay ? <Loader2 /> : <Pause />}
                                  <span className="ml-2">Stop Playing Preview</span>
                                </>
                              ) : (
                                <>
                                  <Play />
                                  <span className="ml-2">Play Preview</span>
                                </>
                              )}
                            </Button>
                          )}
                          {/* {checkOwnershipOfAlbum(album.solNftNameDrip) > -1 && (
                            <Button
                              className="!text-black text-sm px-[2.35rem] bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100 mx-2"
                              onClick={() => {
                                viewData(checkOwnershipOfAlbum(album.solNftNameDrip));

                                if (openActionFireLogic) {
                                  openActionFireLogic();
                                }
                              }}>
                              <>
                                <Music2 />
                                <span className="ml-2">Play Album</span>
                              </>
                            </Button>
                          )} */}
                          {album.ctaBuy && (
                            <Button
                              className="!text-black text-sm px-[2.35rem] bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100 mx-2 cursor-pointer"
                              onClick={() => {
                                window.open(album.ctaBuy)?.focus();
                              }}>
                              <>
                                <ShoppingCart />
                                <span className="ml-2">Buy Album</span>
                              </>
                            </Button>
                          )}
                          {album.ctaAirdrop && (
                            <Button
                              className="!text-white text-sm px-[2.35rem] bottom-1.5 bg-gradient-to-r from-yellow-700 to-orange-800 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100 mx-2 cursor-pointer"
                              onClick={() => {
                                window.open(album.ctaAirdrop)?.focus();
                              }}>
                              <>
                                <Gift />
                                <span className="ml-2">Get Album for Free!</span>
                              </>
                            </Button>
                          )}
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
