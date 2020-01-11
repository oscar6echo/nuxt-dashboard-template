<template>
  <div class="container-fluid my-container-page">
    <div class="my-page">
      <TabBitcoin></TabBitcoin>
    </div>
  </div>
</template>

<script>
import TabBitcoin from '~/components/tab-bitcoin';

export default {
  name: 'Bitcoin',

  components: { TabBitcoin },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped></style>

<style></style>
