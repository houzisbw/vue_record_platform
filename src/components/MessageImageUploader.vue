<!--新鲜事的图片上传组件-->
<template>
  <div class="wrapper">
    <input type="file"
           multiple
           @change="handleChange"
           accept="image/jpg,image/png,image/jpeg"
           :id="inputId"
           class="input">
    <!--图片预览框-->
    <div class="img-preview-wrapper">
      <div class="img-preview-box"
           draggable="true"
           @dragstart="handleDragStart"
           @dragover="handleDragOver"
           @drop="handleDrop"
           v-for="(item,index) in imageUrlList"
           :style="{backgroundImage:'url('+item+')'}"
           :data-src="item">
        <!--鼠标移上去的遮罩,注意这里ondrop的target是这个遮罩div，所以得加上src-->
        <div class="img-overlay" :data-src="item">
          <span :data-src="item">按住鼠标拖动</span>
        </div>
        <!--删除按钮-->
        <span class="delete-img"
              :data-src="item"
              @click="deleteImage(index)">
        </span>
      </div>
      <!--图片上传按钮-->
      <label class="img-select-box" :for="inputId" v-if="imageFileList.length>0 && canAddImage">
      </label>
    </div>
  </div>
</template>

<script>
	export default {
		name: 'MessageImageUploader',
    props:{
			//输入框的id
			inputId:{
				type:String,
        required:true
      },
      //最大图片上传数
      maxImageNum:{
				type:Number,
        required:true
      }
    },
		data () {
			return {
        //最大文件尺寸(byte)
        maxImageSize:4*1024*1024,
        //存储文件对象的数组
        imageFileList:[],
        //存储图片url的数组
        imageUrlList:[],
        //合法的图片类型
        imageValidTypes:['image/jpg','image/png','image/jpeg']
			}
		},
    computed:{
			//是否可以继续添加图片
      canAddImage:function(){
      	return this.imageFileList.length < this.maxImageNum
      }
    },
    methods:{
			//图片拖动
      handleDragStart: function(e){
      	if(!e.target.dataset.src)return
      	e.dataTransfer.setData('imgSrc',e.target.dataset.src)
      },
      handleDragOver: function(e){
      	e.preventDefault()
      },
      handleDrop: function(e){
        e.preventDefault();
        let data = e.dataTransfer.getData("imgSrc");
        //如果图片放置目标等于自己则返回
        if(!data || data === e.target.dataset.src)return;
        //找到该图片的index
        let index = this.imageUrlList.indexOf(data);
        //找到要放置的图片的index
        let targetIndex = this.imageUrlList.indexOf(e.target.dataset.src);
        //将这2张图片调换位置
        let tempImageUrlList = this.imageUrlList.slice();
        this.switchPositionInArray(tempImageUrlList,index,targetIndex);
        this.imageUrlList = tempImageUrlList;
        //调换file数组
        let tempImageFileList = this.imageFileList.slice();
        this.switchPositionInArray(tempImageFileList,index,targetIndex);
        this.imageFileList = tempImageFileList;
        //把图片流传递给父组件
        this.$emit('change',tempImageFileList);
      },
      // 调换数组中2个元素的位置
      switchPositionInArray: function(arr,index1,index2){
      	let temp = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp;
      },

			//图片删除(未上传)
      deleteImage: function(index){
      	let tempImageUrlList = this.imageUrlList.slice();
        tempImageUrlList.splice(index,1);
        this.imageUrlList = tempImageUrlList;

        let tempImageFileList = this.imageFileList.slice();
        tempImageFileList.splice(index,1);
        this.imageFileList = tempImageFileList;
        //通知父组件是否可以继续添加图片
        this.$emit('can-add',this.canAddImage);
        //把图片流传递给父组件
        this.$emit('change',this.imageFileList);
      },

      //input的change事件
      handleChange:function(e){
        let fileList = e.target.files;
        //计算剩余可放入的图片数量
        let leftImageNum = this.maxImageNum - this.imageFileList.length;
        //计算合理图片的数量,注意fileList是类数组,需要转化为数组
        let validFileList = Array.from(fileList).filter((item)=>{return this.checkImageValid(item)}).slice(0,leftImageNum);
        //计算图片的url(blob:https://....这种类型的,用css的background-image来展示图片)
        let tempImageFileList = this.imageFileList.slice();
        let tempImageUrlList = this.imageUrlList.slice();
        validFileList.forEach((item)=>{
        	let imageUrl = this.getObjectURL(item);
        	tempImageFileList.push(item);
        	tempImageUrlList.push(imageUrl);
        });
        this.imageFileList = tempImageFileList;
        this.imageUrlList = tempImageUrlList;
        //处理相同图片的问题
        e.target.value = '';
        //通知父组件是否可以继续添加图片,注意是短横线命名法
        this.$emit('can-add',this.canAddImage);
        //把图片流传递给父组件
        this.$emit('change',this.imageFileList);
      },
      //检查图片是否符合要求
      checkImageValid: function(imageFile){
      	// 图片大小
        let isSizeValid = imageFile.size <= this.maxImageSize;
        // 图片类型
        let isTypeValid = this.imageValidTypes.includes(imageFile.type);
        return isSizeValid && isTypeValid
      },
      //获取文件的url，用于图片预览
      getObjectURL: function(file){
        let url = null ;
        if (window.createObjectURL!=undefined) { // basic
          url = window.createObjectURL(file) ;
        } else if (window.URL!=undefined) { // mozilla(firefox)
          url = window.URL.createObjectURL(file) ;
        } else if (window.webkitURL!=undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(file) ;
        }
        return url ;
      },
      //清除内存中的url
      revokeObjectURL: function(file){
        if (window.URL) {
          return window.URL.revokeObjectURL(file)
        } else {
          return window.webkitURL.revokeObjectURL(file)
        }
      }
    }
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
.wrapper{
  .input{
    display: none;
  }
  .img-preview-wrapper{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 0 10px;
    .img-select-box{
      width:80px;
      height:80px;
      border:1px dashed #cbcbcb;
      margin-bottom: 10px;
      position: relative;
      cursor:pointer;
      &:hover{
        border-color: #e0e0e0;
        &:before,&:after{
          background-color: #e0e0e0;
        }
      }
      &:before,&:after{
        content:'';
        width:20px;
        height:2px;
        background-color: #d1d1d1;
        position: absolute;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%);
      }
      &:after{
        transform: translate(-50%,-50%) rotate(90deg);
      }
    }
    .img-preview-box{
      width:80px;
      height:80px;
      background-position: 50%;
      background-size: cover;
      background-repeat: no-repeat;
      margin: 0 10px 10px 0;
      position: relative;
      cursor:pointer;
      /*不用mouseover来做，这样很简单*/
      &:hover .img-overlay{
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .img-overlay{
        position: absolute;
        left:0;
        top:0;
        right:0;
        bottom:0;
        background-color: rgba(0,0,0,0.3);
        display: none;
        span{
          color:#fff;
          font-size: 10px;

        }
      }
      .delete-img{
        position: absolute;
        top:5px;
        right:5px;
        display: block;
        cursor: pointer;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 1px solid #c5c5c5;
        background: rgba(0,0,0,.4);
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
        &:after,&:before{
          content:'';
          width: 9px;
          height: 1px;
          display: block;
          position: absolute;
          background: #fff;
          left: 50%;
          top: 50%;
          -webkit-transform: translate(-50%,-50%);
          transform: translate(-50%,-50%);
        }
        &:before{
          transform: translate(-50%,-50%) rotate(90deg);
        }
      }
    }
  }
}
</style>
