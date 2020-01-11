<template>
  <v-container fluid class="my-wrapper-block">
    <div class="d-flex flex-column align-center">
      <h3 class="display-1 modt my-title mt-1 mb-2">{{ title }}</h3>
      <h6 class="subtitle-1 modt my-subtitle mb-3">
        <a href="https://www.highcharts.com/demo">Highcharts</a> plot - Straight
        from
        <a
          href="https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/series-packedbubble/spiral"
          >this example</a
        >
        - Data from static file
      </h6>
      <div id="my-plot"></div>
    </div>
  </v-container>
</template>

<script>
import { capitalCase } from 'change-case';
import Highcharts from 'highcharts';
import highchartsMore from 'highcharts/highcharts-more';
import requestCdn from '~/api/api-cdn';
import ApiCdnData from '~/api/api-cdn-dataclass';

highchartsMore(Highcharts);

export default {
  name: 'TabPlot',
  components: {},
  props: {},
  data() {
    return {
      chart: null,
      graphOptions: {},
      seriesData: []
    };
  },
  computed: {
    title() {
      return capitalCase('carbon emissions');
    }
  },
  mounted() {
    this.buildChart();
  },

  methods: {
    async buildChart() {
      this.graphOptions = await this.buildGraphOptions();
      this.chart = Highcharts.chart(this.graphOptions);
    },
    async buildGraphOptions() {
      const series = await this.buildDataCdn();
      const graphOptions = {
        chart: {
          renderTo: 'my-plot',
          type: 'packedbubble',
          height: '100%',
          width: 800
        },
        title: {
          text: 'World (2014)'
        },
        tooltip: {
          useHTML: true,
          pointFormat: '<b>{point.name}:</b> {point.value}m CO<sub>2</sub>'
        },
        plotOptions: {
          packedbubble: {
            useSimulation: false,
            minSize: '20%',
            maxSize: '80%',
            dataLabels: {
              enabled: true,
              format: '{point.name}',
              filter: {
                property: 'y',
                operator: '>',
                value: 250
              },
              style: {
                color: 'black',
                textOutline: 'none',
                fontWeight: 'normal'
              }
            }
          }
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        series
      };
      return graphOptions;
    },
    async buildDataCdn() {
      const name = 'my-dashboard-data-plot.json';
      const rawData = await requestCdn(this.$axios, name);
      const cdnData = new ApiCdnData(rawData);
      return cdnData.data.output;
    }
  }
};
</script>

<style lang="scss" scoped>
.my-wrapper-block {
  padding-left: 50px;
  padding-right: 50px;
}
</style>
