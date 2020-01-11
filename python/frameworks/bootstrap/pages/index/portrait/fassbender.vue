<template>
  <TabPortrait :filename="filename" />
</template>

<script>
import TabPortrait from '~/components/tab-portrait';

export default {
  name: 'Person4',
  components: { TabPortrait },
  props: {},
  data() {
    return {
      filename: 'fassbender.jpg'
    };
  }
};
</script>

<style lang="scss" scoped></style>
