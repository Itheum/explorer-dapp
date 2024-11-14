import React, { useEffect, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft/out";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { BOBER_GAME_ROOM_TOKENS } from "appsConfig";
import headerImg from "assets/img/bober-game-room/BoberCover.png";
import { MvxDataNftCard } from "components";
import HelmetPageMeta from "components/HelmetPageMeta";
import { HeaderComponent } from "components/Layout/HeaderComponent";
import { SHOW_NFTS_STEP } from "config";
import { useGetPendingTransactions } from "hooks";
import { Button } from "libComponents/Button";
import { decodeNativeAuthToken, toastError } from "libs/utils";
import { useNftsStore } from "store/nfts";
import { BoberModal } from "./components/BoberModal";

export const BoberGameRoom: React.FC = () => {
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { tokenLogin } = useGetLoginInfo();
  const [shownAppDataNfts, setShownAppDataNfts] = useState<DataNft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  const [owned, setOwned] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const { mvxNfts: nfts, isLoadingMvx: isLoadingUserNfts } = useNftsStore();

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
      BOBER_GAME_ROOM_TOKENS.slice(shownAppDataNfts.length, shownAppDataNfts.length + SHOW_NFTS_STEP).map((v) => ({
        nonce: v.nonce,
        tokenIdentifier: v.tokenIdentifier,
      })),
      5 * 60 * 1000
    );

    setShownAppDataNfts((oldNfts) => oldNfts.concat(_nfts));
    if (activeIsLoading) {
      setIsLoading(false);
    }
  }

  async function viewData(index: number) {
    try {
      if (!(index >= 0 && index < shownAppDataNfts.length)) {
        toastError("Data is not loaded");
        return;
      }

      const dataNft = shownAppDataNfts[index];
      const _owned = nfts.find((nft) => nft.tokenIdentifier === dataNft.tokenIdentifier) ? true : false;
      setOwned(_owned);

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
          nestedStream: true,
          nestedIdxToStream: 1,
        };

        res = await dataNft.viewDataViaMVXNativeAuth(arg);
        res.data = await (res.data as Blob);

        setData(res.data);
        setIsFetchingDataMarshal(false);
      }
    } catch (err) {
      console.error(err);
      toastError((err as Error).message);
      setIsFetchingDataMarshal(false);
    }
  }

  return (
    <>
      <HelmetPageMeta title="Bober Room Game App" shortTitle="Bober Room Game App" desc="Bober Room Game App" />

      <HeaderComponent
        pageTitle={"Bober Game Room"}
        hasImage={true}
        imgSrc={headerImg}
        altImageAttribute={"boberGameRoom"}
        pageSubtitle={"Data NFTs that Unlock this Itheum App"}
        dataNftCount={shownAppDataNfts.length}
        alwaysLeftAlignBodyContentOnMD={true}>
        {shownAppDataNfts.length > 0 ? (
          shownAppDataNfts.map((dataNft, index) => (
            <MvxDataNftCard
              key={index}
              index={index}
              dataNft={dataNft}
              isLoading={isLoading || isLoadingUserNfts}
              isDataWidget={true}
              owned={nfts.find((nft) => nft.tokenIdentifier === dataNft.tokenIdentifier) ? true : false}
              modalStyles={"md:h-[95svh] sm:h-[100svh]"}
              viewData={viewData}
              modalContent={<BoberModal data={data} isFetchingDataMarshal={isFetchingDataMarshal} owned={owned} />}
              modalTitle={"Bober Game Room"}
              modalTitleStyle="md:p-5 pt-5 pb-5 px-2"
            />
          ))
        ) : (
          <h3 className="text-center text-white">No Data NFTs</h3>
        )}
      </HeaderComponent>

      <div className="m-auto mb-5">
        {shownAppDataNfts.length < BOBER_GAME_ROOM_TOKENS.length && (
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
    </>
  );
};
