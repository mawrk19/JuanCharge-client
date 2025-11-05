import http from "@/service/axios";

export default {
  namespaced: true,
  state: {
    kiosks: [],
    loading: false,
    error: null,
  },
  mutations: {
    SET_KIOSKS(state, kiosks) {
      state.kiosks = kiosks;
    },
    ADD_KIOSK(state, kiosk) {
      state.kiosks.unshift(kiosk);
    },
    UPDATE_KIOSK(state, updatedKiosk) {
      const index = state.kiosks.findIndex(k => k.id === updatedKiosk.id);
      if (index !== -1) {
        state.kiosks.splice(index, 1, updatedKiosk);
      }
    },
    DELETE_KIOSK(state, kioskId) {
      state.kiosks = state.kiosks.filter(k => k.id !== kioskId);
    },
    SET_LOADING(state, val) {
      state.loading = val;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    async fetchKiosks({ commit }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const { data } = await http.get("/kiosks");
        const kiosksData = data.data || data;
        commit("SET_KIOSKS", kiosksData);
        return data;
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to fetch kiosks";
        commit("SET_ERROR", errorMessage);
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async createKiosk({ commit }, kioskData) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const { data } = await http.post("/kiosks", kioskData);
        const newKiosk = data.data || data;
        commit("ADD_KIOSK", newKiosk);
        return data;
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message || "Failed to create kiosk");
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },
    
    async getKiosk({ commit }, kioskId) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const { data } = await http.get(`/kiosks/${kioskId}`);
        return data;
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message || "Failed to fetch kiosk");
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async updateKiosk({ commit }, { id, data: kioskData }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const { data } = await http.put(`/kiosks/${id}`, kioskData);
        const updatedKiosk = data.data || data;
        commit("UPDATE_KIOSK", updatedKiosk);
        return data;
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message || "Failed to update kiosk");
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async deleteKiosk({ commit }, kioskId) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const { data } = await http.delete(`/kiosks/${kioskId}`);
        commit("DELETE_KIOSK", kioskId);
        return data;
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message || "Failed to delete kiosk");
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
  getters: {
    kiosks: (state) => state.kiosks,
    kioskIsLoading: (state) => state.loading,
    kioskError: (state) => state.error,
  },
};