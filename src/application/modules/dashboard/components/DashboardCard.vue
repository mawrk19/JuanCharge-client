<template>
  <q-card class="dashboard-card q-pa-none" :class="cardClass">
    <div class="accent-bar" :style="accentBarStyle"></div>
    <q-card-section class="q-pb-none q-pt-md q-px-md">
      <div class="row items-center no-wrap">
        <div class="col-auto icon-bg q-mr-md" v-if="icon">
          <q-icon :name="icon" :color="iconColor" size="32px" />
        </div>
        <div class="col">
          <div class="text-h6 text-weight-bold">{{ title }}</div>
          <div class="text-subtitle2 text-grey-6">{{ subtitle }}</div>
        </div>
      </div>
    </q-card-section>

    <q-card-section v-if="value !== null" class="q-pt-none q-px-md q-pb-md">
      <div class="value-row row items-center no-wrap">
        <div class="dashboard-value text-h3 text-weight-bold" :class="valueClass">{{ formattedValue }}</div>
        <div v-if="change" class="change-indicator q-ml-md" :class="changeClass">
          <q-icon :name="changeIcon" size="18px" class="q-mr-xs" />
          <span>{{ change }}</span>
        </div>
      </div>
    </q-card-section>

    <q-card-section v-if="$slots.default" class="q-pt-none q-px-md q-pb-md">
      <slot></slot>
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
      default: "primary"
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
        'text-positive': this.changeType === 'positive',
        'text-negative': this.changeType === 'negative',
        'text-grey-6': this.changeType === 'neutral',
        'change-pill': true
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
            currency: 'USD'
          }).format(this.value);
        case 'percentage':
          return `${this.value}%`;
        default:
          return new Intl.NumberFormat().format(this.value);
      }
    },
    accentBarStyle() {
      let color = this.iconColor || 'primary';
      if (color.startsWith('#')) return { background: color };
      return { background: `var(--q-color-${color})` };
    }
  }
};
</script>

<style scoped>
.dashboard-card {
  height: 100%;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(40, 60, 90, 0.10), 0 1.5px 4px 0 rgba(40, 60, 90, 0.08);
  transition: box-shadow 0.2s, transform 0.2s;
  position: relative;
  overflow: hidden;
}
.dashboard-card:hover {
  box-shadow: 0 8px 32px 0 rgba(40, 60, 90, 0.16), 0 3px 8px 0 rgba(40, 60, 90, 0.12);
  transform: translateY(-2px) scale(1.012);
}
.dashboard-card-colored {
  color: #fff;
}
.accent-bar {
  height: 5px;
  width: 100%;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  background: var(--q-color-primary);
}
.icon-bg {
  background: rgba(0,0,0,0.04);
  border-radius: 12px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  min-height: 48px;
}
.dashboard-value {
  font-size: 2.2rem;
  line-height: 1.1;
  letter-spacing: -1px;
}
.value-row {
  align-items: flex-end;
}
.change-indicator {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 12px;
  padding: 2px 10px;
  background: rgba(0,0,0,0.04);
  margin-bottom: 2px;
}
.change-pill.text-positive {
  background: rgba(76, 175, 80, 0.12);
  color: #388e3c;
}
.change-pill.text-negative {
  background: rgba(244, 67, 54, 0.12);
  color: #c62828;
}
.change-pill.text-grey-6 {
  background: rgba(120, 144, 156, 0.10);
  color: #607d8b;
}
</style>