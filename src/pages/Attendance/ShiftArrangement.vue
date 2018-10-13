<!--排班操作页面-->
<template>
  <div class="attendance-wrapper">
    <div class="title">
      <i class="iconfont icon-table title-icon"></i>
      <span class="title-text">排班操作</span>
    </div>
    <div class="content">
     <div class="wrapper attendance-arrange" v-loading="isLoading">
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
           <!--展示当天排班情况的按钮-->
           <el-tooltip effect="dark" content="查看当天排班情况" placement="top">
            <i class="iconfont icon-eye eye" @click="showArrangeResult"></i>
           </el-tooltip>
         </el-form-item>
         <el-form-item label="排班车间" prop="workshop">
           <el-select v-model="arrangeData.workshop"
                      size="small"
                      @change="handleWorkshopChange"
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
                      @change="handleRegularStaffChange"
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
                      @change="handleTempStaffChange"
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
           <div class="tag-span" v-for="item in regularStaffListToSubmit">
             <el-tag :key="item"
                     closable
                     @close="handleRemoveStaff(item,1)"
                     type=""
             >
               {{item}}
             </el-tag>
           </div>
           <!--临时员工-->
           <div class="tag-span" v-for="item in tempStaffListToSubmit">
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
                      @change="handleWorkContentChange"
                      placeholder="请先选择车间">
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
         <el-form-item class="margin-top">
           <div class="btn-wrapper">
             <el-button type="primary"
                        @click="submit('arrangeForm')"
                        class="submit-btn">
               提交
             </el-button>
             <el-button  class="submit-btn"
                         @click="reset('arrangeForm')">
               清空
             </el-button>
           </div>
         </el-form-item>
       </el-form>
     </div>
    </div>

    <!--提交的对话框-->
    <el-dialog
      title="提交"
      :visible.sync="isSubmitDialogShow"
      top="0"
      :close-on-click-modal="false"
      custom-class="tag-edit-dialog"
    >
      <span>确定提交排班数据?</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="isSubmitDialogShow = false" size="mini">取 消</el-button>
          <el-button type="primary"
                     :loading="isSubmitting"
                     @click="confirmSubmit"
                     size="mini">
            确 定
          </el-button>
        </span>
    </el-dialog>

    <!--当日排班情况的对话框-->
    <el-dialog
      :title="this.arrangeData.date+'排班情况'"
      :visible.sync="isShowArrangeResultPanel"
      top="0"
      @close="isShowArrangeResultPanel = false"
      :close-on-click-modal="false"
      custom-class="tag-edit-dialog"
    >
      <!--v-if强制刷新-->
      <arrange-result-current-day :date="arrangeData.date"
                                  v-if="isShowArrangeResultPanel">
      </arrange-result-current-day>
    </el-dialog>
  </div>
</template>

