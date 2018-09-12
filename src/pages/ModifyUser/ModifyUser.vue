<!--修改用户(添加删除，改密码等)-->
<template>
  <div class="wrapper">
    <div class="title">
      <i class="iconfont icon-addteam title-icon"></i>
      <span class="title-text">添加/删除本组用户</span>
    </div>
  </div>
</template>

<script>
	export default {
		name: 'ModifyUser',
		data () {
			return {

			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
  .wrapper {
    background-color: #fff;
    box-sizing: border-box;
    .title {
      height: 56px;
      line-height: 56px;
      padding: 0 32px;
      border-bottom: 1px solid #e8e8e8;
      color: rgba(0, 0, 0, 0.85);
      font-size: 16px;
      .title-text {
        margin-left: 10px;
      }
      .title-icon {
        font-size: 20px;
        position: relative;
        top: 2px;
      }
    }
    .content {
      padding: 20px 32px;
      box-sizing: border-box;
      white-space: normal;
      word-break: break-all;
      word-wrap: break-word;
      font-size: 14px;
      color: rgba(0, 0, 0, .65);
      text-indent: 20px;
      min-height: 200px;
      .textarea-wrapper {
        width: 500px;
        margin: 20px auto;
        text-align: center;
        .btn-submit {
          margin-top: 30px;
        }
      }
    }
  }
</style>
