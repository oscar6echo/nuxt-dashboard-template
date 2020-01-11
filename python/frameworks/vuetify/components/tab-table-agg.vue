<template>
  <div>
    <AgGridVue
      :style="style"
      :row-data="rowData"
      :column-defs="columnDefs"
      :grid-options="gridOptions"
      :quick-filter-text="quickFilterText"
      :modules="modules"
      class="ag-theme-balham"
    ></AgGridVue>
  </div>
</template>

<script>
import { AgGridVue } from '@ag-grid-community/vue';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import gql from 'graphql-tag';

import aggrid from '~/js/aggrid';

export default {
  name: 'TabTableAgg',
  components: { AgGridVue },
  props: {
    counter: { type: Number, required: true },
    quickFilterText: { type: String, required: true }
  },
  data() {
    return {
      // apollo
      subscription: null,
      skipSubscription: true,

      // ag-grid
      modules: AllCommunityModules,
      gridApi: null,
      columnApi: null,
      rowData: null,
      columnDefs: [],
      gridOptions: {
        defaultColDef: {
          editable: false,
          resizable: true,
          sortable: true,
          filter: true,
          enableCellChangeFlash: true
        },
        animateRows: false,
        suppressColumnVirtualisation: true,
        onGridReady: this.onGridReady
      }
    };
  },
  computed: {
    style() {
      return `width: 100%; height: 850px;`;
    }
  },
  watch: {
    counter: {
      handler() {
        this.reloadData();
      },
      immediate: true
    }
  },
  beforeMount() {
    this.columnDefs = this.buildColDefs();
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.columnApi = this.gridOptions.columnApi;
  },
  methods: {
    onGridReady(params) {
      this.sizeColumnsToFit();
      aggrid.setSizeToFitOnWindowResize(params.api);
    },

    async reloadData() {
      //   const client = this.$apollo.getClient('first');
      window.apollo = this.$apollo;
      const query = gql`
        {
          countries {
            name
            continent {
              name
            }
            code
            native
            phone
            emoji
            languages {
              name
            }
          }
        }
      `;
      const variables = {};

      //   // eslint-disable-next-line no-constant-condition
      //   if (true) {
      const res = await this.$apollo.query({ query, variables });

      const rowData = [];
      for (const e of res.data.countries) {
        rowData.push({
          country: e.name,
          continent: e.continent.name,
          code: e.code,
          phone: e.phone,
          native: e.native,
          emoji: e.emoji,
          languages: e.languages.map((f) => f.name).join(', ')
        });
      }
      rowData.sort((a, b) =>
        a.country < b.country ? -1 : a.country > b.country ? 1 : 0
      );

      this.rowData = rowData;
      //   } else {
      //     console.log('APOLLO REQUEST DEACTIVATED');
      //     this.rowData = [];
      //   }
    },

    buildColDefs() {
      return [
        {
          headerName: 'Continent',
          field: 'continent'
        },
        {
          headerName: 'Name',
          field: 'country'
        },
        {
          headerName: 'Native',
          field: 'native'
        },
        {
          headerName: 'Phone',
          field: 'phone',
          width: 100,
          suppressSizeToFit: true
        },
        {
          headerName: 'Flag',
          field: 'emoji',
          width: 80,
          suppressSizeToFit: true
        },
        {
          headerName: 'Languages',
          field: 'languages'
        }
      ];
    },

    exportAsCsv() {
      aggrid.exportAsCsv(this);
    },

    autoSizeColumns() {
      aggrid.autoSizeColumns(this.columnApi);
    },

    sizeColumnsToFit() {
      aggrid.sizeColumnsToFit(this.gridApi);
    }
  }
};
</script>

<style lang="scss" scoped></style>
