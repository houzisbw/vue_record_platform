<!--修改用户(添加删除，改密码等)-->
<template>
  <div class="wrapper">
    <div class="title">
      <i class="iconfont icon-addteam title-icon"></i>
      <span class="title-text">添加/删除本组用户</span>
    </div>
    <div class="content" v-loading="loading">
      <!--操作栏-->
      <div class="top-operation-wrapper">
        <!--添加新用户按钮-->
        <el-button type="primary" size="small" @click="addUser">
          <i class="iconfont icon-plus"></i>
          <span style="padding-left: 5px;">添加用户</span>
        </el-button>
      </div>
      <!--表格区域-->
      <div class="modify-user-table-wrapper clearfix">
        <el-table
          :data="userTableData"
          style="width: 100%">
          <el-table-column
            label="用户名"
           >
            <!--这里的slot-scope作用域插槽作用是自定义显示子组件的数据-->
            <template slot-scope="scope">
              <span>{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="用户密码"
            >
            <template slot-scope="scope">
              <!--默认显示圆点,点击眼睛显示密码-->
              <div slot="reference"
                   @mouseenter="handleMouseEnter(scope.$index)"
                   @mouseleave="handleMouseLeave"
                   class="name-wrapper">
                <span v-if="scope.$index !== mouseDownIndexOfPassword">
                  {{'●'.repeat(scope.row.password.length)}}
                </span>
                <span v-else>
                  {{scope.row.password}}
                </span>
                <i class="iconfont password-show"
                   @mousedown="handleEyeMouseDown(scope.row.password,scope.$index)"
                   :class="[scope.$index === passwordIndexOfMouseenter ? '':'password-hide',
                            scope.$index === mouseDownIndexOfPassword ? 'icon-eye-fill':'icon-eye']">
                </i>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="用户权限"
            >
            <template slot-scope="scope">
              <!--过滤器格式化权限为中文-->
              <div slot="reference" class="name-wrapper">
                <span v-color="scope.row.auth">
                  {{ scope.row.auth | userAuth }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="用户组别"
          >
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                {{ scope.row.group }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页区域-->
        <div class="pagination-wrapper ">
          <el-pagination
            background
            :disabled="loading"
            @current-change="handleCurrentChange"
            layout="total,prev, pager, next"
            :total="totalNum">
          </el-pagination>
        </div>
      </div>
      <!--编辑按钮的对话框-->
      <el-dialog
        title="修改用户信息"
        :visible.sync="editDialogShow"
        top="0"
        :close-on-click-modal="false"
        custom-class="user-edit-dialog"
        >
        <!--表单内容区域-->
        <div class="user-edit-dialog-form-wrapper">
          <el-form label-position="right"
                   ref="userInfoForm"
                   :rules="editDialogRules"
                   label-width="80px"
                   :model="userFormData">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="userFormData.username"
                        size="small">
              </el-input>
            </el-form-item>
            <el-form-item label="用户权限" style="margin-bottom: 0;">
              <el-select v-model="userFormData.userAuth"
                         size="small"
                         placeholder="请选择">
                <el-option
                  class="user-edit-dialog-select"
                  v-for="item in editDialogAuthList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogShow = false" size="mini">取 消</el-button>
          <el-button type="primary"
                     :loading="isModifying"
                     @click="confirmModify('userInfoForm')"
                     size="mini">
            确 定
          </el-button>
        </span>
      </el-dialog>

      <!--添加用户的对话框-->
      <el-dialog
        title="添加新用户"
        :visible.sync="isAddUserModalShow"
        top="0"
        @close="cancelAddUser"
        :close-on-click-modal="false"
        custom-class="user-edit-dialog"
      >
        <!--表单内容区域-->
        <div class="user-edit-dialog-form-wrapper">
          <el-form label-position="right"
                   ref="addUserForm"
                   :rules="addUserRules"
                   label-width="80px"
                   :model="addUserData">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addUserData.username"
                        size="small">
              </el-input>
            </el-form-item>
            <el-form-item label="用户密码" prop="password">
              <el-input v-model="addUserData.password"
                        size="small">
              </el-input>
            </el-form-item>
            <el-form-item label="用户权限" style="margin-bottom: 0;">
              <el-select v-model="addUserData.auth"
                         size="small"
                         placeholder="请选择">
                <el-option
                  class="user-edit-dialog-select"
                  v-for="item in editDialogAuthList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelAddUser" size="mini">取 消</el-button>
          <el-button type="primary"
                     :loading="isModifying"
                     @click="confirmAddUser('addUserForm')"
                     size="mini">
            确 定
          </el-button>
        </span>
      </el-dialog>

      <!--删除按钮的对话框-->
      <el-dialog
        title="删除该用户"
        :visible.sync="isDeleteDialogShow"
        top="0"
        :close-on-click-modal="false"
        custom-class="user-edit-dialog"
      >
        <span>确定删除用户<span style="color: #409EFF;">{{usernameToDelete}}</span>?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isDeleteDialogShow = false" size="mini">取 消</el-button>
          <el-button type="primary"
                     :loading="isModifying"
                     @click="confirmDeleteUser"
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
  import config from './../../config/config'
	export default {
		name: 'ModifyUser',
    mounted:function(){
			this.fetchUserData();
			this.fetchUserAuthList();
			document.addEventListener('mouseup',this.handleEyeMouseUp)
    },
    directives: {
    	//根据权限控制颜色,用指令可以更简便，简化html结构
      color: {
      	//注意是在更新时改变颜色
        update: function (el, binding, vnode) {
        	let auth = binding.value;
        	let colorMap = {
        		'0':'#606266',
            '1':'#409EFF',
            '2':'#f56c6c'
          };
        	el.style.color = colorMap[auth];
        },
        bind: function (el, binding, vnode) {
          let auth = binding.value;
          let colorMap = {
            '0':'#606266',
            '1':'#409EFF',
            '2':'#f56c6c'
          };
          el.style.color = colorMap[auth];
        },
      }
    },
    computed:{
    },
    filters:{
    	userAuth:function(val){
    		if(!val)return config.authName[0];
    		let chineseAuth = config.authName[val.toString()];
        return chineseAuth
      }
    },
    beforeDestroy:function(){
    	//移除mouseup事件,注意匿名函数无法移除
      document.removeEventListener('mouseup',this.handleEyeMouseUp)
    },
    methods: {
    	//确定删除用户
      confirmDeleteUser: function(){
        this.isModifying = true;
        this.axios.post(api.deleteUser,{username:this.usernameToDelete}).then((resp)=>{
        	if(resp.data.status === 1){
            this.$message({
              type:'success',
              message:'用户删除成功!'
            });
          }
          this.isModifying = false;
        	this.isDeleteDialogShow = false;
          this.fetchUserData();
          this.fetchUserAuthList();
        })
      },
    	//添加用户
      addUser: function(){
        this.isAddUserModalShow = true;
      },
      //取消添加用户
      cancelAddUser: function(){
        this.isAddUserModalShow = false;
        this.addUserData = {
          username:'',
          password:'',
          auth:'0'
        }
      },
      //确认添加用户
      confirmAddUser: function(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isModifying = true;
            let data = {
              username:this.addUserData.username,
              auth:this.addUserData.auth,
              password:this.addUserData.password
            };
            this.axios.post(api.addUser,data).then((resp)=>{
              if(resp.data.status === 1){
                this.$message({
                  type:'success',
                  message:'用户添加成功!'
                });
                this.fetchUserData();
                this.fetchUserAuthList();
                this.isAddUserModalShow = false;
              }
              this.isModifying = false;
            })
          }else{
            return false;
          }
        })
      },
    	//确认修改
      confirmModify: function(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isModifying = true;
          	let data = {
          		modifiedName:this.userFormData.username,
              auth:this.userFormData.userAuth,
              originName:this.editUserOriginName
            };
            this.axios.post(api.modifyUserInfo,data).then((resp)=>{
              if(resp.data.status === 1){
              	this.$message({
                  type:'success',
                  message:'用户信息修改成功!'
                });
                this.fetchUserData();
                this.fetchUserAuthList();
                this.editDialogShow = false;
              }
              this.isModifying = false;
            })
          } else {
            return false;
          }
        });
      },
    	//处理眼睛icon鼠标抬起的逻辑
      handleEyeMouseUp: function(){
        this.mouseDownIndexOfPassword = -1;
      },
    	//处理眼睛icon鼠标按下的逻辑
      handleEyeMouseDown: function(password,index){
        this.mouseDownIndexOfPassword = index;
      },
      //处理密码单元格鼠标移出
      handleMouseLeave: function(){
        this.passwordIndexOfMouseenter = -1;
      },
      //处理密码单元格鼠标移入
      handleMouseEnter: function(index){
      	this.passwordIndexOfMouseenter = index
      },
    	//页码改变时触发查询
      handleCurrentChange: function(curPage){
      	//防止点击相同页
      	if(this.currentPage === curPage)return
      	this.currentPage = curPage;
      	this.fetchUserData()
      },
      //获取用户权限列表
      fetchUserAuthList: function(){
        this.axios.get(api.fetchUserAuthList).then((resp)=>{
        	if(resp.data.status === 1){
        		let options = [];
        		resp.data.authList.forEach((item)=>{
        			options.push({
                value:item.authCode,
                label:item.authName
              })
            });
            this.editDialogAuthList = options
          }
        })
      },
			//获取该超管下用户的数据
      fetchUserData: function(){
        this.loading = true;
      	let queryCondition = {
      		currentPage:this.currentPage,
          pageSize:this.pageSize
        };
        this.axios.post(api.fetchUserCredentialInfo,queryCondition).then((resp)=>{
        	if(resp.data.status === 1){
            this.userTableData= resp.data.userData;
            this.totalNum = resp.data.totalNum;
          }
          this.loading = false;
        })
      },
      handleEdit(index, row) {
        this.editDialogShow = true;
        this.editUserOriginName = row.username;
        this.userFormData = {
          username:row.username,
          userAuth:row.auth
        }
      },
      handleDelete(index, row) {
        this.isDeleteDialogShow = true;
        this.usernameToDelete = row.username;
      }
    },
		data () {
    	//编辑对话框的用户名输入框验证规则
      let validateUsername = function(rule, value, callback){
        if (value === '') {
          callback(new Error('用户名不能为空!'));
        } else {
          callback();
        }
      };
      let validatePassword = function(rule, value, callback){
        if (value.length<6) {
          callback(new Error('密码至少6位!'));
        } else {
          callback();
        }
      };
			return {
        loading:false,
        //用户数据数组
        userTableData: [],
        //当前页数
        currentPage:1,
        //每页条目数
        pageSize:10,
        //总条目数量(后台传递)
        totalNum:0,
        //当前鼠标移上去的密码单元格的index,控制该单元格的眼睛显示与否
        passwordIndexOfMouseenter:-1,
        //鼠标按下的单元格的index
        mouseDownIndexOfPassword:-1,
        //编辑对话框的显示与否
        editDialogShow:false,
        //修改状态下的用户数据
        userFormData:{
        	username:'',
          userAuth:''
        },
        //编辑状态下的用户原本名字
        editUserOriginName:'',
        //编辑对话框的表单验证规则
        editDialogRules: {
          username: [
            { validator: validateUsername, trigger: 'blur' }
          ]
        },
        //编辑对话框的用户权限列表
        editDialogAuthList : [],
        //是否正在提交修改
        isModifying:false,

        //添加用户相关数据
        isAddUserModalShow:false,
        //添加用户的表单验证规则
        addUserRules:{
        	username:[
            { validator: validateUsername, trigger: 'blur' }
          ],
          password:[
            { validator: validatePassword, trigger: 'blur' }
          ],
        },
        //添加用户的数据
        addUserData:{
        	username:'',
          password:'',
          auth:'0'
        },
        //删除对话框
        isDeleteDialogShow:false,
        //要删除的用户名
        usernameToDelete:''
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
        .pagination-wrapper{
          float:right;
          overflow: hidden;
          margin-top: 40px;
          position: relative;
          right:-10px;
        }
        .password-show{
          padding-left: 5px;
          position: relative;
          top:1px;
          cursor: pointer;
        }
        .password-hide{
          display: none;
        }
      }
    }
  }
</style>
<style type="text/less" lang="less">
  .modify-user-table-wrapper .el-table__header tr th{
    background-color: #fafafa!important;
  }
  //对话框自定义类名
  .user-edit-dialog{
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
    .el-dialog__footer{
      border-top:1px solid #e8e8e8;
      padding-bottom:10px;
    }
    .user-edit-dialog-form-wrapper{
      width:70%;
      margin: 0 auto;
    }
    .el-select--small{
      width: 140px!important;
    }
  }
</style>
