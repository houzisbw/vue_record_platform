<!--评论中的全屏图片查看组件-->
<template>
  <div class="comment-image-viewer-wrapper" @click="close">
    <img :src="imgSrc"
         v-show="imgLoaded"
         ref="img"
         class="image"/>
    <!--loading状态的图标-->
    <bar-loading v-if="!imgLoaded"></bar-loading>
  </div>
</template>

<script>
  import BarLoading from '@/components/Loading/BarLoading'
	export default {
		name: 'CommentImageViewer',
    props:{
			imgSrc:{
				type:String,
        default:''
      }
    },
    components:{
      BarLoading
    },
    mounted:function(){
			let self = this;
			//鼠标滚轮滚动关闭该组件
      window.addEventListener('scroll',this.close);
      this.$refs.img.onload = function(){
        self.imgLoaded = true
      }
    },
    beforeDestroy:function(){
      window.removeEventListener('scroll',this.close)
    },
    methods:{
    	//隐藏该组件
      close:function(){
      	this.$emit('close')
      }
    },
		data () {
			return {
        imgLoaded:false
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
