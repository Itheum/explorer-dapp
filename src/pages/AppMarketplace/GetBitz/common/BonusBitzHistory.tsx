import React, { useEffect } from "react";
import { useGetAccount } from "@multiversx/sdk-dapp/hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { GET_BITZ_TOKEN_MVX } from "appsConfig";
import { Loader } from "components";
import { createNftId, getApiWeb2Apps, sleep, timeSince } from "libs/utils";
import { useLocalStorageStore } from "store/LocalStorageStore.ts";
import { BonusBitzHistoryItemType } from "./interfaces";

const BonusBitzHistory: React.FC = () => {
  const { address: mvxAddress } = useGetAccount();
  const { publicKey } = useWallet();
  const solAddress = publicKey?.toBase58() ?? "";
  const defaultChain = useLocalStorageStore((state) => state.defaultChain);
  const address = defaultChain === "multiversx" ? mvxAddress : solAddress;
  const [isHistoryLoading, setHistoryIsLoading] = React.useState(false);
  const [bonusBitzHistory, setBonusBitzHistory] = React.useState<any[]>([]);
  const oneMonthAgo = Math.floor(Date.now() / 1000) - 2592000;
  async function fetchBonusBitzHistory() {
    setHistoryIsLoading(true);

    const callConfig = {
      headers: {
        "fwd-tokenid": createNftId(GET_BITZ_TOKEN_MVX.tokenIdentifier, GET_BITZ_TOKEN_MVX.nonce),
      },
    };

    try {
      // S: ACTUAL LOGIC
      console.log("AXIOS CALL -----> xpGamePrivate/bonusHistoryForAddr");
      const { data } = await axios.get<any[]>(`${getApiWeb2Apps()}/datadexapi/xpGamePrivate/bonusHistoryForAddr?addr=${address}`, callConfig);
      console.log(data);
      const bonusBitzHistoryT: BonusBitzHistoryItemType[] = data.map((i) => {
        const item: BonusBitzHistoryItemType = {
          amount: i.bits,
          on: Math.floor(i.on / 1000),
          reward: i.actionLabel,
        };

        return item;
      });

      await sleep(2);

      setBonusBitzHistory(bonusBitzHistoryT);
      // E: ACTUAL LOGIC
    } catch (err: any) {
      const message = "Bonus Bitz History fetching failed:" + err.message;
      console.error(message);
    }

    setHistoryIsLoading(false);
  }

  useEffect(() => {
    if (address) {
      fetchBonusBitzHistory();
    }
  }, []);

  return (
    <>
      {address ? (
        <div id="bonusBitzHistory" className="h-fit flex flex-col max-w-[100%] border border-[#35d9fa] mb-[3rem] rounded-[1rem] p-8">
          <div className="flex flex-col mb-8 items-center justify-center">
            <h2 className="text-foreground text-4xl mb-2">Bonus BiTz History</h2>
            <span className="text-base text-foreground/75 text-center ">
              Earn bonus points for being active in the Itheum Protocol.
              <br />
              <Link to={"/"} className="underline">
                Learn more here
              </Link>
            </span>
          </div>
          <div className="flex flex-col justify-center items-center w-full">
            {isHistoryLoading ? (
              <Loader />
            ) : (
              <>
                {bonusBitzHistory.length > 0 ? (
                  <table className="border border-[#35d9fa]/60 text-center m-auto w-[90%] max-w-[500px]">
                    <thead>
                      <tr className="border border-[#35d9fa]/30 ">
                        <th className="p-2">When</th>
                        <th className="p-2">Reward</th>
                        <th className="p-2 ">{`BiTz`} Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bonusBitzHistory.map((item, index) => (
                        <tr key={index} className="border border-[#35d9fa]/30 ">
                          <td className="p-2">{item.on < oneMonthAgo ? new Date(item.on * 1000).toDateString() : timeSince(item.on) + " ago"}</td>
                          <td className="p-2">{item.reward}</td>
                          <td className="p-2 text-lime-400 font-bold">+ {item.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center">No Bonus BiTz received yet!</div>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default BonusBitzHistory;
