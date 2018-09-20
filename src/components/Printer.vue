<!--打印按钮组件-->
<template>
  <div class="wrapper">
    <el-tooltip effect="dark"
                :content="tooltip"
                placement="top">
      <el-button size="small"
                 @click="printRecords">
        <i class="iconfont icon-printer printer-icon"></i>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script>
  //引入第三方插件
  import PrintJS from 'print-js'
	export default {
    name: '',
    props:{
			elementId:{
				type:String,
        default:'',
        required:true
      },
      title:{
				type:String,
        default:''
      },
      tooltip:{
				type:String,
        default:'打印记录表格'
      },
      //是否需要调整打印区域的尺寸
      need:{
        type:Boolean,
        default:false
      },
      //打印区域的宽度
      printAreaWidth:{
				type:Number
      }

    },
    methods:{
      printRecords: function(){
      	let ele = document.getElementById(this.elementId);
      	if(this.need){
          ele.style.width='1000px';
        }
      	setTimeout(()=>{
          //不能使用html2canvas，因为表格太长会被压缩，因此最后打印出来的内容也被压缩
          printJS({
            printable:this.elementId,
            type:'html',
            maxWidth:1000,
            //不计算元素样式，否则出现错乱，原因未知
            scanStyles:false,
            headerStyle:'font-weight:300;text-align:center',
            header:this.title?this.title:false
          });
          setTimeout(()=>{
            ele.style.width = 'auto';
          },100)
        },100)
      }
    },
		data () {
      return {}
    }
	}
</script>

<style scoped type="text/less" lang="less">
#record-table-area{
  width: 100px;
  height:100px;
  border:1px solid #000;
}
.wrapper{
  .printer-icon{
    color: #a0a0a0;
  }
}
</style>
