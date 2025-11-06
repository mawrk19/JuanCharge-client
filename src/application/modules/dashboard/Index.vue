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
            :value="metrics.garbageCollected"
            icon="recycling"
            iconColor="white"
            format="weight"
            change="+1 from last month"
            changeType="positive"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3 q-mb-md">
          <DashboardCard
            title="Charging Time"
            subtitle="Dispensed"
            :value="metrics.chargingTime"
            icon="charging_station"
            iconColor="white"
            format="minutes"
            change="+8.5% from last month"
            changeType="positive"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3 q-mb-md">
          <DashboardCard
            title="Online"
            subtitle="JuanCharge Kiosk"
            :value="metrics.onlineKiosk"
            icon="podcasts"
            iconColor="white"
            change="Uptime: 120 hrs"
            changeType="positive"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3 q-mb-md">
          <DashboardCard
            title="Charge Capacity"
            subtitle="Battery Status"
            :value="metrics.chargeCapacity"
            icon="battery_charging_full"
            iconColor="white"
            format="percentage"
            change="Last Full: 4 days ago"
            changeType="positive"
          />
        </div>
      </div>
    </div>

    <div class="q-mb-lg">
      <div class="section-header q-mb-md">
        <q-icon name="restore_from_trash" size="28px" color="green" class="q-mr-sm" />
        <span class="text-h5 text-white text-weight-bold">Collection Overview</span>
      </div>
      <div class="row q-col-gutter-md q-row-gutter-md">
        <div class="col-12 col-md-8 q-mb-md">
          <q-card class="dashboard-chart-card">
            <q-card-section>
              <div class="text-h6">Bin Collection Insights</div>
              <div class="text-subtitle2 text-grey-7">Monthly kiosk bin collection for the past 6 months</div>
            </q-card-section>
            <q-card-section>
              <apexchart
                type="area"
                height="300"
                :options="revenueChartOptions"
                :series="revenueChartSeries"
              />
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-4 q-mb-md">
          <q-card class="dashboard-chart-card">
            <q-card-section>
              <div class="text-h6">Kiosk Status</div>
              <div class="text-subtitle2 text-grey-7"></div>
            </q-card-section>
            <q-card-section>
              <apexchart
                type="donut"
                height="300"
                :options="stationStatusChartOptions"
                :series="stationStatusChartSeries"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <div>
      <div class="section-header q-mb-md">
        <q-icon name="electric_bolt" size="28px" color="green" class="q-mr-sm" />
        <span class="text-h5 text-white text-weight-bold">Usage & Energy</span>
      </div>
      <div class="row q-col-gutter-md q-row-gutter-md">
        <div class="col-12 col-md-6 q-mb-md">
          <q-card class="dashboard-chart-card">
            <q-card-section>
              <div class="text-h6">Daily Usage Patterns</div>
              <div class="text-subtitle2 text-grey-7">Charging sessions by hour</div>
            </q-card-section>
            <q-card-section>
              <apexchart
                type="column"
                height="300"
                :options="usagePatternChartOptions"
                :series="usagePatternChartSeries"
              />
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-6 q-mb-md">
          <q-card class="dashboard-chart-card">
            <q-card-section>
              <div class="text-h6">Energy Consumption</div>
              <div class="text-subtitle2 text-grey-7">kWh delivered this week</div>
            </q-card-section>
            <q-card-section>
              <apexchart
                type="line"
                height="300"
                :options="energyConsumptionChartOptions"
                :series="energyConsumptionChartSeries"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import DashboardCard from "./components/DashboardCard.vue";

export default {
  name: "Dashboard",
  components: {
    DashboardCard
  },
  data() {
    return {
      metrics: {
        garbageCollected: 415,
        chargingTime: 314,
        onlineKiosk: 1,
        chargeCapacity: 74.5,
      },
      
      // Revenue Chart Configuration
      revenueChartOptions: {
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
          categories: [ 'May', 'June', 'July', 'August', 'September', 'October', 'November']
        },
        yaxis: {
          labels: {
            formatter: (value) => `${(value / 1000).toFixed(0)}k`
          }
        },
        tooltip: {
          y: {
            formatter: (value) => `₱${value.toLocaleString()}`
          }
        }
      },
      revenueChartSeries: [{
        name: 'Bin Collection',
        data: [10, 80, 30, 70, 50, 85, 90]
      }],

      // Station Status Chart
      stationStatusChartOptions: {
        chart: { 
          type: 'donut',
          background: 'transparent'
        },
        theme: {
          mode: 'dark'
        },
        colors: ['#4caf50', '#ff9800', '#f44336', '#9e9e9e'],
        labels: ['Online', 'Charging', 'Offline', 'Maintenance'],
        legend: { position: 'bottom' },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  show: true,
                  label: 'Total Kiosk'
                }
              }
            }
          }
        }
      },
      stationStatusChartSeries: [1],

      // Usage Pattern Chart
      usagePatternChartOptions: {
        chart: {
          type: 'column',
          toolbar: { show: false },
          background: 'transparent'
        },
        theme: {
          mode: 'dark'
        },
        colors: ['#66bb6a'],
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: '60%'
          }
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
        },
        yaxis: {
          title: { text: 'Sessions' }
        }
      },
      usagePatternChartSeries: [{
        name: 'Charging Sessions',
        data: [12, 8, 35, 42, 38, 28]
      }],

      // Energy Consumption Chart
      energyConsumptionChartOptions: {
        chart: {
          type: 'line',
          toolbar: { show: false },
          background: 'transparent'
        },
        theme: {
          mode: 'dark'
        },
        colors: ['#81c784'],
        stroke: { curve: 'smooth', width: 3 },
        dataLabels: { enabled: false },
        xaxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yaxis: {
          title: { text: 'Energy (kWh)' },
          labels: {
            formatter: (value) => `${(value / 1000).toFixed(1)}k`
          }
        },
        markers: {
          size: 5,
          colors: ['#ff5722'],
          strokeWidth: 2
        }
      },
      energyConsumptionChartSeries: [{
        name: 'Energy Delivered',
        data: [8420, 9150, 8890, 9720, 9340, 7650, 6890]
      }]
    };
  },
  computed: {
    userName() {
      const user = this.$store.state.auth.user;
      if(!user) return '';
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