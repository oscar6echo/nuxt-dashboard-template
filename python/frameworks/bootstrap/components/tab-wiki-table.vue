<template>
  <div id="my-table"></div>
</template>

<script>
export default {
  name: 'TabWikiTable',
  components: {},
  props: {
    page: { type: String, required: true },
    section: { type: Number, required: true }
  },
  data() {
    return {};
  },
  async mounted() {
    const url = this.buildUrl({ page: this.page, section: this.section });
    const data = await this.getData(url);
    this.buildTable(data);
  },

  methods: {
    buildUrl({ page, section }) {
      let url = 'https://en.wikipedia.org/w/api.php';

      const params = {
        action: 'parse',
        format: 'json',
        page,
        section
      };
      url = url + '?origin=*';

      Object.keys(params).forEach(function(key) {
        url += '&' + key + '=' + params[key];
      });

      return url;
    },
    async getData(url) {
      const response = await fetch(url);
      const json = await response.json();
      const data = json.parse.text['*'];

      return data;
    },
    buildTable(data) {
      const parser = new DOMParser();
      const external = parser.parseFromString(data, 'text/html');
      const table = document
        .getElementById('my-table')
        .appendChild(external.querySelector('table'));
      table.id = `my-table-${this.page}-${this.section}`;
      table.style = `
        display: block;
        position: relative;
        max-width: 900px;
        max-height: 800px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        `;
      return table;
    }
  }
};
</script>

<style lang="scss" scoped></style>

<style lang="scss">
#my-table tr {
  border-top: 1px solid #ccc;
}
</style>
