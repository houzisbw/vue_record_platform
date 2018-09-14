/**
 * Created by Administrator on 2018/9/6.
 */
//全部api
import axios from './http'
export default {
  //登录相关api
  /* 登录api */
  login:'/users/login',
  /* 退出登录 */
  logout:'/users/logout',
  /* 检查是否处于登录状态 */
  checkIsLogin:'/users/checkIsLogin',


  //个人中心相关api
  /* 更新个人信息 */
  updateUserInfo:'/users/updateUserInfo',
  /* 获取用户基本信息 */
  fetchUserInfo:'/users/fetchUserInfo',
  /* 更新用户头像url */
  updateUserAvatar:'/users/updateUserAvatar',
  /* 图床网站 */
  pictureBedSite:'https://sm.ms/api/upload',


  //公告页面相关api
  /* 获取公告信息 */
  fetchAnnouncement:'/users/getAnnouncement',
  /* 提交公告信息 */
  submitAnnouncement:'/users/submitAnnouncement',

  //组别相关api
  /* 获取用户组别 */
  fetchGroup:'/users/getGroup',

  //添加/删除用户相关api
  /* 获取用户用户名，密码，权限 */
  fetchUserCredentialInfo:'/modifyUser/getUserCredentialInfo',
  /* 获取用户权限列表 */
  fetchUserAuthList:'/modifyUser/fetchUserAuthList',
  /* 修改用户信息 */
  modifyUserInfo:'/modifyUser/modifyUserInfo',
  /* 添加新用户 */
  addUser:'/modifyUser/addUser',
  /* 删除用户 */
  deleteUser:'/modifyUser/deleteUser',

  //添加/删除车间相关api
  fetchWorkshopList:'/modifyWorkshop/getWorkshopList',
  addWorkshop:'/modifyWorkshop/addWorkshop',
  deleteWorkshop:'/modifyWorkshop/deleteWorkshop',

  //添加/删除记录类型相关api
  fetchRecordTypesList:'/modifyRecordTypes/getRecordTypesList',
  addRecordType:'/modifyRecordTypes/addRecordType',
  deleteRecordType:'/modifyRecordTypes/deleteRecordType'
}
