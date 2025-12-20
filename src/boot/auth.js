export default async ({ store, router }) => {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      store.commit('auth/SET_TOKEN', token)
      // Optionally validate token with backend if needed
      // await store.dispatch('auth/validateToken')
    }
  } catch (e) {
    // console.error('Auto-restore failed:', e)
    localStorage.removeItem('token')
    store.commit('auth/CLEAR_AUTH')
  }
}
