/**
 * Created by Administrator on 2018/9/26.
 */
var express = require('express');
var router = express.Router();
var Emotion = require('./../model/emotions')
var Message = require('./../model/message')
var ThumbLike = require('./../model/ThumbLike')
//返回状态码
var returnedCodes = require('./../config').returnedCodes;
var likeType = require('./../config').likeType;

//获取表情名数组
router.get('/getEmotionList',function(req,res){
  Emotion.find({},function(err,docs){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      let total = docs.length;
      let ret = docs.map((item)=>{return item.emotionName});
      res.json({
        status:returnedCodes.CODE_SUCCESS,
        emotions:ret,
        total:total
      })
    }
  })
});

//保存新鲜事
router.post('/saveMessage',function(req,res){
  let data = req.body.data;
  //计算当前时间
  let timeNow = (+new Date()).toString();
  //6位随机值
  let randStr = '';
  for(let i=0;i<6;i++){
    randStr+=Math.floor(Math.random()*10);
  }
  //唯一id
  let uniqueId = timeNow+randStr;
  data.messageId = uniqueId;
  data.publishTime = timeNow;
  //保存
  let message = new Message(data);
  message.save();
  res.json({
    status:returnedCodes.CODE_SUCCESS
  })
});

//获取本组所有人的新鲜事
router.post('/getSubscribeMessage',function(req,res){
  let group = req.group,
      user = req.user;
  let condition = {
    userGroup:group,
    //后期加上数量限制
  };
  Message.find(condition,function(err,docs){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      let ret = docs;
      //时间由大到小排列
      ret.sort(function(a,b){
        return parseInt(b.publishTime,10) - parseInt(a.publishTime,10)
      });

      //获取该用户赞过的新鲜事的列表
      let likedMessageList = [];
      ThumbLike.find({userId:user,type:likeType.MESSAGE},function(err1,docs1){
        if(err1){
          res.json({
            status:returnedCodes.CODE_ERROR
          })
        }else{
          docs1.forEach((item)=>{
            likedMessageList.push(item.typeId)
          });
          res.json({
            status:returnedCodes.CODE_SUCCESS,
            messageList:ret,
            likedList:likedMessageList
          })
        }
      });
    }
  })
});

//用户点赞处理
router.post('/toggleThumbLike',function(req,res){
  let username = req.user;
  let likeTargetId = req.body.likeTargetId;
  let type = req.body.type;
  //搜索条件
  let likeCondition = {
    typeId:likeTargetId,
    type:type,
    userId:username
  };

  //策略类，处理不同类型的点赞操作
  let strategy = {
    //新鲜事
    '1':function(likeNum){
      let condition = {
        messageId:likeTargetId
      };
      Message.findOne(condition,function(err,doc){
        if(err) {
          res.json({
            status: returnedCodes.CODE_ERROR
          })
        }else{
          //如果该新鲜事存在(判断不能少)
          if(doc){
            if(likeNum === 1){
              //用户未点赞，增加点赞记录
              let like = new ThumbLike(likeCondition);
              like.save();
            }
            doc.likes = doc.likes + likeNum;
            doc.save();
            res.json({
              status:returnedCodes.CODE_SUCCESS,
              likeNum:doc.likes,
              likeStatus:likeNum
            })
          }else{
            //如果该新鲜事已删除
            res.json({
              status:returnedCodes.CODE_ERROR,
              message:'该新鲜事已删除!'
            })
          }

        }
      })
    },
    //一级评论
    //todo

    //二级评论
    //todo
  };

  ThumbLike.findOne(likeCondition,function(err,doc){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      if(doc){
        //用户已经点赞了，则取消点赞,删除该记录
        doc.remove();
        //给对应的赞数-1
        strategy[type] && strategy[type](-1);
      }else{
        //给对应的赞数+1
        strategy[type] && strategy[type](1);
      }
    }
  })
});



module.exports = router
