<template>
  <v-app dark>
    <NavBar />
    <v-content class="top-wrapper">
      <v-container fluid class="top-wrapper">
        <nuxt />
      </v-container>
    </v-content>
    <Footer />
  </v-app>
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
.top-wrapper {
  background-color: white;
}
</style>
