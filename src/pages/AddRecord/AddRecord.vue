<!--添加记录页面-->
<template>
  <div class="wrapper">
    <!--头部模块-->
    <div class="search-wrapper">
      <!--面包屑导航-->
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>错误记录</el-breadcrumb-item>
          <el-breadcrumb-item>添加记录</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="title">
        管理员添加记录页面
      </div>
    </div>
    <!--表单模块-->
    <div class="record-content">
      <div class="title">
        <i class="iconfont icon-plus-square title-icon"></i>
        <span class="title-text">添加新记录</span>
      </div>
      <div class="content">
        <!--表单内容区域-->
        <div class="user-edit-dialog-form-wrapper user-add-record" v-loading="isFormLoading">
          <el-form label-position="right"
                   ref="addRecordForm"
                   :rules="addRecordRules"
                   label-width="80px"
                   :model="addRecordData">
            <el-form-item label="用户名" prop="username">
              <el-select v-model="addRecordData.username"
                         size="small"
                         placeholder="请选择">
                <el-option
                  class="user-edit-dialog-select"
                  v-for="item in usernameList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="记录日期" prop="date">
              <el-date-picker
                v-model="addRecordData.date"
                type="date"
                value-format="yyyy-MM-dd"
                size="small"
                :editable="false"
                :clearable="false"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="车间" prop="workshop">
              <el-select v-model="addRecordData.workshop"
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
            <el-form-item label="类型" prop="type">
              <el-select v-model="addRecordData.type"
                         size="small"
                         placeholder="请选择">
                <el-option
                  class="user-edit-dialog-select"
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="辅/批">
              <el-select v-model="addRecordData.subType"
                         size="small"
                         placeholder="请选择">
                <el-option
                  class="user-edit-dialog-select"
                  v-for="item in subTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="错误说明" prop="error">
              <el-input v-model="addRecordData.error"
                        type="textarea"
                        size="small">
              </el-input>
            </el-form-item>
            <el-form-item label="是否重要" >
              <el-switch
                v-model="addRecordData.isImportant"
                active-text="重要"
                inactive-text="不重要">
              </el-switch>
            </el-form-item>
            <el-form-item label="图片" class="no-padding-top">
              <image-upload v-model="addRecordData.imageUrl"
                            ref="imageUpload"
                            @loading="handleImageLoading"
              >
              </image-upload>
            </el-form-item>
            <el-form-item >
              <div class="btn-wrapper">
                <el-button type="primary"
                           @click="submit('addRecordForm')"
                           :disabled="isImageUploading"
                           class="submit-btn">
                  提交
                </el-button>
                <el-button  class="submit-btn"
                            @click="reset('addRecordForm')">
                  清空
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '@/api/api'
  import ImageUpload from '@/components/ImageUpload.vue'
	export default {
		name: 'AddRecord',
    components:{
      ImageUpload
    },
    mounted:function(){
			this.fetchDropdownData();
    },
    methods:{
    	//提交
      submit: function(formName){
      	//校验除了图片项,其他都必填
        this.$refs[formName].validate((valid)=>{
          if(valid){
            //生成数据对象
            let {workshop,username,type,date,isImportant,
              imageUrl,error,subType} = this.addRecordData;
            let data = {
              workshop,
              username,
              type:subType.replace('*','')+'*'+type.replace('*',''),
              date,
              isImportant:isImportant?'1':'0',
              imageUrl,
              error
            };
            this.axios.post(api.addRecordData,{data}).then((resp)=>{
            	if(resp.data.status === 1){
                this.$message({
                  type:'success',
                  message:'记录提交成功~'
                });
                this.reset('addRecordForm')
              }
            })
          }else{
          	this.$message({
              type:'warning',
              message:'请填写完整~'
            });
          	return false
          }
        })

      },
    	//清空数据
      reset: function(formName){
        this.$refs[formName].resetFields();
        this.addRecordData = {
          workshop:'',
          username:'',
          type:'',
          date:'',
          //重要字段需要转为字符串
          isImportant:false,
          imageUrl:'',
          error:'',
          //特殊类型:辅,批2个选项
          subType:'辅'
        }
      },
    	//处理图片上传的状态
      handleImageLoading: function(isLoading){
      	this.isImageUploading = isLoading;
      },
			// 获取下拉菜单数据
      fetchDropdownData: function(){
      	this.isFormLoading = true;
      	this.axios.get(api.fetchModifyDialogData).then((resp)=>{
      		if(resp.data.status === 1){
      			this.initModifyDialogSelect(resp.data.result)
          }
          this.isFormLoading = false;
        })
      },
      //初始化修改对话框的下拉列表
      initModifyDialogSelect: function(data){
        //初始化人员列表
        let userList = [];
        data[0].forEach((item)=>{
          userList.push({
            label:item,
            value:item
          })
        });
        //初始化车间列表
        let workshopList = [];
        data[1].forEach((item)=>{
          workshopList.push({
            label:item,
            value:item
          })
        });
        //初始化错误类型列表
        let typeList = [];
        data[2].forEach((item)=>{
          typeList.push({
            label:item,
            value:item
          })
        });
        this.usernameList = userList;
        this.workshopList = workshopList;
        this.typeList = typeList;
      },
    },
		data () {
			return {
				//图片是否在上传中
        isImageUploading:false,
        //表单是否加载中
        isFormLoading:false,
        addRecordRules:{
          workshop: [
            { required: true, message: '请选择车间', trigger: 'change' }
          ],
          username: [
            { required: true, message: '请选择人员', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择类型', trigger: 'change' }
          ],
          date: [
            { required: true, message: '请选择日期', trigger: 'change' }
          ],
          error: [
            { required: true, message: '请填写错误说明', trigger: 'blur' }
          ],
        },
        addRecordData:{
          workshop:'',
          username:'',
          type:'',
          date:'',
          //重要字段需要转为字符串
          isImportant:false,
          imageUrl:'',
          error:'',
          subType:'辅'
        },
        //下拉列表数组
        usernameList:[],
        workshopList:[],
        typeList:[],
        subTypeList:[
          {
            label:'辅',
            value:'辅'
          },
          {
            label:'批',
            value:'批'
          }
        ]
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
.wrapper{
  .search-wrapper {
    min-height: 100px;
    background-color: #fff;
    /*负margin用来抵消原本wrapper的margin*/
    margin-left: -24px;
    margin-right: -24px;
    margin-top: -24px;
    box-sizing: border-box;
    padding: 20px 20px 20px 40px;
    border-bottom: 1px solid #e8e8e8;
    .breadcrumb {
      margin-bottom: 20px;
    }
    .title {
      color: rgba(0, 0, 0, .85);
      font-size: 18px;
    }
  }
  .record-content {
    background-color: #fff;
    margin-top: 24px;
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
      position: relative;
      min-height: 400px;
      .btn-wrapper{
        margin-top: 20px;
      }
    }
  }
}
</style>
<style type="text/less" lang="less">
  .user-edit-dialog-form-wrapper{
    width:500px;
    margin: 0 auto;
  }
  .user-add-record .el-select{
    width:100%;
  }
  .user-add-record .submit-btn.el-button{
    width:100px;
  }


</style>
