<template>
  <TabPortrait :filename="filename" />
</template>

<script>
import TabPortrait from '~/components/tab-portrait';

export default {
  name: 'Person1',
  components: { TabPortrait },
  props: {},
  data() {
    return {
      filename: 'obama.png'
    };
  }
};
</script>

<style lang="scss" scoped></style>
