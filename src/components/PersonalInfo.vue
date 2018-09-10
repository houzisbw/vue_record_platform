<!--个人信息组件-->
<template>
  <div class="personal-info-wrapper">
    <div class="title">个人信息</div>
    <div class="info-wrapper-left">
      <el-form :model="infoData"
               label-position="top"
               ref="infoForm"
               :rules="rules">
        <el-form-item prop="nickname" label="用户昵称">
          <el-input v-model="infoData.nickname" placeholder="请输入昵称">
          </el-input>
        </el-form-item>
        <el-form-item  label="用户签名">
          <el-input v-model="infoData.signature" placeholder="请输入签名">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     class="submit-btn"
                     :loading="isSubmitting"
                     @click="submitForm('infoForm')">
            {{isSubmitting?'更新中':'更新个人信息'}}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import api from './../api/api'
	export default {
		name: 'PersonalInfo',
    mounted:function(){
			this.fetchUserInfo();
    },
    methods:{
			//获取用户基本信息
      fetchUserInfo: function(){
        this.axios.get(api.fetchUserInfo).then((resp)=>{
        	if(resp.data.status === 1){
            let obj = {
              nickname:resp.data.nickname,
              signature:resp.data.signature
            };
            this.infoData = obj;
          }
        })
      },
      submitForm: function(formName){
        //如果验证通过则更新信息,注意要更新vuex和localstorage
        this.$refs[formName].validate((valid) => {
        	if(valid){
            this.isSubmitting = true;
            //提交表单
            let data = {
              nickname:this.infoData.nickname,
              signature:this.infoData.signature
            };
            this.axios.post(api.updateUserInfo,data).then((resp)=>{
              this.isSubmitting = false;
              //更新vuex和localStorage
              if(resp.data.status === 1){
                this.$store.commit('updateUserNickname',this.infoData.nickname);
                this.$store.commit('updateUserSignature',this.infoData.signature);
                this.$message({
                  message: '用户信息更新成功!',
                  type: 'success'
                });
              }
            })
          }else{
        		return false
          }
        })
      }
    },
		data () {
			let nicknameValidator = function(rule,value,callback){
        if(value===''){
          callback(new Error('昵称不能为空!'))
        }else{
          callback()
        }
      };
			return {
        infoData:{
        	nickname:'',
          signature:''
        },
        rules:{
          nickname:[
            {validator:nicknameValidator,trigger:'blur'}
          ]
        },
        isSubmitting:false
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
  .personal-info-wrapper{
    padding:8px 40px;
    .title{
      font-size: 20px;
      color:rgba(0,0,0,0.85);
      margin-bottom: 15px;
    }
    .info-wrapper-left{
      width:300px;
      .submit-btn{
        margin-top: 20px;
      }
    }
  }
</style>
<style type="text/less" lang="less">
  .info-wrapper-left .el-form-item__label{
    padding:0;
  }
</style>
