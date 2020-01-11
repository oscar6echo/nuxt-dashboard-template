<template>
  <div v-html="compiledMarkdown"></div>
</template>

<script>
import marked from 'marked';

export default {
  name: 'Markdown',
  components: {},
  props: { markdown: { type: String, required: true } },
  data() {
    return {};
  },

  computed: {
    compiledMarkdown() {
      return marked(this.markdown, {});
    }
  }
};
</script>

<style lang="scss" scoped></style>
