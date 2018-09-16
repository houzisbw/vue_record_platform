/**
 * Created by Administrator on 2018/9/16.
 */
var express = require('express');
var router = express.Router();
var Record = require('./../model/record')
var User = require('./../model/user')
//返回状态码
var returnedCodes = require('./../config').returnedCodes;

//获取年份，记录人员信息
router.get('/getDropdownInfo',function(req,res){
  //只查询自己组的记录
  let group = req.group;
  //查询年份
  let yearPromise = new Promise(function(resolve,reject){
    Record.find({group:group},function(err,docs){
      if(err){
        reject()
      }else{
        let minYear = Infinity,
            maxYear = -Infinity;
        docs.forEach((item)=>{
          let year = item.monthDate.split('-')[0];
          year>maxYear ? maxYear=year : '';
          year<minYear ? minYear=year : '';
        })
        resolve({
          minYear:minYear,
          maxYear:maxYear
        })
      }
    })
  });
  //查询记录人员,组名区分,且只需要普通用户
  let staffPromise = new Promise(function(resolve,reject){
    User.find({group:group,auth:'0'},function(err,docs){
      if(err){
        reject()
      }else{
        let userList = [];
        docs.forEach((item)=>{
          userList.push(item.username)
        })
        resolve(userList)
      }
    })
  });
  //执行所有promise
  Promise.all([staffPromise,yearPromise]).then(function(results){
    //results是和参数对应的数组
    res.json({
      status:returnedCodes.CODE_SUCCESS,
      resultArray:results
    })
  }).catch((error)=>{
    //返回最先reject的值
    res.json({
      status:returnedCodes.CODE_ERROR,
    })
  })
});

//查询记录
router.post('/searchRecords',function(req,res){
  let group = req.group;
  let data = req.body.data;
  //查询条件
  let condition = {group:group};
  let dateStr = '';
  if(data.yearValue){
    dateStr+=data.yearValue
  }
  if(data.monthValue){
    dateStr+='-'+data.monthValue
  }
  //如果有日期
  if(dateStr){
    condition.monthDate = dateStr
  }
  //如果有人员
  if(data.staffValue){
    condition.username = data.staffValue
  }
  //是否只查询未确认
  if(data.isConfirm==='1'){
    condition.isConfirm = '1'
  }

  //查询
  Record.count(condition,function(err1,count){
    if(err1){
      res.json({
        status:returnedCodes.CODE_ERROR,
      })
    }else{
      //这里要分页查询
      //todo
      Record.find(condition,function(err,docs){
        if(err){
          res.json({
            status:returnedCodes.CODE_ERROR,
          })
        }else{
          res.json({
            status:returnedCodes.CODE_SUCCESS,
            recordArray:docs,
            totalCount:count
          })
        }
      })
    }
  })
})

module.exports = router
