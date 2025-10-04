import axios from "axios";

export default {
  namespaced: true,
  state: {
    stats: null,
    loading: false,
  },
  mutations: {
    SET_STATS(state, stats) {
      state.stats = stats;
    },
    SET_LOADING(state, val) {
      state.loading = val;
    },
  },
  actions: {
    async fetchStats({ commit }) {
      commit("SET_LOADING", true);
      try {
        const { data } = await axios.get("/dashboard/stats");
        commit("SET_STATS", data);
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
  getters: {
    stats: (state) => state.stats,
    isLoading: (state) => state.loading,
  },
};
