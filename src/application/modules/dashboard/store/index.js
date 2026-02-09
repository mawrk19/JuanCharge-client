import http from "@/service/axios";

export default {
  namespaced: true,
  state: {
    overview: null,
    sessions: [],
    recycling: [],
    chartData: [],
    recyclingAnalytics: null,
    loading: false,
    error: null,
  },
  mutations: {
    SET_OVERVIEW(state, data) {
      state.overview = data;
    },
    SET_SESSIONS(state, data) {
      state.sessions = data;
    },
    SET_RECYCLING(state, data) {
      state.recycling = data;
    },
    SET_CHART_DATA(state, data) {
      state.chartData = data;
    },
    SET_RECYCLING_ANALYTICS(state, data) {
      state.recyclingAnalytics = data;
    },
    SET_LOADING(state, val) {
      state.loading = val;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    // Fetch main overview KPIs
    async fetchOverview({ commit }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const { data } = await http.get("/dashboard/overview");
        commit("SET_OVERVIEW", data.data);
        return data.data;
      } catch (error) {
        console.warn("Dashboard overview not available:", error.message);
        return null;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    // Fetch recent charging sessions
    async fetchSessions({ commit }, limit = 10) {
      try {
        const { data } = await http.get(`/dashboard/sessions?limit=${limit}`);
        commit("SET_SESSIONS", data.data || []);
        return data.data;
      } catch (error) {
        console.warn("Dashboard sessions not available:", error.message);
        return null;
      }
    },

    // Fetch recent recycling deposits
    async fetchRecycling({ commit }, limit = 10) {
      try {
        const { data } = await http.get(`/dashboard/recycling?limit=${limit}`);
        commit("SET_RECYCLING", data.data || []);
        return data.data;
      } catch (error) {
        console.warn("Dashboard recycling not available:", error.message);
        return null;
      }
    },
    // Fetch recycling analytics data
    async fetchRecyclingAnalytics({ commit }) {
      commit("SET_LOADING", true);
      try {
        const { data } = await http.get("/admin/analytics/recycling");
        commit("SET_RECYCLING_ANALYTICS", data.data);
        return data.data;
      } catch (error) {
        console.warn("Recycling analytics not available:", error.message);
        return null;
      } finally {
        commit("SET_LOADING", false);
      }
    },
    // Fetch chart data (last 7 days)
    async fetchChartData({ commit }) {
      try {
        const { data } = await http.get("/dashboard/chart");
        commit("SET_CHART_DATA", data.data || []);
        return data.data;
      } catch (error) {
        console.warn("Dashboard chart data not available:", error.message);
        return null;
      }
    },

    // Fetch all dashboard data at once
    async fetchAllDashboardData({ dispatch }) {
      const results = await Promise.allSettled([
        dispatch("fetchOverview"),
        dispatch("fetchSessions", 5),
        dispatch("fetchRecycling", 5),
        dispatch("fetchChartData"),
      ]);
      return results;
    },
  },
  getters: {
    overview: (state) => state.overview,
    sessions: (state) => state.sessions,
    recycling: (state) => state.recycling,
    chartData: (state) => state.chartData,
    recyclingAnalytics: (state) => state.recyclingAnalytics,
    isLoading: (state) => state.loading,
    error: (state) => state.error,
  },
};
