import http from "@/service/axios";

export default {
  namespaced: true,
  state: {
    users: [],
    loading: false,
    error: null,
  },
  mutations: {
    SET_USERS(state, users) {
      state.users = users;
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
    // Fetch all LGU users
    async fetchUsers({ commit }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const { data } = await http.get("/lgu-users");
        commit("SET_USERS", data.data || data);
        return data;
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message || "Failed to fetch users");
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    // Create new LGU user
    async createUser({ commit }, userData) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const { data } = await http.post("/lgu-users", userData);
        
        // Transform data to match table format
        const newUser = {
          id: data.data.id,
          name: data.data.name,
          email: data.data.email,
          birth_date: data.data.birth_date,
          phone: data.data.phone_number,
          roles: [data.data.role]
        };
        
        commit("ADD_USER", newUser);
        return data;
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message || "Failed to create user");
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    // Get single LGU user
    async getUser({ commit }, userId) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const { data } = await http.get(`/lgu-users/${userId}`);
        return data;
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message || "Failed to fetch user");
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    // Update LGU user
    async updateUser({ commit }, { id, data: userData }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const { data } = await http.put(`/lgu-users/${id}`, userData);
        
        // Transform data to match table format
        const updatedUser = {
          id: data.data.id,
          name: data.data.name,
          email: data.data.email,
          birth_date: data.data.birth_date,
          phone: data.data.phone_number,
          roles: [data.data.role]
        };
        
        commit("UPDATE_USER", updatedUser);
        return data;
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message || "Failed to update user");
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    // Delete LGU user
    async deleteUser({ commit }, userId) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const { data } = await http.delete(`/lgu-users/${userId}`);
        commit("DELETE_USER", userId);
        return data;
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message || "Failed to delete user");
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