/**
 * Created by Administrator on 2018/9/11.
 */
//组别信息
var mongoose  = require('mongoose')
var groupSchema = new mongoose.Schema({
  groupName:String,
  groupCode:String
})
module.exports = mongoose.model('group',groupSchema)
