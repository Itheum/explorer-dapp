import React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useWallet } from "@solana/wallet-adapter-react";
import { FlaskRound, Gift } from "lucide-react";
import Countdown from "react-countdown";
import { Link, useLocation } from "react-router-dom";
import { isMostLikelyMobile } from "libs/utils/misc";
import { BIT_GAME_WINDOW_HOURS } from "pages/AppMarketplace/GetBitz/common/interfaces";
import useSolBitzStore from "store/solBitz";
import { Button } from "../../libComponents/Button";
import { Popover, PopoverContent, PopoverTrigger } from "../../libComponents/Popover";

export const SolBitzDropdown = (props: any) => {
  const { skipNavBarPopOverOption, showOnlyClaimBitzButton, handlePlayActionBtn } = props;
  const cooldown = useSolBitzStore((state: any) => state.cooldown);
  const solBitzBalance = useSolBitzStore((state: any) => state.bitzBalance);
  const { connected: isLoggedInSol } = useWallet();

  return (
    <div className={`${!skipNavBarPopOverOption ? "shadow-sm shadow-[#35d9fa] rounded-lg justify-center cursor-pointer" : ""}`}>
      <Popover>
        {showOnlyClaimBitzButton ? (
          <ClaimBitzButton cooldown={cooldown} handlePlayActionBtn={handlePlayActionBtn} />
        ) : (
          <>
            <PopoverTrigger>
              <div className="flex flex-row items-center px-1.5">
                <svg width="9" height="9" viewBox="0 0 101 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M100.48 69.3817L83.8068 86.8015C83.4444 87.1799 83.0058 87.4816 82.5185 87.6878C82.0312 87.894 81.5055 88.0003 80.9743 88H1.93563C1.55849 88 1.18957 87.8926 0.874202 87.6912C0.558829 87.4897 0.31074 87.2029 0.160416 86.8659C0.0100923 86.529 -0.0359181 86.1566 0.0280382 85.7945C0.0919944 85.4324 0.263131 85.0964 0.520422 84.8278L17.2061 67.408C17.5676 67.0306 18.0047 66.7295 18.4904 66.5234C18.9762 66.3172 19.5002 66.2104 20.0301 66.2095H99.0644C99.4415 66.2095 99.8104 66.3169 100.126 66.5183C100.441 66.7198 100.689 67.0067 100.84 67.3436C100.99 67.6806 101.036 68.0529 100.972 68.415C100.908 68.7771 100.737 69.1131 100.48 69.3817ZM83.8068 34.3032C83.4444 33.9248 83.0058 33.6231 82.5185 33.4169C82.0312 33.2108 81.5055 33.1045 80.9743 33.1048H1.93563C1.55849 33.1048 1.18957 33.2121 0.874202 33.4136C0.558829 33.6151 0.31074 33.9019 0.160416 34.2388C0.0100923 34.5758 -0.0359181 34.9482 0.0280382 35.3103C0.0919944 35.6723 0.263131 36.0083 0.520422 36.277L17.2061 53.6968C17.5676 54.0742 18.0047 54.3752 18.4904 54.5814C18.9762 54.7875 19.5002 54.8944 20.0301 54.8952H99.0644C99.4415 54.8952 99.8104 54.7879 100.126 54.5864C100.441 54.3849 100.689 54.0981 100.84 53.7612C100.99 53.4242 101.036 53.0518 100.972 52.6897C100.908 52.3277 100.737 51.9917 100.48 51.723L83.8068 34.3032ZM1.93563 21.7905H80.9743C81.5055 21.7907 82.0312 21.6845 82.5185 21.4783C83.0058 21.2721 83.4444 20.9704 83.8068 20.592L100.48 3.17219C100.737 2.90357 100.908 2.56758 100.972 2.2055C101.036 1.84342 100.99 1.47103 100.84 1.13408C100.689 0.79713 100.441 0.510296 100.126 0.308823C99.8104 0.107349 99.4415 1.24074e-05 99.0644 0L20.0301 0C19.5002 0.000878397 18.9762 0.107699 18.4904 0.313848C18.0047 0.519998 17.5676 0.821087 17.2061 1.19848L0.524723 18.6183C0.267681 18.8866 0.0966198 19.2223 0.0325185 19.5839C-0.0315829 19.9456 0.0140624 20.3177 0.163856 20.6545C0.31365 20.9913 0.561081 21.2781 0.875804 21.4799C1.19053 21.6817 1.55886 21.7896 1.93563 21.7905Z"
                    fill="url(#paint0_linear_174_4403)"
                  />
                  <defs>
                    <linearGradient id="paint0_linear_174_4403" x1="8.52558" y1="90.0973" x2="88.9933" y2="-3.01622" gradientUnits="userSpaceOnUse">
                      <stop offset="0.08" stop-color="#9945FF" />
                      <stop offset="0.3" stop-color="#8752F3" />
                      <stop offset="0.5" stop-color="#5497D5" />
                      <stop offset="0.6" stop-color="#43B4CA" />
                      <stop offset="0.72" stop-color="#28E0B9" />
                      <stop offset="0.97" stop-color="#19FB9B" />
                    </linearGradient>
                  </defs>
                </svg>
                <Button className="text-sm tracking-wide hover:bg-transparent px-0.5 ml-0.5" variant="ghost">
                  {isLoggedInSol &&
                    (solBitzBalance === -2 ? (
                      <div className="flex items-center gap-0.5 blinkMe text-lg">
                        ... <FlaskBottleAnimation cooldown={cooldown} />
                      </div>
                    ) : (
                      <>
                        {solBitzBalance === -1 ? (
                          <div className="flex items-center gap-0.5 text-base">
                            0 <FlaskBottleAnimation cooldown={cooldown} />
                          </div>
                        ) : (
                          <div className="flex items-center gap-0.5 text-base">
                            {solBitzBalance} <FlaskBottleAnimation cooldown={cooldown} />
                          </div>
                        )}
                      </>
                    ))}
                </Button>
              </div>
            </PopoverTrigger>

            {!skipNavBarPopOverOption && (
              <PopoverContent className="w-[15rem] md:w-[25rem]">
                <PopoverPrimitive.Arrow className="fill-border w-5 h-3" />
                <div className="flex flex-col justify-center p-3 w-full">
                  <div className="flex justify-center w-full py-4">
                    <div className="flex w-16 h-16 justify-center items-center border border-b-border rounded-lg shadow-inner shadow-sky-400">
                      <FlaskRound className="w-7 h-7 fill-[#35d9fa]" />
                    </div>
                  </div>
                  <p className="text-xl md:text-2xl text-center font-[Clash-Medium]">What is {`<BiTz>`} XP?</p>
                  <p className="text-xs md:text-sm  font-[Satoshi-Regular] leading-relaxed py-4 text-center">
                    {`<BiTz>`} are Itheum Protocol XP. {`<BiTz>`} can be collected every {BIT_GAME_WINDOW_HOURS} hours by playing the Get {`<BiTz>`} game Data
                    Widget. Top LEADERBOARD climbers get special perks and drops!
                  </p>
                  <ClaimBitzButton cooldown={cooldown} handlePlayActionBtn={handlePlayActionBtn} />
                </div>
              </PopoverContent>
            )}
          </>
        )}
      </Popover>
    </div>
  );
};

