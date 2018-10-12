/**
 * Created by Administrator on 2018/10/12.
 */
//排班考勤的公告栏
var mongoose  = require('mongoose')
var announcementSchema = new mongoose.Schema({
  content:String,
  type:String,
});
module.exports = mongoose.model('Attendance_announcement',announcementSchema)
