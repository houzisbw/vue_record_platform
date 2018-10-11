<!--排班考勤的各项的tag列表(用于配置下拉项的数据)-->
<template>
  <div class="wrapper">
    <div class="title">
      <i class="iconfont title-icon" :class="[titleIcon]"></i>
      <span class="title-text">{{title}}</span>
    </div>
    <div class="content" v-loading="loading">
      <!--操作栏-->
      <div class="top-operation-wrapper">
        <!--添加新用户按钮-->
        <el-button type="primary" size="small" @click="showAddModal">
          <i class="iconfont icon-plus"></i>
          <span style="padding-left: 5px;">{{btnName}}</span>
        </el-button>
      </div>
      <!--标签区域-->
      <div class="modify-user-table-wrapper clearfix">
        <div v-if="!isTagListEmpty">
          <span class="tag-span" v-for="tag in tagList">
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
        <span>确定删除<span style="color: #409EFF;"> {{itemToRemove}} </span>?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isDeleteDialogShow = false" size="mini">取 消</el-button>
          <el-button type="primary"
                     :loading="isModifying"
                     @click="confirmDelete"
                     size="mini">
            确 定
          </el-button>
        </span>
      </el-dialog>
      <!--添加标签的对话框-->
      <el-dialog
        :title="btnName"
        :visible.sync="isAddDialogShow"
        top="0"
        @close="cancelAddDialog"
        :close-on-click-modal="false"
        custom-class="tag-edit-dialog"
      >
        <!--表单内容区域-->
        <div class="user-edit-dialog-form-wrapper">
          <el-form label-position="right"
                   ref="addForm"
                   :rules="rules"
                   label-width="80px"
                   :model="addData">
            <el-form-item :label="addInputName" prop="itemName" style="margin-bottom: 0;">
              <el-input v-model="addData.itemName"
                        ref="addInput"
                        size="small">
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelAddDialog" size="mini">取 消</el-button>
          <el-button type="primary"
                     :loading="isModifying"
                     @click="confirmAdd('addForm')"
                     size="mini">
            确 定
          </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
	export default {
		name: '',
    props:{
			//标题icon名称
      titleIcon:{
      	type:String,
        default:'icon-contacts'
      },
      //标题名字
      title:{
      	type:String,
        default:'标题'
      },
      //按钮名字
      btnName:{
      	type:String,
        default:'按钮'
      },
      //添加界面的文本
      addInputName:{
      	type:String,
        default:''
      },
      //获取数据的url
      fetchUrl:{
      	type:String,
        required:true
      },
      //添加数据的url
      addUrl:{
        type:String,
        required:true
      },
      //删除数据的url
      deleteUrl:{
      	type:String,
        required:true
      }
    },
    computed:{
      isTagListEmpty:function(){
        return this.tagList.length===0
      }
    },
    mounted:function(){
      this.fetchTagData();
    },
    methods:{
    	//拉取标签数据
      fetchTagData:function(){
        this.loading = true;
        this.tagList = [];
        this.axios.get(this.fetchUrl).then((resp)=>{
          if(resp.data.status === 1){
            resp.data.tagList.forEach((item)=>{
              this.tagList.push({
                name:item.name,
                group:item.group
              })
            })
          }
          this.loading = false;
        })
      },
      handleRemoveTag:function(tagName){
        this.isDeleteDialogShow = true;
        this.itemToRemove = tagName;
      },
      confirmDelete:function(){
        this.axios.post(this.deleteUrl,{name:this.itemToRemove}).then((resp)=>{
          if(resp.data.status === 1){
            this.fetchTagData();
            this.$message({
              type:'success',
              message:'删除成功!'
            });
          }else{
            this.$message({
              type:'error',
              message:'删除失败!'
            });
          }
          this.isModifying = false;
          this.isDeleteDialogShow = false;
        })
      },
      confirmAdd:function(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.isModifying = true;
            this.axios.post(this.addUrl,{name:this.addData.itemName}).then((resp)=>{
              if(resp.data.status === 1){
                this.fetchTagData();
                this.$message({
                  type:'success',
                  message:'添加成功!'
                })
              }else if(resp.data.status === 6){
              	//数据重复
                this.$message({
                  type:'error',
                  message:'已存在,请勿重复添加!'
                })
              }else{
                this.$message({
                  type:'error',
                  message:'添加失败!'
                })
              }
              this.isModifying = false;
              this.isAddDialogShow = false;
            })
          }else{
            return false
          }
        })
      },
      cancelAddDialog:function(){
      	this.isAddDialogShow = false;
      },
      showAddModal:function(){
      	//清空数据
        this.isAddDialogShow = true;
        this.$nextTick(()=>{
          this.$refs['addForm'].resetFields();
        })
      }
    },
		data () {
      var validateItemName = (rule, value, callback)=>{
        if (value==='') {
          callback(new Error('输入不能为空!'));
        } else {
          callback();
        }
      };
			return {
        //是否正在加载页面数据
        loading:false,
        tagList:[],
        isDeleteDialogShow:false,
        isAddDialogShow:false,
        itemToRemove:'',
        //是否正在发送请求中
        isModifying:false,
        addData:{
          itemName:''
        },
        rules:{
          itemName:[
            { validator: validateItemName, trigger: 'blur' }
          ],
        },
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
.wrapper{
  background-color: #fff;
  margin-bottom: 30px;
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
