<template>
  <v-container fluid class="d-flex flex-row my-container">
    <ManageTabs />
    <Tabs :path-obj="pathObj" class="align-self-start" />
    <div class="my-wrapper-index">
      <nuxt-child keep-alive />
    </div>
  </v-container>
</template>

<script>
import ManageTabs from '~/components/generic/manage-tabs';
import Tabs from '~/components/generic/tabs';

import buildDashboardConf from '~/js/conf/dashboard';
import dashboard from '~/js/generic/dashboard';
import log from '~/js/generic/log';
import { buildLink } from '~/js/generic/app-state';

export default {
  name: 'Root',
  components: {
    ManageTabs,
    Tabs
  },
  data() {
    return {
      pathObj: { level: 1 }
    };
  },
  created() {
    log.hookStart(this, 'created');

    // conf
    const conf = buildDashboardConf();

    this.$store.dispatch('dashboard/setConf', conf);
    this.$store.dispatch('dashboard/updateActiveTab', conf.activeTab);

    log.hookEnd(this, 'created');
  },
  beforeMount() {
    log.hookStart(this, 'beforeMount');

    const conf = this.$store.getters['dashboard/conf'];
    const activeTab = this.$store.getters['dashboard/activeTab'];

    const path = dashboard.defaultRoute(conf, this.$route, activeTab);
    if (path) {
      const link = buildLink({ that: this, path });
      log.print('INIT PUSH - ' + link);
      this.$router.push(link);
    }

    log.hookEnd(this, 'beforeMount');
  }
};
</script>

<style scoped>
.my-wrapper-index {
  width: 100%;
  overflow-x: scroll;
}
</style>
