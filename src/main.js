// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//poly-fill,用于兼容处理，ie，safari,必须放在第一行
import 'babel-polyfill'

import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/normalize.css'
import axios from './api/http'
import store from './store/index'
import api from './api/api'

//element的组件都在这里引入
import {
  Button,
  Form,
  FormItem,
  Input,
  Checkbox,
  Message,
  Tag,
  Menu,
  Submenu,
  MenuItem,
  Icon,
  Badge,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Tabs,
  TabPane,
  MenuItemGroup,} from 'element-ui';
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(Tag)
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Icon)
Vue.use(Badge)
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Tabs);
Vue.use(TabPane)
//特殊处理
Vue.prototype.$message = Message

Vue.config.productionTip = false

//刷新页面会触发beforeEach钩子函数,前提是这个必须写在new Vue前面
//初次访问未授权的页面也会触发
//在使用 vue-router 模块时，挂载根实例的步骤要放在最后，不然会导致配置不成功
router.beforeEach((to,from,next)=>{
  //如果是访问需要登录的页面
  if (to.matched.some(record => record.meta.requireAuth)) {
    //需要发送请求到后台验证用户是否处于登录态
    axios.post(api.checkIsLogin).then((resp)=>{
        if(resp.data.status === 1){
          //处于登录态
          next()
        }else{
          //登录过期,清除localStorage和vuex
          store.commit('logout');
          //返回登录页面
          next('/login');
        }
    },()=>{
      //返回登录页面
      next('/login')
    });
  }else{
    //如果登录成功后再返回登录页则跳转到首页
    if(to.name === 'Login'){
      let isLogin = window.localStorage.getItem('auth');
      if(isLogin){
        //已登录则跳转首页
        next('/')
      }else{
        //跳转登录页
        next()
      }
    }else{
      next()
    }
  }
})
// 将axios挂载到prototype上，在组件中可以直接使用this.axios访问,不用再import了
Vue.prototype.axios = axios;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  axios,
  store,
  components: { App },
  template: '<App/>'
})


