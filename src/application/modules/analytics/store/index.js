import http from "@/service/axios";

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
        const { data } = await http.get("/dashboard/stats");
        console.log("Dashboard stats API response:", data);
        // Backend returns { success: true, data: { stats... } }
        commit("SET_STATS", data.data);
        console.log("Stats committed to store:", data.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw error;
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
