import React, { useState } from "react";
import { Button } from "../../../../libComponents/Button";

type PowerUpBountyProps = {
  bountyId: string;
};

const PowerUpBounty = (props: PowerUpBountyProps) => {
  const { bountyId } = props;
  const [bitsVal, setBitsVal] = useState<number>(0);

  async function sendPowerUp() {
    console.log("sendPowerUp");
  }

  function handleGiveBitzChange(bitz: number) {
    setBitsVal(bitz);
  }

  return (
    <div className="creator-tile border p-10 w-[350px]">
      <div className="text-lg">Data Bounty</div>
      <div className="mb-5">Title: Build a game Data NFT using on-chain data</div>
      <div className="mb-5 py-2 border-b-4">
        <div>
          Are you in the bounty's Bitz power-up leaderboard?{" "}
          <a className="!text-[#7a98df] hover:underline" href={"https://test.datadex.itheum.io/bounties/" + bountyId} target="_blank">
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

export default PowerUpBounty;
