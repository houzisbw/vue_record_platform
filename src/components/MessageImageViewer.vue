<!--新鲜事图片展示组件，很复杂-->
<!--多张图时显示小的正方形图(根据图片数量决定div宽度col-x)，单图时显示大图-->
<!--主体结构是一个imgBox(放缩略图)和一个大图详情的组件 这2个做切换显示-->
<!--单图显示时的规则：
(1)首先判断应该显示为竖图还是横图，根据原图的长宽比来决定
(2)所有图片宽度width一定，变的只有高度
(3)高度/宽度超过一定值(1.8)显示长图标签,此时显示的图片的高度为宽度的1.45倍，否则按比例显示
(4)如果高度/宽度小于一定值(0.68)，则缩略图外框高度高度为宽度的0.68倍,且居中显示,否则按比例显示
-->
<!--多图时列数显示规则:
(1)1-4张为col-4，5,6为col-3,  7,8张为col-4， 9张为col-3
-->

<!--大图详情的显示规则:
(1)如果图片的宽度超过外层div的宽度，则宽度为div的宽度，高度按图片比例缩放
(2)如果图片的宽度未超过外层div的宽度,则图片按原尺寸显示，图片水平居中
(3)大图加载时的loading图默认宽高是固定的，宽度为外层div的宽度，高度略小
-->

<template>
  <div class="wrapper">
    <!--缩略图的div-->
    <div class="brief-view-wrapper" v-show="!isShowDetail" ref="outerWrapper">
      <!--如果是单张图-->
      <template v-if="isSingleImage">
        <div class="single-img-container"
             @click="showDetailImage(imageList[0])"
             :style="{backgroundImage:'url('+imageList[0]+')'}">
          <!--用div撑开图片-->
          <div class="ratio-holder" :style="{paddingTop: calcSingleImgHeight}">
          </div>
          <span class="long-image" v-if="isLongImage">长图</span>
        </div>
      </template>
      <!--多张图-->
      <template v-else>
        <!--图片放在backgroundImage属性中-->
        <div class="multiple-img-wrapper" :class="[colsOfMultipleImages]">
          <div class="multiple-img-container"
               v-for="(item,index) in imageList"
               @click="showDetailImage(item)"
               :style="{backgroundImage:'url('+item+')'}">
            <!--控制图片的高度和宽度一样，padding-top基于父元素的宽度-->
            <div class="ratio-holder" style="padding-top: 100%">
            </div>
          </div>
        </div>
      </template>
    </div>
    <!--详情图的div-->
    <div class="detail-view-wrapper" v-show="isShowDetail">
      <!--顶部操作栏-->
      <div class="top-panel">
        <div class="panel-item" @click="hideDetailImage">
          <i class="iconfont icon-zoomout icon-pos"></i>
          <span>收起</span>
        </div>
        <div class="panel-item" @click="showFullScreenViewer">
          <i class="iconfont icon-zoomin icon-pos"></i>
          <span>查看大图</span>
        </div>
        <div class="panel-item">
          <!--inline-block才能旋转，inline不行-->
          <i class="iconfont icon-reload icon-pos"
             style="transform: rotateY(-180deg);display:inline-block;">
          </i>
          <span>向左旋转</span>
        </div>
        <div class="panel-item">
          <i class="iconfont icon-reload icon-pos"></i>
          <span>向右旋转</span>
        </div>
      </div>
      <!--中间图片展示栏,注意需要设置高度，因为里面的img是绝对定位-->
      <div class="detail-img-wrapper" :style="{height:detailImageHeight+'px'}">
        <!--加载的logo-->
        <div class="detail-img-loading">
          <circle-loading fillColor="#9C9C9C" v-if="!isDetailImageLoaded">
          </circle-loading>
        </div>
        <img src=""
             ref="detailImage"
             v-show="isDetailImageLoaded"
             :style="{width:detailImageWidth+'px',height:detailImageHeight+'px'}"
             class="detail-img">
        <!--全屏大图组件-->
        <full-screen-viewer
          :imageList="imageList"
          @close="handleFullScreenViewerClose"
          v-if="isShowFullScreenViewer">
        </full-screen-viewer>
      </div>
    </div>
  </div>
</template>

