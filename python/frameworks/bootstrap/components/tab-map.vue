<template>
  <div class="my-wrapper-block">
    <div class="d-flex flex-column align-items-center">
      <h3 class="modt my-title my-2">{{ title }}</h3>
      <h6 class="modt my-subtitle mb-3">
        Advanced <a href="https://d3js.org/">d3js</a> - Straight from this
        <a href="https://observablehq.com/@oscar6echo">ObservableHQ</a>
        <a href="https://observablehq.com/@d3/world-tour">notebook</a>
      </h6>
      <h6 id="my-subtitle">
        {{ current }}
      </h6>

      <div class="d-flex flex-row mt-2 mb-4">
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span id="trip-time-label" class="input-group-text"
              >Trip Time (sec)</span
            >
          </div>
          <input
            id="trip-time"
            v-model.number="tripTimeSec"
            type="number"
            step="0.1"
            class="form-control"
          />
        </div>
        <b-form-select
          v-model="selectedCountry"
          :options="optionsCountry"
          class="modt my-dropdown mx-3"
        ></b-form-select>
      </div>
      <div class="my-5">
        <Globe :styleGlobe="styleGlobe" />
      </div>
    </div>
  </div>
</template>

<script>
import { capitalCase } from 'change-case';
import Globe from '~/components/tab-map-globe.vue';
import { getStateFromUrl, updateStateInUrl } from '~/js/generic/app-state';
import log from '~/js/generic/log';

export default {
  name: 'TabMap',
  components: { Globe },
  props: {},
  data() {
    return {
      tripTimeSec: 3.0,
      selectedCountry: '',
      optionsCountry: [],
      styleGlobe: { width: 700, height: 500 }
    };
  },
  computed: {
    title() {
      return capitalCase('flight path');
    },
    countries() {
      return this.$store.getters['globe/countries'];
    },
    current() {
      return this.$store.getters['globe/current'];
    }
  },
  watch: {
    countries: {
      handler() {
        this.optionsCountry = [
          { value: '', text: 'Select a Country', disabled: true },
          ...this.countries.map((e) => ({ value: e, text: e }))
        ];
      },
      immediate: true
    },
    selectedCountry: {
      handler(newVal, oldVal) {
        log.watchStart(this, 'selectedCountry', [newVal, oldVal]);
        this.updateState();
      },
      immediate: false
    },
    tripTimeSec: {
      handler(newVal, oldVal) {
        log.watchStart(this, 'tripTimeSec', [newVal, oldVal]);
        this.updateState();
      },
      immediate: false
    }
  },
  mounted() {
    const state = getStateFromUrl(this);
    if (state.globe) {
      this.selectedCountry = state.globe.selectedCountry;
      this.tripTimeSec = state.globe.tripTimeSec;
    }
  },

  methods: {
    updateState() {
      const selectedCountry = this.selectedCountry;
      const tripTimeSec = this.tripTimeSec;
      log.methodStart(this, 'updateState', [selectedCountry, tripTimeSec]);

      updateStateInUrl({
        that: this,
        update: { globe: { selectedCountry, tripTimeSec } }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.my-wrapper-block {
  padding-left: 50px;
  padding-right: 50px;
}

#trip-time-label {
  width: 150px;
  border-radius: 0;
}

#trip-time {
  width: 90px;
  border-radius: 0;
}
</style>
