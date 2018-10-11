<!--考勤表页面-->
<template>
  <div class="attendance-wrapper">
    <div class="title">
      <i class="iconfont icon-table title-icon"></i>
      <span class="title-text">当月考勤表</span>
    </div>
    <div class="content" >
    </div>
  </div>
</template>

<script>
	export default {
		name: '',
		data () {
			return {

			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
.attendance-wrapper{
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
    display: flex;
    align-items: center;
  }
}
</style>
