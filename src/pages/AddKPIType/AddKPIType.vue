<!--添加记录类型-->
<template>
  <div class="wrapper">
    <div class="title">
      <i class="iconfont icon-wrench title-icon"></i>
      <span class="title-text">添加/删除KPI类型</span>
    </div>
    <div class="content" v-loading="loading">
      <!--操作栏-->
      <div class="top-operation-wrapper">
        <!--添加KPI按钮-->
        <el-button type="primary" size="small" @click="showKPITypeModal">
          <i class="iconfont icon-plus"></i>
          <span style="padding-left: 5px;">添加KPI类型</span>
        </el-button>
      </div>
      <!--标签区域-->
      <div class="modify-user-table-wrapper clearfix">
        <div v-if="isTagListEmpty">
          <span class="tag-span" v-for="(tag,index) in kpiTypeList">
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
        title="添加新的绩效类型"
        :visible.sync="isKPITypeModalShow"
        top="0"
        @close="cancelKPIType"
        :close-on-click-modal="false"
        custom-class="tag-edit-dialog"
      >
        <!--表单内容区域-->
        <div class="user-edit-dialog-form-wrapper">
          <el-form label-position="right"
                   ref="addKPITypeForm"
                   :rules="rules"
                   label-width="80px"
                   :model="addKPITypeData">
            <el-form-item label="绩效类型" prop="record" style="margin-bottom: 0;">
              <el-input v-model="addKPITypeData.kpiType"
                        size="small">
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelAddKPIType" size="mini">取 消</el-button>
          <el-button type="primary"
                     :loading="isModifying"
                     @click="confirmAddKPIType('addKPITypeForm')"
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
        <span>确定删除该绩效类型<span style="color: #409EFF;">{{kpiTypeToRemove}}</span>?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isDeleteDialogShow = false" size="mini">取 消</el-button>
          <el-button type="primary"
                     :loading="isModifying"
                     @click="confirmDeleteKPI"
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
    name: 'AddKPIType',
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
            kpiTypeList:[],
            isKPITypeModalShow:false,
            addKPITypeData:{
                kpiType:''
            },
            rules:{
                record:[
                    { validator: validateRecord, trigger: 'blur' }
                ],
            },
            isModifying:false,
            kpiTypeToRemove:'',
            isDeleteDialogShow:false
        }
    },
    computed:{
      isTagListEmpty: function(){
      	return this.kpiTypeList.length>0
      }
    },
    mounted:function(){
      this.fetchKPITypeData()
    },
    methods:{
      confirmDeleteKPI: function(){
        this.axios.post(api.deleteKPIType,{name:this.kpiTypeToRemove}).then((resp)=>{
          if(resp.data.status === 1){
            this.fetchKPITypeData();
            this.$message({
              type:'success',
              message:'记录删除成功!'
            })
            this.isModifying = false;
            this.isDeleteDialogShow = false;
          }
        })
      },
      confirmAddKPIType: function(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.isModifying = true;
            this.axios.post(api.addKPIType,{name:this.addKPITypeData.kpiType}).then((resp)=>{
              if(resp.data.status === 1){
                this.fetchKPITypeData();
                this.$message({
                  type:'success',
                  message:'记录添加成功!'
                })
              }
              this.isModifying = false;
              this.isKPITypeModalShow = false;
            })
          }else{
            return false
          }
        })
      },
      handleRemoveTag: function(tagName){
        this.kpiTypeToRemove = tagName;
        this.isDeleteDialogShow = true;
      },
      showKPITypeModal: function(){
        this.isKPITypeModalShow = true;
      },
      cancelAddKPIType: function(){
        this.isKPITypeModalShow = false;
      },
      //拉取车间信息
      fetchKPITypeData: function(){
        this.loading = true;
        this.kpiTypeList = [];
        this.axios.get(api.fetchKPITypesList).then((resp)=>{
          if(resp.data.status === 1){
            resp.data.kpiTypeList.forEach((item)=>{
              this.kpiTypeList.push({
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
