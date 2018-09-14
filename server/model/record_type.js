//记录类型数据模型
var mongoose = require('mongoose');
var recordTypeSchema = new mongoose.Schema({
  name:String,
  //该记录类型属于哪个组，便于以后扩展
  group:String
});


//这里第一个参数是数据库collection的名字(users)，User=>users，会自动映射
module.exports = mongoose.model('Record_type',recordTypeSchema)
