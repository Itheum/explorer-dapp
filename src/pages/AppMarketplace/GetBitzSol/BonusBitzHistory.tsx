import React, { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { IS_DEVNET } from "appsConfig";
import { SUPPORTED_SOL_COLLECTIONS } from "config";
import { timeSince } from "libs/utils";
import { getApiWeb2Apps, sleep } from "./utils";

export interface BonusBitzHistoryItemType {
  on: number;
  reward: number;
  amount: number;
}

const BonusBitzHistory: React.FC = () => {
  const { publicKey } = useWallet();
  const address = publicKey?.toBase58();
  const [isHistoryLoading, setHistoryIsLoading] = React.useState(false);
  const [bonusBitzHistory, setBonusBitzHistory] = React.useState<any[]>([]);
  const oneMonthAgo = Math.floor(Date.now() / 1000) - 2592000;
  async function fetchBonusBitzHistory() {
    setHistoryIsLoading(true);

    const callConfig = {
      headers: {
        "fwd-tokenid": SUPPORTED_SOL_COLLECTIONS[0],
        Accept: "application/json, text/plain, */*",
      },
    };

    try {
      // S: ACTUAL LOGIC
      console.log("AXIOS CALL -----> xpGamePrivate/bonusHistoryForAddr");
      const res = await fetch(`${getApiWeb2Apps(IS_DEVNET ? "devnet" : "mainnet")}/datadexapi/xpGamePrivate/bonusHistoryForAddr?addr=${address}`, callConfig);
      const data = await res.json();
      console.log(data);
      const bonusBitzHistoryT: BonusBitzHistoryItemType[] = data.map((i: any) => {
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
    } else {
      setBonusBitzHistory([]);
    }
  }, [address]);

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
                        <th className="p-2 ">{`<BiTz>`} Points</th>
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
