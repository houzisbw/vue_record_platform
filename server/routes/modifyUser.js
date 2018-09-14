/**
 * Created by Administrator on 2018/9/13.
 */
var express = require('express');
var router = express.Router();
var User = require('./../model/user')
var Auth = require('./../model/auth')
//返回状态码
var returnedCodes = require('./../config').returnedCodes;

//获取该超管下的用户的机密信息
router.post('/getUserCredentialInfo',function(req,res,next){
  let group = req.group,
      username = req.username;
  //获取每页数量和当前页数
  let pageSize = req.body.pageSize,
      currentPage = req.body.currentPage;
  //查找属于该超管的用户(组名区分),注意不能查找自己
  let condition = {
    group:group,
    username:{
      $ne:username
    }
  };
  //先获取数据总长度，再分页查询skip,limit
  User.count(condition,function(err,count){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      //跳过前currentPage-1页
      User.find(condition).skip((currentPage-1)*pageSize).limit(pageSize).exec(function(err1,docs){
        if(err1){
          res.json({
            status:returnedCodes.CODE_ERROR
          })
        }else{
          let ret = [];
          docs.forEach((item)=>{
            ret.push({
              username:item.username,
              password:item.password,
              auth:item.auth,
              group:item.group
            })
          });
          res.json({
            status:returnedCodes.CODE_SUCCESS,
            userData:ret,
            totalNum:count
          })
        }
      })
    }
  });
});

//获取用户权限列表
router.get('/fetchUserAuthList',function(req,res){
  Auth.find({},function(err,docs){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      res.json({
        status:returnedCodes.CODE_SUCCESS,
        authList:docs
      })
    }
  })
})

//修改用户信息
router.post('/modifyUserInfo',function(req,res){
  //获取用户的原始名字
  let originName = req.body.originName,
      username = req.body.modifiedName,
      userAuth = req.body.auth;
  //这里要判断新的名字和已有的名字不能重复
  User.find({},function(err1,doc1){
    if(err1){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      let isValidName = true;
      doc1.forEach((item)=>{
        if(item.username === username){
          isValidName = false
        }
      });
      //新名字可以和原来的一样
      if(username === originName){
        isValidName = true
      }
      //名字合法
      if(isValidName){
        User.findOneAndUpdate({username:originName},{
          username:username,
          auth:userAuth
        },function(err){
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
      }else{
        res.json({
          status:returnedCodes.CODE_USERNAME_EXIST
        })
      }
    }
  })
})

//添加新用户
router.post('/addUser',function(req,res){
  let password = req.body.password,
      username = req.body.username,
      auth = req.body.auth;
  let group = req.group;
  //判断新用户的名字是否重复
  User.findOne({username:username},function(err,doc){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      if(doc){
        res.json({
          status:returnedCodes.CODE_USERNAME_EXIST
        })
      }else{
        let newUser = new User({
          username:username,
          password:password,
          profileImgUrl:'',
          //昵称
          nickname:'',
          //签名
          signature:'',
          //权限
          auth:auth,
          //组别
          group:group||''
        });
        newUser.save();
        res.json({
          status:returnedCodes.CODE_SUCCESS
        })
      }
    }
  })
})

//删除用户
router.post('/deleteUser',function(req,res){
  let username = req.body.username;
  User.findOneAndRemove({username:username},function(err){
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
