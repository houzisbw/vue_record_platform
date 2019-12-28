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

//查询KPI
router.post('/searchKPI',function(req,res){
    let group = req.group;
    let name = req.body.data.staffName;
    let date = req.body.data.date;
    KPI.find({group:group},function(err,docs){
        if(err){
          res.json({
            status:returnedCodes.CODE_ERROR
          })
        }else{
            let list = docs.slice();
            if(name){
                list = docs.filter(function(item){
                    return item.staffName === name
                })
            }
            if(date){
                list = list.filter(function(item){
                    return item.date === date
                })
            }
            res.json({
                status:returnedCodes.CODE_SUCCESS,
                kpiList:list
            })
        }
      })
})

//删除KPI
router.post('/deleteKPI',function(req,res){
    let group = req.group;
    let name = req.body.data.staffName;
    let date = req.body.data.date;
    KPI.findOneAndRemove({group:group,staffName:name,date:date},function(err,docs){
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