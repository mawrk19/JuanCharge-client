<template>
  <q-page class="dashboard-bg q-pa-lg">
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <!-- Welcome Header -->
    <div class="welcome-header q-mb-lg">
      <div class="row items-center justify-between">
        <div>
          <div class="text-h4 text-white text-weight-bold q-mb-xs">
            Welcome {{ userName }}!
          </div>
          <div class="text-subtitle1 text-grey-5">
            JuanCharge LGU Dashboard
          </div>
        </div>
        <div>
          <q-btn
            unelevated
            color="green"
            icon="add"
            label="Add Station"
            class="modern-btn"
            @click="$router.push('../main/kiosks')"
          />
        </div>
      </div>
    </div>

    <div class="q-mb-lg">
      <div class="section-header q-mb-md">
        <q-icon name="analytics" size="28px" color="green" class="q-mr-sm" />
        <span class="text-h5 text-white text-weight-bold">Key Metrics</span>
      </div>
      <div class="row q-col-gutter-md q-row-gutter-md">
        <div class="col-12 col-sm-6 col-md-3 q-mb-md">
          <DashboardCard
            title="Collected"
            subtitle="Total Recyclable"
            :value="garbageCollected"
            icon="recycling"
            iconColor="white"
            format="weight"
            change="+1 from last month"
            changeType="positive"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3 q-mb-md">
          <DashboardCard
            title="Energy Dispensed"
            subtitle="Total kWh"
            :value="energyDispensed"
            icon="charging_station"
            iconColor="white"
            format="kwh"
            change="+8.5% from last month"
            changeType="positive"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3 q-mb-md">
          <DashboardCard
            title="Online"
            subtitle="JuanCharge Kiosk"
            :value="onlineKiosks"
            icon="podcasts"
            iconColor="white"
            change="Uptime: 120 hrs"
            changeType="positive"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3 q-mb-md">
          <DashboardCard
            title="CO2 Saved"
            subtitle="Environmental Impact"
            :value="co2Saved"
            icon="eco"
            iconColor="white"
            format="weight"
            change="Equivalent to 12 trees"
            changeType="positive"
          />
        </div>
      </div>
    </div>

    <!-- Recent Activity & Quick Actions -->
    <div class="q-mb-lg">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-8">
          <RecentActivityFeed />
        </div>
        <div class="col-12 col-md-4">
          <QuickActions />
        </div>
      </div>
    </div>

    <!-- Kiosk Network Status -->
    <div>
      <KioskStatusList />
    </div>
  </q-page>
</template>

<script>
import DashboardCard from "./components/DashboardCard.vue";
import QuickActions from "./components/QuickActions.vue";
import RecentActivityFeed from "./components/RecentActivityFeed.vue";
import KioskStatusList from "./components/KioskStatusList.vue";

export default {
  name: "Dashboard",
  components: {
    DashboardCard,
    QuickActions,
    RecentActivityFeed,
    KioskStatusList
  },
  data() {
    return {};
  },
  computed: {
    userName() {
      const user = this.$store.state.auth.user;
      if (!user) return '';
      return user.name || user.first_name || 'User';
    },
    
    // Dashboard Stats from Analytics Store
    dashboardStats() {
      return this.$store.state.analytics.stats || {};
    },
    
    // Recyclables Collected (kg)
    garbageCollected() {
      return this.dashboardStats.total_recyclables_kg || 0;
    },
    
    // Energy Dispensed (kWh)
    energyDispensed() {
      const kwh = this.dashboardStats.total_energy_kwh || 0;
      return parseFloat(kwh.toFixed(1));
    },
    
    // CO2 Saved (kg) - Using standard conversion: 1 kWh = 0.5 kg CO2 saved
    co2Saved() {
      const co2 = this.dashboardStats.co2_saved_kg || (this.energyDispensed * 0.5);
      return parseFloat(co2.toFixed(1));
    },
    
    // Online Kiosks Count
    onlineKiosks() {
      // Use backend-provided count if available, otherwise fallback to filtering
      if (this.dashboardStats.online_kiosks_count !== undefined) {
        return this.dashboardStats.online_kiosks_count;
      }
      const kiosks = this.$store.state.kiosks.kiosks || [];
      return kiosks.filter(k => k.status === 'online' || k.is_online).length;
    }
  },
  
  async mounted() {
    // Fetch dashboard stats from backend
    try {
      await this.$store.dispatch('analytics/fetchStats');
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  },
};
</script>

<style scoped>
.dashboard-bg {
  background: linear-gradient(135deg, #0a0f0d 0%, #142221 50%, #1a2c28 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* Animated Background Blobs */
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.2;
  animation: float 25s infinite ease-in-out;
}

.blob-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  top: -250px;
  left: -250px;
  animation-delay: 0s;
}

.blob-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
  bottom: -200px;
  right: -200px;
  animation-delay: 8s;
}

.blob-3 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #66bb6a 0%, #81c784 100%);
  top: 40%;
  right: 10%;
  animation-delay: 16s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(50px, -80px) scale(1.15);
  }
  66% {
    transform: translate(-30px, 50px) scale(0.9);
  }
}

/* Welcome Header */
.welcome-header {
  position: relative;
  z-index: 1;
  padding: 24px;
  background: rgba(20, 34, 33, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Section Header */
.section-header {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(76, 175, 80, 0.2);
}

/* Modern Button */
.modern-btn {
  border-radius: 10px;
  padding: 8px 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
}

.modern-btn:hover {
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.5);
  transform: translateY(-2px);
}

/* Chart Cards */
.dashboard-chart-card {
  position: relative;
  z-index: 1;
  background: rgba(20, 34, 33, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.dashboard-chart-card:hover {
  border-color: rgba(76, 175, 80, 0.4);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(76, 175, 80, 0.1);
  transform: translateY(-4px);
}

.dashboard-chart-card >>> .text-h6 {
  color: white;
  font-weight: 600;
}

.dashboard-chart-card >>> .text-subtitle2 {
  color: rgba(255, 255, 255, 0.6);
}

/* Responsive */
@media (max-width: 1024px) {
  .welcome-header .row {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 16px;
  }
}
</style>