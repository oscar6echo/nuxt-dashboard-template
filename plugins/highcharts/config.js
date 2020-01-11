import Highcharts from 'highcharts';

import corpColors from './corp-colors';

// import highchartsMore from 'highcharts-more';
// import heatmap from 'highcharts/modules/heatmap';
// import stockInit from 'highcharts/modules/stock';
// import exportingInit from 'highcharts/modules/exporting';

if (typeof Highcharts === 'object') {
  // stockInit(Highcharts);
  // exportingInit(Highcharts);
  // highchartsMore(Highcharts);
  // heatmap(Highcharts);
}
Highcharts.setOptions({ colors: corpColors });
