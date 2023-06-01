import moment from 'moment-timezone';

export function onChainDataInsights_LIB({rawReadings, userTz}) {
  console.log('onChainDataInsights_LIB ->');
  
  const dataWithInsights = {
    readings: [],
    summary: {}
  };

  if (!userTz) {
    userTz = 'Australia/Sydney'; 
  }

  let scoreGroup = '';
  let totalScore = 0;

  let workOnReadings = rawReadings.reverse().map((i, idx) => {
    let newObj = { ...i };
    let thisReadingTs = moment.utc(newObj.createdAt);
    let readingDataPoints = [];

    newObj.friendyCreatedAt = thisReadingTs.tz(userTz).format('LLLL');

    switch(i.manual) {
      case 'OnChainAddrTxOnCon': {
        /*
          createdAt: 1653283414000
          data: "{\"adr\":\"0xF832E169Dfc0a42DD27d97818eBD3960E4d1B292\",\"chn\":\"137\",\"block_signed_at\":\"2022-05-23T05:23:34Z\",\"tx_hash\":\"0x3035a3e6d5c27bebf938df7c458a866f34f877996efd429f2cf6d33d91adec9f\",\"transfers_from_address\":\"0x0000000000000000000000000000000000000000\",\"transfers_to_address\":\"0xf832e169dfc0a42dd27d97818ebd3960e4d1b292\",\"transfers_contract_ticker_symbol\":\"HON\",\"transfers_contract_address\":\"0x3d2aa1193094d824735795a77b91417917f73375\",\"transfers_transfer_type\":\"IN\",\"transfers_delta\":\"83520000000000000000\"}"
          dataType: "4"
          manual: "OnChainAddrTxOnCon"
          userShortId: "242"
        */

        readingDataPoints = JSON.parse(i.data);

        // this is the blockchain
        if (readingDataPoints.chn == 137) {
          scoreGroup = 'Polygon_Other';
        }
        else if (readingDataPoints.chn == 56) {
          scoreGroup = 'BSC_Other';
        }
        else {
          scoreGroup = 'unknown';
        }

        newObj.data = {
          data1: readingDataPoints.adr,
          data2: readingDataPoints.transfers_from_address,
          data3: readingDataPoints.transfers_to_address,
          data4: readingDataPoints.transfers_contract_ticker_symbol,
          data5: readingDataPoints.transfers_contract_address,
          data6: readingDataPoints.transfers_transfer_type,
          data7: readingDataPoints.transfers_delta,
          data8: readingDataPoints.block_signed_at,
          data9: readingDataPoints.tx_hash          
        };

        // use config based groups if needed (grpCode)
        if (readingDataPoints.grpCode) {
          newObj.data.data10 = readingDataPoints.grpCode;

          // wonderhero game
          if (readingDataPoints.grpCode.indexOf('wh') > -1) { // we use index of so we support scholor tracking grpCodes  too. i.e. kc:s-eg
            if (readingDataPoints.chn == 137) {
              scoreGroup = 'Polygon_Wonderhero';
            }
            else if (readingDataPoints.chn == 56) {
              scoreGroup = 'BSC_Wonderhero';
            }
            else {
              scoreGroup = 'Unknown_Wonderhero';
            }
          } else if (readingDataPoints.grpCode.indexOf('cy') > -1) {
            if (readingDataPoints.chn == 56) {
              scoreGroup = 'BSC_Cyball';
            }
            else {
              scoreGroup = 'Unknown_Cyball';
            }
          }
        }

        newObj.scoreGroup = scoreGroup;


        /*
          timezone does not have an effect on valueOf, as they are both the same point in time (but different timezones)
          so we need to the get valueOf of thisReadingTs and this will be epoch (ms to this point in time since since 1970...)  = eventTimeUtcSinceEpoch
          ... and then add the ms time difference between user's timezone and UTC = eventTimeDiffInSec * 1000
          ... this means we manaully adjust the valueOf by adding/removing time diff between UTC and user timezone
        */

        const eventTimeUtcSinceEpoch = moment.utc(newObj.createdAt).valueOf();
        const eventInUserTimezoneStr = moment.utc(newObj.createdAt).tz(userTz).format(); // looks like 2022-05-18T04:54:20+04:00
        const eventTimeDiffInMs = moment.parseZone(eventInUserTimezoneStr).utcOffset() * 1000; // we get in seconds so convert to ms by * 1000

        // keep the reading in user timezone by as time from unix epoch (used to render time series x axis)
        newObj.time = eventTimeUtcSinceEpoch + eventTimeDiffInMs;
      }

      break;
    
      case 'OnChainAddrTxOnConErd': {
        /*
          "userShortId": "242",
          "createdAt": 1660909578000,
          "data": "{
            \"transfers_from_address\":\"erd1qqqqqqqqqqqqqpgqg9jvky0va7penz6u7zmp93w3tdus4dle6uyqqjjg5u\",
            \"transfers_contract_address\":\"erd1qqqqqqqqqqqqqpgqg9jvky0va7penz6u7zmp93w3tdus4dle6uyqqjjg5u\",
            \"tx_hash\":\"5640c5aa2a69a5d86afb26298c225caae2972a31155111426b4e1b87475cb06d\",
            \"transfers_delta\":\"50000\",
            \"transfers_contract_ticker_symbol\":\"CGO-a1b4df\",
            \"grpCode\":\"kc\",
            \"adr\":\"erd15vdflu905edrqe7tas3frnma738n06tt8s2y6wh68qd46fp27c7qgdjlmv\",
            \"transfers_transfer_type\":\"IN\",
            \"chn\":\"E2\"}",
          "dataType": "4",
          "manual": "OnChainAddrTxOnConErd"
        */

        readingDataPoints = JSON.parse(i.data);

        // this is the blockchain
        if (readingDataPoints.chn == 'E2') {
          scoreGroup = 'Elrond_Devnet_Other';
        }
        else if (readingDataPoints.chn == 'E1') {
          scoreGroup = 'Elrond_Mainnet_Other';
        }
        else {
          scoreGroup = 'unknown';
        }

        let transfers_to_address = readingDataPoints.transfers_to_address;

        if (!transfers_to_address) {
          transfers_to_address = readingDataPoints.adr;
        }

        newObj.data = {
          data1: readingDataPoints.adr,
          data2: readingDataPoints.transfers_from_address,
          data3: transfers_to_address,
          data4: readingDataPoints.transfers_contract_ticker_symbol,
          data5: readingDataPoints.transfers_contract_address,
          data6: readingDataPoints.transfers_transfer_type,
          data7: readingDataPoints.transfers_delta,
          data8: readingDataPoints.tx_hash          
        };

        // use config based groups if needed (grpCode)
        if (readingDataPoints.grpCode) {
          newObj.data.data9 = readingDataPoints.grpCode;

          // wonderhero game
          if (readingDataPoints.grpCode.indexOf('kc') > -1) { // we use index of so we support scholor tracking grpCodes  too. i.e. kc:s-eg
            if (readingDataPoints.chn == 'E2') {
              scoreGroup = 'Devnet_Knights_Of_Cathena';
            }
          }
        }

        newObj.scoreGroup = scoreGroup;


        /*
          timezone does not have an effect on valueOf, as they are both the same point in time (but different timezones)
          so we need to the get valueOf of thisReadingTs and this will be epoch (ms to this point in time since since 1970...)  = eventTimeUtcSinceEpoch
          ... and then add the ms time difference between user's timezone and UTC = eventTimeDiffInSec * 1000
          ... this means we manaully adjust the valueOf by adding/removing time diff between UTC and user timezone
        */

        const eventTimeUtcSinceEpoch = moment.utc(newObj.createdAt).valueOf();
        const eventInUserTimezoneStr = moment.utc(newObj.createdAt).tz(userTz).format(); // looks like 2022-05-18T04:54:20+04:00
        const eventTimeDiffInMs = moment.parseZone(eventInUserTimezoneStr).utcOffset() * 1000; // we get in seconds so convert to ms by * 1000

        // keep the reading in user timezone by as time from unix epoch (used to render time series x axis)
        newObj.time = eventTimeUtcSinceEpoch + eventTimeDiffInMs;
      }

      break;
    }

    return newObj;
  });

  dataWithInsights.readings = workOnReadings;

  console.log('On Chain *******************');
  console.log(dataWithInsights);
  console.log('*******************');

  return dataWithInsights;
}

