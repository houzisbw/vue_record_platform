var express = require('express');
var router = express.Router();
var User = require('./../model/user')
//处理token相关
var jwt = require('jwt-simple')
//token密钥
var secret = require('./../config').tokenSecret;
//token过期时间
var expires = require('./../config').tokenExpireTime;
//返回状态码
var returnedCodes = require('./../config').returnedCodes;


/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

//用户登录
router.post('/login',function(req,res,next){
  let username = req.body.username,
      password = req.body.password,
      remember = req.body.rememberMe;
  //查询数据库
  let query = User.where({username:username,password:password})
  query.findOne(function(err,doc){
    //返回前端状态码:-1网络或查询出错，0用户名或密码错误，1密码用户名都正确
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      if(doc){
        //找到用户,生成token存到cookie中
        let payload = {
          //过期时间
          exp:Date.now()+expires,
          //用户名
          iss:username
        };
        let token = jwt.encode(payload,secret);
        //如果选择了记住我
        if(remember){
            //设置httpOnly防止客户端获取token
            res.cookie('usertoken',token,{
              httpOnly:true,
              maxAge:expires,
              path:'/'
            })
        }else{
            res.cookie('usertoken',token,{
              httpOnly:true,
              path:'/'
            })
        }
        //返回用户的权限，用户名，昵称，头像url
        res.json({
          status:returnedCodes.CODE_SUCCESS,
          userInfo:doc
        })

      }else{
        //未找到用户
        res.json({
          status:returnedCodes.CODE_LOGIN_INCORRECT
        })
      }

    }
  })

})

//用户登出
router.post('/logout',function(req,res){
  //清除cookie即可
  res.clearCookie('usertoken');
  //返回前端时cookie就被清掉了
  res.json({
    status:returnedCodes.CODE_SUCCESS
  })
})

//检查用户是否处于登录状态(检查token是否合法)
router.post('/checkIsLogin',function(req,res){
  //获取由cookie带来的token
  let token = req.cookies.usertoken;
  if(token){
    //检查token是否过期
    try{
      let decodedToken = jwt.decode(token,secret);
      //检查是否过期
      if(decodedToken.exp < Date.now()){
        //清除token
        res.clearCookie('usertoken');
        res.json({
          status:returnedCodes.CODE_LOGIN_EXPIRE
        })
      }else{
        //未过期,查询是否有该用户
        let username = decodedToken.iss;
        let query = User.where({username:username});
        query.findOne(function(err,doc){
          if(err){
            res.json({
              status:returnedCodes.CODE_ERROR
            })
          }else{
            if(doc){
              //用户存在,说明处于登录态
              res.json({
                status:returnedCodes.CODE_SUCCESS
              })
            }else{
              res.json({
                status:returnedCodes.CODE_ERROR
              })
            }
          }
        })
      }
    }catch(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }
  }else{
    //cookie已过期
    res.json({
      status:returnedCodes.CODE_LOGIN_EXPIRE
    })
  }
});

//更新用户的基本信息
router.post('/updateUserInfo',function(req,res){
    let nickname = req.body.nickname,
        signature = req.body.signature;
    //获取拦截器生成的用户名
    let user = req.user || '';
    let updateInfo = {
      nickname:nickname,
      signature:signature
    };
    //后端也要检查昵称是否为空,防止抓包修改
    if(!nickname){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
      return
    }
    User.findOneAndUpdate({username:user},updateInfo,function(err){
      if(err){
        res.json({
          status:returnedCodes.CODE_ERROR
        })
      }else{
        res.json({
          status:returnedCodes.CODE_SUCCESS
        })
      }
    });
});

//获取用户基本信息
router.get('/fetchUserInfo',function(req,res,next){
  let user = req.user || '';
  let query = User.where({username:user})
  query.findOne(function(err,doc){
    if(err){
      res.json({
        status:returnedCodes.CODE_ERROR
      })
    }else{
      if(doc){
        //找到用户
        res.json({
          status:returnedCodes.CODE_SUCCESS,
          nickname:doc.nickname,
          signature:doc.signature
        })
      }else{
        res.json({
          status:returnedCodes.CODE_ERROR
        })
      }
    }
  })
});





module.exports = router;
