import React, { useEffect, useState } from "react";
import { DataNft, ViewDataReturnType } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo, useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { motion } from "framer-motion";
import { Music, Music2 } from "lucide-react";
import { Link } from "react-router-dom";
import { NF_PODCAST_TOKENS } from "appsConfig";
import musicNoteBlack from "assets/img/nf-tunes/music-note-black.png";
import musicNote from "assets/img/nf-tunes/music-note-white.png";
import disk from "assets/img/nf-tunes-logo-disk.png";
import stick from "assets/img/nf-tunes-logo-stick.png";
import backCube from "assets/img/zstorage/back.png";
import cubes from "assets/img/zstorage/cubes.png";
import dataLines from "assets/img/zstorage/data-lines.png";
import frontCube from "assets/img/zstorage/front.png";
import vault from "assets/img/zstorage/vault-dots.png";
import { MvxDataNftCard, Loader } from "components";
import { AudioPlayer } from "components/AudioPlayer/AudioPlayer";
import { HeaderComponent } from "components/Layout/HeaderComponent";
import { SHOW_NFTS_STEP } from "config";
import { useTheme } from "contexts/ThemeProvider";
import { useGetPendingTransactions } from "hooks";
import { Button } from "libComponents/Button";
import { BlobDataType, ExtendedViewDataReturnType } from "libs/types";
import { decodeNativeAuthToken, getApiDataMarshal, toastError } from "libs/utils";
import { useNftsStore } from "store/nfts";

