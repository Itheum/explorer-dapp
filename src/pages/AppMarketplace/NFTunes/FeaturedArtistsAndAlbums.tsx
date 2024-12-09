import React, { useEffect, useState } from "react";
import { faHandPointer, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGetAccount } from "@multiversx/sdk-dapp/hooks";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Music2,
  Pause,
  Play,
  Loader2,
  Gift,
  ShoppingCart,
  WalletMinimal,
  Twitter,
  Youtube,
  Link2,
  Globe,
  Droplet,
  FlaskRound,
  HandHeart,
  Heart,
  Zap,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import ratingR from "assets/img/nf-tunes/rating-R.png";
import { Loader } from "components";
import { DEFAULT_BITZ_COLLECTION_SOL } from "config";
import { Button } from "libComponents/Button";
import { sleep } from "libs/utils";
import { gtagGo } from "libs/utils/misc";
import { fetchBitSumAndGiverCountsMvx } from "pages/AppMarketplace/GetBitz/GetBitzMvx/GiveBitzBase";
import { fetchBitSumAndGiverCountsSol } from "pages/AppMarketplace/GetBitz/GetBitzSol/GiveBitzBase";
import { routeNames } from "routes";
import { useNftsStore } from "store/nfts";
import { getArtistsAlbumsData } from "./";

