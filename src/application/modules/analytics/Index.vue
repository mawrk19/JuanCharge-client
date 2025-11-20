<template>
  <q-page class="analytics-bg q-pa-lg">
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
            JuanCharge Analytics
          </div>
        </div>
        <div class="row q-gutter-sm">
          <!-- <q-btn
            flat
            round
            icon="refresh"
            color="grey-5"
            @click="fetchAllData"
            :loading="isLoading"
            size="md"
          >
            <q-tooltip>Refresh Data</q-tooltip>
          </q-btn> -->
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
            title="Total Users"
            subtitle="LGU + Patrons"
            :value="metrics.totalUsers"
            icon="people"
            iconColor="white"
            change="All registered users"
            changeType="positive"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3 q-mb-md">
          <DashboardCard
            title="LGU Users"
            subtitle="Staff & Admins"
            :value="metrics.totalLguUsers"
            icon="admin_panel_settings"
            iconColor="white"
            change="Active staff members"
            changeType="positive"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3 q-mb-md">
          <DashboardCard
            title="Patrons"
            subtitle="Active Users"
            :value="metrics.totalPatrons"
            icon="person"
            iconColor="white"
            change="Registered patrons"
            changeType="positive"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3 q-mb-md">
          <DashboardCard
            title="Kiosks"
            subtitle="Total Stations"
            :value="metrics.totalKiosks"
            icon="charging_station"
            iconColor="white"
            change="Deployed kiosks"
            changeType="positive"
          />
        </div>
      </div>
    </div>

    <!-- Accumulated Points Section -->
    <div class="q-mb-lg">
      <div class="section-header q-mb-md">
        <q-icon name="stars" size="28px" color="green" class="q-mr-sm" />
        <span class="text-h5 text-white text-weight-bold">Accumulated Points</span>
      </div>
      <div class="row q-col-gutter-md q-row-gutter-md">
        <div class="col-12 col-md-8 q-mb-md">
          <q-card class="analytics-chart-card">
            <q-card-section>
              <div class="text-h6">Points Accumulation Trend</div>
              <div class="text-subtitle2 text-grey-7">Total points earned over the past 6 months</div>
            </q-card-section>
            <q-card-section>
              <apexchart
                type="area"
                height="300"
                :options="pointsChartOptions"
                :series="pointsChartSeries"
              />
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-4 q-mb-md">
          <q-card class="analytics-chart-card">
            <q-card-section>
              <div class="text-h6">Total Points Summary</div>
              <div class="text-subtitle2 text-grey-7">Current points overview</div>
            </q-card-section>
            <q-card-section>
              <div class="points-summary">
                <div class="summary-item">
                  <div class="summary-label">Total Points</div>
                  <div class="summary-value text-green">{{ formatNumber(pointsSummary.totalPoints) }} pts</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">Total Redeemed</div>
                  <div class="summary-value text-orange">{{ formatNumber(pointsSummary.totalRedeemed) }} pts</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">Active Patrons</div>
                  <div class="summary-value text-blue">{{ pointsSummary.activePatrons }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Top Performing Patrons -->
    <div>
      <div class="section-header q-mb-md">
        <q-icon name="emoji_events" size="28px" color="green" class="q-mr-sm" />
        <span class="text-h5 text-white text-weight-bold">Top Performing Patrons</span>
      </div>
      <q-card class="analytics-chart-card">
        <q-card-section>
          <div class="text-h6 q-mb-md">Highest Point Earners</div>
          
          <div v-if="topPatrons.length === 0" class="text-center text-grey-6 q-py-xl">
            <q-icon name="people_outline" size="48px" class="q-mb-md" />
            <div>No patron data available</div>
          </div>

          <div v-else class="leaderboard-list">
            <div
              v-for="(patron, index) in topPatrons"
              :key="patron.id"
              class="leaderboard-item"
              :class="{ 'top-three': index < 3 }"
            >
              <div class="row items-center no-wrap">
                <!-- Rank Badge -->
                <div class="rank-badge" :class="`rank-${index + 1}`">
                  <q-icon 
                    v-if="index === 0" 
                    name="emoji_events" 
                    size="24px" 
                    color="amber"
                  />
                  <q-icon 
                    v-else-if="index === 1" 
                    name="emoji_events" 
                    size="24px" 
                    color="grey-5"
                  />
                  <q-icon 
                    v-else-if="index === 2" 
                    name="emoji_events" 
                    size="24px" 
                    color="orange"
                  />
                  <span v-else class="rank-number">{{ index + 1 }}</span>
                </div>

                <!-- Patron Avatar & Name -->
                <q-avatar size="48px" color="green" text-color="white" class="q-ml-md">
                  {{ getInitials(patron.name) }}
                </q-avatar>
                
                <div class="col q-ml-md">
                  <div class="patron-name">{{ patron.name }}</div>
                  <div class="patron-subtitle">Rank #{{ index + 1 }}</div>
                </div>

                <!-- Points Badge -->
                <q-badge 
                  :color="index === 0 ? 'amber' : index === 1 ? 'grey-6' : index === 2 ? 'orange' : 'purple'" 
                  class="points-badge"
                >
                  <q-icon name="stars" size="16px" class="q-mr-xs" />
                  {{ formatNumber(patron.points) }} pts
                </q-badge>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import DashboardCard from "./components/DashboardCard.vue";
import http from "@/service/axios";

export default {
  name: "Analytics",
  components: {
    DashboardCard
  },
  data() {
    return {
      lguUsersList: [],
      kioskUsersList: [],
      kiosksList: [],
      chargingHistory: [],
      topPatrons: [],
      
      metrics: {
        totalUsers: 0,
        totalLguUsers: 0,
        totalPatrons: 0,
        totalKiosks: 0,
      },

      pointsSummary: {
        totalPoints: 0,
        totalRedeemed: 0,
        activePatrons: 0
      },
      
      // Points Accumulation Chart
      pointsChartOptions: {
        chart: {
          type: 'area',
          toolbar: { show: false },
          fontFamily: 'inherit',
          background: 'transparent'
        },
        colors: ['#4caf50'],
        theme: {
          mode: 'dark'
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.3,
          }
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
          categories: []
        },
        yaxis: {
          labels: {
            formatter: (value) => `${(value / 1000).toFixed(0)}k`
          }
        },
        tooltip: {
          y: {
            formatter: (value) => `${value.toLocaleString()} pts`
          }
        }
      },
      pointsChartSeries: [{
        name: 'Total Points',
        data: []
      }],

      // Loading states
      isLoading: false,
    };
  },
  
  computed: {
    userName() {
      const user = this.$store.state.auth.user;
      if (!user) return '';
      return user.name || user.first_name || 'User';
    }
  },

  async mounted() {
    await this.fetchAllData();
  },

  methods: {
    getInitials(name) {
      if (!name) return '?';
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    },

    formatNumber(num) {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      return num.toLocaleString();
    },

    async fetchAllData() {
      if (this.isLoading) return;
      
      this.isLoading = true;

      try {
        // Fetch all data in parallel for better performance
        const [kiosksRes, lguUsersRes, kioskUsersRes, chargingRes] = await Promise.all([
          http.get('/kiosks').catch(() => ({ data: [] })),
          http.get('/lgu-users', { params: { per_page: 1000 } }).catch(() => ({ data: [] })),
          http.get('/kiosk-users', { params: { per_page: 1000 } }).catch(() => ({ data: [] })),
          http.get('/charging/history', { params: { per_page: 1000 } }).catch(() => ({ data: [] }))
        ]);

        // Extract data
        this.kiosksList = kiosksRes.data?.data || kiosksRes.data || [];
        this.lguUsersList = lguUsersRes.data?.data || lguUsersRes.data || [];
        this.kioskUsersList = kioskUsersRes.data?.data || kioskUsersRes.data || [];
        this.chargingHistory = chargingRes.data?.data || chargingRes.data || [];

        // Calculate all metrics
        this.updateMetrics();
        this.calculatePointsData();
        this.calculateTopPerformers();

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Failed to load some dashboard data',
          position: 'top',
          timeout: 2000
        });
      } finally {
        this.isLoading = false;
      }
    },

    updateMetrics() {
      this.metrics.totalKiosks = this.kiosksList.length;
      this.metrics.totalLguUsers = this.lguUsersList.length;
      this.metrics.totalPatrons = this.kioskUsersList.length;
      this.metrics.totalUsers = this.metrics.totalLguUsers + this.metrics.totalPatrons;
    },

    calculatePointsData() {
      // Calculate total points from all patrons
      let totalPoints = 0;
      let activePatrons = 0;
      
      this.kioskUsersList.forEach(user => {
        const points = parseFloat(user.points_balance || 0);
        totalPoints += points;
        if (points > 0) {
          activePatrons++;
        }
      });

      // Calculate total points redeemed from charging history
      let totalRedeemed = 0;
      this.chargingHistory.forEach(session => {
        totalRedeemed += parseFloat(session.points_redeemed || 0);
      });

      // Update points summary
      this.pointsSummary = {
        totalPoints: Math.round(totalPoints),
        totalRedeemed: Math.round(totalRedeemed),
        activePatrons: activePatrons
      };

      // Calculate monthly points accumulation
      const monthlyPoints = {};
      const now = new Date();
      
      // Initialize last 7 months
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = date.toLocaleString('default', { month: 'short' });
        monthlyPoints[key] = 0;
      }

      // Aggregate points by month (cumulative)
      this.kioskUsersList.forEach(user => {
        const createdDate = new Date(user.created_at);
        const monthKey = createdDate.toLocaleString('default', { month: 'short' });
        const points = parseFloat(user.points_balance || 0);
        
        let foundMonth = false;
        Object.keys(monthlyPoints).forEach(month => {
          if (month === monthKey) foundMonth = true;
          if (foundMonth) {
            monthlyPoints[month] += points;
          }
        });
      });

      // Update chart
      const categories = Object.keys(monthlyPoints);
      const data = Object.values(monthlyPoints).map(val => Math.round(val));
      
      this.pointsChartOptions.xaxis.categories = categories;
      this.pointsChartSeries = [{
        name: 'Total Points',
        data: data
      }];
    },

    calculateTopPerformers() {
      // Sort patrons by points balance and get top 10
      const sortedPatrons = [...this.kioskUsersList]
        .filter(user => user.points_balance > 0)
        .sort((a, b) => (b.points_balance || 0) - (a.points_balance || 0))
        .slice(0, 10);

      this.topPatrons = sortedPatrons.map(user => ({
        id: user.id,
        name: user.first_name && user.last_name 
          ? `${user.first_name} ${user.last_name}` 
          : user.name || 'Unknown User',
        points: Math.round(user.points_balance || 0)
      }));
    },
  }
};
</script>

