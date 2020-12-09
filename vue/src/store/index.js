import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  state:{
    route:[],
    num:0,
    role:{
    }
  },
  modules: {
    app,
    settings,
    user
  },
  mutations:{
    addnum(state,e){
      state.num++
    },
    updaterole(state,e){
      state.role = e
      console.log(e)
    },
    updateroute(state,e){
      state.route.indexOf(e)==-1?state.route.push(e):''
      // console.log(state.route)
    }
  },
  getters
})

export default store
