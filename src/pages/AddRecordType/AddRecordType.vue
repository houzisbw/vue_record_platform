<!--添加记录类型-->
<template>
  <div class="wrapper">
    <div class="title">
      <i class="iconfont icon-wrench title-icon"></i>
      <span class="title-text">添加/删除记录类型</span>
    </div>
    <div class="content" v-loading="loading">
      <!--操作栏-->
      <div class="top-operation-wrapper">
        <!--添加新用户按钮-->
        <el-button type="primary" size="small" @click="showRecordTypeModal">
          <i class="iconfont icon-plus"></i>
          <span style="padding-left: 5px;">添加记录类型</span>
        </el-button>
      </div>
      <!--标签区域-->
      <div class="modify-user-table-wrapper clearfix">
        <div v-if="isTagListEmpty">
          <span class="tag-span" v-for="tag in recordTypeList">
            <el-tag :key="tag.name"
                    closable
                    @close="handleRemoveTag(tag.name)"
                    type=""
            >
              {{tag.name}}
            </el-tag>
          </span>
        </div>
        <div class="empty-list" v-else>
          无数据
        </div>
      </div>
      <!--添加车间的对话框-->
      <el-dialog
        title="添加新的记录类型"
        :visible.sync="isAddRecordTypeModalShow"
        top="0"
        @close="cancelAddRecordType"
        :close-on-click-modal="false"
        custom-class="tag-edit-dialog"
      >
        <!--表单内容区域-->
        <div class="user-edit-dialog-form-wrapper">
          <el-form label-position="right"
                   ref="addRecordTypeForm"
                   :rules="rules"
                   label-width="80px"
                   :model="addRecordTypeData">
            <el-form-item label="记录类型" prop="record" style="margin-bottom: 0;">
              <el-input v-model="addRecordTypeData.recordType"
                        size="small">
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelAddRecordType" size="mini">取 消</el-button>
          <el-button type="primary"
                     :loading="isModifying"
                     @click="confirmAddRecordType('addRecordTypeForm')"
                     size="mini">
            确 定
          </el-button>
        </span>
      </el-dialog>
      <!--删除标签的对话框-->
      <el-dialog
        title="删除该标签"
        :visible.sync="isDeleteDialogShow"
        top="0"
        :close-on-click-modal="false"
        custom-class="tag-edit-dialog"
      >
        <span>确定删除记录<span style="color: #409EFF;">{{recordTypeToRemove}}</span>?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isDeleteDialogShow = false" size="mini">取 消</el-button>
          <el-button type="primary"
                     :loading="isModifying"
                     @click="confirmDeleteWorkshop"
                     size="mini">
            确 定
          </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import api from './../../api/api'
	export default {
		name: 'AddRecordType',
		data () {
      //bug:value始终是undefined，原因未知
      var validateRecord = (rule, value, callback)=>{
        if (value==='') {
          callback(new Error('记录类型不能为空!'));
        } else {
          callback();
        }
      };
			return {
        //是否正在加载页面
        loading:false,
        //记录数组
        recordTypeList:[],
        isAddRecordTypeModalShow:false,
        addRecordTypeData:{
        	recordType:''
        },
        rules:{
          record:[
            { validator: validateRecord, trigger: 'blur' }
          ],
        },
        isModifying:false,
        recordTypeToRemove:'',
        isDeleteDialogShow:false
			}
		},
    computed:{
      isTagListEmpty: function(){
      	return this.recordTypeList.length>0
      }
    },
    mounted:function(){
      this.fetchRecordTypeData()
    },
    methods:{
      confirmDeleteWorkshop: function(){
        this.axios.post(api.deleteRecordType,{name:this.recordTypeToRemove}).then((resp)=>{
          if(resp.data.status === 1){
            this.fetchRecordTypeData();
            this.$message({
              type:'success',
              message:'记录删除成功!'
            })
            this.isModifying = false;
            this.isDeleteDialogShow = false;
          }
        })
      },
      confirmAddRecordType: function(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.isModifying = true;
            this.axios.post(api.addRecordType,{name:this.addRecordTypeData.recordType}).then((resp)=>{
              if(resp.data.status === 1){
                this.fetchRecordTypeData();
                this.$message({
                  type:'success',
                  message:'记录添加成功!'
                })
              }
              this.isModifying = false;
              this.isAddRecordTypeModalShow = false;
            })
          }else{
            return false
          }
        })
      },
      handleRemoveTag: function(tagName){
        this.recordTypeToRemove = tagName;
        this.isDeleteDialogShow = true;
      },
      showRecordTypeModal: function(){
        this.isAddRecordTypeModalShow = true;
      },
      cancelAddRecordType: function(){
        this.isAddRecordTypeModalShow = false;
      },
      //拉取车间信息
      fetchRecordTypeData: function(){
        this.loading = true;
        this.recordTypeList = [];
        this.axios.get(api.fetchRecordTypesList).then((resp)=>{
          if(resp.data.status === 1){
            resp.data.recordTypeList.forEach((item)=>{
              this.recordTypeList.push({
                name:item.name,
                group:item.group
              })
            })
          }
          this.loading = false;
        })
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
      min-height: 200px;
      .top-operation-wrapper{
        background-color: #fff;
      }
      .modify-user-table-wrapper{
        margin-top: 20px;
        .tag-span{
          display: inline-block;
          margin-right: 15px;
          margin-bottom: 15px;
        }
        .empty-list{
          text-align: center;
          margin-top: 30px;
          color: #a0a0a0;
        }
      }
    }
  }
</style>
<style type="text/less" lang="less">
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
