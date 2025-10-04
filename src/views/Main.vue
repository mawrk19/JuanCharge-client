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
      <q-list style="background-color: #142221; height: 100vh;">
        <q-item clickable v-ripple @click="$router.push('/main/dashboard')" style="background-color: #142221;" >
          <q-item-section avatar>
            <q-icon name="ev_station" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="$router.push('/main/map')">
          <q-item-section avatar>
            <q-icon name="analytics" />
          </q-item-section>
          <q-item-section>Map</q-item-section>
        </q-item>

        <!-- <q-item clickable v-ripple @click="$router.push('/main/settings')">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>Settings</q-item-section>
        </q-item> -->
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
    }
  },
  methods: {
    toggleMini () {
      this.miniState = !this.miniState
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
