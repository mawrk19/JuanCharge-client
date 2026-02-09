import Vue from 'vue'
import Vuex from 'vuex'

import auth from '@/application/modules/auth/store'
import dashboard from '@/application/modules/dashboard/store'
import users from '@/application/modules/users/store'
import kiosks from '@/application/modules/kiosks/store'
import kiosks_user from '@/application/modules/kiosks_user/store'
import patron from '@/application/modules/patron/store'
import lgus from '@/application/modules/lgus/store'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    dashboard,
    users,
    kiosks,
    kiosks_user,
    patron,
    lgus
  }
})
