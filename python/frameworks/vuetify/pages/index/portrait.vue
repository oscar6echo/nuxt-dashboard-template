<template>
  <v-container fluid class="d-flex flex-column pt-0">
    <Tabs :path-obj="pathObj" class="align-self-start" />
    <div class="debug">
      <nuxt-child keep-alive />
    </div>
  </v-container>
</template>

<script>
import Tabs from '~/components/generic/tabs';

export default {
  components: {
    Tabs
  },
  data() {
    return {
      pathObj: { level: 2, path: 'portrait' }
    };
  }
};
</script>

<style scoped>
/* .debug {
  border: 2px solid blue;
} */
</style>
