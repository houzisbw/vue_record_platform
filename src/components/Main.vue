<!--主体内容部分 -->
<template>
  <div class="main">
    <header-comp></header-comp>
  </div>
</template>

<script>
  import HeaderComp from './Header.vue'
	export default {
  	components:{
      HeaderComp
    },
		name: 'Main',
		data () {
			return {
				msg: 'Welcome to Your Vue.js App'
			}
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
  }
</style>
