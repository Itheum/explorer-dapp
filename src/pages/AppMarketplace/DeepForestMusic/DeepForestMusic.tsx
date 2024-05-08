import React, { useEffect, useState } from "react";
import { DataNft, ViewDataReturnType } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo, useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { motion } from "framer-motion";
import { MoveDown, Music, Music2, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { NF_TUNES_TOKENS, FEATURED_NF_TUNES_TOKEN, IS_DEVNET } from "appsConfig";
import disk from "assets/img/nf-tunes-logo-disk.png";
import { DataNftCard, Loader } from "components";
import { AudioPlayer } from "components/AudioPlayer/AudioPlayer";
import { HeaderComponent } from "components/Layout/HeaderComponent";
import { Modal } from "components/Modal/Modal";
import YouTubeEmbed from "components/YouTubeEmbed";
import { SHOW_NFTS_STEP } from "config";
import { useGetPendingTransactions } from "hooks";
import { Button } from "libComponents/Button";
import { useTheme } from "libComponents/ThemeProvider";
import { BlobDataType, ExtendedViewDataReturnType } from "libs/types";
import { decodeNativeAuthToken, getApiDataMarshal, toastError } from "libs/utils";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { scrollToSection } from "libs/utils";
import { useNftsStore } from "store/nfts";
import benefitsLogo1 from "../../../assets/img/nf-tunes/benefits-logo1.png";
import benefitsLogo2 from "../../../assets/img/nf-tunes/benefits-logo2.png";
import benefitsLogo3 from "../../../assets/img/nf-tunes/benefits-logo3.png";
import manuImage from "../../../assets/img/nf-tunes/manu.png";
import megaphoneLight from "../../../assets/img/nf-tunes/megaphone-light.png";
import megaphone from "../../../assets/img/nf-tunes/megaphone.png";
import musicNoteBlack from "../../../assets/img/nf-tunes/music-note-black.png";
import musicNote from "../../../assets/img/nf-tunes/music-note-white.png";
import frameItLogoLight from "../../../assets/img/nf-tunes/platforms-logo/frame-it-light.png";
import frameItLogo from "../../../assets/img/nf-tunes/platforms-logo/frame-it.png";
import itheumLogoLight from "../../../assets/img/nf-tunes/platforms-logo/itheum-light.png";
import itheumLogo from "../../../assets/img/nf-tunes/platforms-logo/itheum.png";
import multiversxLogoLight from "../../../assets/img/nf-tunes/platforms-logo/multiversx-light.png";
import multiversxLogo from "../../../assets/img/nf-tunes/platforms-logo/multiversx.png";
import pulsarLogoLight from "../../../assets/img/nf-tunes/platforms-logo/pulsar-money-light.png";
import pulsarLogo from "../../../assets/img/nf-tunes/platforms-logo/pulsar-money.png";
import xoxnoLogoLight from "../../../assets/img/nf-tunes/platforms-logo/xoxno-light.png";
import xoxnoLogo from "../../../assets/img/nf-tunes/platforms-logo/xoxno.png";
import stick from "../../../assets/img/nf-tunes-logo-stick.png";
import backCube from "../../../assets/img/zstorage/back.png";
import cubes from "../../../assets/img/zstorage/cubes.png";
import dataLines from "../../../assets/img/zstorage/data-lines.png";
import frontCube from "../../../assets/img/zstorage/front.png";
import vault from "../../../assets/img/zstorage/vault-dots.png";

// deep forest
import iconPreview from "assets/img/deep-forest-music/preview.jpg";
import iconPreviewAudioPlayer from "assets/img/deep-forest-music/deep-forest.png";
import { HoverEffect } from "libComponents/animated/HoverEffect";

export const DeepForestMusic = () => {
  const albums = [
    {
      title: "Eponymous",
      image: "src/assets/img/deep-forest-music/1.jpg",
      link: "/deep-forest-music", // TODO add the link to datadex??
      ownedDataNftIndex: -1,
    },
    {
      title: "Deep Brasil",
      image: "src/assets/img/deep-forest-music/2.jpg",
      link: "/deep-forest-music", // TODO add the link to datadex??
    },
    {
      title: "Deep Africa",
      image: "src/assets/img/deep-forest-music/3.jpg",
      link: "/deep-forest-music", // TODO add the link to datadex??
    },
    {
      title: "Evo Devo",
      image: "src/assets/img/deep-forest-music/4.jpg",
      link: "/deep-forest-music", // TODO add the link to datadex??
    },
    {
      title: "Epic Circuits",
      image: "src/assets/img/deep-forest-music/5.jpg",
      link: "/deep-forest-music", // TODO add the link to datadex??
    },
    {
      title: "Deep Symphonic",
      image: "src/assets/img/deep-forest-music/6.jpg",
      link: "/deep-forest-music", // TODO add the link to datadex??
    },
    {
      title: "Live at EMM Studios",
      image: "src/assets/img/deep-forest-music/7.jpg",
      link: "/deep-forest-music", // TODO add the link to datadex??
    },
    {
      title: "Burning",
      image: "src/assets/img/deep-forest-music/8.jpg",
      link: "/deep-forest-music", // TODO add the link to datadex??
    },
    {
      title: "Crystal Clear",
      image: "src/assets/img/deep-forest-music/9.jpg",
      link: "/deep-forest-music", // TODO add the link to datadex??
    },
  ];
  const [albumsState, setAlbumsState] = useState(albums);
  const { tokenLogin } = useGetLoginInfo();
  const { chainID } = useGetNetworkConfig();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const [shownAppDataNfts, setShownAppDataNfts] = useState<DataNft[]>([]);
  const [featuredArtistDataNft, setFeaturedArtistDataNft] = useState<DataNft>();
  const [featuredDataNftIndex, setFeaturedDataNftIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  const [viewDataRes, setViewDataRes] = useState<ExtendedViewDataReturnType>();
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [dataMarshalResponse, setDataMarshalResponse] = useState({ "data_stream": {}, "data": [] });
  const [firstSongBlobUrl, setFirstSongBlobUrl] = useState<string>();
  const [dataNftToOpen, setDataNftToOpen] = useState<DataNft>();
  const { nfts, isLoading: isLoadingUserNfts } = useNftsStore();
  const nfTunesTokens = [...NF_TUNES_TOKENS].filter((v) => nfts.find((nft) => nft.collection === v.tokenIdentifier && nft.nonce === v.nonce));

  useEffect(() => {
    window.scrollTo(0, 80);
  }, []);

  useEffect(() => {
    checkDeepForestOwnedAlbums();
  }, [nfts]);

  function checkDeepForestOwnedAlbums() {
    nfts.forEach((nft, index) => {
      if (nft.collection == "DFEE-72425b") {
        const albumIndex = Math.floor((Number(nft.title.split("#")[1]) - 1) / 10); // the title has the format EtherealEchoes #1 - #90
        setAlbumsState((prev) => {
          const newAlbums = [...prev];
          newAlbums[albumIndex].ownedDataNftIndex = index;
          return newAlbums;
        });
      }
    });
  }

  // after pressing the button to view data open modal
  async function viewData(index: number) {
    try {
      if (!(index >= 0)) {
        toastError("Data is not loaded");
        return;
      }
      setFirstSongBlobUrl(undefined);

      const dataNft = new DataNft(nfts[index]);
      console.log("dataNft", dataNft);
      setIsFetchingDataMarshal(true);
      const audioPlayerModalTrigger = document.getElementById("audio-player-modal-trigger");
      if (audioPlayerModalTrigger) {
        audioPlayerModalTrigger.click();
      }

      let res: any;
      if (!(tokenLogin && tokenLogin.nativeAuthToken)) {
        throw Error("No nativeAuth token");
      }

      const arg = {
        mvxNativeAuthOrigins: [decodeNativeAuthToken(tokenLogin.nativeAuthToken).origin],
        mvxNativeAuthMaxExpirySeconds: 3600,
        fwdHeaderMapLookup: {
          "authorization": `Bearer ${tokenLogin.nativeAuthToken}`,
        },
        stream: true,
      };
      setCurrentIndex(index);
      setDataNftToOpen(dataNft);
      if (!dataNft.dataMarshal || dataNft.dataMarshal === "") {
        dataNft.updateDataNft({ dataMarshal: getApiDataMarshal(chainID) });
      }
      // start the request for the first song
      const firstSongResPromise: any = dataNft.viewDataViaMVXNativeAuth({
        mvxNativeAuthOrigins: [decodeNativeAuthToken(tokenLogin.nativeAuthToken).origin],
        mvxNativeAuthMaxExpirySeconds: 3600,
        fwdHeaderMapLookup: { "authorization": `Bearer ${tokenLogin?.nativeAuthToken}` },
        stream: true,
        nestedIdxToStream: 1, // get the song for the first index
      });

      // start the request for the manifest file from marshal
      res = await dataNft.viewDataViaMVXNativeAuth(arg);

      let blobDataType = BlobDataType.TEXT;
      if (!res.error) {
        if (res.contentType.search("application/json") >= 0) {
          res.data = await (res.data as Blob).text();
          res.data = JSON.stringify(JSON.parse(res.data), null, 4);
        }
      } else {
        console.error(res.error);
        toastError(res.error);
      }
      const viewDataPayload: ExtendedViewDataReturnType = {
        ...res,
        blobDataType,
      };
      setDataMarshalResponse(JSON.parse(res.data));
      setViewDataRes(viewDataPayload);
      setIsFetchingDataMarshal(false);

      // await the first song response and set the firstSongBlobUrl state
      const firstSongRes: ViewDataReturnType = await firstSongResPromise;
      const blobUrl = URL.createObjectURL(firstSongRes.data);
      console.log("blobUrl", blobUrl);
      setFirstSongBlobUrl(blobUrl);
    } catch (err) {
      console.error(err);
      toastError((err as Error).message);
      setIsFetchingDataMarshal(false);
    }
  }

  return (
    <div className="relative flex flex-col justify-center items-center w-full overflow-hidden">
      <div className="w-full  h-[2px] bg-[linear-gradient(to_right,#4a6741,#00755E,#00755E,#19351E,#1C3C13,#4a6741)] animate-gradient bg-[length:200%_auto]"></div>
      <div className=" flex flex-col justify-center items-center font-[Clash-Regular] w-full max-w-[100rem]">
        <div className="flex flex-col w-[90%] md:w-[70%] p-10">
          <img src={iconPreview} className="rounded-2xl" />
          <Modal
            openTrigger={
              <button className="h-64 bottom-0 right-0 flex rounded-full justify-center w-full mt-[-11rem]">
                Preview <PlayCircle className="scale-[3] cursor-pointer text-secondary dark:text-primary" />
              </button>
            }
            closeOnOverlayClick={true}
            title={"Music Data Nft Preview"}
            hasFilter={false}
            filterData={[]}
            titleClassName={"p-8"}>
            <>
              <AudioPlayer
                previewUrl={"src/assets/img/deep-forest-music/previewSongs.mp3"}
                songs={[
                  {
                    "idx": 1,
                    "description": "The Chronicles of Deep Forest - 30 Years Anniversary by Eric Mouquet | Grammy Award Winner",
                    "category": "Preview",
                    "album": "EtherealEchoes",
                    "cover_art_url": iconPreviewAudioPlayer,
                    "title": "Deep Forest Music Preview",
                  },
                ]}
              />
            </>
          </Modal>

          {/* <p> Deep Forest Music </p>
          <p>
            These NFTs aren't just static pieces of digital art, they are immersive experiences. Each of the 90 NFTs is brought to life through a unique
            graphical Artwork, a bonus unreleased track and only one NFT per category is crowned with a personal message from Eric Mouquet to its owner. Yet,
            the allure of these music dataNFTs extends beyond their aesthetic and sentimental value. Each NFT is imbued with real-life utility, making them not
            just collector's items, but practical digital assets in various realms, like access to concerts, whitelisting, access to unreleased versions of the
            tracks, multi-track files, physical items and many more in the future.
          </p> */}
          <div className="flex text-foreground flex-row rounded-lg mt-8 p-1  text-center gap-4 text-2xl md:w-[50%]  xl:text-3xl justify-center md:justify-start items-center ">
            <Music2 />
            <span>Albums</span>
            <Music2 />
          </div>
          <div className="relative ">
            {" "}
            <div className="w-full  h-[2px] bg-[linear-gradient(to_right,#4a6741,#00755E,#00755E,#19351E,#1C3C13,#4a6741)] animate-gradient bg-[length:200%_auto]"></div>
            <HoverEffect items={albumsState} viewData={viewData} className="text-base text-foreground font-medium pt-2" />
          </div>
        </div>
      </div>
      <Modal
        openTrigger={<button id="audio-player-modal-trigger"></button>}
        closeOnOverlayClick={true}
        title={dataNftToOpen?.title}
        hasFilter={false}
        filterData={[]}
        titleClassName={"p-4 "}>
        {isFetchingDataMarshal ? (
          <div
            className="flex flex-col items-center justify-center"
            style={{
              minHeight: "40rem",
            }}>
            <div>
              <Loader noText />
              <p className="text-center text-foreground">Loading...</p>
            </div>
          </div>
        ) : (
          <>
            {viewDataRes && !viewDataRes.error && tokenLogin && (
              <AudioPlayer
                dataNftToOpen={dataNftToOpen}
                songs={dataMarshalResponse ? dataMarshalResponse.data : []}
                tokenLogin={tokenLogin}
                firstSongBlobUrl={firstSongBlobUrl}
                chainID={chainID}
              />
            )}
          </>
        )}
      </Modal>
      <div className="w-full  h-[2px] bg-[linear-gradient(to_right,#4a6741,#00755E,#00755E,#19351E,#1C3C13,#4a6741)] animate-gradient bg-[length:200%_auto]"></div>
    </div>
  );
};