// const dataset = [
//   {
//     artistId: "ar1",
//     name: "Hachi Mugen",
//     slug: "hachi-mugen",
//     bio: "Music saved my life. Not everyone gets a second chance. The Ethereal Enclave collapsed and mostly everyone was left for dead or thought to be now what’s left is us. Those who see opportunity despite tragedy and loss... We were BORN TO R1S3. Hachi Mugen was BORN TO R1S3. Welcome to my story.",
//     img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/hachi-mugen.jpg",
//     dripLink: "https://drip.haus/mugenhachi",
//     xLink: "https://x.com/mugenhachi",
//     creatorWallet: "3ibP6nxaKocQPA8S5ntXSo1Xd4aYSa93QKjPzDaPqAmB",
//     bountyId: "mus_ar1",
//     albums: [
//       {
//         albumId: "ar1_a2",
//         solNftName: "MUSG8 - Infinity Series - Hachi",
//         title: "Infinity Series",
//         desc: "Hachi Mugen meditates on four vibrations to unlock his true potential.",
//         img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/hachi-mugen.jpg",
//         ctaPreviewStream: "https://gateway.pinata.cloud/ipfs/QmX1GASRSSqProbmN61RBcz72EPKh687zumm8FJsaTWEHt",
//         ctaBuy: "https://drip.haus/itheum/set/58ad11e3-a410-4ac0-8b24-88c5fadb6df9",
//         ctaAirdrop: "",
//         bountyId: "mus_ar1_a2",
//       },
//       {
//         albumId: "ar1_a1",
//         solNftName: "MUSG3 - Mugen Cafe EP",
//         title: "Mugen Cafe",
//         desc: "Cafe-style, laid-back, lo-fi tracks to sooth your soothe",
//         img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/hachi-mugen.jpg",
//         ctaPreviewStream: "https://gateway.pinata.cloud/ipfs/QmU82pDyHJRey4YfwtyDDdgwFtubCd5Xg4wPwfKJR8JppQ",
//         ctaBuy: "https://drip.haus/itheum/set/662d1e23-5bc2-454c-989a-123c403465cc",
//         ctaAirdrop: "",
//         bountyId: "mus_ar1_a1",
//       },
//     ],
//   },
//   {
//     artistId: "ar2",
//     name: "YFGP",
//     slug: "yfgp",
//     bio: "YFGP is a cutting-edge sound effects and music designer from Romania, known for merging unique music and art. Specializing in creating for commercials, NFTs, games, and videos, YFGP brings a fresh approach to digital and multimedia projects.",
//     img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/manu.jpg",
//     dripLink: "",
//     xLink: "https://x.com/Manu_Sounds",
//     creatorWallet: "3ibP6nxaKocQPA8S5ntXSo1Xd4aYSa93QKjPzDaPqAmB",
//     bountyId: "mus_ar2",
//     albums: [
//       {
//         albumId: "ar2_a3",
//         solNftName: "MUSG11 - YFGP - Elements",
//         title: "Elements",
//         desc: "Elements represents a combination of two styles, two different type of vibes, in contradiction. That's what life is all about…handling those situations accordingly, knowing which one is which",
//         img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/manu.jpg",
//         ctaPreviewStream: "https://gateway.pinata.cloud/ipfs/QmZDBsTrVN4uscnA8HWFxb9M3d9inctGqcw9NjHcZM2ENo",
//         ctaBuy: "https://drip.haus/itheum/set/2b5772ce-e038-4e22-8d1e-1b5d269b6862",
//         ctaAirdrop: "",
//         bountyId: "mus_ar2_a3",
//       },
//       {
//         albumId: "ar2_a2",
//         solNftName: "MUSG2 - Cranium Beats",
//         title: "Cranium Beats",
//         desc: "Dark Hip Hop Instrumentals Ultimate Album, produced by YFGP; sample-based with underground flavor and dark vibes!",
//         img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/manu.jpg",
//         ctaPreviewStream: "https://gateway.pinata.cloud/ipfs/QmRmMRDD8nEnmDpwpmnoadHrdbWrWradTg3jb4FnN1aWUv",
//         ctaBuy: "https://drip.haus/itheum/set/325fab5f-83ad-4fdb-9a89-aba05452f54b",
//         ctaAirdrop: "",
//         bountyId: "mus_ar2_a2",
//       },
//       {
//         albumId: "ar2_a1",
//         solNftName: "MUSG4 - Retrofy YFGP",
//         title: "Retrofy",
//         desc: "Old-school instrumentals, fat boom-bap drums, 8-bit sounds, lofi flavor, and chill vibes. Take you back to the golden days with nostalgia-filled frequencies!",
//         img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/manu.jpg",
//         ctaPreviewStream: "https://gateway.pinata.cloud/ipfs/QmegnmMCUMAWaW4BdPBQvWFcXcNffKLa4DJo3jYpMg9Z6j",
//         ctaBuy: "https://drip.haus/itheum/set/df074d5e-030f-4338-a2d6-ce430c6a86a9",
//         ctaAirdrop: "",
//         bountyId: "mus_ar2_a1",
//       },
//     ],
//   },
//   {
//     artistId: "ar3",
//     name: "7g0Strike",
//     slug: "7g0strike",
//     bio: "7g0Strike transforms into a generative music artist, using AI tools to create unique tracks. By blending creativity with technology, 7g0Strike shows how AI can inspire new forms of artistic expression for everyone to experience.",
//     img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/7g0Strike.jpg",
//     dripLink: "",
//     xLink: "",
//     creatorWallet: "3ibP6nxaKocQPA8S5ntXSo1Xd4aYSa93QKjPzDaPqAmB",
//     bountyId: "mus_ar3",
//     albums: [
//       {
//         albumId: "ar3_a1",
//         solNftName: "MUSG1 - DnB Music",
//         title: "Love in Disasters",
//         desc: "Blends lyrics about natural disasters and love, crafted entirely with AI tools",
//         img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/7g0Strike.jpg",
//         ctaPreviewStream: "https://gateway.pinata.cloud/ipfs/QmPRwT6Xt3pqtz7RbBfvaVevkZqgzXpKnVg5Hc115QBzfe",
//         ctaBuy: "https://drip.haus/itheum/set/5baed2d8-9f49-41bc-af9e-a2364f79c32a",
//         ctaAirdrop: "",
//         bountyId: "mus_ar3_a1",
//       },
//     ],
//   },
//   {
//     artistId: "ar4",
//     name: "LLLUNA01",
//     slug: "llluna01",
//     bio: "LLLUNA01, a multimedia and multi-genre artist emerging from the streets of Los Angeles. From ghettos to galaxies, he has established himself as a creative force with a diverse skill set focusing on Audio, Visuals, and Culture. From the underground to professionalism, LLLUNA01 looks to help move the music industry forward with education, culture, and technology.",
//     img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/llluna01.jpg",
//     dripLink: "https://drip.haus/llluna01",
//     xLink: "https://twitter.com/0xLuna01",
//     webLink: "https://linktr.ee/llluna01",
//     creatorWallet: "3ibP6nxaKocQPA8S5ntXSo1Xd4aYSa93QKjPzDaPqAmB",
//     bountyId: "mus_ar4",
//     albums: [
//       {
//         albumId: "ar4_a1",
//         solNftName: "MUSG5 - Diaspora EP - LLLUNA01",
//         title: "Diaspora EP",
//         desc: "Diaspora by LLLUNA01 fuses Dubstep, Trap, and Drum & Bass Jungle into a high-energy, bass-heavy journey through global underground sounds.",
//         img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/llluna01.jpg",
//         ctaPreviewStream: "https://api.itheumcloud.com/app_nftunes/music/preview/llluna01-diaspora.mp3",
//         ctaBuy: "https://drip.haus/itheum/set/3866c693-3505-4ec1-b81f-7a4db8e4747d",
//         ctaAirdrop: "",
//         bountyId: "mus_ar4_a1",
//       },
//     ],
//   },
//   {
//     artistId: "ar5",
//     name: "TWOWEEK",
//     slug: "two-week",
//     bio: "SF-based musician/recording artist, photographer and videographer, creating Music NFT's on the blockchain",
//     img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/stephen-snodgrass.jpg",
//     dripLink: "",
//     xLink: "https://x.com/the_economystic",
//     webLink: "",
//     creatorWallet: "3ibP6nxaKocQPA8S5ntXSo1Xd4aYSa93QKjPzDaPqAmB",
//     bountyId: "mus_ar5",
//     albums: [
//       {
//         albumId: "ar5_a1",
//         solNftName: "",
//         mvxDataNftId: "DATANFTFT-e936d4-ae",
//         title: "TWOWEEK EP",
//         desc: "A collection of 3 songs, was composed and recorded by myself over the course of two weeks in the Summer of 2024. The first song of the EP, Otherside, is the first song I ever wrote back in the Summer of 2021. All vocals and instrumentation performed by Stephen Snodgrass.",
//         img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/stephen-snodgrass.jpg",
//         ctaPreviewStream: "https://gateway.pinata.cloud/ipfs/Qme3F97bs7MtkdshibxauHHDNLSvKtvw3nhJ3NiQXpGkGR",
//         ctaBuy: "https://datadex.itheum.io/datanfts/marketplace/DATANFTFT-e936d4-ae",
//         ctaAirdrop: "",
//         bountyId: "mus_ar5_a1",
//       },
//       {
//         albumId: "ar5_a2",
//         solNftName: "",
//         mvxDataNftId: "DATANFTFT-e936d4-d5",
//         title: "Twenty Too",
//         desc: "Twenty Too is a journey; a song about getting lost and growing up and dualities of life and a story to be told. This song was completed - from writing to recording - all within two weeks in June 2024 immediately after completing TWOWEEK EP. All vocals and instrumentation performed by Stephen Snodgrass.",
//         img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/stephen-snodgrass.jpg",
//         ctaPreviewStream: "https://gateway.pinata.cloud/ipfs/QmTR5oySVzn8dXyXG7j1L1o7ZE8BZrYSkYxomr5Mh1Jo6Y",
//         ctaBuy: "https://datadex.itheum.io/datanfts/marketplace/DATANFTFT-e936d4-d5",
//         ctaAirdrop: "",
//         bountyId: "mus_ar5_a2",
//       },
//     ],
//   },
//   {
//     artistId: "ar6",
//     name: "Deep Forest",
//     slug: "deep-forest",
//     bio: "Deep Forest, founded by composer, musician, and producer Eric Mouquet, is a pioneering group in electronic and world music and the first French artist to win a Grammy in 1995 for the album Bohème (Best World Music Album), and has also received a World Music Award and an MTV Award.",
//     img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/deep-forest.jpg",
//     dripLink: "",
//     xLink: "https://twitter.com/deep_forest",
//     webLink: "https://www.deep-forest.fr/",
//     creatorWallet: "3ibP6nxaKocQPA8S5ntXSo1Xd4aYSa93QKjPzDaPqAmB",
//     bountyId: "mus_ar6",
//     albums: [
//       {
//         albumId: "ar6_a1",
//         solNftName: "",
//         mvxDataNftId: "DFEE-72425b",
//         title: "Ethereal Echoes",
//         desc: "The Chronicles of Deep Forest – an exclusive digital EP released to celebrate the 30th anniversary of their Grammy win.",
//         img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/deep-forest.jpg",
//         ctaPreviewStream: "https://explorer.itheum.io/assets/deep-forest-preview-mix-D_1v3lz4.mp3",
//         ctaBuy: "https://datadex.itheum.io/datanfts/marketplace/DFEE-72425b-13",
//         ctaAirdrop: "",
//         bountyId: "mus_ar6_a1",
//       },
//     ],
//   },
//   {
//     artistId: "ar7",
//     name: "3OE",
//     slug: "3oe",
//     bio: "Shaped by space and time, we create immersive soundscapes that reflect shifting moods and environments. Each piece is a journey through evolving expressions, offering a pleasant musical experience.",
//     img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/3oe.jpg",
//     dripLink: "",
//     xLink: "",
//     webLink: "",
//     creatorWallet: "3ibP6nxaKocQPA8S5ntXSo1Xd4aYSa93QKjPzDaPqAmB",
//     bountyId: "mus_ar7",
//     albums: [
//       {
//         albumId: "ar7_a1",
//         solNftName: "MUSG6 - Eternal Echo - 3OE",
//         mvxDataNftId: "",
//         title: "Eternal Echo",
//         desc: "This is the premier Digital EP from 3OE - it delivers immersive soundscapes for a pleasant musical experience.",
//         img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/3oe.jpg",
//         ctaPreviewStream: "https://gateway.pinata.cloud/ipfs/QmVc3L5J2x6RTuxTD3W5f83AEMXD6b9v2DELu5R9vhiStt",
//         ctaBuy: "https://drip.haus/itheum/set/6f744afb-cc1f-4a66-8b85-aaa34da9af9f",
//         ctaAirdrop: "",
//         bountyId: "mus_ar7_a1",
//       },
//     ],
//   },
//   {
//     artistId: "ar8",
//     name: "Waveborn Luminex",
//     slug: "waveborn-luminex",
//     bio: "Waveborn Luminex emerges as a radiant force in the electronic music realm, embodying the essence of soundwaves that shape their very being. With an avatar crafted from vibrant frequencies and pulsating rhythms, they illuminate the dance floor with electrifying energy, that invites listeners to immerse themselves in a cosmic journey.",
//     img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/waveborn-luminex.jpg",
//     dripLink: "",
//     xLink: "",
//     webLink: "",
//     creatorWallet: "3ibP6nxaKocQPA8S5ntXSo1Xd4aYSa93QKjPzDaPqAmB",
//     bountyId: "mus_ar8",
//     albums: [
//       {
//         albumId: "ar8_a1",
//         solNftName: "MUSG7 - Galactic Gravity",
//         solNftNameDevnet: "MUSGDEV1",
//         mvxDataNftId: "",
//         title: "Suno",
//         desc: "This is the premier Digital EP from Waveborn Luminex that delivers a unique electro pop musical experience.",
//         img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/waveborn-luminex.jpg",
//         ctaPreviewStream: "https://gateway.pinata.cloud/ipfs/QmeTrvB5o5Ki8MALogN9tjHmJsai4wpBy8EYA38JHK2ceF",
//         ctaBuy: "https://drip.haus/itheum/set/0bba5f0b-4449-458b-b717-083eefa53a2c",
//         ctaAirdrop: "",
//         bountyId: "mus_ar8_a1",
//       },
//     ],
//   },
//   {
//     artistId: "ar9",
//     name: "Yoshiro Mare",
//     slug: "yoshiro-mare",
//     bio: "Interdimensional Sound Sculptor Intentionally Creating Energetically Programmed Fields through 432 Hertz Conscious Electronic Music Portals on the Blockchain. The Code Path of The Warrior, focuses on raising awareness around Mental Health, Addiction and Serving a Higher Purpose.",
//     img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/yoshiro-mare.jpg",
//     dripLink: "",
//     xLink: "https://x.com/YoshiroMare",
//     webLink: "https://bonfire.xyz/YoshiroMare",
//     creatorWallet: "3ibP6nxaKocQPA8S5ntXSo1Xd4aYSa93QKjPzDaPqAmB",
//     bountyId: "mus_ar9",
//     albums: [
//       {
//         albumId: "ar9_a1",
//         solNftName: "MUSG9 - Yoshiro Mare - TWR",
//         mvxDataNftId: "",
//         title: "They Were Right",
//         desc: "Unique and original digital EP from Yoshiro Mare that delivers energetically charged deep house music.",
//         img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/yoshiro-mare.jpg",
//         ctaPreviewStream: "https://gateway.pinata.cloud/ipfs/QmSMU6Y1fX4q6rVbMfJKd1jDhGpNbrDFCxoYP8vRWnuQqe",
//         ctaBuy: "https://drip.haus/itheum/set/6f727def-e28a-4b96-8670-077d09469a1c",
//         ctaAirdrop: "",
//         bountyId: "mus_ar9_a1",
//       },
//     ],
//   },
//   {
//     artistId: "ar10",
//     name: "Flaka & CipriSLG",
//     slug: "flaka-ciprislg",
//     bio: "Innovative publishers of Web3 education and content, featuring the Mic in Flames Web3 podcast—a groundbreaking series that can be collected as a Data NFT. Owning this Data NFT grants access to stream each episode. Introducing the world's first dynamic Podcast NFT!",
//     img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/mic-in-flames.jpg",
//     dripLink: "",
//     xLink: "https://x.com/GenuLemny",
//     webLink: "",
//     creatorWallet: "3ibP6nxaKocQPA8S5ntXSo1Xd4aYSa93QKjPzDaPqAmB",
//     bountyId: "mus_ar10",
//     albums: [
//       {
//         albumId: "ar10_a1",
//         solNftName: "PODG1 - Mic In Flames",
//         mvxDataNftId: "",
//         isPodcast: "1",
//         title: "Mic in Flames Podcast",
//         desc: "Mic in Flames is an educational Web3 space covering topics like investment DAOs, blockchain social apps, Web3 RWAs, and tools. It dives deeper into Web3, exploring innovations like Data NFTs, blending content with unique utility.",
//         img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/mic-in-flames.jpg",
//         ctaPreviewStream: "https://gateway.pinata.cloud/ipfs/QmV2R1NS1AqLFf3vwyB1JNtCtQC8Rf5cWY7SgjGnfvuN8T",
//         ctaBuy: "https://drip.haus/itheum/set/7547adb0-c840-4157-a01f-d813177e91eb",
//         ctaAirdrop: "",
//         bountyId: "mus_ar10_a1",
//       },
//     ],
//   },
//   {
//     artistId: "ar11",
//     name: "Framework Fortune",
//     slug: "framework-fortune",
//     bio: "My mission is to onboard more Music Artists to blockchain and NFTs, assisting them in breaking free from the constraints of the traditional music industry. I aim to create blueprints for novel methods of monetizing music, where artists and their communities mutually benefit and grow together. This entails transcending the conventional boundaries and nurturing genuine growth for artists and their supporters. I am the First Experiment...",
//     img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/framework-fortune.jpg",
//     dripLink: "https://drip.haus/framemusic",
//     xLink: "https://x.com/FramewkFortune",
//     webLink: "https://frameworkfortune.com",
//     ytLink: "https://www.youtube.com/@frameworkfortune",
//     otherLink1: "https://www.youtube.com/@framewk",
//     creatorWallet: "3ibP6nxaKocQPA8S5ntXSo1Xd4aYSa93QKjPzDaPqAmB",
//     bountyId: "mus_ar11",
//     albums: [
//       {
//         albumId: "ar11_a1",
//         solNftName: "MUSG10 - Frame - Frame's Favs V1",
//         mvxDataNftId: "",
//         isExplicit: "1",
//         title: "Frame Favs V1",
//         desc: "Playlist of my personal favorite tracks I’ve released on my DRiP Profile. Join me on my DRiP music journey to break down the walls of the traditional music industry between Artists & Fans!!!",
//         img: "https://api.itheumcloud.com/app_nftunes/images/artist_profile/framework-fortune.jpg",
//         ctaPreviewStream: "https://gateway.pinata.cloud/ipfs/QmcJHcxsAETpStEnYZyFEp18HW18Yrt2PbPgWje1ZHgBsn ",
//         ctaBuy: "https://drip.haus/itheum/set/02657764-7fd4-4104-abd4-498488f443e2",
//         ctaAirdrop: "",
//         bountyId: "mus_ar11_a1",
//       },
//     ],
//   },
// ];

