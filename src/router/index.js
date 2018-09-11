import Vue from 'vue'
import Router from 'vue-router'

import Login from './../pages/login/login.vue'
import Home from './../pages/home.vue'
import PersonalSetting from './../pages/personalSetting/personalSetting.vue'

import Records from './../pages/records/Records.vue'
import QueryRecords from './../pages/records/QueryRecords.vue'

import config from './../config/config'
//用户权限
let userAuth = config.auth;
//所有权限
let authAll = [userAuth.SUPER_ADMIN,userAuth.ADMIN,userAuth.ORDINARY_USER]
Vue.use(Router)

export default new Router({
  routes: [
    //根路径页面
    {
      path:'/',
      name:'Home',
      component:Home,
      redirect:'/record/query_records',
      meta:{
        requireAuth:true,
        //所有人都可以访问
        role:authAll
      },
      children:[
        //个人设置页面
        {
          path:'personal_setting',
          name:'PersonalSetting',
          component:PersonalSetting,
          meta:{
            //所有人都可以访问
            role:authAll
          }
        },
        //记录相关页面
        {
          path:'record',
          name:'Record',
          meta:{
            requireAuth:true
          },
          component:Records,
          //重定向到查询页面，禁止访问/record路径
          redirect:'/record/query_records',
          children:[
            //查询记录页面
            {
              path:'query_records',
              name:'QueryRecords',
              component:QueryRecords,
              meta:{
                //所有人都可以访问
                role:authAll
              }
            }
          ]
        },
      ]
    },
    //登录页面,单独的页面
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta:{
        //所有人都可以访问
        role:authAll
      }
    },
    //404页面,直接重定向,注意放在最后
    {
      path: "*",
      redirect: "/"
    }
  ]
})
