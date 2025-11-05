import http from "@/service/axios";
import { Cache } from "@/service/cache";

export default {
  namespaced: true,
  state: () => ({
    user: null,
    token: null,
    userType: null,
    isFirstLogin: false,
  }),
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_USER_TYPE(state, userType) {
      state.userType = userType;
    },
    SET_FIRST_LOGIN(state, isFirstLogin) {
      state.isFirstLogin = isFirstLogin;
    },
    CLEAR_AUTH(state) {
      state.user = null;
      state.token = null;
      state.userType = null;
      state.isFirstLogin = false;
    },
  },
  getters: {
    isAdmin: (state) => state.userType === 'admin',
    isLguUser: (state) => state.userType === 'lgu_user',
    isFirstLogin: (state) => state.isFirstLogin,
  },
  actions: {
    async login({ commit }, payload) {
      try {
        const loginData = {
          email: payload.email,
          password: payload.password
        };
        
        const res = await http.post("/auth/login", loginData);
        
        console.log('Login response:', res.data);
        
        if (!res.data.success) {
          throw new Error(res.data.message || 'Login failed');
        }
        
        // Handle different response structures - check both res.data and res.data.data
        const responseData = res.data.data || res.data;
        
        // Extract token from various possible locations
        const token = res.data.token || 
                     res.data.access_token || 
                     responseData.token || 
                     responseData.access_token;
        
        // Extract user - it might be in data.user or we need to fetch it
        let user = res.data.user || responseData.user;
        const user_type = res.data.user_type || responseData.user_type;
        const is_first_login = res.data.is_first_login || responseData.is_first_login;
        
        if (!token) {
          console.error('Login response:', res.data);
          throw new Error('No token received from server');
        }
        
        // If no user object in response, create a minimal one with email
        if (!user) {
          console.log('No user object in response, creating minimal user data');
          user = {
            email: payload.email,
            user_type: user_type
          };
        } else if (!user.user_type && user_type) {
          // Ensure user_type is always in the user object
          user.user_type = user_type;
        }
        
        console.log('Token found:', token);
        console.log('User found:', user);
        console.log('User type:', user_type);
        
        // Store in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("user_type", user_type);
        if (is_first_login !== undefined) {
          localStorage.setItem("is_first_login", is_first_login.toString());
        }
        
        // Update Vuex state
        commit("SET_TOKEN", token);
        commit("SET_USER", user);
        commit("SET_USER_TYPE", user_type);
        commit("SET_FIRST_LOGIN", is_first_login || false);
        
        // Update cache
        Cache.set("token", token);
        Cache.set("user", user);
        Cache.set("user_type", user_type);
        
        return res;
      } catch (err) {
        console.error('Login error in store:', err);
        console.error('Error response:', err.response?.data);
        throw err;
      }
    },
    
    async changePassword({ commit }, payload) {
      try {
        const res = await http.post("/auth/change-password", {
          current_password: payload.currentPassword,
          new_password: payload.newPassword,
          new_password_confirmation: payload.newPasswordConfirmation
        });
        
        if (res.data.success) {
          // Clear auth state after password change
          commit("CLEAR_AUTH");
          localStorage.clear();
          Cache.remove("token");
          Cache.remove("user");
          Cache.remove("user_type");
        }
        
        return res;
      } catch (err) {
        throw err;
      }
    },

    async updateProfile({ commit, state }, payload) {
      try {
        const res = await http.put("/auth/profile", {
          first_name: payload.firstName,
          last_name: payload.lastName,
          email: payload.email,
          contact_number: payload.contactNumber
        });
        
        if (res.data.success) {
          // Update user data in store
          const updatedUser = {
            ...state.user,
            first_name: payload.firstName,
            last_name: payload.lastName,
            email: payload.email,
            contact_number: payload.contactNumber
          };
          
          commit("SET_USER", updatedUser);
          
          // Update localStorage
          localStorage.setItem("user", JSON.stringify(updatedUser));
          
          // Update cache
          Cache.set("user", updatedUser);
        }
        
        return res;
      } catch (err) {
        throw err;
      }
    },
    
    async logout({ commit }) {
      try {
        await http.post("/auth/logout");
      } catch (err) {
        // Continue with logout even if API call fails
        console.error('Logout error:', err);
      } finally {
        commit("CLEAR_AUTH");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("user_type");
        localStorage.removeItem("is_first_login");
        sessionStorage.clear();
        Cache.remove("token");
        Cache.remove("user");
        Cache.remove("user_type");
      }
    },
    
    restoreSession({ commit }) {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      const userType = localStorage.getItem("user_type");
      const isFirstLogin = localStorage.getItem("is_first_login") === 'true';
      
      let user = null;
      if (userStr) {
        try {
          user = JSON.parse(userStr);
        } catch (e) {
          user = null;
        }
      }

      if (token && user) {
        Cache.set("token", token);
        Cache.set("user", user);
        Cache.set("user_type", userType);
        commit("SET_TOKEN", token);
        commit("SET_USER", user);
        commit("SET_USER_TYPE", userType);
        commit("SET_FIRST_LOGIN", isFirstLogin);
      }
    },
  },
};
