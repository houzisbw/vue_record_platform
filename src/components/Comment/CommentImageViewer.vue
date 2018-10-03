<!--评论中的全屏图片查看组件-->
<template>
  <div class="comment-image-viewer-wrapper">
    <img src="https://i.loli.net/2018/10/03/5bb481ac74057.jpg" class="image"/>
    <!--loading状态的图标-->
  </div>
</template>

<script>
	export default {
		name: 'CommentImageViewer',
    mounted:function(){
			//鼠标滚轮滚动关闭该组件
      window.addEventListener('scroll',this.close)
    },
    methods:{
    	//隐藏该组件
      close:function(){
      	this.$emit('close')
      }
    },
		data () {
			return {

			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
.comment-image-viewer-wrapper{
  position: fixed;
  left:0;
  top:0;
  right:0;
  bottom:0;
  background-color: rgba(0,0,0,0.8);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  .image{

  }
}
</style>
