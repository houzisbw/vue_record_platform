/**
 * Created by Administrator on 2018/10/11.
 */
//排班考勤模块-工作内容数据模型
var mongoose = require('mongoose')
var Schema = new mongoose.Schema({
  name:String,
  //所属车间名
  workshop:String,
  group:String
})
module.exports = mongoose.model('Attendance_work_content',Schema)
