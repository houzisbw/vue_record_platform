/**
 * Created by Administrator on 2018/10/11.
 */
//排班考勤的相关接口
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var officegen = require('officegen')
var Workshop = require('./../model/workshop')
var AttendanceWorkProcess = require('./../model/attendance_work_process')
var AttendanceShift = require('./../model/attendance_shift')
var AttendanceTempStaff = require('./../model/attendance_temp_staff')
var AttendanceRegularStaff = require('./../model/attendance_regular_staff')
var AttendanceWorkContent = require('./../model/attendance_work_content')
var AttendanceAnnounce = require('./../model/attendance_annoucement')
var AttendanceShiftData = require('./../model/attendance_shift_data')
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

//临时人员的添加数据api
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

//临时人员删除数据的api
router.post('/tempstaffDeleteApi',function(req,res){
  let group = req.group,
    name = req.body.name;
  AttendanceTempStaff.findOneAndRemove({group,name},function(err){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      //需要遍历所有的排班数据，删除每一条中的临时人员列表中的自己(如果存在)
      //这里需要使用updateMany(更新多个),$pullAll删除数组中的某些值
      AttendanceShiftData.updateMany({group},{$pullAll:{tempStaffList:[name]}},function(err1){
        if(err1){
          res.json({
            status:returnedCodes.CODE_ERROR
          })
        }else{
          res.json({
            status:returnedCodes.CODE_SUCCESS
          })
        }
      });
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

//正式员工删除的api
router.post('/regularstaffDeleteApi',function(req,res){
  let group = req.group,
    name = req.body.name;
  AttendanceRegularStaff.findOneAndRemove({group,name},function(err){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      //需要遍历所有的排班数据，删除每一条中的临时人员列表中的自己(如果存在)
      //这里需要使用updateMany(更新多个),$pullAll删除数组中的某些值
      AttendanceShiftData.updateMany({group},{$pullAll:{regularStaffList:[name]}},function(err1){
        if(err1){
          res.json({
            status:returnedCodes.CODE_ERROR
          })
        }else{
          res.json({
            status:returnedCodes.CODE_SUCCESS
          })
        }
      });
    }
  })
});

//公告栏内容获取
router.post('/fetchAttendanceAnnounce',function(req,res){
  let type = req.body.type;
  AttendanceAnnounce.findOne({type},function(err,doc){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      res.json({
        status:returnedCodes.CODE_SUCCESS,
        announce:doc?doc.content:''
      })
    }
  })
});
//更新公告栏内容
router.post('/updateAttendanceAnnounce',function(req,res){
  let type = req.body.type,
      content = req.body.content;
  AttendanceAnnounce.findOne({type},function(err,doc){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      if(doc){
        doc.content = content;
        doc.save();
      }else{
        let AA = new AttendanceAnnounce({
          type,
          content
        });
        AA.save();
      }
      res.json({
        status:returnedCodes.CODE_SUCCESS
      })
    }
  })
});


//获取考勤编辑界面各项下拉的数据
router.get('/fetchAttendanceArrangeDropdown',function(req,res){
  let group = req.group;
  //获取车间，工序，班次，临时员工，正式员工,(工作内容单独拉取)
  function getter(schema){
    return new Promise((resolve,reject)=>{
      schema.find({group},function(err,docs){
        if(err){
          reject();
        }else{
          let list = [];
          docs.forEach((item)=>{
            //格式是前端规定的
            list.push({
              value:item.name,
              label:item.name
            })
          });
          resolve(list)
        }
      })
    });
  }

  //车间
  let workshopPromise = getter(Workshop);
  //工序
  let processPromise = getter(AttendanceWorkProcess);
  //班次
  let shiftPromise = getter(AttendanceShift);
  //临时员工
  let tempStaffPromise = getter(AttendanceTempStaff);
  //正式员工
  let regularStaffPromise = getter(AttendanceRegularStaff);
  //promise数组
  let promises = [].concat([workshopPromise,processPromise,shiftPromise,tempStaffPromise,regularStaffPromise]);
  Promise.all(promises).then((results)=>{
    res.json({
      status:returnedCodes.CODE_SUCCESS,
      workshop:results[0],
      process:results[1],
      shift:results[2],
      tempstaff:results[3],
      regularstaff:results[4]
    })
  }).catch(()=>{
    res.json({
      status:returnedCodes.CODE_ERROR,
    })
  })
});

//拉取车间对应的工作内容
router.post('/fetchAttendanceArrangeWorkContent',function(req,res){
  let group = req.group,
      workshop = req.body.workshop;
  AttendanceWorkContent.find({group,workshop},function(err,docs){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR,
      })
    }else{
      let list = [];
      docs.forEach((item)=>{
        list.push({
          value:item.name,
          label:item.name
        })
      });
      res.json({
        status:returnedCodes.CODE_SUCCESS,
        list:list
      })
    }
  })
})

