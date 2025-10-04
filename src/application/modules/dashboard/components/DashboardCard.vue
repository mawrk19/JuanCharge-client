<template>
  <q-card class="dashboard-card q-pa-none" :class="cardClass">
    <div class="card-glow" :style="glowStyle"></div>
    <q-card-section class="q-pa-md">
      <div class="row items-start no-wrap q-mb-md">
        <div class="col-auto icon-container q-mr-md" v-if="icon" :style="iconContainerStyle">
          <q-icon :name="icon" :color="iconColor" size="32px" />
        </div>
        <div class="col">
          <div class="text-caption text-grey-5 text-uppercase" style="letter-spacing: 1px; font-weight: 500;">{{ subtitle }}</div>
          <div class="text-subtitle1 text-white text-weight-bold q-mt-xs">{{ title }}</div>
        </div>
      </div>

      <div v-if="value !== null" class="value-section">
        <div class="dashboard-value text-white text-weight-bold" :class="valueClass">{{ formattedValue }}</div>
        <div v-if="change" class="change-indicator q-mt-sm" :class="changeClass">
          <q-icon :name="changeIcon" size="16px" class="q-mr-xs" />
          <span class="text-caption text-weight-medium">{{ change }}</span>
        </div>
      </div>

      <div v-if="$slots.default" class="q-mt-md">
        <slot></slot>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "DashboardCard",
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ""
    },
    value: {
      type: [Number, String],
      default: null
    },
    icon: {
      type: String,
      default: ""
    },
    iconColor: {
      type: String,
      default: "green"
    },
    change: {
      type: String,
      default: ""
    },
    changeType: {
      type: String,
      default: "neutral", // positive, negative, neutral
      validator: (value) => ["positive", "negative", "neutral"].includes(value)
    },
    format: {
      type: String,
      default: "number" // number, currency, percentage
    },
    color: {
      type: String,
      default: ""
    }
  },
  computed: {
    cardClass() {
      return {
        [`bg-${this.color}`]: this.color,
        'text-white': this.color,
        'dashboard-card-colored': this.color
      };
    },
    valueClass() {
      return {
        'text-white': this.color,
        'text-primary': !this.color
      };
    },
    changeClass() {
      return {
        'change-positive': this.changeType === 'positive',
        'change-negative': this.changeType === 'negative',
        'change-neutral': this.changeType === 'neutral'
      };
    },
    changeIcon() {
      switch (this.changeType) {
        case 'positive':
          return 'trending_up';
        case 'negative':
          return 'trending_down';
        default:
          return 'trending_flat';
      }
    },
    formattedValue() {
      if (this.value === null) return '';
      switch (this.format) {
        case 'currency':
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(this.value);
        case 'percentage':
          return `${this.value}%`;
        default:
          return new Intl.NumberFormat().format(this.value);
      }
    },
    glowStyle() {
      const colors = {
        green: 'rgba(76, 175, 80, 0.15)',
        blue: 'rgba(33, 150, 243, 0.15)',
        orange: 'rgba(255, 152, 0, 0.15)',
        purple: 'rgba(156, 39, 176, 0.15)',
        red: 'rgba(244, 67, 54, 0.15)'
      };
      const color = colors[this.iconColor] || 'rgba(76, 175, 80, 0.15)';
      return { background: `radial-gradient(circle at top left, ${color} 0%, transparent 50%)` };
    },
    iconContainerStyle() {
      const colors = {
        green: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
        blue: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)',
        orange: 'linear-gradient(135deg, #ff9800 0%, #ffa726 100%)',
        purple: 'linear-gradient(135deg, #9c27b0 0%, #ab47bc 100%)',
        red: 'linear-gradient(135deg, #f44336 0%, #ef5350 100%)'
      };
      const gradient = colors[this.iconColor] || colors.green;
      return { 
        background: gradient,
        boxShadow: `0 4px 12px ${this.getColorWithOpacity(this.iconColor, 0.3)}`
      };
    }
  },
  methods: {
    getColorWithOpacity(colorName, opacity) {
      const colors = {
        green: `rgba(76, 175, 80, ${opacity})`,
        blue: `rgba(33, 150, 243, ${opacity})`,
        orange: `rgba(255, 152, 0, ${opacity})`,
        purple: `rgba(156, 39, 176, ${opacity})`,
        red: `rgba(244, 67, 54, ${opacity})`
      };
      return colors[colorName] || colors.green;
    }
  }
};
</script>

<style scoped>
.dashboard-card {
  height: 100%;
  position: relative;
  background: rgba(20, 34, 33, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  z-index: 1;
}

.dashboard-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #4caf50 0%, #66bb6a 50%, #4caf50 100%);
  background-size: 200% 100%;
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.dashboard-card:hover {
  border-color: rgba(76, 175, 80, 0.5);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 30px rgba(76, 175, 80, 0.15);
  transform: translateY(-4px) scale(1.02);
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.icon-container {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.dashboard-card:hover .icon-container {
  transform: scale(1.1) rotate(5deg);
}

.value-section {
  margin-top: 8px;
}

.dashboard-value {
  font-size: 2.25rem;
  line-height: 1.2;
  letter-spacing: -1px;
  font-weight: 700;
}

.change-indicator {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 20px;
  padding: 4px 12px;
  backdrop-filter: blur(10px);
}

.change-positive {
  background: rgba(76, 175, 80, 0.15);
  color: #66bb6a;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.change-negative {
  background: rgba(244, 67, 54, 0.15);
  color: #ef5350;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.change-neutral {
  background: rgba(158, 158, 158, 0.15);
  color: #bdbdbd;
  border: 1px solid rgba(158, 158, 158, 0.3);
}

/* Responsive */
@media (max-width: 600px) {
  .dashboard-value {
    font-size: 1.75rem;
  }
  
  .icon-container {
    width: 48px;
    height: 48px;
  }
  
  .icon-container >>> .q-icon {
    font-size: 28px !important;
  }
}
</style>