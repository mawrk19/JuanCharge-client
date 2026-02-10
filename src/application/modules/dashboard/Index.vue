<template>
  <q-page class="bg-[#F8F9FB] min-h-screen font-sans text-gray-800">
    <div class="max-w-7xl mx-auto p-4 md:p-6 space-y-5">
      
      <!-- Top Header (Compact) -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h4 class="text-xl font-bold text-[#1A1A1A] tracking-tight">
            Dashboard Overview
          </h4>
          <p class="text-gray-400 text-xs mt-0.5 font-medium">View your key metrics and activity for today</p>
        </div>
        <div class="flex items-center gap-2">
        </div>
      </div>

      <!-- Dynamic Operational Alerts -->
      <OperationalAlerts />

      <!-- KPI Grid (Top Row) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Users"
          subtitle="Registered"
          :value="overview?.total_users || 0"
          icon="people"
          change="+14%" 
          changeType="positive"
        />
        <DashboardCard
          title="Active Energy"
          subtitle="Total Consumed"
          :value="overview?.charging?.total_energy_kwh || 0"
          icon="bolt"
          format="decimal"
          change="+13%"
          changeType="positive"
        />
        <DashboardCard
          title="Active Kiosks"
          subtitle="Network Status"
          :value="(overview?.kiosks?.active || 0) + '/' + (overview?.kiosks?.total || 0)"
          icon="ev_station"
          change="+4.68%"
          changeType="positive"
        />
        <DashboardCard
          title="Recycling"
          subtitle="Total Deposited"
          :value="overview?.recycling?.total_weight_kg || 0"
          icon="recycling"
          format="weight"
          :change="(overview?.recycling?.total_deposits || 0) + ' drops'"
          changeType="positive"
        />
      </div>

      <!-- Charts Section (Middle Content - Reduced Height) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        <!-- Main Chart: Activity Overview (Taking 2/3 width) -->
        <div class="lg:col-span-2 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-4">
             <h5 class="text-xs font-bold text-[#1A1A1A] uppercase tracking-wide">Activity Overview</h5>
             <div class="bg-gray-50 px-2.5 py-1 rounded-full text-[10px] font-bold text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors">
               Last 7 Days
               <q-icon name="expand_more" />
             </div>
          </div>
          
          <div class="w-full h-[240px]">
            <apexchart
              type="bar"
              height="100%"
              :options="barChartOptions"
              :series="chartSeries"
            />
          </div>
        </div>

        <!-- Secondary Chart: Distribution (Taking 1/3 width) -->
        <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col">
          <div class="flex items-center justify-between mb-2">
             <h5 class="text-xs font-bold text-[#1A1A1A] uppercase tracking-wide">Impact by Category</h5>
             <div class="bg-gray-50 px-2.5 py-1 rounded-full text-[10px] font-bold text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors">
               This Week
               <q-icon name="expand_more" />
             </div>
          </div>
          
          <div class="flex-1 flex items-center justify-center relative">
            <apexchart
              type="donut"
              width="100%"
              height="200"
              :options="donutChartOptions"
              :series="donutSeries"
            />
          </div>
        </div>
      </div>

       <!-- Bottom Section: Transactions / Lists (Compact Text) -->
      <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
         <div class="flex items-center justify-between mb-4">
            <h5  class="text-xs font-bold text-[#1A1A1A] uppercase tracking-wide">Recent Transactions</h5>
            <div class="flex gap-2">
              <div class="relative">
                 <q-icon name="search" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size="14px"/>
                 <input type="text" placeholder="Search" class="pl-8 pr-3 py-1 bg-gray-50 rounded-lg text-xs border-none focus:ring-0 w-40 placeholder-gray-400 text-gray-600 font-medium">
              </div>
              <button class="p-1 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100">
                <q-icon name="filter_list" size="16px" />
              </button>
            </div>
         </div>

         <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-50">
                   <th class="py-2 pl-2">User</th>
                   <th class="py-2">Type</th>
                   <th class="py-2">Date</th>
                   <th class="py-2 text-right pr-2">Amount</th>
                </tr>
              </thead>
              <tbody class="text-xs">
                 <tr v-for="item in combinedActivity" :key="item.id" class="group hover:bg-gray-50/50 transition-colors">
                    <td class="py-2.5 pl-2 font-semibold text-[#1A1A1A] flex items-center gap-2">
                       <div class="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                          <q-icon :name="item.icon" size="14px" />
                       </div>
                       {{ item.user_name }}
                    </td>
                    <td class="py-2.5">
                       <span 
                          class="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide"
                          :class="item.typeClass"
                       >
                          {{ item.typeLabel }}
                       </span>
                    </td>
                    <td class="py-2.5 text-gray-500 font-medium">{{ formatTime(item.timestamp) }}</td>
                    <td class="py-2.5 text-right pr-2 font-bold" :class="item.amountClass">
                       {{ item.amountLabel }}
                    </td>
                 </tr>
                 <tr v-if="combinedActivity.length === 0">
                    <td colspan="4" class="py-6 text-center text-xs text-gray-400">No recent activity detected.</td>
                 </tr>
              </tbody>
            </table>
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
    DashboardCard,
    OperationalAlerts: () => import("./components/OperationalAlerts.vue"),
  },
  data() {
    return {
      barChartOptions: {
        chart: {
          type: "bar",
          toolbar: { show: false },
          fontFamily: "'Inter', sans-serif",
          stacked: false,
        },
        colors: ["#82D616", "#C1F085"], 
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: '40%',
            dataLabels: { position: 'top' },
          }
        },
        dataLabels: { enabled: false }, // Too messy on small charts
        stroke: { show: true, width: 0, colors: ['transparent'] },
        grid: {
          borderColor: '#F1F1F1',
          strokeDashArray: 4,
          padding: { top: 0, right: 10, bottom: 0, left: 10 },
          yaxis: { lines: { show: true } },
          xaxis: { lines: { show: false } }, 
        },
        xaxis: {
          categories: [],
          axisBorder: { show: false },
          axisTicks: { show: false },
          labels: { style: { colors: '#9CA3AF', fontSize: '10px', fontWeight: 500 } }
        },
        yaxis: {
          labels: { style: { colors: '#9CA3AF', fontSize: '10px', fontWeight: 500 } },
        },
        legend: { position: 'top', horizontalAlign: 'right', fontSize: '11px', itemMargin: { horizontal: 10 } },
        tooltip: { theme: 'light', style: { fontSize: '11px' } },
      },
      
      donutChartOptions: {
        chart: { type: 'donut', fontFamily: "'Inter', sans-serif" },
        colors: ["#1B3C08", "#82D616", "#C1F085", "#E9F8D6"], 
        labels: ["Sessions", "Recycling", "Kiosks", "Other"],
        dataLabels: { enabled: false },
        legend: { position: 'bottom', horizontalAlign: 'center', fontSize: '11px', itemMargin: { horizontal: 5 } },
        plotOptions: {
           pie: {
              donut: {
                 size: '70%',
                 labels: {
                    show: true,
                    name: { show: true, color: '#9CA3AF', fontSize: '11px', offsetY: -2 },
                    value: { show: true, fontSize: '18px', fontWeight: 700, color: '#1A1A1A', offsetY: 4 },
                    total: { show: true, label: 'Impact', color: '#9CA3AF', fontWeight: 600, fontSize: '10px' }
                 }
              }
           }
        }
      },
      chartSeries: [], 
    };
  },

  computed: {
    userName() {
      const user = this.$store.state.auth.user;
      return user ? (user.name || user.first_name || "Admin") : "User";
    },
    isLoading() {
      return this.$store.getters["dashboard/isLoading"];
    },
    overview() {
      return this.$store.getters["dashboard/overview"];
    },
    sessions() {
      return this.$store.getters["dashboard/sessions"] || [];
    },
    recycling() {
      return this.$store.getters["dashboard/recycling"] || [];
    },
    chartData() {
      return this.$store.getters["dashboard/chartData"] || [];
    },
    combinedActivity() {
      // Merge sessions and recycling into one "Transactions" list
      const txs = [
        ...this.sessions.map(s => ({
           id: 's-'+s.session_id,
           user_name: s.user_name,
           icon: 'bolt',
           timestamp: s.created_at || new Date().toISOString(), 
           typeLabel: 'Charging',
           typeClass: 'bg-green-50 text-green-600',
           amountLabel: `-${s.points_used} pts`,
           amountClass: 'text-[#1A1A1A]' 
        })),
        ...this.recycling.map(r => ({
           id: 'r-'+r.id,
           user_name: r.user_name,
           icon: 'recycling',
           timestamp: r.created_at || new Date().toISOString(),
           typeLabel: 'Recycling',
           typeClass: 'bg-blue-50 text-blue-600',
           amountLabel: `+${r.points_earned} pts`,
           amountClass: 'text-[#82D616]' 
        }))
      ];
      return txs.slice(0, 6); 
    },
    donutSeries() {
      const sess = this.overview?.charging?.total_sessions || 0;
      const recyc = this.overview?.recycling?.total_deposits || 0;
      const kiosks = this.overview?.kiosks?.active || 0;
      
      if (sess + recyc + kiosks === 0) return [1];
      
      return [sess, recyc, kiosks, 10]; 
    }
  },

  watch: {
    chartData: {
      handler(newData) {
        if (newData && newData.length > 0) {
           this.updateBarChart(newData);
        }
      },
      immediate: true,
    },
  },

  mounted() {
    this.refreshDashboard();
  },

  methods: {
    async refreshDashboard() {
      try {
        await this.$store.dispatch("dashboard/fetchAllDashboardData");
        await Promise.all([
          this.$store.dispatch("dashboard/fetchSessions", 5),
          this.$store.dispatch("dashboard/fetchRecycling", 5)
        ]);
      } catch (error) {
        console.warn("Some dashboard data unavailable");
      }
    },

    updateBarChart(data) {
      this.barChartOptions = {
        ...this.barChartOptions,
        xaxis: {
          ...this.barChartOptions.xaxis,
          categories: data.map((d) => {
             // Handle date parsing safely
             if (!d.date) return '-';
             const date = new Date(d.date);
             if (isNaN(date.getTime())) return d.date; // Return original if invalid
             return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }),
        },
      };
      this.chartSeries = [
        { name: "Sessions", data: data.map((d) => d.sessions) },
        { name: "Recycling (kg)", data: data.map((d) => d.recycling_kg) },
      ];
    },

    formatTime(timestamp) {
       if (!timestamp) return "-";
       return new Date(timestamp).toLocaleDateString('en-US', { 
         month: 'short', 
         day: 'numeric',
         year: 'numeric'
       });
    }
  },
};
</script>
