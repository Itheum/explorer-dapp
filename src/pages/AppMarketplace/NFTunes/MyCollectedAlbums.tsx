import React, { useEffect, useState } from "react";
import { DasApiAsset } from "@metaplex-foundation/digital-asset-standard-api";
import { useGetAccount, useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { Music2, LibraryBig } from "lucide-react";
import { Loader, MvxDataNftCard } from "components";
import { MvxAudioPlayer } from "components/AudioPlayer/MvxAudioPlayer";
import { HeaderComponent } from "components/Layout/HeaderComponent";
import { Button } from "libComponents/Button";
import { gtagGo, sleep } from "libs/utils/misc";
import { scrollToSection } from "libs/utils/ui";
import { useNftsStore } from "store/nfts";
import { getArtistsAlbumsData } from "./";
import { ArtistDiscography } from "./ArtistDiscography";
import { fetchBitzPowerUpsAndLikesForSelectedArtist } from "./index";
import { GiftBitzToArtistMeta } from "./types/common";

type MyCollectedAlbumsProps = {
  mvxNetworkSelected: boolean;
  viewSolData: (e: number) => void;
  viewMvxData: (e: number) => void;
  shownMvxAppDataNfts: any;
  isFetchingDataMarshal: boolean;
  setStopRadio: any;
  viewDataRes: any;
  tokenLogin: any;
  currentDataNftIndex: any;
  dataMarshalResponse: any;
  firstSongBlobUrl: any;
  setStopPreviewPlaying: any;
  setBitzGiftingMeta: any;
  shownSolAppDataNfts: any;
  onSendBitzForMusicBounty: any;
  nfTunesTokens: any;
  fetchMvxAppNfts: any;
  bountyBitzSumGlobalMapping: any;
  setMusicBountyBitzSumGlobalMapping: any;
  checkOwnershipOfAlbum: any;
  userHasNoBitzDataNftYet: boolean;
  openActionFireLogic: any;
  setFeaturedArtistDeepLinkSlug: any;
};

export const MyCollectedAlbums = (props: MyCollectedAlbumsProps) => {
  const {
    mvxNetworkSelected,
    viewSolData,
    viewMvxData,
    shownMvxAppDataNfts,
    isFetchingDataMarshal,
    setStopRadio,
    viewDataRes,
    tokenLogin,
    currentDataNftIndex,
    dataMarshalResponse,
    firstSongBlobUrl,
    setStopPreviewPlaying,
    setBitzGiftingMeta,
    shownSolAppDataNfts,
    onSendBitzForMusicBounty,
    nfTunesTokens,
    fetchMvxAppNfts,
    bountyBitzSumGlobalMapping,
    checkOwnershipOfAlbum,
    setMusicBountyBitzSumGlobalMapping,
    userHasNoBitzDataNftYet,
    openActionFireLogic,
    setFeaturedArtistDeepLinkSlug,
  } = props;
  const { address: addressMvx } = useGetAccount();
  const { mvxNfts, isLoadingMvx, isLoadingSol, solBitzNfts } = useNftsStore();
  const {
    network: { chainId: chainID },
  } = useGetNetworkConfig();
  const [artistAlbumDataset, setArtistAlbumDataset] = useState<any[]>([]);
  const [myCollectedArtistsAlbums, setMyCollectedArtistsAlbums] = useState<any[]>([]);
  const [allOwnedAlbums, setAllOwnedAlbums] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const allArtistsAlbumsData = await getArtistsAlbumsData();
      setArtistAlbumDataset(allArtistsAlbumsData);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (allOwnedAlbums.length > 0) {
        queueBitzPowerUpsAndLikesForAllOwnedAlbums();
      }
    })();
  }, [allOwnedAlbums]);

  useEffect(() => {
    if (artistAlbumDataset && artistAlbumDataset.length > 0) {
      if (shownSolAppDataNfts.length > 0) {
        console.log("&&& shownSolAppDataNfts ", shownSolAppDataNfts);
        let _allOwnedAlbums: any[] = [];
        const filteredArtists = artistAlbumDataset
          .map((artist) => {
            // Filter the albums array for each artist
            const filteredAlbums = artist.albums.filter((album: any) =>
              shownSolAppDataNfts.some((ownedNft: DasApiAsset) => ownedNft.content.metadata.name === album.solNftName)
            );

            // we need the creatorWallet from the album level on the album so the bitz can be fetched
            filteredAlbums.forEach((album: any) => {
              album.creatorWallet = artist.creatorWallet;
            });

            _allOwnedAlbums = [..._allOwnedAlbums, ...filteredAlbums];

            // Return artist data with only the filtered albums
            return {
              ...artist,
              albums: filteredAlbums,
            };
          })
          .filter((artist) => artist.albums.length > 0); // Only keep artists that have matching albums

        console.log("&&& filteredArtists ", filteredArtists);
        console.log("&&& allOwnedAlbums ", _allOwnedAlbums);
        setMyCollectedArtistsAlbums(filteredArtists);
        setAllOwnedAlbums(_allOwnedAlbums);
      } else if (shownMvxAppDataNfts.length > 0) {
        console.log("&&& shownMvxAppDataNfts ", shownMvxAppDataNfts);
      }
    }
  }, [artistAlbumDataset, shownSolAppDataNfts, shownMvxAppDataNfts]);

  async function queueBitzPowerUpsAndLikesForAllOwnedAlbums() {
    // we throttle this so that we don't overwhelm the server and also, the local state updates dont fire if they are all too close together
    for (let i = 0; i < allOwnedAlbums.length; i++) {
      console.log("&&& fetchBitzPowerUpsAndLikesForSelectedArtist call B4 ");

      fetchBitzPowerUpsAndLikesForSelectedArtist({
        giftBitzToArtistMeta: { ...allOwnedAlbums[i] },
        addressMvx,
        chainID,
        userHasNoBitzDataNftYet,
        solBitzNfts,
        setMusicBountyBitzSumGlobalMapping,
        isSingleAlbumBounty: true,
      });

      console.log("&&& fetchBitzPowerUpsAndLikesForSelectedArtist call A8 ");
      await sleep(2);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center w-full p-3 md:p-6 xl:pb-0">
      <div className="flex flex-col mb-16 xl:mb-32 justify-center w-[100%] items-center xl:items-start">
        <div className="flex flex-row rounded-lg mb-6 md:mb-6 px-8 xl:px-16 text-center gap-4 bg-[#333] dark:bg-primary md:text-2xl xl:text-3xl justify-center items-center cursor-pointer">
          <Music2 className="text-secondary" />
          <span className="text-secondary">My Collected Albums</span>
          <Music2 className="text-secondary" />
        </div>

        <div id="data-nfts" className="flex flex-col md:flex-row w-[100%] items-start">
          <div className="flex flex-col gap-4 p-8 items-start bg-background rounded-xl border border-primary/50 min-h-[350px] w-[100%]">
            {mvxNetworkSelected && (
              <HeaderComponent
                pageTitle={""}
                hasImage={false}
                pageSubtitle={`You have collected ${shownMvxAppDataNfts.length} Music Data NFTs`}
                alwaysCenterTitleAndSubTitle={true}>
                <div className="flex flex-col md:flex-row flex-wrap justify-center">
                  {shownMvxAppDataNfts.length > 0 ? (
                    shownMvxAppDataNfts.map((dataNft: any, index: number) => {
                      return (
                        <MvxDataNftCard
                          key={index}
                          index={index}
                          dataNft={dataNft}
                          isLoading={isLoadingMvx}
                          isDataWidget={true}
                          owned={mvxNfts.find((nft) => nft.tokenIdentifier === dataNft.tokenIdentifier) ? true : false}
                          viewData={viewMvxData}
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
                                {mvxNetworkSelected && viewDataRes && !viewDataRes.error && tokenLogin && currentDataNftIndex > -1 && (
                                  <MvxAudioPlayer
                                    dataNftToOpen={shownMvxAppDataNfts[currentDataNftIndex]}
                                    songs={dataMarshalResponse ? dataMarshalResponse.data : []}
                                    tokenLogin={tokenLogin}
                                    firstSongBlobUrl={firstSongBlobUrl}
                                    chainID={chainID}
                                  />
                                )}
                              </>
                            )
                          }
                          modalTitle="Music Player"
                          modalTitleStyle="p-4"
                          openActionBtnText="Play Album"
                          openActionFireLogic={(_bitzGiftingMeta?: any) => {
                            setStopRadio(true);
                            setStopPreviewPlaying(true);

                            if (_bitzGiftingMeta) {
                              setBitzGiftingMeta(_bitzGiftingMeta);
                            }
                          }}
                          cardStyles="mx-3"
                          hideIsInWalletSection={true}
                        />
                      );
                    })
                  ) : (
                    <>&nbsp;</>
                  )}
                </div>
              </HeaderComponent>
            )}

            {mvxNetworkSelected && shownMvxAppDataNfts.length < nfTunesTokens.length && (
              <div className="m-auto mb-5">
                <Button
                  className="border-0 text-background rounded-lg font-medium tracking-tight base:!text-sm md:!text-base hover:opacity-80 hover:text-black"
                  onClick={() => {
                    fetchMvxAppNfts(false);

                    gtagGo("NtuHm", "LoadMore", "MVX");
                  }}
                  disabled={false}>
                  Load more
                </Button>
              </div>
            )}

            {!mvxNetworkSelected && (
              <>
                <div className="flex flex-col justify-center w-[100%]">
                  {isLoadingSol ? (
                    <div className="m-auto bg">
                      <Loader noText />
                      Collected albums section powering up...
                    </div>
                  ) : (
                    <>
                      {myCollectedArtistsAlbums.length > 0 ? (
                        <>
                          <div className="my-2 font-bold text-lg">You have collected {allOwnedAlbums.length} albums</div>
                          {myCollectedArtistsAlbums.map((artist: any, index: number) => {
                            return (
                              <div key={index} className="w-[100%]">
                                <ArtistDiscography
                                  inCollectedAlbumsView={true}
                                  artist={artist}
                                  albums={artist.albums}
                                  bountyBitzSumGlobalMapping={bountyBitzSumGlobalMapping}
                                  onSendBitzForMusicBounty={onSendBitzForMusicBounty}
                                  artistProfile={artist}
                                  mvxNetworkSelected={mvxNetworkSelected}
                                  checkOwnershipOfAlbum={checkOwnershipOfAlbum}
                                  viewSolData={viewSolData}
                                  viewMvxData={viewMvxData}
                                  openActionFireLogic={openActionFireLogic}
                                  setFeaturedArtistDeepLinkSlug={setFeaturedArtistDeepLinkSlug}
                                />
                              </div>
                            );
                          })}
                        </>
                      ) : (
                        <div className="m-auto text-center">
                          ⚠️ You have not collected any albums :(
                          <br />
                          Let's fix that! <br />
                          Get your{" "}
                          <span
                            className="text-primary underline hover:no-underline"
                            onClick={() => {
                              window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                              });
                            }}>
                            free airdrop on top of this page (if you are eligible)
                          </span>{" "}
                          or get some by{" "}
                          <span
                            className="text-primary underline hover:no-underline"
                            onClick={() => {
                              scrollToSection("artist-profile");
                            }}>
                            exploring artists and albums
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {myCollectedArtistsAlbums.length > 0 && (
                  <Button
                    className="text-lg mb-2 cursor-pointer"
                    variant="outline"
                    onClick={() => {
                      scrollToSection("artist-profile");
                    }}>
                    <>
                      <LibraryBig />
                      <span className="ml-2">View All Artists & Collect More Albums</span>
                    </>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
