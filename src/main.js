// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//poly-fill,用于兼容处理，ie，safari,必须放在第一行
import 'babel-polyfill'

//cdn引入Vue
//import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/normalize.css'
import './assets/iconfont/alibaba/iconfont.css'
import './assets/css/emoji.css'
import axios from './api/http'
import store from './store/index'
import api from './api/api'
import directives from './directives/directives'

//element的组件都在这里引入(cdn引入，因此都注释掉)
// import {
//   Button,
//   Form,
//   FormItem,
//   Input,
//   Checkbox,
//   Message,
//   Tag,
//   Menu,
//   Submenu,
//   MenuItem,
//   Icon,
//   Badge,
//   Dropdown,
//   DropdownMenu,
//   DropdownItem,
//   Dialog,
//   Tabs,
//   TabPane,
//   Loading,
//   Table,
//   TableColumn,
//   Pagination,
//   Select,
//   Option,
//   Breadcrumb,
//   BreadcrumbItem,
//   Tooltip,
//   DatePicker,
//   Switch,
//   Popover,
//   MessageBox,
//   TimeSelect,
//   Radio,
//   RadioGroup,
//   RadioButton,
//   Card,
//   MenuItemGroup,} from 'element-ui';
// Vue.use(Button)
// Vue.use(Form)
// Vue.use(FormItem)
// Vue.use(Input)
// Vue.use(Checkbox)
// Vue.use(Tag)
// Vue.use(Menu);
// Vue.use(Submenu);
// Vue.use(MenuItem);
// Vue.use(MenuItemGroup);
// Vue.use(Icon)
// Vue.use(Badge)
// Vue.use(Dropdown);
// Vue.use(DropdownMenu);
// Vue.use(DropdownItem);
// Vue.use(Tabs);
// Vue.use(TabPane)
// Vue.use(Loading)
// Vue.use(Table)
// Vue.use(TableColumn)
// Vue.use(Pagination)
// Vue.use(Dialog)
// Vue.use(Select)
// Vue.use(Option)
// Vue.use(Breadcrumb)
// Vue.use(BreadcrumbItem)
// Vue.use(Tooltip)
// Vue.use(DatePicker)
// Vue.use(Switch)
// Vue.use(Popover)
// Vue.use(TimeSelect)
// Vue.use(Radio)
// Vue.use(RadioGroup)
// Vue.use(RadioButton)
// Vue.use(Card)
//
// //特殊处理
// Vue.prototype.$message = Message;
// Vue.prototype.$msgbox = MessageBox;

Vue.config.productionTip = false

//刷新页面会触发beforeEach钩子函数,前提是这个必须写在new Vue前面
//初次访问未授权的页面也会触发
//在使用 vue-router 模块时，挂载根实例的步骤要放在最后，不然会导致配置不成功
//这里需要执行异步请求，所以需要加上路由加载时的动画提示用户
router.beforeEach((to,from,next)=>{
  //如果是访问需要登录的页面
  if (to.matched.some(record => record.meta.requireAuth)) {
    //路由进入加载状态(最好做法是给全屏加一个看不见的mask防止乱点)
    store.commit('updateRouterLoading',true);
    //需要发送请求到后台验证用户是否处于登录态
    axios.post(api.checkIsLogin).then((resp)=>{
        if(resp.data.status === 1){
          //处于登录态,继续判断权限是否合理
          let userAuth = resp.data.auth;
          //有权限
          if(to.meta.role.includes(userAuth)){
            next()
          }else{
            //无权限,提示用户
            //cdn引入element后得这样使用message组件,挂载在全局ELEMENT对象下
            ELEMENT.Message({
              type:'error',
              message:'没有权限访问该页面!'
            });
            //跳转为来源路由
            next({
              path:from.path
            })
          }
        }else{
          //登录过期,清除localStorage和vuex
          store.commit('logout');
          //返回登录页面
          next('/login');
        }
        //路由结束加载状态
        store.commit('updateRouterLoading',false);
    },()=>{
      //路由结束加载状态
      store.commit('updateRouterLoading',false);
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
//挂载指令
Vue.directive('auth',directives.auth);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  axios,
  store,
  components: { App },
  template: '<App/>'
})


