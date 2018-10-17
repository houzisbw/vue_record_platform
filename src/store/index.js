/**
 * Created by Administrator on 2018/9/7.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
//用户模块
import user from './modules/users'
//公用数据模块
import public_params from './modules/public_params'

Vue.use(Vuex)

export default  new Vuex.Store({
  actions,
  getters,
  modules:{
    user,
    public_params
  }
})
