export const state = () => ({
  countries: [],
  current: {}
});

export const getters = {
  countries: (state) => state.countries,
  current: (state) => state.current
};

export const mutations = {
  setCountries(state, countries) {
    state.countries = countries;
  },
  setCurrent(state, current) {
    state.current = current;
  }
};

export const actions = {
  setCountries(ctx, countries) {
    ctx.commit('setCountries', countries);
  },
  setCurrent(ctx, current) {
    ctx.commit('setCurrent', current);
  }
};
