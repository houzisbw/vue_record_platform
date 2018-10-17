<!--主体内容部分 -->
<template>
  <div class="main">
    <header-comp></header-comp>
    <!--路由切换时显示加载效果-->
    <div class="main-wrapper" v-loading="isRouterLoading">
      <router-view></router-view>
      <!--补丁区域-->
      <div class="padding-comp">
      </div>
    </div>
  </div>
</template>

<script>
  import HeaderComp from './Header.vue'
	export default {
  	components:{
      HeaderComp
    },
    computed:{
  		//路由是否在加载中(vuex中获取数据)
      isRouterLoading:function(){
      	return this.$store.getters.getIsRouterLoading;
      }
    },
		name: 'Main',
		data () {
			return {}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
  .main{
    flex-grow:1;
    min-height: 100vh;
    background-color: rgb(240, 242, 245);
    min-width: 800px;
    .main-wrapper{
      margin: 24px 24px 0 24px;
      box-sizing: border-box;
      .padding-comp{
        height:100px;
      }
    }
  }
</style>
