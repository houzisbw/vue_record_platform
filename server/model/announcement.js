/**
 * Created by Administrator on 2018/9/12.
 */
//公告内容
var mongoose  = require('mongoose')
var announcementSchema = new mongoose.Schema({
  content:String
});
module.exports = mongoose.model('announcement',announcementSchema)
