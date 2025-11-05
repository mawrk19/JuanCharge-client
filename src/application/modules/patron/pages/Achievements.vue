<template>
  <q-page class="achievements-page q-pa-md">
    <!-- Page Header -->
    <!-- <div class="page-header q-mb-lg">
      <div class="text-h4 text-white text-weight-bold">
        <q-icon name="emoji_events" color="amber" size="40px" class="q-mr-md" />
        Achievements & Leaderboard
      </div>
      <div class="text-subtitle1 text-grey-5 q-mt-sm">
        Track your progress and compete with the community
      </div>
    </div> -->

    <!-- Community Leaderboard Section -->
    <q-card class="leaderboard-card q-mb-lg">
      <q-card-section>
        <div class="text-h6 text-white q-mb-md">
          <q-icon name="emoji_events" color="amber" size="24px" class="q-mr-sm" />
          Community Leaderboard
        </div>

        <!-- Top 3 Podium -->
        <div class="podium-container q-mb-xl">
          <!-- 2nd Place -->
          <div class="podium-item podium-second">
            <div class="podium-card">
              <q-avatar size="80px" class="podium-avatar">
                <img :src="leaderboard[1]?.avatar || `https://cdn.quasar.dev/img/avatar2.jpg`" />
              </q-avatar>
              <div class="podium-rank silver">
                <q-icon name="emoji_events" size="20px" />
                <span class="rank-number">2</span>
              </div>
              <div class="podium-name text-white text-weight-bold q-mt-sm">{{ leaderboard[1]?.name }}</div>
              <div class="podium-points text-grey-5">{{ leaderboard[1]?.points }} pts</div>
              <div class="podium-charges text-grey-6 text-caption">
                <q-icon name="ev_station" size="12px" />
                {{ leaderboard[1]?.chargesCount }} charges
              </div>
            </div>
            <div class="podium-base podium-base-second">
              <div class="podium-height-label">#2</div>
            </div>
          </div>

          <!-- 1st Place -->
          <div class="podium-item podium-first">
            <div class="podium-card">
              <q-avatar size="100px" class="podium-avatar">
                <img :src="leaderboard[0]?.avatar || `https://cdn.quasar.dev/img/avatar1.jpg`" />
                <q-icon name="emoji_events" color="amber" size="32px" class="crown-icon" />
              </q-avatar>
              <div class="podium-rank gold">
                <q-icon name="emoji_events" size="24px" />
                <span class="rank-number">1</span>
              </div>
              <div class="podium-name text-white text-weight-bold q-mt-sm">{{ leaderboard[0]?.name }}</div>
              <div class="podium-points text-amber text-weight-bold">{{ leaderboard[0]?.points }} pts</div>
              <div class="podium-charges text-grey-6 text-caption">
                <q-icon name="ev_station" size="12px" />
                {{ leaderboard[0]?.chargesCount }} charges
              </div>
            </div>
            <div class="podium-base podium-base-first">
              <div class="podium-height-label">#1</div>
            </div>
          </div>

          <!-- 3rd Place -->
          <div class="podium-item podium-third">
            <div class="podium-card">
              <q-avatar size="70px" class="podium-avatar">
                <img :src="leaderboard[2]?.avatar || `https://cdn.quasar.dev/img/avatar3.jpg`" />
              </q-avatar>
              <div class="podium-rank bronze">
                <q-icon name="emoji_events" size="18px" />
                <span class="rank-number">3</span>
              </div>
              <div class="podium-name text-white text-weight-bold q-mt-sm">{{ leaderboard[2]?.name }}</div>
              <div class="podium-points text-grey-5">{{ leaderboard[2]?.points }} pts</div>
              <div class="podium-charges text-grey-6 text-caption">
                <q-icon name="ev_station" size="12px" />
                {{ leaderboard[2]?.chargesCount }} charges
              </div>
            </div>
            <div class="podium-base podium-base-third">
              <div class="podium-height-label">#3</div>
            </div>
          </div>
        </div>

        <!-- Remaining Users List (4-8) -->
        <div class="remaining-users">
          <div class="text-subtitle2 text-grey-5 q-mb-md">Rest of the Leaderboard</div>
          <q-list class="leaderboard-list-compact">
            <q-item 
              v-for="(user, index) in leaderboard.slice(3)" 
              :key="user.id"
              class="leaderboard-item-compact q-mb-sm"
              :class="{ 'current-user': user.isCurrentUser }"
            >
              <q-item-section avatar>
                <q-avatar size="50px">
                  <img :src="user.avatar || `https://cdn.quasar.dev/img/avatar${index + 4}.jpg`" />
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
                <div class="text-h6 text-white">#{{ index + 4 }}</div>
                <div class="text-caption text-green text-weight-bold">{{ user.points }} pts</div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>
    </q-card>

    <!-- Achievements Section (Bottom) -->
    <q-card class="achievements-card">
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
      </q-card-section>
    </q-card>
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
      // console.log('Loading achievements and leaderboard...');
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

