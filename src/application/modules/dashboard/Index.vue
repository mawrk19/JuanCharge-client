<template>
  <q-page class="dashboard-bg q-pa-lg">
    <div class="q-mb-lg">
      <div class="text-h5 text-weight-bold q-mb-xs">Key Metrics</div>
      <div class="row q-col-gutter-xl q-row-gutter-md">
        <div class="col-12 col-sm-6 col-md-3 q-mb-md">
          <DashboardCard
            title="Active Stations"
            subtitle="Currently online"
            :value="metrics.activeStations"
            icon="ev_station"
            iconColor="green"
            change="+12% from last month"
            changeType="positive"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3 q-mb-md">
          <DashboardCard
            title="Total Revenue"
            subtitle="This month"
            :value="metrics.revenue"
            icon="attach_money"
            iconColor="blue"
            format="currency"
            change="+8.5% from last month"
            changeType="positive"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3 q-mb-md">
          <DashboardCard
            title="Charging Sessions"
            subtitle="Today"
            :value="metrics.sessionsToday"
            icon="battery_charging_full"
            iconColor="orange"
            change="-3.2% from yesterday"
            changeType="negative"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3 q-mb-md">
          <DashboardCard
            title="Utilization Rate"
            subtitle="Average daily"
            :value="metrics.utilizationRate"
            icon="analytics"
            iconColor="purple"
            format="percentage"
            change="+2.1% from last week"
            changeType="positive"
          />
        </div>
      </div>
    </div>

    <div class="q-mb-lg">
      <div class="text-h5 text-weight-bold q-mb-xs">Overview</div>
      <div class="row q-col-gutter-xl q-row-gutter-md">
        <div class="col-12 col-md-8 q-mb-md">
          <q-card class="dashboard-chart-card">
            <q-card-section>
              <div class="text-h6">Revenue Overview</div>
              <div class="text-subtitle2 text-grey-7">Monthly revenue for the past 6 months</div>
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
              <div class="text-h6">Station Status</div>
              <div class="text-subtitle2 text-grey-7">Current station distribution</div>
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
      <div class="text-h5 text-weight-bold q-mb-xs">Usage & Energy</div>
      <div class="row q-col-gutter-xl q-row-gutter-md">
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
        activeStations: 248,
        revenue: 45280,
        sessionsToday: 156,
        utilizationRate: 73.5
      },
      
      // Revenue Chart Configuration
      revenueChartOptions: {
        chart: {
          type: 'area',
          toolbar: { show: false },
          fontFamily: 'inherit'
        },
        colors: ['#1976d2'],
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
          categories: ['July', 'August', 'September', 'October', 'November', 'December']
        },
        yaxis: {
          labels: {
            formatter: (value) => `$${(value / 1000).toFixed(0)}k`
          }
        },
        tooltip: {
          y: {
            formatter: (value) => `$${value.toLocaleString()}`
          }
        }
      },
      revenueChartSeries: [{
        name: 'Revenue',
        data: [38500, 42100, 39800, 45200, 47300, 45280]
      }],

      // Station Status Chart
      stationStatusChartOptions: {
        chart: { type: 'donut' },
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
                  label: 'Total Stations'
                }
              }
            }
          }
        }
      },
      stationStatusChartSeries: [186, 48, 12, 8],

      // Usage Pattern Chart
      usagePatternChartOptions: {
        chart: {
          type: 'column',
          toolbar: { show: false }
        },
        colors: ['#2196f3'],
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
          toolbar: { show: false }
        },
        colors: ['#ff5722'],
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
  }
};
</script>

<style scoped>
.dashboard-bg {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf3 100%);
  min-height: 100vh;
}
.dashboard-chart-card {
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(40, 60, 90, 0.10), 0 1.5px 4px 0 rgba(40, 60, 90, 0.08);
  transition: box-shadow 0.2s, transform 0.2s;
}
.dashboard-chart-card:hover {
  box-shadow: 0 8px 32px 0 rgba(40, 60, 90, 0.16), 0 3px 8px 0 rgba(40, 60, 90, 0.12);
  transform: translateY(-2px) scale(1.012);
}
</style>