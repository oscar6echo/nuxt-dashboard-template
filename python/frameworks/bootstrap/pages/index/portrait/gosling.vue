<template>
  <TabPortrait :filename="filename" />
</template>

<script>
import TabPortrait from '~/components/tab-portrait';

export default {
  name: 'Person2',
  components: { TabPortrait },
  props: {},
  data() {
    return {
      filename: 'gosling-2.jpg'
    };
  }
};
</script>

<style lang="scss" scoped></style>
