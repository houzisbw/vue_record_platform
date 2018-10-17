/**
 * Created by Administrator on 2018/10/16.
 */
//公共数据的modules

//状态
const state = {
  //是否处于路由加载中
  isRouterLoading:false
}

//getters
const getters = {
  getIsRouterLoading:(state)=>{
    return state.isRouterLoading
  }
}

const mutations = {
  updateRouterLoading:(state,isLoading)=>{
    state.isRouterLoading = isLoading;
  }
}

const actions = {

}

export default {
  //命名空间模块，不添加是全局的，其他模块也可以用,true时store无法commit本模块的mutation
  //namespaced:true,
  state,
  getters,
  actions,
  mutations
}
