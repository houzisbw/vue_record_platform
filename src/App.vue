<template>
  <div id="app">
    <!--渲染顶级路由/xxx之类的-->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  created:function(){
  	//从localStorage中恢复vuex中状态
    this.initVuex();
  },
  methods:{
  	initVuex:function(){
  		//获取用户信息
      let username = window.localStorage.getItem('username');
      let profileImgUrl = window.localStorage.getItem('profileImgUrl');
      let nickname = window.localStorage.getItem('nickname');
      let auth = window.localStorage.getItem('auth');
      let signature = window.localStorage.getItem('signature');
      //注意必须判断存在username才行，否则就是非登录状态
      if(username){
        this.$store.commit('updateUserName',username);
        this.$store.commit('updateUserProfile',profileImgUrl);
        this.$store.commit('updateUserNickname',nickname);
        this.$store.commit('updateUserAuth',auth);
        this.$store.commit('updateUserSignature',signature);
      }
    }
  }
}
</script>

<style type="text/less" lang="less" >
  #app{
    height:100%;
  }

</style>
