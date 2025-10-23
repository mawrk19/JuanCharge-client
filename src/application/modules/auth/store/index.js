import api from "@/boot/axios";
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
        // First, get CSRF cookie from Laravel Sanctum
        await api.get("/sanctum/csrf-cookie");
        
        // Now make the login request with CSRF protection
        const res = await api.post("/api/auth/login", payload);
        commit("SET_USER", res.data.user);
        
        if (res.data.token && res.data.token !== 'session') {
          commit("SET_TOKEN", res.data.token);
          sessionStorage.setItem("token", res.data.token);
          sessionStorage.setItem("user", JSON.stringify(res.data.user));
          Cache.set("token", res.data.token);
        } else {
          commit("SET_TOKEN", "session");
          sessionStorage.setItem("token", "session");
          sessionStorage.setItem("user", JSON.stringify(res.data.user));
          Cache.set("token", "session");
        }

        Cache.set("user", res.data.user);

        return res;
      } catch (err) {
        console.error('Login error details:', err.response?.data);
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
      // Only check sessionStorage for session-based auth
      let token = Cache.get("token") || sessionStorage.getItem("token");
      let user = Cache.get("user");
      
      if (!user) {
        const userStr = sessionStorage.getItem("user");
        if (userStr) {
          try {
            user = JSON.parse(userStr);
          } catch (e) {
            user = null;
          }
        }
      }

      // Only restore if we have both token and user in sessionStorage
      if (token && user) {
        Cache.set("token", token);
        Cache.set("user", user);
        commit("SET_TOKEN", token);
        commit("SET_USER", typeof user === 'string' ? JSON.parse(user) : user);
      }
    },
  },
};
