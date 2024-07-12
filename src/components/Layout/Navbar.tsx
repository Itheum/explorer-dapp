import React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useWallet } from "@solana/wallet-adapter-react";
import { FlaskRound, Gift, Home, Menu, Store, Wallet } from "lucide-react";
import Countdown from "react-countdown";
import { Link } from "react-router-dom";
import { SUPPORTED_APPS } from "appsConfig";
import logo192 from "assets/img/logo192.png";
import { CopyAddress } from "components/CopyAddress";
import { logout } from "helpers";
import { useGetAccount, useGetIsLoggedIn } from "hooks";
import { cn } from "libs/utils";
import { APP_MAPPINGS } from "libs/utils/constant";
import { returnRoute } from "pages/Home";
import { routeNames } from "routes";
import { SwitchButton } from "./SwitchButton";
import { Button } from "../../libComponents/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../libComponents/DropdownMenu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../../libComponents/NavigationMenu";
import { Popover, PopoverContent, PopoverTrigger } from "../../libComponents/Popover";
import { BIT_GAME_WINDOW_HOURS } from "../../pages/AppMarketplace/GetBitz";
import { useAccountStore } from "../../store/account";

export const Navbar = () => {
  const { publicKey } = useWallet();
  const addressSol = publicKey?.toBase58();
  const isLoggedInSol = !!addressSol;

  const isLoggedInMvx = useGetIsLoggedIn();
  const { address: addressMvx } = useGetAccount();

  const bitzBalance = useAccountStore((state: any) => state.bitzBalance);
  const cooldown = useAccountStore((state: any) => state.cooldown);

  const FlaskBottleAnimation = () => {
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

  const BitzDropdown = () => {
    return (
      <div className=" shadow-sm shadow-[#35d9fa]  rounded-lg justify-center cursor-pointer">
        <Popover>
          <PopoverTrigger>
            <Button className="text-sm tracking-wide hover:bg-transparent" variant="ghost">
              {bitzBalance === -2 ? (
                <span className="flex items-center gap-0.5 blinkMe text-lg">
                  ... <FlaskBottleAnimation />
                </span>
              ) : (
                <>
                  {bitzBalance === -1 ? (
                    <div className="flex items-center gap-0.5 text-base">
                      0 <FlaskBottleAnimation />
                    </div>
                  ) : (
                    <div className="flex items-center gap-0.5 text-base">
                      {bitzBalance} <FlaskBottleAnimation />
                    </div>
                  )}
                </>
              )}
            </Button>
          </PopoverTrigger>

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
              <ClaimBitzButton />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  const ClaimBitzButton = () => (
    <Link className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] " to={"/getbitz"}>
      <span className="absolute hover:bg-[#35d9fa] inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF03,#45d4ff_50%,#111111_50%)]" />
      <span className="inline-flex h-full hover:bg-gradient-to-tl from-background to-[#35d9fa] w-full cursor-pointer items-center justify-center rounded-full bg-background px-3 py-1 text-sm font-medium   backdrop-blur-3xl">
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

  return (
    <div className="flex flex-row justify-between items-center xl:mx-[7.5rem] md:mx-[4rem] h-20">
      <div className="flex flex-row items-center text-xl">
        <Link className="flex flex-row items-center" to={routeNames.home}>
          <img src={logo192} className="w-[5rem]" />
          <div className="flex flex-col leading-none">
            <span className="text-black dark:!text-white md:text-lg text-base -mb-1">Itheum&nbsp;</span>
            <span className="bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-500 text-transparent font-bold text-base ">Explorer</span>
          </div>
        </Link>
      </div>

      <NavigationMenu className="md:!inline !hidden z-0 pr-2 relative md:z-10">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link
              to={routeNames.home}
              className={navigationMenuTriggerStyle() + "dark:text-white dark:hover:!text-white text-black hover:!text-black !no-underline px-4"}>
              Home
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Data Widgets</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className={cn("grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]", isLoggedInMvx ? "" : "!w-[400px]")}>
                {APP_MAPPINGS.filter((app) => SUPPORTED_APPS.includes(app.routeKey)).map((item) => (
                  <Link
                    to={returnRoute(item.routeKey)}
                    key={item.routeKey}
                    className={
                      "block select-none space-y-1 rounded-md p-3 leading-none !no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    }>
                    <div className="text-md font-medium leading-none text-foreground">{item.appName}</div>
                    <p className="line-clamp-2 text-sm leading-snug dark:text-foreground/60 font-[Satoshi-Light] pt-0.5 ">{item?.appDescription}</p>
                  </Link>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {(isLoggedInMvx || isLoggedInSol) && (
            <>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Account</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {isLoggedInMvx && (
                      <Link
                        to={routeNames.mylisted}
                        className={
                          "block select-none space-y-1 rounded-md p-3 leading-none !no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        }>
                        <div className="text-md font-medium leading-none ">My Listed</div>
                        <p className="line-clamp-2 text-sm leading-snug dark:text-foreground/60  font-[Satoshi-Light] pt-0.5">Listed Data NFT's</p>
                      </Link>
                    )}
                    <Link
                      to={routeNames.mywallet}
                      title={"My Wallet"}
                      className={
                        "block select-none space-y-1 rounded-md p-3 leading-none !no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      }>
                      <div className="text-md font-medium leading-none   ">My Wallet</div>
                      <p className="line-clamp-2 text-sm leading-snug dark:text-foreground/60   font-[Satoshi-Light] pt-0.5">View RAW Data</p>
                    </Link>
                    {isLoggedInMvx && (
                      <div className="flex flex-col p-3">
                        <p className="text-sm font-medium leading-none pb-0.5">MvX Address Quick Copy</p>
                        <CopyAddress address={addressMvx} precision={6} />
                      </div>
                    )}
                    {isLoggedInSol && (
                      <div className="flex flex-col p-3">
                        <p className="text-sm font-medium leading-none pb-0.5">SOL Address Quick Copy</p>
                        <CopyAddress address={addressSol} precision={6} />
                      </div>
                    )}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>{isLoggedInMvx && <BitzDropdown />}</NavigationMenuItem>
            </>
          )}
          <NavigationMenuItem>
            <Link to={routeNames.unlock} state={{ from: location.pathname }}>
              <div className="bg-gradient-to-r from-yellow-300 to-orange-500 p-[1px] px-[2px] rounded-lg justify-center">
                <Button
                  className="bg-background text-foreground hover:bg-background/90 border-0 rounded-md font-medium tracking-wide !text-lg"
                  variant="outline">
                  Manage Login
                </Button>
              </div>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <SwitchButton />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="md:!hidden !visible">
        <DropdownMenu>
          <div className="flex flex-row">
            {isLoggedInMvx ? (
              <BitzDropdown />
            ) : (
              <Link to={routeNames.unlock} state={{ from: location.pathname }}>
                <div className="bg-gradient-to-r from-yellow-300 to-orange-500 p-[1px] px-[2px] w-full rounded-lg justify-center">
                  <Button
                    className="dark:bg-[#0f0f0f] dark:text-white hover:dark:bg-[#0f0f0f20] border-0 rounded-lg font-medium tracking-wide"
                    variant="outline">
                    Login
                  </Button>
                </div>
              </Link>
            )}
            <SwitchButton />
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu />
              </Button>
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <Link to={routeNames.home}>
                <DropdownMenuItem>
                  <Home className="mr-2 h-4 w-4" />
                  <span>Home</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuLabel className="flex flex-row items-center">
              <Store className="mr-2 h-4 w-4" />
              <span>Data Widget Marketplace</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {APP_MAPPINGS.filter((app) => SUPPORTED_APPS.includes(app.routeKey)).map((item) => (
                <Link to={returnRoute(item.routeKey)} key={item.routeKey}>
                  <DropdownMenuItem className=" ">{item?.appName}</DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuGroup>
            {(isLoggedInMvx || isLoggedInSol) && (
              <>
                <DropdownMenuLabel className="flex flex-row items-center">
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>Account</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className="">
                  {isLoggedInMvx && (
                    <Link to={routeNames.mylisted}>
                      <DropdownMenuItem className=" ">My Listed</DropdownMenuItem>
                    </Link>
                  )}
                  <Link to={routeNames.mywallet}>
                    <DropdownMenuItem className=" ">My Wallet</DropdownMenuItem>
                  </Link>
                  <Link to={routeNames.getbitz}>
                    <div className="bg-gradient-to-r from-[#35d9fa] to-[#7a98df] p-[1px] rounded-lg justify-center cursor-pointer">
                      <DropdownMenuItem className="  dark:!text-black">
                        {bitzBalance === -2 ? (
                          <span className="blinkMe">{`... <BiTz> Points`}</span>
                        ) : (
                          <>{bitzBalance === -1 ? "0 <BiTz> Points" : `${bitzBalance} <BiTz> Points`}</>
                        )}
                      </DropdownMenuItem>
                    </div>
                  </Link>
                </DropdownMenuGroup>
                {isLoggedInMvx && (
                  <DropdownMenuItem className="gap-4">
                    <CopyAddress address={addressMvx} precision={6} />
                  </DropdownMenuItem>
                )}
                {isLoggedInSol && (
                  <DropdownMenuItem className="gap-4">
                    <CopyAddress address={addressSol || ""} precision={6} />
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuGroup>
              <div className="m-auto bg-gradient-to-r from-yellow-300 to-orange-500 p-[1px] px-[2px] rounded-lg w-fit">
                <Link to={routeNames.unlock} state={{ from: location.pathname }}>
                  <Button
                    className="bg-background text-foreground hover:bg-background/90 border-0 rounded-md font-medium tracking-wide !text-lg"
                    variant="outline">
                    Manage Login
                  </Button>
                </Link>
              </div>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
