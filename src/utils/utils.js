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

module.exports = {
  getOffsetX,
  getOffsetY,
  throttle
}
