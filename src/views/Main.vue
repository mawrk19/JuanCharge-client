<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header flat class="bg-transparent text-dark q-pa-md">
      <q-toolbar class="floating-navbar q-px-md">
        <!-- Hamburger Menu Button (Mobile) -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
          class="lt-md q-mr-sm"
        />

        <div class="row items-center no-wrap">
          <q-icon name="bolt" color="green" size="24px" class="q-mr-xs" />
          <div class="text-subtitle1 text-weight-bold gt-xs">JuanCharge</div>
        </div>

        <q-space />

        <div class="row items-center q-gutter-x-sm">
          <!-- Notification Button -->
          <q-btn
            flat
            round
            dense
            icon="notifications"
            class="navbar-btn"
            color="grey-10"
          >
            <q-badge v-if="unreadCount > 0" color="red" floating rounded>{{
              unreadCount
            }}</q-badge>
            <q-menu
              style="max-width: 400px"
              transition-show="jump-down"
              transition-hide="jump-up"
            >
              <q-list
                style="min-width: 350px; max-height: 400px; overflow-y: auto"
              >
                <q-item-label header class="row justify-between items-center">
                  <span class="text-weight-bold">Notifications</span>
                  <q-btn
                    flat
                    dense
                    size="sm"
                    label="Mark all read"
                    @click="markAllAsRead"
                    v-if="unreadCount > 0"
                    color="primary"
                  />
                </q-item-label>

                <q-separator />

                <div
                  v-if="notifications.length === 0"
                  class="q-pa-md text-center text-grey"
                >
                  <q-icon
                    name="notifications_off"
                    size="32px"
                    class="q-mb-sm block"
                  />
                  <div>No notifications</div>
                </div>

                <q-item
                  v-for="notif in notifications"
                  :key="notif.id"
                  clickable
                  v-ripple
                  @click="markAsRead(notif.id)"
                  :class="!notif.read ? 'bg-primary-light' : ''"
                  class="notification-item"
                >
                  <q-item-section avatar>
                    <q-avatar
                      :color="getNotifColor(notif.type)"
                      text-color="white"
                      size="40px"
                    >
                      <q-icon :name="getNotifIcon(notif.type)" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label
                      :class="{ 'text-weight-bold': !notif.read }"
                      >{{ notif.title }}</q-item-label
                    >
                    <q-item-label caption lines="2">{{
                      notif.message
                    }}</q-item-label>
                    <q-item-label caption class="text-xs q-mt-xs">
                      {{ notif.time }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side v-if="!notif.read">
                    <div class="unread-dot"></div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <!-- Account Button -->
          <q-btn
            flat
            round
            dense
            icon="account_circle"
            class="navbar-btn"
            color="grey-10"
          >
            <q-menu transition-show="jump-down" transition-hide="jump-up">
              <q-list style="min-width: 180px" class="q-py-sm">
                <div class="q-px-md q-py-sm">
                  <div class="text-weight-bold">{{ userName }}</div>
                  <div class="text-caption text-grey">{{ roleLabel }}</div>
                </div>
                <q-separator class="q-my-sm" />

                <q-item
                  clickable
                  v-close-popup
                  @click="$router.push('/main/settings')"
                >
                  <q-item-section avatar>
                    <q-icon name="settings" size="20px" />
                  </q-item-section>
                  <q-item-section>Settings</q-item-section>
                </q-item>

                <q-item
                  clickable
                  v-close-popup
                  @click="logout"
                  class="text-negative"
                >
                  <q-item-section avatar>
                    <q-icon name="logout" size="20px" />
                  </q-item-section>
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :mini="false"
      show-if-above
      :breakpoint="1024"
      class="text-dark main-drawer"
      style="background-color: #18392b"
    >
      <q-scroll-area style="height: 100vh; background-color: #18392b">
        <div
          style="
            background-color: #18392b;
            padding: 16px;
            text-align: center;
            color: #18392b;
          "
        >
          <img
            src="/image/logo.png"
            alt="JuanCharge Logo"
            style="width: 140px; height: auto; display: block; margin: 0 auto"
          />
          <h4 class="text-amber-200">JuanCharge</h4>
        </div>

        <q-list style="background-color: #18392b">
          <q-item
            v-if="userType && !isLguUser"
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
            @click="navigateTo('/main/recycling-analytics')"
            class="menu-item"
            :class="{ 'active-menu-item': $route.path === '/main/recycling-analytics' }"
          >
            <q-item-section avatar>
              <q-icon name="recycling" />
            </q-item-section>
            <q-item-section>Recycling Analytics</q-item-section>
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

          <!-- Admin-only sections -->
          <q-item
            v-if="isAdmin"
            clickable
            v-ripple="false"
            @click="navigateTo('/main/lgus')"
            class="menu-item"
            :class="{ 'active-menu-item': $route.path === '/main/lgus' }"
          >
            <q-item-section avatar>
              <q-icon name="business" />
            </q-item-section>
            <q-item-section>LGUs</q-item-section>
          </q-item>

          <q-item
            v-if="isAdmin"
            clickable
            v-ripple="false"
            @click="navigateTo('/main/kiosks-users')"
            class="menu-item"
            :class="{
              'active-menu-item': $route.path === '/main/kiosks-users',
            }"
          >
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>Patrons</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Page content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      leftDrawerOpen: true, // drawer always visible
      notifications: [],
    };
  },
  computed: {
    unreadCount() {
      return this.notifications.filter((n) => !n.read).length;
    },
    isAdmin() {
      return this.$store.getters["auth/isAdmin"];
    },
    isLguUser() {
      return this.$store.getters["auth/isLguUser"];
    },
    userType() {
      // Get user_type from the user object or from the getter
      return (
        this.$store.getters["auth/userType"] ||
        this.$store.state.auth.user?.user_type ||
        null
      );
    },
    userName() {
      return this.$store.state.auth.user?.name || "User";
    },
    roleLabel() {
      if (this.isAdmin) return "Administrator";
      if (this.isLguUser) return "LGU User";
      if (this.userType === 'patron') return "Patron";
      return "User";
    },
  },
  mounted() {
    // Component mounted
  },
  methods: {
    toggleMini() {
      this.miniState = !this.miniState;
    },
    navigateTo(path) {
      // Avoid navigation to the same route
      if (this.$route.path !== path) {
        this.$router.push(path).catch((err) => {
          // Silently catch navigation errors (like duplicate navigation)
          if (err.name !== "NavigationDuplicated") {
            console.error("Navigation error:", err);
          }
        });
      }
    },
    async logout() {
      await this.$store.dispatch("auth/logout");
      // Force reload to clear all in-memory state
      window.location = "/login";
    },
    markAsRead(notifId) {
      const notif = this.notifications.find((n) => n.id === notifId);
      if (notif) {
        notif.read = true;
      }
    },
    markAllAsRead() {
      this.notifications.forEach((n) => (n.read = true));
    },
    getNotifIcon(type) {
      const icons = {
        success: "check_circle",
        warning: "warning",
        info: "info",
        error: "error",
      };
      return icons[type] || "notifications";
    },
    getNotifColor(type) {
      const colors = {
        success: "green",
        warning: "orange",
        info: "blue",
        error: "red",
      };
      return colors[type] || "grey";
    },
  },
};
</script>

