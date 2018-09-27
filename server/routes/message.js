/**
 * Created by Administrator on 2018/9/26.
 */
var express = require('express');
var router = express.Router();
var Emotion = require('./../model/emotions')
var Message = require('./../model/message')
//返回状态码
var returnedCodes = require('./../config').returnedCodes;

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
  data.time = timeNow;
  //保存
  let message = new Message(data);
  message.save();
  res.json({
    status:returnedCodes.CODE_SUCCESS
  })

});

module.exports = router
