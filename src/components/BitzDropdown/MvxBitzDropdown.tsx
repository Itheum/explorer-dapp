import React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { FlaskRound, Gift } from "lucide-react";
import Countdown from "react-countdown";
import { Link, useLocation } from "react-router-dom";
import { isMostLikelyMobile } from "libs/utils/misc";
import { BIT_GAME_WINDOW_HOURS } from "pages/AppMarketplace/GetBitz/common/interfaces";
import { Button } from "../../libComponents/Button";
import { Popover, PopoverContent, PopoverTrigger } from "../../libComponents/Popover";
import { useAccountStore } from "../../store/account";

export const MvxBitzDropdown = (props: any) => {
  const { skipNavBarPopOverOption, showOnlyClaimBitzButton, handlePlayActionBtn } = props;
  const cooldown = useAccountStore((state: any) => state.cooldown);
  const mvxBitzBalance = useAccountStore((state: any) => state.bitzBalance);

  return (
    <div className={`${!skipNavBarPopOverOption ? "shadow-sm shadow-[#35d9fa] rounded-lg justify-center cursor-pointer" : ""}`}>
      <Popover>
        {showOnlyClaimBitzButton ? (
          <ClaimBitzButton cooldown={cooldown} handlePlayActionBtn={handlePlayActionBtn} />
        ) : (
          <>
            <PopoverTrigger>
              <div className="flex flex-row items-center px-1.5">
                <svg width="16" height="16" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M158.482 149.928L228.714 112.529L216.919 90L152.575 115.854C150.923 116.523 149.077 116.523 147.425 115.854L83.0814 90L71.25 112.602L141.482 150L71.25 187.398L83.0814 210L147.425 183.948C149.077 183.279 150.923 183.279 152.575 183.948L216.919 209.874L228.75 187.272L158.482 149.928Z"
                    fill="#23F7DD"></path>
                </svg>
                <Button className="text-sm tracking-wide hover:bg-transparent px-0.5" variant="ghost">
                  {mvxBitzBalance === -2 ? (
                    <div className="flex items-center gap-0.5 blinkMe text-lg">
                      ... <FlaskBottleAnimation cooldown={cooldown} />
                    </div>
                  ) : (
                    <>
                      {mvxBitzBalance === -1 ? (
                        <div className="flex items-center gap-0.5 text-base">
                          0 <FlaskBottleAnimation cooldown={cooldown} />
                        </div>
                      ) : (
                        <div className="flex items-center gap-0.5 text-base">
                          {mvxBitzBalance} <FlaskBottleAnimation cooldown={cooldown} />
                        </div>
                      )}
                    </>
                  )}
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
                  <p className="text-xl md:text-2xl text-center font-[Clash-Medium]">What is {`BiTz`} XP?</p>
                  <p className="text-xs md:text-sm  font-[Satoshi-Regular] leading-relaxed py-4 text-center">
                    {`BiTz`} are Itheum Protocol XP. {`BiTz`} can be collected every few hours. You use {`BiTz`} points to curate and like data being created by
                    Itheum data creators and to get rewarded in return!
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
  const { updateCooldown } = useAccountStore();

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
          <span className="blinkMe">...</span>
        ) : cooldown > 0 ? (
          <Countdown
            date={cooldown}
            onComplete={() => {
              updateCooldown(0);
            }}
            renderer={(props: { hours: number; minutes: number; seconds: number; completed: boolean }) => {
              if (props.completed) {
                return (
                  <PopoverPrimitive.PopoverClose asChild>
                    <div className="flex flex-row justify-center items-center">
                      <Gift className="mx-2 text-[#35d9fa]" />
                      <span className="text-[12px] md:text-sm"> Collect Your {`BiTz`} XP </span>
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
              <span className="text-[12px] md:text-sm"> Collect Your {`BiTz`} XP </span>
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
