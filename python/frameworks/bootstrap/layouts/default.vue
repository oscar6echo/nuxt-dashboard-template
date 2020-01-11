<template>
  <div class="my-wrapper">
    <NavBar />
    <div class="my-content">
      <nuxt />
    </div>
    <Footer />
  </div>
</template>

<script>
import NavBar from '~/components/generic/nav-bar.vue';
import Footer from '~/components/generic/footer.vue';
export default {
  components: {
    NavBar,
    Footer
  }
};
</script>

<style scoped>
.my-wrapper {
  min-height: 100vh;
  position: relative;
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.my-content {
  min-height: 900px;
  overflow-y: scroll;
  margin-top: 10px;
}
</style>
