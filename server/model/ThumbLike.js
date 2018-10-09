/**
 * Created by Administrator on 2018/10/1.
 */
//用户点赞的数据表
var mongoose = require('mongoose');
var ThumbLikeSchema = new mongoose.Schema({
  //新鲜事或者评论或者回复的id
  typeId:String,
  //点赞类型:1新鲜事，2评论，3二级评论(回复)
  type:Number,
  //点赞用户id
  userId:String,
});
module.exports = mongoose.model('Thumb_like',ThumbLikeSchema);
