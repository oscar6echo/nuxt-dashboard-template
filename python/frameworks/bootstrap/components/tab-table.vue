<template>
  <div class="container fluid my-container-block">
    <div class="d-flex flex-column align-items-center">
      <h3 class="modt my-title my-2">{{ title }}</h3>
      <h6 class="modt my-subtitle mb-3">
        Data from GraphQL API
        <a href="https://countries.trevorblades.com"
          >https://countries.trevorblades.com</a
        >
        - <a href="https://www.ag-grid.com/">AgGrid</a> Table
      </h6>

      <div class="d-flex justify-content-between my-wrapper">
        <div class="d-flex flex-row">
          <input
            id="filter-text-box"
            v-model="quickFilterText"
            class="m-1"
            type="text"
            placeholder="Filter..."
          />
          <button @click="exportAsCsv" class="modt action-button m-1 px-2">
            Export to Csv
          </button>
          <button @click="autoSize" class="modt action-button m-1 px-2">
            Auto Size
          </button>
          <button @click="sizeToFit" class="modt action-button m-1 px-2">
            Size To Fit
          </button>
        </div>
        <div class="d-flex flex-row justify-content-end">
          <button @click="incrCounter" class="modt action-button m-1 px-2">
            Reload
          </button>
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
  </div>
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
.my-container-block {
  //   background-color: aliceblue;
  padding-left: 50px;
  padding-right: 50px;
}

.my-wrapper {
  width: 100%;
}

.my-wrapper-grid {
  width: 100%;
}
</style>
