import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueApexCharts from 'vue-apexcharts'

import Quasar from 'quasar'
import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'

// Import Tailwind CSS
import './assets/css/tailwind.css'

// Install Quasar with all components
Vue.use(Quasar, {
  config: {}
})

Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

Vue.config.productionTip = false

// Restore session from localStorage before mounting the app
store.dispatch('auth/restoreSession');

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')