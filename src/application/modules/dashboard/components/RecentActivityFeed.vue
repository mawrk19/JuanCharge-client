<template>
  <q-card class="activity-feed-card">
    <q-card-section>
      <div class="text-h6 q-mb-md">
        <q-icon name="history" size="24px" color="green" class="q-mr-sm" />
        Recent Activity
      </div>
      
      <div v-if="loading" class="text-center q-pa-md">
        <q-spinner color="green" size="40px" />
      </div>
      
      <div v-else-if="activities.length === 0" class="text-center q-pa-md text-grey-5">
        <q-icon name="inbox" size="48px" class="q-mb-sm" />
        <div>No recent activity</div>
      </div>
      
      <div v-else class="activity-list">
        <div
          v-for="(activity, index) in activities"
          :key="index"
          class="activity-item"
        >
          <div class="activity-icon" :class="`activity-${activity.type}`">
            <q-icon :name="getActivityIcon(activity.type)" size="20px" />
          </div>
          
          <div class="activity-content">
            <div class="activity-title">{{ activity.title }}</div>
            <div class="activity-description text-grey-6">
              {{ activity.description }}
            </div>
            <div class="activity-time text-grey-7">
              <q-icon name="schedule" size="12px" />
              {{ formatTime(activity.timestamp) }}
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "RecentActivityFeed",
  data() {
    return {
      loading: false,
      // Mock data - will be replaced with real API data
      mockActivities: [
        {
          type: 'charging',
          title: 'Charging Session Completed',
          description: 'User redeemed 50 points for 2.5 kWh',
          timestamp: new Date(Date.now() - 5 * 60000)
        },
        {
          type: 'recyclable',
          title: 'Recyclables Deposited',
          description: '2.5 kg of plastic bottles added',
          timestamp: new Date(Date.now() - 15 * 60000)
        },
        {
          type: 'kiosk',
          title: 'Kiosk Status Change',
          description: 'Downtown Plaza kiosk went online',
          timestamp: new Date(Date.now() - 30 * 60000)
        },
        {
          type: 'charging',
          title: 'Charging Session Started',
          description: 'User started 30-minute charging session',
          timestamp: new Date(Date.now() - 45 * 60000)
        },
        {
          type: 'recyclable',
          title: 'Recyclables Deposited',
          description: '5.2 kg of aluminum cans added',
          timestamp: new Date(Date.now() - 60 * 60000)
        },
        {
          type: 'alert',
          title: 'Low Battery Alert',
          description: 'City Hall kiosk battery at 15%',
          timestamp: new Date(Date.now() - 90 * 60000)
        },
        {
          type: 'kiosk',
          title: 'Maintenance Completed',
          description: 'Train Station kiosk back online',
          timestamp: new Date(Date.now() - 120 * 60000)
        }
      ]
    };
  },
  computed: {
    activities() {
      // TODO: Replace with real data from store
      // return this.$store.state.analytics.recentActivity || [];
      return this.mockActivities;
    }
  },
  methods: {
    getActivityIcon(type) {
      switch (type) {
        case 'charging':
          return 'electric_bolt';
        case 'recyclable':
          return 'recycling';
        case 'kiosk':
          return 'podcasts';
        case 'alert':
          return 'warning';
        case 'user':
          return 'person';
        default:
          return 'circle';
      }
    },
    formatTime(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minutes ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} hours ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      return date.toLocaleDateString();
    }
  },
  async mounted() {
    // TODO: Fetch recent activity from backend
    // try {
    //   await this.$store.dispatch('analytics/fetchRecentActivity');
    // } catch (error) {
    //   console.error('Failed to fetch recent activity:', error);
    // }
  }
};
</script>

<style scoped>
.activity-feed-card {
  background: rgba(20, 34, 33, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  height: 100%;
}

.activity-feed-card:hover {
  border-color: rgba(76, 175, 80, 0.4);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(76, 175, 80, 0.1);
}

.activity-feed-card >>> .text-h6 {
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 4px;
}

.activity-list::-webkit-scrollbar {
  width: 6px;
}

.activity-list::-webkit-scrollbar-track {
  background: rgba(76, 175, 80, 0.1);
  border-radius: 3px;
}

.activity-list::-webkit-scrollbar-thumb {
  background: rgba(76, 175, 80, 0.3);
  border-radius: 3px;
}

.activity-list::-webkit-scrollbar-thumb:hover {
  background: rgba(76, 175, 80, 0.5);
}

.activity-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: rgba(76, 175, 80, 0.05);
  border: 1px solid rgba(76, 175, 80, 0.15);
  border-radius: 10px;
  transition: all 0.2s ease;
}

.activity-item:hover {
  background: rgba(76, 175, 80, 0.1);
  border-color: rgba(76, 175, 80, 0.3);
  transform: translateX(4px);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-charging {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.activity-recyclable {
  background: rgba(76, 175, 80, 0.2);
  color: #66bb6a;
}

.activity-kiosk {
  background: rgba(33, 150, 243, 0.2);
  color: #42a5f5;
}

.activity-alert {
  background: rgba(255, 87, 34, 0.2);
  color: #ff5722;
}

.activity-user {
  background: rgba(156, 39, 176, 0.2);
  color: #ab47bc;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-title {
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.activity-description {
  font-size: 0.8rem;
  margin-bottom: 4px;
  line-height: 1.3;
}

.activity-time {
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
