<template>
  <v-container fluid class=" my-wrapper-block">
    <div class="d-flex flex-column align-center">
      <div class="display-1 modt my-title mt-1 mb-2">{{ title }}</div>
      <div class="subtitle-1 modt my-subtitle mb-3">
        Data from GraphQL API
        <a href="https://countries.trevorblades.com"
          >https://countries.trevorblades.com</a
        >
        - <a href="https://www.ag-grid.com/">AgGrid</a> Table
      </div>

      <div class="d-flex justify-space-between my-wrapper">
        <div class="d-flex flex-row">
          <input
            id="filter-text-box"
            v-model="quickFilterText"
            class="ma-1 my-search"
            type="text"
            placeholder="Filter..."
          />
          <v-btn
            text
            small
            class="modt action-button ma-1 px-2"
            @click="exportAsCsv"
          >
            Export to Csv
          </v-btn>
          <v-btn
            text
            small
            class="modt action-button ma-1 px-2"
            @click="autoSize"
          >
            Auto Size
          </v-btn>
          <v-btn
            text
            small
            class="modt action-button ma-1 px-2"
            @click="sizeToFit"
          >
            Size To Fit
          </v-btn>
        </div>
        <div class="d-flex flex-row justify-end">
          <v-btn
            text
            small
            class="modt action-button ma-1 px-2"
            @click="incrCounter"
          >
            Reload
          </v-btn>
        </div>
      </div>
      <div class="my-wrapper-grid">
        <TableAgg
          ref="table"
          :counter="counter"
          :quick-filter-text="quickFilterText"
        ></TableAgg>
      </div>
    </div>
  </v-container>
</template>

<script>
import { capitalCase } from 'change-case';
import TableAgg from '~/components/tab-table-agg';

export default {
  name: 'TabTable',
  components: { TableAgg },
  props: {},
  data() {
    return {
      quickFilterText: '',
      counter: 0
    };
  },
  computed: {
    title() {
      return capitalCase('countries');
    },
    data() {
      return this.$store.getters['cash-invest/data'];
    }
  },
  watch: {},

  methods: {
    exportAsCsv() {
      this.$refs.table.exportAsCsv();
    },
    sizeToFit() {
      this.$refs.table.sizeColumnsToFit();
    },
    autoSize() {
      this.$refs.table.autoSizeColumns();
    },
    incrCounter() {
      this.counter++;
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
  width: 100%;
}

.my-wrapper-grid {
  width: 100%;
}

.my-search {
  border: 1px solid $grey-border;
}
</style>

<style></style>
