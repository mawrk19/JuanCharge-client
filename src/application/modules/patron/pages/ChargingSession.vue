<template>
  <q-page class="charging-session-page">
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="energy-particle" v-for="i in 20" :key="i" :style="getParticleStyle(i)"></div>
    </div>

    <div class="session-container">
      <!-- Main Charging Display -->
      <div class="charging-main-card">
        <div class="card-content">
          <!-- Left Section: Timer & Progress -->
          <div class="left-section">
            <!-- Status Badge -->
            <div class="status-badge">
              <q-icon name="bolt" size="18px" class="pulse-icon" />
              <span>CHARGING ACTIVE</span>
            </div>

            <!-- Large Timer Display -->
            <div class="timer-section">
              <div class="timer-label">Remaining Time</div>
              <div class="timer-display">
                {{ formattedTime }}
              </div>
            </div>

            <!-- Circular Progress -->
            <div class="circular-progress-container">
              <svg class="circular-progress" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#4caf50;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#fbbf24;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
                  </linearGradient>
                </defs>
                <circle
                  class="progress-bg"
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  stroke-width="8"
                />
                <circle
                  class="progress-bar"
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  stroke-width="8"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="progressOffset"
                />
              </svg>
              <div class="progress-icon">
                <q-icon name="bolt" size="40px" color="amber" class="rotating-bolt" />
              </div>
              <div class="progress-text">{{ Math.round(progress * 100) }}%</div>
            </div>
          </div>

          <!-- Right Section: Details & Actions -->
          <div class="right-section">
            <!-- Session Details Grid -->
            <div class="session-details">
              <div class="detail-card">
                <q-icon name="stars" size="28px" color="green" class="detail-icon" />
                <div class="detail-label">Points Used</div>
                <div class="detail-value">{{ sessionData.pointsRedeemed }}</div>
              </div>
              
              <div class="detail-card">
                <q-icon name="battery_charging_full" size="28px" color="amber" class="detail-icon" />
                <div class="detail-label">Energy</div>
                <div class="detail-value">{{ sessionData.energyWh }} Wh</div>
              </div>
              
              <div class="detail-card">
                <q-icon name="schedule" size="28px" color="blue" class="detail-icon" />
                <div class="detail-label">Started</div>
                <div class="detail-value">{{ sessionStartTime }}</div>
              </div>
            </div>

            <!-- Info Footer -->
            <div class="info-footer">
              <q-icon name="info_outline" size="16px" class="q-mr-xs" />
              <span>You can leave this page. Session will continue in the background.</span>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <q-btn
                unelevated
                size="md"
                icon="home"
                label="Dashboard"
                color="green"
                text-color="white"
                class="action-btn dashboard-btn"
                @click="goToDashboard"
              />
              <q-btn
                unelevated
                size="md"
                icon="cancel"
                label="End Session"
                color="red-9"
                text-color="white"
                class="action-btn cancel-btn"
                @click="showCancelDialog = true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel Confirmation Dialog -->
    <q-dialog v-model="showCancelDialog" persistent>
      <q-card class="cancel-dialog">
        <q-card-section class="dialog-header">
          <q-icon name="warning" size="48px" color="warning" />
          <div class="text-h6 q-mt-md">End Charging Session?</div>
        </q-card-section>

        <q-card-section class="dialog-content">
          <p class="text-body1 text-center text-grey-4 q-mb-md">
            Are you sure you want to end this charging session early?
          </p>
          <div class="warning-box">
            <q-icon name="info" size="20px" color="amber" />
            <span>Remaining time ({{ formattedTime }}) will be forfeited and cannot be recovered.</span>
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-pa-md q-gutter-sm">
          <q-btn
            unelevated
            label="Keep Charging"
            color="green"
            size="md"
            padding="sm xl"
            v-close-popup
          />
          <q-btn
            outline
            label="End Session"
            color="negative"
            size="md"
            padding="sm xl"
            @click="cancelChargingSession"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: "ChargingSession",
  
  data() {
    return {
      showCancelDialog: false,
      currentTime: Date.now(),
      intervalId: null,
      syncIntervalId: null
    };
  },

  computed: {
    sessionData() {
      return this.$store.getters['patron/activeSession'] || {
        pointsRedeemed: 0,
        energyWh: 0,
        startTime: Date.now(),
        endTime: Date.now()
      };
    },

    remainingSeconds() {
      const remaining = Math.max(0, this.sessionData.endTime - this.currentTime);
      return Math.floor(remaining / 1000);
    },

    formattedTime() {
      const totalSeconds = this.remainingSeconds;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      }
      return `${minutes}:${String(seconds).padStart(2, '0')}`;
    },

    sessionStartTime() {
      return new Date(this.sessionData.startTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    progress() {
      const total = this.sessionData.endTime - this.sessionData.startTime;
      const elapsed = this.currentTime - this.sessionData.startTime;
      return Math.max(0, Math.min(1, elapsed / total));
    },

    circumference() {
      return 2 * Math.PI * 85; // r=85
    },

    progressOffset() {
      return this.circumference * (1 - this.progress);
    }
  },

  mounted() {
    // Check if there's an active session
    if (!this.$store.getters['patron/hasActiveSession']) {
      this.$router.push('/patron');
      return;
    }

    // Update current time every second
    this.intervalId = setInterval(() => {
      this.currentTime = Date.now();

      // Check if session has ended
      if (this.remainingSeconds <= 0) {
        this.endSession();
      }
    }, 1000);

    // Sync with backend every 60 seconds
    this.syncIntervalId = setInterval(async () => {
      try {
        const session = await this.$store.dispatch('patron/getActiveSession');
        if (!session) {
          // Session was cancelled or expired on backend
          this.endSession();
        }
      } catch (error) {
        console.error('Failed to sync session:', error);
      }
    }, 60000); // 60 seconds
  },

  beforeDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.syncIntervalId) {
      clearInterval(this.syncIntervalId);
    }
  },

  methods: {
    getParticleStyle(index) {
      const delay = index * 0.2;
      const duration = 3 + Math.random() * 2;
      const size = 2 + Math.random() * 4;
      const left = Math.random() * 100;
      
      return {
        left: `${left}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        width: `${size}px`,
        height: `${size}px`,
      };
    },

    goToDashboard() {
      this.$router.push('/patron');
    },

    async cancelChargingSession() {
      try {
        this.$q.loading.show({ message: 'Canceling session...' });
        
        // Call backend API to cancel charging session
        const result = await this.$store.dispatch('patron/cancelSession');
        
        this.$q.loading.hide();
        
        this.$q.notify({
          type: 'warning',
          message: 'Charging session canceled',
          caption: `Forfeited: ${result.time_forfeited_minutes} mins (${result.energy_forfeited_wh} Wh)`,
          icon: 'cancel',
          timeout: 3000
        });

        this.showCancelDialog = false;
        this.$router.push('/patron');
      } catch (error) {
        this.$q.loading.hide();
        
        const errorMessage = error.message || 'Failed to cancel session';
        
        this.$q.notify({
          type: 'negative',
          message: errorMessage,
          icon: 'error'
        });
      }
    },

    endSession() {
      this.$q.notify({
        type: 'positive',
        message: 'Charging session completed!',
        icon: 'check_circle'
      });

      // Clear the session from store
      this.$store.commit('patron/CLEAR_SESSION');
      
      // Redirect to dashboard
      setTimeout(() => {
        this.$router.push('/patron');
      }, 2000);
    }
  }
};
</script>

<style scoped>
.charging-session-page {
  background: linear-gradient(135deg, #0a0f0d 0%, #1a2c28 50%, #0f1c1a 100%);
  min-height: 100vh;
  max-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

/* Animated Background */
.animated-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
}

.energy-particle {
  position: absolute;
  bottom: -10px;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.6), rgba(76, 175, 80, 0.4));
  border-radius: 50%;
  animation: float-up infinite ease-in;
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
}

@keyframes float-up {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-100vh) scale(0.5);
    opacity: 0;
  }
}

/* Main Container */
.session-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  height: 100%;
  display: flex;
  align-items: center;
}

.charging-main-card {
  background: rgba(20, 34, 33, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(76, 175, 80, 0.3);
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-height: calc(100vh - 3rem);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(76, 175, 80, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: card-appear 0.5s ease-out;
}

.card-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  height: 100%;
}

@keyframes card-appear {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Left Section */
.left-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(76, 175, 80, 0.2);
  border: 1px solid rgba(76, 175, 80, 0.5);
  border-radius: 50px;
  padding: 6px 16px;
  margin-bottom: 1.5rem;
  color: #4caf50;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.pulse-icon {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { 
    opacity: 1;
    transform: scale(1);
  }
  50% { 
    opacity: 0.6;
    transform: scale(1.1);
  }
}

/* Timer Section */
.timer-section {
  text-align: center;
  margin-bottom: 1.5rem;
}

.timer-label {
  font-size: 0.8rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.timer-display {
  font-size: 4rem;
  font-weight: 700;
  color: #fbbf24;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.05em;
  text-shadow: 
    0 0 30px rgba(251, 191, 36, 0.5),
    0 0 60px rgba(251, 191, 36, 0.3);
  line-height: 1;
  animation: timer-glow 2s ease-in-out infinite;
}

@keyframes timer-glow {
  0%, 100% {
    text-shadow: 
      0 0 30px rgba(251, 191, 36, 0.5),
      0 0 60px rgba(251, 191, 36, 0.3);
  }
  50% {
    text-shadow: 
      0 0 40px rgba(251, 191, 36, 0.7),
      0 0 80px rgba(251, 191, 36, 0.4);
  }
}

/* Circular Progress */
.circular-progress-container {
  position: relative;
  width: 180px;
  height: 180px;
}

.circular-progress {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-bg {
  stroke: rgba(255, 255, 255, 0.1);
}

.progress-bar {
  stroke: url(#gradient);
  stroke-linecap: round;
  transition: stroke-dashoffset 1s linear;
  filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.6));
}

.progress-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.rotating-bolt {
  animation: rotate 4s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.progress-text {
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.25rem;
  font-weight: 700;
  color: #fbbf24;
}

/* Right Section */
.right-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
  justify-content: center;
}

/* Session Details Grid */
.session-details {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.detail-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.detail-card:hover {
  background: rgba(0, 0, 0, 0.4);
  border-color: rgba(76, 175, 80, 0.3);
  transform: translateX(4px);
}

.detail-icon {
  flex-shrink: 0;
}

.detail-label {
  font-size: 0.7rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.detail-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
}

/* Info Footer */
.info-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  color: #93c5fd;
  font-size: 0.8rem;
}

/* Action Buttons */
.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.action-btn {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  border-radius: 8px;
  padding: 12px 20px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.dashboard-btn:hover {
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.5);
}

.cancel-btn {
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
}

.cancel-btn:hover {
  box-shadow: 0 6px 20px rgba(220, 38, 38, 0.5);
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

/* Cancel Dialog */
.cancel-dialog {
  background: rgba(30, 30, 30, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 16px;
  min-width: 400px;
  max-width: 500px;
}

.dialog-header {
  text-align: center;
  padding: 2rem 2rem 1rem;
}

.dialog-content {
  padding: 1rem 2rem;
}

.warning-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 8px;
  padding: 1rem;
  color: #fbbf24;
  font-size: 0.9rem;
}

/* Responsive - Portrait/Tablet */
@media (max-width: 1024px) or (max-height: 768px) {
  .charging-session-page {
    padding: 1rem;
  }

  .charging-main-card {
    padding: 1.5rem;
  }

  .card-content {
    gap: 2rem;
  }

  .timer-display {
    font-size: 3rem;
  }

  .circular-progress-container {
    width: 150px;
    height: 150px;
  }

  .detail-card {
    padding: 1rem;
  }
}

/* Mobile - Stack vertically */
@media (max-width: 768px) {
  .card-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .timer-display {
    font-size: 2.5rem;
  }

  .action-buttons {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .timer-display {
    font-size: 2rem;
  }

  .circular-progress-container {
    width: 120px;
    height: 120px;
  }
}
</style>
