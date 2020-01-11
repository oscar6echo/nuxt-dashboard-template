<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-html="compiledMarkdown"></div>
</template>

<script>
import marked from '~/js/generic/marked-katex';

export default {
  name: 'Markdown',
  components: {},
  props: { markdown: { type: String, required: true } },
  data() {
    return {};
  },

  computed: {
    compiledMarkdown() {
      const html = marked(this.markdown, {});
      return html;
    }
  }
};
</script>

<style lang="scss" scoped></style>
