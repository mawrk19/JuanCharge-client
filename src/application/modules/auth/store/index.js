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
        const res = await api.post("/api/auth/login", payload);

        // Handle response with or without token
        commit("SET_USER", res.data.user);
        
        if (res.data.token) {
          commit("SET_TOKEN", res.data.token);
          // Save to localStorage and Cache so session persists after refresh
          localStorage.setItem("token", res.data.token);
          Cache.set("token", res.data.token);
        } else {
          // Session-based auth, no token needed
          commit("SET_TOKEN", "session");
          localStorage.setItem("token", "session");
          Cache.set("token", "session");
        }

        localStorage.setItem("user", JSON.stringify(res.data.user));
        Cache.set("user", res.data.user);

        return res;
      } catch (err) {
        throw err;
      }
    },
    async logout({ commit }) {
      commit("CLEAR_AUTH");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      Cache.remove("token");
      Cache.remove("user");
    },
    restoreSession({ commit }) {
      let token = Cache.get("token");
      let user = Cache.get("user");
      if (!token) {
        token = localStorage.getItem("token");
        if (token) Cache.set("token", token);
      }
      if (!user) {
        user = localStorage.getItem("user");
        if (user) Cache.set("user", JSON.parse(user));
      }
      if (token && user) {
        commit("SET_TOKEN", token);
        commit("SET_USER", typeof user === "string" ? JSON.parse(user) : user);
      }
    },
  },
};
