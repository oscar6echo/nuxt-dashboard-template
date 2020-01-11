<template>
  <div>
    <div
      v-if="isRouterModeHistory"
      class="container-fluid d-flex justify-content-center align-items-center my-wrapper"
    >
      <div class="card my-4 text-center my-card ">
        <div class="card-body">
          <h3 class="card-title">
            Error
            <span class="error-code">{{ error.statusCode }}</span>
          </h3>
          <h5>{{ error.message }}</h5>
          <br />
          <nuxt-link :to="initPath">
            <b-button
              variant="primary"
              class="btn btn-md btn-outline-primary mx-2 my-button"
              >Back to Home Page 22</b-button
            >
          </nuxt-link>
        </div>
      </div>
    </div>
    <div v-else></div>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: () => ({})
    }
  },
  created() {
    // HACK
    // HACK
    // HACK
    // HACK
    // HACK
    // HACK

    console.log('++++ error.vue created', this.$router.mode);

    if (this.$router.mode !== 'history') {
      // START HACK
      // to route to root url
      // for some reason a perfectly valid url leads here
      console.log('++++ HACK IN ERROR.VUE');
      console.log('++++ RETOUTE TO /');
      this.$router.push('/');

      // END HACK
      // END HACK
      // END HACK
    }
  }
};
</script>
<style lang="scss" scoped>
.my-wrapper {
  height: 500px;
}

.my-card {
  width: 400px;
  height: 220px;
}
.error-code {
  color: $corp-red;
}

.my-button {
  border-radius: 0;
  background-color: white;
  color: black;
  border: 1px solid $corp-red;
}

.my-button:hover {
  background-color: $corp-red;
  color: white;
  border: 1px solid $corp-red;
}
</style>
