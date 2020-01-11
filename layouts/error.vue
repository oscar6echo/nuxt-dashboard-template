<template>
  <v-container>
    <div
      v-if="isRouterModeHistory"
      class="container-fluid d-flex justify-center align-center my-wrapper"
    >
      <v-card text class="my-4 text-center my-card ">
        <div class="headline mt-5">
          Error
          <span class="error-code">{{ error.statusCode }}</span>
        </div>
        <v-card-text class="subtitle-1">{{ error.message }}</v-card-text>
        <br />
        <v-btn text class="modt action-button ma-2 px-2" @click="toHome"
          >Back to Home Page</v-btn
        >
      </v-card>
    </div>
    <div v-else></div>
  </v-container>
</template>

<script>
// import { buildLink } from '~/js/generic/app-state';
// import log from '~/js/generic/log';

export default {
  props: {
    error: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    isRouterModeHistory() {
      //   console.log('__'.repeat(50));
      //   console.log(this.$router.mode);
      //   console.log(this.$router.mode === 'history');

      return this.$router.mode === 'history';
    },
    // conf() {
    //   return this.$store.getters['dashboard/conf'];
    // },
    // query() {
    //   return this.$route.query || {};
    // },
    initPath() {
      return '/';
      //   const path = this.conf ? this.conf.navBarLink : '/';
      //   console.log(path);
      //   const link = buildLink({ path, query: this.query });
      //   return link;
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

    if (!this.isRouterModeHistory) {
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
  },
  methods: {
    toHome() {
      console.log('should redirect to /');
      this.$router.push('/');
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
  border: 1px solid $grey-border;
}

.my-title {
  text-align: center;
}

.error-code {
  color: $corp-red;
}

// .my-button {
//   border-radius: 0;
//   background-color: white;
//   color: black;
//   border: 1px solid $corp-red;
// }

// .my-button:hover {
//   background-color: $corp-red;
//   color: white;
//   border: 1px solid $corp-red;
// }
</style>
