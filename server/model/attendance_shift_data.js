/**
 * Created by Administrator on 2018/10/11.
 */
//排班考勤的数据模型
var mongoose = require('mongoose')
var Schema = new mongoose.Schema({
  //排班日期
  date:String,
  //排班车间
  workshop:String,
  //排班工序
  process:String,
  //排班班次
  shift:String,
  //排班起始时间
  startTime:String,
  //排班结束时间
  endTime:String,
  //排班正式员工数组
  regularStaffList:Array,
  //排班临时员工数组
  tempStaffList:Array,
  //工作内容
  workContent:String,
  //组别
  group:String
});
module.exports = mongoose.model('Attendance_shift_data',Schema)
