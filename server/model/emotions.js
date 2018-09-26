/**
 * Created by Administrator on 2018/9/26.
 */
//表情数据模型
//用户权限表
var mongoose = require('mongoose')
var emotionSchema = new mongoose.Schema({
  emotionName:String
});
module.exports = mongoose.model('Emotion',emotionSchema)
