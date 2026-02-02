<template>
  <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 h-full flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300">
    <div class="flex justify-between items-start mb-1">
      <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{{ title }}</span>
      <div 
        class="flex items-center justify-center w-7 h-7 rounded-full bg-gray-50 text-gray-400 group-hover:bg-[#82D616] group-hover:text-white transition-colors duration-300"
      >
        <q-icon :name="icon" size="14px" />
      </div>
    </div>

    <div>
      <h3 class="text-xl font-bold text-[#1A1A1A] tracking-tight mb-1">
        {{ formattedValue }}
      </h3>
      
      <div v-if="change || subtitle" class="flex items-center gap-2 text-[10px] leading-tight">
        <span v-if="subtitle" class="text-gray-400 font-medium">{{ subtitle }}</span>
        <span 
          v-if="change" 
          class="px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5"
          :class="changeType === 'positive' ? 'bg-green-50 text-[#82D616]' : 'bg-red-50 text-red-500'"
        >
          {{ change }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardCard",
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    value: { type: [Number, String], default: null },
    icon: { type: String, default: "" },
    iconColor: { type: String, default: "gray" },
    change: { type: String, default: "" },
    changeType: { 
      type: String, 
      default: "neutral",
      validator: (val) => ["positive", "negative", "neutral"].includes(val)
    },
    format: { type: String, default: "number" },
  },
  computed: {
    formattedValue() {
      if (this.value === null || this.value === undefined) return "—";
      if (typeof this.value === "string") return this.value;

      const num = Number(this.value);
      if (isNaN(num)) return this.value;

      if (this.format === "currency") {
        return new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
          minimumFractionDigits: 0,
        }).format(num);
      } 
      if (this.format === "weight") return num.toLocaleString() + " kg";
      if (this.format === "decimal") return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      
      return num.toLocaleString();
    },
  },
};
</script>