export function thirdPartyDataInsights_LIB({rawReadings, userTz}) {
  console.log('thirdPartyDataInsights_LIB ->');
  
  const dataWithInsights = {
    readings: [],
    summary: {}
  };

  if (!userTz) {
    userTz = 'Australia/Sydney'; 
  }

  let scoreGroup = '';
  let totalScore = 0;

  let workOnReadings = rawReadings.reverse().map((i, idx) => {
    let newObj = { ...i };
    let thisReadingTs = moment.utc(newObj.createdAt);
    let readingDataPoints = [];

    newObj.friendyCreatedAt = thisReadingTs.tz(userTz).format('LLLL');

    switch(i.manual) {
      case 'DiscordBotUserOnGuildActivity': {
        /*
          "userShortId": "242",
          "createdAt": 1653747243443,
          "data": "{\"userId\":\"152502117800607744\",\"guildId\":\"869901313616527360\",\"activityScore\":\"141\",\"messageCount\":\"36\",\"reactionCount\":\"21\",\"replyCount\":\"6\"}",
          "dataType": "5",
          "manual": "DiscordBotUserOnGuildActivity"
        */

        readingDataPoints = JSON.parse(i.data);

        newObj.val = readingDataPoints.activityScore;

        newObj.data = {
          data1: readingDataPoints.userId,
          data2: readingDataPoints.guildId,         
          data3: readingDataPoints.messageCount,
          data4: readingDataPoints.reactionCount,
          data5: readingDataPoints.replyCount,
        };

        if (readingDataPoints.frequencyCounts) {
          newObj.data.data6 = readingDataPoints.frequencyCounts;
        }

        if (readingDataPoints.mentionedCount) {
          newObj.data.data7 = readingDataPoints.mentionedCount;
        }

        if (readingDataPoints.messageLengthCounts) {
          newObj.data.data8 = readingDataPoints.messageLengthCounts;
        }

        if (readingDataPoints.audioVideoActivities) {
          const {totalTimeInVoiceChannel, totalTimeWithMicrophone, totalTimeWithVideo, totalTimeWithScreencast} = readingDataPoints.audioVideoActivities;
          newObj.data.data9 = `Total Mins to date - In AV channel: ${totalTimeInVoiceChannel}, with Mic: ${totalTimeWithMicrophone}, with Camera: ${totalTimeWithVideo}, with ScreenShare: ${totalTimeWithScreencast}`;
        }

        if (readingDataPoints.streamingScore) {
          newObj.data.data10 = readingDataPoints.streamingScore;
        }

        if (readingDataPoints.updatedAt) {
          newObj.data.data11 = moment.utc(readingDataPoints.updatedAt).tz(userTz).format('LLLL');
        }
      }

      break;

      case 'TrdPtyWonderHeroGameApi': {
        /*
          "userShortId": "242",
          "createdAt": 1661496615000,
          "data": "{"
            season":105484,"
            belt":1,"
            score":795,"
            level":9,"
            times":14,"
            attackWinRate":0.5714,"
            defenseWinRate":0,"
            rank":1,"
            streak":0,"
            grpCode":"wh","
            adr":"0xF832E169Dfc0a42DD27d97818eBD3960E4d1B292"}",
          "dataType": "4",
          "manual": "TrdPtyWonderHeroGameApi"
        */

        readingDataPoints = JSON.parse(i.data);

        newObj.data = {
          data1: readingDataPoints.adr,
          data2: readingDataPoints.season,
          data3: readingDataPoints.rank,
          data4: readingDataPoints.score,
          data5: readingDataPoints.level,
          data6: readingDataPoints.belt,
          data7: readingDataPoints.times,
          data8: readingDataPoints.attackWinRate,          
          data9: readingDataPoints.defenseWinRate,          
          data10: readingDataPoints.streak,
          data11: readingDataPoints.grpCode,
        };

        newObj.scoreGroup = 'Wonderhero_PVP';

        /*
          timezone does not have an effect on valueOf, as they are both the same point in time (but different timezones)
          so we need to the get valueOf of thisReadingTs and this will be epoch (ms to this point in time since since 1970...)  = eventTimeUtcSinceEpoch
          ... and then add the ms time difference between user's timezone and UTC = eventTimeDiffInSec * 1000
          ... this means we manaully adjust the valueOf by adding/removing time diff between UTC and user timezone
        */

        const eventTimeUtcSinceEpoch = moment.utc(newObj.createdAt).valueOf();
        const eventInUserTimezoneStr = moment.utc(newObj.createdAt).tz(userTz).format(); // looks like 2022-05-18T04:54:20+04:00
        const eventTimeDiffInMs = moment.parseZone(eventInUserTimezoneStr).utcOffset() * 1000; // we get in seconds so convert to ms by * 1000

        // keep the reading in user timezone by as time from unix epoch (used to render time series x axis)
        newObj.time = eventTimeUtcSinceEpoch + eventTimeDiffInMs;
      }

      break;
    }

    return newObj;
  });

  dataWithInsights.readings = workOnReadings;

  console.log('3rd party *******************');
  console.log(dataWithInsights);
  console.log('*******************');

  return dataWithInsights;
}
