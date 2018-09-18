<!--图片上传组件-->
<template>
  <div class="wrapper">
    <label for="recordImgInput" >
      <!--已经有图片时显示修改图片，没有上传时显示添加图片-->
      <div v-if="value">
        <div class="img-wrapper"
             v-show="isImgLoaded"
             @mouseleave="handleMouseLeave"
             @mouseenter="handleMouseEnter">
          <img :src="value"
               class="img"
               @load="imgOnLoad"/>
          <!--提示遮罩-->
          <div class="overlay-tip" v-if="isShowTip">
            <span class="overlay-tip-text">点此修改图片</span>
          </div>
        </div>
        <div class="loading" v-if="!isImgLoaded">
          <span>加载中...</span>
        </div>
      </div>
      <div v-else>
        <div class="add-img">
          <i class="el-icon-plus" style="font-size:22px;"></i>
        </div>
      </div>
    </label>

    <!--上传图片的input,隐藏掉-->
    <input type="file"
           :disabled="isInputDisabled"
           ref="recordImgInput"
           id="recordImgInput"
           accept="image/*"
           @change="handleFileChange"
           class="file-input">
  </div>
</template>

<script>
  import utils from './../utils/utils'
	export default {
		name: 'ImageUpload',
    props:{
			//v-model的value
			value:{
				type:String,
        default:''
      }
    },
    computed:{
			//上传input是否禁用
			isInputDisabled:function(){
				if(this.value){
					return !this.isImgLoaded
        }else{
					return false
        }
      }
    },
		data () {
			return {
				//图片是否加载完成
        isImgLoaded:false,
        //是否显示提示
        isShowTip:false,
        //文件大小限制(MB)
        imgSizeLimit:5,
        //图片压缩比例
        compressRatio:4
			}
		},
    methods:{
      handleMouseLeave: function(){
        this.isShowTip= false;
      },
      handleMouseEnter: function(){
      	this.isShowTip= true;
      },
			//input的图片change事件
      handleFileChange: function(e){
      	let self = this;
      	if(!e.target.files.length)return
        //获取文件对象
        let file = e.target.files[0];
        let isImage = /^image/.test(file.type);
        //判断上传的文件是图片
        if(!isImage){
        	this.$message({
            type:'error',
            message:'请上传图片!'
          })
        	return
        }
        //判断图片大小(小于5m),file.size单位是字节
        let isSizeExceeded = (file.size/1024/1024) > this.imgSizeLimit;
        if(isSizeExceeded){
          this.$message({
            type:'error',
            message:'图片应小于5M!'
          })
          return
        }
        //改变状态为加载中
        this.isImgLoaded = false;
        //处理2次点击同一个图片的问题
        e.target.value = '';
        //将图片读取为base64格式
        let fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onloadend = function(evt){
          //获取读取成功的对象
          let result = evt.target.result;
          //构建img对象
          let img = new Image();
          img.src = result;
          img.onload = function(){
            let compressedImgData = self.compressImg(img);
            //将base64转为blob对象用于上传到服务器
            let imgBlob = utils.dataURLtoBlob(compressedImgData);
            //生成formData
            let formData = new FormData();
            formData.append('smfile',imgBlob);
            //上传图片
            self.uploadToThirdSite(formData)
          }

        }
      },
      //上传图片
      uploadToThirdSite: function(formData){
        //这里的data没有大括号,api是在config/index里面设置的代理，跨域访问
        //生产环境跨域不能像上面那样写
        this.axios.post('/avatarUpload',formData).then((resp)=>{
          //注意这里有2个data，第一个是axios的data，第二个是图床网站的data属性
          let status = resp.data.code;
          console.log(status)
          if(status === 'success'){
            let imgUrl = resp.data.data.url;
            console.log(imgUrl)
          }else{

          }

          this.isImgLoaded = true;
        })
      },
      //压缩图片
      compressImg:function(img){
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        //获取图片的原本宽高
        let originWidth = img.width;
        let originHeight = img.height;
        canvas.width = originWidth / this.compressRatio;
        canvas.height = originHeight / this.compressRatio;
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
        //将canvas转化为dataURL
        let data = canvas.toDataURL('image/png');
        return data
      },
			//图片加载完成
      imgOnLoad: function(){
        this.isImgLoaded = true;
      },
			test: function(){
				this.$emit('input','https://test/a.png')
      }
    }
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
@wrapperSize : 150px;
.wrapper{
  .img-wrapper{
    width:@wrapperSize;
    height:@wrapperSize;
    background-color: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: pointer;
    .img{
      max-width: 100%;
      max-height: 100%;
    }
    .overlay-tip{
      position: absolute;
      left:0;
      top:0;
      right:0;
      bottom:0;
      background-color: rgba(0,0,0,.3);
      display: flex;
      justify-content: center;
      align-items: center;
      .overlay-tip-text{
        color:#fff;
      }
    }
  }
  .loading{
    width:@wrapperSize;
    height:@wrapperSize;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    span{
      color: #7b7b7b;
    }
  }
  .add-img{
    width:@wrapperSize;
    height:@wrapperSize;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:hover{
      border-color:#409EFF;
    }
  }
  .file-input{
    display: none;
  }
}
</style>
