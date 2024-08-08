import React, { useEffect, useState } from "react";
import { faThumbsUp, faHeartCrack, faHourglassStart, faBatteryQuarter, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton, WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import axios from "axios";
import moment from "moment-timezone";
import hero from "assets/img/gamer-passport/gamer-passport-adaptor-hero.png";
import { CopyAddress } from "components/CopyAddress";
import FAQAccordion from "components/FAQAccordion/FAQAccordion";
import { HeaderComponent } from "components/Layout/HeaderComponent";
import { Button } from "libComponents/Button";
import { itheumSolPreaccess } from "libs/sol/SolViewData";
import { scrollToSection } from "libs/utils";
import { getApiWeb2Apps } from "libs/utils";
import { ActionModalStep1, ActionModalStep3 } from "./ActionModals";
import { ActionButton, GameTitleSnapShotGrid, VolumeChartAnalytics, faqList } from "./SharedComps";
import { getAggregatedAnalyticsData } from "../Analytics/AnalyticsShared";

export const GamerPassport = () => {
  const { publicKey, signMessage } = useWallet();
  const addressSol = publicKey?.toBase58();

  const [appBootingUp, setAppBootingUp] = useState<boolean>(true); // is the app booting up? logged in vs non-logged in
  const [dataLakeUserGrowthData, setDataLakeUserGrowthData] = useState<any[]>([]);
  const [dataLakeDataVolumeGrowthData, setDataLakeDataVolumeGrowthData] = useState<any[]>([]);

  // user profile data
  const [userInReview, setUserInReview] = useState<boolean>(false);
  const [userInDataCollection, setUserInDataCollection] = useState<boolean>(false);
  const [userCurrViewData, setUserCurrViewData] = useState<any>(null);
  const [snapShotData, setSnapShotData] = useState<any[]>([]);
  const [userCurrViewDataLoading, setUserCurrViewDataLoading] = useState<boolean>(false);
  const [userCurrViewDataError, setUserCurrViewError] = useState<string>("");

  // OnBoarding Steps
  const [showActionModalStep1, setShowActionModalStep1] = useState<boolean>(false);
  const [showActionModalStep3, setShowActionModalStep3] = useState<boolean>(false);

  // Step 1
  const [step1InProgress] = useState<boolean>(true);
  const [step1Passed, setStep1Passed] = useState<boolean>(false);
  const [step1PSNUserName, setStep1PSNUserName] = useState<string>("");
  const [step1PSNEligibilityCheckResults, setStep1EligibilityCheckResults] = useState<string>("");

  // Step 2
  const [step2Passed, setStep2Passed] = useState<boolean>(false);
  const [step2SolanaAddress, setStep2SolanaAddress] = useState<string>("");

  // Step 3
  const [step3InProgress, setStep3InProgress] = useState<boolean>(false);
  const [step3Passed, setStep3Passed] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

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
      setStep3InProgress(false);
      setAppBootingUp(false); // if user is NOT logged in, at this point the app is "booted in"
    } else {
      if (!step1Passed) {
        // wallet connected; check if this is a user ALREADY joined an setup onboarding form if needed
        // ... only do this if user is NOT in the middle on onboarding and just completed step 1
        // ... or else, if the connect a wallet they used before it breaks
        checkIfUserHasJoined();
      } else {
        setStep2Passed(true);
        setStep2SolanaAddress(addressSol);
        setStep3InProgress(true);
      }
    }
  }, [addressSol]);

  useEffect(() => {
    if (addressSol && userInDataCollection) {
      // reset the logged in user state, as the user may have swapped wallets
      setUserCurrViewData(null);
      setSnapShotData([]);
      setUserCurrViewError("");

      getUserDataForActiveUser();
    }
  }, [addressSol, userInDataCollection]);

  async function checkIfUserHasJoined() {
    if (addressSol) {
      try {
        const checkRes = await axios.get(`${getApiWeb2Apps()}/datadexapi/gamepassport/checkIfSolAddressJoined/${addressSol}`);
        const joinedDecision = checkRes.data;

        if (joinedDecision.success) {
          if (joinedDecision.inReview) {
            setUserInReview(true);
          } else if (joinedDecision.inDataCollection) {
            setUserInDataCollection(true);
          }
        } else {
          // if NOT, user is new - then setup the form variables to onboard them as flag that the wallet is connected
          setStep2Passed(true);
          setStep2SolanaAddress(addressSol);
          setStep3InProgress(true);
        }
      } catch (e) {
        // if NOT, user is new - then setup the form variables to onboard them as flag that the wallet is connected
        setStep2Passed(true);
        setStep2SolanaAddress(addressSol);
        setStep3InProgress(true);
      }
    }

    setAppBootingUp(false); // if user is logged in, at this point the app is "booted in"
  }

  const getUserDataForActiveUser = async () => {
    setUserCurrViewDataLoading(true);

    // S: TESTING LOCAL
    // setUserCurrViewData(FOO);

    // const snapshotDataTitleCollection = FOO.currentView.title_stats.map((title: any) => {
    //   return {
    //     image_url: title.image_url,
    //     name: title.name,
    //     play_count: title.play_count,
    //     play_time: title.play_time,
    //   };
    // });

    // console.log("snapshotDataTitleCollection");
    // console.log(snapshotDataTitleCollection);

    // setSnapShotData(snapshotDataTitleCollection);
    // E: TESTING LOCAL

    // get signature
    const preAccessNonce = await itheumSolPreaccess();
    const message = new TextEncoder().encode(preAccessNonce);

    if (signMessage === undefined) {
      throw new Error("signMessage is undefined");
    }

    const signature = await signMessage(message);
    const encodedSignature = Buffer.from(signature).toString("hex");

    try {
      const checkRes = await axios.post(`${getApiWeb2Apps()}/datadexapi/gamepassport/getUserLogByAddress`, {
        "solAddress": addressSol,
        "signatureNonce": preAccessNonce,
        "solSignature": encodedSignature,
      });

      const fetchResponse = checkRes.data;

      if (fetchResponse.error || fetchResponse.success === false) {
        setUserCurrViewError(fetchResponse.errMsg);
      } else {
        setUserCurrViewData(fetchResponse);

        const snapshotDataTitleCollection = fetchResponse.currentView.title_stats.map((title: any) => {
          return {
            image_url: title.image_url,
            name: title.name,
            play_count: title.play_count,
            play_time: title.play_time,
          };
        });

        setSnapShotData(snapshotDataTitleCollection);
      }
    } catch (err: any) {
      const fetchResponse = err.response.data;
      if (fetchResponse.error || !fetchResponse.success) {
        setUserCurrViewError(fetchResponse.errMsg);
      }
    }

    setUserCurrViewDataLoading(false);
  };

  return (
    <HeaderComponent pageTitle={""} subTitle={""} hasImage={false}>
      <div className="w-[100%]">
        <div
          id="hero"
          className="mt-2 h-[200px] md:h-[400px] bg-no-repeat bg-cover md:bg-contain bg-top md:bg-fixed rounded-3xl"
          style={{ "backgroundImage": `url(${hero})` }}>
          <div className="flex flex-col h-[100%] justify-center items-center">
            <h1 className="!text-white !text-2xl text-center md:!text-3xl">Gamer Passport</h1>
            <h2 className="!text-white !text-lg md:!text-xl md:w-[500px] text-center mt-2">Play your games, share your data, and score monthly rewards!</h2>
            {!userInDataCollection && !userInReview && (
              <div className="w-[7.5rem] relative bg-gradient-to-r from-yellow-300 to-orange-500 px-[1px] py-[1px] rounded-md justify-center mt-5">
                <div className="bg-background rounded-md">
                  <Button
                    onClick={() => scrollToSection("join-process")}
                    className="!text-black text-sm tracking-tight relative px-[2.35rem] left-2 bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
                    Sign Up
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {appBootingUp && (
          <>
            <div className="flex flex-col justify-center items-center mt-10 min-h-[300px]">
              <FontAwesomeIcon spin={true} color="#4691e2" icon={faSpinner} size="3x" className="m-2" />
              <p className="mt-2">App booting up...</p>
            </div>
          </>
        )}

        {((!appBootingUp && userInReview) || userInDataCollection) && (
          <div id="logged-in-dashboard" className="mt-10 p-4 min-h-[250px] rounded-lg">
            <h2 className="!text-3xl text-center">Welcome Back, Gamer</h2>

            {userInReview && (
              <div id="in-review" className="flex flex-col justify-center items-center">
                <p className="text-lg text-center mt-5 mb-5 w-[60%]">
                  Your submission was received and is being reviewed, should be approved soon if all is good. has it been over a week since you submitted? if
                  so, head over to our{" "}
                  <a className="!text-[#7a98df] hover:underline" href="https://itheum.io/discord" target="blank">
                    discord
                  </a>{" "}
                  and we can assist to speed things up.
                </p>
                <FontAwesomeIcon fade={true} color="#4691e2" icon={faHourglassStart} size="3x" className="m-2" />
              </div>
            )}

            {userInDataCollection && (
              <div id="my-data-snapshot" className="flex flex-col justify-center items-center">
                <div className="flex flex-col justify-center items-center">
                  {userCurrViewDataError && (
                    <div className="flex flex-col justify-center items-center mt-10">
                      <FontAwesomeIcon fade={true} color="#4691e2" icon={faHeartCrack} size="3x" className="m-2" />
                      <p className="mt-2 bg-blue-300 p-4 rounded-sm">{userCurrViewDataError}</p>
                    </div>
                  )}

                  {userCurrViewDataLoading && (
                    <div className="flex flex-col justify-center items-center mt-10">
                      <FontAwesomeIcon spin={true} color="#4691e2" icon={faSpinner} size="3x" className="m-2" />
                      <p className="mt-2">Getting your last data snapshot...</p>
                    </div>
                  )}

                  {!userCurrViewDataLoading && userCurrViewData !== null && (
                    <>
                      <div className="flex flex-col justify-center items-center mt-2">
                        <h3 className="!text-2xl text-center">You are plugged into the Gaming Data Realm</h3>
                      </div>

                      <div className="mt-10 flex flex-col md:flex-row w-[100%]">
                        <VolumeChartAnalytics
                          dataLakeUserGrowthData={dataLakeUserGrowthData}
                          dataLakeDataVolumeGrowthData={dataLakeDataVolumeGrowthData}
                          dataVolumeGamerReferenceBytes={userCurrViewData.totalBytes}
                        />
                      </div>

                      <div className="mt-2 flex flex-col justify-around space-y-2 md:space-y-0 md:space-x-4 md:flex-row w-[100%]">
                        <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] rounded-3xl flex-1 h-[150px] p-3 md:p-0">
                          <p className="text-xl">Last Snapshot</p>
                          <p className="text-lg mt-1 opacity-50">{moment(userCurrViewData.updatedOn).format("LLLL")}</p>
                        </div>
                        <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] rounded-3xl flex-1 h-[150px] p-3 md:p-0">
                          <p className="text-xl">Data Volume Contributed (bytes)</p>
                          <p className="text-xl mt-2">{userCurrViewData.totalBytes.toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] rounded-3xl flex-1 h-[150px] p-3 md:p-0">
                          <p className="text-xl">Your $ITHEUM Rewards</p>
                          <FontAwesomeIcon fade={true} color="#4691e2" icon={faBatteryQuarter} size="3x" className="m-2" />
                          <p className="">Charging...</p>
                        </div>
                      </div>

                      <div className="flex flex-col justify-center items-center mt-10">
                        <p className="mt-2 mb-5">Here is the last snapshot of the games you are playing...</p>
                        <GameTitleSnapShotGrid snapShotData={[...snapShotData]} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {!appBootingUp && !userInDataCollection && !userCurrViewDataLoading && (
          <div id="non-logged-in-landing">
            <div id="intr-and-data-stats" className="mt-10">
              <h2 className="!text-3xl text-center">Plug into the Gaming Data Realm</h2>
              <p className="opacity-50 text-center mt-2 mb-5">
                The Itheum Data Realm is a big pool of 'Passive' Data from users, mainly filled with gaming data right now. Data Coalition DAOs handle the trade
                and share the earnings with the users who contribute.
              </p>
              <div className="mt-10 flex flex-col md:flex-row">
                <VolumeChartAnalytics dataLakeUserGrowthData={dataLakeUserGrowthData} dataLakeDataVolumeGrowthData={dataLakeDataVolumeGrowthData} />
              </div>

              <div className="mt-2 flex flex-col justify-around space-y-2 md:space-y-0 md:space-x-4 md:flex-row">
                <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] rounded-3xl flex-1 h-[200px] p-3 md:p-0">
                  <p className="md:text-2xl">Supported Platforms</p>
                  <p className="md:text-3xl mt-1">Live: PlayStation</p>
                  <p className="md:text-lg mt-1 opacity-50">Coming: XBOX, Steam</p>
                </div>
                <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] rounded-3xl flex-1 h-[200px] p-3 md:p-0">
                  <p className="md:text-2xl">Reward Pool</p>
                  <p className="md:text-3xl mt-2">$ITHEUM Tokens</p>
                  <p className="text-sm mt-2">* only for first 500 gamers who join</p>
                </div>
                <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] rounded-3xl flex-1 h-[200px] p-3 md:p-0">
                  <p className="md:text-2xl">Rewards Emitted</p>
                  <FontAwesomeIcon fade={true} color="#4691e2" icon={faBatteryQuarter} size="3x" className="m-2" />
                  <p className="">Charging...</p>
                </div>
              </div>
            </div>

            {!userInReview && (
              <div id="join-process" className="mt-10">
                <h2 className="!text-3xl text-center">Joining is simple as 1-2-3</h2>
                <p className="opacity-50 text-center mt-2 mb-5">
                  Check if you are eligible, login with your Google Account and you're in! Told you it's easy...
                </p>

                <div className="mt-2 flex flex-col justify-around space-y-2 md:space-y-0 md:space-x-4 md:flex-row">
                  <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] rounded-3xl flex-1 h-[250px] p-3 md:p-0">
                    <p className="md:text-3xl">1.</p>
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
                  <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] rounded-3xl flex-1 h-[250px] p-3 md:p-0">
                    <p className="md:text-3xl">2.</p>
                    {step2Passed ? (
                      <>
                        <FontAwesomeIcon fade={true} color="#4691e2" icon={faThumbsUp} size="2x" className="m-2" />
                        <div className="text-md w-[80%] flex flex-col items-center mb-5">
                          <p className="">W00T, you passed this step, your solana address is </p>
                          <span className="text-[#4691e2]">{<CopyAddress address={step2SolanaAddress} precision={6} />}</span>
                        </div>
                        <WalletDisconnectButton>Disconnect Wallet</WalletDisconnectButton>
                      </>
                    ) : (
                      <>
                        <p className="text-md w-[80%] text-center mb-5">
                          Create or link a Solana wallet. Hate crypto wallets? No worries, use your Google account via TipLink
                        </p>
                        <WalletMultiButton disabled={!step1Passed}>Phantom or Google via TipLink</WalletMultiButton>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] rounded-3xl flex-1 h-[250px] p-3 md:p-0">
                    <p className="md:text-3xl">3.</p>
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
                            if (step3InProgress && step2SolanaAddress !== "" && step1PSNUserName !== "") {
                              setShowActionModalStep3(true);
                            }
                          }}>
                          <ActionButton mlAdjustment={"-ml-20"} btnText="Agree and Join" disableBtn={!step3InProgress || !step1Passed} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div id="benefits" className="mt-10">
              <h2 className="!text-3xl text-center">Why should you join?</h2>
              <p className="opacity-50 text-center mt-2 mb-5">
                Cause gaming data ownership is the future! blah blah blah... but seriously, there are some cool perks!
              </p>
              <div className="mt-2 flex flex-col justify-around space-y-2 md:space-y-0 md:space-x-4 md:flex-row">
                <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] rounded-3xl flex-1 h-[200px] p-3 md:p-0">
                  <p className="md:text-2xl w-[80%] text-center">Compare Yourself to Top Gamers</p>
                  <p className="text-sm file:md:text-md w-[80%] text-center">See how you stack up against other gamers and check out what they're playing</p>
                </div>
                <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] rounded-3xl flex-1 h-[200px] p-3 md:p-0">
                  <p className="md:text-2xl w-[80%] text-center">Effortless! Works in the "Background</p>
                  <p className="text-sm md:text-md w-[80%] text-center">Your data is collected passively, so just keep playing games like usual!</p>
                </div>
                <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] rounded-3xl flex-1 h-[200px] p-3 md:p-0">
                  <p className="md:text-2xl w-[80%] text-center">Earn $ITHEUM Rewards for Your Data</p>
                  <p className="text-sm md:text-md w-[80%] text-center">Your data's gold! Play more, share more, and rack up the rewards!</p>
                </div>
              </div>
            </div>

            <div id="how-it-works" className="mt-10">
              <h2 className="!text-2xl text-center">I earn rewards for my gaming data? What VOODOO is this?!</h2>
              <p className="opacity-50 text-center mt-2 mb-5">
                Yep, your data is gold, and Itheum wants to break the cycle of big corporations exploiting it. Here’s the "VOODOO" behind the scenes:
              </p>

              <div className="mt-2 flex flex-col justify-around space-y-2 md:space-y-0 md:space-x-4 md:flex-row">
                <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] rounded-3xl flex-1 h-[200px] p-3 md:p-0">
                  <p className="md:text-2xl w-[80%] text-center">Itheum Data Realm</p>
                  <p className="text-sm md:text-md w-[80%] text-center">
                    We're filling our Data Realm with your passive gaming data. Right now, you share your data, and we reward you with $ITHEUM from the
                    protocol.
                  </p>
                </div>
                <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] rounded-3xl flex-1 h-[200px] p-3 md:p-0">
                  <p className="md:text-2xl w-[80%] text-center">Data Coalition DAO</p>
                  <p className="text-sm md:text-md w-[80%] text-center">
                    When the data realm is full, a Data Coalition DAO (DC DAO) will take charge of the giant data pool.
                  </p>
                </div>
                <div className="flex flex-col justify-center items-center border-dotted border-2 border-[#006ee4] rounded-3xl flex-1 h-[200px] p-3 md:p-0">
                  <p className="md:text-2xl w-[80%] text-center">Bulk Data Broker</p>
                  <p className="text-sm md:text-md w-[80%] text-center">The DC DAO will trade your data with AI companies and share the earnings with you.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <>
          <div id="FAQ" className="mt-10">
            <FAQAccordion faqList={faqList} borderStyleStr="border-dotted border-2 border-[#006ee4]" />
          </div>
          <div id="footer" className="mt-10 p-10"></div>
        </>

        <ActionModalStep1
          showActionModel={showActionModalStep1}
          handleHideActionModel={() => setShowActionModalStep1(false)}
          handleStep1Passed={(val: boolean) => {
            setStep1Passed(val);
          }}
          handleStep1PSNUserName={setStep1PSNUserName}
          handleStep1EligibilityCheckResults={setStep1EligibilityCheckResults}
        />

        <ActionModalStep3
          step1PSNUserName={step1PSNUserName}
          step1PSNEligibilityCheckResults={step1PSNEligibilityCheckResults}
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
