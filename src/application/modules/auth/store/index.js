import http from "@/service/axios";
import { Cache } from "@/service/cache";

export default {
  namespaced: true,
  state: () => ({
    user: null,
    token: null,
  }),
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
    },
    CLEAR_AUTH(state) {
      state.user = null;
      state.token = null;
    },
  },
  actions: {
    async login({ commit }, payload) {
      try {
        // Convert to plain object to avoid Vue reactivity issues
        const loginData = {
          email: payload.email,
          password: payload.password
        };
        
        // Login with JWT authentication - uses /api prefix from axios baseURL
        const res = await http.post("/auth/login", loginData);
        
        // Backend returns 'access_token', not 'token'
        const token = res.data.access_token || res.data.token;
        const user = res.data.user;
        
        if (!token) {
          throw new Error('No token received from server');
        }
        
        // Store JWT token in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        
        // Also update Vuex state
        commit("SET_TOKEN", token);
        commit("SET_USER", user);
        
        // Update cache
        Cache.set("token", token);
        Cache.set("user", user);
        
        return res;
      } catch (err) {
        throw err;
      }
    },
    async logout({ commit }) {
      commit("CLEAR_AUTH");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      Cache.remove("token");
      Cache.remove("user");
    },
    restoreSession({ commit }) {
      // Check localStorage for JWT token
      let token = localStorage.getItem("token");
      let user = null;
      
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          user = JSON.parse(userStr);
        } catch (e) {
          user = null;
        }
      }

      // Restore session if we have both token and user
      if (token && user) {
        Cache.set("token", token);
        Cache.set("user", user);
        commit("SET_TOKEN", token);
        commit("SET_USER", user);
      }
    },
  },
};
