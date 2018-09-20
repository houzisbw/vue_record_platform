<!--照片大图组件(放大镜原理:一大一小2张图，大图用transform:scale放大，然后计算大小图的比例来修正left,top)-->
<template>
  <div class="overlay">
    <div class="img-wrapper" ref="imgWrapper">
      <img :src="imgSrc"
           ref="img"
           v-show="isImgLoaded"
           @load="handleImgLoad"
           @mouseenter="handleMouseEnter"
           @mousemove="handleMouseMove"
           @mouseleave="handleMouseLeave"
           alt="图片无法显示"
           class="img"/>
      <!--加载中-->
      <div v-show="!isImgLoaded">
        <bar-loading></bar-loading>
      </div>
      <!--放大的图片-->
      <div class="detail-img" v-show="isDetailBoxShow" ref="detailBox">
        <img :src="imgSrc" ref="bigImg" class="big-img"/>
      </div>
    </div>
    <!--关闭按钮-->
    <div class="close-btn" @click="closeAlbum">
      <i class="iconfont icon-close close-img"></i>
    </div>
    <!--下载按钮-->
    <div class="download-btn" v-if="isImgLoaded" >
      <span @click="downloadImg" ref="download" >
        <el-tooltip  effect="dark" content="下载图片" placement="top">
          <!--i标签设置outline为none防止出现蓝色边框-->
          <i class="iconfont icon-download" style="font-size:60px;border:none;outline:none;"></i>
        </el-tooltip>
      </span>
    </div>
  </div>
</template>

<script>
  //用@来避免相对路径查找,定义在webpack.base.conf中
  import BarLoading from '@/components/Loading/BarLoading.vue'
  import utils from '@/utils/utils'
	export default {
		name: 'Album',
    components:{
      BarLoading
    },
    props:{
			//图片src
			imgSrc:{
				type:String,
        default:''
      },
      //是否显示
      show:{
				type:Boolean,
        default:false
      }
    },
    mounted:function(){
      //console.log('mounted')
    },
    methods:{
			//下载图片,注意添加节流函数,1s内只能下载一次
      downloadImg: utils.throttle(function(e){
        e.preventDefault();
        const imgUrl = this.imgSrc;
        var image = new Image();
        // 解决跨域 Canvas 污染问题
        image.setAttribute("crossOrigin", "anonymous");
        image.onload = function() {
          var canvas = document.createElement("canvas");
          //图片太大会导致下载错误，因此减少图片大小
          canvas.width = image.width/4;
          canvas.height = image.height/4;
          var context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, image.width/4, image.height/4);
          var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
          //如果是ie(ie不支持a标签的download属性)
          if(utils.isIE()){
            //生成blob
            var blob = utils.dataURLtoBlob(url);
            //调用ie的方法进行下载
            window.navigator.msSaveBlob(blob,'photo.png')
          }else{
            var a = document.createElement("a"); // 生成一个a元素
            var event = new MouseEvent("click"); // 创建一个单击事件
            a.download = "photo.png"; // 设置图片名称
            a.href = url; // 将生成的URL设置为a.href属性
            a.dispatchEvent(event); // 触发a的单击事件
          }
        };
        image.src = imgUrl;
      },1000),

			//图片加载完成
      handleImgLoad: function(){
        this.isImgLoaded = true;
      },
			//关闭该组件,父组件捕获close事件进行处理
      closeAlbum: function(){
      	this.$emit('close')
      },
      //处理鼠标移入
      handleMouseEnter: function(){
        this.isDetailBoxShow = true;
      },
      //处理鼠标移出
      handleMouseLeave: function(){
        this.isDetailBoxShow = false;
      },
      //处理鼠标移动
      handleMouseMove: function(e){
      	//获取offsetX和offsetY，注意不能直接用e.offsetX,兼容性问题
      	let offsetX = utils.getOffsetX(e);
        let offsetY = utils.getOffsetY(e);
        //获取图片左侧距离外层wrapper左侧的距离
        let imgWrapperClientWidth = this.$refs.imgWrapper.clientWidth;
      	let imgClientWidth = this.$refs.img.clientWidth;
        let imgLeftPadding = parseInt((imgWrapperClientWidth - imgClientWidth)/2,10);
        //获取图片上侧距离外层wrapper上侧的距离
        let imgWrapperClientHeight = this.$refs.imgWrapper.clientHeight;
        let imgClientHeight = this.$refs.img.clientHeight;
        let imgTopPadding = parseInt((imgWrapperClientHeight - imgClientHeight)/2,10);
        //设置detailBox的位置为鼠标位置的右下角
        let detailBoxDom = this.$refs.detailBox;
        detailBoxDom.style.left = offsetX + imgLeftPadding + 15 +'px';
        detailBoxDom.style.top = offsetY + imgTopPadding + 15 +'px';

        //计算大图和小图的比例
        let bigImg = this.$refs.bigImg;
        let bigImgClientWidth = bigImg.clientWidth;
        let ratio = (bigImgClientWidth / imgClientWidth).toFixed(2);
        //计算大图的位移
        let bigImgLeft = offsetX * ratio;
        let bigImgTop = offsetY * ratio;
        //注意大图的left和top是负值
        bigImg.style.left = -bigImgLeft + 'px';
        bigImg.style.top = -bigImgTop + 'px';
      }
    },
		data () {
			return {
				//是否显示放大的小图
        isDetailBoxShow:false,
        //图片是否加载完成
        isImgLoaded:false,
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
.overlay{
  position: fixed;
  left:0;
  top:0;
  right:0;
  bottom:0;
  //必须考虑到element的body上的弹出物的index
  z-index: 2000;
  background-color: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  .img-wrapper{
    width:60%;
    height:60%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .img{
      background-size: contain;
      max-width:100%;
      max-height:100%;
      cursor:crosshair;
      transform: scale(1);
    }
    .detail-img{
      width:250px;
      height:250px;
      background-color: #000;
      position: absolute;
      left:0;
      top:0;
      //防止鼠标移动过快导致该元素隐藏
      cursor: none;
      overflow: hidden;
      border:2px solid #fff;
      z-index:3000;
      .big-img{
        //注意这里scale后必须设置transform-origin变化原点为左上角，否则不行
        transform: scale(1);
        transform-origin: 0 0;
        position: absolute;
        left:0;
        top:0;
      }
    }
  }
  .close-btn{
    position: absolute;
    right:0;
    top:0;
    width:60px;
    height:60px;
    cursor: pointer;

    .close-img{
      color:#fff;
      position: absolute;
      right:0;
      top:0;
      font-size:80px;
    }
  }
  .download-btn{
    color:#fff;
    position: absolute;
    left:50%;
    bottom:5px;
    transform:translateX(-50%);
    cursor:pointer;
    a{
      outline:none;
      &:focus{
        outline:none;
      }
    }

  }
}
</style>