export const NFPodcast = () => {
  const { theme } = useTheme();
  const currentTheme = theme !== "system" ? theme : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const { tokenLogin } = useGetLoginInfo();
  const { chainID } = useGetNetworkConfig();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const [shownAppDataNfts, setShownAppDataNfts] = useState<DataNft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  const [viewDataRes, setViewDataRes] = useState<ExtendedViewDataReturnType>();
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [dataMarshalResponse, setDataMarshalResponse] = useState({ "data_stream": {}, "data": [] });
  const [firstSongBlobUrl, setFirstSongBlobUrl] = useState<string>();
  const { mvxNfts: nfts, isLoadingMvx: isLoadingUserNfts } = useNftsStore();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (!hasPendingTransactions) {
      fetchAppNfts();
    }
  }, [hasPendingTransactions, nfts]);

  async function fetchAppNfts(activeIsLoading = true) {
    if (activeIsLoading) {
      setIsLoading(true);
    }

    const _nfts: DataNft[] = await DataNft.createManyFromApi(
      NF_PODCAST_TOKENS.slice(shownAppDataNfts.length, shownAppDataNfts.length + SHOW_NFTS_STEP).map((v) => ({
        nonce: v.nonce,
        tokenIdentifier: v.tokenIdentifier,
      }))
    );

    setShownAppDataNfts((oldNfts) => oldNfts.concat(_nfts));
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
    <div className="flex flex-col justify-center items-center w-full overflow-hidden md:overflow-visible">
      <div className="w-full  h-[2px] bg-[linear-gradient(to_right,#737373,#A76262,#5D3899,#5D3899,#A76262,#737373)] animate-gradient bg-[length:200%_auto]"></div>
      <div className=" flex flex-col justify-center items-center font-[Clash-Regular] w-full max-w-[100rem]">
        <div className="flex flex-col justify-center items-center xl:items-start h-[100vsh] w-[100%] pt-8 xl:pt-16 mb-16 xl:mb-32  pl-4  ">
          <div className="flex flex-col w-full xl:w-[60%] gap-6">
            <div className="flex-row flex items-center">
              <span className="text-4xl xl:text-[6rem] text-primary">NF-Podcast</span>
              <img className="max-h-[30%] mb-6" src={currentTheme === "dark" ? musicNote : musicNoteBlack} />
            </div>
            <div className="flex flex-row justify-between">
              <span className="text-base md:text-xl text-primary text-light w-[70%]">
                Empowering content creators to engage with their communities and discover alternative avenues for content distribution
              </span>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row  w-full justify-between items-center h-full">
            <div className="p-6 pl-32">
              <Music className="md:scale-[2] mb-8 ml-[14%] text-primary" />
            </div>

            <div className="relative min-h-[10rem] h-full w-full xl:-mt-[5%] -z-10">
              <div className="absolute w-[60%] max-w-[500px] -mt-[10%] left-[20%] xl:left-[35%] h-[300px] xl:h-[500px] bg-gradient-to-br from-[#737373] from-20% via-[#A76262] via-40% to-[#5D3899] to-80% rounded-full filter blur-2xl opacity-25   "></div>
              <img className="animate-spin-slow w-[60%] left-[20%] xl:left-[40%] max-w-[350px] absolute" src={disk} alt="disk" />
              <img className="absolute left-[60%] lg:left-[50%] xl:left-[70%] top-[-30px] xl:top-[-50px] w-[30%] max-w-[200px]" src={stick} alt="stick" />
            </div>

            <div className="flex flex-col items-center h-full">
              <div className=" flex justify-start xl:justify-end w-full md:-mt-32 xl:-ml-8 -z-10">
                <img className="scale-50 md:scale-75 -ml-4 -mt-6" src={musicNote} />
                <Music className="md:scale-[2] text-primary" />
              </div>
              <span className="text-primary text-xl text-center xl:text-start p-8 pt-16 md:pt-32">Driven by the innovation of Itheum Data NFTs</span>
            </div>
          </div>
        </div>

        {/*Nfts shown here*/}
        {
          <div id="data-nfts" className="flex justify-center items-center p-16 ">
            <div className="flex flex-col">
              <HeaderComponent pageTitle={""} hasImage={false} pageSubtitle={"Podcast Data NFTs"} dataNftCount={shownAppDataNfts.length}>
                {shownAppDataNfts.length > 0 ? (
                  shownAppDataNfts.map((dataNft, index) => {
                    return (
                      <MvxDataNftCard
                        key={index}
                        index={index}
                        dataNft={dataNft}
                        isLoading={isLoading || isLoadingUserNfts}
                        isDataWidget={true}
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
                        modalTitle={"NF-Podcast"}
                        modalTitleStyle="p-4"
                      />
                    );
                  })
                ) : (
                  <h3 className="text-center text-white">No Data NFTs</h3>
                )}
              </HeaderComponent>
              <div className="m-auto mb-5">
                {shownAppDataNfts.length < NF_PODCAST_TOKENS.length && (
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
        }

        {/* Storage Solution Zedge Storage  */}
        <div className="flex flex-col justify-center items-center ">
          <div className=" py-8 flex flex-col w-[100%] justify-center items-center xl:items-start p-8 xl:p-12">
            <div className="flex flex-row rounded-lg mb-4 px-8 xl:px-16 text-center gap-4 bg-foreground md:text-2xl xl:text-3xl  justify-center items-center ">
              <Music2 className="text-secondary" />
              <span className="text-secondary ">Storage Solution for your Podcast Data NFT</span>
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
                  Searching for a streamlined solution to store your Podcast Data NFTs?{" "}
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
                  <span>Effortless Podcast Management</span>
                </div>
                <div className="text-md text-muted-foreground w-full xl:max-w-[30%] flex justify-center items-start">
                  Effortlessly add, update, and manage your files, art, and metadata. Simplify your workflow with seamless control and organization
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
                  Safeguard your data on a resilient, censorship-resistant network or choose traditional web2-style storage for ultimate versatility and control
                </div>
              </div>

              <div className="flex flex-col xl:flex-row justify-between w-full gap-2 xl:gap-16 xl:h-32 p-2 border-b border-muted-foreground">
                <div className="text-5xl flex ">
                  <span>03.</span>
                </div>
                <div className="flex text-2xl font-[Clash-Medium] max-w-[80%] xl:max-w-[20%] justify-end xl:justify-start xl:text-start ">
                  <span>Link Podcast Streams to Itheum Data NFTs</span>
                </div>
                <div className="text-md text-muted-foreground w-full xl:max-w-[30%] flex justify-center items-start">
                  Easily mint, manage, and showcase your Podcast Data NFT collection on all platforms and marketplaces where NFTs are supported
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
