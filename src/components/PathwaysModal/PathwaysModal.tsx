import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGetIsLoggedIn } from "hooks";
import { routeNames } from "routes";
import { MvxBitzDropdown } from "../BitzDropdown/MvxBitzDropdown";

type PathwaysModalProps = {
  showPathwaysModel: boolean;
  handleHidePathwaysModel: any;
};

export const PathwaysModal: React.FC<PathwaysModalProps> = (props) => {
  const { showPathwaysModel, handleHidePathwaysModel } = props;
  const isLoggedInMvx = useGetIsLoggedIn();

  const [pathwaysMenuItem, setPathwaysMenuItem] = useState<number>(1); // 1 datanft, 2 bitz, 3 liveliness, 4 passport, 5 bridge
  const [pathwaysChain, setPathwaysChain] = useState<number>(1); // 1 mvx, 2 sol

  // https://flowbite.com/docs/components/modal/
  return (
    <div
      id="static-modal"
      aria-hidden="true"
      className={`${showPathwaysModel ? "visible" : "hidden"} flex mt-[-50px] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 bg-[#000000d9]`}>
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg dark:bg-[#171717] drop-shadow-[0_0px_100px_rgba(250,250,250,.8)]">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Itheum Pathways</h3>
              <p className="text-[11px] text-gray-900 dark:text-white">Not sure what you can do with Itheum? try the pathways below...</p>
            </div>
            <div role="group" className="rounded-md shadow-sm ms-auto">
              <button
                type="button"
                onClick={() => {
                  setPathwaysChain(1);
                }}
                className={`${pathwaysChain === 1 ? "bg-blue-300 dark:bg-blue-300 text-gray-900 dark:text-gray-900 dark:focus:text-gray-900" : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:focus:text-white"} inline-flex items-center px-4 py-2 text-sm font-medium border rounded-s-lg hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500`}>
                <svg className="w-3 h-3 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                </svg>
                MultiversX
              </button>

              <button
                type="button"
                onClick={() => {
                  setPathwaysChain(2);
                }}
                className={`${pathwaysChain === 2 ? "bg-blue-300 dark:bg-blue-300 text-gray-900 dark:text-gray-900 dark:focus:text-gray-900" : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:focus:text-white"} inline-flex items-center px-4 py-2 text-sm font-medium border rounded-e-lg hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500`}>
                <svg className="w-3 h-3 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                  <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                </svg>
                Solana
              </button>
            </div>
            <button
              type="button"
              className="text-gray-400 ml-2 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={handleHidePathwaysModel}
              data-modal-hide="static-modal">
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5 space-y-4">
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
              <ul
                className="flex flex-wrap -mb-px text-sm font-medium text-center"
                id="default-styled-tab"
                data-tabs-toggle="#default-styled-tab-content"
                data-tabs-active-classes="text-purple-600 hover:text-purple-600 dark:text-purple-500 dark:hover:text-purple-500 border-purple-600 dark:border-purple-500"
                data-tabs-inactive-classes="dark:border-transparent text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300"
                role="tablist">
                <li className="me-2" role="presentation">
                  <button
                    className={`${pathwaysMenuItem === 1 && "border-blue-300"} inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300`}
                    id="datanft-styled-tab"
                    onClick={() => {
                      setPathwaysMenuItem(1);
                    }}
                    data-tabs-target="#styled-datanft"
                    type="button"
                    role="tab"
                    aria-controls="datanft"
                    aria-selected="false">
                    Data NFT
                  </button>
                </li>
                <li className="me-2" role="presentation">
                  <button
                    className={`${pathwaysMenuItem === 2 && "border-blue-300"} inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300`}
                    id="bitzxp-styled-tab"
                    onClick={() => {
                      setPathwaysMenuItem(2);
                    }}
                    data-tabs-target="#styled-bitzxp"
                    type="button"
                    role="tab"
                    aria-controls="bitzxp"
                    aria-selected="false">
                    BiTz XP
                  </button>
                </li>
                <li className="me-2" role="presentation">
                  <button
                    className={`${pathwaysMenuItem === 3 && "border-blue-300"} inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300`}
                    id="liveliness-styled-tab"
                    onClick={() => {
                      setPathwaysMenuItem(3);
                    }}
                    data-tabs-target="#styled-liveliness"
                    type="button"
                    role="tab"
                    aria-controls="liveliness"
                    aria-selected="false">
                    Liveliness
                  </button>
                </li>
                <li role="presentation">
                  <button
                    className={`${pathwaysMenuItem === 4 && "border-blue-300"} inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300`}
                    id="passports-styled-tab"
                    onClick={() => {
                      setPathwaysMenuItem(4);
                    }}
                    data-tabs-target="#styled-passports"
                    type="button"
                    role="tab"
                    aria-controls="passports"
                    aria-selected="false">
                    Passports
                  </button>
                </li>
                <li role="presentation">
                  <button
                    className={`${pathwaysMenuItem === 5 && "border-blue-300"} inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300`}
                    id="bridge-styled-tab"
                    onClick={() => {
                      setPathwaysMenuItem(5);
                    }}
                    data-tabs-target="#styled-bridge"
                    type="button"
                    role="tab"
                    aria-controls="bridge"
                    aria-selected="false">
                    Bridge
                  </button>
                </li>
              </ul>
            </div>
            <div id="default-styled-tab-content">
              <div
                className={`${pathwaysMenuItem === 1 ? "visible" : "hidden"} p-4 rounded-lg bg-gray-50 dark:bg-gray-800 min-h-[300px]`}
                id="styled-datanft"
                role="tabpanel"
                aria-labelledby="profile-tab">
                <div className="bg-green-0 flex p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 min-h-[300px]">
                  {pathwaysChain === 1 ? <DataNFTMultiversX /> : <DataNFTSolana />}
                </div>
              </div>

              <div
                className={`${pathwaysMenuItem === 2 ? "visible" : "hidden"} p-4 rounded-lg bg-gray-50 dark:bg-gray-800 min-h-[300px]`}
                id="styled-bitzxp"
                role="tabpanel"
                aria-labelledby="dashboard-tab">
                <div className="bg-green-0 flex p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 min-h-[300px]">
                  <div className="bg-red-0 grid grid-cols-2 gap-4 mb-4 w-[100%]">
                    <div className="flex items-center justify-center rounded bg-gray-50 dark:bg-gray-800">
                      {isLoggedInMvx ? (
                        <div className="flex flex-col items-center justify-center scale-125">
                          <p className="mb-2">Your BiTx XP:</p>
                          <MvxBitzDropdown skipNavBarPopOverOption={true} />

                          <div onClick={handleHidePathwaysModel}>
                            <MvxBitzDropdown skipNavBarPopOverOption={true} showOnlyClaimBitzButton={true} />
                          </div>
                        </div>
                      ) : (
                        <Link className="" to={routeNames.unlock} onClick={handleHidePathwaysModel}>
                          <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                              Login to Check Your BiTz XP
                            </span>
                          </button>
                        </Link>
                      )}
                    </div>
                    <div className="flex items-center justify-center rounded bg-gray-50 dark:bg-gray-800">
                      <a
                        className="text-center"
                        href="https://docs.itheum.io/product-docs/protocol/itheum-life-liveliness-and-reputation-signalling/bonus-bitz-for-protocol-usage"
                        target="_blank">
                        <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Earn Bonus BiTz
                          </span>
                        </button>
                        <p className="text-[11px] m-auto w-[80%]">Perform certain protocol tasks and earn bonus BiTz</p>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`${pathwaysMenuItem === 3 ? "visible" : "hidden"} p-4 rounded-lg bg-gray-50 dark:bg-gray-800 min-h-[300px]`}
                id="styled-liveliness"
                role="tabpanel"
                aria-labelledby="settings-tab">
                <div className="bg-green-0 flex p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 min-h-[300px]">
                  <div className="bg-red-0 grid grid-cols-1 gap-4 mb-4 w-[100%]">
                    <div className="flex items-center justify-center rounded bg-gray-50 dark:bg-gray-800">
                      <a className="text-center" href="https://datadex.itheum.io" target="_blank">
                        <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Liveliness Staking Rewards
                          </span>
                        </button>
                        <p className="text-[12px] m-auto w-[80%]">Minted Data NFTs? Collect $ITHEUM staking rewards for your Liveliness Bonds</p>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`${pathwaysMenuItem === 4 ? "visible" : "hidden"} p-4 rounded-lg bg-gray-50 dark:bg-gray-800 min-h-[300px]`}
                id="styled-passports"
                role="tabpanel"
                aria-labelledby="contacts-tab">
                <div className="bg-green-0 flex p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 min-h-[300px]">
                  <div className="bg-red-0 grid grid-cols-1 gap-4 mb-4 w-[100%]">
                    <div className="flex items-center justify-center rounded bg-gray-50 dark:bg-gray-800">
                      <a className="text-center" href="https://docs.google.com/forms/d/1-KMVSXtXXDbfXO5GImd8w0yOsqFLWuKGJ2GQMhqfrdc/edit" target="_blank">
                        <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Gamer Passport
                          </span>
                        </button>
                        <p className="text-[12px] m-auto w-[80%]">Sony PlayStation Gamer? Get rewarded $ITHEUM tokens to share your daily gaming data</p>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`${pathwaysMenuItem === 5 ? "visible" : "hidden"} p-4 rounded-lg bg-gray-50 dark:bg-gray-800 min-h-[300px]`}
                id="styled-bridge"
                role="tabpanel"
                aria-labelledby="contacts-tab">
                <div className="bg-green-0 flex p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 min-h-[300px]">
                  <div className="bg-red-0 grid grid-cols-1 gap-4 mb-4 w-[100%]">
                    <div className="flex items-center justify-center rounded bg-gray-50 dark:bg-gray-800">
                      <a className="text-center" href="https://portal.itheum.io" target="_blank">
                        <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            $ITHEUM Token Bridge
                          </span>
                        </button>
                        <p className="text-[12px] m-auto w-[80%]">Bridge $ITHEUM tokens between MultiversX and Solana</p>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function DataNFTMultiversX() {
  return (
    <div className="bg-red-0 grid grid-cols-4 gap-4 mb-4 items-start w-[100%]">
      <div className="flex items-center justify-center rounded bg-gray-50 dark:bg-gray-800">
        <a href="https://datadex.itheum.io/" target="_blank">
          <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Mint Data NFTs
            </span>
          </button>
        </a>
      </div>
      <div className="flex items-center justify-center rounded bg-gray-50 dark:bg-gray-800">
        <div className="text-2xl text-gray-400 dark:text-gray-500">
          <a href="https://datadex.itheum.io/datanfts/marketplace/market" target="_blank">
            <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Buy Data NFTs
              </span>
            </button>
          </a>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            <a
              href="https://datadex.itheum.io/datanfts/marketplace/market"
              target="_blank"
              aria-current="true"
              className="block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
              Data DEX
            </a>
            <a
              href="https://flipix.io/collection/DATANFTFT-e936d4"
              target="_blank"
              className="block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
              FLIPiX
            </a>
            <a
              href="https://xoxno.com/collection/DATANFTFT-e936d4"
              target="_blank"
              className="block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
              XOXNO
            </a>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center rounded bg-gray-50 dark:bg-gray-800">
        <div className="text-2xl text-gray-400 dark:text-gray-500">
          <a href="https://explorer.itheum.io" target="_blank">
            <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Data NFT Apps
              </span>
            </button>
          </a>

          <div className="text-sm font-medium text-gray-900 dark:text-white">
            <a
              href="https://explorer.itheum.io/nftunes"
              target="_blank"
              aria-current="true"
              className="block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
              Music (NFTunes)
            </a>
            <a
              href="https://explorer.itheum.io/trailblazer"
              target="_blank"
              className="block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
              TrailBlazer
            </a>
            <a
              href="https://explorer.itheum.io"
              target="_blank"
              className="block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
              All Apps...
            </a>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center rounded bg-gray-50 dark:bg-gray-800">
        <div className="text-2xl text-gray-400 dark:text-gray-500">
          <a href="https://datadex.itheum.io/datanfts/marketplace/DATANFTFT-e936d4-07/offer-327" target="_blank">
            <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Free Data NFTs!
              </span>
            </button>
          </a>

          <div className="text-sm font-medium text-gray-900 dark:text-white">
            <a
              href="https://datadex.itheum.io/datanfts/marketplace/DATANFTFT-e936d4-07/offer-327"
              target="_blank"
              className="block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
              BiTz XP
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataNFTSolana() {
  return (
    <div className="bg-red-0 grid grid-cols-4 gap-4 mb-4 items-start w-[100%]">
      <div className="flex items-center justify-center rounded bg-gray-50 dark:bg-gray-800">
        <div className="text-2xl text-gray-400 dark:text-gray-500">
          <a href="https://docs.google.com/forms/d/1BbpcZiFaE30ctZJLzBP356RlRfplF-ElnNXSQos0Fuw/edit" target="_blank">
            <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Launch Data NFTs
              </span>
            </button>
          </a>

          <div className="text-sm font-medium text-gray-900 dark:text-white">
            <a
              href="https://docs.google.com/forms/d/1BbpcZiFaE30ctZJLzBP356RlRfplF-ElnNXSQos0Fuw/edit"
              target="_blank"
              aria-current="true"
              className="block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
              Drip Haus
            </a>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center rounded bg-gray-50 dark:bg-gray-800">
        <div className="text-2xl text-gray-400 dark:text-gray-500">
          <a href="https://tensor.trade/trade/itheum_drip" target="_blank">
            <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Buy Data NFTs
              </span>
            </button>
          </a>

          <div className="text-sm font-medium text-gray-900 dark:text-white">
            <a
              href="https://tensor.trade/trade/itheum_drip"
              target="_blank"
              aria-current="true"
              className="block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
              Tensor
            </a>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center rounded bg-gray-50 dark:bg-gray-800">
        <div className="text-2xl text-gray-400 dark:text-gray-500">
          <a href="https://explorer.itheum.io" target="_blank">
            <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Data NFT Apps
              </span>
            </button>
          </a>

          <div className="text-sm font-medium text-gray-900 dark:text-white">
            <a
              href="https://explorer.itheum.io/nftunes"
              target="_blank"
              aria-current="true"
              className="block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
              Music (NFTunes)
            </a>
            <a
              href="https://explorer.itheum.io"
              target="_blank"
              className="block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
              All Apps...
            </a>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center rounded bg-gray-50 dark:bg-gray-800">
        <div className="text-2xl text-gray-400 dark:text-gray-500">
          <a href="https://drip.haus/itheum" target="_blank">
            <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Free Data NFTs!
              </span>
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
