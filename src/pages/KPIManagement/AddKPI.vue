<!--查询记录-->
<template>
  <div class="add-search-wrapper">
    <div class="title">
      <i class="iconfont icon-sound title-icon"></i>
      <span class="title-text">KPI添加</span>
    </div>
    <div class="content" v-loading="loading">
      <div class="wrapper attendance-arrange" v-loading="isLoading">
       <el-form label-position="right"
                ref="arrangeForm"
                label-width="100px"
                :model="kpiData">

        <el-form-item label="员工选择" prop="staff" class="narrow-el-select">
           <el-select size="small"
                      @change="handleRegularStaffChange"
                      v-model="kpiData.regularStaff"
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
                      v-model="kpiData.tempStaff"
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
        <!-- 选择的员工名 -->
        <div class="staff-tag">
             <el-tag closable
                     v-if="kpiData.staffName"
                     @close="handleRemoveStaff()"
                     type=""
             >
               {{kpiData.staffName}}
             </el-tag>
        </div>

        <el-form-item label="绩效月份" prop="date">
           <el-date-picker
             v-model="kpiData.date"
             type="month"
             value-format="yyyy-MM"
             size="small"
             :editable="false"
             :clearable="false"
             placeholder="选择日期">
           </el-date-picker>
        </el-form-item>

         <el-form-item label="绩效类型" prop="kpiType" class="narrow-el-select">
           <el-select v-model="kpiData.kpiType"
                      size="small"
                      @change="handleTypesChange"
                      placeholder="请选择">
             <el-option
               class="user-edit-dialog-select"
               v-for="(item,index) in kpiTypeList"
               :key="index"
               :label="item"
               :value="item">
             </el-option>
           </el-select>
         </el-form-item>

         <!--非表单内的内容-->
         <div class="staff-tag-list">
           <!--正式员工-->
           <div class="tag-span" v-for="item in kpiData.type">
             <el-tag :key="item"
                     closable
                     @close="handleRemoveType(item)"
                     type=""
             >
               {{item}}
             </el-tag>
           </div>
         </div>

        <el-form-item label="绩效值" prop="kpiValue">
          <el-input-number
            :step="0.01" 
            v-model="kpiData.kpiValue">
          </el-input-number>
        </el-form-item>

         <!--非表单内的内容-->
         <el-form-item label="绩效备注" prop="content" class="no-margin-bottom">
           <div class="textarea">
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 4}"
                    placeholder="请输入内容"
                    v-model="kpiData.comment">
                </el-input>
            </div>
         </el-form-item>
         
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
      :close-on-click-modal="false"
      custom-class="tag-edit-dialog"
    >
      <span>确定提交绩效数据?</span>
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
  </div>
</template>

<script>
  import api from '@/api/api'
	export default {
		name: 'KPIAdd',
		data () {
			return {
                isLoading:false,
                kpiData:{
                    staffName:'',
                    regularstaff:'',
                    tempstaff:'',
                    date:'',
                    type:[],
                    kpiValue:'',
                    kpiType:'',
                    comment:''
                },
                //正式员工列表
                regularStaffList:[],
                //临时员工列表
                tempStaffList:[],
                //kpi类型列表
                kpiTypeList:[],
                //选择的员工名
                selectedStaff:'222',
                //是否正在提交
                isSubmitting:false,
				        //是否显示提交的对话框
                isSubmitDialogShow:false,
			}
        },
        mounted(){
            this.fetchListData();
            this.fetchKPITypeList()
        },
        methods:{
            //绩效类型改变
            handleRemoveType:function(item){
              let index = this.kpiData.type.indexOf(item);
              this.kpiData.type.splice(index,1)
            },
            //绩效类型改变
            handleTypesChange:function(current){
              if(!this.kpiData.type.includes(current)){
                this.kpiData.type.push(current)
              }   
            },
            //正式员工下拉数据变化
            handleRegularStaffChange: function(current){
               //this.$set(this.kpiData,'staffName',current);
               this.kpiData.staffName = current
               this.$set(this.kpiData,'tempStaff','');
            },
            //临时员工下拉数据变化
            handleTempStaffChange: function(current){
               this.$set(this.kpiData,'staffName',current);
               this.$set(this.kpiData,'regularStaff','');
            },

            // 取消选择员工
            handleRemoveStaff:function(){
                this.$set(this.kpiData,'staffName','');
                this.$set(this.kpiData,'tempStaff','');
                this.$set(this.kpiData,'regularStaff','');
            },

            //获取数据
            fetchListData: function(){
                this.isLoading = true;
                this.axios.get(api.fetchAttendanceArrangeDropdown).then((resp)=>{
                    if(resp.data.status === 1){
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

            // 获取kpi类型列表
            fetchKPITypeList:function(){
                 this.axios.get(api.fetchKPITypesList).then((resp)=>{
                    if(resp.data.status === 1){
                    this.kpiTypeList = resp.data.kpiTypeList
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

            reset:function(formName){
                this.$refs[formName].resetFields();
                this.regularStaffListToSubmit = [];
                this.tempStaffListToSubmit = [];
            },
            	//提交
            submit:function(formName){
              if(!this.kpiData.staffName){
                this.$message({
                  type:'warning',
                  message:'请填写人员姓名!'
                });
                return
              }
              if(!this.kpiData.type.length){
                this.$message({
                  type:'warning',
                  message:'请填写绩效类型!'
                });
                return
              }
              if(!this.kpiData.date){
                this.$message({
                  type:'warning',
                  message:'请填写月份!'
                });
                return
              }
              if(!this.kpiData.kpiValue){
                this.$message({
                  type:'warning',
                  message:'请填写绩效值!'
                });
                return
              }
               if(!this.kpiData.comment){
                this.$message({
                  type:'warning',
                  message:'请填写备注!'
                });
                return
              }
              this.isSubmitDialogShow = true;
            },
            //确定提交
            confirmSubmit:function(){
              this.isSubmitting = true;
              let data = {
                staffName:this.kpiData.staffName,
                date:this.kpiData.date,
                kpiType:this.kpiData.type,
                kpiValue:this.kpiData.kpiValue,
                comment:this.kpiData.comment,
              };

              this.axios.post(api.saveKPI,{data:data}).then((resp)=>{
                if(resp.data.status === 1){
                  this.$message({
                    type:'success',
                    message:'提交成功!'
                  });
                }else if(resp.data.status === 5){
                  this.$message({
                    type:'error',
                    message:'已有该员工当月绩效，不要重复提交!'
                  });
                }else{
                   this.$message({
                    type:'error',
                    message:'提交失败请重试!'
                  });
                }
                this.isSubmitting = false;
                this.isSubmitDialogShow = false;
              })

            },
        }
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
.add-search-wrapper{
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
        min-height:200px;  
        .wrapper{
            margin:0 auto;
            width:500px;
            .staff-tag-list,.staff-tag{
                margin-left: 100px;
                margin-bottom:20px;
                .tag-span{
                    display: inline-block;
                    margin-right: 15px;
                    margin-bottom: 15px;
                }
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
    /*top:50%;*/
    /*transform: translateY(-50%);*/
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
