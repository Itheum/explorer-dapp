import React from "react";
import { Link } from "react-router-dom";
import NFMeIDAvatarImg from "assets/img/nfme-id-avatar.png";
import { Button } from "libComponents/Button";

export function NFMeIDBannerCTA() {
  return (
    <div className="mt-5 py-2 md:py-0 mb-3 border p-2 rounded-lg bg-[#a7fcf0]">
      <div className="flex flex-col md:flex-row items-center">
        <img className="w-[90px] animate-pulse" src={NFMeIDAvatarImg} alt="Get our NFMe ID" />
        <div className="flex flex-col justify-center p-2">
          <p className="dark:text-background text-xl mb-1 text-center md:text-left">Claim Your NFMe ID Today!</p>
          <p className="dark:text-background text-sm text-center md:text-left">
            The world’s first blockchain-native identity & reputation system for the AI Era. Stake your "Liveliness" score to earn farm rewards.
          </p>
        </div>
        <div className="flex md:flex-col justify-center mt-3 ml-auto mr-auto md:mr-2">
          <Link to="https://datadex.itheum.io/nfmeid" target="_blank" className="text-base hover:!no-underline hover:text-black">
            <Button className="!text-black text-sm tracking-tight relative px-[2.35rem] bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100">
              Claim NFMe ID
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
