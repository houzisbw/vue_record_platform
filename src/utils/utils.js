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

module.exports = {
  getOffsetX,
  getOffsetY,
  throttle,
  isIE,
  dataURLtoBlob
}
