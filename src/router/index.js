import Vue from 'vue'
import Router from 'vue-router'

import Login from './../pages/login/login.vue'
import Home from './../pages/home.vue'
Vue.use(Router)

export default new Router({
  routes: [
    //根路径页面
    {
      path:'/',
      name:'Home',
      component:Home,
      meta:{
        requireAuth:true
      }
    },
    //登录页面,单独的页面
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
