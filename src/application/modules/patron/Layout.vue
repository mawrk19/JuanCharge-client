<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header -->
    <q-header elevated class="patron-header">
      <q-toolbar>
        <q-toolbar-title class="brand-title" @click="goToDashboard">
          <img src="/image/logo.png" alt="JuanCharge Logo" class="navbar-logo" />
        </q-toolbar-title>

        <q-btn
          flat
          round
          dense
          icon="account_circle"
        >
          <q-menu>
            <q-list style="min-width: 150px">
              <q-item clickable v-close-popup @click="viewProfile">
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>Profile</q-item-section>
              </q-item>
              
              <q-separator />
              
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

    <!-- Page Content -->
    <q-page-container>
      <router-view />
      
      <!-- Charging Widget - Shows on all pages when session is active -->
      <charging-widget />
    </q-page-container>
  </q-layout>
</template>

<script>
import ChargingWidget from './components/ChargingWidget.vue';

export default {
  name: "PatronLayout",
  
  components: {
    ChargingWidget
  },

  mounted() {
    // Restore any active session from localStorage on app load
    this.$store.dispatch('patron/restoreSession');
  },

  methods: {
    goToDashboard() {
      this.$router.push('/patron');
    },

    viewProfile() {
      this.$router.push('/patron/profile');
    },
    
    async logout() {
      try {
        await this.$store.dispatch('auth/logout');
        this.$q.notify({
          type: 'positive',
          message: 'Logged out successfully',
          icon: 'check_circle',
          position: 'top'
        });
        this.$router.push('/login');
      } catch (err) {
        // console.error('Logout error:', err);
        this.$q.notify({
          type: 'negative',
          message: 'Logout failed',
          icon: 'error',
          position: 'top'
        });
      }
    }
  }
};
</script>

<style scoped>
.patron-header {
  background: linear-gradient(135deg, #1a4d2e 0%, #2d5f3f 100%);
}

.brand-title {
  cursor: pointer;
  transition: all 0.2s ease;
}

.brand-title:hover {
  opacity: 0.8;
  transform: scale(1.02);
}

.navbar-logo {
  height: 40px;
  width: auto;
  vertical-align: middle;
}
</style>
