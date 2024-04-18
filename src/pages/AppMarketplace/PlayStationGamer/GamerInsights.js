import React, { useEffect, useState } from "react";
// import { Text, HStack, Box, Spacer, Stack, Heading, Flex, useToast, useColorMode } from '@chakra-ui/react';
// import GenericSimpleAreaTimeSeries from 'Charts/GenericSimpleAreaTimeSeries';
// import GenericTimeSeries from 'Charts/GenericTimeSeries';
import ActivityHeatmap from "components/Charts/ActivityHeatmap";
// import ActivityFullTimeSeries from 'Charts/ActivityFullTimeSeries';
// import SimpleFullTimeSeries from 'Charts/SimpleFullTimeSeries';

// import myNFMe from 'img/my-nfme.png';
// import myDataNFT from 'img/my-datanft-2.png';
// import myClaimBG from 'img/reputation-claim-bg-1.png';
// import myOAT1 from 'img/reputation-oat-1.png';
// import myOAT2 from 'img/reputation-oat-2.png';
// import myOAT3 from 'img/reputation-oat-3.png';

function GamerInsights({ gamerId, gamerData }) {
  const [userId, setUserId] = useState(null);
  // const { colorMode, toggleColorMode } = useColorMode();

  const [readingsDiscordBotUserOnGuildActivity, setReadingsDiscordBotUserOnGuildActivity] = useState([]);
  const [readingsTrdPtyWonderHeroGameApi, setReadingsTrdPtyWonderHeroGameApi] = useState([]);
  const [readingsOnChainAddrTxOnCon, setReadingsOnChainAddrTxOnCon] = useState([]);
  const [readingsOnChainAddrTxOnConErd, setReadingsOnChainAddrTxOnConErd] = useState([]);
  const [gamingActivityAllData, setGamingActivityAllData] = useState([]);
  const [socialActivityAllData, setSocialActivityAllData] = useState([]);

  useEffect(() => {
    if (gamerData) {
      setUserId(gamerId);
      setReadingsOnChainAddrTxOnCon(gamerData.readingsOnChainAddrTxOnCon);
      setReadingsOnChainAddrTxOnConErd(gamerData.readingsOnChainAddrTxOnConErd);
      setReadingsDiscordBotUserOnGuildActivity(gamerData.readingsDiscordBotUserOnGuildActivity);
      setReadingsTrdPtyWonderHeroGameApi(gamerData.readingsTrdPtyWonderHeroGameApi);
      setSocialActivityAllData(gamerData.socialActivityAllData);
      setGamingActivityAllData(gamerData.gamingActivityAllData);
    }
  }, [gamerData]);

  return (
    <>
      <ActivityHeatmap startDate="2022-04-01" endDateIsToday={true} activityAllData={gamingActivityAllData} showToolTips={true} />
    </>
  );
}

export default GamerInsights;
