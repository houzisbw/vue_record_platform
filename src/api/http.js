/**
 * Created by Administrator on 2018/9/6.
 */
//axios拦截器,导出axios供接口请求使用
import axios from 'axios'
import router from './../router/index'
import config from './../config/config'
import { Message } from 'element-ui'
// axios 配置
axios.defaults.timeout = 5000;
//带上cookie(axios默认不带cookie)
axios.defaults.withCredentials=true;

//响应拦截器，处理错误
axios.interceptors.response.use(
  response => {
    //如果后端返回登录失效则跳转登录页
    if(response.data.status === config.loginExpire){
      router.replace({
        path:'/login'
      })
    }
    return response
  },
  error => {
    //统一错误处理
    Message.error({
      message:'错误码:'+(config.httpCode[error.response.status]||'')
    })
    return Promise.reject(error)
  },
)




export default axios

