<template>
  <div fluid class="container d-flex flex-column my-container">
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
      pathObj: { level: 2, path: 'bitcoin' }
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
