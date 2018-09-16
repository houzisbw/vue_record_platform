/**
 * Created by Administrator on 2018/9/16.
 */
//指令文件
let directives = {
  //依据权限渲染组件与否的指令,该指令需要参数:允许显示的权限列表
  auth:{
    bind: function (el, binding, vnode) {
      let authList = binding.value;
      let userAuth = vnode.context.$store.getters.getUserAuth;
      //必须包在nextTick中，否则parentNode为null
      vnode.context.$nextTick(function(){
        if(!authList.includes(userAuth)){
          el.parentNode.removeChild(el);
        }
      })
    }
  }
}

export default directives
