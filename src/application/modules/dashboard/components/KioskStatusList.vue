<template>
  <q-card class="kiosk-status-card">
    <q-card-section>
      <div class="text-h6 q-mb-md">
        <q-icon name="podcasts" size="24px" color="green" class="q-mr-sm" />
        Kiosk Network Status
      </div>
      
      <div v-if="loading" class="text-center q-pa-md">
        <q-spinner color="green" size="40px" />
      </div>
      
      <div v-else-if="kiosks.length === 0" class="text-center q-pa-md text-grey-5">
        No kiosks found
      </div>
      
      <div v-else class="kiosk-list">
        <div
          v-for="kiosk in kiosks"
          :key="kiosk.id"
          class="kiosk-item"
          @click="viewKiosk(kiosk)"
        >
          <div class="kiosk-status-indicator" :class="getStatusClass(kiosk)">
            <q-icon :name="getStatusIcon(kiosk)" size="20px" />
          </div>
          
          <div class="kiosk-info">
            <div class="kiosk-name">{{ kiosk.name || `Kiosk #${kiosk.id}` }}</div>
            <div class="kiosk-location text-grey-6">
              <q-icon name="place" size="14px" />
              {{ kiosk.location || 'No location set' }}
            </div>
          </div>
          
          <div class="kiosk-meta">
            <q-badge
              :color="getStatusColor(kiosk)"
              :label="getStatusLabel(kiosk)"
              class="status-badge"
            />
            <div v-if="kiosk.last_sync" class="last-sync text-grey-6">
              <q-icon name="sync" size="12px" />
              {{ formatLastSync(kiosk.last_sync) }}
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "KioskStatusList",
  computed: {
    kiosks() {
      return this.$store.state.kiosks.kiosks || [];
    },
    loading() {
      return this.$store.state.kiosks.loading;
    }
  },
  methods: {
    getStatusClass(kiosk) {
      const status = kiosk.status || (kiosk.is_online ? 'online' : 'offline');
      return `status-${status.toLowerCase()}`;
    },
    getStatusIcon(kiosk) {
      const status = kiosk.status || (kiosk.is_online ? 'online' : 'offline');
      switch (status.toLowerCase()) {
        case 'active':
        case 'online':
          return 'check_circle';
        case 'offline':
        case 'inactive':
          return 'cancel';
        case 'maintenance':
          return 'build';
        default:
          return 'help';
      }
    },
    getStatusColor(kiosk) {
      const status = kiosk.status || (kiosk.is_online ? 'online' : 'offline');
      switch (status.toLowerCase()) {
        case 'active':
        case 'online':
          return 'green';
        case 'offline':
        case 'inactive':
          return 'red';
        case 'maintenance':
          return 'orange';
        default:
          return 'grey';
      }
    },
    getStatusLabel(kiosk) {
      const status = kiosk.status || (kiosk.is_online ? 'Online' : 'Offline');
      return status.charAt(0).toUpperCase() + status.slice(1);
    },
    formatLastSync(timestamp) {
      if (!timestamp) return 'Never';
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    },
    viewKiosk(kiosk) {
      this.$router.push(`/main/kiosks`);
    }
  },
  async mounted() {
    // Fetch kiosks if not already loaded
    if (this.kiosks.length === 0) {
      try {
        await this.$store.dispatch('kiosks/fetchKiosks');
      } catch (error) {
        console.error('Failed to fetch kiosks:', error);
      }
    }
  }
};
</script>

<style scoped>
.kiosk-status-card {
  background: rgba(20, 34, 33, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  height: 100%;
}

.kiosk-status-card:hover {
  border-color: rgba(76, 175, 80, 0.4);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(76, 175, 80, 0.1);
}

.kiosk-status-card >>> .text-h6 {
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.kiosk-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 4px;
}

.kiosk-list::-webkit-scrollbar {
  width: 6px;
}

.kiosk-list::-webkit-scrollbar-track {
  background: rgba(76, 175, 80, 0.1);
  border-radius: 3px;
}

.kiosk-list::-webkit-scrollbar-thumb {
  background: rgba(76, 175, 80, 0.3);
  border-radius: 3px;
}

.kiosk-list::-webkit-scrollbar-thumb:hover {
  background: rgba(76, 175, 80, 0.5);
}

.kiosk-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(76, 175, 80, 0.05);
  border: 1px solid rgba(76, 175, 80, 0.15);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.kiosk-item:hover {
  background: rgba(76, 175, 80, 0.1);
  border-color: rgba(76, 175, 80, 0.3);
  transform: translateX(4px);
}

.kiosk-status-indicator {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.status-online,
.status-active {
  background: rgba(76, 175, 80, 0.2);
  color: #66bb6a;
}

.status-offline,
.status-inactive {
  background: rgba(244, 67, 54, 0.2);
  color: #ef5350;
}

.status-maintenance {
  background: rgba(255, 152, 0, 0.2);
  color: #ffa726;
}

.kiosk-info {
  flex: 1;
  min-width: 0;
}

.kiosk-name {
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kiosk-location {
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
}

.kiosk-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.status-badge {
  font-size: 0.7rem;
  padding: 2px 8px;
}

.last-sync {
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  gap: 2px;
}
</style>
