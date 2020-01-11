<template>
  <div class="my-container-block">
    <div class="d-flex flex-column align-items-center">
      <h3 class="modt my-title my-3">{{ title }}</h3>

      <h6 class="modt my-subtitle mb-4">
        Bitcoin Transactions Real time from
        <a href="https://www.blockchain.com/api/api_websocket"
          >blockchain.com</a
        >
      </h6>

      <div class="d-flex justify-content-between my-wrapper mt-2 mb-4">
        <div class="d-flex flex-row"></div>
        <div class="d-flex flex-row justify-content-end">
          <b-form-select
            v-model="fieldSelected"
            :options="fieldOptions"
            class="modt dropdown my-dropdown m-1"
          />
        </div>
      </div>

      <PlotBitcoin />
    </div>
  </div>
</template>

<script>
import { capitalCase } from 'change-case';
import PlotBitcoin from '~/components/tab-bitcoin-plot.vue';
import { getStateFromUrl, updateStateInUrl } from '~/js/generic/app-state';
import log from '~/js/generic/log';

export default {
  name: 'TabBitcoin',
  components: { PlotBitcoin },
  props: {},
  data() {
    return {
      dateTime: new Date(),
      fieldSelected: null,
      objFieldOptions: {
        size: 'TX Size',
        tcPct: 'TX Transaction Fee (% Value)',
        valueEUR: 'TX Value in EUR'
      },
      mounted: true
    };
  },
  computed: {
    title() {
      return capitalCase('bitcoin transactions');
    },
    fieldOptions() {
      return Object.entries(this.objFieldOptions).map((e) => ({
        value: e[0],
        text: e[1]
      }));
    }
  },
  watch: {
    fieldSelected: {
      handler(newVal, oldVal) {
        log.watchStart(this, 'fieldSelected', [newVal, oldVal]);
        if (this.fieldSelected) this.updateState();
      },
      immediate: true
    }
  },
  mounted() {
    const state = getStateFromUrl(this);
    if (state.bitcoin) {
      this.fieldSelected = state.bitcoin.fieldSelected;
    } else {
      this.fieldSelected = 'size';
    }
  },

  methods: {
    updateState() {
      const fieldSelected = this.fieldSelected;
      log.methodStart(this, 'updateState', this.fieldSelected);

      updateStateInUrl({
        that: this,
        update: { bitcoin: { fieldSelected } }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.my-container-block {
  padding-left: 50px;
  padding-right: 50px;
}

.my-wrapper {
  width: 950px;
}

.my-dropdown {
  width: 270px;
}
</style>

<style></style>
