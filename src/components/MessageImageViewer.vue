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

<template>
  <div class="wrapper">
    <!--缩略图的div-->
    <div class="brief-view-wrapper" v-show="!isShowDetail">
      <!--如果是单张图-->
      <template v-if="isSingleImage">
        <div class="single-img-container"
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
    </div>
  </div>
</template>

<script>
	export default {
		name: 'MessageImageViewer',
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
        image.src = this.imageList[0];
        //获取图片的原始尺寸并计算比例
        //图片较大的话必须等图片加载完成才能获取尺寸
        image.onload = function(){
          self.singleImageNaturalWidth = image.naturalWidth;
          self.singleImageNaturalHeight = image.naturalHeight;
        };
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
      }
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
        isLongImage:false
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

}
</style>
