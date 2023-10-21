import React, { useEffect, useState } from "react";
import { useGetAccount, useGetPendingTransactions } from "../../../hooks";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { DataNft } from "@itheum/sdk-mx-data-nft/out";
import { BLEND_NFT_TOKENS } from "config";
import { HeaderComponent } from "../../../components/Layout/HeaderComponent";
import { DataNftCard } from "../../../components";
import { nativeAuthOrigins, toastError } from "../../../libs/utils";
import { BlenderDataNftModal } from "./components/BlenderDataNftModal";

export const BlenderDataNft: React.FC = () => {
  const { address } = useGetAccount();
  const { loginMethod } = useGetLoginInfo();

  ///native auth
  const { tokenLogin } = useGetLoginInfo();

  const { hasPendingTransactions } = useGetPendingTransactions();

  const [owned, setOwned] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  const [flags, setFlags] = useState<boolean[]>([]);
  const [itDataNfts, setDataNfts] = useState<DataNft[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  ///get the nfts that are able to open nfTunes app
  async function fetchDataNfts() {
    setIsLoading(true);

    const _nfts: DataNft[] = await DataNft.createManyFromApi(BLEND_NFT_TOKENS.map((v: any) => ({ nonce: v.nonce, tokenIdentifier: v.tokenIdentifier })));
    setDataNfts(_nfts);

    setIsLoading(false);
  }

  async function fetchMyNfts() {
    const _dataNfts = await DataNft.ownedByAddress(address);
    const _flags = [];

    for (const cnft of itDataNfts) {
      const matches = _dataNfts.filter((mnft) => cnft.nonce === mnft.nonce);
      _flags.push(matches.length > 0);
    }

    setFlags(_flags);
  }

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

  async function viewData(index: number) {
    try {
      if (!(index >= 0 && index < itDataNfts.length)) {
        toastError("Data is not loaded");
        return;
      }

      const dataNft = itDataNfts[index];
      const _owned = flags[index];
      setOwned(_owned);

      if (_owned) {
        setIsFetchingDataMarshal(true);

        let res: any;
        if (!(tokenLogin && tokenLogin.nativeAuthToken)) {
          throw Error("No nativeAuth token");
        }

        const arg = {
          mvxNativeAuthOrigins: nativeAuthOrigins(),
          mvxNativeAuthMaxExpirySeconds: 3000,
          fwdHeaderMapLookup: {
            "authorization": `Bearer ${tokenLogin.nativeAuthToken}`,
          },
        };

        res = await dataNft.viewDataViaMVXNativeAuth(arg);
        res.data = await (res.data as Blob).text();
        res.data = JSON.parse(res.data);

        console.log(res.data);
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
    <HeaderComponent pageTitle={"Blend Your NFT"} hasImage={false} pageSubtitle={"Data NFTs that Unlock this App"} dataNftCount={itDataNfts.length}>
      {itDataNfts.length > 0 ? (
        itDataNfts.map((dataNft, index) => (
          <DataNftCard
            key={index}
            index={index}
            dataNft={dataNft}
            isLoading={isLoading}
            owned={flags[index]}
            viewData={viewData}
            modalContent={<BlenderDataNftModal owned={owned} isFetchingDataMarshal={isFetchingDataMarshal} data={data} />}
            modalTitle={"Blend Your NFT"}
            modalTitleStyle="md:!p-5 !pt-5 !pb-5 px-2"
          />
        ))
      ) : (
        <h3 className="text-center text-white">No Data NFTs</h3>
      )}
    </HeaderComponent>
  );
};
