/**
 * Created by Administrator on 2018/10/11.
 */
//排班考勤模块-工序数据模型
var mongoose = require('mongoose')
var Schema = new mongoose.Schema({
  name:String,
  group:String
})
module.exports = mongoose.model('Attendance_work_process',Schema)
