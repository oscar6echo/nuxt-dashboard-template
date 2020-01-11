<template>
  <TabPortrait :filename="filename" />
</template>

<script>
import TabPortrait from '~/components/tab-portrait';

export default {
  name: 'Person3',
  components: { TabPortrait },
  props: {},
  data() {
    return {
      filename: 'moss-2.jpg'
    };
  }
};
</script>

<style lang="scss" scoped></style>
