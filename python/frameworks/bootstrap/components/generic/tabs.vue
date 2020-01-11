<template>
  <div :class="classOrient" :style="styleTabs">
    <nuxt-link
      v-for="(item, idx) in conf.tabs"
      :key="idx"
      :to="links[idx]"
      class="no-underline"
    >
      <label
        :style="styleTab"
        :class="{ active: selected == idx }"
        class="btn-tab my-0 py-0 my-tab"
        >{{ item.title }}</label
      >
    </nuxt-link>
  </div>
</template>

<script>
import dashboard from '~/js/generic/dashboard';
import log from '~/js/generic/log';
import { buildLink } from '~/js/generic/app-state';

export default {
  name: 'Tabs',
  props: {
    pathObj: { type: Object, required: true }
  },
  data() {
    return {
      pathIdx: null,
      conf: {}
    };
  },
  computed: {
    classOrient() {
      const suffix = this.conf.vertical ? 'v' : 'h';
      return `orient-${suffix} my-tabs-${suffix}`;
    },
    styleTabs() {
      if (this.conf.style.width) return { width: this.conf.style.width };
      return {};
    },
    styleTab() {
      if (this.conf.style.height)
        return {
          width: this.conf.style.width,
          height: this.conf.style.height
        };
      return {};
    },
    prefix() {
      if (this.pathObj.level === 1) return '/';
      return '/' + this.pathObj.path + '/';
    },
    activeTab() {
      return this.$store.getters['dashboard/activeTab'];
    },
    selected() {
      if (this.pathObj.level === 1)
        return this.$store.getters['dashboard/activeTab'].tab;
      return this.$store.getters['dashboard/activeTab'].sub[this.pathIdx];
    },
    query() {
      return this.$route.query || {};
    },
    links() {
      return this.conf.tabs.map((e) => {
        const path = this.prefix + e.path;
        const link = buildLink({ path, query: this.query });
        return link;
      });
    }
  },
  watch: {},
  created() {
    log.hookStart(this, 'created');

    const root = this.$store.getters['dashboard/conf'];
    this.pathIdx = dashboard.getIdxFromPath(root, this.pathObj);
    const defaultStyle = root.defaultStyle;

    let confSource, styleSource;
    if (this.pathObj.level === 1) {
      confSource = root;
      styleSource = defaultStyle.level1;
    } else {
      const obj = root.tabs.filter((e) => e.path === this.pathObj.path)[0];
      confSource = obj;
      styleSource = obj.style || defaultStyle.level2;
    }

    const { tabs } = confSource;
    const { vertical, width, height } = styleSource;
    const style = { width, height };
    this.conf = { tabs, style, vertical };

    log.hookEnd(this, 'created');
  },
  methods: {
    linkTo(prefix, path) {
      return prefix + path;
    }
  }
};
</script>

<style lang="scss" scoped>
.orient-v {
  display: flex;
  flex-direction: column;
}
.orient-h {
  display: flex;
  flex-direction: row;
}

.btn-tab {
  background-color: $grey-btn-base;
  border: $border;
  font-weight: normal;
}

.btn-tab:hover {
  background-color: $grey-btn-hover;
}

.btn-tab.active {
  background-color: $grey-btn-active;
}

.my-tabs-v,
my-tabs-h {
  align-items: center;
  justify-content: center;
}

.my-tabs-v > a:not(:last-child) > label {
  border-bottom: 0px;
}

.my-tabs-h > a:not(:last-child) > label {
  border-right: 0px;
}

.my-tab {
  border-radius: 0;
  width: 100%;
  //    min-height: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-underline {
  text-decoration: none;
  color: black;
}
</style>

<style lang="scss">
// styles available globally
// .btn-action {
//   background-color: $grey-btn-base;
//   border: $border;
// }
</style>
