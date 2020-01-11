<template>
  <div></div>
</template>

<script>
import dashboard from '~/js/generic/dashboard';
import log from '~/js/generic/log';

export default {
  name: 'DataCentral',
  data() {
    return {};
  },
  computed: {
    routeName() {
      return this.$route.name;
    }
  },
  watch: {
    routeName: {
      handler() {
        this.updateActiveTab();
      },
      immediate: true
    }
  },
  methods: {
    updateActiveTab() {
      log.methodStart(this, 'updateActiveTab', this.routeName);

      const conf = this.$store.getters['dashboard/conf'];
      const pos = dashboard.getPosFromRoute(conf, this.routeName);
      const obj = {};
      if (pos) {
        if (pos.tab) obj.tab = pos.tab.idx;
        if (pos.sub) {
          obj.sub = { [pos.tab.idx]: pos.sub.idx };
        }
        this.$store.dispatch('dashboard/updateActiveTab', obj);

        log.methodEnd(this, 'updateActiveTab', JSON.stringify(obj));
      }
    }
  }
};
</script>