export const ClaimBitzButton = (props: any) => {
  const { cooldown, handlePlayActionBtn } = props;
  const { pathname } = useLocation();

  const isGetBitzAppPage = () => {
    return !!pathname.match("/getbitz");
  };

  return (
    <Link
      className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px]"
      to={cooldown === -2 || isGetBitzAppPage() || isMostLikelyMobile() || !handlePlayActionBtn ? "/getbitz" : "#"}
      onClick={() => {
        if (cooldown > -2 && !isGetBitzAppPage() && !isMostLikelyMobile() && handlePlayActionBtn) {
          handlePlayActionBtn();
        } else {
          return;
        }
      }}>
      <span className="absolute hover:bg-[#35d9fa] inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF03,#45d4ff_50%,#111111_50%)]" />
      <span className="inline-flex h-full hover:bg-gradient-to-tl from-background to-[#35d9fa] w-full cursor-pointer items-center justify-center rounded-full bg-background px-3 py-1 text-sm font-medium backdrop-blur-3xl">
        {cooldown === -2 ? (
          <span className="blinkMe">Click to play BiTz</span>
        ) : cooldown > 0 ? (
          <Countdown
            date={cooldown}
            renderer={(props: { hours: number; minutes: number; seconds: number; completed: boolean }) => {
              if (props.completed) {
                return (
                  <PopoverPrimitive.PopoverClose asChild>
                    <div className="flex flex-row justify-center items-center">
                      <Gift className="mx-2 text-[#35d9fa]" />
                      <span className="text-[12px] md:text-sm"> Collect your X {`<BiTz>`} </span>
                    </div>
                  </PopoverPrimitive.PopoverClose>
                );
              } else {
                return (
                  <PopoverPrimitive.PopoverClose asChild>
                    <span className="ml-1 text-center">
                      Play again in <br></br>
                      {props.hours > 0 ? <>{`${props.hours} ${props.hours === 1 ? " Hour " : " Hours "}`}</> : ""}
                      {props.minutes > 0 ? props.minutes + " Min " : ""} {props.seconds} Sec
                    </span>
                  </PopoverPrimitive.PopoverClose>
                );
              }
            }}
          />
        ) : (
          <PopoverPrimitive.PopoverClose asChild>
            <div className="flex flex-row justify-center items-center">
              <Gift className="mx-2 text-[#35d9fa]" />
              <span className="text-[12px] md:text-sm"> Collect your {`<BiTz>`} </span>
            </div>
          </PopoverPrimitive.PopoverClose>
        )}
      </span>
    </Link>
  );
};

const FlaskBottleAnimation = (props: any) => {
  const { cooldown } = props;

  return (
    <div className="relative w-full h-full ">
      {cooldown <= 0 && cooldown != -2 && (
        <>
          <div
            className="absolute rounded-full w-[0.4rem] h-[0.4rem] top-[-15px] left-[10px] bg-[#35d9fa] animate-ping-slow"
            style={{ animationDelay: "1s" }}></div>
          <div
            className="absolute rounded-full w-[0.3rem] h-[0.3rem] top-[-8px]  left-[4px] bg-[#35d9fa]  animate-ping-slow"
            style={{ animationDelay: "0.5s" }}></div>
          <div className="absolute rounded-full w-1 h-1 top-[-5px] left-[13px]  bg-[#35d9fa] animate-ping-slow"></div>
        </>
      )}
      <FlaskRound className="fill-[#35d9fa]" />
    </div>
  );
};
