/**
 * Created by Administrator on 2018/9/6.
 */
//服务端配置信息
module.exports =  {
  tokenSecret:'sbwlqy',
  //token过期时间(ms),默认一周
  tokenExpireTime:1000*60*60*24*7,
  //不用校验的url
  unCheckedUrls:['/users/login'],
  //返回给前端的状态码
  returnedCodes:{
    //出错
    CODE_ERROR:-1,
    //登录过期
    CODE_LOGIN_EXPIRE:-2,
    //成功
    CODE_SUCCESS:1,
    //用户名或密码错误
    CODE_LOGIN_INCORRECT:0,
    //用户名已存在
    CODE_USERNAME_EXIST:3
  }
}