/* Leaderboard Card */
.leaderboard-card {
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 12px;
}

/* Podium Container */
.podium-container {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 12px;
  padding: 40px 0;
  margin-top: 20px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.podium-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

/* Podium Cards */
.podium-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 12px;
  background: rgba(40, 40, 40, 0.8);
  border-radius: 12px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  min-width: 140px;
}

.podium-first .podium-card {
  border-color: rgba(255, 193, 7, 0.6);
  background: rgba(255, 193, 7, 0.1);
  box-shadow: 0 8px 24px rgba(255, 193, 7, 0.3);
}

.podium-second .podium-card {
  border-color: rgba(189, 189, 189, 0.6);
  background: rgba(189, 189, 189, 0.08);
}

.podium-third .podium-card {
  border-color: rgba(205, 127, 50, 0.6);
  background: rgba(205, 127, 50, 0.08);
}

.podium-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(76, 175, 80, 0.3);
}

/* Podium Avatar */
.podium-avatar {
  position: relative;
  border: 3px solid;
}

.podium-first .podium-avatar {
  border-color: #ffc107;
  box-shadow: 0 0 20px rgba(255, 193, 7, 0.5);
}

.podium-second .podium-avatar {
  border-color: #bdbdbd;
}

.podium-third .podium-avatar {
  border-color: #cd7f32;
}

/* Crown Icon for 1st Place */
.crown-icon {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  filter: drop-shadow(0 2px 8px rgba(255, 193, 7, 0.6));
}

/* Podium Rank Badge */
.podium-rank {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 20px;
  margin-top: 12px;
  font-weight: bold;
  font-size: 16px;
}

.podium-rank.gold {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #000;
}

.podium-rank.silver {
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
  color: #000;
}

.podium-rank.bronze {
  background: linear-gradient(135deg, #cd7f32, #e8a76f);
  color: #000;
}

.rank-number {
  font-weight: 900;
}

/* Podium Info */
.podium-name {
  font-size: 16px;
  text-align: center;
  margin-top: 8px;
}

.podium-points {
  font-size: 18px;
  font-weight: bold;
  margin-top: 4px;
}

.podium-charges {
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Podium Base (Stage) */
.podium-base {
  width: 140px;
  background: linear-gradient(to bottom, rgba(76, 175, 80, 0.3), rgba(76, 175, 80, 0.1));
  border: 2px solid rgba(76, 175, 80, 0.4);
  border-top: none;
  border-radius: 0 0 8px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.podium-base-first {
  height: 120px;
  background: linear-gradient(to bottom, rgba(255, 193, 7, 0.3), rgba(255, 193, 7, 0.1));
  border-color: rgba(255, 193, 7, 0.5);
}

.podium-base-second {
  height: 90px;
  background: linear-gradient(to bottom, rgba(189, 189, 189, 0.3), rgba(189, 189, 189, 0.1));
  border-color: rgba(189, 189, 189, 0.5);
}

.podium-base-third {
  height: 70px;
  background: linear-gradient(to bottom, rgba(205, 127, 50, 0.3), rgba(205, 127, 50, 0.1));
  border-color: rgba(205, 127, 50, 0.5);
}

.podium-height-label {
  font-size: 32px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.3);
}

/* Podium Size Variations */
.podium-first {
  order: 2;
}

.podium-second {
  order: 1;
}

.podium-third {
  order: 3;
}

/* Remaining Users List */
.remaining-users {
  margin-top: 20px;
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

/* Achievements Section */
.achievements-card {
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 12px;
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

/* Responsive */
@media (max-width: 768px) {
  .podium-container {
    gap: 12px;
    padding: 20px 10px;
  }
  
  .podium-card {
    padding: 12px;
  }
  
  .podium-first .podium-avatar {
    width: 70px !important;
    height: 70px !important;
    font-size: 28px !important;
  }
  
  .podium-second .podium-avatar,
  .podium-third .podium-avatar {
    width: 60px !important;
    height: 60px !important;
    font-size: 24px !important;
  }
  
  .podium-base {
    width: 100px;
  }
  
  .podium-base-first {
    height: 80px;
  }
  
  .podium-base-second {
    height: 60px;
  }
  
  .podium-base-third {
    height: 50px;
  }
  
  .podium-name {
    font-size: 13px;
  }
  
  .podium-points {
    font-size: 14px;
  }
}
</style>