//提交排班考勤数据
router.post('/submitAttendanceArrange',function(req,res){
  let group = req.group;
  let data = req.body.data;
  data.group = group;
  //如果找到相同排班表的则覆盖
  AttendanceShiftData.findOne(data,function(err,doc){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR,
      })
    }else{
      if(doc){
        //不做任何事
        res.json({
          status:returnedCodes.CODE_SUCCESS,
        })
      }else{
        let attendanceShiftData = new AttendanceShiftData(data)
        attendanceShiftData.save();
        res.json({
          status:returnedCodes.CODE_SUCCESS,
        })
      }
    }
  })
});

//获取当日的排班人员情况和班次信息
router.post('/fetchShiftDataCurrentDay',function(req,res){
  let group = req.group;
  let date = req.body.date;
  //班次数据
  let shiftPromise = new Promise((resolve,reject)=>{
    AttendanceShift.find({group},function(err,docs){
      if(err){
        reject();
      }else{
        let list = [];
        docs.forEach((item)=>{
          list.push(item.name)
        })
        resolve(list)
      }
    })
  })
  //获取正式员工和临时员工列表
  let staffPromise = new Promise((resolve,reject)=>{
    let tempStaffPromise = new Promise((resolve1,reject1)=>{
      AttendanceTempStaff.find({group},function(err,docs){
        if(err){
          reject1()
        }else{
          let list = [];
          docs.forEach((item)=>{list.push(item.name)})
          resolve1(list)
        }
      })
    })
    let regularStaffPromise = new Promise((resolve1,reject1)=>{
      AttendanceRegularStaff.find({group},function(err,docs){
        if(err){
          reject1()
        }else{
          let list = [];
          docs.forEach((item)=>{list.push(item.name)})
          resolve1(list)
        }
      })
    })
    Promise.all([tempStaffPromise,regularStaffPromise]).then((results)=>{
      resolve({
        totalTempStaffList:results[0],
        totalRegularStaffList:results[1]
      })
    }).catch(()=>{
      reject()
    })
  });
  //当日排班情况
  let shiftDataPromise = new Promise((resolve,reject)=>{
    AttendanceShiftData.find({group,date},function(err,docs){
      if(err){
        reject();
      }else{
        //临时员工的list
        let tempList = [];
        //正式员工的list
        let regularList = [];
        docs.forEach((item)=>{
          let rList = item.regularStaffList;
          rList.forEach((subItem)=>{
            regularList.push({
              type:item.shift,
              name:subItem
            })
          });
          let tList = item.tempStaffList;
          tList.forEach((subItem)=>{
            tempList.push({
              type:item.shift,
              name:subItem
            })
          })
        });
        resolve({
          tempList,
          regularList
        })
      }
    })
  })

  Promise.all([shiftPromise,shiftDataPromise,staffPromise]).then((results)=>{
    res.json({
      status:returnedCodes.CODE_SUCCESS,
      shift:results[0],
      tempList:results[1].tempList,
      regularList:results[1].regularList,
      totalTempStaffList:results[2].totalTempStaffList,
      totalRegularStaffList:results[2].totalRegularStaffList,
    })
  }).catch(()=>{
    res.json({
      status:returnedCodes.CODE_ERROR,
    })
  })
});

