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
}

export default config
