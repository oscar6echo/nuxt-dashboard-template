<template>
  <v-container class="my-wrapper-block">
    <div class="d-flex flex-column align-center">
      <div class="d-flex flex-row mt-2 my-wrapper">
        <Markdown :markdown="markdown" />
      </div>
    </div>
  </v-container>
</template>

<script>
import { capitalCase } from 'change-case';
import Markdown from '~/components/misc/markdown';
import requestCdn from '~/api/api-cdn';
import ApiCdnData from '~/api/api-cdn-dataclass';

export default {
  name: 'TabkFractalsInfo',
  components: { Markdown },
  props: {},
  data() {
    return {
      title: 'Fractals',
      filename: 'fractals-info.md',
      markdown: ''
    };
  },
  computed: {
    titleFormatted() {
      return capitalCase(this.title);
    }
  },
  mounted() {
    this.buildDataCdn();
  },
  methods: {
    async buildDataCdn() {
      const rawData = await requestCdn(this.$axios, this.filename);
      const cdnData = new ApiCdnData(rawData);
      this.markdown = cdnData.data.output;
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
  border: 1px solid $grey-border;
  padding: 40px;
  height: 960px;
  overflow-y: scroll;
}
</style>
