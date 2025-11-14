import http from "@/service/axios";

export default {
  namespaced: true,
  state: {
    patronData: null,
    pointsBalance: 0,
    dashboardStats: null, // { total_points, total_charges, energy_used_kwh, co2_saved_kg, etc }
    chargingHistory: [],
    loading: false,
    error: null,
    activeSession: null, // { pointsRedeemed, energyWh, startTime, endTime, sessionId }
  },
  mutations: {
    SET_PATRON_DATA(state, data) {
      state.patronData = data;
    },
    SET_POINTS_BALANCE(state, balance) {
      state.pointsBalance = balance;
    },
    SET_DASHBOARD_STATS(state, stats) {
      state.dashboardStats = stats;
    },
    SET_CHARGING_HISTORY(state, history) {
      state.chargingHistory = history;
    },
    SET_LOADING(state, val) {
      state.loading = val;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_ACTIVE_SESSION(state, session) {
      state.activeSession = session;
      // Persist to localStorage
      if (session) {
        localStorage.setItem('activeChargingSession', JSON.stringify(session));
      } else {
        localStorage.removeItem('activeChargingSession');
      }
    },
    CLEAR_SESSION(state) {
      state.activeSession = null;
      localStorage.removeItem('activeChargingSession');
    },
    RESTORE_SESSION(state) {
      const saved = localStorage.getItem('activeChargingSession');
      if (saved) {
        try {
          const session = JSON.parse(saved);
          // Check if session is still valid (not expired)
          if (session.endTime > Date.now()) {
            state.activeSession = session;
          } else {
            localStorage.removeItem('activeChargingSession');
          }
        } catch (e) {
          localStorage.removeItem('activeChargingSession');
        }
      }
    },
  },
  actions: {
    async fetchAllPatrons({ commit }) {
  commit("SET_LOADING", true);
  try {
    const { data } = await http.get("/patrons");
    return data;
  } catch (error) {
    commit("SET_ERROR", error.response?.data?.message || "Failed to fetch patrons");
    throw error;
  } finally {
    commit("SET_LOADING", false);
  }
},

    async fetchPatronData({ commit }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        // TODO: Implement API call to fetch patron data
        // const { data } = await http.get("/patron/profile");
        // commit("SET_PATRON_DATA", data);
        // return data;
      } catch (error) {
        commit("SET_ERROR", error.response?.data?.message || "Failed to fetch patron data");
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async fetchPointsBalance({ commit }) {
      try {
        const response = await http.get('/patron/points/balance');
        console.log('Points balance response:', response.data);
        
        // Response format: { success, data: { points_balance, total_earned, total_redeemed, available_energy_wh } }
        const balance = response.data.data.points_balance;
        
        commit('SET_POINTS_BALANCE', balance);
        
        // Also update auth store
        commit('auth/UPDATE_USER_POINTS', balance, { root: true });
        
        return response.data.data;
      } catch (error) {
        console.error('Error fetching points balance:', error);
        const errorMessage = error.response?.data?.message || 'Failed to fetch points balance';
        commit('SET_ERROR', errorMessage);
        throw error;
      }
    },

    async fetchDashboardStats({ commit }) {
      try {
        const response = await http.get('/patron/dashboard/stats');
        // console.log('Dashboard stats response:', response.data);
        
        // Response format: { success, data: { total_points, total_charges, energy_used_kwh, energy_used_wh, co2_saved_kg, total_recyclables_weight_kg } }
        const stats = response.data.data;
        
        commit('SET_DASHBOARD_STATS', stats);
        
        // Also update points balance in auth store
        if (stats.total_points !== undefined) {
          commit('SET_POINTS_BALANCE', stats.total_points);
          commit('auth/UPDATE_USER_POINTS', stats.total_points, { root: true });
        }
        
        return stats;
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        const errorMessage = error.response?.data?.message || 'Failed to fetch dashboard stats';
        commit('SET_ERROR', errorMessage);
        throw error;
      }
    },

    async fetchChargingHistory({ commit }) {
      try {
        const response = await http.get('/charging/history');
        // console.log('Charging history response:', response.data);
        
        // Response format: { success, data: [...sessions], pagination: {...} }
        const sessions = response.data.data || [];
        
        commit('SET_CHARGING_HISTORY', sessions);
        
        return sessions;
      } catch (error) {
        console.error('Error fetching charging history:', error);
        const errorMessage = error.response?.data?.message || 'Failed to fetch charging history';
        commit('SET_ERROR', errorMessage);
        throw error;
      }
    },
    
    async startChargingSession({ commit }, { pointsRedeemed }) {
      try {
        // console.log('Starting charging session with points:', pointsRedeemed);
        
        // Call backend API to redeem points
        const response = await http.post('/charging/redeem', {
          points: pointsRedeemed
        });

        // console.log('Backend response:', response.data);

        const sessionData = response.data.data.session;
        
        // Convert to frontend format
        const session = {
          sessionId: sessionData.session_id,
          pointsRedeemed: sessionData.points_redeemed,
          energyWh: sessionData.energy_wh,
          startTime: new Date(sessionData.start_time).getTime(),
          endTime: new Date(sessionData.end_time).getTime(),
          durationMinutes: sessionData.duration_minutes,
          status: sessionData.status
        };

        commit('SET_ACTIVE_SESSION', session);
        
        // Update user's points balance in auth store
        const updatedBalance = response.data.data.updated_balance;
        if (updatedBalance !== undefined) {
          commit('auth/UPDATE_USER_POINTS', updatedBalance, { root: true });
        }
        
        // console.log('Session started successfully:', session);
        return session;
      } catch (error) {
        console.error('Error starting charging session:', error);
        console.error('Error response:', error.response?.data);
        
        const errorMessage = error.response?.data?.message || 'Failed to start charging session';
        throw new Error(errorMessage);
      }
    },

    async getActiveSession({ commit }) {
      try {
        const response = await http.get('/charging/active');
        // console.log('Active session response:', response.data);
        
        // Response format: { success, data: { session: {...} | null } }
        const sessionData = response.data.data.session;
        
        if (sessionData) {
          // Convert to frontend format
          const session = {
            sessionId: sessionData.session_id,
            pointsRedeemed: sessionData.points_redeemed,
            energyWh: sessionData.energy_wh,
            startTime: new Date(sessionData.start_time).getTime(),
            endTime: new Date(sessionData.end_time).getTime(),
            durationMinutes: sessionData.duration_minutes,
            status: sessionData.status
          };
          
          // Only restore if session is still active and not expired
          if (session.endTime > Date.now() && session.status === 'active') {
            commit('SET_ACTIVE_SESSION', session);
            return session;
          } else {
            // Session expired or not active, clear it
            commit('CLEAR_SESSION');
            return null;
          }
        } else {
          // No active session
          commit('CLEAR_SESSION');
          return null;
        }
      } catch (error) {
        console.error('Failed to get active session:', error);
        commit('CLEAR_SESSION');
        return null;
      }
    },

    async cancelSession({ commit, state }) {
      try {
        if (!state.activeSession) {
          throw new Error('No active session to cancel');
        }
        
        const response = await http.post('/charging/cancel', {
          session_id: state.activeSession.sessionId
        });
        
        commit('CLEAR_SESSION');
        
        return response.data.data;
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to cancel session';
        throw new Error(errorMessage);
      }
    },

    restoreSession({ commit, dispatch }) {
      // First check localStorage
      commit('RESTORE_SESSION');
      
      // Then validate with backend
      dispatch('getActiveSession');
    },
  },
  getters: {
    patronData: (state) => state.patronData,
    pointsBalance: (state) => state.pointsBalance,
    dashboardStats: (state) => state.dashboardStats,
    chargingHistory: (state) => state.chargingHistory,
    isLoading: (state) => state.loading,
    error: (state) => state.error,
    activeSession: (state) => state.activeSession,
    hasActiveSession: (state) => state.activeSession !== null,
  },
};
