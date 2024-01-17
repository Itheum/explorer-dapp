import React, { useEffect, useState } from "react";
import { Home, Menu, Store, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { SUPPORTED_APPS } from "appsConfig";
import logo192 from "assets/img/logo192.png";
import { CopyAddress } from "components/CopyAddress";
import { logout } from "helpers";
import { useGetAccount, useGetIsLoggedIn } from "hooks";
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
import { useTheme } from "../../libComponents/ThemeProvider";

export const Navbar = () => {
  const isLoggedIn = useGetIsLoggedIn();
  const { address } = useGetAccount();
  const { theme } = useTheme();
  const [systemTheme, setSystemTheme] = useState<string>();
  const getSystemTheme = () => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    } else {
      return "light";
    }
  };

  useEffect(() => {
    if (theme === "system") {
      setSystemTheme(getSystemTheme());
    }
  }, [theme]);

  const handleLogout = () => {
    logout(`${window.location.origin}`, undefined, false);
  };

  return (
    <div className="flex flex-row justify-between items-center xl:mx-[7.5rem] md:mx-[4rem] h-20">
      <div className="flex flex-row items-center text-xl">
        <Link className="flex flex-row items-center" to={isLoggedIn ? routeNames.home : routeNames.home}>
          <img src={logo192} className="w-[5rem]" />
          <div className="flex flex-col leading-none">
            <span className="text-black dark:!text-white md:text-lg text-base -mb-1">Itheum&nbsp;</span>
            <span className="bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-500 text-transparent font-bold text-base ">Explorer</span>
          </div>
        </Link>
      </div>

      <NavigationMenu className="md:!inline !hidden z-0">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link
              to={isLoggedIn ? routeNames.home : routeNames.home}
              className={navigationMenuTriggerStyle() + "dark:text-white dark:hover:!text-white text-black hover:!text-black !no-underline px-4"}>
              Home
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Data Widgets</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {APP_MAPPINGS.filter((app) => SUPPORTED_APPS.includes(app.routeKey)).map((item) => (
                  <Link
                    to={returnRoute(item.routeKey)}
                    key={item.routeKey}
                    className={
                      "block select-none space-y-1 rounded-md p-3 leading-none !no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    }>
                    <div className="text-md font-medium leading-none text-foreground">{item.appName}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-foreground/60 font-[Satoshi-Light] pt-0.5 ">{item?.appDescription}</p>
                  </Link>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {isLoggedIn ? (
            <>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Account</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <Link
                      to={routeNames.mylisted}
                      className={
                        "block select-none space-y-1 rounded-md p-3 leading-none !no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      }>
                      <div className="text-md font-medium leading-none dark:text-white text-muted-foreground">My Listed</div>
                      <p className="line-clamp-2 text-sm leading-snug text-foreground/60 font-[Satoshi-Light] pt-0.5">Listed Data NFT's</p>
                    </Link>
                    <Link
                      to={routeNames.mywallet}
                      title={"My Wallet"}
                      className={
                        "block select-none space-y-1 rounded-md p-3 leading-none !no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      }>
                      <div className="text-md font-medium leading-none dark:text-white text-muted-foreground">My Wallet</div>
                      <p className="line-clamp-2 text-sm leading-snug text-foreground/60 font-[Satoshi-Light] pt-0.5">View RAW Data</p>
                    </Link>
                    <div className="flex flex-col p-3">
                      <p className="text-sm font-medium leading-none dark:text-slate-100 pb-0.5">My Address Quick Copy</p>
                      <CopyAddress address={address} precision={6} />
                    </div>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to={isLoggedIn ? routeNames.home : routeNames.home}>
                  <div className="bg-gradient-to-r from-yellow-300 to-orange-500 p-[1px] rounded-lg justify-center">
                    <Button
                      className="dark:bg-[#0f0f0f] bg-slate-50 dark:text-white hover:dark:bg-transparent/10 hover:bg-transparent border-0 rounded-md font-medium tracking-wide !text-lg"
                      variant="outline"
                      onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                </Link>
              </NavigationMenuItem>
            </>
          ) : (
            <NavigationMenuItem>
              <Link to={routeNames.unlock} state={{ from: location.pathname }}>
                <div className="bg-gradient-to-r from-yellow-300 to-orange-500 p-[1px] rounded-lg justify-center">
                  <Button
                    className="bg-background text-foreground hover:bg-background/90 border-0 rounded-md font-medium tracking-wide !text-lg"
                    variant="outline">
                    Login
                  </Button>
                </div>
              </Link>
            </NavigationMenuItem>
          )}
          <NavigationMenuItem>
            <SwitchButton />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="md:!hidden !visible">
        <DropdownMenu>
          <div className="flex flex-row">
            {isLoggedIn ? (
              <Link to={isLoggedIn ? routeNames.home : routeNames.home}>
                <div className="bg-gradient-to-r from-yellow-300 to-orange-500 p-[1px] rounded-lg justify-center">
                  <Button
                    className="dark:bg-[#0f0f0f] bg-slate-50 dark:text-white hover:dark:bg-transparent/10 hover:bg-transparent border-0 rounded-lg font-medium tracking-wide"
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </Link>
            ) : (
              <Link to={routeNames.unlock} state={{ from: location.pathname }}>
                <div className="bg-gradient-to-r from-yellow-300 to-orange-500 p-[1px] rounded-lg justify-center">
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
                  <DropdownMenuItem className="text-foreground/50">{item?.appName}</DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuGroup>
            {isLoggedIn ? (
              <>
                <DropdownMenuLabel className="flex flex-row items-center">
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>Account</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link to={routeNames.mylisted}>
                    <DropdownMenuItem className="text-foreground/50">Listed data</DropdownMenuItem>
                  </Link>
                  <Link to={routeNames.mywallet}>
                    <DropdownMenuItem className="!text-foreground/50">Wallet</DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuLabel>My Address Quick Copy</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <CopyAddress address={address} precision={6} />
                </DropdownMenuItem>
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
