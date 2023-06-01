import moment from 'moment-timezone';
import { onChainDataInsights_LIB, thirdPartyDataInsights_LIB } from './core';

export function isBrowser() {
  return (typeof window !== 'undefined' && typeof window.document !== 'undefined');
}

export function veryFirstTimeStampsPerMonth(data) {
  // create new array of objects based on data, but add new prop called formatedWhen which will format the date as Mar 16
  const a = data.map((item) => {
    let b = { ...item };
    b.formatedWhen = moment(item.when).format('DD MMM YY');

    return b;
  });

  // now iterate through the above collection and reduce it to unique formatedWhen values, then use that reduce loop logic to populate a unique collection based on "when" (veryFirstTimeStampsPerMonth)
  let uniqueTimeStamps = [];

  const c = a.reduce((total, item) => {
    if (total.indexOf(item.formatedWhen) === -1) {
      total.push(item.formatedWhen);
      uniqueTimeStamps.push(item.when);
    }

    return total;
  }, []);

  return uniqueTimeStamps;
}

export const sleep = (sec) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, sec * 1000);
  });
};

export function getDatesInRange(startDate, endDate) {
  //https://bobbyhadz.com/blog/javascript-get-all-dates-between-two-dates
  const date = new Date(startDate.getTime());

  const unqDates = [];
  const unqDateStrs = [];

  while (date <= endDate) {
    const toDate = new Date(date);
    unqDates.push(toDate);
    unqDateStrs.push(`${moment(toDate).format('MM/DD/YY')}`);
    date.setDate(date.getDate() + 1);
  }

  return [unqDates, unqDateStrs];
}

export function seriesDataForGroup(gamingActivityAll, unqDateStrs, groupMergeMapping) {
  /*
    output:
    
    seriesDataList =
    [{
      name: "Wonderhero",
      data: [10, 10, 20, 20, null, 10]
    },
    {
      name: "Cyball",
      data: [null, 40, 40, 40, null, 50]
    },
    {
      name: "Knights of Cathena",
      data: [null, 70, 70, 70, null, 80]
    }
    ]

    input: 
      unqDateStrs = ['05/18/22', '05/19/22']

      gamingActivityAll = data :  {data1: '0xF832E169Dfc0a42DD27d97818eBD3960E4d1B292', data2: '0x0000000000000000000000000000000000000000', data3: '0xf832e169dfc0a42dd27d97818ebd3960e4d1b292', data4: 'HON', data5: '0x3d2aa1193094d824735795a77b91417917f73375', …}
                          group :  "Polygon_Wonderhero"
                          time : 1652835860000
                          val : 0
                          when : "Wednesday, May 18, 2022 10:54 AM"



                          { date: '2016/04/12', count:2 }

      groupMergeMapping =
      {
        Polygon_Wonderhero: "Wonderhero",
        BSC_Wonderhero: "Wonderhero",
        BSC_Cyball: "Cyball",
        Devnet_Knights_of_Cathena: "Knights of Cathena"
      }
  */

  const seriesDataMap = {};

  // S: create the base template
  const unqDateStrsToMap = unqDateStrs.reduce((t, i) => { t[i] = null; return t; }, {}); // converts unqDateStrs to a map

  gamingActivityAll.forEach(activity => {
    let rollupGroup = groupMergeMapping[activity.group];

    if (!rollupGroup) { // for any missed unmapped groups, just show original label
      rollupGroup = activity.group;
    }

    if (!seriesDataMap[rollupGroup]) {
      seriesDataMap[rollupGroup] = { ...unqDateStrsToMap }; // create the base map with 0 values
    }

    // if the activity fpr the group existed for a certain day then increment the value for that day
    const timestampToDateStr = moment(activity.when).format('MM/DD/YY');
    let activitiesForDate = seriesDataMap[rollupGroup][timestampToDateStr];

    if (!activitiesForDate) {
      activitiesForDate = 1; // the 1st activity on this date
    } else {
      activitiesForDate = activitiesForDate + 1; // increment activity count 
    }

    seriesDataMap[rollupGroup][timestampToDateStr] = activitiesForDate; // activities per group per day 
  });
  // E: create the base template

  const seriesDataList = [];

  Object.keys(seriesDataMap).map(group => {
    seriesDataList.push({
      name: group,
      data: Object.values(seriesDataMap[group])
    });
  });

  return seriesDataList;
}

