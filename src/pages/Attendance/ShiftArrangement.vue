<!--排班操作页面-->
<template>
  <div class="attendance-wrapper">
    <div class="title">
      <i class="iconfont icon-table title-icon"></i>
      <span class="title-text">排班操作</span>
    </div>
    <div class="content">
     <div class="wrapper attendance-arrange">
       <el-form label-position="right"
                ref="arrangeForm"
                label-width="100px"
                :model="arrangeData">
         <el-form-item label="排班日期" prop="date">
           <el-date-picker
             v-model="arrangeData.date"
             type="date"
             value-format="yyyy-MM-dd"
             size="small"
             :editable="false"
             :clearable="false"
             placeholder="选择日期">
           </el-date-picker>
         </el-form-item>
         <el-form-item label="排班车间" prop="workshop">
           <el-select v-model="arrangeData.workshop"
                      size="small"
                      placeholder="请选择">
             <el-option
               class="user-edit-dialog-select"
               v-for="item in workshopList"
               :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
           </el-select>
         </el-form-item>
         <el-form-item label="排班工序" prop="process">
           <el-select v-model="arrangeData.process"
                      size="small"
                      placeholder="请选择">
             <el-option
               class="user-edit-dialog-select"
               v-for="item in processList"
               :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
           </el-select>
         </el-form-item>
         <el-form-item label="排班班次" prop="shift" class="narrow-el-select">
           <el-select v-model="arrangeData.shift"
                      size="small"
                      placeholder="请选择">
             <el-option
               class="user-edit-dialog-select"
               v-for="item in shiftList"
               :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
           </el-select>
         </el-form-item>
         <el-form-item label="排班起止时间" prop="time" >
           <el-time-select
             placeholder="起始时间"
             size="small"
             class="narrow-time-select"
             v-model="arrangeData.startTime"
             :picker-options="{
             start:'00:00',
             step:'00:30',
             end:'24:00'
            }">
           </el-time-select>
           <el-time-select
             placeholder="结束时间"
             class="narrow-time-select"
             size="small"
             v-model="arrangeData.endTime"
             :picker-options="{
             start: '00:00',
             step: '00:30',
             end: '24:00',
             minTime: arrangeData.startTime
            }">
           </el-time-select>
         </el-form-item>
         <el-form-item label="排班员工" prop="staff" class="narrow-el-select">
           <el-select size="small"
                      v-model="arrangeData.regularStaff"
                      placeholder="正式员工">
             <el-option
               class="user-edit-dialog-select"
               v-for="item in regularStaffList"
               :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
           </el-select>
           <el-select size="small"
                      v-model="arrangeData.tempStaff"
                      placeholder="临时员工">
             <el-option
               class="user-edit-dialog-select"
               v-for="item in tempStaffList"
               :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
           </el-select>
         </el-form-item>
         <!--非表单内的内容-->
         <div class="staff-tag-list">
           <!--正式员工-->
           <div class="tag-span" v-for="item in regularStaffList">
             <el-tag :key="item"
                     closable
                     @close="handleRemoveStaff(item,1)"
                     type=""
             >
               {{item}}
             </el-tag>
           </div>
           <!--临时员工-->
           <div class="tag-span" v-for="item in tempStaffList">
             <el-tag :key="item"
                     closable
                     @close="handleRemoveStaff(item,2)"
                     type="warning"
             >
               {{item}}
             </el-tag>
           </div>
         </div>
         <el-form-item label="工作内容" prop="content" class="no-margin-bottom">
           <el-select v-model="arrangeData.workContent"
                      size="small"
                      placeholder="请选择">
             <el-option
               class="user-edit-dialog-select"
               v-for="item in workContentList"
               :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
           </el-select>
         </el-form-item>
         <div class="textarea">
           <el-input
             type="textarea"
             :autosize="{ minRows: 4}"
             placeholder="请输入内容"
             v-model="workContentTexts">
           </el-input>
         </div>
         <!--<el-form-item >-->
           <!--<div class="btn-wrapper">-->
             <!--<el-button type="primary"-->
                        <!--@click="submit('addRecordForm')"-->
                        <!--:disabled="isImageUploading"-->
                        <!--class="submit-btn">-->
               <!--提交-->
             <!--</el-button>-->
             <!--<el-button  class="submit-btn"-->
                         <!--@click="reset('addRecordForm')">-->
               <!--清空-->
             <!--</el-button>-->
           <!--</div>-->
         <!--</el-form-item>-->
       </el-form>
     </div>
    </div>
  </div>
</template>

<script>
	export default {
		name: '',
		data () {
			return {
        //排班数据
        arrangeData:{
          date:'',
          workshop:'',
          process:'',
          shift:'',
          startTime:'',
          endTime:'',
          regularStaff:'',
          tempStaff:'',
          workContent:''
        },
        //车间数据
        workshopList:[],
        //工序列表
        processList:[],
        //班次列表
        shiftList:[],
        //正式员工列表
        regularStaffList:['第三方','sdf','eree','ttt'],
        //临时员工列表
        tempStaffList:['34','5656','7878','898'],
        //工作内容列表
        workContentList:[],


        /* 要提交的数据 */
        //员工列表
        staffListToSubmit:[],
        //工作内容
        workContentTexts:''

			}
		},
    methods:{
			//删除员工
      handleRemoveStaff:function(tag,type){

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
      min-height:200px;
      .wrapper{
        margin:0 auto;
        width:500px;
        .staff-tag-list{
          margin-left: 100px;
          .tag-span{
            display: inline-block;
            margin-right: 15px;
            margin-bottom: 15px;
          }
        }
        .textarea{
          margin-left: 100px;
        }

      }
    }
  }
</style>
<style type="text/less" lang="less">
  .attendance-arrange .el-select{
    width:100%;
  }
  .attendance-arrange .narrow-el-select .el-select{
    width:49%;
  }
  .attendance-arrange .no-margin-bottom.el-form-item {
    margin-bottom: 5px;
  }
  .attendance-arrange .narrow-time-select {
    width:49%;
  }
  .attendance-arrange .submit-btn.el-button{
    width:100px;
  }
</style>
