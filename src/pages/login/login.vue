<template>
  <div class="login-wrapper">
    <div class="overlay">
      <div class="login-modal">
        <div class="title">
          成都.生研所-FP错误记录平台
        </div>
        <el-form :model="loginData" ref="loginForm" :rules="rules">
          <el-form-item prop="username">
            <el-input v-model="loginData.username" placeholder="请输入用户名">
              <i slot="prefix">
                <img src='./../../assets/images/icon/login_user_icon.png' class="login-img"/>
              </i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginData.password" placeholder="请输入密码" type="password">
              <i slot="prefix">
                <img src='./../../assets/images/icon/login_password_icon.png' class="login-img"/>
              </i>
            </el-input>
          </el-form-item>
          <el-form-item class="margin-small">
            <el-checkbox v-model="loginData.rememberMe" >记住我</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       class="login-btn"
                       :loading="isLogging"
                       @click="submitForm('loginForm')">
              {{isLogging?'登录中':'登录'}}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import api from './../../api/api'
	export default {
		name: 'Login',
    methods:{
			//保存用户信息到vuex
      saveUserInfoToVuex: function(userInfo){
      	this.$store.commit('updateUserName',userInfo.username);
        this.$store.commit('updateUserProfile',userInfo.profileImgUrl);
        this.$store.commit('updateUserNickname',userInfo.nickname);
        this.$store.commit('updateUserAuth',userInfo.auth);
        this.$store.commit('updateUserSignature',userInfo.signature);
      },
			//提交登录请求
      submitForm:function(formRef){
      	//如果验证通过
      	this.$refs[formRef].validate((valid) => {
          if (valid) {
          	this.isLogging = true;
            //提交表单
            let data = {
            	username:this.loginData.username,
              password:this.loginData.password,
              rememberMe:this.loginData.rememberMe
            };
            //必须写catch捕获错误
            this.axios.post(api.login,data).then((resp)=>{
              this.isLogging = false;
              //保存用户信息到vuex中
              this.saveUserInfoToVuex(resp.data.userInfo);
              //路由跳转到主页
              this.$router.replace({path:'/'})
            }).catch((err)=>{
              this.isLogging = false;
            })
          } else {
            return false;
          }
        });
      }
    },
		data () {
			//用户名校验规则
			var usernameValidator = (rule, value, callback) => {
          if(value===''){
          	callback(new Error('请输入用户名!'))
          }else{
          	callback()
          }
      };
			var passwordValidator = (rule, value, callback) => {
        if(value===''){
          callback(new Error('请输入密码!'))
        }else{
          callback()
        }
      };
			return {
				//是否在登录中
        isLogging:false,
        loginData: {
          username: '',
          password: '',
          rememberMe: true
        },
        //校验规则
        rules:{
        	username:[
            {validator:usernameValidator,trigger:'blur'}
          ],
          password:[
            {validator:passwordValidator,trigger:'blur'}
          ]
        }
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
.login-wrapper{
  overflow: hidden;
  height:100%;
  background: url('./../../assets/images/bg/bg_small.jpg') center center no-repeat;
  background-size: cover;
  .overlay{
    height:100%;
    position: relative;
    .title{
      height:50px;
      position: relative;
      margin-bottom: 50px;
      color: #7a7a7a;
      text-align: center;
      line-height: 50px;
      font-size: 30px;
      font-weight: bold;
    }
    .login-modal{
      width:400px;
      height:auto;
      //background-color: #f8f8f8;
      border-radius: 10px;
      position: absolute;
      left:50%;
      top:50%;
      transform: translate(-50%,-50%);
      .login-btn{
        width:100%;
      }
      .margin-small{
        margin-bottom: 10px;
      }
      .login-img{
        width:20px;
        height:20px;
        vertical-align: middle;
      }
    }
  }
}
</style>
