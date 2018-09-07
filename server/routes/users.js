var express = require('express');
var router = express.Router();
var User = require('./../model/user')
//处理token相关
var jwt = require('jwt-simple')
//token密钥
var secret = require('./../config').tokenSecret;
//token过期时间
var expires = require('./../config').tokenExpireTime;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

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
        status:-1
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
          status:1,
          userInfo:doc
        })

      }else{
        //未找到用户
        res.json({
          status:0
        })
      }

    }
  })

})

module.exports = router;
