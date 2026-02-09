import http from "@/service/axios";

export default {
    namespaced: true,
    state: {
        lgus: [],
        loading: false,
        error: null,
    },
    mutations: {
        SET_LGUS(state, lgus) {
            state.lgus = lgus;
        },
        ADD_LGU(state, lgu) {
            state.lgus.unshift(lgu);
        },
        UPDATE_LGU(state, updatedLgu) {
            const index = state.lgus.findIndex(l => l.id === updatedLgu.id);
            if (index !== -1) {
                state.lgus.splice(index, 1, updatedLgu);
            }
        },
        DELETE_LGU(state, lguId) {
            state.lgus = state.lgus.filter(l => l.id !== lguId);
        },
        SET_LOADING(state, val) {
            state.loading = val;
        },
        SET_ERROR(state, error) {
            state.error = error;
        },
    },
    actions: {
        async fetchLgus({ commit }) {
            commit("SET_LOADING", true);
            commit("SET_ERROR", null);
            try {
                const { data } = await http.get("/lgus");
                const lgusData = data.data || data;
                commit("SET_LGUS", lgusData);
                return data;
            } catch (error) {
                const errorMessage = error.response?.data?.message || "Failed to fetch LGUs";
                commit("SET_ERROR", errorMessage);
                throw error;
            } finally {
                commit("SET_LOADING", false);
            }
        },

        async createLgu({ commit }, lguData) {
            commit("SET_LOADING", true);
            commit("SET_ERROR", null);
            try {
                const { data } = await http.post("/lgus", lguData);
                const newLgu = data.data || data;
                commit("ADD_LGU", newLgu);
                return data;
            } catch (error) {
                commit("SET_ERROR", error.response?.data?.message || "Failed to create LGU");
                throw error;
            } finally {
                commit("SET_LOADING", false);
            }
        },

        async getLgu({ commit }, lguId) {
            commit("SET_LOADING", true);
            commit("SET_ERROR", null);
            try {
                const { data } = await http.get(`/lgus/${lguId}`);
                return data;
            } catch (error) {
                commit("SET_ERROR", error.response?.data?.message || "Failed to fetch LGU");
                throw error;
            } finally {
                commit("SET_LOADING", false);
            }
        },

        async updateLgu({ commit }, { id, data: lguData }) {
            commit("SET_LOADING", true);
            commit("SET_ERROR", null);
            try {
                const { data } = await http.put(`/lgus/${id}`, lguData);
                const updatedLgu = data.data || data;
                commit("UPDATE_LGU", updatedLgu);
                return data;
            } catch (error) {
                commit("SET_ERROR", error.response?.data?.message || "Failed to update LGU");
                throw error;
            } finally {
                commit("SET_LOADING", false);
            }
        },

        async deleteLgu({ commit }, lguId) {
            commit("SET_LOADING", true);
            commit("SET_ERROR", null);
            try {
                const { data } = await http.delete(`/lgus/${lguId}`);
                commit("DELETE_LGU", lguId);
                return data;
            } catch (error) {
                commit("SET_ERROR", error.response?.data?.message || "Failed to delete LGU");
                throw error;
            } finally {
                commit("SET_LOADING", false);
            }
        },
    },
    getters: {
        lgus: (state) => state.lgus,
        isLoading: (state) => state.loading,
        error: (state) => state.error,
    },
};
