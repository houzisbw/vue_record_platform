<template>
  <div class="home">
    <!--侧栏-->
    <a-side>
    </a-side>
    <!--主体内容-->
    <main-content>
    </main-content>
    <!--回到顶部按钮-->
    <back-to-top>
    </back-to-top>
  </div>
</template>

<script>
  import ASide from './../components/Aside.vue'
  import MainContent from './../components/Main.vue'
  import BackToTop from '@/components/BackToTop.vue'
	export default {
  	components:{
      ASide,
      MainContent,
      BackToTop
    },
		name: 'Home',
		data () {
			return {
				msg: 'Welcome to Your Vue.js App'
			}
		},
    computed:{
			nickname:function(){
				return this.$store.getters.getUserNickname
      }
    }
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
  .home{
    display: flex;
    flex-direction: row;
    min-height: 100vh;
  }
</style>