<script>
  import api from '@/api/api'
  import ArrangeResultCurrentDay from '@/components/AttendanceAndArrangement/ArrangeResultCurrentDay'
	export default {
		name: '',
    components:{
      ArrangeResultCurrentDay
    },
		data () {
			return {
				//是否显示当天排班的对话框
        isShowArrangeResultPanel:false,
				//是否正在提交
        isSubmitting:false,
				//是否显示提交的对话框
        isSubmitDialogShow:false,
				//是否正在加载
        isLoading:false,
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
        regularStaffList:[],
        //临时员工列表
        tempStaffList:[],
        //工作内容列表
        workContentList:[],


        /* 要提交的数据 */
        //员工列表
        regularStaffListToSubmit:[],
        tempStaffListToSubmit:[],
        //工作内容
        workContentTexts:''

			}
		},
    mounted:function(){
			this.fetchListData();
    },
    methods:{
    	//查看当天排班情况
      showArrangeResult:function(){
      	if(!this.arrangeData.date){
          this.$message({
            type:'warning',
            message:'请选择日期再查看!'
          });
      		return
        }
      	this.isShowArrangeResultPanel = true;
      },
    	//确定提交
      confirmSubmit:function(){
        this.isSubmitting = true;
        let data = {
          date:this.arrangeData.date,
          workshop:this.arrangeData.workshop,
          process:this.arrangeData.process,
          shift:this.arrangeData.shift,
          startTime:this.arrangeData.startTime,
          endTime:this.arrangeData.endTime,
          regularStaffList:this.regularStaffListToSubmit,
          tempStaffList:this.tempStaffListToSubmit,
          workContent:this.workContentTexts
        };
        this.axios.post(api.submitAttendanceArrange,{data:data}).then((resp)=>{
        	if(resp.data.status === 1){
            this.$message({
              type:'success',
              message:'提交成功!'
            });
          }else{
            this.$message({
              type:'error',
              message:'提交失败!'
            });
          }
          this.isSubmitting = false;
          this.isSubmitDialogShow = false;
        })

      },
    	//提交
      submit:function(formName){
      	if(!this.arrangeData.date){
          this.$message({
            type:'warning',
            message:'请填写排班日期!'
          });
      		return
        }
        if(!this.arrangeData.shift){
          this.$message({
            type:'warning',
            message:'请填写班次!'
          });
          return
        }
        this.isSubmitDialogShow = true;
      },
      //清空
      reset:function(formName){
        this.$refs[formName].resetFields();
        this.workContentList = [];
        this.regularStaffListToSubmit = [];
        this.tempStaffListToSubmit = [];
        this.workContentTexts = '';
      },
    	//工作内容下拉数据变化
      handleWorkContentChange:function(current){
        this.$set(this.arrangeData,'workContent','');
      	this.workContentTexts = this.workContentTexts + current;
      },
    	//正式员工下拉数据变化
      handleRegularStaffChange: function(current){
        this.$set(this.arrangeData,'regularStaff','');
      	if(this.regularStaffListToSubmit.includes(current))return
      	this.regularStaffListToSubmit = this.regularStaffListToSubmit.concat(current)
      },
      //临时员工下拉数据变化
      handleTempStaffChange: function(current){
        this.$set(this.arrangeData,'tempStaff','');
        if(this.tempStaffListToSubmit.includes(current))return
        this.tempStaffListToSubmit = this.tempStaffListToSubmit.concat(current)
      },
    	//车间下拉数据变化
      handleWorkshopChange: function(current){
        //拉取对应车间的工作内容
        this.isLoading = true;
        this.axios.post(api.fetchAttendanceArrangeWorkContent,{workshop:current}).then((resp)=>{
        	//清空已选择的工作内容
          this.$set(this.arrangeData,'workContent','');
          if(resp.data.status === 1){
            this.workContentList = resp.data.list;
          }else{
            this.$message({
              type:'error',
              message:'数据获取失败!'
            });
          }
          this.isLoading = false;
        }).catch(()=>{
          this.isLoading = false;
        })
      },
			//拉取初始数据
      fetchListData:function(){
      	this.isLoading = true;
      	this.axios.get(api.fetchAttendanceArrangeDropdown).then((resp)=>{
      		if(resp.data.status === 1){
            this.workshopList = resp.data.workshop;
            this.processList = resp.data.process;
            this.shiftList = resp.data.shift;
            this.regularStaffList = resp.data.regularstaff;
            this.tempStaffList = resp.data.tempstaff;
          }else{
            this.$message({
              type:'error',
              message:'数据获取失败!'
            });
          }
          this.isLoading = false;
        }).catch(()=>{
          this.isLoading = false;
        })
      },
			//删除员工
      handleRemoveStaff:function(tag,type){
        if(type === 1){
        	//正式员工
          let index = this.regularStaffListToSubmit.indexOf(tag);
          this.regularStaffListToSubmit.splice(index,1);
        }else{
        	//临时员工
          let index = this.tempStaffListToSubmit.indexOf(tag);
          this.tempStaffListToSubmit.splice(index,1);
        }
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
      .eye{
        margin-left: 10px;
        cursor: pointer;
      }
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
        .margin-top{
          margin-top: 20px;
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
  //对话框自定义类名
  .tag-edit-dialog{
    width:500px;
    position: relative;
    top:50%;
    transform: translateY(-50%);
    .el-dialog__header{
      border-bottom:1px solid #e8e8e8;
      padding-bottom: 10px;
      padding-top:10px;
      .el-dialog__title{
        font-size: 16px;
      }
      .el-dialog__headerbtn{
        top:15px;
      }
    }
    .user-edit-dialog-form-wrapper{
      width:70%;
      margin: 0 auto;
    }
    .el-dialog__footer{
      border-top:1px solid #e8e8e8;
      padding-bottom:10px;
    }

  }
</style>