export function seriesDataForHeatmap(gamingActivityAll, unqDateStrs) {
  /*
    output:

    seriesHeatmap = [ 
      { date: '2022-05-18', count:2 },
      { date: 2022-05-21', count:5 }
    ]

    input: 
      unqDateStrs = ['05/18/22', '05/19/22']

      gamingActivityAll = data :  {data1: '0xF832E169Dfc0a42DD27d97818eBD3960E4d1B292', data2: '0x0000000000000000000000000000000000000000', data3: '0xf832e169dfc0a42dd27d97818ebd3960e4d1b292', data4: 'HON', data5: '0x3d2aa1193094d824735795a77b91417917f73375', …}
                          group :  "Polygon_Wonderhero"
                          time : 1652835860000
                          val : 0
                          when : "Wednesday, May 18, 2022 10:54 AM"



                          { date: '2016/04/12', count:2 }
  */

  const seriesDataMap = {};

  // S: create the base template
  gamingActivityAll.forEach(activity => {
    // if the activity fpr the group existed for a certain day then increment the value for that day
    const timestampToDateStr = moment(activity.when).format('YYYY-MM-DD');
    let activitiesForDate = seriesDataMap[timestampToDateStr];

    if (!activitiesForDate) {
      activitiesForDate = 1; // the 1st activity on this date
    } else {
      activitiesForDate = activitiesForDate + 1; // increment activity count 
    }

    seriesDataMap[timestampToDateStr] = activitiesForDate; // activities per group per day  
  });
  // E: create the base template

  const seriesHeatmap = [];

  Object.keys(seriesDataMap).map(date => {
    seriesHeatmap.push({ date, count: seriesDataMap[date] });
  });


  return seriesHeatmap;
}

export function getTicks(data) {
  // create new array of objects based on data, but add new prop called formatedWhen which will format the date as Mar 16
  const a = data.map((item) => {
    let b = { ...item };
    b.formatedWhen = moment(item.when).format('DD MMM YY');

    return b;
  });

  // now iterate through the above collection and reduce it to unique formatedWhen values, then use that reduce loop logic to populate a unique collection based on "when" (veryFirstTimeStampsPerMonth)
  let uniqueTimeStamps = [];

  const c = a.reduce((total, item) => {
    if (total.indexOf(item.formatedWhen) === -1) {
      total.push(item.formatedWhen);
      uniqueTimeStamps.push(`${moment(item.when).format('MM/DD/YY')}`);
    }

    return total;
  }, []);

  return uniqueTimeStamps;
}

