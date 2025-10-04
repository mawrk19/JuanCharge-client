<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  async created() {
    // Clear any existing localStorage auth data and cache data to ensure session-based behavior
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear all cache: prefixed items from localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('cache:')) {
        localStorage.removeItem(key);
      }
    });
    
    // Only check sessionStorage for session-based auth
    const token = sessionStorage.getItem('token')
    if (token) {
      this.$store.commit('auth/SET_TOKEN', token)
    }
  }
}
</script>