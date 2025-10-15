import Vue from 'vue'
import Vuex from 'vuex'

import auth from '@/application/modules/auth/store'
import dashboard from '@/application/modules/dashboard/store'
import users from '@/application/modules/users/store'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    dashboard,
    users
  }
})
