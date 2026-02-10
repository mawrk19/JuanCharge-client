<template>
  <div v-if="activeAlerts.length > 0" class="space-y-3 q-mb-md">
    <div 
      v-for="alert in activeAlerts" 
      :key="alert.id"
      class="alert-card relative overflow-hidden rounded-xl p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg"
      :class="alert.bgClass"
    >
      <!-- Glassmorphism Overlay -->
      <div class="absolute inset-0 bg-white/40 backdrop-blur-md -z-10"></div>
      
      <!-- Icon Container -->
      <div 
        class="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
        :class="alert.iconBgClass"
      >
        <q-icon :name="alert.icon" size="20px" :class="alert.iconColorClass" />
      </div>

      <!-- Content -->
      <div class="flex-1">
        <div class="flex items-center gap-2">
           <h6 class="text-sm font-bold text-gray-800 tracking-tight">{{ alert.title }}</h6>
           <span class="px-2 py-0.5 rounded-full bg-white/60 text-[9px] font-black uppercase text-gray-500 tracking-wider shadow-sm">Operational</span>
        </div>
        <p class="text-xs text-gray-600 font-medium mt-0.5">{{ alert.message }}</p>
      </div>

      <!-- Quick Action -->
      <q-btn
        flat
        round
        dense
        icon="close"
        size="sm"
        color="grey-7"
        class="hover:bg-black/5"
        @click="$emit('dismiss', alert.id)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "OperationalAlerts",
  data() {
    return {
      dismissedAlerts: [],
    };
  },
  computed: {
    activeAlerts() {
      const alerts = [];
      const now = new Date();
      const day = now.getDay(); // 0 (Sun) to 6 (Sat)

      // Monday (1) or Saturday (6) - Trash Collection
      if (day === 1 || day === 6) {
        alerts.push({
          id: 'trash-collection',
          title: "Trash Collection Day",
          message: "A bi-weekly pickup is scheduled for today. Please ensure all kiosk trash bins are emptied and ready.",
          icon: "recycling",
          iconBgClass: "bg-amber-100",
          iconColorClass: "text-amber-600",
          bgClass: "border border-amber-200/50"
        });
      }

      // Filter out dismissed
      return alerts.filter(a => !this.dismissedAlerts.includes(a.id));
    }
  },
  methods: {
    dismissAlert(id) {
      this.dismissedAlerts.push(id);
    }
  }
};
</script>

<style scoped>
.alert-card {
  z-index: 10;
}

.alert-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: currentColor;
  opacity: 0.5;
}

.bg-amber-100 { background-color: #fef3c7; }
.text-amber-600 { color: #d97706; }
.border-amber-200\/50 { border-color: rgba(253, 230, 138, 0.5); }
</style>
