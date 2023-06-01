
import React, { useState, useEffect } from 'react';
// import { useColorMode } from '@chakra-ui/react';
import moment from 'moment-timezone';
import CalendarHeatmap from 'react-calendar-heatmap';
// import ReactTooltip from 'react-tooltip';
import { getTicks, getDatesInRange, seriesDataForHeatmap } from 'libs/utils/legacyUtil';
import 'react-calendar-heatmap/dist/styles.css';
import './ActivityHeatmap.css';
// import HeatMap from '@uiw/react-heat-map';

function ActivityHeatmap({ startDate, endDateIsToday, activityAllData, showWeekdayLabels, showOutOfRangeDays, showToolTips }) {
  const [graphConfig, setGraphConfig] = useState(null);
  // const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (activityAllData?.length > 0) {
      // sort by oldest readings to newest readings
      const sortedData = activityAllData.sort(function(a, b) {
        return a.time - b.time;
      });

      const uniqueEventTicks = getTicks(sortedData);

      const d1 = new Date(uniqueEventTicks[0]);
      d1.setDate(d1.getDate() - 1); // needs to be a day before 1st reading for it to work

      const d2 = new Date(uniqueEventTicks[uniqueEventTicks.length - 1]);

      // get an array of unique date strings from 1st date of datapoint to the last date of datapoint
      const [, unqDateStrs] = getDatesInRange(d1, d2);

      // pass in all gaming activity and get series data per day of unqDateStrs
      const seriesHeatmap = seriesDataForHeatmap(sortedData, unqDateStrs);

      let startDateToUse = d1;
      let endDateToUse = d2;

      if (startDate) {
        startDateToUse = startDate;
      }

      if (endDateIsToday) {
        endDateToUse =  moment(Date.now()).format('YYYY-MM-DD');
      }

      setGraphConfig({
        seriesHeatmap: {
          startDate: startDateToUse,
          endDate: endDateToUse,
          data: seriesHeatmap
        }
      });
    }
  }, [activityAllData]);

  return (<>
    {graphConfig && <div>
      <CalendarHeatmap
        startDate={graphConfig.seriesHeatmap.startDate}
        endDate={graphConfig.seriesHeatmap.endDate}
        values={graphConfig.seriesHeatmap.data}
        // onClick={value => {
        //   alert(`${new Date(value.date).toISOString().slice(0, 10)} has count: ${value.count}`);
        // }}
        classForValue={value => {
          if (!value) {
            // if (colorMode === 'light') {
            //   return 'color-empty';
            // } else {
            //   return 'color-empty-dark';
            // }

            return 'color-empty';
          }

          if (value.count > 4) {
            return 'color-scale-4';
          }

          return `color-scale-${value.count}`;
        }}
        showWeekdayLabels={showWeekdayLabels ?? false}
        showOutOfRangeDays={showOutOfRangeDays ?? false}
        gutterSize={3}
        tooltipDataAttrs={!showToolTips ? null : value => {
          if (!value || !value.date) {
            return '';
          }

          return {
            'data-tip': `${value.count} activities on ${new Date(value.date).toISOString().slice(0, 10)}`,
          };
        }}
      />
      {/* <ReactTooltip /> */}
    </div>}
  </>);
}

export default ActivityHeatmap;
