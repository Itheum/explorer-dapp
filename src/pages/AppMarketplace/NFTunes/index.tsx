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

export const NFTunes = () => {
  const { theme } = useTheme();
  const currentTheme = theme !== "system" ? theme : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
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

  const { nfts, isLoading: isLoadingUserNfts } = useNftsStore();
  const nfTunesTokens = [...NF_TUNES_TOKENS].filter((v) => nfts.find((nft) => nft.collection === v.tokenIdentifier && nft.nonce === v.nonce));

  useEffect(() => {
    window.scrollTo(0, 80);
  }, []);

  useEffect(() => {
    if (!hasPendingTransactions) {
      fetchAppNfts();
    }
  }, [hasPendingTransactions, nfts]);

  // get the nfts that are able to open nfTunes app
  async function fetchAppNfts(activeIsLoading = true) {
    if (activeIsLoading) {
      setIsLoading(true);
    }

    const _nfts: DataNft[] = await DataNft.createManyFromApi(
      nfTunesTokens.slice(shownAppDataNfts.length, shownAppDataNfts.length + SHOW_NFTS_STEP).map((v) => ({
        nonce: v.nonce,
        tokenIdentifier: v.tokenIdentifier,
      }))
    );

    setShownAppDataNfts((oldNfts) => oldNfts.concat(_nfts));
    _nfts.map((currentNft, index) => {
      if (currentNft.nonce === FEATURED_NF_TUNES_TOKEN.nonce && currentNft.collection === FEATURED_NF_TUNES_TOKEN.tokenIdentifier) {
        setFeaturedDataNftIndex(index);
        setFeaturedArtistDataNft(currentNft);
      }
    });
    if (activeIsLoading) {
      setIsLoading(false);
    }
  }

  // after pressing the button to view data open modal
  async function viewData(index: number) {
    try {
      if (!(index >= 0 && index < shownAppDataNfts.length)) {
        toastError("Data is not loaded");
        return;
      }
      setFirstSongBlobUrl(undefined);

      const dataNft = shownAppDataNfts[index];
      const _owned = nfts.find((nft) => nft.tokenIdentifier === dataNft.tokenIdentifier) ? true : false;
      if (_owned) {
        setIsFetchingDataMarshal(true);

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
      }
    } catch (err) {
      console.error(err);
      toastError((err as Error).message);
      setIsFetchingDataMarshal(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center w-full overflow-hidden">
      <div className="w-full  h-[2px] bg-[linear-gradient(to_right,#737373,#A76262,#5D3899,#5D3899,#A76262,#737373)] animate-gradient bg-[length:200%_auto]"></div>
      <div className=" flex flex-col justify-center items-center font-[Clash-Regular] w-full max-w-[100rem]">
        <div className="flex flex-col justify-center items-center xl:items-start h-[100vsh] w-[100%] pt-8 xl:pt-16 mb-16 xl:mb-32  pl-4  ">
          <div className="flex flex-col w-full xl:w-[60%] gap-6">
            <div className="flex-row flex items-center">
              <span className="text-5xl xl:text-[8rem] text-primary">NF-Tunes</span>
              <img className="max-h-[30%] mb-6" src={currentTheme === "dark" ? musicNote : musicNoteBlack} />
            </div>
            <div className="flex flex-row justify-between">
              <span className="text-base md:text-2xl text-primary text-light w-[70%]">
                Empowering Indie musicians to engage with a fresh fan community and discover alternative avenues for music distribution{" "}
              </span>
            </div>

            <button
              onClick={() => scrollToSection("featured-artist")}
              className="hover:scale-110 transition duration-700 text-sm md:text-xl p-2 md:p-4 rounded-lg  max-w-[50%] xl:max-w-[35%] text-white
           bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-40% to-[#5D3899] to-100%">
              Visualize NF-Tunes
            </button>
          </div>

          <div className="flex flex-col xl:flex-row  w-full justify-between items-center h-full">
            <div className="p-6 pl-32">
              <Music className="md:scale-[2] mb-8 ml-[14%] text-primary" />
            </div>

            <div className="relative min-h-[10rem] h-full w-full xl:-mt-[15%] -z-10">
              <div className="absolute w-[60%] max-w-[500px]  -mt-[10%] left-[20%] xl:left-[35%] h-[300px] xl:h-[500px] bg-gradient-to-br from-[#737373] from-20% via-[#A76262] via-40% to-[#5D3899] to-80% rounded-full filter blur-2xl opacity-25   "></div>
              <img className="animate-spin-slow w-[60%] left-[20%] xl:left-[40%] max-w-[350px] absolute" src={disk} alt="disk" />
              <img className="absolute left-[60%] lg:left-[50%] xl:left-[70%] top-[-30px] xl:top-[-50px] w-[30%] max-w-[200px]" src={stick} alt="stick" />
            </div>

            <div className="flex flex-col items-center h-full">
              <div className=" flex justify-start xl:justify-end w-full md:-mt-32 xl:-ml-8 -z-10">
                <img className="scale-50 md:scale-75 -ml-4 -mt-6" src={musicNote} />
                <Music className="md:scale-[2] text-primary" />
              </div>
              <span className="text-primary text-xl text-center xl:text-start p-8 pt-16 md:pt-32">Driven by the innovation of Itheum Music Data NFTs</span>
            </div>
          </div>
        </div>

        {/* Benefits of NF-Tunes */}
        <div className="flex flex-col justify-start items-center w-full gap-12 p-6 xl:p-12 xl:pb-0">
          <div className="flex flex-col mb-16 xl:mb-32 justify-center w-[100%] items-center xl:items-start">
            <div className="flex flex-row rounded-lg mb-12 px-8 xl:px-16 text-center gap-4 bg-primary md:text-2xl xl:text-3xl  justify-center items-center ">
              <Music2 className="text-secondary" />
              <span className="text-secondary">Benefits of NF-Tunes</span>
              <Music2 className="text-secondary" />
            </div>
            <div className="flex flex-col xl:flex-row justify-start items-center gap-8 w-full">
              <div className="flex flex-col gap-4 p-8 items-start w-[80%] xl:w-[30%] bg-background rounded-[3rem] border border-primary/50">
                <div className="flex justify-center items-center rounded-full h-24 w-24 bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-40% to-[#5D3899] to-100%">
                  <img src={benefitsLogo1} />
                </div>
                <span className="text-primary text-2xl min-h-24">Transform your music streams into NFT Masterpieces</span>
                <span className="text-primary text-sm h-40 md:h-32 font-[Clash-Light]">
                  Release single music tracks or entire playlists, mixes, or extended compositions through a unified Music Data NFT. Update your music at any
                  time and your NFT holders receive the latest content instantly.{" "}
                </span>
              </div>
              <div className="flex flex-col gap-4 p-8 items-start w-[80%] xl:w-[30%] bg-background rounded-[3rem] border border-primary/50">
                <div className="flex justify-center items-center rounded-full h-24 w-24 bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-40% to-[#5D3899] to-100%">
                  <img src={benefitsLogo2} />
                </div>
                <span className="text-primary text-2xl min-h-24">Cultivate a DeGeN Fan Community for Your Music NFTs</span>
                <span className="text-primary text-sm h-40 md:h-32 font-[Clash-Light]">
                  Explore the availability of Music Data NFTs across various NFT platforms, connecting you with "new fans" and fostering a direct relationship
                  with your audience.{" "}
                </span>
              </div>
              <div className="flex flex-col gap-4 p-8 items-start w-[80%] xl:w-[30%] bg-background rounded-[3rem] border border-primary/50">
                <div className="flex justify-start w-full">
                  <div className="flex justify-center items-center rounded-full h-24 w-24 bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-40% to-[#5D3899] to-100%">
                    <img src={benefitsLogo3} />
                  </div>
                </div>
                <span className="text-primary text-2xl min-h-24 ">Take Command of Royalties and Distribution</span>
                <span className="text-primary text-sm h-40 md:h-32 font-[Clash-Light]">
                  Forge a direct connection with your fans, experiment with diverse royalty and distribution approaches, showcase the demand for your music.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* What Musicians are saying */}
        <div className="flex flex-col justify-center items-center mb-16">
          <div className="py-8 flex flex-col w-[100%] justify-center items-center xl:items-start xl:p-12 xl:pt-0">
            <div className="flex flex-col xl:flex-row w-full items-center justify-center h-[300px]">
              <div className="flex flex-col gap-8 xl:w-[50%] justify-start items-center xl:items-start w-[330px] md:w-[auto]">
                <div className="text-primary text-2xl xl:text-4xl">Hear what Indie Musicians are saying about Music Data NFTs and NF-Tunes</div>
              </div>
              <div className="flex justify-center items-center h-[30rem] w-full xl:w-[50%]">
                <div className="w-[380px] h-[170px] md:w-[480px] md:h-[270px]">
                  <YouTubeEmbed embedId="sDTBpwSu33I" title="Meet Manu" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Artist Section */}
        <div
          id="featured-artist"
          className="bg-manu-image flex flex-col xl:flex-row  justify-center items-center xl:items-start w-full h-full gap-12 mb-16 xl:mb-32">
          <div className="py-8 flex flex-col w-[100%] justify-center items-center xl:items-start p-8 xl:p-12">
            <div className="flex flex-row rounded-lg mb-4 px-8 xl:px-16 text-center gap-4 bg-foreground md:text-2xl xl:text-3xl justify-center items-center ">
              <Music className="text-secondary" />
              <span className="text-secondary">Featured Artist Section</span>
              <Music className="text-secondary" />
            </div>
            <div className="flex flex-col xl:flex-row w-full h-full justify-center items-center xl:items-start p-8 gap-4">
              <div className="flex flex-col w-[30%] min-w-[20rem] justify-center items-center">
                <span className="text-secondary dark:text-primary text-center text-2xl">Meet Manu YFGP</span>
                <img className="" src={manuImage} />
                <span className="text-secondary dark:text-primary font-[Clash-Light] w-[80%]">
                  Manu, who goes by the name of YFGP (Your Favorite Ghost Producer) is a Music Producer, SFX Artist, Live Streamer and Music NFT pioneer based
                  out of Sibiu, Romania.&nbsp;&nbsp;
                  <Link to={`https://linktr.ee/Yfgp`} target="_blank" className="!text-blue-500">
                    Learn More
                  </Link>
                </span>
              </div>
              <div className="flex flex-col w-[30%] min-w-[20rem]  justify-center items-center">
                <span className="text-secondary dark:text-primary text-center text-xl">Preview Manu’s Music Stream</span>
                <img className="opacity-20" src={manuImage} />

                <Modal
                  openTrigger={
                    <button className="h-64  flex rounded-full justify-center w-full mt-[-11rem]">
                      <PlayCircle className="scale-[3] cursor-pointer text-secondary dark:text-primary" />
                    </button>
                  }
                  closeOnOverlayClick={false}
                  title={"Music Data Nft Preview"}
                  hasFilter={false}
                  filterData={[]}
                  titleClassName={"p-8"}>
                  {!featuredArtistDataNft ? (
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
                      {featuredArtistDataNft && featuredArtistDataNft.dataPreview && (
                        <AudioPlayer
                          previewUrl={featuredArtistDataNft.dataPreview}
                          songs={[
                            {
                              "idx": 1,
                              "description": featuredArtistDataNft.description,
                              "category": "Preview",
                              "album": featuredArtistDataNft.description,
                              "cover_art_url": featuredArtistDataNft.nftImgUrl,
                              "title": featuredArtistDataNft.title,
                            },
                          ]}
                        />
                      )}
                    </>
                  )}
                </Modal>
              </div>
              <div className="flex flex-col w-[30%] min-w-[20rem] justify-center items-center">
                <span className="text-secondary dark:text-primary text-center text-2xl">Own Manu’s Music Data NFT </span>
                <div className="scale-[0.9] -mt-6 pt-4 xl:pt-0 rounded-[2.37rem]">
                  {featuredArtistDataNft ? (
                    <DataNftCard
                      cardStyles="text-white"
                      index={featuredDataNftIndex}
                      dataNft={featuredArtistDataNft}
                      isLoading={isLoading}
                      owned={nfts.find((nft) => nft.tokenIdentifier === featuredArtistDataNft.tokenIdentifier) ? true : false}
                      viewData={viewData}
                      modalContent={
                        isFetchingDataMarshal ? (
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
                            {viewDataRes && !viewDataRes.error && tokenLogin && featuredDataNftIndex > -1 && (
                              <AudioPlayer
                                dataNftToOpen={shownAppDataNfts[featuredDataNftIndex]}
                                songs={dataMarshalResponse ? dataMarshalResponse.data : []}
                                tokenLogin={tokenLogin}
                                firstSongBlobUrl={firstSongBlobUrl}
                                chainID={chainID}
                              />
                            )}
                          </>
                        )
                      }
                      modalTitle={"NF-Tunes"}
                      modalTitleStyle="p-4"
                    />
                  ) : isLoading ? (
                    <div className="mt-32 ">
                      <Loader noText />
                      <p className="text-center text-foreground">Loading...</p>
                    </div>
                  ) : (
                    <h3 className="text-center mt-32 text-white">No Data NFT yet</h3>
                  )}
                </div>
              </div>
            </div>
            {IS_DEVNET && (
              <div className="flex flex-row w-full justify-center">
                <button
                  onClick={() => scrollToSection("data-nfts")}
                  className="hover:scale-125 transition flex flex-row gap-2 text-white justify-center items-center  p-4 rounded-lg  bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-40% to-[#5D3899] to-100%  ">
                  See all
                  <MoveDown />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Storage Solution Zedge Storage  */}
        <div className="flex flex-col justify-center items-center ">
          <div className=" py-8 flex flex-col w-[100%] justify-center items-center xl:items-start p-8 xl:p-12">
            <div className="flex flex-row rounded-lg mb-4 px-8 xl:px-16 text-center gap-4 bg-foreground md:text-2xl xl:text-3xl  justify-center items-center ">
              <Music2 className="text-secondary" />
              <span className="text-secondary ">Storage Solution for your Music Data NFT</span>
              <Music2 className="text-secondary" />
            </div>
            <div className="flex flex-col xl:flex-row  w-full h-[100vsh] items-center justify-center">
              <div className="flex flex-col gap-8 xl:w-[50%] justify-start items-center xl:items-start">
                <div className="text-primary text-3xl xl:text-6xl">
                  Integrate with <br></br>
                  <span className="ml-2 font-bold bg-clip-text text-transparent bg-[linear-gradient(to_right,#737373,#A76262,#5D3899,#5D3899,#A76262,#737373)] animate-gradient bg-[length:200%_auto]">
                    Zedge Storage
                  </span>
                </div>
                <div className="text-primary text-center xl:text-start xl:text-xl xl:w-[60%]">
                  Searching for a streamlined solution to store your Music Data NFTs?{" "}
                </div>

                <Link
                  to={`https://www.zedgestorage.com/itheum-music-data-nft`}
                  target="_blank"
                  className="hover:scale-110 transition duration-700 text-sm md:text-xl text-center p-2 md:p-4 bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-30%  to-[#5D3899] to-95% rounded-lg  max-w-[50%]   text-white ">
                  Try Zedge Storage today
                </Link>
              </div>
              <div className="flex justify-center items-center h-[30rem] w-full xl:w-[50%] scale-100 ">
                <motion.div className="flex min-w-[20rem] xl:w-[30rem] xl:h-[20rem] overflow-hidden">
                  <motion.img
                    src={frontCube}
                    initial={{ x: -150, y: 160, opacity: 0 }}
                    whileInView={{ opacity: 1, x: -40, y: 130, transition: { duration: 3 } }}
                    className="absolute z-[11]"></motion.img>
                  <img src={vault} className="z-10  w-[25rem] h-[20rem]" />

                  <motion.img
                    src={dataLines}
                    initial={{ x: -25, y: 25, opacity: 0 }}
                    whileInView={{ opacity: [0, 1] }}
                    transition={{ duration: 4 }}
                    className="absolute ml-8 xl:ml-0 -z-10  xl:w-[30rem] h-[20rem] "></motion.img>

                  <motion.img
                    src={cubes}
                    initial={{ x: 100, y: -100 }}
                    whileInView={{ opacity: 1, x: 100, y: 0, transition: { duration: 3 } }}
                    className="absolute"></motion.img>

                  <motion.img
                    src={backCube}
                    initial={{ x: 350, y: -100 }}
                    whileInView={{ opacity: 1, x: 250, y: 0, transition: { duration: 3 } }}
                    transition={{ duration: 5 }}
                    className="absolute -ml-16 xl:-ml-0"></motion.img>

                  <motion.div
                    initial={{ x: 280, y: 250 }}
                    whileInView={{ opacity: 1, x: 220, y: 180, transition: { duration: 3 } }}
                    transition={{ duration: 5 }}
                    className="z-[11] absolute">
                    <img src={cubes} className="" />
                    <img src={cubes} className="-mt-[35px]" />
                  </motion.div>
                </motion.div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center border-t border-muted-foreground pb-16">
              <div className="flex flex-col xl:flex-row justify-between w-full gap-2 xl:gap-16 xl:h-32 p-2 border-b border-muted-foreground">
                <div className="text-5xl flex ">
                  <span>01.</span>
                </div>
                <div className="flex text-2xl font-[Clash-Medium] max-w-[80%] xl:max-w-[20%] justify-end xl:justify-start xl:text-start">
                  <span>Effortless Music Management</span>
                </div>
                <div className="text-md text-muted-foreground w-full xl:max-w-[30%] flex justify-center items-start">
                  Effortlessly add, update, and manage your music files, art, and music metadata. Simplify your workflow with seamless control and organization{" "}
                </div>
              </div>
              <div className="flex flex-col xl:flex-row justify-between w-full gap-2 xl:gap-16 xl:h-32 p-2 border-b border-muted-foreground">
                <div className="text-5xl flex ">
                  <span>02.</span>
                </div>
                <div className="flex text-2xl font-[Clash-Medium] max-w-[80%] xl:max-w-[20%] justify-end xl:justify-start xl:text-start">
                  <span>Eternal Resonance with Zedge Storage</span>
                </div>
                <div className="text-md text-muted-foreground w-full xl:max-w-[30%] flex justify-center items-start">
                  Safeguard your data on a resilient, censorship-resistant network or choose traditional web2-style storage for ultimate versatility and control{" "}
                </div>
              </div>

              <div className="flex flex-col xl:flex-row justify-between w-full gap-2 xl:gap-16 xl:h-32 p-2 border-b border-muted-foreground">
                <div className="text-5xl flex ">
                  <span>03.</span>
                </div>
                <div className="flex text-2xl font-[Clash-Medium] max-w-[80%] xl:max-w-[20%] justify-end xl:justify-start xl:text-start ">
                  <span>Link Music Streams to Itheum Data NFTs</span>
                </div>
                <div className="text-md text-muted-foreground w-full xl:max-w-[30%] flex justify-center items-start">
                  Easily mint, manage, and showcase your Music Data NFT collection on all platforms and marketplaces where NFTs are supported{" "}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calling musicians Section */}
        <div className="flex flex-col gap-4 justify-center items-center bg-primary xl:p-32 w-full h-[100svh] text-center">
          <span className="text-secondary font-[Clash-Medium] text-2xl xl:text-6xl "> Calling all Indie Musicians!</span>
          <span className="xl:w-[50%] text-primary-foreground xl:text-2xl ">
            Explore the possibilities with NF-Tunes — we're here to assist you in onboarding and minting your Music Data NFTs.
          </span>

          <img src={currentTheme === "dark" ? megaphone : megaphoneLight} alt="megaphone" />

          <Link
            to={`https://share-eu1.hsforms.com/1h2V8AgnkQJKp3tstayTsEAf5yjc`}
            target="_blank"
            className="mt-10 hover:scale-110 transition duration-700 text-sm md:text-xl text-center p-2 md:p-4 bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-30% to-[#5D3899] to-95% rounded-lg  max-w-[50%] text-white ">
            Reach Out Today
          </Link>
        </div>

        {/* Supported Platforms */}
        <div className="flex flex-col justify-center items-center w-full gap-12 mt-12 xl:p-12">
          <div className="py-8 flex flex-col w-[100%] justify-center items-center xl:items-start gap-12">
            <div className="flex flex-row w-[80%] xl:w-[60%] rounded-lg mb-4 px-8 xl:px-16 text-center gap-4 bg-foreground md:text-2xl xl:text-3xl justify-center items-center ">
              <span className="text-secondary">
                Platforms for
                <span className="ml-2 font-bold bg-clip-text text-transparent bg-[linear-gradient(to_right,#737373,#A76262,#5D3899,#5D3899,#A76262,#737373)] animate-gradient bg-[length:200%_auto]">
                  Music Data NFTs
                </span>
              </span>
              <Music className="text-secondary" />
            </div>
            <div className="text-2xl xl:text-5xl xl:w-[60%]  ">
              Music Data NFTs:<br></br> Universally
              <span className="ml-2 font-bold bg-clip-text text-transparent bg-[linear-gradient(to_right,#737373,#A76262,#5D3899,#5D3899,#A76262,#737373)] animate-gradient bg-[length:200%_auto]">
                Accessible
              </span>
              ,<br></br>
              <span className="text-muted-foreground"> Just Like</span>
              <span className="ml-2 font-bold bg-clip-text text-transparent bg-[linear-gradient(to_right,#737373,#A76262,#5D3899,#5D3899,#A76262,#737373)] animate-gradient bg-[length:200%_auto]">
                Regular NFTs
              </span>
            </div>
            <div className="flex flex-col xl:flex-row gap-8 justify-center items-center w-full">
              <Link
                to={`https://datadex.itheum.io/datanfts/marketplace/market`}
                target="_blank"
                className="hover:scale-110 transition duration-700 flex flex-row gap-2 items-center shadow-inner shadow-gray-600 justify-center bg-gradient-to-t from-gray-400 dark:from-black from-20%  to-background  to-70% brightness-125 rounded-full w-52 h-52  ">
                <img src={currentTheme === "dark" ? itheumLogo : itheumLogoLight} alt="itheum logo" />
                <span className="w-[40%] text-center">Itheum Data DEX</span>
              </Link>
              <div className="hover:scale-110 transition duration-700  flex flex-col gap-2 items-center shadow-inner shadow-gray-600 justify-center bg-gradient-to-t from-gray-400 dark:from-black from-20%  to-background  to-70% brightness-125 rounded-full w-52 h-52  ">
                <span className=" text-center">NFT Marketplaces</span>
                <Link to={"https://xoxno.com/"} target="_blank">
                  <img src={currentTheme === "dark" ? xoxnoLogo : xoxnoLogoLight} alt="xoxno logo" />
                </Link>
                <Link to={"https://www.frameit.gg/"} target="_blank">
                  <img src={currentTheme === "dark" ? frameItLogo : frameItLogoLight} alt="frame it logo" />
                </Link>
              </div>
              <Link
                to={"https://pulsar.money/"}
                target="_blank"
                className="hover:scale-110 transition duration-700  flex flex-col gap-2 items-center shadow-inner shadow-gray-600 justify-center bg-gradient-to-t from-gray-400 dark:from-black from-20%  to-background  to-70% brightness-125 rounded-full w-52 h-52  ">
                <img src={currentTheme === "dark" ? pulsarLogo : pulsarLogoLight} alt="pulsar" />
              </Link>
              <Link
                to={"https://docs.itheum.io/product-docs/protocol/governance/itheum-xpand-dao/itheum-xpand-grants-program"}
                target="_blank"
                className="hover:scale-110 transition duration-700  flex flex-col gap-2 items-center shadow-inner shadow-gray-600 justify-center bg-gradient-to-t from-gray-400 dark:from-black from-20%  to-background  to-70% brightness-125 rounded-full w-52 h-52  ">
                <span className="text-xl text-primary w-[60%] text-center">xPand DAO</span>
              </Link>
              <Link
                to={"https://multiversx.com/ecosystem/projects"}
                target="_blank"
                className="hover:scale-110 transition duration-700  flex flex-col gap-2 items-center shadow-inner shadow-gray-600 justify-center bg-gradient-to-t from-gray-400 dark:from-black from-20%  to-background  to-70% brightness-125 rounded-full w-52 h-52  ">
                <img src={currentTheme === "dark" ? multiversxLogo : multiversxLogoLight} alt="multiversx logo" />
                <span className="w-[60%] text-lg font-semibold text-center"> Ecosystem</span>
              </Link>
            </div>
          </div>
        </div>
        {IS_DEVNET && (
          <div id="data-nfts" className="flex justify-center items-center p-16 ">
            <div className="flex flex-col">
              <HeaderComponent pageTitle={""} hasImage={false} pageSubtitle={"Music Data NFTs "} dataNftCount={shownAppDataNfts.length}>
                {shownAppDataNfts.length > 0 ? (
                  shownAppDataNfts.map((dataNft, index) => {
                    return (
                      <DataNftCard
                        key={index}
                        index={index}
                        dataNft={dataNft}
                        isLoading={isLoading || isLoadingUserNfts}
                        owned={nfts.find((nft) => nft.tokenIdentifier === dataNft.tokenIdentifier) ? true : false}
                        viewData={viewData}
                        modalContent={
                          isFetchingDataMarshal ? (
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
                              {viewDataRes && !viewDataRes.error && tokenLogin && currentIndex > -1 && (
                                <AudioPlayer
                                  dataNftToOpen={shownAppDataNfts[currentIndex]}
                                  songs={dataMarshalResponse ? dataMarshalResponse.data : []}
                                  tokenLogin={tokenLogin}
                                  firstSongBlobUrl={firstSongBlobUrl}
                                  chainID={chainID}
                                />
                              )}
                            </>
                          )
                        }
                        modalTitle={"NF-Tunes"}
                        modalTitleStyle="p-4"
                      />
                    );
                  })
                ) : (
                  <h3 className="text-center text-white">No DataNFT</h3>
                )}
              </HeaderComponent>
              <div className="m-auto mb-5">
                {shownAppDataNfts.length < nfTunesTokens.length && (
                  <Button
                    className="border-0 text-background rounded-lg font-medium tracking-tight base:!text-sm md:!text-base hover:opacity-80 hover:text-black"
                    onClick={() => {
                      fetchAppNfts(false);
                    }}
                    disabled={false}>
                    Load more
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="w-full h-[2px] bg-[linear-gradient(to_right,#737373,#A76262,#5D3899,#5D3899,#A76262,#737373)] animate-gradient bg-[length:200%_auto]"></div>
    </div>
  );
};
