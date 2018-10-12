import Vue from 'vue'
import Router from 'vue-router'

import Login from './../pages/login/login.vue'
import Home from './../pages/home.vue'
import PersonalSetting from './../pages/personalSetting/personalSetting.vue'
import PersonalCenter from './../pages/personlCenter/PersonalCenter.vue'
import Records from './../pages/records/Records.vue'
import QueryRecords from './../pages/records/QueryRecords.vue'
import Announcement from './../pages/Announcement/Announcement.vue'
import ModifyAnnouncement from './../pages/Announcement/ModifyAnnouncement.vue'
import GroupSetting from './../pages/groupSetting/GroupSetting.vue'
import ModifyUser from './../pages/ModifyUser/ModifyUser.vue'
import AddWorkShop from './../pages/AddWorkShop/AddWorkShop.vue'
import AddRecordType from './../pages/AddRecordType/AddRecordType.vue'
import SearchRecord from '../pages/SearchRecord/SearchRecord.vue'
import AddRecord from '../pages/AddRecord/AddRecord.vue'
import RecordGraph from '../pages/RecordGraph/RecordGraph.vue'
import MessageBoard from '../pages/MessageBoard/MessageBoard.vue'
import MessageRecommend from '../components/MessageSubView/Recommend.vue'
import MessageSuscribe from '../components/MessageSubView/Subscribe.vue'

import AttendanceWrapper from '@/pages/Attendance/AttendanceWrapper'
import AttendanceSheet from '@/pages/Attendance/AttendanceSheet'
import AttendancePanel from '@/pages/Attendance/AttendanceConfigPanel'
import ShiftArrangement from '@/pages/Attendance/ShiftArrangement'

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
      redirect:'/announcement',
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
        //个人中心页面
        {
          path:'personal_center',
          name:'PersonalCenter',
          component:PersonalCenter,
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
        //公告页面
        {
          path:'modify_announcement',
          name:'ModifyAnnouncement',
          component:ModifyAnnouncement,
          meta:{
            //超管可以访问
            role:[userAuth.SUPER_ADMIN]
          },
        },
        //修改公告页面
        {
          path:'announcement',
          name:'Announcement',
          component:Announcement,
          meta:{
            //所有人都可以访问
            role:authAll
          },
        },
        //组名修改页面
        {
          path:'group_setting',
          name:'GroupSetting',
          component:GroupSetting,
          meta:{
            //超管可以访问
            role:[userAuth.SUPER_ADMIN]
          },
        },
        //修改用户页面
        {
          path:'modify_user',
          name:'ModifyUser',
          component:ModifyUser,
          meta:{
            //超管可以访问
            role:[userAuth.SUPER_ADMIN]
          },
        },
        //添加车间
        {
          path:'add_workshop',
          name:'AddWorkShop',
          component:AddWorkShop,
          meta:{
            //超管可以访问
            role:[userAuth.SUPER_ADMIN]
          },
        },
        //添加记录类型
        {
          path:'add_recordtype',
          name:'AddRecordType',
          component:AddRecordType,
          meta:{
            //超管可以访问
            role:[userAuth.SUPER_ADMIN]
          },
        },
        //查询记录页面
        {
          path:'search_record',
          name:'SearchRecord',
          component:SearchRecord,
          meta:{
            //都可以访问
            role:authAll
          },
        },
        //添加记录页面
        {
          path:'add_record',
          name:'AddRecord',
          component:AddRecord,
          meta:{
            //超管访问
            role:[userAuth.SUPER_ADMIN]
          },
        },
        //统计图表页面
        {
          path:'record_graph',
          name:'RecordGraph',
          component:RecordGraph,
          meta:{
            //所有人可访问
            role:authAll
          },
        },
        //留言板页面
        {
          path:'message',
          name:'MessageBoard',
          component:MessageBoard,
          redirect:'/message/subscribe',
          meta:{
            //所有人可访问
            role:authAll
          },
          children:[
            {
              path:'recommend',
              component:MessageRecommend,
              meta:{
                //所有人可访问
                role:authAll
              }
            },
            {
              path:'subscribe',
              component:MessageSuscribe,
              meta:{
                //所有人可访问
                role:authAll
              }
            },
          ]
        },
        //考勤页面
        {
          path:'attendance',
          name:'Attendance',
          component:AttendanceWrapper,
          redirect:'/attendance/sheet',
          meta:{
            //所有人可访问
            role:authAll
          },
          children:[
            {
              path:'sheet',
              component:AttendanceSheet,
              meta:{
                //所有人可访问
                role:authAll
              }
            },
            {
              path:'config',
              component:AttendancePanel,
              meta:{
                //超管可访问
                role:[userAuth.SUPER_ADMIN]
              }
            },
            {
              path:'shift_arrangement',
              component:ShiftArrangement,
              meta:{
                //超管可访问
                role:[userAuth.SUPER_ADMIN]
              }
            },
          ]
        }
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
