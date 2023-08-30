import React, { useEffect, useRef, useState } from "react";
// import { DataNft } from "@itheum/sdk-mx-data-nft";
import { DataNft } from "@itheum/sdk-mx-data-nft";
import { Address, SignableMessage } from "@multiversx/sdk-core/out";
import { useSignMessage } from "@multiversx/sdk-dapp/hooks/signMessage/useSignMessage";
import BigNumber from "bignumber.js";
import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { pointRadial } from "d3";
import { ModalBody, Table } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { Bubble, getDatasetAtEvent } from "react-chartjs-2";
import { FaFileAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Modal from "react-modal";
import { CustomPagination, DataNftCard, ElrondAddressLink, Loader } from "components";
import { ESDT_BUBBLE_NONCES, MAINNET_EXPLORER_ADDRESS } from "config";
import { useGetAccount, useGetNetworkConfig, useGetPendingTransactions } from "hooks";
import { modalStyles } from "libs/ui";
import { convertWeiToEsdt, shortenAddress, toastError } from "libs/utils";
import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { HeaderComponent } from "../components/Layout/HeaderComponent";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, zoomPlugin);

const maxScaleSize = 800;
const chartOptions = {
  aspectRatio: 1,
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (ctx: any) => {
          return `${shortenAddress(ctx.dataset.label)} (${ctx.dataset.percent.toFixed(4)}%)`;
        },
      },
    },
  },
  scales: {
    x: {
      max: maxScaleSize,
      min: -maxScaleSize,
      display: false,
    },
    y: {
      max: maxScaleSize,
      min: -maxScaleSize,
      display: false,
    },
  },
};

const chartOptionsWithZoom = {
  aspectRatio: 1,
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (ctx: any) => {
          return `${shortenAddress(ctx.dataset.label)} (${ctx.dataset.percent.toFixed(4)}%)`;
        },
      },
    },
    zoom: {
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true,
        },
        drag: {
          enabled: true,
        },
        mode: "xy" as any,
      },
    },
  },
  scales: {
    x: {
      max: maxScaleSize,
      min: -maxScaleSize,
      display: false,
    },
    y: {
      max: maxScaleSize,
      min: -maxScaleSize,
      display: false,
    },
  },
};

export const ChartDescription = () => (
  <div className="d-flex justify-content-center">
    <div className="d-flex flex-row align-items-center">
      <div className="d-flex justify-content-center align-items-center p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: "1rem",
            height: "1rem",
            marginRight: "0.25rem",
          }}>
          <circle cx=".5rem" cy=".5rem" r=".5rem" fill="#f00" />
        </svg>
        <span>{"> 1%"}</span>
      </div>
      <div className="d-flex justify-content-center align-items-center p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: "1rem",
            height: "1rem",
            marginRight: "0.25rem",
          }}>
          <circle cx=".5rem" cy=".5rem" r=".5rem" fill="#0f0" />
        </svg>
        <span>{"> 0.1%"}</span>
      </div>
      <div className="d-flex justify-content-center align-items-center p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: "1rem",
            height: "1rem",
            marginRight: "0.25rem",
          }}>
          <circle cx=".5rem" cy=".5rem" r=".5rem" fill="#00f" />
        </svg>
        <span>{"> 0.01%"}</span>
      </div>
      <div className="d-flex justify-content-center align-items-center p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: "1rem",
            height: "1rem",
            marginRight: "0.25rem",
          }}>
          <circle cx=".5rem" cy=".5rem" r=".5rem" fill="#f0f" />
        </svg>
        <span>{"< 0.01%"}</span>
      </div>
    </div>
  </div>
);

