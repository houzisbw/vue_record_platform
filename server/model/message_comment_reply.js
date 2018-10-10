/**
 * Created by Administrator on 2018/10/3.
 */
//新鲜事评论的回复表数据结构
var mongoose = require('mongoose');
var replySchema = new mongoose.Schema({
  //回复的id是利用mongodb的主键实现的，这里不单独实现

  //新鲜事的id(便于删除该回复)
  messageId:String,
  //评论的id(主键)
  commentId:String,
  //回复的目标id(如果是针对评论的回复，则为评论id，如果是回复的回复，则为回复的id)
  replyId:String,
  //回复的类型:1为针对评论的回复，2为回复的回复
  replyType:Number,
  //回复的文本内容
  replyText:String,
  //回复的图片数组
  replyImgList:Array,
  //回复的赞数
  likes:Number,
  //回复的时间
  time:String,

  /* 回复用户的相关信息 */

  //注释的信息通过db查询
  //回复用户的组别
  //fromUserGroup:String,
  //回复的用户头像url
  //fromUserAvatar:String,
  //昵称
  //fromUserNickname:String,

  //回复的用户名
  fromUserId:String,
  //回复的目标用户id
  toUserId:String
});

module.exports = mongoose.model('Message_comment_reply',replySchema);
