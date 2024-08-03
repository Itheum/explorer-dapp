import React, { useEffect, useState } from "react";
import { faThumbsUp, faHeartCrack } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton, WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import axios from "axios";
import { CartesianGrid, Tooltip, ResponsiveContainer, XAxis, YAxis, AreaChart, Area } from "recharts";
import hero from "assets/img/gamer-passport/gamer-passport-adaptor-hero.png";
import { CopyAddress } from "components/CopyAddress";
import { Button } from "libComponents/Button";
import { getApiWeb2Apps } from "libs/utils";
import { HeaderComponent } from "../../components/Layout/HeaderComponent";
import { LoadingGraph, getAggregatedAnalyticsData } from "../Analytics/AnalyticsShared";

export const GamerPassport = () => {
  const { publicKey } = useWallet();
  const addressSol = publicKey?.toBase58();

  const [dataLakeUserGrowthData, setDataLakeUserGrowthData] = useState<any[]>([]);
  const [dataLakeDataVolumeGrowthData, setDataLakeDataVolumeGrowthData] = useState<any[]>([]);

  // OnBoarding Steps
  const [showActionModalStep1, setShowActionModalStep1] = useState<boolean>(false);
  const [showActionModalStep3, setShowActionModalStep3] = useState<boolean>(false);

  // Step 1
  const [step1InProgress, setStep1InProgress] = useState<boolean>(true);
  const [step1Passed, setStep1Passed] = useState<boolean>(false);
  const [step1PSNUserName, setStep1PSNUserName] = useState<string>("");

  // Step 2
  const [step2InProgress, setStep2InProgress] = useState<boolean>(false);
  const [step2Passed, setStep2Passed] = useState<boolean>(false);
  const [step2SolanaAddress, setStep2SolanaAddress] = useState<string>("");

  // Step 3
  const [step3InProgress, setStep3InProgress] = useState<boolean>(false);
  const [step3Passed, setStep3Passed] = useState<boolean>(false);

  useEffect(() => {
    // window.scrollTo({
    //   top: 0,
    //   behavior: "smooth",
    // });

    async function getDataAndInitGraphData() {
      const dataAggregated = await getAggregatedAnalyticsData();

      // aggregations data
      const dataLakeUserGrowthDataT = [];
      const dataLakeDataVolumeGrowthDataT = [];

      // S: load aggregated data
      for (const day of Object.keys(dataAggregated)) {
        const dataLakeUserGrowthDataI: any = { name: day };
        const dataLakeDataVolumeGrowthDataI: any = { name: day };

        for (const nft of Object.keys(dataAggregated[day])) {
          switch (nft) {
            case "data_lake_metrics":
              dataLakeUserGrowthDataI["totalUsers"] = dataAggregated[day][nft]["totalUsers"];
              dataLakeDataVolumeGrowthDataI["totalBytes"] = dataAggregated[day][nft]["totalBytes"];

              dataLakeUserGrowthDataT.push(dataLakeUserGrowthDataI);
              dataLakeDataVolumeGrowthDataT.push(dataLakeDataVolumeGrowthDataI);
              break;
            default:
              console.log("default case hit");
              break;
          }
        }
      }

      setDataLakeUserGrowthData(dataLakeUserGrowthDataT);
      setDataLakeDataVolumeGrowthData(dataLakeDataVolumeGrowthDataT);
      // E: load aggregated data
    }

    getDataAndInitGraphData();
  }, []);

  useEffect(() => {
    // is user logged into Solana?
    if (!addressSol) {
      setStep2Passed(false);
      setStep2SolanaAddress("");
    } else {
      setStep2Passed(true);
      setStep2SolanaAddress(addressSol);
    }
  }, [addressSol]);

  return (
    <HeaderComponent pageTitle={""} subTitle={""} hasImage={false}>
      <div className="w-[100%] bg-green-000">
        <div id="hero" className="mt-10 bg-red-000 h-[500px] bg-no-repeat bg-contain bg-top bg-fixed rounded-3xl" style={{ "backgroundImage": `url(${hero})` }}>
          <div className="flex flex-col bg-red-000 h-[100%] justify-center items-center">
            <h1 className="">Gamer Passport</h1>
            <h2 className="!text-xl w-[500px] text-center mt-2">Play games like you normally do and earn monthly rewards for sharing your gaming data</h2>
          </div>
        </div>

        <div id="data-stats" className="mt-10">
          <h2 className="!text-3xl text-center">Plug into the Gaming Data Realm</h2>
          <p className="opacity-50 text-center mt-2 mb-5">
            The Itheum Data Realm is a bulk pool of 'Passive' Data collected from users, the realm will be populated by various forms of data but it is
            currently actively being populated by gaming data. Data Coalition DAOs broker the trade of the bulk data and share earnings with users who
            contribute their data to the pool.
          </p>
          <div className="mt-10 bg-red-000 flex flex-col md:flex-row">
            {/* Data Lake Passive Data Collected From Users Growth */}
            <div className="flex-1">
              <h2 className="!text-xl text-center">Gamers Plugged-In</h2>
              <div className="min-h-[300px]">
                {(dataLakeUserGrowthData.length > 0 && (
                  <ResponsiveContainer minWidth={"100%"} height={300} style={{ marginBottom: "2.5rem" }}>
                    <AreaChart data={dataLakeUserGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#006ee4" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#006ee4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" />
                      <YAxis hide />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip formatter={(value, name) => [value, "Users"]} wrapperStyle={{ color: "#333" }} />
                      <Area
                        connectNulls
                        animationDuration={3000}
                        animationEasing="ease-in"
                        type="monotone"
                        dataKey="totalUsers"
                        stroke="#006ee4"
                        fillOpacity={1}
                        fill="url(#colorUv)"
                        stackId={1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )) || <LoadingGraph />}
              </div>
            </div>

            {/* Data Lake Data Collected Volume Growth (Bytes) */}
            <div className="flex-1">
              <h2 className="!text-xl text-center">Gaming Data Volume (Bytes)</h2>
              <div className="min-h-[300px]">
                {(dataLakeDataVolumeGrowthData.length > 0 && (
                  <ResponsiveContainer minWidth={"100%"} height={300} style={{ marginBottom: "2.5rem" }}>
                    <AreaChart data={dataLakeDataVolumeGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <XAxis dataKey="name" />
                      <YAxis label="Total Volume (Bytes)" hide />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip formatter={(value, name) => [value, "Data Collected (in Bytes)"]} wrapperStyle={{ color: "#333" }} />
                      <Area
                        connectNulls
                        animationDuration={3000}
                        animationEasing="ease-in"
                        type="monotone"
                        dataKey="totalBytes"
                        stroke="#006ee4"
                        fillOpacity={1}
                        fill="url(#colorUv)"
                        stackId={1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )) || <LoadingGraph />}
              </div>
            </div>
          </div>

          <div className="mt-2 bg-red-000 flex flex-col justify-around space-x-4 md:flex-row">
            <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] bg-red-000 flex-1 h-[200px]">
              <p className="text-3xl">Supported Platforms</p>
              <p className="text-2xl mt-1">Live: PlayStation</p>
              <p className="text-xl mt-1 opacity-50">Coming: XBOX, Steam</p>
            </div>
            <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] bg-red-000 flex-1 h-[200px]">
              <p className="text-3xl">Reward Pool</p>
              <p className="text-4xl mt-2">1,000,000 ITHEUM</p>
            </div>
            <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] bg-red-000 flex-1 h-[200px]">
              <p className="text-3xl">Rewards Emitted</p>
              <p className="text-4xl mt-2">0</p>
            </div>
          </div>
        </div>

        <div id="join-process" className="mt-10">
          <h2 className="!text-3xl text-center">Joining is simple as 1-2-3</h2>
          <p className="opacity-50 text-center mt-2 mb-5">Check if you are eligible, login with your Google Account and you're in! Told you it's easy...</p>

          <div className="mt-2 bg-red-000 flex flex-col justify-around space-x-4 md:flex-row">
            <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] bg-red-000 flex-1 h-[250px]">
              <p className="text-3xl">1.</p>
              {step1Passed ? (
                <>
                  <FontAwesomeIcon fade={true} color="#4691e2" icon={faThumbsUp} size="3x" className="m-2" />
                  <p className="text-md w-[80%] text-center">
                    W00T, you passed the eligibility step with your PlayStation Username <span className="text-[#4691e2]">{step1PSNUserName}</span>
                  </p>
                </>
              ) : (
                <>
                  <p className="text-md w-[80%] text-center">We are currently onboarding PlayStation Gamers, do you plan bruh? check your eligibility</p>
                  <div
                    onClick={() => {
                      setShowActionModalStep1(true);
                    }}>
                    <ActionButton mlAdjustment={"-ml-10"} btnText="Check Eligibility" disableBtn={!step1InProgress} />
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] bg-red-000 flex-1 h-[250px]">
              <p className="text-3xl">2.</p>
              {step2Passed ? (
                <>
                  <FontAwesomeIcon fade={true} color="#4691e2" icon={faThumbsUp} size="3x" className="m-2" />
                  <div className="text-md w-[80%] flex flex-col items-center mb-5">
                    <p className="mb-2">W00T, you passed this step, your solana address is </p>
                    <span className="text-[#4691e2]">{<CopyAddress address={step2SolanaAddress} precision={6} />}</span>
                  </div>
                  <WalletDisconnectButton>Disconnect Wallet</WalletDisconnectButton>
                </>
              ) : (
                <>
                  <p className="text-md w-[80%] text-center mb-5">
                    Create or link a Solana wallet. Hate crypto wallets? No worries, use your Google account via TipLink
                  </p>
                  <WalletMultiButton>Phantom or Google via TipLink</WalletMultiButton>
                </>
              )}
            </div>
            <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] bg-red-000 flex-1 h-[250px]">
              <p className="text-3xl">3.</p>
              {step3Passed ? (
                <>
                  <FontAwesomeIcon fade={true} color="#4691e2" icon={faThumbsUp} size="3x" className="m-2" />
                  <p className="text-md w-[80%] text-center">W00T, your application is being reviewed bruh!</p>
                </>
              ) : (
                <>
                  <p className="text-md w-[80%] text-center">
                    We don't handle any sensitive data, but we still need to make your read some boring terms of use (sorry)
                  </p>
                  <div
                    onClick={() => {
                      setShowActionModalStep3(true);
                    }}>
                    <ActionButton mlAdjustment={"-ml-20"} btnText="Agree and Join" disableBtn={!step3InProgress} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div id="benefits" className="mt-10">
          <h2 className="!text-3xl text-center">Why should you join?</h2>
          <p className="opacity-50 text-center mt-2 mb-5">
            Cause gaming data ownership is the future! blah blah blah... but seriously, there are some cool perks!
          </p>
          <div className="mt-2 bg-red-000 flex flex-col justify-around space-x-4 md:flex-row">
            <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] bg-red-000 flex-1 h-[200px]">
              <p className="text-2xl w-[80%] text-center">Compare Yourself to Other Top Gamers</p>
              <p className="text-md w-[80%] text-center">Compare your performance to other gamers, see what other gamers like you are playing etc</p>
            </div>
            <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] bg-red-000 flex-1 h-[200px]">
              <p className="text-2xl w-[80%] text-center">Seamless! Works in the "Background"</p>
              <p className="text-md w-[80%] text-center">
                You data is collected passively, so you don't need to do anything! Just play games like you normally do
              </p>
            </div>
            <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] bg-red-000 flex-1 h-[200px]">
              <p className="text-2xl w-[80%] text-center">Earn $ITHEUM Rewards based on Data Volume</p>
              <p className="text-md w-[80%] text-center">
                Your data is valuable, earn rewards for being active on your gaming platform. More playing + more data = more rewards!
              </p>
            </div>
          </div>
        </div>

        <div id="how-it-works" className="mt-10">
          <h2 className="!text-2xl text-center">I earn rewards for my gaming data? What VOODOO is this?!</h2>
          <p className="opacity-50 text-center mt-2 mb-5">
            Yes, your data is valuable and it is exploited by big corporations, Itheum wants to break this cycle... here is how the "VOODOO" works under the
            hood:
          </p>

          <div className="mt-2 bg-red-000 flex flex-col justify-around space-x-4 md:flex-row">
            <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] bg-red-000 flex-1 h-[200px]">
              <p className="text-2xl w-[80%] text-center">Itheum Data Realm</p>
              <p className="text-md w-[80%] text-center">
                We are currently populating our Data Realm with your passive gaming data. This is the phase we are at now, in return for your data, we emit
                ITHEUM rewards from the protocol
              </p>
            </div>
            <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] bg-red-000 flex-1 h-[200px]">
              <p className="text-2xl w-[80%] text-center">Data Coalition DAO</p>
              <p className="text-md w-[80%] text-center">
                Once the data realm reaches an optimum level, a Data Coalition DAO (DC DAO) will be appointed to oversee the massive bulk pool of data
              </p>
            </div>
            <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] bg-red-000 flex-1 h-[200px]">
              <p className="text-2xl w-[80%] text-center">Broker Trade the Bulk Data</p>
              <p className="text-md w-[80%] text-center">
                The DC DAO will represent you and bulk trade your data with AI companies. All earning are shared with the users who provided the data
              </p>
            </div>
          </div>
        </div>

        <div id="FAQ" className="mt-10">
          <h2 className="!text-2xl text-center">FAQ</h2>
          <p className="opacity-50 text-center mt-2 mb-5">I'm sure you have many questions so here is a list of common ones</p>
        </div>

        <div id="footer" className="mt-10 p-10"></div>

        <ActionModalStep1
          showActionModel={showActionModalStep1}
          handleHideActionModel={() => setShowActionModalStep1(false)}
          handleStep1Passed={(val: boolean) => {
            setStep1Passed(val);

            // user may already be logged in, so after step 1 -> step 3
            if (!step2Passed) {
              setStep2InProgress(true);
            } else {
              setStep3InProgress(true);
            }
          }}
          handleStep1PSNUserName={setStep1PSNUserName}
        />

        <ActionModalStep3
          step1PSNUserName={step1PSNUserName}
          step2SolanaAddress={step2SolanaAddress}
          showActionModel={showActionModalStep3}
          handleHideActionModel={() => setShowActionModalStep3(false)}
          handleStep3Passed={(val: boolean) => {
            setStep3Passed(val);
          }}
        />
      </div>
    </HeaderComponent>
  );
};

