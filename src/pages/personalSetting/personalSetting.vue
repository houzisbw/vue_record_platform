<!--个人设置页面-->
<template>
  <div class="personal-setting-wrapper">
    <el-tabs tab-position="left" class="personal-setting-tab-wrapper">
      <el-tab-pane label="个人信息">
        <personal-info></personal-info>
      </el-tab-pane>
      <el-tab-pane label="头像设置">
        <avatar-setting></avatar-setting>
      </el-tab-pane>
      <el-tab-pane label="账号绑定"></el-tab-pane>
      <el-tab-pane label="新消息通知"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import PersonalInfo from './../../components/PersonalInfo.vue'
  import AvatarSetting from './../../components/AvatarSetting/AvatarSetting.vue'
	export default {
		name: 'PersonalSetting',
    components:{
      PersonalInfo,
      AvatarSetting
    },
		data () {
			return {

			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
  .personal-setting-wrapper{
    height:100%;
    background-color: #fff;
    padding:20px 0;
    .personal-setting-tab-wrapper{

    }
  }
</style>
<!--elementUI的自定义样式(不加scoped)-->
<style type="text/less" lang="less">
  .personal-setting-tab-wrapper .el-tabs__item.is-left{
    text-align: left!important;
  }
  .personal-setting-tab-wrapper .el-tabs__item.is-active{
    color:#1890ff;
    background-color: #e6f7ff;
  }
  .personal-setting-tab-wrapper .el-tabs__item:hover{
    color:#1890ff;
  }
  .personal-setting-tab-wrapper .el-tabs__item{
    height:50px;
    line-height: 50px;
    padding-right: 80px;
  }
  .personal-setting-tab-wrapper .el-tabs__nav,.el-tabs__header{
    height: 100%!important;
  }
  .personal-setting-tab-wrapper .el-tabs__nav-wrap.is-left{
    &::after{
      width:1px!important;
    }
  }
  .personal-setting-tab-wrapper .el-tabs__content::after{
    width:1px;
    content: '';
    height:100%;
    background-color: #e4e7ed;
    position: absolute;
    left:0;
    top:0;
  }
  /*为了实现左侧的border，是在是非常蛋疼*/
  .personal-setting-tab-wrapper .el-tabs__content{
    padding-left:10px;
  }
  .personal-setting-tab-wrapper .el-tabs__header{
    margin-right: 0!important;
  }
</style>
