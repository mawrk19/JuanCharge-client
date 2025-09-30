<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleMini" />
        <q-icon name="ev_station" size="sm" class="q-ml-sm q-mr-sm" />
        <q-toolbar-title>JuanCharge</q-toolbar-title>
        <q-btn flat round dense icon="account_circle" />
      </q-toolbar>
    </q-header>

    <!-- Mini-mode Drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      :mini="miniState"
      show-if-above
      bordered
      @mouseover="miniState = false"
      @mouseout="miniState = true"
    >
      <q-list>
        <q-item clickable v-ripple @click="$router.push('/main/dashboard')" :class="{ 'bg-primary text-white': $route.path.includes('dashboard') }">
          <q-item-section avatar>
            <q-icon name="ev_station" />
          </q-item-section>
          <q-item-section v-if="!miniState">Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="$router.push('/main/stations')">
          <q-item-section avatar>
            <q-icon name="place" />
          </q-item-section>
          <q-item-section v-if="!miniState">Stations</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="$router.push('/main/analytics')">
          <q-item-section avatar>
            <q-icon name="analytics" />
          </q-item-section>
          <q-item-section v-if="!miniState">Analytics</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="$router.push('/main/settings')">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section v-if="!miniState">Settings</q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <q-item clickable v-ripple @click="logout">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section v-if="!miniState">Logout</q-item-section>
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
      leftDrawerOpen: true,  // drawer visible by default
      miniState: true        // start in mini mode
    }
  },
  methods: {
    toggleMini () {
      this.miniState = !this.miniState
    },
    logout() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  }
}
</script>
