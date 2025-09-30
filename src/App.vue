<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  async created() {
    const token = localStorage.getItem('token')
    if (token) {
      this.$store.commit('auth/setToken', token)
      await this.$store.dispatch('auth/fetchUser')
    }
  }
}
</script>