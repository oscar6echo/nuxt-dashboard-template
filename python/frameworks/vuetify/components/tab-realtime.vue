<template>
  <div class="my-wrapper-block">
    <div class="d-flex flex-column align-center">
      <div class="display-1 modt my-title mt-1 mb-2">{{ title }}</div>
      <div class="subtitle-1 modt my-subtitle mb-3">
        {{ seriesData }} -
        <a href="https://www.highcharts.com/demo">Highcharts</a> Plot
      </div>
      <div id="my-plot"></div>
    </div>
  </div>
</template>

<script>
import { capitalCase } from 'change-case';
import Highcharts from 'highcharts';
import util from '~/js/generic/util';

export default {
  name: 'TabRealtime',
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
      return capitalCase('real time');
    }
  },
  mounted() {
    this.buildChart();
  },

  methods: {
    buildChart() {
      this.graphOptions = this.buildGraphOptions();
      this.chart = Highcharts.chart(this.graphOptions);
    },
    buildGraphOptions() {
      const graphOptions = {
        chart: {
          renderTo: 'my-plot',
          type: 'line',
          height: 500,
          width: 800,
          events: {
            load: this.buildLoadFunc()
          }
        },
        time: {
          useUTC: false
        },
        title: {
          text: 'Live random data'
        },
        credits: {
          enabled: false
        },
        xAxis: {
          type: 'datetime',
          tickPixelInterval: 150
        },
        yAxis: {
          title: {
            text: 'Value'
          },
          min: 0,
          max: 1
        },
        tooltip: {
          headerFormat: '<b>{series.name}</b><br/>',
          pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
        },
        legend: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        series: [
          {
            name: 'Random data',
            data: this.buildInitData()
          }
        ]
      };
      return graphOptions;
    },
    buildInitData() {
      const data = [];
      const time = new Date().getTime();
      let i;

      for (i = -8; i <= 0; i += 1) {
        data.push({
          x: time + i * 1000,
          y: Math.random()
        });
      }
      return data;
    },
    buildLoadFunc() {
      const that = this;
      const fmtFloat = util.dicFormat.float2;

      function load(evt) {
        const series = this.series[0];
        setInterval(() => {
          const x = new Date().getTime();
          const y = Math.random();
          series.addPoint([x, y], true, true);
          that.seriesData = series.data.map((e) => fmtFloat(e.y)).slice();
        }, 1000);
      }
      return load;
    }
  }
};
</script>

<style lang="scss" scoped></style>
