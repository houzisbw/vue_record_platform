<!--修改公告-->
<template>
  <div class="wrapper">
    <div class="title">
      <i class="iconfont icon-edit-square title-icon"></i>
      <span class="title-text">修改公告</span>
    </div>
    <div class="content" v-loading="loading">
      <div class="textarea-wrapper">
        <el-input
          type="textarea"
          resize="none"
          :autosize="{ minRows: 4, maxRows: 8}"
          placeholder="请输入内容"
          v-model="content">
        </el-input>
        <el-button type="primary"
                   class="btn-submit"
                   :loading="isSubmitting"
                   @click="submit">
          提 交
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import api from './../../api/api'
	export default {
		name: 'ModifyAnnouncement',
    mounted:function(){
      this.fetchAnnouncement();
    },
    methods:{
    	fetchAnnouncement:function(){
        this.loading = true;
        this.axios.get(api.fetchAnnouncement).then((resp)=>{
          if(resp.data.status === 1){
            this.content = resp.data.content || '';
          }
          this.loading = false;
        })
      },
      submit: function(){
    		this.isSubmitting = true;
        this.axios.post(api.submitAnnouncement,{content:this.content}).then((resp)=>{
          if(resp.data.status === 1){
            this.$message({
              type:'success',
              message:'提交成功!'
            })
          }
          this.isSubmitting = false;
        })
      }
    },
		data () {
			return {
        content:'',
        loading:false,
        //是否在提交中
        isSubmitting:false
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
  .wrapper{
    background-color: #fff;
    box-sizing: border-box;
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
      text-indent: 20px;
      min-height:200px;
      .textarea-wrapper{
        width:500px;
        margin: 20px auto;
        text-align: center;
        .btn-submit{
          margin-top: 30px;
        }
      }
    }
  }

</style>
