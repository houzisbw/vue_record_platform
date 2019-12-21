var express = require('express');
var router = express.Router();
var KPI = require('./../model/kpis')
//返回状态码
var returnedCodes = require('./../config').returnedCodes;
//保存kpi记录
router.post('/saveKPI',function(req,res){
    let group = req.group;
    let name = req.body.data.staffName;
    let date = req.body.data.date;
    let kpiType = req.body.data.kpiType;
    let kpiValue = req.body.data.kpiValue;
    let comment = req.body.data.comment;
    
    KPI.findOne({staffName:name,group:group,date:date},function(err,doc){
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
          let kpi = new KPI({
            group:group,
            staffName:name,
            date:date,
            kpiType:kpiType,
            kpiValue:kpiValue,
            comment:comment,
          });
          kpi.save();
          res.json({
            status:returnedCodes.CODE_SUCCESS
          })
        }
      }
    })
})

module.exports = router