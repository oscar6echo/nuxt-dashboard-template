<template>
  <div class="container fluid d-flex flex-column my-container">
    <Tabs :path-obj="pathObj" class="align-self-start" />
    <div class="debug">
      <nuxt-child keep-alive />
    </div>
  </div>
</template>

<script>
import Tabs from '~/components/generic/tabs';

export default {
  components: {
    Tabs
  },
  data() {
    return {
      pathObj: { level: 2, path: 'realtime' }
    };
  }
};
</script>

<style scoped>
.my-container {
  height: 100%;
}
/* .debug {
  border: 2px solid blue;
} */
</style>
