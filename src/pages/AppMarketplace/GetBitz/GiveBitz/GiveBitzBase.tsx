import React, { useState } from "react";
import PowerUpCreator from "./PowerUpCreator";
import PowerUpBounty from "./PowerUpBounty";
import { useAccountStore } from "../../../../store/account";

type GiveBitzBaseProps = {
  viewDataRes: any;
};

const GiveBitzBase = (props: GiveBitzBaseProps) => {
  const { viewDataRes } = props;
  const givenBitzSum = useAccountStore((state: any) => state.givenBitzSum);

  console.log("viewDataRes", viewDataRes);

  return (
    <div className="flex flex-col lg:flex-row justify-between py-16 ">
      <div className="flex flex-col  mb-8 items-center justify-center">
        <span className="text-foreground text-4xl mb-2">Give Bitz</span>
        <span className="text-base text-foreground/75 text-center ">Power-Up VERIFIED Data Creators and Data Bounties</span>
      </div>

      <div className="my-rank-and-score md:flex md:justify-center border p-[.6rem] mb-[1rem] rounded-[1rem] text-center bg-[#35d9fa] bg-opacity-25">
        <div className="flex flex-col items-center p-[1rem] md:flex-row md:align-baseline md:pr-[2rem]">
          <p className="flex items-end md:text-lg md:mr-[1rem]">Total BitZ You Have Given</p>
          <p className="text-xl md:text-2xl dark:text-[#35d9fa] font-bold">
            {givenBitzSum === -2 ? `...` : <>{givenBitzSum === -1 ? "0" : `${givenBitzSum}`}</>}
          </p>
        </div>
      </div>

      <>
        <div className="flex flex-col mt-10 mb-8 items-center justify-center">
          <span className="text-foreground text-4xl mb-2">Power-up Creators</span>
          <span className="text-base text-foreground/75 text-center ">
            Power-Up VERIFIED Data Creators with your BiTz XP, Climb Data Creator Leaderboards and get bonus rewards and drops.
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:flex-wrap md:justify-between gap-4 justify-center items-center">
          <PowerUpCreator creatorAddress={"erd1xdq4d7uewptx9j9k23aufraklda9leumqc7eu3uezt2kf4fqxz2sex2rxl"} />
          <PowerUpCreator creatorAddress={"erd1qmsq6ej344kpn8mc9xfngjhyla3zd6lqdm4zxx6653jee6rfq3ns3fkcc7"} />
          <PowerUpCreator creatorAddress={"erd16vjhrga4yjpy88lwnu64wlxlapwxtvjl93jax4rg3yq3hzxtnausdmhcjf"} />
        </div>
      </>

      <>
        <div className="flex flex-col mt-10 mb-8 items-center justify-center">
          <span className="text-foreground text-4xl mb-2">Power-up Data Bounties</span>
          <span className="text-base text-foreground/75 text-center ">
            Power-Up Data Bounties (Ideas for new Data NFTs) with your BiTz XP, Climb Bounty Leaderboards and get bonus rewards if your Bounty is realized.
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:flex-wrap md:justify-between gap-4 justify-center items-center">
          <PowerUpBounty bountyId={"1"} />
          <PowerUpBounty bountyId={"2"} />
          <PowerUpBounty bountyId={"3"} />
        </div>
      </>
    </div>
  );
};

export default GiveBitzBase;
