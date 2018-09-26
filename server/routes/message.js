/**
 * Created by Administrator on 2018/9/26.
 */
var express = require('express');
var router = express.Router();
var Emotion = require('./../model/emotions')
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

module.exports = router
