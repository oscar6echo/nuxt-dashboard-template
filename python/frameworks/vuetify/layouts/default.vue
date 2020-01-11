<template>
  <v-app dark>
    <NavBar />
    <v-content class="top-wrapper">
      <!-- <div class="my-wrapper"> -->

      <!-- <div class="my-content"> -->
      <v-container fluid class="top-wrapper">
        <nuxt />
      </v-container>
      <!-- </div> -->
      <!-- </div> -->
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

/* .my-wrapper { */
/* min-height: 100vh;
  position: relative;
  margin: 0; */

/* -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; */
/* } */
/* .my-content {
  min-height: 900px;
  overflow-y: scroll;
  margin-top: 10px;
} */
</style>
