<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  async created() {
    // Initialize authentication state from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Restore session from localStorage
      this.$store.dispatch('auth/restoreSession');
      
      // Optionally validate token with backend
      // This ensures the token is still valid
      await this.$store.dispatch('auth/validateToken');
    }
  }
}
</script>