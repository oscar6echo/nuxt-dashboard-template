<template>
  <nav
    id="my-navbar"
    class="navbar navbar-light bg-white d-flex justify-content-between"
  >
    <nuxt-link :to="initPath"><Logo id="logo-left"/></nuxt-link>

    <div id="my-title" class="navbar-brand">{{ title }}</div>
    <Logo id="logo-right" />
  </nav>
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
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
#my-title {
  text-align: center;
  width: 100%;
  color: $title-color;
  font-size: 30px;
  width: 200px;
}

#logo-left {
  width: 40px;
}
#logo-right {
  width: 40px;
}
</style>
