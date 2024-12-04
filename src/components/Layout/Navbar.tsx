import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Home, Menu, Store, Wallet, Gamepad2, AreaChart, Music, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { SUPPORTED_APPS } from "appsConfig";
import logo192 from "assets/img/logo192.png";
import { SolBitzDropdown, FlaskBottleAnimation } from "components/BitzDropdown/SolBitzDropdown";
import { CopyAddress } from "components/CopyAddress";
import { useGetAccount, useGetIsLoggedIn } from "hooks";
import { Button } from "libComponents/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "libComponents/DropdownMenu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "libComponents/NavigationMenu";
import { getOrCacheAccessNonceAndSignature } from "libs/sol/SolViewData";
import { cn, sleep } from "libs/utils";
import { APP_MAPPINGS } from "libs/utils/constant";
import { getNFTuneFirstTrackBlobData } from "pages/AppMarketplace/NFTunes";
import { returnRoute } from "pages/Home";
import { routeNames } from "routes";
import { useAccountStore } from "store/account";
import { useAppsStore } from "store/apps";
import { useLocalStorageStore } from "store/LocalStorageStore.ts";
import { SwitchButton } from "./SwitchButton";
import { MvxBitzDropdown } from "../BitzDropdown/MvxBitzDropdown";
import { DataNftAirdropsBannerCTA } from "../DataNftAirdropsBannerCTA";
import { PlayBitzModal } from "../PlayBitzModal/PlayBitzModal";

