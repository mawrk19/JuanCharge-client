import http from "@/service/axios";

export default {
  namespaced: true,
  state: {
    users: [],
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: 0,
      to: 0
    },
    loading: false,
    error: null,
  },
  mutations: {
    SET_USERS(state, users) {
      state.users = users;
    },
    SET_PAGINATION(state, pagination) {
      state.pagination = pagination;
    },
    ADD_USER(state, user) {
      state.users.unshift(user);
    },
    UPDATE_USER(state, updatedUser) {
      const index = state.users.findIndex(u => u.id === updatedUser.id);
      if (index !== -1) {
        state.users.splice(index, 1, updatedUser);
      }
    },
    DELETE_USER(state, userId) {
      state.users = state.users.filter(u => u.id !== userId);
    },
    SET_LOADING(state, val) {
      state.loading = val;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    // Fetch all kiosk users with pagination
    async fetchUsers({ commit }, { page = 1, per_page = 10 } = {}) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const { data } = await http.get("/kiosk-users", {
          params: { page, per_page }
        });
        
        commit("SET_USERS", data.data || []);
        
        if (data.pagination) {
          commit("SET_PAGINATION", data.pagination);
        }
        
        return data;
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message || "Failed to fetch kiosk users");
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    // Create new Kiosk user
    async createUser({ commit }, userData) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const { data } = await http.post("/kiosks-users", userData);
        
        // Transform data to match table format
        const newUser = {
          name: data.data.first_name && data.data.last_name 
            ? `${data.data.first_name} ${data.data.last_name}` 
            : data.data.name,
          first_name: data.data.first_name,
          last_name: data.data.last_name,
          email: data.data.email,
          contact_number: data.data.contact_number,
          points_balance: data.data.points_balance || 0
        };
        
        commit("ADD_USER", newUser);
        return data;
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message || "Failed to create kiosk user");
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    // Get single Kiosk user
    async getUser({ commit }, userId) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const { data } = await http.get(`/kiosks-users/${userId}`);
        return data;
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message || "Failed to fetch kiosk user");
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    // Update Kiosk user
    async updateUser({ commit }, { id, userData }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const { data } = await http.put(`/kiosks-users/${id}`, userData);
        
        // Transform data to match table format
        const updatedUser = {
          id: data.data.id,
          name: data.data.first_name && data.data.last_name 
            ? `${data.data.first_name} ${data.data.last_name}` 
            : data.data.name,
          first_name: data.data.first_name,
          last_name: data.data.last_name,
          email: data.data.email,
          contact_number: data.data.contact_number,
          points_balance: data.data.points_balance || 0
        };
        
        commit("UPDATE_USER", updatedUser);
        return data;
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message || "Failed to update kiosk user");
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    // Delete Kiosk user
    async deleteUser({ commit }, userId) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const { data } = await http.delete(`/kiosks-users/${userId}`);
        commit("DELETE_USER", userId);
        return data;
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message || "Failed to delete kiosk user");
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    // Disable Kiosk user
    async disableUser({ commit }, userId) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const { data } = await http.patch(`/kiosks-users/${userId}/disable`);
        // Optionally refresh the user or update local state
        return data;
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message || "Failed to disable kiosk user");
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
  getters: {
    users: (state) => state.users,
    isLoading: (state) => state.loading,
    error: (state) => state.error,
  },
};