<style scoped>
.analytics-bg {
  background: linear-gradient(135deg, #0a0f0d 0%, #142221 50%, #1a2c28 100%);
  min-height: 100vh;
  position: relative;
}

/* Animated Background Blobs - Optimized */
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
  filter: blur(80px);
  opacity: 0.15;
  animation: float 20s infinite ease-in-out;
  will-change: transform;
}

.blob-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.blob-2 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
  bottom: -175px;
  right: -175px;
  animation-delay: 7s;
}

.blob-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #66bb6a 0%, #81c784 100%);
  top: 50%;
  right: 15%;
  animation-delay: 14s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 30px) scale(0.95);
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
.analytics-chart-card {
  position: relative;
  z-index: 1;
  background: rgba(20, 34, 33, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.analytics-chart-card:hover {
  border-color: rgba(76, 175, 80, 0.4);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(76, 175, 80, 0.1);
  transform: translateY(-4px);
}

.analytics-chart-card >>> .text-h6 {
  color: white;
  font-weight: 600;
}

.analytics-chart-card >>> .text-subtitle2 {
  color: rgba(255, 255, 255, 0.6);
}

/* Points Summary */
.points-summary {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 16px 0;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.summary-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 500;
}

.summary-value {
  font-size: 24px;
  font-weight: 700;
}

/* Leaderboard List */
.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.leaderboard-item {
  background: rgba(30, 30, 30, 0.6);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.leaderboard-item:hover {
  background: rgba(40, 40, 40, 0.8);
  border-color: rgba(76, 175, 80, 0.4);
  transform: translateX(8px);
}

.leaderboard-item.top-three {
  border-width: 2px;
}

.leaderboard-item.top-three:nth-child(1) {
  border-color: rgba(255, 193, 7, 0.6);
  background: rgba(255, 193, 7, 0.08);
}

.leaderboard-item.top-three:nth-child(2) {
  border-color: rgba(158, 158, 158, 0.6);
  background: rgba(158, 158, 158, 0.08);
}

.leaderboard-item.top-three:nth-child(3) {
  border-color: rgba(255, 152, 0, 0.6);
  background: rgba(255, 152, 0, 0.08);
}

.rank-badge {
  min-width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(76, 175, 80, 0.2);
  border: 2px solid rgba(76, 175, 80, 0.3);
}

.rank-badge.rank-1 {
  background: rgba(255, 193, 7, 0.2);
  border-color: rgba(255, 193, 7, 0.5);
}

.rank-badge.rank-2 {
  background: rgba(158, 158, 158, 0.2);
  border-color: rgba(158, 158, 158, 0.5);
}

.rank-badge.rank-3 {
  background: rgba(255, 152, 0, 0.2);
  border-color: rgba(255, 152, 0, 0.5);
}

.rank-number {
  font-size: 20px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
}

.patron-name {
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.patron-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.points-badge {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 20px;
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