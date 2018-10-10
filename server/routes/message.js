/**
 * Created by Administrator on 2018/9/26.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
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
  let pageSize = req.body.data.pageSize,
      pageNum = req.body.data.currentPage,
      sortBy = req.body.data.sortBy;
  let condition = {
    userGroup:group,
  };
  let sortCondition = sortBy === 'time'?{publishTime:-1}:{likes:-1};
  //是否还有更多新鲜事
  let hasMore = false;
  Message.find(condition)
         .sort(sortCondition)
         .skip((pageNum-1)*pageSize)
         .limit(pageSize)
         .exec(function(err,docs){

         if(err){
           res.json({
             status:returnedCodes.CODE_ERROR
           })
         }else{
           let ret = docs;
           //如果查询到的新鲜事条目数小于页面容量，则是最后一页
           hasMore = !(docs.length < pageSize);
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
                     profileImgUrl:doc2.profileImgUrl,
                     //是否是自己的新鲜事
                     isOwnMessage:doc2.username === user
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
                   likedList:likedMessageList,
                   hasMore
                 })
               }
             });
           });
         }
  });

});

//用户点赞处理
router.post('/toggleThumbLike',function(req,res){
  let username = req.user;
  let likeTargetId = req.body.likeTargetId;
  let messageId = req.body.messageId;
  let type = req.body.type;
  //搜索条件
  let likeCondition = {
    typeId:likeTargetId,
    type:type,
    userId:username
  };

  //点赞具体处理(最后一个参数是新鲜事的id)
  const likeHandler = (schema,condition,likeNum,message,messageId)=>{
    schema.findOne(condition,function(err,doc){
      if(err) {
        res.json({
          status: returnedCodes.CODE_ERROR
        })
      }else{
        //如果该新鲜事存在(判断不能少)
        if(doc){
          if(likeNum === 1){
            //用户未点赞，增加点赞记录
            likeCondition.messageId = messageId;
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
            message:message
          })
        }
      }
    })
  };

  //策略类，处理不同类型的点赞操作
  let strategy = {
    //新鲜事
    '1':function(likeNum){
      let condition = {
        messageId:likeTargetId
      };
      likeHandler(Message,condition,likeNum,'该新鲜事已删除!',likeTargetId);
    },
    //一级评论
    '2':function(likeNum){
      let condition = {
        _id:mongoose.Types.ObjectId(likeTargetId)
      };
      likeHandler(Comment,condition,likeNum,'',messageId);
    },

    //二级评论(回复)
    '3':function(likeNum){
      let condition = {
        _id:mongoose.Types.ObjectId(likeTargetId)
      };
      likeHandler(CommentReply,condition,likeNum,'',messageId);
    }
  };

  ThumbLike.findOne(likeCondition,function(err,doc){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      if(doc){
        //用户已经点赞了，则取消点赞,删除该记录
        doc.remove(function(){
          //给对应的赞数-1
          strategy[type] && strategy[type](-1);
        });
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
  let limit = req.body.numLimit;
  let messageId = req.body.messageId;
  //获取服务器时间
  let timeNow = + new Date();
  data.time = timeNow.toString();
  //查找该评论回复的总数
  CommentReply.count({commentId:data.commentId},function(err,count){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      let isShowAll = false;
      if(count<limit){
        //小于limit，显示所有评论
        isShowAll = true;
      }
      //回复(保存新鲜事id)
      data.messageId = messageId;
      let commentReply = new CommentReply(data);
      commentReply.save();
      //给该新鲜事的评论数量+1
      Message.findOne({messageId},function(err,doc){
        if(err){
          res.json({
            status:returnedCodes.CODE_ERROR,
          })
        }else{
          doc.commentNumber = doc.commentNumber+1;
          //保存
          doc.save();
          res.json({
            status:returnedCodes.CODE_SUCCESS,
            isShowAll,
            commentNumber:doc.commentNumber
          })
        }
      });
    }
  });
});

//获取评论的回复
router.post('/fetchReplyOfComment',function(req,res){
  //该回复所属评论的id
  let commentId = req.body.data.commentId,
      //Infinite被转化为null，注意了
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
          let isFetchMore = offset<count && pageSize!==null;
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

//删除回复
router.post('/deleteReply',function(req,res){
  let id = req.body.id;
  CommentReply.findOne({_id:mongoose.Types.ObjectId(id)},function(err,doc){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR,
      })
    }else{
      if(doc){
        doc.remove();
        //删除该回复在点赞表中的所有记录
        ThumbLike.remove({typeId:id},function(err,results){
          if(err){
            res.json({
              status:returnedCodes.CODE_ERROR,
            })
          }else{
            res.json({
              status:returnedCodes.CODE_SUCCESS,
            })
          }
        });
      }else{
        //未找到要删除的回复(已经删除了)
        res.json({
          status:returnedCodes.CODE_ERROR,
        })
      }
    }
  })
});

//删除评论
router.post('/deleteComment',function(req,res){
  //这里不用做检测要删除的东西存在与否的逻辑，因为remove一个不存在的数据不会报错，不会导致reject
  //评论的数据库主键_id
  let id = req.body.id;
  //首先删除评论表中的评论，再删除回复表中的回复，再删除点赞表中的点赞
  let commentPromise = new Promise((resolve,reject)=>{
    Comment.remove({_id:mongoose.Types.ObjectId(id)},function(err){
      if(err){
        reject()
      }else{
        resolve();
      }
    })
  });
  let replyPromise = new Promise((resolve,reject)=>{
    //找到该评论下的所有回复
    CommentReply.find({commentId:id},function(err,docs){
      if(err){
        reject()
      }else{
        //获取这些回复的_id
        let ids = [];
        docs.forEach((item)=>{
          ids.push(item._id)
        });
        //删除这些回复id对应在点赞表里的对应字段
        ThumbLike.remove({typeId:{$in:ids},type:likeType.REPLY},function(err){
          if(err){
            reject();
          }else{
            CommentReply.remove({commentId:id},function(err){
              if(err){
                reject()
              }else{
                resolve();
              }
            })
          }
        })
      }
    });
  });
  //删除点赞，注意这里很麻烦，首先删除点赞表里的评论的点赞，然后删除点赞表里的回复的点赞
  let likesPromise = new Promise((resolve,reject)=>{
    //删除点赞表中评论的点赞:这里的id是评论的id,需要指定type字段
    ThumbLike.remove({typeId:id,type:likeType.COMMENT_FIRST},function(err){
      if(err){
        reject()
      }else{
        resolve();
      }
    })
  });

  let promises = [];
  promises.concat([commentPromise,replyPromise,likesPromise]);
  Promise.all(promises).then(()=>{
    res.json({
      status:returnedCodes.CODE_SUCCESS,
    })
  }).catch(()=>{
    res.json({
      status:returnedCodes.CODE_ERROR,
    })
  })
});

//删除新鲜事
router.post('/deleteMessage',function(req,res){
  //新鲜事id
  let messageId = req.body.id;
  //首先删除新鲜事表中的对应数据，然后删除评论表中的评论，再删除回复表中的回复，再删除点赞表中的点赞
  //注意：需要在回复表以及点赞表中添加新鲜事id，便于删除
  let messagePromise = new Promise((resolve,reject)=>{
    Message.remove({messageId},function(err){
      if(err){
        reject();
      }else{
        resolve();
      }
    })
  });
  //删除评论表中对应新鲜事的评论
  let commentPromise = new Promise((resolve,reject)=>{
    Comment.remove({messageId},function(err){
      if(err){
        reject()
      }else{
        resolve();
      }
    })
  });
  //删除回复表中的回复
  let replyPromise = new Promise((resolve,reject)=>{
    CommentReply.remove({messageId},function(err){
      if(err){
        reject()
      }else{
        resolve();
      }
    })
  })
  //删除点赞表中的点赞
  let likesPromise = new Promise((resolve,reject)=>{
    //删除点赞表中评论的点赞:这里的id是评论的id,需要指定type字段
    ThumbLike.remove({messageId},function(err){
      if(err){
        reject()
      }else{
        resolve();
      }
    })
  });

  let promises = [].concat([messagePromise,commentPromise,replyPromise,likesPromise]);
  Promise.all(promises).then(()=>{
    res.json({
      status:returnedCodes.CODE_SUCCESS
    })
  }).catch(()=>{
    res.json({
      status:returnedCodes.CODE_ERROR
    })
  })

});

// 获取用户赞过的评论或者回复列表
router.post('/fetchUserLikedList',function(req,res){
  let type = req.body.type;
  let username = req.user;
  ThumbLike.find({
    type:type,
    userId:username
  },function(err,docs){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR,
      })
    }else{
      let ret = [];
      docs.forEach((item)=>{
        ret.push(item.typeId);
      });
      res.json({
        status:returnedCodes.CODE_SUCCESS,
        likedList:ret
      })
    }
  })
});



module.exports = router
