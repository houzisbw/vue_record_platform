/**
 * Created by Administrator on 2018/9/10.
 */
var jwt = require('jwt-simple');
var secret = require('./config').tokenSecret
var User = require('./model/user')
var unCheckedUrls = require('./config').unCheckedUrls;
var returnedCodes = require('./config').returnedCodes;
//后台统一拦截检查是否登录的方法
let interceptorRequest = function(req,res,next){
  //如果该path不需要校验登录
  if(unCheckedUrls.indexOf(req.path)!==-1){
    next();
    return
  }
  //获取由cookie带来的token
  let token = req.cookies.usertoken;
  if(token){
    //检查token是否过期
    try{
      let decodedToken = jwt.decode(token,secret);
      //token已经过期
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
              //将user挂载到req上供后续请求使用
              req.user = username
              //继续下一步
              next()
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
}


module.exports = {
  interceptorRequest
}
