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
        commit("SET_KIOSKS", data.data || data);
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
        if (data.kiosk) {
          commit("ADD_KIOSK", data.kiosk);
          return {
            success: true,
            message: data.message,
            kiosk: data.kiosk
          };
        }
        throw new Error("Invalid response format");
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to create kiosk";
        commit("SET_ERROR", errorMessage);
        return {
          success: false,
          message: errorMessage
        };
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async updateKiosk({ commit }, { id, data }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const response = await http.put(`/kiosks/${id}`, data);
        if (response.data.kiosk) {
          commit("UPDATE_KIOSK", response.data.kiosk);
          return {
            success: true,
            message: response.data.message,
            kiosk: response.data.kiosk
          };
        }
        throw new Error("Invalid response format");
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to update kiosk";
        commit("SET_ERROR", errorMessage);
        return {
          success: false,
          message: errorMessage
        };
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
        return {
          success: true,
          message: data.message
        };
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to delete kiosk";
        commit("SET_ERROR", errorMessage);
        return {
          success: false,
          message: errorMessage
        };
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
