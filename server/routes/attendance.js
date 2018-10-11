/**
 * Created by Administrator on 2018/10/11.
 */
//排班考勤的相关接口
var express = require('express');
var router = express.Router();
var Workshop = require('./../model/workshop')
var AttendanceWorkProcess = require('./../model/attendance_work_process')
var AttendanceShift = require('./../model/attendance_shift')
var AttendanceTempStaff = require('./../model/attendance_temp_staff')
var AttendanceRegularStaff = require('./../model/attendance_regular_staff')
var AttendanceWorkContent = require('./../model/attendance_work_content')
//返回状态码
var returnedCodes = require('./../config').returnedCodes;

//工序的拉取数据的api
router.get('/processFetchApi',function(req,res){
  let group = req.group;
  AttendanceWorkProcess.find({group},function(err,docs){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      res.json({
        status:returnedCodes.CODE_SUCCESS,
        tagList:docs
      })
    }
  })
});

//工序的添加数据的api
router.post('/processAddApi',function(req,res){
  let group = req.group,
      name = req.body.name;
  //不能添加重复的
  AttendanceWorkProcess.findOne({name,group},function(err,doc){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      if(doc){
        //已存在:代码为6
        res.json({
          status:returnedCodes.CODE_EXIST
        })
      }else{
        //保存
        let AWP = new AttendanceWorkProcess({
          name,
          group
        });
        AWP.save();
        res.json({
          status:returnedCodes.CODE_SUCCESS
        })
      }
    }
  })
});

//工序删除数据的api
router.post('/processDeleteApi',function(req,res){
  let group = req.group,
      name = req.body.name;
  AttendanceWorkProcess.findOneAndRemove({group,name},function(err){
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


/*
*
* 班次
*
* */

//班次的拉取数据的api
router.get('/shiftFetchApi',function(req,res){
  let group = req.group;
  AttendanceShift.find({group},function(err,docs){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      res.json({
        status:returnedCodes.CODE_SUCCESS,
        tagList:docs
      })
    }
  })
});

//班次的添加数据api
router.post('/shiftAddApi',function(req,res){
  let group = req.group,
    name = req.body.name;
  //不能添加重复的
  AttendanceShift.findOne({name,group},function(err,doc){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      if(doc){
        //已存在:代码为6
        res.json({
          status:returnedCodes.CODE_EXIST
        })
      }else{
        //保存
        let AS = new AttendanceShift({
          name,
          group
        });
        AS.save();
        res.json({
          status:returnedCodes.CODE_SUCCESS
        })
      }
    }
  })
});

//班次删除数据的api
router.post('/shiftDeleteApi',function(req,res){
  let group = req.group,
    name = req.body.name;
  AttendanceShift.findOneAndRemove({group,name},function(err){
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


/*
 *
 * 临时人员
 *
 * */

//临时人员的拉取数据的api
router.get('/tempstaffFetchApi',function(req,res){
  let group = req.group;
  AttendanceTempStaff.find({group},function(err,docs){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      res.json({
        status:returnedCodes.CODE_SUCCESS,
        tagList:docs
      })
    }
  })
});

//班次的添加数据api
router.post('/tempstaffAddApi',function(req,res){
  let group = req.group,
    name = req.body.name;
  //不能添加重复的
  AttendanceTempStaff.findOne({name,group},function(err,doc){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      if(doc){
        //已存在:代码为6
        res.json({
          status:returnedCodes.CODE_EXIST
        })
      }else{
        //保存
        let AT = new AttendanceTempStaff({
          name,
          group
        });
        AT.save();
        res.json({
          status:returnedCodes.CODE_SUCCESS
        })
      }
    }
  })
});

//班次删除数据的api
router.post('/tempstaffDeleteApi',function(req,res){
  let group = req.group,
    name = req.body.name;
  AttendanceTempStaff.findOneAndRemove({group,name},function(err){
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

/*
 *
 * 工作内容
 *
 * */

router.post('/workContentFetchApi',function(req,res){
  let group = req.group;
  let workshop = req.body.workshop;
  AttendanceWorkContent.find({group,workshop},function(err,docs){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      res.json({
        status:returnedCodes.CODE_SUCCESS,
        tagList:docs
      })
    }
  })
});

router.post('/workContentAddApi',function(req,res){
  let group = req.group,
    name = req.body.name,
    workshop = req.body.workshop;
  //不能添加重复的
  AttendanceWorkContent.findOne({name,group,workshop},function(err,doc){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      if(doc){
        //已存在:代码为6
        res.json({
          status:returnedCodes.CODE_EXIST
        })
      }else{
        //保存
        let AT = new AttendanceWorkContent({
          name,
          group,
          workshop
        });
        AT.save();
        res.json({
          status:returnedCodes.CODE_SUCCESS
        })
      }
    }
  })
});

router.post('/workContentDeleteApi',function(req,res){
  let group = req.group,
    name = req.body.name,
    workshop = req.body.workshop;
  AttendanceWorkContent.findOneAndRemove({group,name,workshop},function(err){
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

router.get('/workContentFetchWorkshop',function(req,res){
  let group = req.group;
  Workshop.find({group:group},function(err,docs){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      //拉取工作内容，然后计算每一个车间的条数
      AttendanceWorkContent.find({group},function(err1,docs1){
        if(err1){
          res.json({
            status:returnedCodes.CODE_ERROR
          })
        }else{
          let ret = [],map={};
          docs.forEach((item)=>{
            map[item.name]=0
          });
          docs1.forEach((item)=>{
            map[item.workshop]++;
          });
          Object.keys(map).forEach((item)=>{
            ret.push({
              name:item,
              count:map[item]
            })
          });
          res.json({
            status:returnedCodes.CODE_SUCCESS,
            workshopList:ret
          })
        }
      });
    }
  })
})

/*
 *
 * 正式员工
 *
 * */

router.get('/regularstaffFetchApi',function(req,res){
  let group = req.group;
  AttendanceRegularStaff.find({group},function(err,docs){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      res.json({
        status:returnedCodes.CODE_SUCCESS,
        tagList:docs
      })
    }
  })
});

router.post('/regularstaffAddApi',function(req,res){
  let group = req.group,
    name = req.body.name;
  //不能添加重复的
  AttendanceRegularStaff.findOne({name,group},function(err,doc){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      if(doc){
        //已存在:代码为6
        res.json({
          status:returnedCodes.CODE_EXIST
        })
      }else{
        //保存
        let AT = new AttendanceRegularStaff({
          name,
          group
        });
        AT.save();
        res.json({
          status:returnedCodes.CODE_SUCCESS
        })
      }
    }
  })
});

router.post('/regularstaffDeleteApi',function(req,res){
  let group = req.group,
    name = req.body.name;
  AttendanceRegularStaff.findOneAndRemove({group,name},function(err){
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


module.exports = router;
