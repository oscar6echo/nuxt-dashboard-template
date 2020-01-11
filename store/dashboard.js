export const state = () => ({
  conf: null,
  activeTab: { tab: null, sub: null }
});

export const getters = {
  conf: (state) => state.conf,
  activeTab: (state) => state.activeTab
};

export const mutations = {
  setConf(state, data) {
    const data2 = { ...data };
    Object.freeze(data2);
    state.conf = data2;
  },
  updateActiveTab(state, update) {
    state.activeTab.tab = update.tab;
    state.activeTab.sub = Object.assign(
      state.activeTab.sub || {},
      update.sub || {}
    );
  }
};

export const actions = {
  setConf(context, data) {
    context.commit('setConf', data);
  },
  updateActiveTab(context, data) {
    context.commit('updateActiveTab', data);
  }
};
