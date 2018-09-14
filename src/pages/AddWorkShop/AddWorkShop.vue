<!--添加车间页面-->
<template>
  <div class="wrapper">
    <div class="title">
      <i class="iconfont icon-wrench title-icon"></i>
      <span class="title-text">添加/删除车间</span>
    </div>
    <div class="content" v-loading="loading">
      <!--操作栏-->
      <div class="top-operation-wrapper">
        <!--添加新用户按钮-->
        <el-button type="primary" size="small" @click="showWorkshopModal">
          <i class="iconfont icon-plus"></i>
          <span style="padding-left: 5px;">添加车间</span>
        </el-button>
      </div>
      <!--标签区域-->
      <div class="modify-user-table-wrapper clearfix">
        <div v-if="isTagListEmpty">
          <span class="tag-span" v-for="tag in workshopList">
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
      <!--删除标签的对话框-->
      <el-dialog
        title="删除该标签"
        :visible.sync="isDeleteDialogShow"
        top="0"
        :close-on-click-modal="false"
        custom-class="tag-edit-dialog"
      >
        <span>确定删除车间<span style="color: #409EFF;">{{workshopToRemove}}</span>?</span>
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
      <!--添加车间的对话框-->
      <el-dialog
        title="添加新车间"
        :visible.sync="isAddWorkshopModalShow"
        top="0"
        @close="cancelAddWorkshop"
        :close-on-click-modal="false"
        custom-class="tag-edit-dialog"
      >
        <!--表单内容区域-->
        <div class="user-edit-dialog-form-wrapper">
          <el-form label-position="right"
                   ref="addWorkshopForm"
                   :rules="rules"
                   label-width="80px"
                   :model="addWorkshopData">
            <el-form-item label="车间名" prop="workshop" style="margin-bottom: 0;">
              <el-input v-model="addWorkshopData.workshopName"
                        size="small">
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelAddWorkshop" size="mini">取 消</el-button>
          <el-button type="primary"
                     :loading="isModifying"
                     @click="confirmAddWorkshop('addWorkshopForm')"
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
		name: 'AddWorkShop',
    computed:{
			isTagListEmpty:function(){
				return this.workshopList.length>0
      }
    },
		data () {
			//bug:value始终是undefined，原因未知
			var validateWorkshop = (rule, value, callback)=>{
        if (value==='') {
          callback(new Error('车间名不能为空!'));
        } else {
          callback();
        }
      };
			return {
				//是否正在加载页面
        loading:false,
        //车间数组
        workshopList:[],
        isDeleteDialogShow:false,
        //要删除车间的名字
        workshopToRemove:'',
        isModifying:false,
        isAddWorkshopModalShow:false,
        rules:{
          workshop:[
            { validator: validateWorkshop, trigger: 'blur' }
          ],
        },
        addWorkshopData:{
        	workshopName:''
        }
			}
		},
    mounted:function(){
      this.fetchWorkshopData();
    },
    methods:{
      showWorkshopModal: function(){
        this.isAddWorkshopModalShow = true;
      },
      cancelAddWorkshop: function(){
      	this.isAddWorkshopModalShow = false;
      },
      //确定添加车间
      confirmAddWorkshop: function(formName){
          this.$refs[formName].validate((valid) => {
          	if(valid){
          		this.isModifying = true;
          		this.axios.post(api.addWorkshop,{name:this.addWorkshopData.workshopName}).then((resp)=>{
                if(resp.data.status === 1){
                  this.fetchWorkshopData();
                  this.$message({
                    type:'success',
                    message:'车间添加成功!'
                  })
                }
                this.isModifying = false;
                this.isAddWorkshopModalShow = false;
              })
            }else{
          		return false
            }
          })
      },
    	//确定删除车间
      confirmDeleteWorkshop: function(){
        this.axios.post(api.deleteWorkshop,{name:this.workshopToRemove}).then((resp)=>{
        	if(resp.data.status === 1){
            this.fetchWorkshopData();
            this.$message({
              type:'success',
              message:'车间删除成功!'
            })
            this.isModifying = false;
            this.isDeleteDialogShow = false;
          }
        })
      },
    	//删除车间
      handleRemoveTag: function(tagName){
      	this.isDeleteDialogShow = true;
        this.workshopToRemove = tagName
      },
			//拉取车间信息
      fetchWorkshopData: function(){
        this.loading = true;
        this.workshopList = [];
        this.axios.get(api.fetchWorkshopList).then((resp)=>{
        	if(resp.data.status === 1){
            resp.data.workshopList.forEach((item)=>{
            	this.workshopList.push({
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
