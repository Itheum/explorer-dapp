import React, { useEffect, useState } from "react";
import { DataNft, ViewDataReturnType } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo, useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { Music2, PlayCircle } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import album1 from "assets/img/deep-forest-music/1.jpg";
import album2 from "assets/img/deep-forest-music/2.jpg";
import album3 from "assets/img/deep-forest-music/3.jpg";
import album4 from "assets/img/deep-forest-music/4.jpg";
import album5 from "assets/img/deep-forest-music/5.jpg";
import album6 from "assets/img/deep-forest-music/6.jpg";
import album7 from "assets/img/deep-forest-music/7.jpg";
import album8 from "assets/img/deep-forest-music/8.jpg";
import album9 from "assets/img/deep-forest-music/9.jpg";
// deep forest
import deepForestPreviewMix from "assets/img/deep-forest-music/deep-forest-preview-mix.mp3";
import iconPreviewAudioPlayer from "assets/img/deep-forest-music/deep-forest.png";
import iconPreview from "assets/img/deep-forest-music/header.png";
import { Loader } from "components";
import { AudioPlayer } from "components/AudioPlayer/AudioPlayer";
import { Modal } from "components/Modal/Modal";
import { HoverEffect } from "libComponents/animated/HoverEffect";
import { BlobDataType, ExtendedViewDataReturnType } from "libs/types";
import { decodeNativeAuthToken, getApiDataMarshal, toastError } from "libs/utils";
import { useNftsStore } from "store/nfts";

export const DeepForestMusic = () => {
  const albums = [
    {
      title: "Eponymous",
      image: album1,
      ownedDataNftIndex: -1,
    },
    {
      title: "Deep Brasil",
      image: album2,
    },
    {
      title: "Deep Africa",
      image: album3,
    },
    {
      title: "Evo Devo",
      image: album4,
    },
    {
      title: "Epic Circuits",
      image: album5,
    },
    {
      title: "Deep Symphonic",
      image: album6,
    },
    {
      title: "Live at EMM Studios",
      image: album7,
    },
    {
      title: "Burning",
      image: album8,
    },
    {
      title: "Crystal Clear",
      image: album9,
    },
  ];
  const [albumsState, setAlbumsState] = useState(albums);
  const { tokenLogin } = useGetLoginInfo();
  const { chainID } = useGetNetworkConfig();
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  const [viewDataRes, setViewDataRes] = useState<ExtendedViewDataReturnType>();
  const [dataMarshalResponse, setDataMarshalResponse] = useState({ "data_stream": {}, "data": [] });
  const [firstSongBlobUrl, setFirstSongBlobUrl] = useState<string>();
  const [dataNftToOpen, setDataNftToOpen] = useState<DataNft>();
  const { mvxNfts: nfts } = useNftsStore();

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
      setFirstSongBlobUrl(blobUrl);
    } catch (err) {
      console.error(err);
      toastError((err as Error).message);
      setIsFetchingDataMarshal(false);
    }
  }

  return (
    <div className="relative flex flex-col justify-center items-center w-full overflow-hidden">
      <div className="w-full  h-[2px] bg-[linear-gradient(to_right,#166B6A,#02292F,#00755E,#02292F,#166B6A)] animate-gradient bg-[length:200%_auto]"></div>
      <div className=" flex flex-col justify-center items-center font-[Clash-Regular] w-full max-w-[100rem]">
        <div className="flex flex-col w-[90%] md:w-[70%] p-10">
          <img src={iconPreview} className="rounded-2xl" />
          <div className="relative flex -mt-10 w-full items-center  justify-end p-2 px-4">
            <Modal
              openTrigger={
                <button className="text-sm hover:scale-125 transition-all duration-300 md:text-xl bottom-0 right-0 rounded-full justify-center gap-1 flex flex-row">
                  Preview <PlayCircle className="cursor-pointer text-secondary dark:text-primary" />
                </button>
              }
              closeOnOverlayClick={true}
              title={"Music Data Nft Preview"}
              hasFilter={false}
              filterData={[]}
              titleClassName={"p-8"}>
              <>
                <AudioPlayer
                  previewUrl={deepForestPreviewMix}
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
            </Modal>{" "}
          </div>

          <div className="flex text-foreground flex-row rounded-lg mt-8 p-1  text-center gap-4 text-2xl md:w-[50%]  xl:text-3xl justify-center md:justify-start items-center ">
            <Music2 />
            <span>Albums</span>
            <Music2 />
          </div>
          <div className="relative ">
            <div className="w-full h-[2px] bg-[linear-gradient(to_right,#166B6A,#02292F,#00755E,#02292F,#166B6A)] animate-gradient bg-[length:200%_auto]"></div>
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
        titleClassName={"p-4"}>
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
      <div className="w-full  h-[2px] bg-[linear-gradient(to_right,#166B6A,#02292F,#00755E,#02292F,#166B6A)] animate-gradient bg-[length:200%_auto]"></div>
    </div>
  );
};
