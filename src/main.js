import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueApexCharts from 'vue-apexcharts'

import Quasar, {
  QLayout,
  QHeader,
  QDrawer,
  QPageContainer,
  QPage,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QCard,
  QCardSection,
  QCardActions,
  QInput,
  QSeparator,
  QSpace,
  QAvatar,
  QBadge,
  QTooltip,
  QMenu,
  QScrollArea,
  Notify,
  Loading
} from 'quasar'
import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'

// Import Tailwind CSS
import './assets/css/tailwind.css'

Vue.use(Quasar, {
  components: {
    QLayout,
    QHeader,
    QDrawer,
    QPageContainer,
    QPage,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QCard,
    QCardSection,
    QCardActions,
    QInput,
    QSeparator,
    QSpace,
    QAvatar,
    QBadge,
    QTooltip,
    QMenu,
    QScrollArea
  },
  directives: {},
  plugins: {
    Notify,
    Loading
  }
})

Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')