export const EsdtBubble = () => {
  const {
    network: { explorerAddress },
  } = useGetNetworkConfig();
  const { address } = useGetAccount();
  const { loginMethod } = useGetLoginInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { signMessage } = useSignMessage();

  const [dataNfts, setDataNfts] = useState<DataNft[]>([]);
  const [selectedDataNft, setSelectedDataNft] = useState<DataNft>();
  const [flags, setFlags] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPendingMessageSigned, setIsPendingMessageSigned] = useState(false);

  const [isFetchingDataMarshal, setIsFetchingDataMarshal] = useState<boolean>(true);
  const [owned, setOwned] = useState<boolean>(false);

  const [data, setData] = useState<any>();
  const [dataItems, setDataItems] = useState<any[]>([]);

  const [chartSelected, setChartSelected] = useState<boolean>(false);

  const [isModalOpened, setIsModalOpenend] = useState<boolean>(false);
  function openModal() {
    setIsModalOpenend(true);
  }
  function closeModal() {
    setIsModalOpenend(false);
  }

  const pageSize = 50;
  const pageCount = Math.max(Math.floor(dataItems.length / pageSize), 1);
  const [pageIndex, setPageIndex] = useState<number>(0);
  function onGotoPage(value: number) {
    if (value < 0) return;
    if (value >= pageCount) return;
    setPageIndex(value);
  }
  async function fetchDataNfts() {
    setIsLoading(true);

    const _nfts: DataNft[] = await DataNft.createManyFromApi(ESDT_BUBBLE_NONCES);
    setDataNfts(_nfts);

    setIsLoading(false);
  }

  async function fetchMyNfts() {
    const _dataNfts = await DataNft.ownedByAddress(address);

    const _flags = [];
    for (const cnft of dataNfts) {
      const matches = _dataNfts.filter((mnft: any) => cnft.nonce === mnft.nonce);
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
    if (!(index >= 0 && index < dataNfts.length)) {
      toastError("Data is not loaded");
      return;
    }

    const _owned = flags[index];
    setOwned(_owned);

    if (_owned) {
      setIsFetchingDataMarshal(true);
      openModal();

      const dataNft = dataNfts[index];
      setSelectedDataNft(dataNft);
      const messageToBeSigned = await dataNft.getMessageToSign();
      setIsPendingMessageSigned(true);
      const signedMessage = await signMessage({ message: messageToBeSigned });
      setIsPendingMessageSigned(false);

      console.log("signedMessage", signedMessage);
      const res = await dataNft.viewData(messageToBeSigned, signedMessage as any);
      if (!signedMessage) {
        toastError("Wallet signing failed.");
        return;
      }

      res.data = await (res.data as Blob).text();
      res.data = JSON.parse(res.data);

      processData(res.data);

      setIsFetchingDataMarshal(false);
    } else {
      openModal();
    }
  }

  function processData(rawData: any[]) {
    let sum = new BigNumber(0);
    rawData.forEach((row) => (sum = sum.plus(row["balance"])));

    const accounts = rawData.map((row) => {
      const percent = new BigNumber(row["balance"]).div(sum).toNumber() * 100;
      let backgroundColor = "#f0f";
      if (percent > 1) {
        backgroundColor = "#f00";
      } else if (percent > 0.1) {
        backgroundColor = "#0f0";
      } else if (percent > 0.01) {
        backgroundColor = "#00f";
      }

      return {
        address: row["address"],
        percent,
        backgroundColor,
        balance: row["balance"],
      };
    });

    setDataItems(accounts);

    const _data = {
      datasets: accounts.map((acc, i) => {
        // const angle = i < 10 ? 0.5 * i : 0.4 * i;
        const angle = 0.4 * i;
        // const distance = (60 + Math.pow(i * 500, 0.45) * 2);
        const distance = 100 + Math.pow(i * 2000, 0.45) + Math.pow(1.01, i) * 20;
        const pos = pointRadial(angle, distance);
        return {
          label: acc.address,
          data: [
            {
              x: pos[0],
              y: pos[1],
              r: Math.pow(acc.percent * 1500, 0.16) * 2,
            },
          ],
          backgroundColor: acc.backgroundColor,
          percent: acc.percent,
        };
      }),
    };
    setData(_data);
  }

  const chartRef = useRef<ChartJS<"bubble">>();
  function onChartClick(event: any) {
    if (!chartRef.current) return;
    const items = getDatasetAtEvent(chartRef.current, event);
    if (items.length > 0) {
      const datasetIndex = getDatasetAtEvent(chartRef.current, event)[0].datasetIndex;
      window.open(`${MAINNET_EXPLORER_ADDRESS}/accounts/${dataItems[datasetIndex].address}/tokens`, "_blank")?.focus();
    }
  }

  function onClickResetZoom() {
    if (chartRef.current) {
      const chart = chartRef.current as ChartJS;
      chart.resetZoom();
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <HeaderComponent pageTitle={"ESDT Bubbles"} hasImage={false} pageSubtitle={"ESDT Bubbles NFTs"} dataNftCount={dataNfts.length}>
      {dataNfts.length > 0 ? (
        dataNfts.map((dataNft, index) => (
          <DataNftCard key={index} index={index} dataNft={dataNft} isLoading={isLoading} owned={flags[index]} viewData={viewData} />
        ))
      ) : (
        <h3 className="text-center text-white">No DataNFT</h3>
      )}

      <Modal isOpen={isModalOpened} onRequestClose={closeModal} style={modalStyles} ariaHideApp={false}>
        <div style={{ height: "3rem" }}>
          <div
            style={{
              float: "right",
              cursor: "pointer",
              fontSize: "2rem",
            }}
            onClick={closeModal}>
            <IoClose />
          </div>
        </div>
        <ModalHeader>
          <h4 className="text-center font-title font-weight-bold">View Data</h4>
        </ModalHeader>
        <ModalBody
          style={{
            minWidth: "26rem",
            minHeight: "36rem",
            maxHeight: "80vh",
            overflowY: "scroll",
          }}>
          {!owned ? (
            <div
              className="d-flex flex-column align-items-center justify-content-center"
              style={{
                minWidth: "24rem",
                maxWidth: "50vw",
                minHeight: "40rem",
                maxHeight: "80vh",
              }}>
              <h4 className="mt-3 font-title">You do not own this Data NFT</h4>
              <h6>(Buy the Data NFT from the marketplace to unlock the data)</h6>
            </div>
          ) : isFetchingDataMarshal || !data ? (
            <div
              className="d-flex flex-column align-items-center justify-content-center"
              style={{
                minHeight: "40rem",
              }}>
              <div>
                <Loader noText />
                <p className="text-center font-weight-bold">
                  {["ledger", "walletconnectv2", "extra"].includes(loginMethod) ? "Please sign the message using xPortal or Ledger" : "Loading..."}
                </p>
              </div>
            </div>
          ) : (
            <>
              <h5 className="mt-3 mb-4 text-center font-title font-weight-bold">{selectedDataNft?.title}</h5>
              <div className="text-center font-title font-weight-bold">(TOP {data.datasets.length} Accounts)</div>

              <ChartDescription />
              <div style={{ position: "relative" }}>
                <button className="btn btn-danger ml-1 zoom-reset" onClick={onClickResetZoom}>
                  Reset
                </button>

                <button
                  className={chartSelected ? "btn btn-info ml-2 zoom-reset" : "btn btn-primary ml-2 zoom-reset"}
                  onClick={() => setChartSelected(!chartSelected)}>
                  {chartSelected ? "Unfocus" : "Focus"}
                </button>

                <div className={chartSelected ? "custom-box-border selected" : "custom-box-border"}>
                  <Bubble options={chartSelected ? chartOptionsWithZoom : chartOptions} data={data} ref={chartRef} onClick={onChartClick} />
                </div>
              </div>
              <ChartDescription />

              <div>
                <CustomPagination pageCount={pageCount} pageIndex={pageIndex} pageSize={pageSize} gotoPage={onGotoPage} />
              </div>
              <Table striped responsive className="mt-3">
                <thead>
                  <tr className="">
                    <th>#</th>
                    <th>Address</th>
                    <th>Balance</th>
                    <th>Percent</th>
                  </tr>
                </thead>
                <tbody>
                  {dataItems.slice(pageSize * pageIndex, pageSize * (pageIndex + 1)).map((row: any, index: number) => (
                    <tr key={`e-b-p-${index}`}>
                      <td>{pageSize * pageIndex + index + 1}</td>
                      <td>
                        {<FaFileAlt className="mr-2" visibility={new Address(row.address).isContractAddress() ? "visible" : "hidden"} />}
                        <ElrondAddressLink explorerAddress={MAINNET_EXPLORER_ADDRESS} address={row.address} precision={9} />
                      </td>
                      <td>{convertWeiToEsdt(row.balance).toFixed(4)} EGLD</td>
                      <td>{row.percent.toFixed(4)}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div>
                <CustomPagination pageCount={pageCount} pageIndex={pageIndex} pageSize={pageSize} gotoPage={onGotoPage} />
              </div>
            </>
          )}
        </ModalBody>
      </Modal>
    </HeaderComponent>
  );
};
