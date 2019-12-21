//记录类型数据模型
var mongoose = require('mongoose');
var kpiSchema = new mongoose.Schema({
  //该记录类型属于哪个组，便于以后扩展
  group:String,
  staffName:String,
  date:String,
  kpiType:String,
  kpiValue:Number,
  comment:String
});


//这里第一个参数是数据库collection的名字(users)，User=>users，会自动映射
module.exports = mongoose.model('Kpi',kpiSchema)
