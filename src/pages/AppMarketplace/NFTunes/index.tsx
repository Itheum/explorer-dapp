import React, { useEffect, useMemo, useState } from "react";
import { DataNft, ViewDataReturnType } from "@itheum/sdk-mx-data-nft";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { NF_TUNES_TOKENS } from "appsConfig";
import nfTunesBanner from "assets/img/nf-tunes-banner.png";
import disk from "assets/img/nf-tunes-logo-disk.png";
import { DataNftCard, Loader } from "components";
import { AudioPlayer } from "components/AudioPlayer";
import { HeaderComponent } from "components/Layout/HeaderComponent";
import { useGetAccount, useGetPendingTransactions } from "hooks";
import { BlobDataType } from "libs/types";
import { decodeNativeAuthToken, toastError } from "libs/utils";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import stick from "../../../assets/img/nf-tunes-logo-stick.png";
import { Music, Music2 } from "lucide-react";
import { Button } from "libComponents/Button";
import zstorageDataVault from "../../../assets/img/zstorage/zstorage-data-vault.png";
import musicNote from "../../../assets/img/music-note.png";
interface ExtendedViewDataReturnType extends ViewDataReturnType {
  blobDataType: BlobDataType;
}

export const NFTunes = () => {
  const { address } = useGetAccount();
  const { loginMethod } = useGetLoginInfo();

  ///native auth
  const { tokenLogin } = useGetLoginInfo();

  const { hasPendingTransactions } = useGetPendingTransactions();

  const [dataNfts, setDataNfts] = useState<DataNft[]>([]);
  const [flags, setFlags] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  const [viewDataRes, setViewDataRes] = useState<ExtendedViewDataReturnType>();
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [dataMarshalResponse, setDataMarshalResponse] = useState({ "data_stream": {}, "data": [] });

  const imgAnimation = useMemo(
    () => (
      <div className="relative  top-[15%]">
        <img className="animate-spin-slow w-[20%] left-[40%] max-w-[300px] absolute" src={disk} alt="disk" />
        <img className="rotate-[20deg] absolute top-[-10px] md:top-[-15px] max-w-[200px] left-[52%] 3xl:left-[50%] w-[15%] " src={stick} alt="stick" />
      </div>
    ),
    []
  );

  useEffect(() => {
    if (!hasPendingTransactions) {
      fetchDataNfts();
    }
  }, [hasPendingTransactions]);

  useEffect(() => {
    if (!isLoading && address) {
      fetchMyNfts();
    }
  }, [isLoading, address]);

  ///get the nfts that are able to open nfTunes app
  async function fetchDataNfts() {
    setIsLoading(true);

    const _nfts: DataNft[] = await DataNft.createManyFromApi(NF_TUNES_TOKENS.map((v) => ({ nonce: v.nonce, tokenIdentifier: v.tokenIdentifier })));
    setDataNfts(_nfts);

    setIsLoading(false);
  }

  ///fetch the nfts owned by the logged in address and if the user has any of them set flag to true,
  //on those will be shown view data otherwise show market place explore button
  async function fetchMyNfts() {
    const _dataNfts = await DataNft.ownedByAddress(address);
    const _flags = [];

    for (const cnft of dataNfts) {
      const matches = _dataNfts.filter((mnft) => cnft.nonce === mnft.nonce);
      _flags.push(matches.length > 0);
    }

    setFlags(_flags);
  }

  /// after pressing the button to view data open modal
  async function viewData(index: number) {
    try {
      if (!(index >= 0 && index < dataNfts.length)) {
        toastError("Data is not loaded");
        return;
      }

      const _owned = flags[index];

      if (_owned) {
        setIsFetchingDataMarshal(true);

        const dataNft = dataNfts[index];
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
      }
    } catch (err) {
      console.error(err);
      toastError((err as Error).message);
      setIsFetchingDataMarshal(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center ">
      <div className="flex flex-col items-start h-screen mt-[5%]">
        <div className="flex flex-col w-full xl:w-[60%] gap-6">
          <div className="flex-row flex items-center ">
            <span className="text-5xl xl:text-[8rem] text-primary">NF-Tunes</span>
            <img className="max-h-[30%] mb-6" src={musicNote} />
          </div>
          <div className="flex flex-row justify-between">
            <span className="text-base md:text-2xl text-primary text-light w-[70%]">
              Empowering Indie musicians to engage with a fresh fan community and discover alternative avenues for music distribution.{" "}
            </span>
            <Music className="md:scale-[2] text-primary mr-8" />
          </div>
          <button className=" text-sm md:text-xl p-2 md:p-4 bg-gradient-to-l from-purple-800 via-stone-500 to-neutral-500 rounded-lg  max-w-[50%] xl:max-w-[35%] text-primary ">
            Visualize NF-tunes
          </button>
        </div>

        <div className="flex flex-col xl:flex-row  w-full justify-between items-center h-full">
          <div className="p-6">
            <Music className="md:scale-[2] mb-8 ml-[14%] text-primary" />
          </div>
          <div className="relative h-full w-full xl:-mt-[15%]">
            <img className="animate-spin-slow w-[60%] left-[20%] xl:left-[40%] max-w-[350px] absolute" src={disk} alt="disk" />
            <img className="absolute rotate-[10deg] left-[70%] top-[-30px] w-[30%] max-w-[250px]  md:w-[40%]  md:-top-[30%]    " src={stick} alt="stick" />
          </div>

          <div className="flex flex-col items-center h-full">
            <div className="opacity-0 xl: opacity-100 flex justify-start w-full ">
              <img className="scale-50 -ml-4 mt-8" src={musicNote} />
              <Music className=" md:scale-[2] text-primary" />
            </div>

            <div className=" flex justify-end w-full md:-mt-32 ">
              <img className="-ml-4 " src={musicNote} />
              <Music className="md:scale-[2] text-primary" />
            </div>
            <span className="text-primary text-xl p-8 pt-16 md:pt-32"> Driven by the innovation of Itheum's Music Data NFTs</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-start items-start w-full">
        <div className="flex flex-row rounded-lg  px-2 text-center gap-3 bg-foreground md:text-2xl   justify-start items-center ">
          <Music2 className="text-secondary" />
          <span className="text-secondary">Benefits of NF-Tunes</span>
          <Music2 className="text-secondary" />
        </div>
      </div>
      {/* Storage Solution Zstorage  */}
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-row rounded-lg w-[80%] px-2 text-center gap-3 bg-foreground md:text-2xl md:w-[60%] justify-center items-center ">
          <Music2 className="text-secondary" />
          <span className="text-secondary">Storage solution for your music data NFT</span>
          <Music2 className="text-secondary" />
        </div>
        <div className="flex flex-row">
          <div className="flex flex-col">
            <div className="text-primary text-2xl">
              Integrate with <span className="text-nftunes-gradient">zstorage</span>
            </div>
            <div className="text-muted-foreground">
              Empowering Indie musicians to engage with a fresh fan community and discover alternative avenues for music distribution.{" "}
            </div>
            <Button className="bg-gradient-to-l from-purple-800 via-stone-500 to-neutral-500 rounded-lg w-[20%] text-secondary">Try zStorage today</Button>
          </div>
          <div>
            <img src={zstorageDataVault} alt="zstorage data vault" />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-[80%] items-center justify-center">
        <div className="flex flex-row justify-between gap-16 h-32 p-2 border-b border-muted-foreground">
          <div className="text-5xl flex justify-end items-end">
            <span>01.</span>
          </div>
          <div className="flex max-w-[30%] justify-start">
            <span>Effortless Music Management</span>
          </div>
          <div className="text-sm text-muted-foreground max-w-[30%] flex justify-center items-center">
            Effortlessly add, update, and manage your music files, art, and music metadata. Simplify your workflow with seamless control and organization.{" "}
          </div>
        </div>
        <div className="flex flex-row justify-between gap-16 h-32 p-2 border-b border-muted-foreground">
          <div className="text-5xl flex justify-end items-end">
            <span>02.</span>
          </div>
          <div className="flex max-w-[30%] justify-start">
            <span>Eternal Resonance with zStorage</span>
          </div>
          <div className="text-sm text-muted-foreground max-w-[30%] flex justify-center items-center">
            Safeguard your data on a resilient, censorship-resistant network or choose traditional web2-style storage for ultimate versatility and control{" "}
          </div>
        </div>
        <div className="flex flex-row justify-between gap-16 h-32 p-2 border-b border-muted-foreground">
          <div className="text-5xl flex justify-end items-end">
            <span>03.</span>
          </div>
          <div className="flex max-w-[30%] justify-start">
            <span>Link zStorage Music Streams to Itheum Data NFTs</span>
          </div>
          <div className="text-sm text-muted-foreground max-w-[30%] flex justify-center items-center">
            Easily mint, manage, and showcase your Data NFT collection on the marketplace.{" "}
          </div>
        </div>
      </div>
    </div>
    // <HeaderComponent
    //   pageTitle={"NF-Tunes"}
    //   isAnimated
    //   hasImage={true}
    //   imgSrc={nfTunesBanner}
    //   animation={imgAnimation}
    //   altImageAttribute={"NF-Tunes application"}
    //   pageSubtitle={"Data NFTs that Unlock this Itheum Data Widget"}
    //   dataNftCount={dataNfts.length}>
    //   {dataNfts.length > 0 ? (
    //     dataNfts.map((dataNft, index) => (
    //       <DataNftCard
    //         key={index}
    //         index={index}
    //         dataNft={dataNft}
    //         isLoading={isLoading}
    //         owned={flags[index]}
    //         viewData={viewData}
    //         modalContent={
    //           isFetchingDataMarshal ? (
    //             <div
    //               className="flex flex-col items-center justify-center"
    //               style={{
    //                 minHeight: "40rem",
    //               }}>
    //               <div>
    //                 <Loader noText />
    //                 <p className="text-center text-foreground">Loading...</p>
    //               </div>
    //             </div>
    //           ) : (
    //             <>
    //               {viewDataRes && !viewDataRes.error && tokenLogin && currentIndex > -1 && (
    //                 <AudioPlayer dataNftToOpen={dataNfts[currentIndex]} songs={dataMarshalResponse ? dataMarshalResponse.data : []} tokenLogin={tokenLogin} />
    //               )}
    //             </>
    //           )
    //         }
    //         modalTitle={"NF-Tunes"}
    //         modalTitleStyle="p-4"
    //       />
    //     ))
    //   ) : (
    //     <h3 className="text-center text-white">No DataNFT</h3>
    //   )}
    // </HeaderComponent>
  );
};
