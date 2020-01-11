<template>
  <div fluid class=" my-wrapper-block">
    <div class="d-flex flex-column align-center">
      <div class="display-1 modt my-title mt-1 mb-2">{{ title }}</div>
      <div class="subtitle-1 modt my-subtitle mb-3">
        Advanced <a href="https://d3js.org/">d3js</a> - Straight from this
        <a href="https://observablehq.com/@oscar6echo">ObservableHQ</a>
        <a href="https://observablehq.com/@d3/world-tour">notebook</a>
      </div>
      <div class="subtitle-1 mb-3">
        {{ current }}
      </div>

      <div class="d-flex flex-row justify-space-between mt-2 mb-4 my-wrapper">
        <div id="trip-time">
          <v-text-field
            v-model.number="tripTimeSec"
            type="number"
            step="0.5"
            label="Trip time (seconds)"
            class="my-square-box"
            outlined
            dense
          ></v-text-field>
        </div>
        <div id="select-country">
          <v-select
            v-model="selectedCountry"
            :items="optionsCountry"
            label="Travel to Country"
            outlined
            dense
            class="my-square-box"
          ></v-select>
        </div>
      </div>

      <Globe :style-globe="styleGlobe" />
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

.my-wrapper {
  width: 500px;
}

#trip-time {
  width: 150px;
}

#select-country {
  width: 250px;
}

.my-square-box {
  border-radius: 0;
}
</style>

<style></style>
