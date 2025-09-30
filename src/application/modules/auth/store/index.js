import api from "@/boot/axios";

export default {
  namespaced: true,
  state: () => ({
    user: null,
    token: null
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
    }
  },
  actions: {
    async login({ commit }, payload) {
      try {
        const res = await api.post('/api/auth/login', payload);

        // Assume backend returns { user, token }
        commit("SET_USER", res.data.user);
        commit("SET_TOKEN", res.data.token);

        // Save to localStorage so session persists after refresh
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        return res;
      } catch (err) {
        throw err;
      }
    },
    async logout({ commit }) {
      commit("CLEAR_AUTH");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    restoreSession({ commit }) {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        commit("SET_TOKEN", token);
        commit("SET_USER", JSON.parse(user));
      }
    }
  }
};
