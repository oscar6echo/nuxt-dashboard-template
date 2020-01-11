<template>
  <TabPortrait :filename="filename" />
</template>

<script>
import TabPortrait from '~/components/tab-portrait';

export default {
  name: 'Person5',
  components: { TabPortrait },
  props: {},
  data() {
    return {
      filename: 'delevigne-2.jpg'
    };
  }
};
</script>

<style lang="scss" scoped></style>
