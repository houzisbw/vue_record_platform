/**
 * Created by Administrator on 2018/9/6.
 */
//配置信息
var config = {
  //登录失效
  loginExpire:-2,
  //http错误的状态码
  httpCode:{
    400:'请求错误',
    401:'未授权，请登录',
    403:'拒绝访问',
    404:'页面不存在',
    408:'请求超时',
    500:'服务器内部错误',
    502:'网关错误',
    504:'网关超时',
    505:'HTTP版本不支持'
  },
  //后端自定义错误码
  backEndErrorCode:{
    '-1':'出现未知错误',
    '0':'用户名或密码错误'
  },
  //用户权限
  auth:{
    //超管
    SUPER_ADMIN:'2',
    //二级管理员
    ADMIN:'1',
    //普通用户
    ORDINARY_USER:'0'
  },
  //用户权限字段
  authName:{
    '2':'超级管理员',
    '1':'二级管理员',
    '0':'普通用户'
  },
  //用户默认头像
  defaultUserAvatarUrl:require('./../assets/images/icon/avatar_default_big.png'),
}

export default config
