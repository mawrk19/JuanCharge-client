<template>
  <q-page class="patron-page q-pa-lg">
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <!-- Page Header -->
    <div class="page-header q-mb-lg">
      <div class="text-h4 text-white text-weight-bold q-mb-xs">
        Welcome, {{ userName }}!
      </div>
      <div class="text-subtitle1 text-grey-5">
        Your charging dashboard
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card">
          <q-card-section>
            <div class="row items-center">
              <q-avatar size="48px" color="green" text-color="white">
                <q-icon name="stars" />
              </q-avatar>
              <div class="col q-ml-md">
                <div class="text-h5 text-white text-weight-bold">{{ patronPoints }}</div>
                <div class="text-caption text-grey-5">Total Points</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card">
          <q-card-section>
            <div class="row items-center">
              <q-avatar size="48px" color="blue" text-color="white">
                <q-icon name="ev_station" />
              </q-avatar>
              <div class="col q-ml-md">
                <div class="text-h5 text-white text-weight-bold">{{ totalCharges }}</div>
                <div class="text-caption text-grey-5">Total Charges</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card">
          <q-card-section>
            <div class="row items-center">
              <q-avatar size="48px" color="orange" text-color="white">
                <q-icon name="flash_on" />
              </q-avatar>
              <div class="col q-ml-md">
                <div class="text-h5 text-white text-weight-bold">{{ totalEnergy }} kWh</div>
                <div class="text-caption text-grey-5">Energy Used</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card">
          <q-card-section>
            <div class="row items-center">
              <q-avatar size="48px" color="purple" text-color="white">
                <q-icon name="eco" />
              </q-avatar>
              <div class="col q-ml-md">
                <div class="text-h5 text-white text-weight-bold">{{ co2Saved }} kg</div>
                <div class="text-caption text-grey-5">CO₂ Saved</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Recent Charging Sessions -->
    <q-card class="table-card q-mb-lg">
      <q-card-section>
        <div class="text-h6 text-white q-mb-md">Recent Charging Sessions</div>
        <q-table
          :data="chargingSessions"
          :columns="sessionColumns"
          row-key="id"
          :pagination.sync="pagination"
          bordered
          class="modern-table"
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge 
                :color="props.row.status === 'completed' ? 'green' : props.row.status === 'in-progress' ? 'orange' : 'red'"
                :label="props.row.status"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-points="props">
            <q-td :props="props">
              <q-badge color="purple" outline>
                +{{ props.row.points }} pts
              </q-badge>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Quick Actions -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-6">
        <q-card class="action-card" @click="goToMap">
          <q-card-section>
            <div class="row items-center">
              <q-avatar size="56px" color="green" text-color="white">
                <q-icon name="map" size="32px" />
              </q-avatar>
              <div class="col q-ml-md">
                <div class="text-h6 text-white">Find Charging Stations</div>
                <div class="text-caption text-grey-5">Locate nearby charging stations on the map</div>
              </div>
              <q-icon name="chevron_right" color="grey-5" size="24px" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card class="action-card" @click="goToAchievements">
          <q-card-section>
            <div class="row items-center">
              <q-avatar size="56px" color="amber" text-color="white">
                <q-icon name="emoji_events" size="32px" />
              </q-avatar>
              <div class="col q-ml-md">
                <div class="text-h6 text-white">Achievements & Leaderboard</div>
                <div class="text-caption text-grey-5">View your achievements and compete with others</div>
              </div>
              <q-icon name="chevron_right" color="grey-5" size="24px" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Achievements Section OLD - REMOVE -->
    <q-card class="achievements-card q-mb-lg" style="display: none;">
      <q-card-section>
        <div class="row items-center justify-between q-mb-md">
          <div class="text-h6 text-white">Your Achievements</div>
          <q-btn
            flat
            dense
            color="green"
            label="View All"
            @click="showAchievementsDrawer = true"
          />
        </div>
        
        <div class="row q-col-gutter-sm">
          <div 
            v-for="achievement in recentAchievements" 
            :key="achievement.id"
            class="col-6 col-sm-4 col-md-3"
          >
            <q-card 
              class="achievement-badge"
              :class="{ 'unlocked': achievement.unlocked }"
              @click="showAchievementDetails(achievement)"
            >
              <q-card-section class="text-center q-pa-sm">
                <q-icon 
                  :name="achievement.icon" 
                  size="40px" 
                  :color="achievement.unlocked ? achievement.color : 'grey-6'"
                />
                <div class="text-caption text-white q-mt-xs">{{ achievement.name }}</div>
                <div v-if="!achievement.unlocked" class="text-caption text-grey-6">
                  {{ achievement.progress }}
                </div>
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
  name: "PatronIndex",
  data() {
    return {
      patronPoints: 0,
      totalCharges: 0,
      totalEnergy: 0,
      co2Saved: 0,
      
      pagination: {
        rowsPerPage: 10
      },

      sessionColumns: [
        {
          name: 'date',
          label: 'Date',
          field: 'date',
          align: 'left',
          sortable: true
        },
        {
          name: 'station',
          label: 'Station',
          field: 'station',
          align: 'left',
          sortable: true
        },
        {
          name: 'duration',
          label: 'Duration',
          field: 'duration',
          align: 'left',
          sortable: true
        },
        {
          name: 'energy',
          label: 'Energy (kWh)',
          field: 'energy',
          align: 'left',
          sortable: true
        },
        {
          name: 'cost',
          label: 'Cost',
          field: 'cost',
          align: 'left',
          sortable: true
        },
        {
          name: 'points',
          label: 'Points Earned',
          field: 'points',
          align: 'left',
          sortable: true
        },
        {
          name: 'status',
          label: 'Status',
          field: 'status',
          align: 'center',
          sortable: true
        }
      ],

      chargingSessions: [
        {
          id: 1,
          date: '2025-11-05 14:30',
          station: 'SM Mall of Asia',
          duration: '45 min',
          energy: 25.5,
          cost: '₱318.75',
          points: 25,
          status: 'completed'
        },
        {
          id: 2,
          date: '2025-11-03 10:15',
          station: 'BGC Central Square',
          duration: '1h 20min',
          energy: 42.0,
          cost: '₱630.00',
          points: 42,
          status: 'completed'
        }
      ],

      // Removed leaderboard, recentAchievements, and allAchievements data
      // These are now in the dedicated Achievements page
    };
  },

  computed: {
    userName() {
      const user = this.$store.state.auth?.user;
      if (user?.first_name && user?.last_name) {
        return `${user.first_name} ${user.last_name}`;
      }
      return user?.email?.split('@')[0] || 'Patron';
    }
  },

  mounted() {
    this.loadPatronData();
  },

  methods: {
    async loadPatronData() {
      // TODO: Fetch actual patron data from API
      // For now, using mock data
      this.patronPoints = 150;
      this.totalCharges = 24;
      this.totalEnergy = 520;
      this.totalSpent = 7845;
    },

    goToMap() {
      this.$router.push('/patron/map');
    },

    goToAchievements() {
      this.$router.push('/patron/achievements');
    },

    viewProfile() {
      this.$router.push('/patron/profile');
    }
  }
};
</script>

