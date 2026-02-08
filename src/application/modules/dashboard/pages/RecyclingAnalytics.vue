<template>
  <q-page class="bg-[#F8F9FB] min-h-screen font-sans text-gray-800">
    <div class="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h4 class="text-2xl font-bold text-[#1A1A1A] tracking-tight">
            Recycling Analytics
          </h4>
          <p class="text-gray-500 text-sm mt-1 font-medium italic">Track impact and trends across the kiosk network</p>
        </div>
        <div class="flex items-center gap-3">
          <button @click="fetchData" class="p-2 rounded-lg bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-all">
            <q-icon name="refresh" :class="{'animate-spin': loading}" />
          </button>
        </div>
      </div>

      <!-- KPI Header Cards (Glassmorphism) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
        <!-- Total Items Card -->
        <div class="glass-card p-6 flex items-center gap-5 border-l-4 border-emerald-500">
          <div class="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
            <q-icon name="recycling" size="32px" />
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Items Recycled</p>
            <h2 class="text-3xl font-black text-emerald-700 tracking-tight">{{ analyticsData?.total_items || 0 }}</h2>
            <div class="flex items-center gap-1 mt-1">
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600">+12.5%</span>
              <span class="text-[10px] text-gray-400 font-medium">vs last week</span>
            </div>
          </div>
        </div>

        <!-- Breakdown Summary Card -->
        <div class="glass-card p-6 flex items-center gap-5 border-l-4 border-blue-500">
          <div class="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
            <q-icon name="analytics" size="32px" />
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Top Recycled Item</p>
            <h3 class="text-xl font-bold text-blue-700">{{ topItemType }}</h3>
            <p class="text-[10px] text-gray-400 font-medium mt-1">Most frequently deposited category</p>
          </div>
        </div>

        <!-- Growth Indicator Card -->
        <div class="glass-card p-6 flex items-center gap-5 border-l-4 border-amber-500">
          <div class="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
            <q-icon name="trending_up" size="32px" />
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Recycling Velocity</p>
            <h3 class="text-xl font-bold text-amber-700">{{ weeklyAverage }} / day</h3>
            <p class="text-[10px] text-gray-400 font-medium mt-1">Daily average this week</p>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up" style="animation-delay: 100ms">
        
        <!-- Recycling Trends (Area Chart) -->
        <div class="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50">
          <div class="flex items-center justify-between mb-6">
             <h5 class="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">Recycling Trends (30 Days)</h5>
             <div class="bg-gray-100/50 px-3 py-1 rounded-full text-[10px] font-bold text-gray-500">
               Smooth View
             </div>
          </div>
          <div class="h-[300px]">
            <apexchart
              type="area"
              height="100%"
              :options="areaChartOptions"
              :series="areaSeries"
            />
          </div>
        </div>

        <!-- Item Breakdown (Donut Chart) -->
        <div class="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50">
          <div class="flex items-center justify-between mb-6">
             <h5 class="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">Storage Distribution</h5>
             <div class="bg-gray-100/50 px-3 py-1 rounded-full text-[10px] font-bold text-gray-500">
               Live Allocation
             </div>
          </div>
          <div class="h-[300px] flex items-center justify-center relative">
            <apexchart
              type="donut"
              width="100%"
              height="100%"
              :options="donutChartOptions"
              :series="donutSeries"
            />
          </div>
        </div>
      </div>

      <!-- Detail Table Section -->
      <div class="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50 animate-slide-up" style="animation-delay: 200ms">
        <div class="flex items-center justify-between mb-6">
          <h5 class="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider text-emerald-800">Itemized Breakdown</h5>
        </div>
        <div class="overflow-hidden rounded-xl border border-gray-100 bg-white/50">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-emerald-50/50 text-[10px] font-bold uppercase tracking-widest text-emerald-800">
                <th class="py-4 px-6">Material Type</th>
                <th class="py-4 px-6">Total Count</th>
                <th class="py-4 px-6">% of Total</th>
                <th class="py-4 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr v-for="item in groupedBreakdown" :key="item.item_type" class="hover:bg-emerald-50/30 transition-colors border-b border-gray-50 last:border-0">
                <td class="py-4 px-6 font-bold text-gray-700 flex items-center gap-3">
                  <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: getBadgeColor(item.item_type) }"></div>
                  {{ formatItemType(item.item_type) }}
                </td>
                <td class="py-4 px-6 font-mono font-semibold">{{ item.total_count }}</td>
                <td class="py-4 px-6">
                   <div class="flex items-center gap-2">
                     <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden w-24">
                       <div class="h-full rounded-full" :style="{ width: getPercentage(item.total_count) + '%', backgroundColor: getBadgeColor(item.item_type) }"></div>
                     </div>
                     <span class="text-[10px] font-bold text-gray-400">{{ getPercentage(item.total_count) }}%</span>
                   </div>
                </td>
                <td class="py-4 px-6 text-right">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-600">COLLECTED</span>
                </td>
              </tr>
              <tr v-if="!analyticsData?.breakdown?.length">
                <td colspan="4" class="py-10 text-center text-gray-400 italic">No breakdown data available at the moment.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "RecyclingAnalytics",
  data() {
    return {
      areaChartOptions: {
        chart: { type: 'area', toolbar: { show: false }, zoom: { enabled: false }, sparkline: { enabled: false }, fontFamily: "'Inter', sans-serif" },
        colors: ["#10b981"],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 3 },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.6,
            opacityTo: 0.1,
            stops: [0, 90, 100]
          }
        },
        xaxis: {
          type: 'datetime',
          categories: [],
          axisBorder: { show: false },
          axisTicks: { show: false },
          labels: {
            style: { colors: '#9CA3AF', fontSize: '10px' },
            format: 'MMM dd'
          }
        },
        yaxis: {
          labels: { style: { colors: '#9CA3AF', fontSize: '10px' } }
        },
        grid: {
          borderColor: '#F1F1F1',
          strokeDashArray: 4,
          xaxis: { lines: { show: false } }
        },
        tooltip: { x: { format: 'dd MMM yyyy' }, theme: 'light' }
      },
      donutChartOptions: {
        chart: { type: 'donut', fontFamily: "'Inter', sans-serif" },
        colors: ["#3b82f6", "#94a3b8", "#f59e0b"], // Blue (PET), Silver (Can), Amber (Glass)
        labels: ["PET Bottles", "Aluminum Cans", "Glass Bottles"],
        dataLabels: { enabled: false },
        legend: { position: 'bottom', horizontalAlign: 'center', fontSize: '11px', markers: { radius: 12 } },
        plotOptions: {
          pie: {
            donut: {
              size: '75%',
              labels: {
                show: true,
                name: { show: true, color: '#9CA3AF', fontSize: '12px', offsetY: -4 },
                value: { show: true, fontSize: '24px', fontWeight: 800, color: '#1A1A1A', offsetY: 8 },
                total: { show: true, label: 'Items', color: '#9CA3AF', fontWeight: 600, fontSize: '11px' }
              }
            }
          }
        },
        stroke: { width: 0 }
      }
    };
  },
  computed: {
    loading() {
      return this.$store.getters["dashboard/isLoading"];
    },
    analyticsData() {
      return this.$store.getters["dashboard/recyclingAnalytics"];
    },
    areaSeries() {
      const data = this.analyticsData?.trends || [];
      return [{
        name: 'Items Recycled',
        data: data.map(d => d.total_count)
      }];
    },
    donutSeries() {
      const data = this.analyticsData?.breakdown || [];
      
      const pet = data.filter(d => 
        ['pet', 'Pet/plastic battles', 'Pet/plastic battles'].some(key => 
          d.item_type.toLowerCase().includes('pet') || d.item_type === key
        )
      ).reduce((acc, curr) => acc + curr.total_count, 0);

      const can = data.filter(d => 
        ['can', 'Tin/cans'].some(key => 
          d.item_type.toLowerCase().includes('can') || d.item_type === key
        )
      ).reduce((acc, curr) => acc + curr.total_count, 0);

      const glass = data.filter(d => 
        d.item_type.toLowerCase().includes('glass')
      ).reduce((acc, curr) => acc + curr.total_count, 0);

      return [pet, can, glass];
    },
    groupedBreakdown() {
      const data = this.analyticsData?.breakdown || [];
      const groups = {
        'pet': { item_type: 'pet', total_count: 0 },
        'can': { item_type: 'can', total_count: 0 },
        'glass_bottle': { item_type: 'glass_bottle', total_count: 0 }
      };

      data.forEach(item => {
        const type = item.item_type.toLowerCase();
        if (type.includes('pet') || type.includes('battle')) {
          groups['pet'].total_count += Number(item.total_count);
        } else if (type.includes('can') || type.includes('tin')) {
          groups['can'].total_count += Number(item.total_count);
        } else if (type.includes('glass')) {
          groups['glass_bottle'].total_count += Number(item.total_count);
        } else {
          // Fallback for unknown types - could add to an 'other' group or keep separate
          if (!groups[item.item_type]) {
            groups[item.item_type] = { item_type: item.item_type, total_count: 0 };
          }
          groups[item.item_type].total_count += Number(item.total_count);
        }
      });

      return Object.values(groups).filter(g => g.total_count > 0);
    },
    topItemType() {
      const breakdown = this.groupedBreakdown;
      if (!breakdown.length) return "N/A";
      const sorted = [...breakdown].sort((a, b) => b.total_count - a.total_count);
      return this.formatItemType(sorted[0].item_type);
    },
    weeklyAverage() {
      const trends = this.analyticsData?.trends || [];
      if (!trends.length) return 0;
      const sum = trends.reduce((acc, curr) => acc + Number(curr.total_count), 0);
      return (sum / trends.length).toFixed(1);
    }
  },
  watch: {
    'analyticsData.trends': {
      handler(newTrends) {
        if (newTrends) {
           this.areaChartOptions = {
             ...this.areaChartOptions,
             xaxis: {
               ...this.areaChartOptions.xaxis,
               categories: newTrends.map(t => t.date)
             }
           };
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      await this.$store.dispatch("dashboard/fetchRecyclingAnalytics");
    },
    formatItemType(type) {
      const maps = {
        'pet': 'PET Plastic',
        'can': 'Aluminum Cans',
        'glass_bottle': 'Glass Bottles'
      };
      return maps[type] || type.toUpperCase();
    },
    getBadgeColor(type) {
      const maps = {
        'pet': '#3b82f6',
        'can': '#94a3b8',
        'glass_bottle': '#f59e0b'
      };
      return maps[type] || '#10b981';
    },
    getPercentage(count) {
      const total = this.analyticsData?.total_items || 0;
      if (total === 0) return 0;
      return ((count / total) * 100).toFixed(1);
    }
  }
};
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.1);
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.6s ease-out backwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
