<template>
  <div class="my-wrapper-block">
    <div class="d-flex flex-column align-center">
      <div class="display-1 modt my-title mt-1 mb-2">{{ title }}</div>
      <div class="subtitle-1 modt my-subtitle mb-3">
        vs.
        <a
          href="https://www.climatecentral.org/news/see-earths-temperature-spiral-toward-2c-20332"
          >1850-1900 pre-industrial average</a
        >
      </div>

      <div id="anchor"></div>

      <Manipulate
        v-model.number:idx="idx"
        :values="data"
        :idx="idx"
        :autoplay="true"
        :loop="true"
        :alternate="false"
        :delay="delay"
        :format="formatSlider"
        :width-slider="200"
        :width-total="750"
        label="Month"
        class="my-3"
      />
    </div>
  </div>
</template>

<script>
import { capitalCase } from 'change-case';
import Manipulate from '~/components/misc/manipulate';
import d3 from '~/assets/d3';

export default {
  name: 'TabWeather',
  components: { Manipulate },
  props: {},
  data() {
    return {
      data: [],
      idx: 0,
      delay: 50,

      formatSlider: (i) => {
        if (this.data.length === 0) return '';
        return `${this.data[i].year} ${this.months[this.data[i].month - 1]}`;
      },
      months: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ]
    };
  },
  computed: {
    title() {
      return capitalCase('world average temperature');
    }
  },
  watch: {
    idx() {
      this.updatePlot(this.idx);
    }
  },

  async mounted() {
    const rawData = await this.getClimateData();
    // console.log(rawData);

    this.data = this.shapeClimateData(rawData);
    console.log(this.data);

    this.buildPlot();

    this.updatePlot(0);
  },

  methods: {
    async getClimateData() {
      const url =
        'https://www.metoffice.gov.uk/hadobs/hadcrut4/data/current/time_series/HadCRUT.4.6.0.0.monthly_ns_avg.txt';
      const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
      const urlWithProxy = CORS_PROXY + url;

      const headers = {
        accept: 'application/json',
        'x-requested-with': 'localhost:3000'
      };
      const config = {
        method: 'get',
        url: urlWithProxy,
        headers
      };

      const data = await this.$axios.$request(config);
      return data;
    },

    shapeClimateData(rawData) {
      const ssv = d3.dsvFormat(' ');
      const data = ssv.parseRows(
        rawData
          .split('\n')
          .map((e) => e.replace(/\s+/g, ' '))
          .join('\n'),
        (d, i) => {
          const [year, month] = d[0].split('/').map((e) => +e);
          const value = +d[1];
          return {
            month,
            year,
            value
          };
        }
      );
      const average = d3.mean(
        data.filter((e) => e.year <= 1900 && e.year >= 1850).map((e) => e.value)
      );
      data.forEach((e) => {
        e.value -= average;
      });
      return data;
    },

    buildPlot() {
      const years = this.data.map((e) => e.year);
      const minYear = d3.min(years);
      const maxYear = d3.max(years);
      this.nbYear = maxYear - minYear + 1;

      const values = this.data.map((e) => e.value);
      const minValue = d3.min(values);
      const maxValue = d3.max(values);

      const angles = d3
        .range(0, 360, 360 / this.months.length)
        .map((e) => e - 360 / 4);
      const angleMonths = d3.zip(angles, this.months);

      const floorValue = Math.floor(minValue);
      const capValue = Math.floor(maxValue) + 1;
      const minDomain = floorValue;
      const maxDomain = capValue + 0.5;
      const shift = minDomain;

      const refCircles = [
        { value: 0 - shift, text: '+0°C' },
        { value: 1.5 - shift, text: '+1.5°C' },
        { value: 2 - shift, text: '+2.0°C' }
      ];

      this.dataFull = this.data.map((d, i) => {
        return {
          angle: (i * 2 * Math.PI) / 12,
          radius: d.value - shift,
          year: d.year,
          month: d.month
        };
      });

      const width = 900;
      const height = 600;
      const radius = Math.min(width, height) / 2 - 30;

      this.r = d3
        .scaleLinear()
        .domain([minDomain - shift, maxDomain - shift])
        .range([0, radius]);

      this.line = d3
        .lineRadial()
        .angle(function(d) {
          return d.angle;
        })
        .radius((d) => this.r(d.radius));

      const svg = d3
        .select('#anchor')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

      const gr = svg
        .append('g')
        .attr('class', 'r axis')
        .selectAll('g')
        .data(refCircles)
        .enter()
        .append('g');

      gr.append('circle').attr('r', (d) => this.r(d.value));

      gr.append('text')
        .attr('y', (d) => -this.r(d.value) - 4)
        .attr('transform', 'rotate(0)')
        .style('text-anchor', 'middle')
        .text((d) => d.text);

      const ga = svg
        .append('g')
        .attr('class', 'a axis')
        .selectAll('g')
        .data(angleMonths)
        .enter()
        .append('g')
        .attr('transform', (d) => 'rotate(' + d[0] + ')');

      ga.append('line').attr('x2', radius);

      ga.append('text')
        .attr('x', radius + 6)
        .attr('dx', '.0em')
        .attr('dy', '.0em')
        .attr('transform', (d) =>
          d[0] < 180 && d[0] > 0
            ? 'rotate(-90 ' + (radius + 6) + ',0)'
            : 'rotate(90 ' + (radius + 6) + ',0)'
        )
        .style('text-anchor', 'middle')
        .style('font-size', 15)
        .style('color', 'green')
        .text((d) => d[1]);

      this.arrPath = d3.range(this.nbYear).map(() => svg.append('path'));

      this.dot = svg.append('circle');

      this.date = svg
        .append('text')
        .attr('dy', '.35em')
        .style('text-anchor', 'middle')
        .style('font-size', '16px');

      const chunkData = function(data) {
        const dataLocal = data.slice(0);
        const chunkInit = dataLocal.splice(0, 12);
        const chunks = [chunkInit];
        while (dataLocal.length) {
          const chunk = dataLocal.splice(0, 12);
          const lastChunk = chunks[chunks.length - 1];
          const lastElt = lastChunk[lastChunk.length - 1];
          chunk.unshift(lastElt);
          chunks.push(chunk);
        }
        return chunks;
      };

      this.chunkDataPad = function(data, nbArray) {
        const chunks = chunkData(data);
        // for (const i of d3.range(nbArray - chunks.length)) chunks.push([]);
        d3.range(nbArray - chunks.length).forEach((e) => chunks.push([]));
        return chunks;
      };

      this.color = d3.interpolateRainbow;
    },

    updatePlot(n) {
      const data = this.dataFull.slice(0, n + 1);
      const lineEnd = data[data.length - 1];
      const point = d3.pointRadial(lineEnd.angle, this.r(lineEnd.radius));
      const chunks = this.chunkDataPad(data, this.nbYear);

      for (const [i, path] of this.arrPath.entries()) {
        path
          .datum(chunks[i])
          .attr('class', 'line')
          .attr('stroke', () => {
            return d3.rgb(this.color(i / this.nbYear));
          })
          .attr('d', this.line);
      }

      this.dot
        .attr('class', 'dot')
        .attr('cx', point[0])
        .attr('cy', point[1])
        .attr('r', 5)
        .attr('fill', 'black');
      this.date.text(lineEnd.year);
    }
  }
};
</script>

<style scoped>
.my-wrapper-block {
  padding-left: 50px;
  padding-right: 50px;
}

.my-location {
  width: 350px;
}

.my-weather {
  width: 350px;
  height: 800px;
  overflow-y: auto;
}

/* #anchor >>> .frame {
  fill: none;
  stroke: #000;
} */

#anchor .axis text {
  font: 10px sans-serif;
}

#anchor >>> .axis line {
  fill: none;
  stroke: #777;
  stroke-dasharray: 1, 4;
}

#anchor >>> .axis circle {
  fill: none;
  stroke: red;
  stroke-dasharray: 6, 2;
}

#anchor >>> .axis :first-of-type circle {
  fill: none;
  stroke: #777;
  stroke-dasharray: 1, 4;
}

#anchor >>> .line {
  fill: none;
  stroke-width: 1px;
}
</style>

<style></style>
