<template>
  <div class="header">
    <div class="header-right-panel">
      <span class="user-group user-common">
        <el-tag >{{userGroup}}</el-tag>
      </span>
      <span class="user-info-num user-common">
        <el-badge :value="12">
          <i class="el-icon-bell user-info-num-icon"></i>
        </el-badge>
      </span>
      <!--用户头像-->
      <span class="user-potrait user-common">
        <span class="user-avatar-wrapper">
          <img :src="userAvatar" class="user-avatar-img" alt="avatar"/>
        </span>
      </span>
      <!--用户昵称-->
      <el-dropdown size="medium">
        <span class="user-nickname  no-padding" >
          {{userNickname}}
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <i class="iconfont icon-user dropdown-color"></i>
            <span class="padding-small dropdown-color" @click="goToPersonalCenterPage">个人中心</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <i class="iconfont icon-setting dropdown-color"></i>
            <span class="padding-small dropdown-color" @click="goToPersonalSettingPage">个人设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <i class="iconfont icon-logout dropdown-color"></i>
            <span class="padding-small dropdown-color">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
  import api from './../api/api'
  import ElDropdown from "../../node_modules/element-ui/packages/dropdown/src/dropdown";
  import config from './../config/config'
	export default {
    components: {ElDropdown},
    name: 'Header',
    computed:{
			userNickname:function(){
				return this.$store.getters.getUserNickname || '还没有昵称呢!'
      },
      userAvatar: function(){
        return this.$store.getters.getUserProfileImg || config.defaultUserAvatarUrl
      },
      userGroup: function(){
        return this.$store.getters.getUserGroup || '还没有组别呢!'
      }
    },
    methods:{
    	//退出登录:清空vuex,清除token,清空localStorage
      logout: function(){
        this.axios.post(api.logout).then((resp)=>{
            this.$store.commit('logout');
            //跳转登录页
            this.$router.replace({
              path:'/login'
            })
        })
      },
      //去往个人设置页面
      goToPersonalSettingPage: function(){
        this.$router.push({
          path:'/personal_setting'
        })
      },
      //去往个人中心页面
      goToPersonalCenterPage: function(){
        this.$router.push({
          path:'/personal_center'
        })
      }
    },
		data () {
			return {

			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
  .header{
    height:64px;
    background-color: #fff;
    box-sizing: border-box;
    padding-right:20px;
    box-shadow:0 1px 4px rgba(0,21,41,.08);
    z-index:1000;
    /*注意必须不是static定位z-index才起作用*/
    position: relative;
    .el-dropdown-icon{
      width:20px;
      height:20px;
    }
    .padding-small{
      padding-left:3px;
    }
    .header-right-panel{
      float:right;
      height:100%;
      display: flex;
      flex-direction: row;
      .user-common{
        padding:0 15px;
        display: flex;
        align-items: center;
        height:100%;
      }
      .no-padding{
        padding:0;
      }
      .user-nickname{
        line-height: 64px;
        font-size: 14px;
        color:rgba(0,0,0,.65);
        max-width:80px;
        padding-left:10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
        cursor:pointer;
        position: relative;
        left:-8px;
        display: block;
      }
      .user-potrait{
        .user-avatar-wrapper{
          width:30px;
          height:30px;
          display: inline-block;
          border-radius: 50%;
          overflow: hidden;
        }
        .user-avatar-img{
          width:100%;
          height:100%;
        }
      }
      .user-group{
      }
      .user-info-num-icon{
        font-size: 22px;
        color: #888888;
      }
    }
  }
</style>