//获取历史排班数据(某一天)和公告数据
router.post('/fetchShiftDataHistory',function(req,res){
  let group = req.group,
      date = req.body.date;
  //获取公告数据
  let announcePromise = new Promise((resolve,reject)=>{
    AttendanceAnnounce.find({},function(err,docs){
      if(err){
        reject()
      }else{
        let ret = {};
        docs.forEach((item)=>{
          ret[item.type] = item.content
        });
        resolve(ret)
      }
    })
  });
  //获取排班记录数据
  let shiftPromise = new Promise((resolve,reject)=>{
    AttendanceShiftData.find({group,date},function(err,docs){
      if(err){
        reject()
      }else{
        resolve(docs)
      }
    })
  });

  Promise.all([announcePromise,shiftPromise]).then((results)=>{
    res.json({
      status:returnedCodes.CODE_SUCCESS,
      announce:results[0],
      shift:results[1]
    })
  }).catch(()=>{
    res.json({
      status:returnedCodes.CODE_ERROR
    })
  })

});

//删除排班数据
router.post('/deleteShiftData',function(req,res){
  let id = req.body.id;
  AttendanceShiftData.findOneAndRemove({_id:mongoose.Types.ObjectId(id)},function(err){
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

//获取已填写的排班数据
router.post('/fetchWrittenDataUrl',function(req,res){
  let id = req.body.id;
  AttendanceShiftData.findOne({_id:mongoose.Types.ObjectId(id)},function(err,doc){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      res.json({
        status:returnedCodes.CODE_SUCCESS,
        shift:doc
      })
    }
  })
});

//修改已填写数据的url
router.post('/updateWrittenData',function(req,res){
  let data = req.body.data;
  let id = req.body.id;
  AttendanceShiftData.findOneAndUpdate({_id:mongoose.Types.ObjectId(id)},data,function(err){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      res.json({
        status:returnedCodes.CODE_SUCCESS,
      })
    }
  })
});

//获取考勤表数据
router.post('/fetchAttendanceSheetData',function(req,res){
  let group = req.group;
  //考勤月份
  let date  = req.body.date;
  //获取临时员工列表
  let tempStaffPromise = new Promise((resolve1,reject1)=>{
    AttendanceTempStaff.find({group},function(err,docs){
      if(err){
        reject1()
      }else{
        let list = [];
        docs.forEach((item)=>{list.push(item.name)})
        resolve1(list)
      }
    })
  })
  //获取正式员工列表
  let regularStaffPromise = new Promise((resolve1,reject1)=>{
    AttendanceRegularStaff.find({group},function(err,docs){
      if(err){
        reject1()
      }else{
        let list = [];
        docs.forEach((item)=>{list.push(item.name)})
        resolve1(list)
      }
    })
  });
  //获取当月的排班数据
  let currentMonthShiftData = new Promise((resolve,reject)=>{
    //找出以当前年月开头的记录
    let regExp = new RegExp('^'+date);
    AttendanceShiftData.find({date:regExp},function(err,docs){
      if(err){
        reject()
      }else{
        resolve(docs)
      }
    })
  })

  Promise.all([tempStaffPromise,regularStaffPromise,currentMonthShiftData]).then((results)=>{
    res.json({
      status:returnedCodes.CODE_SUCCESS,
      tempStaffList:results[0],
      regularStaffList:results[1],
      currentMonthData:results[2]
    })
  }).catch(()=>{
    res.json({
      status:returnedCodes.CODE_ERROR
    })
  })

});

//下载word文档的接口
router.post('/downloadAttendanceWordFile',function(req,res){
  let date = req.body.date;
  let group = req.group;
  //获取公告数据
  let announcePromise = new Promise((resolve,reject)=>{
    AttendanceAnnounce.find({},function(err,docs){
      if(err){
        reject()
      }else{
        let ret = {};
        docs.forEach((item)=>{
          ret[item.type] = item.content
        });
        resolve(ret)
      }
    })
  });
  //获取排班记录数据
  let shiftPromise = new Promise((resolve,reject)=>{
    AttendanceShiftData.find({group,date},function(err,docs){
      if(err){
        reject()
      }else{
        resolve(docs)
      }
    })
  });

  Promise.all([announcePromise,shiftPromise]).then((results)=>{
    //匹配html标签的正则表达式
    let htmlTagRegExp = /<[^>]+>/gim;
    //公告数据
    let announceData = results[0];
    //排班数据
    let shiftData = results[1];
    //生成docx对象
    let docx = officegen('docx');
    //标题
    let pObj = docx.createP();
    pObj.options.align = 'center';
    pObj.addText(date+'排班记录',{ bold: true,});
    //换行
    pObj.addLineBreak ();
    pObj.addLineBreak ();
    //公告
    let pObj_announce = docx.createP();
    pObj_announce.addText('公告内容',{ bold: true,})
    pObj_announce.addLineBreak ();
    //正则表达式除去所有的html标签
    pObj_announce.addText(announceData.up.replace(htmlTagRegExp,'')?announceData.up.replace(htmlTagRegExp,''):'无');
    pObj_announce.addLineBreak ();
    pObj_announce.addLineBreak ();
    //排班信息
    shiftData.forEach((item,index)=>{
      let pObj_shift = docx.createP();
      pObj_shift.addText('车间:   ',{ bold: true,})
      pObj_shift.addText(item.workshop?item.workshop:'无')

      pObj_shift.addText('    工序:    ',{ bold: true,})
      pObj_shift.addText(item.process?item.process:'无');

      pObj_shift.addText('    班次:    ',{ bold: true,})
      pObj_shift.addText(item.shift?item.shift:'无');

      if(item.startTime||item.endTime){
        pObj_shift.addText('    时间:    ',{ bold: true,});
        pObj_shift.addText((item.startTime?item.startTime:'无')+'-'+(item.endTime?item.endTime:'无'));
        pObj_shift.addLineBreak ();
      }else{
        pObj_shift.addText('    标准工时    ',{ bold: true,});
        pObj_shift.addLineBreak ();
      }
      //正式人员
      pObj_shift.addText('正式人员:    ',{ bold: true,});
      item.regularStaffList.forEach((staff)=>{
        pObj_shift.addText(staff+'  ');
      });
      if(item.regularStaffList.length===0){
        pObj_shift.addText('无');
      }

      //临时人员
      pObj_shift.addText('    临时人员:    ',{ bold: true,});
      item.tempStaffList.forEach((staff)=>{
        pObj_shift.addText(staff+'  ');
      });
      if(item.tempStaffList.length===0){
        pObj_shift.addText('无');
      }
      pObj_shift.addLineBreak ();

      pObj_shift.addText('排班内容:    ',{ bold: true,})
      pObj_shift.addText(item.workContent?item.workContent:'无');
      pObj_shift.addLineBreak ();
      if(index!==shiftData.length-1){
        pObj_shift.addHorizontalLine ();
      }
    });
    //公告
    let pObj_announce_down = docx.createP();
    pObj_announce_down.addLineBreak ();
    pObj_announce_down.addText('公告内容',{ bold: true,})
    pObj_announce_down.addLineBreak ();
    pObj_announce_down.addText(announceData.down.replace(htmlTagRegExp,'')?announceData.down.replace(htmlTagRegExp,''):'无');

    //将docx的流数据返回前端(blob类型)
    res.status(200).set({
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      'Content-disposition': 'attachment; filename=out.docx'
    });
    docx.generate(res)
  }).catch(()=>{
    res.json({
      status:returnedCodes.CODE_ERROR
    })
  })

});


module.exports = router;