<style scoped>
.patron-page {
  background: linear-gradient(135deg, #0a0f0d 0%, #142221 50%, #1a2c28 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* Animated Background Blobs */
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.2;
  animation: float 25s infinite ease-in-out;
}

.blob-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  top: -250px;
  right: -250px;
  animation-delay: 0s;
}

.blob-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
  bottom: -200px;
  left: -200px;
  animation-delay: 8s;
}

.blob-3 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #66bb6a 0%, #81c784 100%);
  top: 40%;
  left: 50%;
  animation-delay: 16s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(50px, -80px) scale(1.15);
  }
  66% {
    transform: translate(-30px, 50px) scale(0.9);
  }
}

.page-header {
  position: relative;
  z-index: 1;
  padding: 24px;
  background: rgba(20, 34, 33, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.stat-card,
.action-card {
  position: relative;
  z-index: 1;
  background: rgba(20, 34, 33, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stat-card:hover,
.action-card:hover {
  border-color: rgba(76, 175, 80, 0.5);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(76, 175, 80, 0.2);
}

.action-card {
  cursor: pointer;
}

.table-card {
  position: relative;
  z-index: 1;
  background: rgba(20, 34, 33, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modern-table {
  background: transparent;
}

.modern-table >>> thead tr {
  background: rgba(76, 175, 80, 0.15);
}

.modern-table >>> thead th {
  color: #4caf50;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 1px;
  border: 1px solid rgba(76, 175, 80, 0.3);
  padding: 16px;
  background: rgba(20, 34, 33, 0.8);
}

.modern-table >>> tbody tr {
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(76, 175, 80, 0.2);
}

.modern-table >>> tbody tr:hover {
  background: rgba(76, 175, 80, 0.1);
}

.modern-table >>> tbody td {
  color: rgba(255, 255, 255, 0.95);
  padding: 12px;
  font-size: 0.9rem;
}

/* Achievements Card */
.achievements-card {
  position: relative;
  z-index: 1;
  background: rgba(20, 34, 33, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.achievement-badge {
  background: rgba(30, 30, 30, 0.8);
  border: 2px solid rgba(76, 175, 80, 0.2);
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.achievement-badge:hover {
  transform: translateY(-4px);
  border-color: rgba(76, 175, 80, 0.5);
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.3);
}

.achievement-badge.unlocked {
  border-color: rgba(76, 175, 80, 0.6);
  background: rgba(40, 40, 40, 0.9);
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

/* Old Styles - Keep for backwards compatibility but mark as deprecated */
/* Leaderboard Dialog - DEPRECATED */
.leaderboard-dialog {
  background: linear-gradient(135deg, #0a0f0d 0%, #142221 50%, #1a2c28 100%);
}

.podium-container {
  padding: 2rem;
}

.leaderboard-list {
  background: rgba(20, 34, 33, 0.5);
  border-radius: 12px;
}

.leaderboard-item {
  background: rgba(30, 30, 30, 0.6);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.leaderboard-item:hover {
  background: rgba(40, 40, 40, 0.8);
  border-color: rgba(76, 175, 80, 0.4);
  transform: translateX(4px);
}

.leaderboard-item.current-user {
  background: rgba(76, 175, 80, 0.15);
  border-color: #4caf50;
  box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
}

/* Achievements Drawer - DEPRECATED */
.achievements-drawer {
  background: linear-gradient(135deg, #0a0f0d 0%, #142221 50%, #1a2c28 100%);
}

.achievement-detail-card {
  background: rgba(30, 30, 30, 0.8);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.achievement-detail-card:hover {
  border-color: rgba(76, 175, 80, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
}

.achievement-item.unlocked .achievement-detail-card {
  border-color: rgba(76, 175, 80, 0.5);
}
</style>
