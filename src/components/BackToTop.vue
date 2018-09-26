<!--回到顶部按钮-->
<template>
  <div class="wrapper" @click.stop="backToTop" v-show="isShow">
    <i class="el-icon-caret-top"></i>
  </div>
</template>

<script>
	export default {
		name: 'BackToTop',
		data () {
			return {
				isShow:false
      }
		},
    mounted:function(){
      window.addEventListener('scroll',this.toggleBackToTopButton);
    },
    beforeDestroy:function(){
      window.removeEventListener('scroll',this.toggleBackToTopButton);
    },
    methods:{
      backToTop: function(){
        window.scrollTo(0,0);
        this.isShow = false;
      },
      toggleBackToTopButton:function(){
      	//scrollTop,兼容非ie和ie
        let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        this.isShow = scrollTop>0;
      }
    }
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
@size:40px;
.wrapper{
  width:@size;
  height:@size;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 0 6px rgba(0,0,0,.12);
  z-index:9999;
  position: fixed;
  right:50px;
  bottom:50px;
  cursor: pointer;
  i{
    color:#409eff;
    line-height: @size;
    display: block;
    text-align: center;
    font-size: 18px;
  }
}
</style>
