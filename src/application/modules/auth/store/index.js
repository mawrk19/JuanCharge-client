import http from "@/service/axios";
import { Cache } from "@/service/cache";

export default {
  namespaced: true,
  state: () => ({
    user: (() => {
      try {
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
        // Ensure user_type is in the user object if it exists separately
        if (user && !user.user_type) {
          const user_type = localStorage.getItem("user_type");
          if (user_type) {
            user.user_type = user_type;
          }
        }
        return user;
      } catch {
        return null;
      }
    })(),
    token: localStorage.getItem("token") || null,
  }),
  getters: {
    isAdmin: (state) => {
      return state.user?.user_type === 'admin';
    },
    isLguUser: (state) => {
      return state.user?.user_type === 'lgu';
    },
    userType: (state) => {
      return state.user?.user_type || null;
    },
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        Cache.set("user", user);
      } else {
        localStorage.removeItem("user");
        Cache.remove("user");
      }
    },
    SET_TOKEN(state, token) {
      state.token = token;
      if (token) {
        localStorage.setItem("token", token);
        Cache.set("token", token);
        // Set axios default header
        http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        localStorage.removeItem("token");
        Cache.remove("token");
        delete http.defaults.headers.common['Authorization'];
      }
    },
    CLEAR_AUTH(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("user_type");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      Cache.remove("token");
      Cache.remove("user");
      Cache.remove("user_type");
      delete http.defaults.headers.common['Authorization'];
    },
    UPDATE_USER_POINTS(state, points) {
      if (state.user) {
        state.user.points_balance = points;
        // Update localStorage as well
        localStorage.setItem("user", JSON.stringify(state.user));
        Cache.set("user", state.user);
      }
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
        
        // console.log('Login response:', res.data);
        
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
          // console.error('Login response:', res.data);
          throw new Error('No token received from server');
        }
        
        // If no user object in response, create a minimal one with email
        if (!user) {
          // console.log('No user object in response, creating minimal user data');
          user = {
            email: payload.email,
            user_type: user_type
          };
        } else if (!user.user_type && user_type) {
          // Ensure user_type is always in the user object
          user.user_type = user_type;
        }
        
        // console.log('Token found:', token);
        // console.log('User found:', user);
        // console.log('User type:', user_type);
        
        // Store in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("user_type", user_type); // Add this for router guard
        
        // Also update Vuex state
        commit("SET_TOKEN", token);
        commit("SET_USER", user);
        
        // Update cache
        Cache.set("token", token);
        Cache.set("user", user);
        Cache.set("user_type", user_type);
        
        return res;
      } catch (err) {
        // console.error('Login error in store:', err);
        // console.error('Error response:', err.response?.data);
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

    async register({ commit }, payload) {
      try {
        const res = await http.post("/auth/register", {
          first_name: payload.firstName,
          last_name: payload.lastName,
          email: payload.email,
          contact_number: payload.contactNumber,
          password: payload.password,
          password_confirmation: payload.passwordConfirmation
        });
        
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
        // Optional: Call backend logout endpoint
        await http.post("/auth/logout").catch(() => {});
      } catch (err) {
        // Ignore logout errors
      } finally {
        commit("CLEAR_AUTH");
      }
    },
    
    async validateToken({ commit, state }) {
      if (!state.token) {
        return false;
      }
      
      try {
        const response = await http.get("/auth/validate");
        
        if (response.data.valid) {
          // Update user data if provided
          if (response.data.user) {
            let user = response.data.user;
            const user_type = response.data.user_type || user.user_type || localStorage.getItem("user_type");
            
            // Ensure user_type is in the user object
            if (user_type && !user.user_type) {
              user.user_type = user_type;
            }
            
            commit("SET_USER", user);
            
            // Also update localStorage
            if (user_type) {
              localStorage.setItem("user_type", user_type);
            }
          }
          return true;
        } else {
          // Token is invalid
          commit("CLEAR_AUTH");
          return false;
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        // If validation fails, clear auth
        commit("CLEAR_AUTH");
        return false;
      }
    },
    
    restoreSession({ commit }) {
      // Check localStorage for JWT token
      let token = localStorage.getItem("token");
      let user = null;
      
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          user = JSON.parse(userStr);
          // Ensure user_type is in the user object
          const user_type = localStorage.getItem("user_type");
          if (user && user_type && !user.user_type) {
            user.user_type = user_type;
          }
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
