/**
 * Created by Administrator on 2018/9/17.
 */
//获取offsetX和offsetY
function getOffsetX(event){
  var evt =event||window.event;
  var srcObj = evt.target || evt.srcElement;
  if (evt.offsetX){
    return evt.offsetX;
  }else{
    //获取元素相对于视口的位置
    var rect = srcObj.getBoundingClientRect();
    //获取鼠标位置距离视口左侧的距离
    var clientx = evt.clientX;
    return clientx - rect.left;
  }
}

function getOffsetY(event){
  var evt =event||window.event;
  var srcObj = evt.target || evt.srcElement;
  if (evt.offsetY){
    return evt.offsetY;
  }else{
    var rect = srcObj.getBoundingClientRect();
    var clienty = evt.clientY;
    return clienty - rect.top;
  }
}

//节流
function throttle(fn,delay){
  var last = 0;
  return function(){
    var now = +new Date();
    if(now-last>delay){
      fn.apply(this,arguments)
      last = now;
    }
  }
}

//判断是否是ie
const isIE = ()=>{
  let ua = window.navigator.userAgent.toLowerCase();
  return /msie|trident/.test(ua)
}

//dataURL转为blob对象
function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}

//时间转化函数,参数是毫秒
function timeConvertToChinese(timestamp){
  /*
   * 策略:
   * (1)5分钟内显示 刚刚
   * (2)5分钟-1小时内显示 x分钟
   * (3)大于1小时小于1天，显示x小时
   * (4)大于1天小于1个月，显示x天
   * (5)大于一个月小于一年,显示x月
   * (6)大于一年，显示x年
   *
   * */
  //一秒钟
  let second = 1000;
  let timeMap = {
    //刚刚
    [0]:function(){
      return '刚刚'
    },
    //5分-1小时
    [5*60*second]:function(){
      return parseInt(timestamp/(60*second),10)+'分钟前'
    },
    //1小时-1天
    [60*60*second]:function(){
      return parseInt(timestamp/(60*60*second),10)+'小时前'
    },
    //1天-一个月
    [60*60*second*24]:function(){
      return parseInt(timestamp/(60*60*second*24),10)+'天前'
    },
    //一个月-一年
    [60*60*second*24*30]:function(){
      return parseInt(timestamp/(60*60*second*24*30),10)+'个月前'
    },
    //一年-无穷
    [60*60*second*24*365]:function(){
      return parseInt(timestamp/(60*60*second*24*365),10)+'年前'
    }
  };
  let timeArray = [0,5*60*second,60*60*second,60*60*second*24,60*60*second*24*30,60*60*second*24*365,Infinity];
  let index = 0;
  for(var i=0;i<timeArray.length-1;i++){
    if(timestamp < timeArray[i+1]){
      index = i;
      break;
    }
  }
  return timeMap[timeArray[index]]()
}

//第三方图床网站图片上传
const uploadImageToPictureBed = (axios,imgList)=>{
  return new Promise((res,rej)=>{
    let promises = [];
    //如果没有上传图片
    if(imgList.length === 0){
      res([])
    }
    imgList.forEach((item)=>{
      let formData = new FormData();
      formData.append('smfile',item);
      let promise = new Promise((resolve,reject)=>{

        /*   生产环境改为正常的url  */

        axios.post('/avatarUpload',formData).then((resp)=>{
          let imgUrl = resp.data.data.url;
          if(resp.data.code === 'success'){
            resolve(imgUrl)
          }else{
            reject();
          }
        }).catch(()=>{
          reject()
        })
      });
      promises.push(promise);
    });
    Promise.all(promises).then((results)=>{
      res(results)
    }).catch((err)=>{
      //失败
      rej();
    })
  });
}

export default {
  getOffsetX,
  getOffsetY,
  throttle,
  isIE,
  dataURLtoBlob,
  timeConvertToChinese,
  uploadImageToPictureBed
};
