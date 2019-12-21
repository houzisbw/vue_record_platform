/**
 * Created by Administrator on 2018/9/14.
 */
var express = require('express');
var router = express.Router();
var KPIType = require('./../model/kpi_types')
//返回状态码
var returnedCodes = require('./../config').returnedCodes;
//获取记录列表
router.get('/getKPITypesList',function(req,res){
  let group = req.group;
  KPIType.find({group:group},function(err,docs){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      res.json({
        status:returnedCodes.CODE_SUCCESS,
        kpiTypeList:docs.map((item)=>item.name)
      })
    }
  })
})

//添加记录列表
router.post('/addKPIType',function(req,res){
  let group = req.group;
  let name = req.body.name;
  KPIType.findOne({name:name,group:group},function(err,doc){
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
        let ws = new KPIType({
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
router.post('/deleteKPIType',function(req,res){
  let group = req.group,
      name = req.body.name;
  KPIType.findOneAndRemove({name:name,group:group},function(err){
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
