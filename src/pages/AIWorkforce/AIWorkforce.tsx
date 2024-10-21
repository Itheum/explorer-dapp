import React, { useEffect, useState } from "react";
import { useGetAccount } from "@multiversx/sdk-dapp/hooks";
import axios from "axios";
import { Link } from "react-router-dom";
import HelmetPageMeta from "components/HelmetPageMeta";
import { PulseLoader } from "libComponents/animated/PulseLoader";
import { Button } from "libComponents/Button";
import { backendApi } from "libs/backend-api";
import { WorkersSnapShotGrid } from "./SharedComps";

const WORKFORCE_API_PAGE_SIZE = 150;

export const AIWorkforce = () => {
  const [appBootingUp, setAppBootingUp] = useState<boolean>(true);
  const [workforcePageLoading, setWorkforcePageLoading] = useState<boolean>(true);
  const [rankedWorkforce, setRankedWorkforce] = useState<any[]>([]);
  const [workforceFetchedCount, setWorkforceFetchedCount] = useState<number>(0);
  const { address: mxAddress } = useGetAccount();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    async function getDataAndInitGraphData() {
      setAppBootingUp(true);

      await getWorkforceData();

      setAppBootingUp(false);
    }

    getDataAndInitGraphData();
  }, []);

  async function getWorkforceData() {
    setWorkforcePageLoading(true);

    const apiResponse = await axios.get(`${backendApi()}/workforce?size=${WORKFORCE_API_PAGE_SIZE}&from=${workforceFetchedCount}`);
    const workforceDataList = apiResponse.data;

    if (workforceDataList.length > 0) {
      let loadedCount = workforceFetchedCount;
      loadedCount = loadedCount + workforceDataList.length;

      setWorkforceFetchedCount(loadedCount);
      setRankedWorkforce([...rankedWorkforce, ...workforceDataList]);
    }

    setWorkforcePageLoading(false);
  }

  return (
    <>
      <HelmetPageMeta
        title="Itheum AI Data Workforce"
        shortTitle="Itheum AI Data Workforce"
        desc="Mint Your NFMe ID, Boost Your Liveliness, Farm Staking Rewards and Join the Itheum AI Data Workforce as a Data Provider"
        shareImgUrl="https://explorer.itheum.io/socialshare/itheum_aiworkforce_social_hero.png"
      />

      <div className="w-[100%] py-2">
        <div id="hero" className="mt-2 pt-3 h-[230px] rounded-3xl">
          <div className="flex flex-col h-[100%] justify-center items-center">
            <div className="w-80% md:w-[60%]">
              <h1 className="!text-xl text-center md:!text-2xl">Join the Itheum AI Data Workforce</h1>
              <h2 className="!text-sm md:!text-xl text-center mt-2">
                Mint Your NFMe ID, Boost Your Liveliness, Farm Staking Rewards and Join the Itheum AI Data Workforce as a Data Provider
              </h2>
            </div>

            <Link to="https://datadex.itheum.io/nfmeid" target="_blank" className="my-5 text-base hover:!no-underline hover:text-black">
              <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                Mint NFMe ID Now
              </Button>
            </Link>

            <div className="py-1 text-sm relative p-2">
              <span className="hidden md:block absolute flex h-8 w-8 top-0 right-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              </span>
              <p className="text-center md:text-left">Already have a NFMeID with Liveliness? find yourself below - look out for the pulsating orb</p>
            </div>
          </div>
        </div>

        <div className="mt-5 mb-20">
          <div className="flex flex-col justify-center items-center">
            {appBootingUp ? (
              <PulseLoader />
            ) : (
              <>
                <WorkersSnapShotGrid snapShotData={rankedWorkforce} myAddress={mxAddress} />

                <div className="m-auto my-10 flex">
                  <Button
                    className="border-0 text-background rounded-lg font-medium tracking-tight base:!text-sm md:!text-base hover:opacity-80 hover:text-black m-auto"
                    onClick={() => {
                      getWorkforceData();
                    }}
                    disabled={workforceFetchedCount % WORKFORCE_API_PAGE_SIZE > 0 || workforcePageLoading}>
                    {workforceFetchedCount % WORKFORCE_API_PAGE_SIZE === 0 ? "Load more" : "All Loaded"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
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
        <div className="flex flex-col justify-center items-center">
          {appBootingUp ? <PulseLoader /> : <WorkersSnapShotGrid snapShotData={rankedWorkforce} />}
        </div>
      </div>
    </div>
  );
};
