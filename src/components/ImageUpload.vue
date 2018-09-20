<!--图片上传组件-->
<template>
  <div class="wrapper">
    <label for="recordImgInput" class="outer">
      <!--已经有图片时显示修改图片，没有上传时显示添加图片-->
      <div v-if="value" class="outer">
        <div class="img-wrapper"
             v-show="!isLoading"
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
        <!--在加载中则显示文本提示-->
        <div class="loading" v-if="isLoading">
          <span>上传中...</span>
        </div>
      </div>
      <div v-else class="outer">
        <div class="add-img">
          <i class="el-icon-plus" style="font-size:22px;"></i>
        </div>
      </div>
    </label>

    <!--上传图片的input,隐藏掉-->
    <input type="file"
           :disabled="isLoading"
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
    mounted:function(){
			if(this.value){
				this.isLoading = true;
      }
    },
		data () {
			return {
				//图片是否正在加载
        isLoading:false,
        //是否显示提示
        isShowTip:false,
        //文件大小限制(MB)
        imgSizeLimit:5,
        //图片压缩比例
        compressRatio:4,
        //图片压缩的最小宽高(小于此值不压缩)
        imgCompressSize:2000
			}
		},
    methods:{
    	//该组件是否在loading状态,父组件调用此方法判断是否可以提交表单
      isInLoading: function(){
      	return this.isLoading;
      },
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
        this.isLoading = true;
        //把加载状态传递给父组件
        this.$emit('loading',true);
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
          	//如果图片的长宽都大于一定值才压缩图片
            if(img.width>this.imgCompressSize && img.height>this.imgCompressSize){
                result = self.compressImg(img);
            }
            //将base64转为blob对象用于上传到服务器
            let imgBlob = utils.dataURLtoBlob(result);
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
          if(status === 'success'){
            let imgUrl = resp.data.data.url;
            //将返回的url传递给父组件
            this.$emit('input',imgUrl);
          }else{
            this.$message({
              type:'error',
              message:'图片上传失败!请稍后重试'
            })
          }
          this.isLoading = false;
          this.$emit('loading',false)
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
        this.isLoading = false;
      },
    }
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
@wrapperSize : 150px;
.wrapper{
  width:@wrapperSize;
  height:@wrapperSize;
  .outer{
    width:@wrapperSize;
    height:@wrapperSize;
  }
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
