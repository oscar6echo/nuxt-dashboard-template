import d3 from '~/assets/d3';
import Clock from '~/components/misc/clock';
import { getStateFromUrl } from '~/js/generic/app-state';
import log from '~/js/generic/log';

export default {
  name: 'TabBitcoinPlot',
  components: { Clock },
  props: {},
  data() {
    return {
      fieldSelected: 'size',
      objFieldOptions: {
        size: 'TX Size',
        tcPct: 'TX Transaction Fee (% Value)',
        valueEUR: 'TX Value in EUR'
      },
      socket: null,
      g: null,
      data: [],
      intervalChart: null,
      dateTime: new Date(),
      fx: { EUR: { last: 6600 } }
    };
  },
  computed: {
    url() {
      return this.$route;
    }
  },
  watch: {
    url: {
      handler() {
        log.watchStart(this, 'url', [JSON.stringify(this.url.query)]);
        const state = getStateFromUrl(this);
        if (state.bitcoin) {
          this.fieldSelected = state.bitcoin.fieldSelected;
          if (this.yLabel) {
            this.yLabel.text(this.objFieldOptions[this.fieldSelected]);
          }
          log.watchEnd(this, 'url changed prop', [this.fieldSelected]);
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.initWS();
    this.buildChart();
    this.intervalChart = setInterval(this.updateChart, 2 * 60);
    this.intervalTx = setInterval(this.updateFx, 1 * 15 * 60 * 1000);
  },
  beforeDestroy() {
    clearInterval(this.intervalChart);
    clearInterval(this.intervalFx);
  },

  methods: {
    async updateFx() {
      const url = 'https://blockchain.info/ticker?cors=true';
      const response = await fetch(url);
      this.fx = await response.json();
    },
    initWS() {
      log.methodStart(this, 'initWS');

      // https://www.blockchain.com/api/api_websocket
      this.socket = new WebSocket('wss://ws.blockchain.info/inv');
      log.print({ obj: this.socket, name: 'blockchain.com ws' });

      this.socket.onerror = (event) => {
        console.log(event);
      };

      this.socket.onclose = (event) => {
        this.socket = null;
        console.log(
          'websocketd closed with code: ' +
            event.code +
            " - reason: '" +
            event.reason +
            "'"
        );
      };

      this.socket.onopen = () => {
        const msgTest = {
          op: 'ping'
        };
        this.socket.send(JSON.stringify(msgTest));

        const msg = {
          op: 'unconfirmed_sub'
        };
        this.socket.send(JSON.stringify(msg));
      };

      this.socket.onmessage = (event) => {
        const datum = JSON.parse(event.data);
        // console.log(datum);
        this.storeData(datum);
      };
    },
    buildChart() {
      log.methodStart(this, 'buildChart');

      const width = 900;
      const margin = { top: 20, right: 20, bottom: 30, left: 50 };
      const _width = width - margin.left - margin.right;
      const height = width / 1.6 - margin.top - margin.bottom;

      const x = d3.scaleTime().range([0, _width]);

      const xAxis = d3.axisBottom().scale(x);

      const ySize = d3
        .scaleLog()
        .domain([1e2, 1e4])
        .range([height, 0]);
      const yAxisSize = d3.axisLeft().scale(ySize);

      const yTcPct = d3
        .scaleLog()
        .domain([1e-5, 5e-1])
        .range([height, 0]);
      const yAxisTcPct = d3.axisLeft().scale(yTcPct);

      const yValueEur = d3
        .scaleLog()
        .domain([1e-8, 1])
        .range([height, 0]);
      const yAxisValueEur = d3.axisLeft().scale(yValueEur);

      const svg = d3
        .select('#my-anchor')
        .append('svg')
        .attr('width', _width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

      const g = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      const yLabel = g
        .append('text')
        .text(this.fieldSelected)
        .attr('transform', 'translate(20, 20)');

      g.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')');

      g.append('g').attr('class', 'y axis');

      this.yLabel = yLabel;
      this.g = g;
      this.x = x;
      this.xAxis = xAxis;
      this.y = { size: ySize, tcPct: yTcPct, valueEUR: yValueEur };
      this.yAxis = {
        size: yAxisSize,
        tcPct: yAxisTcPct,
        valueEUR: yAxisValueEur
      };
    },
    updateChart() {
      this.updateData();

      const now = new Date();
      this.dateTime = now;

      this.x.domain([now - 30000, now]);
      const dots = this.g.selectAll('.dot').data(this.data);

      const y = this.y[this.fieldSelected];
      const yAxis = this.yAxis[this.fieldSelected];

      dots
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r', 10)
        .merge(dots)
        .attr('cx', (d) => this.x(d.time))
        .attr('cy', (d) => {
          return y(d[this.fieldSelected]);
        })
        .style('fill', function(d) {
          return 'rgba(0, 0, 0, 0.5)';
        });

      dots.exit().remove();

      this.g.selectAll('.x.axis').call(this.xAxis);
      this.g.selectAll('.y.axis').call(yAxis);
    },

    updateData() {
      while (
        this.data.length &&
        +this.data[0].time < new Date(Date.now() - 30000)
      ) {
        this.data.shift();
      }
    },

    storeData(datum) {
      if (datum.x) {
        const time = new Date();
        const size = datum.x.size;
        const nbInput = datum.x.inputs.length;

        const valueIn = datum.x.inputs
          .map((e) => e.prev_out.value)
          .reduce((acc, v) => acc + v, 0);

        const valueOut = datum.x.out
          .map((e) => e.value)
          .reduce((acc, v) => acc + v, 0);

        const tc = valueIn - valueOut;

        const tcPct = tc / valueIn;

        const valueEUR = valueIn / 1e8 / this.fx.EUR.last;

        const obj = {
          time,
          size,
          nbInput,
          valueIn,
          valueOut,
          tc,
          tcPct,
          valueEUR
        };

        const obj2 = { ...obj };
        delete obj2.time;
        // log.print({ obj: obj2 });

        this.data.push(obj);
      }
    }
  }
};
