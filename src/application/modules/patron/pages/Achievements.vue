<template>
  <q-page class="achievements-page q-pa-md">
    <!-- Page Header -->
    <div class="page-header q-mb-lg">
      <div class="text-h4 text-white text-weight-bold">
        <q-icon name="emoji_events" color="amber" size="40px" class="q-mr-md" />
        Achievements & Leaderboard
      </div>
      <div class="text-subtitle1 text-grey-5 q-mt-sm">
        Track your progress and compete with the community
      </div>
    </div>

    <!-- Achievements and Leaderboard Section -->
    <div class="row q-col-gutter-md">
      <!-- Achievements Section (Left Side - 3 columns) -->
      <div class="col-12 col-md-5">
        <q-card class="achievements-card full-height">
          <q-card-section>
            <div class="text-h6 text-white q-mb-md">
              <q-icon name="military_tech" color="amber" size="24px" class="q-mr-sm" />
              Your Achievements
            </div>

            <div class="text-subtitle2 text-grey-5 q-mb-sm">
              {{ unlockedCount }}/{{ allAchievements.length }} Unlocked
            </div>

            <q-linear-progress 
              :value="unlockedCount / allAchievements.length" 
              color="amber"
              size="12px"
              rounded
              class="q-mb-md"
            />

            <q-scroll-area style="height: calc(100vh - 350px); min-height: 500px;">
              <div class="achievement-list">
                <div 
                  v-for="achievement in allAchievements" 
                  :key="achievement.id"
                  class="achievement-item-compact q-mb-sm"
                  :class="{ 'unlocked': achievement.unlocked }"
                >
                  <q-card 
                    class="achievement-detail-card-compact"
                    @click="showAchievementDetails(achievement)"
                  >
                    <q-card-section class="row items-center q-pa-sm">
                      <q-avatar size="50px" :color="achievement.unlocked ? achievement.color : 'grey-8'">
                        <q-icon :name="achievement.icon" size="24px" color="white" />
                      </q-avatar>
                      
                      <div class="col q-ml-sm">
                        <div class="text-subtitle2 text-white text-weight-bold">{{ achievement.name }}</div>
                        <div class="text-caption text-grey-5">{{ achievement.description }}</div>
                        
                        <div v-if="!achievement.unlocked" class="q-mt-xs">
                          <q-linear-progress 
                            :value="achievement.progressPercent / 100" 
                            :color="achievement.color"
                            size="4px"
                            rounded
                          />
                          <div class="text-caption text-grey-6 q-mt-xs">{{ achievement.progress }}</div>
                        </div>
                        
                        <div v-else class="q-mt-xs">
                          <q-badge color="green" outline size="xs">
                            <q-icon name="check" size="12px" class="q-mr-xs" />
                            Unlocked
                          </q-badge>
                        </div>
                      </div>
                      
                      <div class="text-caption text-amber">+{{ achievement.points }}</div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </q-scroll-area>
          </q-card-section>
        </q-card>
      </div>

      <!-- Community Leaderboard Section (Right Side - 2 columns) -->
      <div class="col-12 col-md-7">
        <q-card class="leaderboard-card full-height">
          <q-card-section>
            <div class="text-h6 text-white q-mb-md">
              <q-icon name="emoji_events" color="amber" size="24px" class="q-mr-sm" />
              Community Leaderboard
            </div>

            <q-scroll-area style="height: calc(100vh - 350px); min-height: 500px;">
              <q-list class="leaderboard-list-compact">
                <q-item 
                  v-for="(user, index) in leaderboard" 
                  :key="user.id"
                  class="leaderboard-item-compact q-mb-sm"
                  :class="{ 'current-user': user.isCurrentUser, 'top-three': index < 3 }"
                >
                  <q-item-section avatar>
                    <q-avatar size="50px">
                      <img :src="user.avatar || `https://cdn.quasar.dev/img/avatar${index + 1}.jpg`" />
                      <q-badge 
                        v-if="index < 3" 
                        :color="index === 0 ? 'amber' : index === 1 ? 'grey-7' : 'orange'" 
                        floating
                      >
                        <q-icon v-if="index === 0" name="emoji_events" size="14px" />
                        <span v-else>{{ index + 1 }}</span>
                      </q-badge>
                    </q-avatar>
                  </q-item-section>
                  
                  <q-item-section>
                    <q-item-label class="text-white text-weight-bold">
                      {{ user.name }}
                      <q-badge v-if="user.isCurrentUser" color="green" outline class="q-ml-sm">You</q-badge>
                    </q-item-label>
                    <q-item-label caption class="text-grey-5">
                      <q-icon name="ev_station" size="14px" class="q-mr-xs" />
                      {{ user.chargesCount }} charges completed
                    </q-item-label>
                  </q-item-section>
                  
                  <q-item-section side>
                    <div class="text-h6 text-white">#{{ index + 1 }}</div>
                    <div class="text-caption text-green text-weight-bold">{{ user.points }} pts</div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-scroll-area>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "PatronAchievements",
  data() {
    return {
      leaderboard: [
        { id: 1, name: 'Maria Santos', points: 2450, chargesCount: 38, avatar: null, isCurrentUser: false },
        { id: 2, name: 'Juan Dela Cruz', points: 2280, chargesCount: 35, avatar: null, isCurrentUser: false },
        { id: 3, name: 'Ana Reyes', points: 1950, chargesCount: 29, avatar: null, isCurrentUser: false },
        { id: 4, name: 'Pedro Garcia', points: 1820, chargesCount: 27, avatar: null, isCurrentUser: false },
        { id: 5, name: 'Carlos Lopez', points: 1630, chargesCount: 24, avatar: null, isCurrentUser: true },
        { id: 6, name: 'Sofia Martinez', points: 1480, chargesCount: 22, avatar: null, isCurrentUser: false },
        { id: 7, name: 'Diego Ramos', points: 1250, chargesCount: 18, avatar: null, isCurrentUser: false },
        { id: 8, name: 'Elena Cruz', points: 1120, chargesCount: 16, avatar: null, isCurrentUser: false },
      ],
      allAchievements: [
        { 
          id: 1, 
          name: 'Account Created', 
          description: 'Welcome to JuanCharge!', 
          icon: 'account_circle',
          color: 'blue',
          unlocked: true,
          points: 5,
          progress: '',
          progressPercent: 100,
          unlockedDate: 'Oct 15, 2024'
        },
        { 
          id: 2, 
          name: 'First Charge', 
          description: 'Complete your first charging session', 
          icon: 'bolt',
          color: 'green',
          unlocked: true,
          points: 10,
          progress: '',
          progressPercent: 100,
          unlockedDate: 'Oct 18, 2024'
        },
        { 
          id: 3, 
          name: '10 Charges', 
          description: 'Complete 10 charging sessions', 
          icon: 'battery_charging_full',
          color: 'purple',
          unlocked: false,
          points: 25,
          progress: '6/10 charges',
          progressPercent: 60,
          unlockedDate: null
        },
        { 
          id: 4, 
          name: '50 Charges', 
          description: 'Complete 50 charging sessions', 
          icon: 'electric_bolt',
          color: 'deep-purple',
          unlocked: false,
          points: 100,
          progress: '6/50 charges',
          progressPercent: 12,
          unlockedDate: null
        },
        { 
          id: 5, 
          name: 'Eco Warrior', 
          description: 'Charge 500 kWh of clean energy', 
          icon: 'eco',
          color: 'teal',
          unlocked: false,
          points: 50,
          progress: '120/500 kWh',
          progressPercent: 24,
          unlockedDate: null
        },
        { 
          id: 6, 
          name: 'Green Champion', 
          description: 'Charge 2000 kWh of clean energy', 
          icon: 'forest',
          color: 'light-green',
          unlocked: false,
          points: 200,
          progress: '120/2000 kWh',
          progressPercent: 6,
          unlockedDate: null
        },
        { 
          id: 7, 
          name: 'Point Collector', 
          description: 'Earn 500 reward points', 
          icon: 'stars',
          color: 'amber',
          unlocked: false,
          points: 75,
          progress: '150/500 points',
          progressPercent: 30,
          unlockedDate: null
        },
        { 
          id: 8, 
          name: 'Early Bird', 
          description: 'Charge 5 times before 8 AM', 
          icon: 'wb_sunny',
          color: 'orange',
          unlocked: false,
          points: 20,
          progress: '0/5 charges',
          progressPercent: 0,
          unlockedDate: null
        },
        { 
          id: 9, 
          name: 'Night Owl', 
          description: 'Charge 5 times after 10 PM', 
          icon: 'nights_stay',
          color: 'indigo',
          unlocked: false,
          points: 20,
          progress: '0/5 charges',
          progressPercent: 0,
          unlockedDate: null
        },
        { 
          id: 10, 
          name: 'Station Explorer', 
          description: 'Use 5 different charging stations', 
          icon: 'explore',
          color: 'cyan',
          unlocked: false,
          points: 30,
          progress: '2/5 stations',
          progressPercent: 40,
          unlockedDate: null
        },
      ]
    };
  },
  computed: {
    unlockedCount() {
      return this.allAchievements.filter(a => a.unlocked).length;
    }
  },
  methods: {
    showAchievementDetails(achievement) {
      this.$q.notify({
        type: achievement.unlocked ? 'positive' : 'info',
        message: achievement.name,
        caption: achievement.unlocked 
          ? `Unlocked ${achievement.unlockedDate} • +${achievement.points} points`
          : `Progress: ${achievement.progress}`,
        icon: achievement.icon,
        timeout: 2000,
        position: 'top'
      });
    },
    loadData() {
      // TODO: Load achievements and leaderboard from API
      console.log('Loading achievements and leaderboard...');
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style scoped>
.achievements-page {
  background: linear-gradient(135deg, #0a0f0d 0%, #142221 50%, #1a2c28 100%);
  min-height: calc(100vh - 50px);
}

.page-header {
  padding: 1rem 0;
}

/* Achievements Section - Inline */
.achievements-card {
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 12px;
}

.achievements-card .full-height {
  height: 100%;
}

.achievement-item-compact {
  transition: all 0.3s ease;
}

.achievement-item-compact.unlocked .achievement-detail-card-compact {
  border-color: rgba(76, 175, 80, 0.4);
  background: rgba(40, 40, 40, 0.9);
}

.achievement-detail-card-compact {
  background: rgba(30, 30, 30, 0.8);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.achievement-detail-card-compact:hover {
  background: rgba(40, 40, 40, 0.95);
  border-color: rgba(76, 175, 80, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

/* Leaderboard Section - Inline */
.leaderboard-card {
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 12px;
}

.leaderboard-card .full-height {
  height: 100%;
}

.leaderboard-list-compact {
  padding: 0;
}

.leaderboard-item-compact {
  background: rgba(40, 40, 40, 0.6);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 8px;
  padding: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.leaderboard-item-compact:hover {
  background: rgba(50, 50, 50, 0.8);
  border-color: rgba(76, 175, 80, 0.4);
  transform: translateX(4px);
}

.leaderboard-item-compact.current-user {
  background: rgba(76, 175, 80, 0.15);
  border-color: #4caf50;
  box-shadow: 0 0 15px rgba(76, 175, 80, 0.3);
}

.leaderboard-item-compact.top-three {
  border-width: 2px;
}

.leaderboard-item-compact.top-three:nth-child(1) {
  border-color: rgba(255, 193, 7, 0.6);
  background: rgba(255, 193, 7, 0.08);
}

.leaderboard-item-compact.top-three:nth-child(2) {
  border-color: rgba(158, 158, 158, 0.6);
  background: rgba(158, 158, 158, 0.08);
}

.leaderboard-item-compact.top-three:nth-child(3) {
  border-color: rgba(255, 152, 0, 0.6);
  background: rgba(255, 152, 0, 0.08);
}
</style>
