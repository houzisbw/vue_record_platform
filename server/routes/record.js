/**
 * Created by Administrator on 2018/9/16.
 */
var express = require('express');
var router = express.Router();
var Record = require('./../model/record')
var User = require('./../model/user')
var Workshop = require('./../model/workshop')
var ErrorType = require('./../model/record_type')
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
          let year = item.monthDate?item.monthDate.split('-')[0]:'';
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
  //获取从数据库解析的用户数据
  let group = req.group;
  let auth = req.auth;
  let username = req.user;
  //获取前端传递的数据
  let data = req.body.data;
  let pageSize = data.pageSize;
  let currentPage = data.currentPage;

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
    condition.isConfirm = '0'
  }
  //如果是普通用户，特殊处理全部查询的逻辑
  if(auth === '0'){
    if(data.yearValue===undefined&&data.monthValue===undefined){
      condition.username = username;
    }
  }
  //查询
  Record.count(condition,function(err1,count){
    if(err1){
      res.json({
        status:returnedCodes.CODE_ERROR,
      })
    }else{
      //这里要分页查询
      Record.find(condition).sort({date:1}).skip((currentPage-1)*pageSize).limit(pageSize).exec(function(err,docs){
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


//删除记录
router.post('/removeRecords',function(req,res){
  let data = req.body.data;
  //删除数据库增加的属性
  if(data.__v!==undefined)delete data.__v;
  if(data._id!==undefined)delete data._id;
  Record.findOneAndRemove(data,function(err){
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

//获取记录修改对话框所需的下拉列表数据
router.get('/fetchModifyDialogData',function(req,res){
  let group = req.group;
  //获取该组下普通用户列表
  let staffPromise = new Promise((resolve,reject)=>{
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
  })
  //获取车间列表
  let workshopPromise = new Promise((resolve,reject)=>{
    Workshop.find({group:group},function(err,docs){
      if(err){
        reject()
      }else{
        let workshopList = [];
        docs.forEach((item)=>{
          workshopList.push(item.name)
        })
        resolve(workshopList)
      }
    })
  })
  //获取错误类型
  let errorTypePromise = new Promise((resolve,reject)=>{
    ErrorType.find({group:group},function(err,docs){
      if(err){
        reject()
      }else{
        let typeList = [];
        docs.forEach((item)=>{
          typeList.push(item.name)
        })
        resolve(typeList)
      }
    })
  })

  Promise.all([staffPromise,workshopPromise,errorTypePromise]).then((result)=>{
    res.json({
      status:returnedCodes.CODE_SUCCESS,
      result:result
    })
  }).catch((err)=>{
    res.json({
      status:returnedCodes.CODE_ERROR
    })
  })
});

//修改记录
router.post('/modifyRecords',function(req,res){
  let origin = req.body.origin;
  let modify = req.body.modified;
  modify.isConfirm = modify.isConfirm?'1':'0';
  Record.findOneAndUpdate(origin,modify,function(err){
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
});

//获取当月不重要的记录
router.post('/getRecordsCount',function(req,res){
  let group = req.group;
  let isImportant = req.body.isImportant?'1':'0';
  let monthDate = req.body.monthDate;
  //查询条件
  let condition = {
    group:group,
    isImportant:isImportant,
    monthDate:monthDate
  };
  Record.find(condition,function(err,docs){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      //返回每个人的记录数量
      let retObj = {};
      docs.forEach((item)=>{
        if(retObj[item.username]!==undefined){
          retObj[item.username]++
        }else{
          retObj[item.username]=1;
        }
      });
      let retArray = [];
      Object.keys(retObj).forEach((item)=>{
        retArray.push({
          username:item,
          count:retObj[item]
        })
      });
      retArray.sort((a,b)=>{
        return a.count - b.count
      });
      res.json({
        status:returnedCodes.CODE_SUCCESS,
        countArray:{
          data:retArray,
          isImportant:req.body.isImportant,
          total:docs.length
        }
      })
    }
  })
});

//普通用户确认
router.post('/ordinaryUserConfirm',function(req,res){
  let data = req.body.data;
  let group = req.group;
  let username = req.user;
  //删除数据库增加的属性
  if(data.__v!==undefined)delete data.__v;
  if(data._id!==undefined)delete data._id;
  Record.findOneAndUpdate(data,{isConfirm:'1'},function(err){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      //查询剩余的未确认的记录数量
      Record.count({group,isConfirm:'0',username},function(err1,count){
        if(err1) {
          res.json({
            status: returnedCodes.CODE_ERROR
          })
        }else{
          res.json({
            count:count,
            status:returnedCodes.CODE_SUCCESS
          })
        }
      });
    }
  })
})

//添加记录
router.post('/addNewRecord',function(req,res){
  let group = req.group;
  let data = req.body.data;
  //添加组别字段
  data.group = group;
  //添加月份字段
  let arr = data.date.split('-');
  arr.pop();
  data.monthDate = arr.join('-');
  let record = new Record(data);
  record.save();
  res.json({
    status:returnedCodes.CODE_SUCCESS
  })
});

module.exports = router
