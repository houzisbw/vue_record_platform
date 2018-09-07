<template>
  <div class="header">
    <div class="header-right-panel">
      <span class="user-group user-common">
        <el-tag >准备组</el-tag>
      </span>
      <span class="user-info-num user-common">
        <el-badge :value="12">
          <i class="el-icon-bell user-info-num-icon"></i>
        </el-badge>
      </span>
      <!--用户头像-->
      <span class="user-potrait user-common">
        <span class="user-avatar-wrapper">
          <img src="./../assets/images/icon/default-avatar.png" class="user-avatar-img" alt="avatar"/>
        </span>
      </span>
      <!--用户昵称-->
      <el-dropdown size="medium">
        <span class="user-nickname  no-padding">
          {{userNickname}}
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <i class="fa fa-user-o dropdown-color"></i>
            <span class="padding-small dropdown-color">个人中心</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <i class="fa fa-arrow-circle-left dropdown-color"></i>
            <span class="padding-small dropdown-color">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
  import ElDropdown from "../../node_modules/element-ui/packages/dropdown/src/dropdown";
	export default {
    components: {ElDropdown},
    name: 'Header',
    computed:{
			userNickname:function(){
				return '管理员'
      }
    },
		data () {
			return {
				msg: 'Welcome to Your Vue.js App'
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
        max-width:100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        cursor:pointer;
        position: relative;
        left:-8px;
      }
      .user-potrait{
        .user-avatar-wrapper{
          width:24px;
          height:24px;
          display: inline-block;
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
