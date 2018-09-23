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
  let group = req.group,
      username = req.user;
  //获取最近一年的记录(12个月)
  let monthList = [],
      monthCnt = 12,
      curDate = new Date();
  for(let i=1;i<=monthCnt;i++){
    let month = curDate.getMonth()+1;
    let monthStr = month<10?'0'+month:month;
    let monthDateStr = curDate.getFullYear()+'-'+monthStr;
    monthList.push(monthDateStr);
    curDate.setMonth(curDate.getMonth()-1)
  }
  // 查询在最近一年内的记录
  let condition = {
    group:group,
    monthDate:{
      $in:monthList
    }
  };
  Record.find(condition,function(err,docs){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      //统计每个月的每人平均记录数量 和 每个月当前用户的记录数量
      //每个月当前用户的记录数量
      let userRecordEachMonthList = [];
      let userRecordEachMonthMap = {};
      monthList.forEach((item)=>{
        userRecordEachMonthMap[item]=0;
      });
      docs.forEach((item)=>{
        if(item.username === username){
          userRecordEachMonthMap[item.monthDate]++;
        }
      });
      Object.keys(userRecordEachMonthMap).forEach((item)=>{
        userRecordEachMonthList.push({
          month:item,
          num:userRecordEachMonthMap[item],
          type:'PERSONAL'
        })
      });
      //统计每个月的每人平均记录数量
      let userAverageRecordList = [];
      let userTotalRecordByMonthMap = {};
      let userNameCntByMonthMap = {};
      docs.forEach((item)=>{
        if(userTotalRecordByMonthMap[item.monthDate]){
          userTotalRecordByMonthMap[item.monthDate]++;
        }else{
          userTotalRecordByMonthMap[item.monthDate]=1;
        }
        if(!userNameCntByMonthMap[item.monthDate]){
          userNameCntByMonthMap[item.monthDate] = {};
          userNameCntByMonthMap[item.monthDate][item.username] = true
        }else{
          userNameCntByMonthMap[item.monthDate][item.username] = true
        }
      });
      Object.keys(userTotalRecordByMonthMap).forEach((item)=>{
        let totalCnt = userTotalRecordByMonthMap[item];
        let userCnt = Object.keys(userNameCntByMonthMap[item]).length || 1;
        let avgCnt = parseFloat((totalCnt / userCnt).toFixed(1));
        userAverageRecordList.push({
          month:item,
          num:avgCnt,
          type:'AVG'
        })
      });
      //返回
      console.log(userAverageRecordList.concat(userRecordEachMonthList))
      res.json({
        status:returnedCodes.CODE_SUCCESS,
        data:userAverageRecordList.concat(userRecordEachMonthList)
      })
    }
  })

});


module.exports = router;

