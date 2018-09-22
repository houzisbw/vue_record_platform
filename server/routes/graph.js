/**
 * Created by Administrator on 2018/9/21.
 */
var express = require('express');
var router = express.Router();
var Record = require('./../model/record')
//返回状态码
var returnedCodes = require('./../config').returnedCodes;

//获取图表年份
router.get('/getYearList',function(req,res){
  let group = req.group;
  Record.find({group:group},function(err,docs){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      let minYear = Infinity,
          maxYear = -Infinity;
      docs.forEach((item)=>{
        let year = item.monthDate?item.monthDate.split('-')[0]:'';
        year>maxYear ? maxYear=year : '';
        year<minYear ? minYear=year : '';
      });
      res.json({
        minYear:minYear,
        maxYear:maxYear,
        status:returnedCodes.CODE_SUCCESS
      })
    }
  })

});

//搜索图表数据
router.post('/searchGraphRecord',function(req,res){
  let group = req.group,
      username = req.user;
  console.log(req.body.data)
  let {year,month,type} = req.body.data;
  let condition = {
    monthDate:year+'-'+month,
    group:group
  };
  if(type==='PERSONAL'){
    condition.username = username
  }

  Record.find(condition,function(err,docs){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      let map = {};
      docs.forEach((item)=>{
        if(map[item.type]!==undefined){
          map[item.type]++;
        }else{
          map[item.type]=1;
        }
      });
      res.json({
        dataObj:map,
        status:returnedCodes.CODE_SUCCESS
      })
    }
  })
});

//获取最近一年(12个月)的历史数据，个人的和本组平均
router.get('/getLatestYearRecord',function(req,res){
  let group = req.group;
  
});


module.exports = router;

