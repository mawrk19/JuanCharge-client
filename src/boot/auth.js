export default async ({ store, router }) => {
  try {
    // try to restore session from localStorage
    const token = localStorage.getItem('token')
    if (token) {
      store.commit('auth/setToken', token)
      await store.dispatch('auth/fetchUser') // validate token with backend
    }
  } catch (e) {
    console.error('Auto-restore failed:', e)
    // if invalid token, clear it
    localStorage.removeItem('token')
    store.commit('auth/clearSession')
  }
}
