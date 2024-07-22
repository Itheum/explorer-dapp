import React, { useState } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { FlaskRound, Gift } from "lucide-react";
import Countdown from "react-countdown";
import { Link } from "react-router-dom";
import { Button } from "../../libComponents/Button";
import { Popover, PopoverContent, PopoverTrigger } from "../../libComponents/Popover";
import { BIT_GAME_WINDOW_HOURS } from "../../pages/AppMarketplace/GetBitz";
import { useAccountStore } from "../../store/account";

export const BitzDropdown = (props: any) => {
  const { skipPopOver, showActionButton } = props;
  const bitzBalance = useAccountStore((state: any) => state.bitzBalance);
  const cooldown = useAccountStore((state: any) => state.cooldown);

  return (
    <div className={`${!skipPopOver ? "shadow-sm shadow-[#35d9fa] rounded-lg justify-center cursor-pointer" : ""}`}>
      <Popover>
        {showActionButton ? (
          <ClaimBitzButton cooldown={cooldown} />
        ) : (
          <>
            <PopoverTrigger>
              <Button className="text-sm tracking-wide hover:bg-transparent" variant="ghost">
                {bitzBalance === -2 ? (
                  <span className="flex items-center gap-0.5 blinkMe text-lg">
                    ... <FlaskBottleAnimation cooldown={cooldown} />
                  </span>
                ) : (
                  <>
                    {bitzBalance === -1 ? (
                      <div className="flex items-center gap-0.5 text-base">
                        0 <FlaskBottleAnimation cooldown={cooldown} />
                      </div>
                    ) : (
                      <div className="flex items-center gap-0.5 text-base">
                        {bitzBalance} <FlaskBottleAnimation cooldown={cooldown} />
                      </div>
                    )}
                  </>
                )}
              </Button>
            </PopoverTrigger>

            {!skipPopOver && (
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
                  <ClaimBitzButton cooldown={cooldown} />
                </div>
              </PopoverContent>
            )}
          </>
        )}
      </Popover>
    </div>
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

export const ClaimBitzButton = (props: any) => {
  const { cooldown } = props;

  return (
    <Link className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px]" to={"/getbitz"}>
      <span className="absolute hover:bg-[#35d9fa] inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF03,#45d4ff_50%,#111111_50%)]" />
      <span className="inline-flex h-full hover:bg-gradient-to-tl from-background to-[#35d9fa] w-full cursor-pointer items-center justify-center rounded-full bg-background px-3 py-1 text-sm font-medium backdrop-blur-3xl">
        {cooldown === -2 ? (
          <span className="blinkMe">...</span>
        ) : cooldown > 0 ? (
          <Countdown
            date={cooldown}
            renderer={(props: { hours: number; minutes: number; seconds: number; completed: boolean }) => {
              if (props.completed) {
                return (
                  <PopoverPrimitive.PopoverClose>
                    <div className="flex  flex-row justify-center items-center">
                      <Gift className="mx-2 text-[#35d9fa]" />
                      <span> Collect your {`<BiTz>`} </span>
                    </div>
                  </PopoverPrimitive.PopoverClose>
                );
              } else {
                return (
                  <span className="ml-1 text-center">
                    Play again in <br></br>
                    {props.hours > 0 ? <>{`${props.hours} ${props.hours === 1 ? " Hour " : " Hours "}`}</> : ""}
                    {props.minutes > 0 ? props.minutes + " Min " : ""} {props.seconds} Sec
                  </span>
                );
              }
            }}
          />
        ) : (
          <PopoverPrimitive.PopoverClose>
            <div className="flex  flex-row justify-center items-center">
              <Gift className="mx-2 text-[#35d9fa]" />
              <span> Collect your {`<BiTz>`} </span>
            </div>
          </PopoverPrimitive.PopoverClose>
        )}
      </span>
    </Link>
  );
};
