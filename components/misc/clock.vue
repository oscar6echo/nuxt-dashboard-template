<template>
  <div class="subtitle-1 ma-1 px-2">
    {{ timeDisplayed }}
  </div>
</template>

<script>
export default {
  name: 'Clock',
  props: { dateTime: { type: Date, required: true } },
  data() {
    return {};
  },
  computed: {
    hours() {
      return this.getZeroPad(this.dateTime.getHours());
    },
    minutes() {
      return this.getZeroPad(this.dateTime.getMinutes());
    },
    seconds() {
      return this.getZeroPad(this.dateTime.getSeconds());
    },
    timeDisplayed() {
      return this.hours + ':' + this.minutes + ':' + this.seconds;
    }
  },
  methods: {
    getZeroPad(n) {
      return (parseInt(n, 10) >= 10 ? '' : '0') + n;
    }
  }
};
</script>

<style scoped></style>
