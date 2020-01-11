<template>
  <v-text-field
    :value="formattedValue"
    :class="classString"
    :label="label"
    :disabled="disabled"
    type="number"
    hide-details
    outlined
    dense
    @keyup.enter="updated = $event.target.value"
    @blur="updated = $event.target.value"
  ></v-text-field>
</template>

<script>
export default {
  name: 'InputNumber',
  props: {
    value: { type: Number, required: true },
    label: { type: String, required: true },
    classString: { type: String, required: true },
    format: { type: String, required: false, default: () => '' },
    disabled: { type: Boolean, required: false, default: () => false }
  },
  data() {
    return {
      updated: null
    };
  },
  computed: {
    fmtNumber() {
      let func;
      if (this.format === '') func = (e) => e;
      if (this.format.startsWith('exp-')) {
        const n = this.format.split('-')[1];
        func = (e) => e.toExponential(n);
      }
      if (this.format.startsWith('fixed-')) {
        const n = this.format.split('-')[1];
        func = (e) => e.toFixed(n);
      }
      return func;
    },
    formattedValue() {
      return this.fmtNumber(this.value);
    }
  },
  watch: {
    updated() {
      this.$emit('input', this.updated);
    }
  },
  methods: {}
};
</script>

<style scoped></style>
