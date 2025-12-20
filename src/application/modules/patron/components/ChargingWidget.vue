<template>
  <transition name="slide-up">
    <div v-if="showWidget" class="charging-widget">
      <div class="widget-content" @click="goToChargingPage">
        <div class="widget-icon">
          <q-icon name="bolt" size="20px" color="amber" class="pulse-icon" />
        </div>
        <div class="widget-info">
          <div class="text-caption text-weight-bold text-white">Charging Active</div>
          <div class="text-caption text-amber">{{ formattedTime }}</div>
        </div>
        <q-btn
          flat
          dense
          round
          size="sm"
          icon="close"
          color="grey-5"
          @click.stop="showCancelDialog = true"
          class="widget-cancel-btn"
        />
      </div>

      <!-- Cancel Dialog -->
      <q-dialog v-model="showCancelDialog">
        <q-card class="cancel-dialog">
          <q-card-section class="dialog-header">
            <div class="row items-center no-wrap">
              <q-icon name="warning" size="32px" color="orange" class="q-mr-sm" />
              <div class="text-h6 text-white">End Charging Session?</div>
              <q-space />
              <q-btn icon="close" flat round dense size="sm" color="grey-5" v-close-popup />
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-body2 text-grey-4">
              Are you sure you want to cancel your charging session? Remaining time will be forfeited.
            </div>
          </q-card-section>

          <q-card-actions align="center" class="q-px-md q-pb-md q-gutter-sm">
            <q-btn 
              unelevated
              label="Keep Charging" 
              color="green" 
              text-color="white"
              padding="8px 24px"
              class="dialog-btn"
              v-close-popup 
            />
            <q-btn 
              unelevated
              label="End Session" 
              color="red-9" 
              text-color="white"
              padding="8px 24px"
              class="dialog-btn cancel-action"
              @click="cancelSession" 
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </transition>
</template>

<script>
export default {
  name: "ChargingWidget",
  
  data() {
    return {
      currentTime: Date.now(),
      intervalId: null,
      showCancelDialog: false
    };
  },

  computed: {
    hasActiveSession() {
      return this.$store.getters['patron/hasActiveSession'];
    },

    isOnChargingPage() {
      return this.$route.name === 'patron-charging';
    },

    showWidget() {
      return this.hasActiveSession && !this.isOnChargingPage;
    },

    sessionData() {
      return this.$store.getters['patron/activeSession'] || {};
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
    }
  },

  watch: {
    showWidget: {
      immediate: true,
      handler(shouldShow) {
        if (shouldShow && !this.intervalId) {
          this.startTimer();
        } else if (!shouldShow && this.intervalId) {
          this.stopTimer();
        }
      }
    }
  },

  beforeDestroy() {
    this.stopTimer();
  },

  methods: {
    startTimer() {
      this.intervalId = setInterval(() => {
        this.currentTime = Date.now();

        // Check if session has ended
        if (this.remainingSeconds <= 0) {
          this.$store.commit('patron/CLEAR_SESSION');
          this.$q.notify({
            type: 'positive',
            message: 'Charging session completed!',
            icon: 'check_circle'
          });
        }
      }, 1000);
    },

    stopTimer() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },

    goToChargingPage() {
      this.$router.push('/patron/charging');
    },

    async cancelSession() {
      try {
        this.$q.loading.show({ message: 'Canceling session...' });
        
        // Call backend API to cancel charging session
        const result = await this.$store.dispatch('patron/cancelSession');
        
        this.$q.loading.hide();
        
        this.$q.notify({
          type: 'warning',
          message: 'Charging session canceled',
          caption: `Forfeited: ${result.time_forfeited_minutes} mins`,
          icon: 'cancel'
        });

        this.showCancelDialog = false;
      } catch (error) {
        this.$q.loading.hide();
        
        const errorMessage = error.message || 'Failed to cancel session';
        
        this.$q.notify({
          type: 'negative',
          message: errorMessage,
          icon: 'error'
        });
      }
    }
  }
};
</script>

<style scoped>
.charging-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  animation: widget-appear 0.3s ease-out;
}

.widget-content {
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(251, 191, 36, 0.5);
  border-radius: 50px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(251, 191, 36, 0.3);
  transition: all 0.3s ease;
}

.widget-content:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(251, 191, 36, 0.4);
  border-color: rgba(251, 191, 36, 0.7);
}

.widget-icon {
  width: 32px;
  height: 32px;
  background: rgba(251, 191, 36, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pulse-icon {
  animation: icon-pulse 2s ease-in-out infinite;
}

.widget-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 100px;
}

.widget-cancel-btn {
  margin-left: 8px;
}

.cancel-dialog {
  background: linear-gradient(135deg, rgba(20, 34, 33, 0.98) 0%, rgba(10, 15, 13, 0.98) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 16px;
  min-width: 380px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.dialog-header {
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.dialog-btn {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 8px;
  transition: all 0.3s ease;
  min-width: 140px;
}

.dialog-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.cancel-action {
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
}

.cancel-action:hover {
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.5);
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

/* Transitions */
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter, .slide-up-leave-to {
  transform: translateY(100px);
  opacity: 0;
}

@keyframes widget-appear {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes icon-pulse {
  0%, 100% { 
    opacity: 1;
  }
  50% { 
    opacity: 0.6;
  }
}

/* Mobile responsiveness */
@media (max-width: 600px) {
  .charging-widget {
    bottom: 10px;
    right: 10px;
  }

  .widget-content {
    padding: 10px 12px;
    gap: 8px;
  }

  .widget-info {
    min-width: 80px;
  }
}
</style>
