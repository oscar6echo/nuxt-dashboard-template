import * as topojson from 'topojson-client';
import { cloneDeep } from 'lodash';
import d3 from '~/assets/d3';
import { Versor } from '~/js/geo';
import { getStateFromUrl } from '~/js/generic/app-state';
import log from '~/js/generic/log';

export default {
  name: 'TabMapGlobe',
  props: {
    styleGlobe: { type: Object, required: true }
  },
  data() {
    return {
      g: {},
      tilt: 0,
      selected: null,
      tripTimeSec: 3
    };
  },
  computed: {
    width() {
      return this.styleGlobe.width;
    },
    height() {
      return this.styleGlobe.height;
    },
    url() {
      return this.$route;
    }
  },
  watch: {
    url: {
      handler() {
        log.watchStart(this, 'url', [JSON.stringify(this.url.query)]);
        const state = getStateFromUrl(this);
        if (state.globe) {
          this.selected = state.globe.selectedCountry;
          this.tripTimeSec = +state.globe.tripTimeSec;
          log.watchEnd(this, 'url changed prop', [
            this.selected,
            this.tripTimeSec
          ]);
        }
      },
      immediate: true
    },
    selected: {
      handler(to, from) {
        if (!this.selected) return;
        this.travelTo(from, to);
      },
      immediate: false
    }
  },
  async mounted() {
    log.hookStart(this, 'mounted');

    this.g.sphere = { type: 'Sphere' };

    const world = await d3.json(
      'https://cdn.jsdelivr.net/npm/world-atlas@1/world/110m.json'
    );

    this.g.land = topojson.feature(world, world.objects.land);

    this.g.countries = topojson.feature(
      world,
      world.objects.countries
    ).features;

    this.g.idToCountry = this.g.countries.reduce((acc, cur) => {
      const obj = cloneDeep(acc);
      obj[cur.id] = cur;
      return obj;
    }, {});

    this.g.borders = topojson.mesh(
      world,
      world.objects.countries,
      (a, b) => a !== b
    );

    this.g.tilt = 20;

    const atlas = await d3.tsv(
      'https://cdn.jsdelivr.net/npm/world-atlas@1/world/110m.tsv'
    );

    this.g.idToName = new Map(
      atlas.map(({ iso_n3, name_long }) => [iso_n3, name_long])
    );
    this.g.nameToId = new Map(
      atlas.map(({ iso_n3, name_long }) => [name_long, iso_n3])
    );

    const arrCountries = Array.from(this.g.idToName.values()).sort();

    this.$store.dispatch('globe/setCountries', arrCountries);

    this.setUpCanvas();

    log.hookEnd(this, 'mounted');
  },

  methods: {
    setUpCanvas() {
      log.methodStart(this, 'setUpCanvas');

      const margin = 10;
      this.g.projection = d3.geoOrthographic().fitExtent(
        [
          [margin, margin],
          [this.width - margin, this.height - margin]
        ],
        this.g.sphere
      );

      this.g.context = this.$refs['my-canvas'].getContext('2d');
      this.g.path = d3.geoPath(this.g.projection, this.g.context);

      this.travelTo(null, this.selected);
    },
    async travelTo(fromName, toName) {
      log.funcStart('travelTo', [fromName, ' to ', toName]);

      let fromId, fromCountry, r1, p1;
      if (fromName && this.g.nameToId) {
        fromId = this.g.nameToId.get(fromName);
        fromCountry = this.g.idToCountry[fromId];
        p1 = d3.geoCentroid(fromCountry);
        r1 = [-p1[0], this.tilt - p1[1], 0];
      } else {
        p1 = [0, 0];
        r1 = [0, 0, 0];
      }

      let toId, toCountry, r2, p2;
      if (toName && this.g.nameToId) {
        toId = this.g.nameToId.get(toName);
        toCountry = this.g.idToCountry[toId];
        p2 = d3.geoCentroid(toCountry);
        r2 = [-p2[0], this.tilt - p2[1], 0];
      } else {
        p2 = [0, 0];
        r2 = [0, 0, 0];
      }

      const ip = d3.geoInterpolate(p1, p2);

      const iv = Versor.interpolateAngles(r1, r2);
      const country = toCountry;

      const current = {
        country: toName,
        centerCoords: p2
      };
      this.$store.dispatch('globe/setCurrent', current);

      await d3
        .transition()
        .duration(this.tripTime || 1000)
        .tween('render', () => (t) => {
          this.g.projection.rotate(iv(t));
          this.render(country, {
            type: 'LineString',
            coordinates: [p1, ip(t)]
          });
        })
        .transition()
        .tween('render', () => (t) => {
          this.render(country, {
            type: 'LineString',
            coordinates: [ip(t), p2]
          });
        })
        .end();
    },
    render(country, arc) {
      const ctx = this.g.context;
      const path = this.g.path;

      ctx.clearRect(0, 0, this.width, this.height);
      ctx.beginPath();
      path(this.g.land);
      ctx.fillStyle = '#ccc';
      ctx.fill();

      ctx.beginPath();
      path(country);
      ctx.fillStyle = '#f00';
      ctx.fill();

      ctx.beginPath();
      path(this.g.borders);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      ctx.beginPath();
      path(this.g.sphere);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1.0;
      ctx.stroke();

      ctx.beginPath();
      path(arc);
      ctx.stroke();

      return ctx.canvas;
    }
  }
};