export const Navbar = () => {
  const { publicKey: publicKeySol, signMessage } = useWallet();
  const addressSol = publicKeySol?.toBase58();
  const isLoggedInSol = !!addressSol;
  const isLoggedInMvx = useGetIsLoggedIn();
  const { address: addressMvx } = useGetAccount();
  const setDefaultChain = useLocalStorageStore((state) => state.setDefaultChain);
  const [showPlayBitzModal, setShowPlayBitzModal] = useState<boolean>(false);
  const appsStore = useAppsStore();
  const updateNfTunesRadioFirstTrackCachedBlob = appsStore.updateNfTunesRadioFirstTrackCachedBlob;

  // S: Cached Signature Store Items
  const solPreaccessNonce = useAccountStore((state: any) => state.solPreaccessNonce);
  const solPreaccessSignature = useAccountStore((state: any) => state.solPreaccessSignature);
  const solPreaccessTimestamp = useAccountStore((state: any) => state.solPreaccessTimestamp);
  const updateSolPreaccessNonce = useAccountStore((state: any) => state.updateSolPreaccessNonce);
  const updateSolPreaccessTimestamp = useAccountStore((state: any) => state.updateSolPreaccessTimestamp);
  const updateSolSignedPreaccess = useAccountStore((state: any) => state.updateSolSignedPreaccess);
  // E: Cached Signature Store Items

  useEffect(() => {
    // lets get the 1st song blob for NFTunes Radio, so we can store in the "browser" cache for fast playback
    // ... we do it here as the NavBar loads first always
    async function cacheFirstNFTuneRadioTrack() {
      const nfTunesRadioFirstTrackCachedBlob = appsStore.nfTunesRadioFirstTrackCachedBlob;

      if (nfTunesRadioFirstTrackCachedBlob === "") {
        const trackBlobUrl = await getNFTuneFirstTrackBlobData();

        if (trackBlobUrl !== "") {
          console.log("NFTune Radio 1st Song Data Cached...");
        }

        updateNfTunesRadioFirstTrackCachedBlob(trackBlobUrl || "");
      }
    }

    cacheFirstNFTuneRadioTrack();
  }, []);

  useEffect(() => {
    if (publicKeySol) {
      cacheSignatureSessions();
    }
  }, [publicKeySol]);

  async function cacheSignatureSessions() {
    const { usedPreAccessNonce, usedPreAccessSignature } = await getOrCacheAccessNonceAndSignature({
      solPreaccessNonce,
      solPreaccessSignature,
      solPreaccessTimestamp,
      signMessage,
      publicKey: publicKeySol,
      updateSolPreaccessNonce,
      updateSolSignedPreaccess,
      updateSolPreaccessTimestamp,
    });
  }

  return (
    <>
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
                to={routeNames.nftunes}
                className={navigationMenuTriggerStyle() + "dark:text-white dark:hover:!text-white text-black hover:!text-black !no-underline px-4"}>
                NF-Tunes Music
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="cursor-pointer">
              <Link
                to={routeNames.aiworkforce}
                className={navigationMenuTriggerStyle() + "dark:text-white dark:hover:!text-white text-black hover:!text-black !no-underline px-4"}>
                AI Data Workforce
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="cursor-pointer">
              <Link
                to={routeNames.analytics}
                className={navigationMenuTriggerStyle() + "dark:text-white dark:hover:!text-white text-black hover:!text-black !no-underline px-4"}>
                Analytics
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Apps</NavigationMenuTrigger>
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
                  <Link
                    to={routeNames.gamerpassport}
                    className={
                      "block select-none space-y-1 rounded-md p-3 leading-none !no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    }>
                    <div className="text-md font-medium leading-none text-foreground">Gamer Passport</div>
                    <p className="line-clamp-2 text-sm leading-snug dark:text-foreground/60 font-[Satoshi-Light] pt-0.5 ">
                      Earn rewards for playing games and sharing data
                    </p>
                  </Link>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {isLoggedInMvx || isLoggedInSol ? (
              <>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Account</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
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
                    <MvxBitzDropdown
                      handlePlayActionBtn={async () => {
                        setDefaultChain("multiversx");
                        await sleep(0.2);
                        setShowPlayBitzModal(true);
                      }}
                    />
                  )}
                </NavigationMenuItem>

                <NavigationMenuItem>
                  {isLoggedInSol && (
                    <SolBitzDropdown
                      handlePlayActionBtn={async () => {
                        setDefaultChain("solana");
                        await sleep(0.2);
                        setShowPlayBitzModal(true);
                      }}
                    />
                  )}
                </NavigationMenuItem>
              </>
            ) : (
              <div className={"shadow-sm shadow-[#35d9fa] rounded-lg justify-center cursor-pointer"}>
                <div className="flex flex-row items-center px-3">
                  <Link to={routeNames.getbitz}>
                    <Button className="text-sm tracking-wide hover:bg-transparent px-0.5 ml-0.5" variant="ghost">
                      <FlaskBottleAnimation cooldown={0} />
                      <div className="ml-1">BiTz XP</div>
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            <NavigationMenuItem>
              <Link to={routeNames.unlock} state={{ from: `${location.pathname}${location.search}` }}>
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

        {/* Mobile Menu */}
        <div className="md:!hidden !visible">
          <DropdownMenu>
            <div className="flex flex-row">
              {isLoggedInMvx || isLoggedInSol ? (
                isLoggedInMvx ? (
                  <MvxBitzDropdown
                    handlePlayActionBtn={async () => {
                      setDefaultChain("multiversx");
                      await sleep(0.2);
                      setShowPlayBitzModal(true);
                    }}
                  />
                ) : (
                  <SolBitzDropdown
                    handlePlayActionBtn={async () => {
                      setDefaultChain("solana");
                      await sleep(0.2);
                      setShowPlayBitzModal(true);
                    }}
                  />
                )
              ) : (
                <Link to={routeNames.unlock} state={{ from: `${location.pathname}${location.search}` }}>
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
                <Link to={routeNames.nftunes}>
                  <DropdownMenuItem>
                    <Music className="mr-2 h-4 w-4" />
                    <span>NF-Tunes Music</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>

              <DropdownMenuGroup>
                <Link to={routeNames.aiworkforce}>
                  <DropdownMenuItem>
                    <Bot className="mr-2 h-4 w-4" />
                    <span>AI Data Workforce</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>

              <DropdownMenuGroup>
                <Link to={routeNames.analytics}>
                  <DropdownMenuItem>
                    <AreaChart className="mr-2 h-4 w-4" />
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

              <DropdownMenuGroup>
                <Link to={routeNames.mywallet}>
                  <DropdownMenuItem>
                    <Wallet className="mr-2 h-4 w-4" />
                    <span>My Wallet</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuLabel className="flex flex-row items-center opacity-50">
                <Store className="mr-2 h-4 w-4" />
                <span>Apps</span>
              </DropdownMenuLabel>

              <DropdownMenuGroup>
                {APP_MAPPINGS.filter((app) => SUPPORTED_APPS.includes(app.routeKey)).map((item) => (
                  <Link to={returnRoute(item.routeKey)} key={item.routeKey}>
                    <DropdownMenuItem className=" ">{item?.appName}</DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuGroup>
              {(isLoggedInMvx || isLoggedInSol) && (
                <>
                  <DropdownMenuSeparator />
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
                </>
              )}

              <DropdownMenuGroup>
                <div className="m-auto bg-gradient-to-r from-yellow-300 to-orange-500 p-[1px] px-[2px] rounded-lg w-fit">
                  <Link to={routeNames.unlock} state={{ from: `${location.pathname}${location.search}` }}>
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

        {showPlayBitzModal && <PlayBitzModal showPlayBitzModel={showPlayBitzModal} handleHideBitzModel={() => setShowPlayBitzModal(false)} />}
      </div>

      {publicKeySol && (
        <div className="flex flex-row justify-between items-center xl:mx-[7.5rem] md:mx-[4rem]">
          <DataNftAirdropsBannerCTA />
        </div>
      )}
    </>
  );
};
