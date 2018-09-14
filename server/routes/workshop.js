/**
 * Created by Administrator on 2018/9/14.
 */
var express = require('express');
var router = express.Router();
var Workshop = require('./../model/workshop')
var Auth = require('./../model/auth')
//返回状态码
var returnedCodes = require('./../config').returnedCodes;

//获取该组的车间列表
router.get('/getWorkshopList',function(req,res){
  let group = req.group;
  Workshop.find({group:group},function(err,docs){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      res.json({
        status:returnedCodes.CODE_SUCCESS,
        workshopList:docs
      })
    }
  })
})

//添加车间
router.post('/addWorkshop',function(req,res){
  let group = req.group;
  let name = req.body.name;
  Workshop.findOne({name:name,group:group},function(err,doc){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      if(doc){
        //车间名字已经存在
        res.json({
          status:returnedCodes.CODE_WORKSHOP_EXIST
        })
      }else{
        let ws = new Workshop({
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

//删除车间
router.post('/deleteWorkshop',function(req,res){
  let group = req.group,
      name = req.body.name;
  Workshop.findOneAndRemove({name:name,group:group},function(err){
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
