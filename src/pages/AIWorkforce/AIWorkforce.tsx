import React, { useEffect, useState } from "react";
import { useGetAccount } from "@multiversx/sdk-dapp/hooks";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "libComponents/Button";
import { backendApi } from "libs/backend-api";
import { WorkersSnapShotGrid } from "./SharedComps";

// const rankedWorkforce = [
//   {
//     "uuid": 358,
//     "address": "erd1eweqykxcrhh5nps4fzktu9eftf7rxpa8xdfkypwz0k4huhl0s04sa6tqyd",
//     "rankScore": 10,
//     "bondAmount": 566,
//     "livelinessScore": 1,
//     "bitzXp": 0,
//     "vault": "DATANFTFT-e0b917-024b",
//     "vaultImg": "https://devnet-media.elrond.com/nfts/asset/QmUHzpCRRLguzjAEnXB33Ar2FbR4EE18KRCChjUPyLyCUo",
//     "creationTime": "2024-09-02T08:18:32.000Z",
//     "lastUpdated": 1725277510,
//   },
//   {
//     "uuid": 359,
//     "address": "erd1rzjsadakpqfqm2umcv96d7d95zcwzm7pac8g4kmcp6kdfgzmuhgs2kyrzv",
//     "rankScore": 0,
//     "bondAmount": 1001,
//     "livelinessScore": 0,
//     "bitzXp": 0,
//     "vault": "DATANFTFT-e0b917-0244",
//     "vaultImg": "https://devnet-media.elrond.com/nfts/asset/QmWxrgB4o6QTJUsbCmZXSSPc3WvFvh4RBrLs9pwJSpEGUw",
//     "creationTime": "2024-08-27T07:13:14.000Z",
//     "lastUpdated": 1725277508,
//   },
//   {
//     "uuid": 360,
//     "address": "erd1rzjsadakpqfqm2umcv96d7d95zcwzm7pac8g4kmcp6kdfgzmuhgs2kyrzv",
//     "rankScore": 0,
//     "bondAmount": 1001,
//     "livelinessScore": 0,
//     "bitzXp": 0,
//     "vault": "DATANFTFT-e0b917-0249",
//     "vaultImg": "https://devnet-media.elrond.com/nfts/asset/QmRicYzifHSQP9xk6FaA7QqnRQN3qgd4WqLhqGxrJJqto9",
//     "creationTime": "2024-08-27T07:23:56.000Z",
//     "lastUpdated": 1725277509,
//   },
//   {
//     "uuid": 361,
//     "address": "erd1mywl5r9ptxurzhnz2ztrjdjswssd44l05n3l5ly3795gf777ujmqma76gx",
//     "rankScore": 0,
//     "bondAmount": 811,
//     "livelinessScore": 0,
//     "bitzXp": 0,
//     "vault": "DATANFTFT-e0b917-0242",
//     "vaultImg": "https://devnet-media.elrond.com/nfts/asset/QmWDyB3mQMEgJ2cfNS2yWf8AmZ7CRs52eDmvtqqgELuLnK",
//     "creationTime": "2024-08-27T07:05:56.000Z",
//     "lastUpdated": 1725277507,
//   },
//   {
//     "uuid": 362,
//     "address": "erd1cyp3c6plhrmlwzue7f7cg8kqs6jf0c6temmh6gsh3tfj3de3a7csddfm6t",
//     "rankScore": 0,
//     "bondAmount": 722,
//     "livelinessScore": 0,
//     "bitzXp": 0,
//     "vault": "DATANFTFT-e0b917-0248",
//     "vaultImg": "https://devnet-media.elrond.com/nfts/asset/QmPgQ3brZgf8izBNYKAERiaKDnmxeGhUZQYXhCLJ2kqvFV",
//     "creationTime": "2024-08-27T07:20:44.000Z",
//     "lastUpdated": 1725277509,
//   },
//   {
//     "uuid": 363,
//     "address": "erd1cyp3c6plhrmlwzue7f7cg8kqs6jf0c6temmh6gsh3tfj3de3a7csddfm6t",
//     "rankScore": 0,
//     "bondAmount": 722,
//     "livelinessScore": 0,
//     "bitzXp": 0,
//     "vault": "DATANFTFT-e0b917-024a",
//     "vaultImg": "https://devnet-media.elrond.com/nfts/asset/QmRSRLEcPJ2hgeAJ6bey83AWgg3QVjojVwi5CCYLj7R82h",
//     "creationTime": "2024-08-27T07:58:32.000Z",
//     "lastUpdated": 1725277509,
//   },
//   {
//     "uuid": 364,
//     "address": "erd1fet6nrput6ujj0yf4cj70ex0sldxsf79ruxsucapeuf5k4acmldqwkkgp2",
//     "rankScore": 0,
//     "bondAmount": 522,
//     "livelinessScore": 0,
//     "bitzXp": 0,
//     "vault": "DATANFTFT-e0b917-023b",
//     "vaultImg": "https://devnet-media.elrond.com/nfts/asset/QmNXaJen63E65Qvzc2j4guZ3chUmUUJwtfsyj31gk9317i",
//     "creationTime": "2024-08-23T04:43:32.000Z",
//     "lastUpdated": 1725277504,
//   },
//   {
//     "uuid": 365,
//     "address": "erd1fj4v79xn96ew4fu05e9m2hxzuw0d03txsj7ptn2ls0pa7y56hhksexjhxj",
//     "rankScore": 0,
//     "bondAmount": 380,
//     "livelinessScore": 0,
//     "bitzXp": 0,
//     "vault": "DATANFTFT-e0b917-0243",
//     "vaultImg": "https://devnet-media.elrond.com/nfts/asset/QmVBAHqgRCSWi6ZAH1D4bMBBmsfvsiXLMdngNZQCSTKwb1",
//     "creationTime": "2024-08-27T07:09:44.000Z",
//     "lastUpdated": 1725277507,
//   },
//   {
//     "uuid": 366,
//     "address": "erd1fj4v79xn96ew4fu05e9m2hxzuw0d03txsj7ptn2ls0pa7y56hhksexjhxj",
//     "rankScore": 0,
//     "bondAmount": 380,
//     "livelinessScore": 0,
//     "bitzXp": 0,
//     "vault": "DATANFTFT-e0b917-0245",
//     "vaultImg": "https://devnet-media.elrond.com/nfts/asset/QmVGN1ptYoccudhB66jKvs6puFyaWJp9mmB2MybtEM1nf9",
//     "creationTime": "2024-08-27T07:16:32.000Z",
//     "lastUpdated": 1725277509,
//   },
//   {
//     "uuid": 367,
//     "address": "erd1yz6vqzlv6zw70u2rq5sdljnq59tn2ue879xxrfpyfts4wy09rd0qpnctn8",
//     "rankScore": 0,
//     "bondAmount": 299,
//     "livelinessScore": 0,
//     "bitzXp": 0,
//     "vault": "DATANFTFT-e0b917-0234",
//     "vaultImg": "https://devnet-media.elrond.com/nfts/asset/QmNkuz9Xx9pCibCFxaDwZvnd3KbxYQ7HTWruzpQwonJwsf",
//     "creationTime": "2024-08-22T10:36:26.000Z",
//     "lastUpdated": 1725277500,
//   },
// ];

