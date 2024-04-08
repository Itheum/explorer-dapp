import React, { useState } from "react";
import { CopyAddress } from "components/CopyAddress";
import { Button } from "../../../../libComponents/Button";

type PowerUpCreatorProps = {
  creatorAddress: string;
};

const PowerUpCreator = (props: PowerUpCreatorProps) => {
  const { creatorAddress } = props;
  const [bitsVal, setBitsVal] = useState<number>(0);

  async function sendPowerUp() {
    console.log("sendPowerUp");
  }

  function handleGiveBitzChange(bitz: number) {
    setBitsVal(bitz);
  }

  return (
    <div className="creator-tile border p-10 w-[350px]">
      <div className="text-lg">Creator Profile</div>
      <div className="mb-5">
        {" "}
        <CopyAddress address={creatorAddress} precision={8} />
      </div>
      <div className="mb-5 py-2 border-b-4">
        <div>
          Are you in the creator's Bitz power-up leaderboard?{" "}
          <a className="!text-[#7a98df] hover:underline" href={"https://test.datadex.itheum.io/profile/" + creatorAddress} target="_blank">
            check
          </a>
        </div>
      </div>
      <div className="mb-3 py-2 border-b-4">
        <div>Given BiTz: 200</div>
      </div>
      <div className="mb-3 py-2 border-b-4">
        <div>Give More BiTz</div>
        <div className="mb-3">
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={bitsVal}
            onChange={(e) => handleGiveBitzChange(Number(e.target.value))}
            className="accent-black dark:accent-white w-[70%] cursor-pointer ml-2"></input>
          <Button className="cursor-pointer mt-3" onClick={sendPowerUp}>
            Send {bitsVal} BiTz Power Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PowerUpCreator;
