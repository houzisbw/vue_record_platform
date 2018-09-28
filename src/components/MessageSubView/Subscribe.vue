<!--新鲜事动态模块-->
<template>
  <div class="wrapper">
    <!--新鲜事组件测试-->
    <message></message>
  </div>
</template>

<script>
  import api from '@/api/api'
  import Message from '@/components/Message.vue'
	export default {
		name: 'Subscribe',
    components:{
      Message
    },
    mounted:function(){
			//请求数据，路由切换时会销毁和重建该组件
    },
		data () {
			return {

			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
.wrapper{
  background-color: #fff;
}
</style>
