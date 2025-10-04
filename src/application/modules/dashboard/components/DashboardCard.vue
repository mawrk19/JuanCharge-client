<template>
  <q-card class="dashboard-card q-pa-none" :class="cardClass">
    <div class="accent-bar" :style="accentBarStyle"></div>
    <q-card-section class="q-pb-none q-pt-sm q-px-sm">
      <div class="row items-center no-wrap">
        <div class="col-auto icon-bg q-mr-sm" v-if="icon">
          <q-icon :name="icon" :color="iconColor" size="24px" />
        </div>
        <div class="col">
          <div class="text-subtitle1 text-weight-bold">{{ title }}</div>
          <div class="text-caption text-grey-6">{{ subtitle }}</div>
        </div>
      </div>
    </q-card-section>

    <q-card-section v-if="value !== null" class="q-pt-xs q-px-sm q-pb-sm">
      <div class="value-row row items-center no-wrap">
        <div class="dashboard-value text-h4 text-weight-bold" :class="valueClass">{{ formattedValue }}</div>
        <div v-if="change" class="change-indicator q-ml-sm" :class="changeClass">
          <q-icon :name="changeIcon" size="14px" class="q-mr-xs" />
          <span class="text-caption">{{ change }}</span>
        </div>
      </div>
    </q-card-section>

    <q-card-section v-if="$slots.default" class="q-pt-none q-px-sm q-pb-sm">
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
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(40, 60, 90, 0.08), 0 1px 3px 0 rgba(40, 60, 90, 0.06);
  transition: box-shadow 0.2s, transform 0.2s;
  position: relative;
  overflow: hidden;
}
.dashboard-card:hover {
  box-shadow: 0 4px 16px 0 rgba(40, 60, 90, 0.12), 0 2px 6px 0 rgba(40, 60, 90, 0.08);
  transform: translateY(-1px) scale(1.01);
}
.dashboard-card-colored {
  color: #fff;
}
.accent-bar {
  height: 3px;
  width: 100%;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  background: var(--q-color-primary);
}
.icon-bg {
  background: rgba(0,0,0,0.04);
  border-radius: 8px;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  min-height: 36px;
}
.dashboard-value {
  font-size: 1.75rem;
  line-height: 1.1;
  letter-spacing: -0.5px;
}
.value-row {
  align-items: flex-end;
}
.change-indicator {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 8px;
  padding: 2px 6px;
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