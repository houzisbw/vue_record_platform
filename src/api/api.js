/**
 * Created by Administrator on 2018/9/6.
 */
//全部api
import axios from './http'
export default {
  /* 登录api */
  login:'/users/login',
  /* 退出登录 */
  logout:'/users/logout',
  /* 检查是否处于登录状态 */
  checkIsLogin:'/users/checkIsLogin',
  /* 更新个人信息 */
  updateUserInfo:'/users/updateUserInfo',
  /* 获取用户基本信息 */
  fetchUserInfo:'/users/fetchUserInfo'
}
