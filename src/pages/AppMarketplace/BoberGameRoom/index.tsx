import React, { useEffect, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft/out";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { BOBER_GAME_ROOM_TOKENS } from "appsConfig";
import headerImg from "assets/img/bober-game-room/BoberCover.png";
import { DataNftCard } from "components";
import { HeaderComponent } from "components/Layout/HeaderComponent";
import { useGetPendingTransactions } from "hooks";
import { decodeNativeAuthToken, toastError } from "libs/utils";
import { useNftsStore } from "store/nfts";
import { BoberModal } from "./components/BoberModal";

export const BoberGameRoom: React.FC = () => {
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { tokenLogin } = useGetLoginInfo();

  const [appDataNfts, setAppDataNfts] = useState<DataNft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  const [owned, setOwned] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const nfts = useNftsStore((state) => state.nfts);

  useEffect(() => {
    if (!hasPendingTransactions) {
      fetchAppNfts();
    }
  }, [hasPendingTransactions]);

  async function fetchAppNfts() {
    setIsLoading(true);

    const _nfts: DataNft[] = await DataNft.createManyFromApi(BOBER_GAME_ROOM_TOKENS.map((v) => ({ nonce: v.nonce, tokenIdentifier: v.tokenIdentifier })));

    setAppDataNfts(_nfts);
    setIsLoading(false);
  }

  async function viewData(index: number) {
    try {
      if (!(index >= 0 && index < appDataNfts.length)) {
        toastError("Data is not loaded");
        return;
      }

      const dataNft = appDataNfts[index];
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
    <HeaderComponent
      pageTitle={"Bober Game Room"}
      hasImage={true}
      imgSrc={headerImg}
      altImageAttribute={"itheumTrailblazer"}
      pageSubtitle={"Data NFTs that Unlock this Itheum Data Widget"}
      dataNftCount={appDataNfts.length}>
      {appDataNfts.length > 0 ? (
        appDataNfts.map((dataNft, index) => (
          <DataNftCard
            key={index}
            index={index}
            dataNft={dataNft}
            isLoading={isLoading}
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
  );
};
