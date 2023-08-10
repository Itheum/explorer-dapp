import React, { useEffect, useState } from "react";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { Address, SignableMessage } from "@multiversx/sdk-core/out";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { useGetLastSignedMessageSession } from "@multiversx/sdk-dapp/hooks/signMessage/useGetLastSignedMessageSession";
import { useSignMessage } from "@multiversx/sdk-dapp/hooks/signMessage/useSignMessage";
import * as DOMPurify from "dompurify";
import { useNavigate, useParams } from "react-router-dom";
import headerHero from "assets/img/custom-app-header-trailblazer.png";
import { DataNftCard, Loader, TrailBlazerModal } from "components";
import { TRAILBLAZER_NONCES } from "config";
import { useGetAccount, useGetPendingTransactions } from "hooks";
import { toastError } from "libs/utils";
import "react-vertical-timeline-component/style.min.css";
import { routeNames } from "routes";

export const ItheumTrailblazer = () => {
  const { address } = useGetAccount();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { signMessage } = useSignMessage();
  const { loginMethod } = useGetLoginInfo();
  const navigate = useNavigate();
  const isWebWallet = loginMethod == "wallet";
  const { targetNonce, targetMessageToBeSigned } = useParams();
  const lastSignedMessageSession = useGetLastSignedMessageSession();

  const [itDataNfts, setItDataNfts] = useState<DataNft[]>([]);
  const [flags, setFlags] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  const [owned, setOwned] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

  useEffect(() => {
    if (!hasPendingTransactions) {
      fetchAppNfts();
    }
  }, [hasPendingTransactions]);

  useEffect(() => {
    if (!isLoading && address) {
      fetchMyNfts();
    }
  }, [isLoading, address]);

  useEffect(() => {
    if (isWebWallet && !!targetNonce && !!targetMessageToBeSigned && lastSignedMessageSession) {
      (async () => {
        console.log("Sign", {
          isWebWallet,
          targetNonce,
          targetMessageToBeSigned,
        });
        const signature = lastSignedMessageSession.signature ?? "";
        const signedMessage = new SignableMessage({
          address: new Address(address),
          message: Buffer.from(targetMessageToBeSigned, "ascii"),
          signature: Buffer.from(signature, "hex"),
          signer: loginMethod,
        });
        await processSignature(Number(targetNonce), targetMessageToBeSigned, signedMessage);
      })();
    }
  }, [isWebWallet, targetNonce]);

  function openModal() {
    setIsModalOpened(true);
  }

  function closeModal() {
    setIsModalOpened(false);
  }

  async function fetchAppNfts() {
    setIsLoading(true);

    const _nfts: DataNft[] = await DataNft.createManyFromApi(TRAILBLAZER_NONCES);

    setItDataNfts(_nfts);
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

  async function viewData(index: number) {
    try {
      if (!(index >= 0 && index < itDataNfts.length)) {
        toastError("Data is not loaded");
        return;
      }

      const _owned = flags[index];
      setOwned(_owned);

      if (_owned) {
        setIsFetchingDataMarshal(true);
        openModal();

        const dataNft = itDataNfts[index];

        const messageToBeSigned = await dataNft.getMessageToSign();
        const callbackRoute = `${window.location.href}/${dataNft.nonce}/${messageToBeSigned}`;
        const signedMessage = await signMessage({
          message: messageToBeSigned,
          callbackRoute: isWebWallet ? callbackRoute : undefined,
        });

        if (isWebWallet) return;
        if (!signedMessage) {
          toastError("Wallet signing failed.");
          return;
        }

        const res = await dataNft.viewData(messageToBeSigned, signedMessage as any);
        res.data = DOMPurify.sanitize(await (res.data as Blob).text());
        res.data = JSON.parse(res.data);

        setData(res.data.data.reverse());
        setIsFetchingDataMarshal(false);
      } else {
        openModal();
      }
    } catch (err) {
      console.error(err);
      toastError((err as Error).message);
      closeModal();
      setIsFetchingDataMarshal(false);
    }
  }

  async function processSignature(nonce: number, messageToBeSigned: string, signedMessage: SignableMessage) {
    try {
      setIsFetchingDataMarshal(true);
      setOwned(true);
      openModal();

      const dataNft = await DataNft.createFromApi(nonce);
      const res = await dataNft.viewData(messageToBeSigned, signedMessage as any);
      res.data = DOMPurify.sanitize(await (res.data as Blob).text());
      res.data = JSON.parse(res.data);

      setData(res.data.data.reverse());
      setIsFetchingDataMarshal(false);

      if (isWebWallet) {
        navigate(routeNames.itheumtrailblazer);
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container d-flex flex-fill justify-content-center py-4 c-marketplace-app">
      <div className="row w-100">
        <div className="col-12 mx-auto">
          <h1 className="app-title">Trailblazer</h1>
          <div className="hero">
            <img className="img-fluid" src={headerHero} style={{ width: "100%", height: "auto" }} />
          </div>
          <div className="body">
            <h4 className="my-3 text-center nfts-unlocks">Data NFTs that Unlock this App: {itDataNfts.length}</h4>

            <div className="row mt-5">
              {itDataNfts.length > 0 ? (
                itDataNfts.map((dataNft, index) => (
                  <DataNftCard key={index} index={index} dataNft={dataNft} isLoading={isLoading} owned={flags[index]} viewData={viewData} />
                ))
              ) : (
                <h3 className="text-center text-white">No Data NFTs</h3>
              )}
            </div>
          </div>
          <div className="footer"></div>
        </div>
      </div>

      <TrailBlazerModal isModalOpened={isModalOpened} closeModal={closeModal} owned={owned} isFetchingDataMarshal={isFetchingDataMarshal} data={data} />
    </div>
  );
};
