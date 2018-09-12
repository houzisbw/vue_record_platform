<!--组别设置-->
<template>
  <div class="wrapper">
    <div class="title">
      <i class="iconfont icon-team title-icon"></i>
      <span class="title-text">修改组名</span>
    </div>
    <div class="content" v-loading="loading">
      <div class="textarea-wrapper">
        <el-input placeholder="请输入内容" v-model="groupName">
          <template slot="prepend">组名</template>
          <el-button slot="append"
                     type="primary"
                     @click="submit"
                     class="btn-submit">
            提交
          </el-button>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script>
  import api from './../../api/api'
	export default {
		name: 'GroupSetting',
    mounted:function(){
			this.getGroup();
    },
    methods:{
			getGroup: function(){
				this.loading = true;
        this.axios.get(api.fetchGroup).then((resp)=>{
        	if(resp.data.status === 1){
        		this.groupName = resp.data.group
          }
          this.loading = false;
        })
      },
      submit:function(){
				this.$message({
          type:'warning',
          message:'此功能暂不开发'
        })
      }
    },
		data () {
			return {
        loading:false,
        groupName:''
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
      display: flex;
      align-items: center;
      min-height:200px;
      .textarea-wrapper{
        width:500px;
        margin: 20px auto;
        text-align: center;

      }
    }
  }
</style>
