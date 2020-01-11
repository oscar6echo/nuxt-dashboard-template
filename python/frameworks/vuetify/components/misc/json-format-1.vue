<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <pre class="json-formatted" v-html="formatted"></pre>
</template>

<script>
import util from '~/js/generic/util';

export default {
  name: 'JsonFormat',
  props: {
    obj: { type: Object, default: () => ({}) },
    indent: { type: Number, default: () => 4 }
  },

  data() {
    return {};
  },
  computed: {
    formatted() {
      let content = JSON.stringify(this.obj, null, this.indent);
      content = util.syntaxHighlightJson(content);
      return content;
    }
  }
};
</script>

<style lang="scss" scoped></style>

<style>
pre.json-formatted {
  /* outline: 1px solid #ccc; */
  padding: 5px;
  margin: 5px;
}
.string {
  color: green;
}
.number {
  color: darkorange;
}
.boolean {
  color: blue;
}
.null {
  color: magenta;
}
.key {
  color: red;
}
</style>
