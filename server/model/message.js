/**
 * Created by Administrator on 2018/9/27.
 */
//新鲜事的数据模型
var mongoose = require('mongoose');
var messageSchema = new mongoose.Schema({
  //新鲜事id，全局唯一，便于一级评论找到该新鲜事
  messageId:String,
  //新鲜事内容
  content:String,
  //新鲜事图片列表
  imageList:Array,
  //新鲜事点赞数
  likes:Number,
  //新鲜事评论数量
  commentNumber:Number,
  //新鲜事发布时间
  publishTime:String,

  //如果用户修改了个人信息，那么这里面所有的东西都得改,因此只存用户名，其他的数据库查询即可

  //新鲜事用户名
  username:String,

  //新鲜事用户头像
  //profileImgUrl:String,
  //新鲜事用户昵称
  //nickname:String,


  //新鲜事用户组名
  userGroup:String
});

module.exports = mongoose.model('Message',messageSchema)
