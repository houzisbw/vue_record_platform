/**
 * Created by Administrator on 2018/9/13.
 */
//用户权限表
var mongoose = require('mongoose')
var authSchema = new mongoose.Schema({
  authCode:String,
  authName:String
})
module.exports = mongoose.model('Auth',authSchema)