<script>
  import FullScreenViewer from '@/components/DetailImageFullScreenViewer.vue'
  import CircleLoading from '@/components/Loading/CircleSVGLoading.vue'
	export default {
		name: 'MessageImageViewer',
    components:{
      CircleLoading,
      FullScreenViewer
    },
    props:{
			//图片url数组
			imageList:{
				type:Array,
        default:[]
      }
    },
    computed:{
			//单张图的高度计算
      calcSingleImgHeight: function(){
      	let self = this;
        let image = new Image();
        //获取图片的原始尺寸并计算比例
        //图片较大的话必须等图片加载完成才能获取尺寸
        image.onload = function(){
          self.singleImageNaturalWidth = image.naturalWidth;
          self.singleImageNaturalHeight = image.naturalHeight;
        };
        image.src = this.imageList[0];
        let ratio = this.singleImageNaturalWidth?this.singleImageNaturalHeight / this.singleImageNaturalWidth : 1;
        if(ratio < this.imageMinHeightRatio){
          ratio = this.imageMinHeightRatio
        }
        if(ratio > this.imageMaxHeightRatio){
          this.isLongImage = true;
          ratio = this.imageMaxHeightRatio
        }
      	return ratio*100+'%';
      },
			//是否是单张图
      isSingleImage:function(){
      	return !(this.imageList.length>1)
      },
      //多图时显示的列数的类
      colsOfMultipleImages:function(){
      	let len = this.imageList.length;
      	let map = {
      		1:'col-4',2:'col-4',3:'col-4',4:'col-4',
          5:'col-3',6:'col-3',7:'col-4',8:'col-4',
          9:'col-3',
        };
      	return len===0?'':map[len]
      },
      //详情大图的高度计算
      detailImageHeight:function(){
        if(!this.isDetailImageLoaded){
          //加载时高度固定
        	return this.loadingDefaultHeight
        }else{
        	//加载完成时高度为图片的高度
          let ratio = this.detailImageNaturalHeight / this.detailImageNaturalWidth;
          let imageHeight = ratio * this.detailImageWidth;
          return imageHeight
        }
      },
      //详情大图的宽度
      detailImageWidth:function(){
        //外层div的宽度
        let outerDiv = this.$refs.outerWrapper;
        let clientWidth = outerDiv?outerDiv.clientWidth:1;
        //计算大图的宽度是否大于最外层div的宽度
        if(clientWidth < this.detailImageNaturalWidth){
        	return clientWidth
        }else{
        	return this.detailImageNaturalWidth
        }
      }
    },
    methods:{
			//关闭全屏大图组件
      handleFullScreenViewerClose: function(){
        this.isShowFullScreenViewer = false;
      },
			//显示全屏大图组件
      showFullScreenViewer: function(){
      	this.isShowFullScreenViewer = true;
      },

      //展示详情大图
      showDetailImage: function(imgUrl){
      	let self = this;
      	//改变状态为大图加载中
      	this.isDetailImageLoaded = false;
      	//计算大图的原始尺寸
        let image = this.$refs.detailImage;
        image.onload = function(){
          self.isDetailImageLoaded = true;
          self.detailImageNaturalWidth = image.naturalWidth;
          self.detailImageNaturalHeight = image.naturalHeight;
        };
        image.src = imgUrl;
        this.isShowDetail = true;
      },
      //隐藏详情大图
      hideDetailImage: function(){
        this.isDetailImageLoaded = false;
        this.isShowDetail = false;
      },
    },
    mounted:function(){

    },
		data () {
			return {
        // 是否显示详情图组件
        isShowDetail:false,
        //图片为长图的极限值
        longImageLimitRatio:1.8,
        //图片高/宽比最小值
        imageMinHeightRatio:0.68,
        //图片高/宽比最大值
        imageMaxHeightRatio:1.45,
        //单图的原始尺寸
        singleImageNaturalWidth:0,
        singleImageNaturalHeight:0,
        //单图是否是长图
        isLongImage:false,

        /* 大图数据结构 */
        //大图加载时的默认高度px
        loadingDefaultHeight:320,
        //大图是否加载完成
        isDetailImageLoaded:false,
        //大图的原始尺寸
        detailImageNaturalWidth:0,
        detailImageNaturalHeight:0,

        //是否展示大图全屏组件
        isShowFullScreenViewer:false
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
.wrapper{
  width:100%;
  /*注意这里的box-shadow默认值是父元素的阴影，所以要设置为none*/
  box-shadow: none;
  .brief-view-wrapper{
    width:100%;
    display: flex;
    flex-wrap: wrap;
    /*未设置高度*/
    .multiple-img-wrapper{
      display: flex;
      flex-wrap: wrap;
      .multiple-img-container{
        width:110px;
        display: flex;
        flex-wrap: wrap;
        margin-top: 4px;
        margin-right: 4px;
        background-repeat: no-repeat;
        background-position: 50%;
        background-size: cover;
        cursor:zoom-in;
      }
    }
    .col-3{
      width:75%
    }
    .col-4{
      width:100%;
    }
    .single-img-container{
      width:200px;
      display: flex;
      flex-wrap: wrap;
      margin-top: 4px;
      margin-right: 4px;
      background-repeat: no-repeat;
      background-position: 50%;
      background-size: cover;
      cursor:zoom-in;
      position: relative;
      background-color: #f4f5f7;
      .long-image{
        position: absolute;
        right:10px;
        bottom:10px;
        padding: 3px 6px;
        font-size: 12px;
        color: #fff;
        background-color: rgba(0,0,0,.49);
        border: 1px solid #fff;
        border-radius: 2px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    }
  }
  .detail-view-wrapper{
    width:100%;
    .top-panel{
      height:32px;
      background-color: #f4f5f7;
      user-select:none;
      .panel-item{
        line-height: 32px;
        display: inline-block;
        padding:0 12px;
        font-size: 13px;
        color:#76797e;
        cursor: pointer;
        &:hover{
          color:#027fff;
        }
        .icon-pos{
          position: relative;
          top:1px;
        }
      }
    }
    .detail-img-wrapper{
      position: relative;
      background-color: #f4f5f7;
      width:100%;
      /*高度渐变的动画效果,必须加overflow:hidden*/
      transition: height 0.5s ease;
      overflow: hidden;
      .detail-img-loading{
        position: absolute;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%);
      }
      .detail-img{
        position: absolute;
        left:50%;
        top:0;
        transform:translate(-50%,0);
      }
    }
  }

}
</style>
