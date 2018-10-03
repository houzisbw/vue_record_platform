/**
 * Created by Administrator on 2018/10/3.
 */
//新鲜事一级评论数据模型
var mongoose = require('mongoose');
var commentSchema = new mongoose.Schema({
  //评论自己的id是利用mongodb的主键实现的，这里不单独实现

  //评论的新鲜事id
  messageId:String,
  //评论文字内容
  content:String,
  //评论的图片列表
  imgList:Array,
  //评论的赞数
  likes:Number,

  /* 存储用户信息是为了防止多次查询db */

  //评论的用户id
  userId:String,
  //评论的用户头像url
  userAvatarUrl:String,
  //评论的用户组别
  userGroup:String,
  //评论的时间
  time:String
});

module.exports = mongoose.model('Message_comment',commentSchema);