type FeaturedArtistsAndAlbumsProps = {
  mvxNetworkSelected: boolean;
  viewSolData: (e: number) => void;
  viewMvxData: (e: number) => void;
  stopPreviewPlayingNow?: boolean;
  featuredArtistDeepLinkSlug?: string;
  onPlayHappened?: any;
  checkOwnershipOfAlbum: (e: any) => any;
  openActionFireLogic?: any;
  onSendPowerUp: (e: any) => any;
  refreshBitzCountsForBounty: { bitzValToGift: number; giveBitzToCampaignId: string } | undefined;
};

export const FeaturedArtistsAndAlbums = (props: FeaturedArtistsAndAlbumsProps) => {
  const {
    mvxNetworkSelected,
    viewSolData,
    viewMvxData,
    openActionFireLogic,
    stopPreviewPlayingNow,
    featuredArtistDeepLinkSlug,
    onPlayHappened,
    checkOwnershipOfAlbum,
    onSendPowerUp,
    refreshBitzCountsForBounty,
  } = props;
  const { publicKey: publicKeySol } = useWallet();
  const { address: addressMvx } = useGetAccount();
  const [audio] = useState(new Audio());
  const [isPreviewPlaying, setIsPreviewPlaying] = useState<boolean>(false);
  const [previewPlayingForAlbumId, setPreviewPlayingForAlbumId] = useState<string | undefined>();
  const [previewIsReadyToPlay, setPreviewIsReadyToPlay] = useState(false);
  const [selArtistId, setSelArtistId] = useState<string>("ar1");
  const [userInteractedWithTabs, setUserInteractedWithTabs] = useState<boolean>(false);
  const [artistProfile, setArtistProfile] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("00:00");
  const [progress, setProgress] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFreeDropSampleWorkflow, setIsFreeDropSampleWorkflow] = useState(false);
  const [isSigmaWorkflow, setIsSigmaWorkflow] = useState(false);
  const { solBitzNfts } = useNftsStore();
  const [bountyToBitzLocalMapping, setBountyToBitzLocalMapping] = useState<any>({});
  const [userHasNoBitzDataNftYet, setUserHasNoBitzDataNftYet] = useState(false);
  const [artistAlbumDataset, setArtistAlbumDataset] = useState<any[]>([]);
  const [artistAlbumDataLoading, setArtistAlbumDataLoading] = useState<boolean>(true);
  const {
    network: { chainId: chainID },
  } = useGetNetworkConfig();

  function eventToAttachEnded() {
    audio.src = "";
    audio.currentTime = 0;
    audio.pause();
    setPreviewIsReadyToPlay(false);
    setIsPreviewPlaying(false);
    setPreviewPlayingForAlbumId(undefined);
  }

  function eventToAttachTimeUpdate() {
    updateProgress();
  }

  function eventToAttachCanPlayThrough() {
    // Audio is ready to be played
    setPreviewIsReadyToPlay(true);
    // play the song
    if (audio.currentTime == 0) {
      audio.play();
    }
  }

  useEffect(() => {
    const isHlWorkflowDeepLink = searchParams.get("hl");

    if (isHlWorkflowDeepLink === "sample") {
      setIsFreeDropSampleWorkflow(true);
    } else if (isHlWorkflowDeepLink === "sigma") {
      setIsSigmaWorkflow(true);
    }

    audio.addEventListener("ended", eventToAttachEnded);
    audio.addEventListener("timeupdate", eventToAttachTimeUpdate);
    audio.addEventListener("canplaythrough", eventToAttachCanPlayThrough);

    (async () => {
      sleep(5);
      const allArtistsAlbumsData = await getArtistsAlbumsData();
      // const allArtistsAlbumsData = dataset;
      sleep(5);
      setArtistAlbumDataset(allArtistsAlbumsData);
      setArtistAlbumDataLoading(false);
    })();

    return () => {
      audio.pause();
      audio.removeEventListener("ended", eventToAttachEnded);
      audio.removeEventListener("timeupdate", eventToAttachTimeUpdate);
      audio.removeEventListener("canplaythrough", eventToAttachCanPlayThrough);
    };
  }, []);

  useEffect(
    () => () => {
      // on unmount we have to stp playing as for some reason the play continues always otherwise
      playPausePreview(); // with no params wil always go into the stop logic
    },
    []
  );

  useEffect(() => {
    if (artistAlbumDataset.length === 0) {
      return;
    }

    playPausePreview(); // with no params wil always go into the stop logic

    const selDataItem = artistAlbumDataset.find((i) => i.artistId === selArtistId);

    setArtistProfile(selDataItem);

    // if we don't do the userInteractedWithTabs, then even on page load, we go update the url with artist-profile which we don't want
    if (selDataItem && selDataItem.slug && userInteractedWithTabs) {
      // update the deep link param
      setSearchParams({ "artist-profile": selDataItem.slug });
    }

    // we clone selDataItem here so as to no accidentally mutate things
    // we debounce this, so that - if the user is jumping tabs.. it wait until they stop at a tab for 2.5 S before running the complex logic
    debounced_fetchBitzPowerUpsAndLikesForSelectedArtist({ ...selDataItem });
  }, [selArtistId, artistAlbumDataset]);

  useEffect(() => {
    if (solBitzNfts.length === 0) {
      setUserHasNoBitzDataNftYet(true);
    } else {
      setUserHasNoBitzDataNftYet(false);
    }
  }, [solBitzNfts]);

  useEffect(() => {
    if (artistAlbumDataset.length === 0) {
      return;
    }

    if (featuredArtistDeepLinkSlug) {
      const findArtistBySlug = artistAlbumDataset.find((i) => i.slug === featuredArtistDeepLinkSlug);

      if (findArtistBySlug) {
        setSelArtistId(findArtistBySlug.artistId);
      }
    }
  }, [featuredArtistDeepLinkSlug, artistAlbumDataset]);

  useEffect(() => {
    if (stopPreviewPlayingNow) {
      playPausePreview(); // with no params wil always go into the stop logic
    }
  }, [stopPreviewPlayingNow]);

  useEffect(() => {
    if (refreshBitzCountsForBounty) {
      console.log("fetchBitzPowerUpsAndLikesForSelectedArtist Flush from cache and reload");

      const _bountyToBitzLocalMapping: Record<any, any> = { ...bountyToBitzLocalMapping };
      const currMappingVal = _bountyToBitzLocalMapping[refreshBitzCountsForBounty.giveBitzToCampaignId];

      if (typeof currMappingVal !== "undefined") {
        _bountyToBitzLocalMapping[refreshBitzCountsForBounty.giveBitzToCampaignId] = {
          bitsSum: currMappingVal.bitsSum + refreshBitzCountsForBounty.bitzValToGift,
          syncedOn: Date.now(),
        };
      } else {
        _bountyToBitzLocalMapping[refreshBitzCountsForBounty.giveBitzToCampaignId] = {
          bitsSum: refreshBitzCountsForBounty.bitzValToGift,
          syncedOn: Date.now(),
        };
      }

      setBountyToBitzLocalMapping(_bountyToBitzLocalMapping);
    }
  }, [refreshBitzCountsForBounty]);

  const debounced_fetchBitzPowerUpsAndLikesForSelectedArtist = useDebouncedCallback((selDataItem: any) => {
    fetchBitzPowerUpsAndLikesForSelectedArtist(selDataItem);
  }, 2500);

  // as the user swaps tabs, we fetch the likes and power-up counts and cache them locally
  async function fetchBitzPowerUpsAndLikesForSelectedArtist(selDataItem: any) {
    if (!selDataItem) {
      return;
    }

    const _bountyToBitzLocalMapping: Record<any, any> = { ...bountyToBitzLocalMapping };

    // cache for 15 seconds
    if (!bountyToBitzLocalMapping[selDataItem.bountyId] || Date.now() - bountyToBitzLocalMapping[selDataItem.bountyId].syncedOn > 15 * 1000) {
      console.log("fetchBitzPowerUpsAndLikesForSelectedArtist NO cached");

      let response;
      let collectionIdToUseOnSol = "";

      // we default the values to solana (i.e. if the user is NOT logged in, they see solana donations)
      if (addressMvx) {
        response = await fetchBitSumAndGiverCountsMvx({ chainID, getterAddr: selDataItem?.creatorWallet || "", campaignId: selDataItem?.bountyId || "" });
      } else {
        collectionIdToUseOnSol = userHasNoBitzDataNftYet ? DEFAULT_BITZ_COLLECTION_SOL : solBitzNfts[0].grouping[0].group_value;

        response = await fetchBitSumAndGiverCountsSol({
          getterAddr: selDataItem?.creatorWallet || "",
          campaignId: selDataItem?.bountyId || "",
          collectionId: collectionIdToUseOnSol,
        });
      }

      _bountyToBitzLocalMapping[selDataItem?.bountyId] = {
        syncedOn: Date.now(),
        bitsSum: response.bitsSum,
      };

      // lets make a list of album bounties as well and queue it to be fetched
      const albumBountyIds = selDataItem.albums.map((i: any) => i.bountyId);

      if (albumBountyIds.length > 0) {
        let albumBitzPowerUpPromises: any[] = [];

        if (addressMvx) {
          albumBitzPowerUpPromises = albumBountyIds.map((albumBounty: any) => {
            return fetchBitSumAndGiverCountsMvx({
              chainID,
              getterAddr: selDataItem?.creatorWallet || "",
              campaignId: albumBounty || "",
            });
          });
        } else {
          albumBitzPowerUpPromises = albumBountyIds.map((albumBounty: any) => {
            return fetchBitSumAndGiverCountsSol({
              getterAddr: selDataItem?.creatorWallet || "",
              campaignId: albumBounty || "",
              collectionId: collectionIdToUseOnSol,
            });
          });
        }

        Promise.all(albumBitzPowerUpPromises).then((values) => {
          albumBountyIds.forEach((albumBountyId: any, idx: number) => {
            _bountyToBitzLocalMapping[albumBountyId] = {
              syncedOn: Date.now(),
              bitsSum: values[idx].bitsSum,
            };
          });

          setBountyToBitzLocalMapping(_bountyToBitzLocalMapping);
          // console.log({ receivedBitzSum: response.bitsSum, giverCounts: response.giverCounts });
        });
      } else {
        setBountyToBitzLocalMapping(_bountyToBitzLocalMapping);
      }
    } else {
      console.log("fetchBitzPowerUpsAndLikesForSelectedArtist YES cached");
    }
  }

  async function playPausePreview(previewStreamUrl?: string, albumId?: string) {
    if (previewStreamUrl && albumId && (!isPreviewPlaying || previewPlayingForAlbumId !== albumId)) {
      onPlayHappened(true); // inform parent to stop any other playing streams on its ui

      resetPreviewPlaying();
      // await sleep(0.1); // this seems to help when some previews overlapped (took it out as it did not seem to do much when testing)

      setPreviewIsReadyToPlay(false);
      setIsPreviewPlaying(true);
      setPreviewPlayingForAlbumId(albumId);

      try {
        const blob = await fetch(previewStreamUrl).then((r) => r.blob());
        let blobUrl = URL.createObjectURL(blob);

        console.log("Music preview playing via BLOB");

        // ios safari seems to not play the music so tried to use blobs like in the other Audio component like Radio
        // but still does not play -- need to debug more (see https://corevo.io/the-weird-case-of-video-streaming-in-safari/)
        audio.src = blobUrl;
      } catch (e) {
        console.log("Music preview playing via original URL");

        audio.src = previewStreamUrl; // this fetches the data, but it may not be ready to play yet until canplaythrough fires
      }

      audio.load();
      updateProgress();
      audio.currentTime = 0;
    } else {
      resetPreviewPlaying();
    }
  }

  function resetPreviewPlaying() {
    audio.src = "";
    audio.currentTime = 0;
    audio.pause();
    setPreviewIsReadyToPlay(false);
    setIsPreviewPlaying(false);
    setPreviewPlayingForAlbumId(undefined);
  }

  const updateProgress = () => {
    setCurrentTime(audio.currentTime ? formatTime(audio.currentTime) : "00:00");
    setDuration(audio.duration ? formatTime(audio.duration) : "00:00");
    let _percentage = (audio.currentTime / audio.duration) * 100;
    if (isNaN(_percentage)) _percentage = 0;
    setProgress(_percentage);
  };

  const formatTime = (_seconds: number) => {
    const minutes = Math.floor(_seconds / 60);
    const remainingSeconds = Math.floor(_seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, "0"); // Ensure two digits
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const userLoggedInWithWallet = publicKeySol || addressMvx;

  return (
    <div className="flex flex-col justify-center items-center w-full p-3 md:p-6 xl:pb-0">
      <div className="flex flex-col mb-16 xl:mb-32 justify-center w-[100%] items-center xl:items-start">
        <div className="flex flex-row rounded-lg mb-6 md:mb-12 px-8 xl:px-16 text-center gap-4 bg-[#333] dark:bg-primary md:text-2xl xl:text-3xl justify-center items-center ">
          <Music2 className="text-secondary" />
          <span className="text-secondary">Artists & Albums</span>
          <Music2 className="text-secondary" />
        </div>

        <div id="artist-profile" className="flex flex-col md:flex-row w-[100%] items-start bgx-purple-900">
          {artistAlbumDataLoading || artistAlbumDataset.length === 0 ? (
            <div className="flex flex-col justify-center w-[100%]">
              {artistAlbumDataLoading ? (
                <div className="m-auto">
                  <Loader noText />
                  Artist and Albums powering up...
                </div>
              ) : (
                <div className="m-auto">⚠️ Artist and Albums unavailable</div>
              )}
            </div>
          ) : (
            <>
              <div className="artist-list flex py-2 pb-5 mb-5 md:mb-0 md:pt-0 md:flex-col md:justify-center items-center w-[320px] md:w-[350px] gap-5 overflow-x-scroll md:overflow-x-auto bbg-800">
                {artistAlbumDataset.map((artist: any) => (
                  <div
                    key={artist.artistId}
                    className={`flex flex-col p-5 items-center w-[200px] md:w-[80%] xl:w-[100%] bg-background rounded-xl border border-primary/50 ${artist.artistId === selArtistId ? "bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-30% to-[#5D3899] to-95%" : "cursor-pointer"}`}
                    onClick={() => {
                      if (artist.artistId !== selArtistId) {
                        setSelArtistId(artist.artistId);
                        setUserInteractedWithTabs(true);

                        gtagGo("NtuArAl", "ViewProfile", "Artist", artist.artistId);
                      }
                    }}>
                    <h2 className={`${artist.artistId === selArtistId ? "!text-white" : ""} !text-lg lg:!text-xl text-nowrap text-center`}>{artist.name}</h2>
                  </div>
                ))}
              </div>

              <div className="flex flex-col xl:flex-row justify-center items-center gap-8 w-full mt-2 md:mt-0 bbg-blue-700">
                <div className="flex flex-col gap-4 p-8 items-start md:w-[90%] bg-background rounded-xl border border-primary/50 min-h-[350px]">
                  {!artistProfile ? (
                    <div>Loading</div>
                  ) : (
                    <>
                      <div className="artist-bio w-[300px] md:w-full">
                        <div
                          className="border-[0.5px] border-neutral-500/90 h-[100px] md:h-[320px] md:w-[100%] bg-no-repeat bg-cover rounded-xl"
                          style={{
                            "backgroundImage": `url(${artistProfile.img})`,
                          }}></div>

                        <div className="mt-5 flex flex-col md:flex-row items-center">
                          <div className="relative">
                            {userLoggedInWithWallet ? (
                              <Button
                                className="!text-black text-sm px-[2.35rem] bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 mx-2 cursor-pointer rounded-none rounded-l-sm"
                                disabled={!publicKeySol && !addressMvx}
                                onClick={() => {
                                  onSendPowerUp({
                                    creatorIcon: artistProfile.img,
                                    creatorName: artistProfile.name,
                                    giveBitzToWho: artistProfile.creatorWallet,
                                    giveBitzToCampaignId: artistProfile.bountyId,
                                  });
                                }}>
                                <>
                                  <Zap className="w-4 h-4" />
                                  <span className="ml-2">Power-Up Musician</span>
                                </>
                              </Button>
                            ) : (
                              <Link to={routeNames.unlock} state={{ from: `${location.pathname}${location.search}` }}>
                                <Button
                                  className="text-sm mx-2 cursor-pointer !text-orange-500 dark:!text-yellow-300 rounded-none rounded-l-sm"
                                  variant="outline">
                                  <>
                                    <WalletMinimal />
                                    <span className="ml-2">Login to Power-Up Musician</span>
                                  </>
                                </Button>
                              </Link>
                            )}
                            {isSigmaWorkflow && (
                              <div className="animate-bounce p-3 text-sm absolute w-[110px] ml-[-18px] mt-[12px] text-center">
                                <div className="m-auto mb-[2px] bg-white dark:bg-slate-800 p-2 w-10 h-10 ring-1 ring-slate-900/5 dark:ring-slate-200/20 shadow-lg rounded-full flex items-center justify-center">
                                  <FontAwesomeIcon icon={faHandPointer} />
                                </div>
                                <span className="text-center">Click To Vote</span>
                              </div>
                            )}
                          </div>

                          <div
                            className={`${userLoggedInWithWallet && typeof bountyToBitzLocalMapping[artistProfile.bountyId]?.bitsSum !== "undefined" ? "-ml-[12px] hover:bg-orange-100 dark:hover:text-orange-500 cursor-pointer" : "ml-0"} text-center text-lg h-[40px] text-orange-500 dark:text-[#fde047] border border-orange-500 dark:border-yellow-300 mt-2 md:mt-0 rounded-r md:min-w-[100px] flex items-center justify-center `}>
                            {typeof bountyToBitzLocalMapping[artistProfile.bountyId]?.bitsSum === "undefined" ? (
                              <FontAwesomeIcon spin={true} color="#fde047" icon={faSpinner} size="lg" className="m-2" />
                            ) : (
                              <div
                                className="p-10 md:p-10"
                                onClick={() => {
                                  if (userLoggedInWithWallet) {
                                    onSendPowerUp({
                                      creatorIcon: artistProfile.img,
                                      creatorName: artistProfile.name,
                                      giveBitzToWho: artistProfile.creatorWallet,
                                      giveBitzToCampaignId: artistProfile.bountyId,
                                    });
                                  }
                                }}>
                                <span className="font-bold text-sm">Total Power</span>
                                <span className="ml-1 mt-[10px] text-sm">{bountyToBitzLocalMapping[artistProfile.bountyId]?.bitsSum}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className={`${isSigmaWorkflow ? "opacity-[0.1]" : ""}`}>
                          <p className="artist-who mt-5">{artistProfile.bio}</p>

                          {(artistProfile.dripLink !== "" ||
                            artistProfile.xLink !== "" ||
                            artistProfile.webLink !== "" ||
                            artistProfile.ytLink !== "" ||
                            artistProfile.otherLink1 !== "") && (
                            <div className="flex flex-col md:flex-row mt-5">
                              {artistProfile.dripLink && (
                                <a className="underline hover:no-underline mx-2 text-sm mt-1" href={artistProfile.dripLink} target="_blank">
                                  <div className="border-[0.5px] text-center p-2 m-2 flex flex-col justify-center align-middle">
                                    <Droplet className="m-auto w-5" />
                                    Artist on Drip
                                  </div>
                                </a>
                              )}
                              {artistProfile.xLink && (
                                <a className="underline hover:no-underline mx-2 text-sm mt-1" href={artistProfile.xLink} target="_blank">
                                  <div className="border-[0.5px] text-center p-2 m-2 flex flex-col justify-center align-middle">
                                    <Twitter className="m-auto w-5" />
                                    Artist on X
                                  </div>
                                </a>
                              )}
                              {artistProfile.ytLink && (
                                <a className="underline hover:no-underline mx-2 text-sm mt-1" href={artistProfile.ytLink} target="_blank">
                                  <div className="border-[0.5px] text-center p-2 m-2 flex flex-col justify-center align-middle">
                                    <Youtube className="m-auto w-5" />
                                    Artist on YouTube
                                  </div>
                                </a>
                              )}
                              {artistProfile.webLink && (
                                <a className="underline hover:no-underline mx-2 text-sm mt-1" href={artistProfile.webLink} target="_blank">
                                  <div className="border-[0.5px] text-center p-2 m-2 flex flex-col justify-center align-middle">
                                    <Globe className="m-auto w-5" />
                                    Artist Website
                                  </div>
                                </a>
                              )}
                              {artistProfile.otherLink1 && (
                                <a className="underline hover:no-underline mx-2 text-sm mt-1" href={artistProfile.otherLink1} target="_blank">
                                  <div className="border-[0.5px] text-center p-2 m-2 flex flex-col justify-center align-middle">
                                    <Link2 className="m-auto w-5" />
                                    More Content
                                  </div>
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="album-list w-[300px] lg:w-full">
                        <p className="mt-5 mb-5 text-xl font-bold">NF-Tunes Discography</p>

                        {artistProfile.albums.map((album: any, idx: number) => (
                          <div key={album.albumId} className="album flex flex-col h-[100%] mb-3 p-5 border">
                            <div className="albumDetails flex flex-col md:flex-row">
                              <div
                                className="albumImg bg1-red-200 border-[0.5px] border-neutral-500/90 h-[150px] w-[150px] bg-no-repeat bg-cover rounded-xl m-auto"
                                style={{
                                  "backgroundImage": `url(${album.img})`,
                                }}></div>

                              <div className="albumText bg1-red-300 flex flex-col mt-5 md:mt-0 md:ml-5 md:pr-2 flex-1 mb-5 md:mb-0">
                                <h3 className="!text-xl mb-2 flex items-baseline">
                                  <span className="text-3xl mr-1 opacity-50">{`${idx + 1}. `}</span>
                                  <span>{`${album.title}`}</span>
                                  {album.isExplicit && album.isExplicit === "1" && (
                                    <img
                                      className="max-h-[20px] ml-[10px] dark:bg-white"
                                      src={ratingR}
                                      alt="Warning: Explicit Content"
                                      title="Warning: Explicit Content"
                                    />
                                  )}
                                </h3>
                                <p className="ml-2">{album.desc}</p>
                              </div>

                              <div className="albumLikes bg1-red-600 md:w-[135px] flex flex-col items-center">
                                <div
                                  className={`${userLoggedInWithWallet && typeof bountyToBitzLocalMapping[album.bountyId]?.bitsSum !== "undefined" ? " hover:bg-orange-100 cursor-pointer dark:hover:text-orange-500" : ""} text-center mb-1 text-lg h-[40px] text-orange-500 dark:text-[#fde047] border border-orange-500 dark:border-yellow-300 rounded w-[100px] flex items-center justify-center`}>
                                  {typeof bountyToBitzLocalMapping[album.bountyId]?.bitsSum === "undefined" ? (
                                    <FontAwesomeIcon spin={true} color="#fde047" icon={faSpinner} size="lg" className="m-2" />
                                  ) : (
                                    <div
                                      className="p-5 md:p-0 flex items-center gap-2"
                                      title={userLoggedInWithWallet ? "Like This Album With 5 BiTz" : "Login to Like This Album"}
                                      onClick={() => {
                                        if (userLoggedInWithWallet) {
                                          onSendPowerUp({
                                            creatorIcon: album.img,
                                            creatorName: `${artistProfile.name}'s ${album.title}`,
                                            giveBitzToWho: artistProfile.creatorWallet,
                                            giveBitzToCampaignId: album.bountyId,
                                            isLikeMode: true,
                                          });
                                        }
                                      }}>
                                      {bountyToBitzLocalMapping[album.bountyId]?.bitsSum}
                                      <Heart className="w-4 h-4" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="albumActions bg1-red-500 mt-3 flex flex-col lg:flex-row space-y-2 lg:space-y-0">
                              {album.ctaPreviewStream && (
                                <Button
                                  disabled={isPreviewPlaying && !previewIsReadyToPlay}
                                  className="!text-white text-sm mx-2 bg-gradient-to-br from-[#737373] from-5% via-[#A76262] via-30% to-[#5D3899] to-95% cursor-pointer"
                                  onClick={() => {
                                    playPausePreview(album.ctaPreviewStream, album.albumId);

                                    gtagGo("NtuArAl", "PlayPausePrev", "Album", album.albumId);
                                  }}>
                                  {isPreviewPlaying && previewPlayingForAlbumId === album.albumId ? (
                                    <>
                                      {!previewIsReadyToPlay ? <Loader2 className="animate-spin" /> : <Pause />}
                                      <span className="ml-2"> {currentTime} - Stop Playing </span>
                                    </>
                                  ) : (
                                    <>
                                      <Play />
                                      <span className="ml-2">Play Preview</span>
                                    </>
                                  )}
                                </Button>
                              )}

                              {/* when not logged in, show this to convert the wallet into user account */}
                              {!mvxNetworkSelected && !publicKeySol && (
                                <div className="relative">
                                  <Link to={routeNames.unlock} state={{ from: `${location.pathname}${location.search}` }}>
                                    <Button className="text-sm mx-2 cursor-pointer !text-orange-500 dark:!text-yellow-300" variant="outline">
                                      <>
                                        <WalletMinimal />
                                        <span className="ml-2">Login to Check Ownership</span>
                                      </>
                                    </Button>
                                  </Link>
                                  {isFreeDropSampleWorkflow && (
                                    <div className="animate-bounce p-3 text-sm absolute w-[110px] ml-[-18px] mt-[12px] text-center">
                                      <div className="m-auto mb-[2px] bg-white dark:bg-slate-800 p-2 w-10 h-10 ring-1 ring-slate-900/5 dark:ring-slate-200/20 shadow-lg rounded-full flex items-center justify-center">
                                        <FontAwesomeIcon icon={faHandPointer} />
                                      </div>
                                      <span className="text-center">Click To Play</span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {mvxNetworkSelected && !addressMvx && (
                                <Link to={routeNames.unlock} state={{ from: `${location.pathname}${location.search}` }}>
                                  <Button className="text-sm mx-2 cursor-pointer !text-orange-500 dark:!text-yellow-300" variant="outline">
                                    <>
                                      <WalletMinimal />
                                      <span className="ml-2">Login to Check Ownership</span>
                                    </>
                                  </Button>
                                </Link>
                              )}

                              <>
                                {checkOwnershipOfAlbum(album) > -1 && (
                                  <div className="relative p-2 md:p-0">
                                    <Button
                                      disabled={isPreviewPlaying && !previewIsReadyToPlay}
                                      className="!text-black w-full text-sm px-[2.35rem] bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100 cursor-pointer"
                                      onClick={() => {
                                        const albumInOwnershipListIndex = checkOwnershipOfAlbum(album);

                                        if (albumInOwnershipListIndex > -1) {
                                          if (!mvxNetworkSelected) {
                                            viewSolData(albumInOwnershipListIndex);
                                          } else {
                                            viewMvxData(albumInOwnershipListIndex);
                                          }
                                        }

                                        if (openActionFireLogic) {
                                          openActionFireLogic();
                                        }

                                        gtagGo("NtuArAl", "PlayAlbum", "Album", album.albumId);
                                      }}>
                                      <>
                                        <Music2 />
                                        <span className="ml-2">Play Album</span>
                                      </>
                                    </Button>
                                    {isFreeDropSampleWorkflow && (
                                      <div className="animate-bounce p-3 text-sm absolute w-[110px] ml-[-18px] mt-[12px] text-center">
                                        <div className="m-auto mb-[2px] bg-white dark:bg-slate-800 p-2 w-10 h-10 ring-1 ring-slate-900/5 dark:ring-slate-200/20 shadow-lg rounded-full flex items-center justify-center">
                                          <FontAwesomeIcon icon={faHandPointer} />
                                        </div>
                                        <span className="text-center">Click To Play</span>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {album.ctaBuy && (
                                  <Button
                                    className="!text-black text-sm px-[2.35rem] bottom-1.5 bg-gradient-to-r from-yellow-300 to-orange-500 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100 mx-2 cursor-pointer"
                                    onClick={() => {
                                      gtagGo("NtuArAl", "BuyAlbum", "Album", album.albumId);

                                      window.open(album.ctaBuy)?.focus();
                                    }}>
                                    <>
                                      <ShoppingCart />
                                      <span className="ml-2">{checkOwnershipOfAlbum(album) > -1 ? "Buy More Album Copies" : "Buy Album"}</span>
                                    </>
                                  </Button>
                                )}
                                {album.ctaAirdrop && (
                                  <Button
                                    className="!text-white text-sm px-[2.35rem] bottom-1.5 bg-gradient-to-r from-yellow-700 to-orange-800 transition ease-in-out delay-150 duration-300 hover:translate-y-1.5 hover:-translate-x-[8px] hover:scale-100 mx-2 cursor-pointer"
                                    onClick={() => {
                                      gtagGo("NtuArAl", "GetAlbum", "Album", album.albumId);

                                      window.open(album.ctaAirdrop)?.focus();
                                    }}>
                                    <>
                                      <Gift />
                                      <span className="ml-2">Get Album Airdrop!</span>
                                    </>
                                  </Button>
                                )}
                              </>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
