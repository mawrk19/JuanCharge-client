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
      this.$store.commit('auth/SET_TOKEN', token)
      // fetchUser action does not exist, so skip it
    }
  }
}
</script>