/**
 * Created by Administrator on 2018/9/15.
 */
//记录数据模型
var mongoose = require('mongoose');
var recordSchema = new mongoose.Schema({
  //组名(不同组的记录要区分)
  group:String,
  //车间
  workshop:String,
  //是否重要
  isImportant:String,
  //用户名
  username:String,
  //类型
  type:String,
  //月份
  monthDate:String,
  //是否确认
  isConfirm:String,
  //图片链接
  imageUrl:String,
  //错误说明
  error:String,
  //记录日期
  date:String
});
//这里第一个参数是数据库collection的名字(users)，User=>users，会自动映射
module.exports = mongoose.model('Record',recordSchema)
