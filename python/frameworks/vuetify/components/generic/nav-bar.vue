<template>
  <v-app-bar id="my-navbar" fixed flat light app>
    <nuxt-link :to="initPath"><Logo id="logo-left"/></nuxt-link>
    <v-spacer></v-spacer>
    <v-toolbar-title id="my-title" class="headline">{{
      title
    }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <Logo id="logo-right" />
  </v-app-bar>
</template>

<script>
import Logo from '~/assets/logo/logo-compass.svg';
import { buildLink } from '~/js/generic/app-state';

export default {
  name: 'NavBar',
  components: {
    Logo
  },
  props: {},
  data() {
    return {
      title: 'Demo Dashboard'
    };
  },
  computed: {
    conf() {
      return this.$store.getters['dashboard/conf'];
    },
    activeTab() {
      return this.$store.getters['dashboard/activeTab'];
    },
    query() {
      return this.$route.query || {};
    },
    initPath() {
      const path = this.conf ? this.conf.navBarLink : '/';
      const link = buildLink({ path, keepQuery: false });
      return link;
    }
  }
};
</script>

<style lang="scss" scoped>
#my-navbar {
  border-bottom: $border-light;
}
#my-title {
  text-align: center;
  color: $title-color;
  width: 300px;
}

#logo-left {
  width: 40px;
}
#logo-right {
  width: 40px;
}
</style>
