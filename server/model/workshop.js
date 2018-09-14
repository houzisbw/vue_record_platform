/**
 * Created by Administrator on 2018/9/14.
 */
//车间数据模型
var mongoose = require('mongoose');
var workshopSchema = new mongoose.Schema({
  name:String,
  //该车间属于哪个组，便于以后扩展
  group:String
});
//这里第一个参数是数据库collection的名字(users)，User=>users，会自动映射
module.exports = mongoose.model('Workshop',workshopSchema)
