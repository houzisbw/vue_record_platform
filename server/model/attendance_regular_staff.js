/**
 * Created by Administrator on 2018/10/11.
 */
//排班考勤模块-正式人员模型
var mongoose = require('mongoose')
var Schema = new mongoose.Schema({
  name:String,
  group:String
})
module.exports = mongoose.model('Attendance_regularstaff',Schema)