export const AIWorkforce = () => {
  const [appBootingUp, setAppBootingUp] = useState<boolean>(true);
  const [rankedWorkforce, setRankedWorkforce] = useState<any[]>([]);
  const { address: mxAddress } = useGetAccount();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    async function getDataAndInitGraphData() {
      setAppBootingUp(true);
      const workforceDataList = await getWorkforceData();
      setRankedWorkforce(workforceDataList);
      setAppBootingUp(false);
    }

    getDataAndInitGraphData();
  }, []);

  async function getWorkforceData() {
    const apiResponse = await axios.get(`${backendApi()}/workforce?size=150`);
    const dataResponse = apiResponse.data;

    return dataResponse;
  }

  return (
    <div className="w-[100%] py-2">
      <div id="hero" className="mt-2 pt-3 h-[200px] md:h-[180px] rounded-3xl">
        <div className="flex flex-col h-[100%] justify-center items-center">
          <div className="w-80% md:w-[60%]">
            <h1 className="!text-xl text-center md:!text-2xl">Join the Itheum AI Workforce</h1>
            <h2 className="!text-sm md:!text-xl text-center mt-2">
              Mint Your NFMe ID, Boost Your Liveliness, Farm Staking Rewards and Join the Itheum AI Workforce as a Data Provider
            </h2>
          </div>

          <Link to="https://datadex.itheum.io/nfmeid" target="_blank" className="my-5 text-base hover:!no-underline hover:text-black">
            <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
              Mint NFMe ID Now
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-5 mb-20">
        <div className="flex flex-col justify-center items-center">
          {appBootingUp ? <>Loading</> : <WorkersSnapShotGrid snapShotData={rankedWorkforce} myAddress={mxAddress} />}
        </div>
      </div>
    </div>
  );
};

export const AIWorkforceTopN = ({ showItems }: { showItems?: number }) => {
  const [appBootingUp, setAppBootingUp] = useState<boolean>(true);
  const [rankedWorkforce, setRankedWorkforce] = useState<any[]>([]);

  useEffect(() => {
    async function getDataAndInitGraphData() {
      setAppBootingUp(true);
      const workforceDataList = await getWorkforceData();
      setRankedWorkforce(workforceDataList);
      setAppBootingUp(false);
    }

    getDataAndInitGraphData();
  }, []);

  async function getWorkforceData() {
    const apiResponse = await axios.get(`${backendApi()}/workforce?size=${showItems || 5}`);
    const dataResponse = apiResponse.data;

    return dataResponse;
  }

  return (
    <div className="w-[100%] py-2">
      <div className="mt-1 mb-10">
        <div className="flex flex-col justify-center items-center">{appBootingUp ? <>Loading</> : <WorkersSnapShotGrid snapShotData={rankedWorkforce} />}</div>
      </div>
    </div>
  );
};
