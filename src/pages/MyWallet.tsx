import React, { useEffect, useState } from "react";
import { DataNft, ViewDataReturnType } from "@itheum/sdk-mx-data-nft";
import { SignableMessage } from "@multiversx/sdk-core/out";
import { signMessage } from "@multiversx/sdk-dapp/utils/account";
import { ModalBody } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { IoClose } from "react-icons/io5";
import Modal from "react-modal";
import { DataNftCard, Loader } from "components";
import { useGetAccount, useGetPendingTransactions } from "hooks";
import { modalStyles } from "libs/ui";
import { toastError } from "libs/utils";

interface ExtendedViewDataReturnType extends ViewDataReturnType {
  isImage: boolean;
}

export const MyWallet = () => {
  const { address } = useGetAccount();
  const { hasPendingTransactions } = useGetPendingTransactions();

  const [dataNftCount, setDataNftCount] = useState<number>(0);
  const [dataNfts, setDataNfts] = useState<DataNft[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [viewDataRes, setViewDataRes] = useState<ExtendedViewDataReturnType>();
  const [isFetchingDataMarshal, setIsFetchingDataMarshal] =
    useState<boolean>(true);
  console.log("viewDataRes", viewDataRes);

  const [isModalOpened, setIsModalOpenend] = useState<boolean>(false);
  function openModal() {
    setIsModalOpenend(true);
  }
  function closeModal() {
    setIsModalOpenend(false);
  }

  async function fetchData() {
    setIsLoading(true);

    const _dataNfts = await DataNft.ownedByAddress(address);
    console.log("_dataNfts", _dataNfts);
    setDataNftCount(_dataNfts.length);
    setDataNfts(_dataNfts);

    setIsLoading(false);
  }

  useEffect(() => {
    if (!hasPendingTransactions) {
      fetchData();
    }
  }, [hasPendingTransactions]);

  async function viewData(index: number) {
    if (!(index >= 0 && index < dataNfts.length)) {
      toastError("Data is not loaded");
      return;
    }

    setIsFetchingDataMarshal(true);
    setViewDataRes(undefined);
    openModal();

    const dataNft = dataNfts[index];
    const messageToBeSigned = await dataNft.getMessageToSign();
    console.log("messageToBeSigned", messageToBeSigned);
    const signedMessage = await signMessage({ message: messageToBeSigned });
    console.log("signedMessage", signedMessage);
    const res = await dataNft.viewData(
      messageToBeSigned,
      signedMessage as any as SignableMessage,
      true
    );
    console.log("viewData", res);

    if (!res.error) {
      if (res.contentType.search("image") >= 0) {
        res.data = window.URL.createObjectURL(
          new Blob([res.data], { type: res.contentType })
        );
      } else {
        res.data = await (res.data as Blob).text();
        res.data = JSON.stringify(JSON.parse(res.data), null, 4);
      }
    } else {
      console.error(res.error);
      toastError(res.error);
    }

    setViewDataRes({
      ...res,
      isImage: res.contentType.search("image") >= 0,
    });

    setIsFetchingDataMarshal(false);
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="d-flex flex-fill justify-content-center container py-4">
      <div className="row w-100">
        <div className="col-12 mx-auto">
          <h4 className="mt-5 text-center">My Data NFTs: {dataNftCount}</h4>

          <div className="row mt-5">
            {dataNfts.length > 0 ? (
              dataNfts.map((dataNft, index) => (
                <DataNftCard
                  key={index}
                  index={index}
                  dataNft={dataNft}
                  isLoading={isLoading}
                  owned={true}
                  viewData={viewData}
                  isWallet={true}
                />
              ))
            ) : (
              <h3 className="text-center text-white">
                You have not listed any offer
              </h3>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpened}
        onRequestClose={closeModal}
        style={modalStyles}
        ariaHideApp={false}
      >
        <div style={{ height: "3rem" }}>
          <div
            style={{
              float: "right",
              cursor: "pointer",
              fontSize: "2rem",
            }}
            onClick={closeModal}
          >
            <IoClose />
          </div>
        </div>
        <ModalHeader>
          <h4 className="text-center font-title font-weight-bold">
            File Viewer
          </h4>
        </ModalHeader>
        <ModalBody
          style={{
            minWidth: "26rem",
            minHeight: "36rem",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {isFetchingDataMarshal ? (
            <div
              className="d-flex flex-column align-items-center justify-content-center"
              style={{
                minWidth: "24rem",
                maxWidth: "100% !important",
                minHeight: "40rem",
                maxHeight: "80vh",
              }}
            >
              <Loader />
            </div>
          ) : (
            viewDataRes &&
            !viewDataRes.error &&
            (viewDataRes.isImage ? (
              <img
                src={viewDataRes.data}
                style={{ width: "100%", height: "auto" }}
              />
            ) : (
              <p
                className="p-2"
                style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
              >
                {viewDataRes.data}
              </p>
            ))
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};
