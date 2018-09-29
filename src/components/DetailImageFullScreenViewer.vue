<!--大图全屏展示组件-->
<template>
  <div class="wrapper">
    <div class="content"
         @click="toggleZoomImage"
         :class="{zoomable:isCurrentImgLong,zoomed:isInZoomState}">
      <img class="img"
           ref="img"
           v-show="currentImageLoaded"
           :src="imageList[innerImageIndex]"/>
      <!--loading图-->
      <div class="loading-img" v-show="!currentImageLoaded">
        <bar-loading></bar-loading>
      </div>
    </div>
    <!--关闭按钮-->
    <div class="close-btn" @click="close" v-show="!isInZoomState">
    </div>
    <!--下一张图的按钮-->
    <div class="next-btn"
         @click="handleSwitchImage(1)"
         v-show="!isInZoomState && innerImageIndex < imageList.length-1">
      <i class="iconfont icon-right"></i>
    </div>
    <!--上一张图的按钮-->
    <div class="prev-btn"
         @click="handleSwitchImage(-1)"
         v-show="!isInZoomState && innerImageIndex !== 0">
      <i class="iconfont icon-left"></i>
    </div>
  </div>
</template>

<script>
  import BarLoading from '@/components/Loading/BarLoading.vue'
	export default {
		name: 'DetailImageFullScreenViewer',
    components:{
      BarLoading
    },
    props:{
			//图片数组
			imageList:{
				type:Array,
        required:true
      },
      //当前图片的index
      currentImageIndex:{
				type:Number,
        default:0
      }
    },
    mounted:function(){
			//初始化组件内的图片index，防止修改prop
			this.innerImageIndex = this.currentImageIndex;
			this.currentImg = this.$refs.img;
			let self = this;
      this.currentImg.onload = function(){
				self.currentImageLoaded = true;
				//计算是不是长图
        let ratio = self.currentImg.naturalHeight / self.currentImg.naturalWidth;
        if(ratio > self.longImageRatio){
          self.isCurrentImgLong = true;
        }
      }
    },
    computed:{
    },
    methods:{
    	//处理图片切换,dir为1是下一张，-1是上一张
      handleSwitchImage: function(dir){
        let len = this.imageList.length;
      	if(dir === 1){
      		//下一张
          if(this.innerImageIndex === len - 1){
            return
          }
          this.innerImageIndex = this.innerImageIndex+1;
        }else{
      		//上一张
          if(this.innerImageIndex === 0){
          	return
          }
          this.innerImageIndex = this.innerImageIndex-1;
        }
      },
    	//切换大图缩放
      toggleZoomImage: function(){
        this.isInZoomState = !this.isInZoomState;
      },
      close: function(){
      	this.$emit('close')
      }
    },
    created:function(){
			//为body添加overflow:hidden去除滚动条
      document.body.setAttribute('style','overflow:hidden;');
    },
    beforeDestroy:function(){
      document.body.removeAttribute('style');
    },
		data () {
			return {
        //当前图片是否加载完成
        currentImageLoaded:false,
        //当前图片
        currentImg:null,
        //当前图片是不是长图
        isCurrentImgLong:false,
        //图片为长图的阈值
        longImageRatio:1.8,
        //是否处于图片zoom的状态
        isInZoomState:false,
        //组件内的当前图片index
        innerImageIndex:0
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
.wrapper{
  position: fixed;
  left:0;
  top:0;
  width:100vw;
  height:100vh;
  z-index:10000;
  .zoomable{
    cursor:zoom-in;
  }
  /*放大状态下max-height设置为inherit使得图片的高度不受限制*/
  .zoomed{
    overflow: auto;
    .img{
      max-height: inherit!important;
    }
  }
  .content{
    position: absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
    background-color: #222;
    display: flex;
    justify-content: center;
    align-items: center;
    .img{
      max-width: 100vw;
      max-height: 100vh;
    }
    .loading-img{
      position: absolute;
    }
  }
  .close-btn{
    position: absolute;
    right:20px;
    top:20px;
    height:40px;
    width:40px;
    background-color: hsla(0,0%,59%,.5);
    border-radius: 50%;
    transition:all 0.2s;
    cursor:pointer;
    line-height: 40px;
    color:#fff;
    text-align: center;
    transform: rotate(45deg);
    &:hover{
      background-color: hsla(0, 0%, 80%, 0.5);
      transform:rotate(135deg);
    }
    &:after,&:before{
      content:'';
      width:2px;
      height:20px;
      display: block;
      background-color: #fff;
      position: absolute;
      left:50%;
      top:50%;
    }
    &:after{
      transform:translate(-50%,-50%);
    }
    &:before{
      /*注意有顺序关系*/
      transform:translate(-50%,-50%) rotate(90deg);
    }
  }
  .next-btn,.prev-btn{
    position: absolute;
    top:50%;
    transform: translateY(-50%);
    width:56px;
    height:56px;
    line-height: 56px;
    text-align: center;
    background-color: hsla(0,0%,41%,.5);
    border-radius: 50%;
    cursor: pointer;
    transition: all .2s;
    &:hover{
      background-color: hsla(0, 0%, 67%, 0.5);
    }
    i{
      color:#fff;
      font-size: 27px;
    }
  }
  .prev-btn{
    left:20px;
  }
  .next-btn{
    right:20px;
  }
}
</style>
