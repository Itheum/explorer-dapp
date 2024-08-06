import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Home, Menu, Store, Wallet, Gamepad2 } from "lucide-react";
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
import { useAccountStore } from "../../store/account";
import { BitzDropdown } from "../BitzShortcuts/BitzShortcuts";
// import { PathwaysModal } from "../PathwaysModal/PathwaysModal";
import { PlayBitzModal } from "../PlayBitzModal/PlayBitzModal";

export const Navbar = () => {
  const { publicKey } = useWallet();
  const addressSol = publicKey?.toBase58();
  const isLoggedInSol = !!addressSol;
  const isLoggedInMvx = useGetIsLoggedIn();
  const { address: addressMvx } = useGetAccount();
  const bitzBalance = useAccountStore((state: any) => state.bitzBalance);

  // const [showPathwaysModel, setShowPathwaysModel] = useState<boolean>(false);
  const [showPlayBitzModel, setShowPlayBitzModel] = useState<boolean>(false);

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
          <NavigationMenuItem className="cursor-pointer">
            <Link
              to={routeNames.analytics}
              className={navigationMenuTriggerStyle() + "dark:text-white dark:hover:!text-white text-black hover:!text-black !no-underline px-4"}>
              Analytics
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="cursor-pointer">
            <Link
              to={routeNames.gamerpassport}
              className={navigationMenuTriggerStyle() + "dark:text-white dark:hover:!text-white text-black hover:!text-black !no-underline px-4"}>
              Gamer Passport
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Data Widget Apps</NavigationMenuTrigger>
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
                        <div className="text-md font-medium leading-none">My Listed</div>
                        <p className="line-clamp-2 text-sm leading-snug dark:text-foreground/60  font-[Satoshi-Light] pt-0.5">Listed Data NFT's</p>
                      </Link>
                    )}
                    <Link
                      to={routeNames.mywallet}
                      title={"My Wallet"}
                      className={
                        "block select-none space-y-1 rounded-md p-3 leading-none !no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      }>
                      <div className="text-md font-medium leading-none">My Wallet</div>
                      <p className="line-clamp-2 text-sm leading-snug dark:text-foreground/60 font-[Satoshi-Light] pt-0.5">View RAW Data</p>
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

              <NavigationMenuItem>
                {isLoggedInMvx && (
                  <BitzDropdown
                    handlePlayActionBtn={() => {
                      setShowPlayBitzModel(true);
                    }}
                  />
                )}
              </NavigationMenuItem>
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
          {/* <NavigationMenuItem
            className="cursor-pointer"
            onClick={() => {
              setShowPathwaysModel(true);
            }}>
            Pathways
          </NavigationMenuItem> */}
          <NavigationMenuItem>
            <SwitchButton />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mobile Menu */}
      <div className="md:!hidden !visible">
        <DropdownMenu>
          <div className="flex flex-row">
            {isLoggedInMvx ? (
              <BitzDropdown
                handlePlayActionBtn={() => {
                  setShowPlayBitzModel(true);
                }}
              />
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
            <DropdownMenuGroup>
              <Link to={routeNames.analytics}>
                <DropdownMenuItem>
                  <Gamepad2 className="mr-2 h-4 w-4" />
                  <span>Analytics</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <Link to={routeNames.gamerpassport}>
                <DropdownMenuItem>
                  <Gamepad2 className="mr-2 h-4 w-4" />
                  <span>Gamer Passport</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuLabel className="flex flex-row items-center">
              <Store className="mr-2 h-4 w-4" />
              <span>Data Widget Apps</span>
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
                      <DropdownMenuItem>My Listed</DropdownMenuItem>
                    </Link>
                  )}
                  <Link to={routeNames.mywallet}>
                    <DropdownMenuItem>My Wallet</DropdownMenuItem>
                  </Link>
                  <Link to={routeNames.getbitz}>
                    <div className="bg-gradient-to-r from-[#35d9fa] to-[#7a98df] p-[1px] rounded-lg justify-center cursor-pointer">
                      <DropdownMenuItem className="dark:!text-black">
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

      {/* <PathwaysModal showPathwaysModel={showPathwaysModel} handleHidePathwaysModel={() => setShowPathwaysModel(false)} /> */}
      {showPlayBitzModel && <PlayBitzModal showPlayBitzModel={showPlayBitzModel} handleHideBitzModel={() => setShowPlayBitzModel(false)} />}
    </div>
  );
};
