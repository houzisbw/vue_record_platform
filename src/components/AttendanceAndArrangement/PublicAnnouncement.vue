<!--公告栏组件-->
<template>
  <div class="work-content-wrapper">
    <div class="title">
      <i class="iconfont title-icon" :class="[titleIcon]"></i>
      <span class="title-text">{{title}}</span>
    </div>
    <div class="content" v-loading="isLoading">
      <quill-editor v-model="content"
                    ref="myQuillEditor"
                    :options="editorOption"
                    >
      </quill-editor>
      <!--提交按钮-->
      <div class="btn-wrapper">
        <el-button type="primary"
                   @click="handleSubmit"
                   size="medium">
          提交
        </el-button>
        <el-button @click="handleReset"
                   size="medium">
          清空
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '@/api/api'
  //引入富文本编辑器
  import { quillEditor } from 'vue-quill-editor'
  //引入富文本编辑器的样式
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
	export default {
		name: '',
    props:{
      //标题icon名称
      titleIcon:{
        type:String,
        default:'icon-contacts'
      },
      //标题名字
      title:{
        type:String,
        default:'标题'
      },
      //类型
      type:{
      	type:String,
        required:true,
        validator: function (value) {
          // 这个值必须匹配下列字符串中的一个
          return ['up', 'down'].indexOf(value) !== -1
        }
      }
    },
    components:{
      quillEditor
    },
    mounted:function(){
			this.fetchContent();
		},
		data () {
			return {
        //富文本编辑器内容
        content:'',
        isLoading:false,
        editorOption:{
        	placeholder:'输入公告内容',
          modules:{
          	toolbar:[
              ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
              [{ 'font': [] }],
              ['clean']                                         // remove formatting button
            ]

          }
        }
			}
		},
    methods:{
			fetchContent:function(){
        this.isLoading = true;
        this.axios.post(api.fetchAttendanceAnnounce,{type:this.type}).then((resp)=>{
          if(resp.data.status === 1){
            this.content = resp.data.announce;
            //让editor失去焦点且自动回到页面顶部
            this.$nextTick(()=>{
            	this.$refs.myQuillEditor.quill.blur();
            	window.scrollTo(0,0)
            })
          }else{
            this.$message({
              type:'error',
              message:'公告读取失败!'
            })
          }
          this.isLoading = false;
        })
      },
      handleSubmit:function(){
        this.isLoading = true;
      	this.axios.post(api.updateAttendanceAnnounce,{
      		content:this.content,
          type:this.type
        }).then((resp)=>{
      		if(resp.data.status === 1){
      			this.$message({
              type:'success',
              message:'公告保存成功!'
            })
          }else{
            this.$message({
              type:'error',
              message:'公告保存失败!'
            })
          }
          this.isLoading = false;
        })
      },
      handleReset:function(){
      	this.content = '';
      }
    }
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
  .work-content-wrapper{
    background-color: #fff;
    margin-bottom: 30px;
    .title{
      height:56px;
      line-height: 56px;
      padding:0 32px;
      border-bottom: 1px solid #e8e8e8;
      color:rgba(0,0,0,0.85);
      font-size: 16px;
      .title-text{
        margin-left: 10px;
      }
      .title-icon{
        font-size: 20px;
        position: relative;
        top:2px;
      }
    }
    .content{
      padding:20px 32px;
      box-sizing: border-box;
      white-space:normal;
      word-break:break-all;
      word-wrap:break-word;
      font-size: 14px;
      color:rgba(0,0,0,.65);
      .btn-wrapper{
        margin-top: 20px;
      }

    }
  }
</style>
