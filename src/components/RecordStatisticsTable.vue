<!--记录统计表格组件-->
<template>
  <div class="wrapper" id="record-count-table-area">
    <!--标题-->
    <div class="title">{{year}}年{{month}}月员工{{isImportant?'重要':'非重要'}}错误记录统计(共{{total}}条)</div>
    <!--表格内容部分-->
    <el-table
      class="record-count-table"
      :data="data"
      style="width: 100%">
      <el-table-column
        prop="username"
        align="center"
        label="姓名"
        >
      </el-table-column>
      <el-table-column
        prop="count"
        align="center"
        label="数量"
        >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
	export default {
		name: 'RecordStatisticsTable',
    props:{
			title:{
				type:String,
        default:'',
        required:true
      },
      data:{
        required:true,
      },
      month:{
				type:String,
        required:true,
        default:''
      },
      year:{
        type:String,
        required:true,
        default:''
      },
      total:{
        type:Number,
        required:true,
        default:0
      },
      isImportant:{
        type:Boolean,
        required:true,
        default:false
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
.wrapper{
  .title{
    text-align: center;
    font-size: 17px;
    padding-bottom:20px;
  }
}
</style>
<style type="text/less" lang="less">
  .record-count-table.el-table{
    td{
      padding:6px 0;
    }
  }
</style>
