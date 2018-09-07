/**
 * Created by Administrator on 2018/9/6.
 */
//用户数据模型
var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
  username:String,
  password:String,
  //头像url
  profileImgUrl:String,
  //昵称
  nickname:String,
  //签名
  signature:String,
  //权限
  auth:String
});
//这里第一个参数是数据库collection的名字(users)，User=>users，会自动映射
module.exports = mongoose.model('User',userSchema)
