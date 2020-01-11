<template>
  <div class="container-fluid my-container-page">
    <div class="my-page">
      <TabWeather></TabWeather>
    </div>
  </div>
</template>

<script>
import TabWeather from '~/components/tab-weather';

export default {
  name: 'Weather',
  components: { TabWeather },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped></style>

<style></style>
