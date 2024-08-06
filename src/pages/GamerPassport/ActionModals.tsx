import React, { useState } from "react";
import { faThumbsUp, faHeartCrack } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { itheumSolPreaccess } from "libs/sol/SolViewData";
import { getApiWeb2Apps } from "libs/utils";
import { ActionButton } from "./SharedComps";

export const ActionModalStep1 = (props: any) => {
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

export const ActionModalStep3 = (props: any) => {
  const { publicKey, signMessage } = useWallet();
  const { showActionModel, handleHideActionModel } = props;
  const { step1PSNUserName, step2SolanaAddress, handleStep3Passed } = props;

  const [userSaveToLogAttempted, setUserSaveToLogAttempted] = useState<boolean>(false);
  const [userSavedToLog, setUserSavedToLog] = useState<boolean>(false);
  const [userSavedToLogError, setUserSavedToLogError] = useState<boolean>(false);
  const [saveToLogLoading, setSaveToLogLoading] = useState<boolean>(false);

  async function saveUserToLogViaAPI() {
    setSaveToLogLoading(true);

    // get signature
    const preAccessNonce = await itheumSolPreaccess();
    const message = new TextEncoder().encode(preAccessNonce);

    if (signMessage === undefined) {
      throw new Error("signMessage is undefined");
    }

    const signature = await signMessage(message);
    const encodedSignature = Buffer.from(signature).toString("hex");

    const checkRes = await axios.post(`${getApiWeb2Apps()}/datadexapi/gamepassport/addNewUserToLog`, {
      "psnUsername": step1PSNUserName,
      "solAddress": step2SolanaAddress,
      "signatureNonce": preAccessNonce,
      "solSignature": encodedSignature,
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