export function gamerPassportNormaliseUserDataSet(rawData) {
  if (rawData.items.length > 0) {
    const response = {
      readingsOnChainAddrTxOnCon: [],
      readingsOnChainAddrTxOnConErd: [],
      readingsDiscordBotUserOnGuildActivity: [],
      readingsTrdPtyWonderHeroGameApi: [],
      gamingActivityAllData: [],
      socialActivityAllData: [],
    };

    const readingsInGroups = rawData.metaData.getDataConfig.dataToGather.allApplicableDataTypes.reduce((t, i) => {
      t[i.toString()] = [];
      return t;
    }, {});

    rawData.items.forEach(i => {
      readingsInGroups[i.dataType].push(i);
    });

    const gamingActivityAll = [];
    const socialActivityAll = [];

    Object.keys(readingsInGroups).forEach(dataType => {
      switch (dataType) {
        case '4': {
          if (readingsInGroups['4'].length > 0) {
            const programOnChainReadingsWithInsights = onChainDataInsights_LIB({
              rawReadings: readingsInGroups['4'],
              userTz: ''
            });

            const readingsWithInsights = programOnChainReadingsWithInsights.readings;
            const onChainManualDataSets = {
              onChainAddrTxOnCon: [],
              onChainAddrTxOnConErd: []
            };

            // S: Time Data graphs
            for (let i = 0; i < readingsWithInsights.length; i++) {
              if (readingsWithInsights[i].manual === 'OnChainAddrTxOnCon') {
                const item = {
                  group: readingsWithInsights[i].scoreGroup,
                  time: readingsWithInsights[i].time,
                  when: readingsWithInsights[i].friendyCreatedAt,
                  val: 0,
                  data: readingsWithInsights[i].data
                };

                onChainManualDataSets.onChainAddrTxOnCon.push(item);
                gamingActivityAll.push(item);
              }
              else if (readingsWithInsights[i].manual === 'OnChainAddrTxOnConErd') {
                const item = {
                  group: readingsWithInsights[i].scoreGroup,
                  time: readingsWithInsights[i].time,
                  when: readingsWithInsights[i].friendyCreatedAt,
                  val: 0,
                  data: readingsWithInsights[i].data
                };

                onChainManualDataSets.onChainAddrTxOnConErd.push(item);
                gamingActivityAll.push(item);
              }
            }
            // E: Time Data graphs

            // commit to state          
            response.readingsOnChainAddrTxOnCon = onChainManualDataSets.onChainAddrTxOnCon;
            response.readingsOnChainAddrTxOnConErd = onChainManualDataSets.onChainAddrTxOnConErd;
          }
        }

          break;

        case '5': {
          if (readingsInGroups['5'].length > 0) {
            const thirdPartyReadingsWithInsights = thirdPartyDataInsights_LIB({
              rawReadings: readingsInGroups['5'],
              userTz: ''
            });

            const readingsWithInsights = thirdPartyReadingsWithInsights.readings;
            const thirdPartyManualDataSets = {
              discordBotUserOnGuildActivity: [],
              trdPtyWonderHeroGameApi: [],
            };

            // S: Time Data graphs
            for (let i = 0; i < readingsWithInsights.length; i++) {
              if (readingsWithInsights[i].manual === 'DiscordBotUserOnGuildActivity') {
                thirdPartyManualDataSets.discordBotUserOnGuildActivity.push(
                  {
                    // group: parseInt(readingsWithInsights[i].val, 10),
                    when: readingsWithInsights[i].friendyCreatedAt,
                    data: readingsWithInsights[i].data,
                    val: parseInt(readingsWithInsights[i].val, 10)
                  }
                );

                socialActivityAll.push(parseInt(readingsWithInsights[i].val, 10));

              } else if (readingsWithInsights[i].manual === 'TrdPtyWonderHeroGameApi') {
                const item = {
                  group: readingsWithInsights[i].scoreGroup,
                  time: readingsWithInsights[i].time,
                  when: readingsWithInsights[i].friendyCreatedAt,
                  val: 0,
                  data: readingsWithInsights[i].data
                };

                thirdPartyManualDataSets.trdPtyWonderHeroGameApi.push(item);
                gamingActivityAll.push(item);
              }
            }
            // E: Time Data graphs

            // commit to state
            response.readingsDiscordBotUserOnGuildActivity = thirdPartyManualDataSets.discordBotUserOnGuildActivity;
            response.readingsTrdPtyWonderHeroGameApi = thirdPartyManualDataSets.trdPtyWonderHeroGameApi;
          }
        }

          break;
      }
    });

    if (gamingActivityAll.length > 0) {
      response.gamingActivityAllData = gamingActivityAll;
    }

    if (socialActivityAll.length > 0) {
      response.socialActivityAllData = socialActivityAll;
    }

    return response;
  } else {
    return {};
  }
}
