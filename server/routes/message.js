/**
 * Created by Administrator on 2018/9/26.
 */
var express = require('express');
var router = express.Router();
var Emotion = require('./../model/emotions')
var Message = require('./../model/message')
var ThumbLike = require('./../model/ThumbLike')
var Comment = require('./../model/message_comment')
var CommentReply = require('./../model/message_comment_reply')
var User = require('./../model/user')
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
      //遍历每条新鲜事，获取其用户信息
      let promises = [];
      ret.forEach((item)=>{
        let promise = new Promise((resolve,reject)=>{
          User.findOne({username:item.username},function(err2,doc2){
            if(err2){
              reject()
            }else{
              resolve({
                nickname:doc2.nickname,
                userGroup:doc2.group,
                profileImgUrl:doc2.profileImgUrl
              })
            }
          })
        });
        promises.push(promise)
      });
      Promise.all(promises).then((results)=>{
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
              //这里无法将用户信息合并到ret中，所以传递到前端进行操作
              userInfoList:results,
              likedList:likedMessageList
            })
          }
        });
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


//保存评论
router.post('/saveMessageComment',function(req,res){
  let data = req.body.data;
  //获取服务器时间
  let timeNow = + new Date();
  data.time = timeNow.toString();
  //对应的新鲜事的评论数+1,注意评论数包含一级评论和二级评论
  Message.findOne({messageId:data.messageId},function(err,doc){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      if(doc){
        doc.commentNumber = doc.commentNumber+1;
        doc.save();
        //保存
        let comment = new Comment(data);
        comment.save();
        res.json({
          status:returnedCodes.CODE_SUCCESS,
          commentNum:doc.commentNumber
        })
      }else{
        res.json({
          status:returnedCodes.CODE_ERROR
        })
      }
    }
  });

});

//获取新鲜事的评论
router.post('/fetchMessageComment',function(req,res){
  let data = req.body.data;
  //获取参数
  let currentPage = req.body.param.currentPage,
      capacity = req.body.param.pageCapacity;
  //是否还有剩余评论
  let hasMore = false;
  //根据新鲜事id查找评论表中的对应新鲜事的评论
  Comment.find(data).sort({time:-1}).skip((currentPage-1)*capacity).limit(capacity).exec(function(err,docs){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      //针对每条评论进行查询用户的相关信息
      let promises = [];
      docs.forEach((item)=>{
        let promise = new Promise((resolve,reject)=>{
          User.findOne({username:item.userId},function(err2,doc2){
            if(err2){
              reject()
            }else{
              resolve({
                nickname:doc2.nickname,
                userGroup:doc2.group,
                profileImgUrl:doc2.profileImgUrl
              })
            }
          })
        });
        promises.push(promise)
      });

      Promise.all(promises).then((results)=>{
        //查询记录总数,这里要查询2级评论的数量
        Comment.count(data,function(err,count){
          if(currentPage*capacity < count){
            hasMore = true
          }
          res.json({
            status:returnedCodes.CODE_SUCCESS,
            commentList:docs,
            hasMore:hasMore,
            userInfoList:results
          })
        });
      }).catch(()=>{
        res.json({
          status:returnedCodes.CODE_ERROR,
        })
      })
    }
  });
});


//保存评论的回复
router.post('/saveCommentReply',function(req,res){
  let data = req.body.data;
  //获取服务器时间
  let timeNow = + new Date();
  data.time = timeNow.toString();
  //回复
  let commentReply = new CommentReply(data);
  commentReply.save();
  res.json({
    status:returnedCodes.CODE_SUCCESS
  })
});

//获取评论的回复
router.post('/fetchReplyOfComment',function(req,res){
  //该回复所属评论的id
  let commentId = req.body.data.commentId,
      pageSize = req.body.data.pageSize,
      pageNum = req.body.data.pageNum,
      offset = req.body.data.offset;
  //注意回复顺序是按时间先后，不是倒序
  CommentReply.find({commentId:commentId})
              .sort({time:1})
              .skip(offset - pageSize)
              .limit(pageSize)
              .exec(function(err,docs){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      //这里需要对每一个docs进行获取其用户的资料
      let promises = [];
      docs.forEach((item)=>{
        let promise = new Promise((resolve,reject)=>{
          User.findOne({username:item.fromUserId},function(err2,doc2){
            if(err2){
              reject()
            }else{
              resolve({
                fromUserNickname:doc2.nickname,
                fromUserGroup:doc2.group,
                fromUserAvatar:doc2.profileImgUrl
              })
            }
          })
        });
        promises.push(promise)
      });
      //res
      Promise.all(promises).then((results)=>{
        //计算回复总数
        CommentReply.count({commentId},function(err,count){
          //是否隐藏加载更多按钮
          let isFetchMore = offset<count;
          res.json({
            status:returnedCodes.CODE_SUCCESS,
            replyList:docs,
            fromUserInfoList:results,
            isFetchMore:isFetchMore
          })
        });
      }).catch(()=>{
        res.json({
          status:returnedCodes.CODE_ERROR,
        })
      })
    }

  });
});



module.exports = router
