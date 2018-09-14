/**
 * Created by Administrator on 2018/9/14.
 */
var express = require('express');
var router = express.Router();
var RecordType = require('./../model/record_type')
//返回状态码
var returnedCodes = require('./../config').returnedCodes;
//获取记录列表
router.get('/getRecordTypesList',function(req,res){
  let group = req.group;
  RecordType.find({group:group},function(err,docs){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      res.json({
        status:returnedCodes.CODE_SUCCESS,
        recordTypeList:docs
      })
    }
  })
})

//添加记录列表
router.post('/addRecordType',function(req,res){
  let group = req.group;
  let name = req.body.name;
  RecordType.findOne({name:name,group:group},function(err,doc){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      if(doc){
        //名字已经存在
        res.json({
          status:returnedCodes.CODE_RECORDTYPE_EXIST
        })
      }else{
        let ws = new RecordType({
          name:name,
          group:group
        });
        ws.save();
        res.json({
          status:returnedCodes.CODE_SUCCESS
        })
      }
    }
  })
})

//删除记录列表
router.post('/deleteRecordType',function(req,res){
  let group = req.group,
      name = req.body.name;
  RecordType.findOneAndRemove({name:name,group:group},function(err){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      res.json({
        status:returnedCodes.CODE_SUCCESS
      })
    }
  })

})

module.exports = router
