import React from "react";
import { Link } from "react-router-dom";
import lightLogo from "assets/img/logo-icon-b.png";
import darkLogo from "assets/img/logo-sml-d.png";
import { CopyAddress } from "components/CopyAddress";
import { SUPPORTED_APPS } from "config";
import { logout } from "helpers";
import { useGetAccount, useGetIsLoggedIn } from "hooks";
import { APP_MAPPINGS } from "libs/utils/constant";
import { returnRoute } from "pages/Home";
import { routeNames } from "routes";
import { SwitchButton } from "./SwitchButton";
import { Button } from "../../libComponents/Button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../../libComponents/NavigationMenu";
import { cn } from "../../libs/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../libComponents/DropdownMenu";
import { Home, Menu, Store, Wallet } from "lucide-react";
import { useTheme } from "../../libComponents/ThemeProvider";

export const Navbar = () => {
  const isLoggedIn = useGetIsLoggedIn();
  const { address } = useGetAccount();
  const { theme } = useTheme();

  const handleLogout = () => {
    // logout(`${window.location.origin}/unlock`);
    logout(`${window.location.origin}`);
  };

  return (
    <div className="flex flex-row justify-between items-center 2xl:mx-[19.5rem] xl:mx-[7.5rem] md:mx-[3.5rem] h-20">
      <div className="flex flex-row items-center text-xl">
        <Link className="flex flex-row items-center" to={isLoggedIn ? routeNames.home : routeNames.home}>
          <img src={theme === "dark" ? darkLogo : lightLogo} className="w-[45px] h-auto" />
          <span className="text-black dark:text-white pl-2">Itheum</span>
          <span className="text-black dark:text-white font-semibold">Explorer</span>
        </Link>
      </div>

      <NavigationMenu className="md:!inline !hidden">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to={isLoggedIn ? routeNames.home : routeNames.home}>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle() + "dark:!text-white dark:hover:!text-white text-black hover:!text-black !no-underline px-4"}>
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>App Marketplace</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {APP_MAPPINGS.filter((app) => SUPPORTED_APPS.includes(app.routeKey)).map((item) => (
                  <ListItem href={returnRoute(item.routeKey)} key={item.routeKey} title={item.appName}>
                    {item?.appDescription}
                  </ListItem>
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
                    <ListItem href={routeNames.mylisted} title={"My Listed"} className="!hover:no-underline !focus:no-underline">
                      Listed Data NFT's
                    </ListItem>
                    <ListItem href={routeNames.mylisted} title={"My Wallet"}>
                      My Wallet Data NFT's
                    </ListItem>
                    <div className="flex flex-col p-3">
                      <p className="text-sm font-medium leading-none dark:text-slate-100">My Address Quick Copy</p>
                      <CopyAddress address={address} precision={6} />
                    </div>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to={isLoggedIn ? routeNames.home : routeNames.home}>
                  <div className="bg-gradient-to-r from-yellow-300 to-orange-500 p-[1px] rounded-md justify-center">
                    <Button
                      className="dark:bg-[#0f0f0f] bg-slate-50 dark:text-white hover:dark:bg-transparent/10 hover:bg-transparent border-0 rounded-lg font-medium tracking-wide !text-lg"
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
              <Link to={routeNames.unlock}>
                <div className="bg-gradient-to-r from-yellow-300 to-orange-500 p-[1px] rounded-md justify-center">
                  <Button
                    className="dark:bg-[#0f0f0f] dark:text-white hover:dark:bg-[#0f0f0f20] border-0 rounded-lg font-medium tracking-wide !text-lg"
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
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <Menu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <Link to={isLoggedIn ? routeNames.home : routeNames.home}>
                <DropdownMenuItem>
                  <Home className="mr-2 h-4 w-4" />
                  <span>Home</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuLabel className="flex flex-row items-center">
              <Store className="mr-2 h-4 w-4" />
              <span>App Marketplace</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {APP_MAPPINGS.filter((app) => SUPPORTED_APPS.includes(app.routeKey)).map((item) => (
                <Link to={returnRoute(item.routeKey)} key={item.routeKey}>
                  <DropdownMenuItem>{item?.appName}</DropdownMenuItem>
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
                    <DropdownMenuItem>Listed data</DropdownMenuItem>
                  </Link>
                  <Link to={routeNames.mywallet}>
                    <DropdownMenuItem>Wallet</DropdownMenuItem>
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

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none !no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}>
          <div className="text-md font-medium leading-none dark:text-white text-muted-foreground">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
