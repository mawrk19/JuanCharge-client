<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header style="background-color: #142221;" class="text-white">
      <q-toolbar>
        <!-- Hamburger Menu Button (Mobile) -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
          class="lt-md"
        />
        
        <q-space />
        
        <!-- Notification Button -->
        <q-btn flat round dense icon="notifications">
          <q-badge v-if="unreadCount > 0" color="red" floating>{{ unreadCount }}</q-badge>
          <q-menu style="max-width: 400px;">
            <q-list style="min-width: 350px; max-height: 400px; overflow-y: auto;">
              <q-item-label header class="tw-flex tw-justify-between tw-items-center">
                <span>Notifications</span>
                <q-btn 
                  flat 
                  dense 
                  size="sm" 
                  label="Mark all read" 
                  @click="markAllAsRead"
                  v-if="unreadCount > 0"
                />
              </q-item-label>
              
              <q-separator />
              
              <div v-if="notifications.length === 0" class="tw-p-4 tw-text-center tw-opacity-60">
                No notifications
              </div>
              
              <q-item 
                v-for="notif in notifications" 
                :key="notif.id"
                clickable 
                v-ripple
                @click="markAsRead(notif.id)"
                :class="!notif.read ? 'tw-bg-opacity-10' : ''"
                style="border-left: 3px solid;"
                :style="{
                  borderLeftColor: !notif.read ? '#4caf50' : 'transparent',
                  backgroundColor: !notif.read ? 'rgba(76, 175, 80, 0.05)' : 'transparent'
                }"
              >
                <q-item-section avatar>
                  <q-avatar :color="getNotifColor(notif.type)" text-color="white">
                    <q-icon :name="getNotifIcon(notif.type)" />
                  </q-avatar>
                </q-item-section>
                
                <q-item-section>
                  <q-item-label>{{ notif.title }}</q-item-label>
                  <q-item-label caption lines="2">{{ notif.message }}</q-item-label>
                  <q-item-label caption class="tw-text-xs tw-mt-1">
                    {{ notif.time }}
                  </q-item-label>
                </q-item-section>
                
                <q-item-section side v-if="!notif.read">
                  <q-badge color="green" rounded />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        
        <!-- Account Button -->
        <q-btn flat round dense icon="account_circle" class="tw-ml-2">
          <q-menu>
            <q-list style="min-width: 150px">
              <q-item clickable v-close-popup @click="$router.push('/main/settings')">
                <q-item-section avatar>
                  <q-icon name="settings" />
                </q-item-section>
                <q-item-section>Settings</q-item-section>
              </q-item>
              
              <q-item clickable v-close-popup @click="logout">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :mini="false"
      show-if-above
      :breakpoint="1024"
      bordered
      elevated
      style="background-color: #142221;"
      class="text-white"
    >
      <div style="background-color: #142221; padding: 16px; text-align: center;">
        <img src="/image/logo.png" alt="JuanCharge Logo" style="width: 140px; height: auto; display: block; margin: 0 auto;" />
        <h4>JuanCharge</h4>
      </div>

      <q-list style="background-color: #142221; height: 100vh;">
        <q-item 
          clickable 
          v-ripple="false" 
          @click="navigateTo('/main/dashboard')" 
          class="menu-item" 
          :class="{ 'active-menu-item': $route.path === '/main/dashboard' }"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item 
          clickable 
          v-ripple="false" 
          @click="navigateTo('/main/map')" 
          class="menu-item" 
          :class="{ 'active-menu-item': $route.path === '/main/map' }"
        >
          <q-item-section avatar>
            <q-icon name="analytics" />
          </q-item-section>
          <q-item-section>Map</q-item-section>
        </q-item>

        <q-item 
          clickable 
          v-ripple="false" 
          @click="navigateTo('/main/users')" 
          class="menu-item" 
          :class="{ 'active-menu-item': $route.path === '/main/users' }"
        >
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>LGU Users</q-item-section>
        </q-item>

        <q-item 
          clickable 
          v-ripple="false" 
          @click="navigateTo('/main/kiosks')" 
          class="menu-item" 
          :class="{ 'active-menu-item': $route.path === '/main/kiosks' }"
        >
          <q-item-section avatar>
            <q-icon name="ev_station" />
          </q-item-section>
          <q-item-section>Kiosks</q-item-section>
        </q-item>

        <!-- Admin-only Patrons section -->
        <q-item 
          v-if="isAdmin"
          clickable 
          v-ripple="false" 
          @click="navigateTo('/main/kiosks-users')" 
          class="menu-item" 
          :class="{ 'active-menu-item': $route.path === '/main/kiosks-users' }"
        >
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>Patrons</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Page content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data () {
    return {
      leftDrawerOpen: true,  // drawer always visible
      notifications: [
        {
          id: 1,
          type: 'success',
          title: 'Charging Complete',
          message: 'Your vehicle charging session at SM Mall Station has completed successfully.',
          time: '5 minutes ago',
          read: false
        },
        {
          id: 2,
          type: 'warning',
          title: 'Low Battery Alert',
          message: 'Your vehicle battery is at 15%. Find a nearby charging station.',
          time: '1 hour ago',
          read: false
        },
        {
          id: 3,
          type: 'info',
          title: 'New Station Available',
          message: 'A new charging station has opened near your location in Makati.',
          time: '3 hours ago',
          read: false
        },
        {
          id: 4,
          type: 'error',
          title: 'Payment Failed',
          message: 'Your payment for the last charging session could not be processed.',
          time: '1 day ago',
          read: true
        },
        {
          id: 5,
          type: 'success',
          title: 'Reservation Confirmed',
          message: 'Your charging slot at BGC Station is reserved for 3:00 PM today.',
          time: '2 days ago',
          read: true
        }
      ]
    }
  },
  computed: {
    unreadCount() {
      return this.notifications.filter(n => !n.read).length;
    },
    isAdmin() {
      return this.$store.getters['auth/isAdmin'];
    },
    userType() {
      // Get user_type from the user object or from the getter
      return this.$store.getters['auth/userType'] || this.$store.state.auth.user?.user_type || 'admin';
    },
    userName() {
      return this.$store.state.auth.user?.name || 'User';
    }
  },
  mounted() {
    // Component mounted
  },
  methods: {
    toggleMini () {
      this.miniState = !this.miniState
    },
    navigateTo(path) {
      // Avoid navigation to the same route
      if (this.$route.path !== path) {
        this.$router.push(path).catch(err => {
          // Silently catch navigation errors (like duplicate navigation)
          if (err.name !== 'NavigationDuplicated') {
            console.error('Navigation error:', err);
          }
        });
      }
    },
    async logout() {
      await this.$store.dispatch('auth/logout');
      // Force reload to clear all in-memory state
      window.location = '/login';
    },
    markAsRead(notifId) {
      const notif = this.notifications.find(n => n.id === notifId);
      if (notif) {
        notif.read = true;
      }
    },
    markAllAsRead() {
      this.notifications.forEach(n => n.read = true);
    },
    getNotifIcon(type) {
      const icons = {
        success: 'check_circle',
        warning: 'warning',
        info: 'info',
        error: 'error'
      };
      return icons[type] || 'notifications';
    },
    getNotifColor(type) {
      const colors = {
        success: 'green',
        warning: 'orange',
        info: 'blue',
        error: 'red'
      };
      return colors[type] || 'grey';
    }
  }
}
</script>

<style scoped>
.menu-item {
  padding: 8px;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.7);
}

.menu-item:hover {
  background: rgba(56, 255, 62, 0.1);
  color: #ffffff;
}

.active-menu-item {
  background: rgba(44, 163, 48, 0.241);
  color: #ffffff;
  font-weight: 600;
}
/* Make active drawer item label and icon blue, with a subtle active background */
.q-drawer .q-item.q-item--active .q-item__section {
  color: #ffffff !important; /* blue - adjust as needed */
}
.q-drawer .q-item.q-item--active .q-icon {
  color: #ffffff !important;
}
/* Optional: subtle background for the active item to improve contrast */
.q-drawer .q-item.q-item--active {
  background-color: rgba(255, 255, 255, 0.1) !important;
}
</style>