<style scoped>
/* Menu Items */
.menu-item {
  margin: 4px 8px;
  padding: 12px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
  color: #e3dddd;
  position: relative;
  cursor: pointer;
}

.menu-item:hover {
  background: #f5f5f5;
  color: #333;
}

.active-menu-item {
  background: #f0f9f0;
  color: #2e7d32;
  font-weight: 500;
  border-left: 3px solid #4caf50;
  padding-left: 13px;
}

.q-drawer .menu-item.active-menu-item .q-item__section {
  color: #2e7d32 !important;
}

.q-drawer .menu-item.active-menu-item .q-icon {
  color: #4caf50 !important;
}

/* Sidebar Drawer */
.main-drawer {
  border-radius: 0;
  border-right: 1px solid #e0e0e0 !important;
  overflow: hidden;
}

/* Clean Navbar */
.floating-navbar {
  background: #ffffff;
  border-radius: 0;
  border: none;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  min-height: 64px;
}

/* Navbar Buttons */
.navbar-btn {
  background: transparent;
  transition: all 0.2s ease;
  border-radius: 8px;
}

.navbar-btn:hover {
  background: #f5f5f5;
  color: #333;
}

/* Notification Items */
.notification-item {
  transition: all 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
  border-radius: 0;
  margin: 0;
  padding: 12px 16px;
}

.notification-item:hover {
  background: #f5f5f5;
}

.bg-primary-light {
  background: #f0f9f0;
  border-left: 3px solid #4caf50;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background: #4caf50;
  border-radius: 50%;
}

/* Drawer Styling */
:deep(.q-drawer) {
  border-radius: 0 !important;
  border-right: 1px solid #e0e0e0 !important;
  background: #ffffff !important;
}

:deep(.q-drawer--left) {
  border-right: 1px solid #e0e0e0 !important;
}

/* Logo Section */
:deep(.q-drawer) h4 {
  color: #2e7d32;
  font-weight: 600;
  letter-spacing: 0;
  margin: 0;
  font-size: 1.1rem;
}

/* Scrollbar Styling */
:deep(.q-scrollarea__thumb) {
  background: rgba(76, 175, 80, 0.3);
  border-radius: 4px;
}

:deep(.q-scrollarea__thumb:hover) {
  background: rgba(76, 175, 80, 0.5);
}

/* Text Colors */
.text-dark {
  color: #333 !important;
}

.text-grey-8 {
  color: #666 !important;
}

.text-grey {
  color: #999 !important;
}
</style>