const ActionModalStep1 = (props: any) => {
  const { showActionModel, handleHideActionModel } = props;
  const { handleStep1Passed, handleStep1PSNUserName } = props;

  const [psnUserName, setPsnUserName] = useState<string>("");
  const [eligibilityCheckLoading, setEligibilityCheckLoading] = useState<boolean>(false);
  const [eligibilityCheckStepDone, setEligibilityCheckStepDone] = useState<boolean>(false);
  const [eligibilityUserNameTaken, setEligibilityUserNameTaken] = useState<boolean>(false);
  const [eligibilityUserNameNotSuitable, setEligibilityUserNameNotSuitable] = useState<boolean>(false);

  async function checkEligibilityViaAPI() {
    setEligibilityCheckLoading(true);

    const checkRes = await axios.get(`${getApiWeb2Apps()}/datadexapi/gamepassport/checkEligibility/${psnUserName}`);
    const eligibilityDecision = checkRes.data;

    console.log(eligibilityDecision);

    setEligibilityCheckStepDone(true);
    setEligibilityCheckLoading(false);

    if (eligibilityDecision.userNameExists) {
      setEligibilityUserNameTaken(true);
    } else if (!eligibilityDecision.accountIdGood || !eligibilityDecision.titlesGood || !eligibilityDecision.presenceGood) {
      setEligibilityUserNameNotSuitable(true);
    } else {
      handleStep1Passed(true);
      handleStep1PSNUserName(psnUserName);
      handleHideActionModel();
    }
  }

  return (
    <div
      id="static-modal"
      aria-hidden="true"
      className={`${showActionModel ? "visible" : "hidden"} flex mt-[-50px] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 bg-[#000000d9]`}>
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg dark:bg-[#171717] drop-shadow-[0_0px_100px_rgba(250,250,250,.8)]">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Check Eligibility</h3>
            <div>
              <button
                type="button"
                className="text-gray-400 ml-2 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={handleHideActionModel}
                data-modal-hide="static-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
          </div>
          <div className="p-5 min-h-[400px]">
            {!eligibilityCheckStepDone && (
              <>
                <div>
                  <p>We are currently onboarding PlayStation gamers who has an eligible PSN account.</p>
                  <p className="font-bold underline mt-5">Eligibility Criteria</p>
                  <ol>
                    <li>1. A (PlayStation) PSN account</li>
                    <li>2. Have reasonable gaming activity and data sharing settings on your account</li>
                  </ol>
                </div>
                <div className="mt-8">
                  <p className="font-bold underline mt-5">Enter your PSN (PlayStation Network) username</p>
                  <input
                    type="string"
                    value={psnUserName}
                    onChange={(e) => setPsnUserName(e.target.value)}
                    className="text-black p-2 w-[250px] rounded-sm mt-2"
                    placeholder="foo_bar"
                  />
                  <p className="text-sm text-red-400 mt-3">
                    * Make sure you enter YOUR username as you will be asked to provide ownership of it to claim your rewards! Bruh, we will find out!
                  </p>
                  <div
                    onClick={() => {
                      if (!eligibilityCheckLoading) {
                        checkEligibilityViaAPI();
                      }
                    }}>
                    <ActionButton
                      btnText={eligibilityCheckLoading ? "ET Calling Home..." : "Check Eligibility"}
                      disableBtn={psnUserName.trim().length > 2 && !eligibilityCheckLoading ? false : true}
                    />
                  </div>
                </div>
              </>
            )}

            {eligibilityCheckStepDone && eligibilityUserNameTaken && (
              <>
                <FontAwesomeIcon fade={true} color="#4691e2" icon={faHeartCrack} size="3x" className="m-2" />
                <p className="text-lg font-bold">That username is taken!</p>
                <p className="mt-2">
                  That's weird, PSN username <span className="text-[#4691e2]">{psnUserName}</span> has already joined. Is this your username? if so, head over
                  to our{" "}
                  <a className="!text-[#7a98df] hover:underline" href="https://itheum.io/discord" target="blank">
                    discord
                  </a>{" "}
                  and raise the issue and once you prove ownership of your PSN account, we can transfer ownership to you! Or, if you mistyped your username,{" "}
                  <span
                    className="text-[#7a98df] hover:underline cursor-pointer"
                    onClick={() => {
                      setEligibilityCheckStepDone(false);
                      setEligibilityUserNameTaken(false);
                      setEligibilityUserNameNotSuitable(false);
                    }}>
                    try again here
                  </span>
                </p>
              </>
            )}

            {eligibilityCheckStepDone && eligibilityUserNameNotSuitable && (
              <>
                <FontAwesomeIcon fade={true} color="#4691e2" icon={faHeartCrack} size="3x" className="m-2" />
                <p className="text-lg font-bold">That username is not suitable!</p>
                <p className="mt-2">
                  PSN username <span className="text-[#4691e2]">{psnUserName}</span> cannot be found or does not produce any gaming data that we can use. Are
                  you sure you got the username right? if so, head over to our{" "}
                  <a className="!text-[#7a98df] hover:underline" href="https://itheum.io/discord" target="blank">
                    discord
                  </a>{" "}
                  and raise the issue and we can investigate! Or, if you mistyped your username,{" "}
                  <span
                    className="text-[#7a98df] hover:underline cursor-pointer"
                    onClick={() => {
                      setEligibilityCheckStepDone(false);
                      setEligibilityUserNameTaken(false);
                      setEligibilityUserNameNotSuitable(false);
                    }}>
                    try again here
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionModalStep3 = (props: any) => {
  const { showActionModel, handleHideActionModel } = props;
  const { step1PSNUserName, step2SolanaAddress, handleStep3Passed } = props;

  const [userSaveToLogAttempted, setUserSaveToLogAttempted] = useState<boolean>(false);
  const [userSavedToLog, setUserSavedToLog] = useState<boolean>(false);
  const [userSavedToLogError, setUserSavedToLogError] = useState<boolean>(false);
  const [saveToLogLoading, setSaveToLogLoading] = useState<boolean>(false);

  async function saveUserToLogViaAPI() {
    setSaveToLogLoading(true);

    const checkRes = await axios.post(`${getApiWeb2Apps()}/datadexapi/gamepassport/addNewUserToLog`, {
      "psnUsername": step1PSNUserName,
      "solAddress": step2SolanaAddress,
      "solSignature": "solSignature",
    });

    setSaveToLogLoading(false);
    setUserSaveToLogAttempted(true);

    const saveResponse = checkRes.data;
    console.log(saveResponse);

    if (saveResponse.success) {
      setUserSavedToLog(true);
    } else {
      setUserSavedToLogError(true);
    }
  }

  return (
    <div
      id="static-modal-3"
      aria-hidden="true"
      className={`${showActionModel ? "visible" : "hidden"} flex mt-[-50px] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 bg-[#000000d9]`}>
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg dark:bg-[#171717] drop-shadow-[0_0px_100px_rgba(250,250,250,.8)]">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Agree to Terms and Join</h3>
            <div>
              <button
                type="button"
                className="text-gray-400 ml-2 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={handleHideActionModel}
                data-modal-hide="static-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
          </div>
          <div className="p-5 min-h-[400px]">
            {!userSaveToLogAttempted && (
              <>
                <div>
                  <p className="font-bold italic opacity-80">
                    Itheum is all about empowering you with data ownership! so we want to be fully transparent on how you data is collected and used. (it would
                    be ironic if we don't right?). Everything you need to know about your data is below:
                  </p>
                </div>
                <div className="mt-4">
                  <p className="font-bold underline">Please read and agree to the following terms</p>
                  <ol className="mt-2">
                    <li>1. You are using YOUR PSN username (no rewards if you don't! we will find out)</li>
                    <li>
                      2. You consent to us storing your PSN username and data securely{" "}
                      <a
                        className="!text-[#7a98df] hover:underline"
                        href="https://docs.itheum.io/product-docs/legal/ecosystem-tools-terms/gamer-passport/playstation/your-data"
                        target="blank">
                        as detailed here
                      </a>
                    </li>
                    <li>
                      3. All{" "}
                      <a
                        className="!text-[#7a98df] hover:underline"
                        href="https://docs.itheum.io/product-docs/legal/ecosystem-tools-terms/gamer-passport/playstation/terms"
                        target="blank">
                        these other terms
                      </a>
                    </li>
                  </ol>
                </div>
                <div className="mt-4">
                  <p className="font-bold underline">Your Details</p>
                  <p>PSN Username : {step1PSNUserName}</p>
                  <p>Solana Address : {step2SolanaAddress}</p>
                </div>
                <div className="mt-8">
                  <div
                    onClick={() => {
                      if (!saveToLogLoading) {
                        saveUserToLogViaAPI();
                      }
                    }}>
                    <ActionButton
                      btnText={saveToLogLoading ? "ET Calling Home..." : "Let me in already, I agree to terms and want to join!"}
                      disableBtn={!saveToLogLoading ? false : true}
                    />
                  </div>
                </div>
              </>
            )}

            {userSavedToLog && (
              <>
                <FontAwesomeIcon fade={true} color="#4691e2" icon={faThumbsUp} size="3x" className="m-2" />
                <p className="text-lg font-bold">Your details have been submitted and are being reviewed by our BOTs (unpaid interns).</p>
                <p className="mt-2">
                  If all is good (most likely yes), you will be added to the program. Reach out to us on{" "}
                  <a className="!text-[#7a98df] hover:underline" href="https://itheum.io/discord" target="blank">
                    discord
                  </a>{" "}
                  should you have any questions.
                </p>
                <div className="mt-8">
                  <div
                    onClick={() => {
                      handleStep3Passed(true);
                      handleHideActionModel();
                    }}>
                    <ActionButton btnText={"Close This"} />
                  </div>
                </div>
              </>
            )}

            {userSavedToLogError && (
              <>
                <FontAwesomeIcon fade={true} color="#4691e2" icon={faHeartCrack} size="3x" className="m-2" />
                <p className="text-lg font-bold">Could not complete the application!</p>
                <p className="mt-2">
                  That's weird, something broke somewhere and someone will be fired. Please reach out to us on{" "}
                  <a className="!text-[#7a98df] hover:underline" href="https://itheum.io/discord" target="blank">
                    discord
                  </a>{" "}
                  and we will investigate.
                  <div className="mt-8">
                    <div
                      onClick={() => {
                        handleHideActionModel();
                      }}>
                      <ActionButton btnText={"Close This"} />
                    </div>
                  </div>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ mlAdjustment, btnText, disableBtn }: { mlAdjustment?: string; btnText: string; disableBtn?: boolean }) => {
  return (
    <div className={`pt-5 ${mlAdjustment ? mlAdjustment : ""}`}>
      <div className={`w-[7.5rem] relative bg-gradient-to-r from-[#006ee4] to-blue-200 px-[1px] py-[1px] rounded-md ${disableBtn ? "bg-none" : ""}`}>
        <div className="bg-background rounded-md">
          <Button
            disabled={!!disableBtn}
            className="text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-[#006ee4] to-blue-200 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
            {btnText}
          </Button>
        </div>
      </div>
    </div>
  );
};
