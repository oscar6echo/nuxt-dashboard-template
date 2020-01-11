<template>
  <div class="my-wrapper-block">
    <div class="d-flex flex-column align-items-center">
      <h3 class="modt my-title mt-5 mb-2">{{ titleFormatted }}</h3>
      <h6 class="modt my-subtitle mb-4">
        A dashboard without any text is usually missing something
      </h6>

      <div class="d-flex flex-row mt-2 mb-4 my-wrapper">
        <Markdown :markdown="markdown" />
      </div>
    </div>
  </div>
</template>

<script>
import { capitalCase } from 'change-case';
import Markdown from '~/components/misc/markdown';
import requestCdn from '~/api/api-cdn';
import ApiCdnData from '~/api/api-cdn-dataclass';

export default {
  name: 'TabkWiki',
  components: { Markdown },
  props: {},
  data() {
    return {
      title: 'disclaimer',
      filename: 'disclaimer.md',
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
  height: 1000px;
  overflow-y: scroll;
}
</style>
