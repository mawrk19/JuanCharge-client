export default {
  namespaced: true,
  state: {
    patronData: null,
    loading: false,
    error: null,
  },
  mutations: {
    SET_PATRON_DATA(state, data) {
      state.patronData = data;
    },
    SET_LOADING(state, val) {
      state.loading = val;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    async fetchPatronData({ commit }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        // TODO: Implement API call to fetch patron data
        // const { data } = await http.get("/patron/profile");
        // commit("SET_PATRON_DATA", data);
        // return data;
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message || "Failed to fetch patron data");
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
  getters: {
    patronData: (state) => state.patronData,
    isLoading: (state) => state.loading,
    error: (state) => state.error,
  },
};
