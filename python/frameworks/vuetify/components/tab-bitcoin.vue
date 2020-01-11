<template>
  <div class="my-wrapper-block">
    <div class="d-flex flex-column align-center">
      <div class="display-1 modt my-title mt-5 mb-2">{{ title }}</div>

      <div class="subtitle-1 modt my-subtitle mb-5">
        Bitcoin Transactions Real time from
        <a href="https://www.blockchain.com/api/api_websocket"
          >blockchain.com</a
        >
      </div>

      <div class="d-flex justify-space-between my-wrapper my-4">
        <div class="d-flex flex-row"></div>
        <div class="d-flex flex-row justify-end">
          <div id="select-field">
            <v-select
              v-model="fieldSelected"
              :items="fieldOptions"
              label="Select Transaction Attribute"
              outlined
              dense
              class="my-square-box"
            ></v-select>
          </div>
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
.my-wrapper-block {
  padding-left: 50px;
  padding-right: 50px;
}

.my-wrapper {
  width: 900px;
}

#select-field {
  width: 300px;
}

.my-square-box {
  border-radius: 0;
}
</style>
