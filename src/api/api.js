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
  deleteRecordType:'/modifyRecordTypes/deleteRecordType',

  //记录查询页面相关api
  fetchDropdownInfo:'/searchRecord/getDropdownInfo',
  searchRecords:'/searchRecord/searchRecords',
  removeRecords:'/searchRecord/removeRecords',
  fetchModifyDialogData:'/searchRecord/fetchModifyDialogData',
  modifyRecords:'/searchRecord/modifyRecords',
  currentMonthRecordsCount:'/searchRecord/getRecordsCount',
  ordinaryUserConfirm:'/searchRecord/ordinaryUserConfirm',

  //添加记录页面api
  addRecordData:'/searchRecord/addNewRecord',

  //图表页面
  getGraphYearList:'/graph/getYearList',
  searchGraphRecord:'/graph/searchGraphRecord',
  getLatestYearRecord:'/graph/getLatestYearRecord',

  //留言版块页面
  fetchEmotionList:'/message/getEmotionList',
  saveMessage:'/message/saveMessage', //发布新鲜事
  getSubscribeMessage:'/message/getSubscribeMessage',//获取订阅的新鲜事
  toggleThumbLike:'/message/toggleThumbLike',//用户点赞操作
  saveMessageComment:'/message/saveMessageComment',//保存用户评论
  fetchMessageComment:'/message/fetchMessageComment',//获取用户评论
  saveCommentReply:'/message/saveCommentReply',//保存评论的回复
  fetchReplyOfComment:'/message/fetchReplyOfComment',//获取评论的回复
  deleteReply:'/message/deleteReply',//删除评论的回复
  fetchUserLikedList:'/message/fetchUserLikedList',//获取用户赞过的回复列表
  deleteComment:'/message/deleteComment',//删除评论
  deleteMessage:'/message/deleteMessage',//删除新鲜事

  //排班考勤页面
  processFetchApi:'/attendance/processFetchApi',//工序的拉取数据的api
  processAddApi:'/attendance/processAddApi',//工序的添加数据的api
  processDeleteApi:'/attendance/processDeleteApi',//工序删除数据的api

  shiftFetchApi:'/attendance/shiftFetchApi',//班次的拉取数据的api
  shiftAddApi:'/attendance/shiftAddApi',//班次的添加数据的api
  shiftDeleteApi:'/attendance/shiftDeleteApi',//班次删除数据的api

  tempstaffFetchApi:'/attendance/tempstaffFetchApi',//临时人员的拉取数据的api
  tempstaffAddApi:'/attendance/tempstaffAddApi',//临时人员的添加数据的api
  tempstaffDeleteApi:'/attendance/tempstaffDeleteApi',//临时人员删除数据的api

  regularstaffFetchApi:'/attendance/regularstaffFetchApi',//正式人员的拉取数据的api
  regularstaffAddApi:'/attendance/regularstaffAddApi',//正式人员的添加数据的api
  regularstaffDeleteApi:'/attendance/regularstaffDeleteApi',//正式人员删除数据的api

  workContentFetchApi:'/attendance/workContentFetchApi',//工作内容的拉取数据的api
  workContentAddApi:'/attendance/workContentAddApi',//工作内容的添加数据的api
  workContentDeleteApi:'/attendance/workContentDeleteApi',//工作内容删除数据的api
  workContentFetchWorkshop:'/attendance/workContentFetchWorkshop',//工作内容拉取车间以及对应工作内容条目数

  fetchAttendanceAnnounce:'/attendance/fetchAttendanceAnnounce',//获取考勤安排公告栏内容
  updateAttendanceAnnounce:'/attendance/updateAttendanceAnnounce',//更新公告栏内容

  fetchAttendanceArrangeDropdown:'/attendance/fetchAttendanceArrangeDropdown',//获考勤操作编辑界面的下拉数据
  fetchAttendanceArrangeWorkContent:'/attendance/fetchAttendanceArrangeWorkContent',//拉取车间对应的工作内容
  submitAttendanceArrange:'/attendance/submitAttendanceArrange',//提交排班考勤数据



}
