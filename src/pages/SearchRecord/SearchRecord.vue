<!--管理员查询记录页面-->
<template>
  <div class="wrapper">
    <!--搜索模块-->
    <div class="search-wrapper">
      <!--面包屑导航-->
      <div class="breadcumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>错误记录</el-breadcrumb-item>
          <el-breadcrumb-item>查询/修改记录</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="title">
        管理员查询记录页面
      </div>
      <!--搜索框区域-->
      <div class="search-box-area clearfix">
        <div class="select-wrapper">
          <span class="select-title">记录年份:</span>
          <el-select v-model="yearValue"
                     clearable
                     filterable
                     placeholder="请选择"
                     size="small">
            <el-option
              v-for="item in yearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="select-wrapper">
          <span class="select-title">记录月份:</span>
          <el-select v-model="monthValue"
                     filterable
                     clearable
                     placeholder="请选择"
                     size="small">
            <el-option
              v-for="item in monthOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="select-wrapper"  v-auth="['2','1']">
          <span class="select-title">记录人员:</span>
          <el-select v-model="staffValue"
                     filterable
                     clearable
                     placeholder="请选择"
                     size="small">
            <el-option
              v-for="item in staffOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <!--搜索按钮区域-->
        <div class="select-wrapper">
          <el-dropdown placement="bottom">
            <el-button type="primary"
                       :loading="isSearching"
                       size="small"
                       @click="searchRecords">
              搜索
            </el-button>
            <el-dropdown-menu slot="dropdown" class="search-dropdown">
              <el-checkbox v-model="onlyUnconfirmed">只看未确认</el-checkbox>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button size="small" @click="resetValues">
            重置
          </el-button>
        </div>
      </div>
    </div>
    <!--记录列表模块-->
    <div class="record-content">
      <div class="title">
        <i class="iconfont icon-detail title-icon"></i>
        <span class="title-text">错误记录详情</span>
      </div>
      <div class="content" v-loading="isSearching">
        <div v-if="isRecordListEmpty" class="empty-text">
          <i class="iconfont icon-frown empty-icon"></i>
          <span>暂无数据</span>
        </div>
        <!--表格区域-->
        <div v-else class="record-table clearfix">
          <el-table
            :data="recordList"
            border
            :row-class-name="tableRowClassName"
            style="width: 100%">
            <el-table-column
              align="center"
              width="100"
              prop="username"
              label="姓名"
            >
            </el-table-column>
            <el-table-column
              align="center"
              width="100"
              prop="date"
              label="日期"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="workshop"
              width="80"
              label="车间">
            </el-table-column>
            <el-table-column
              align="center"
              prop="type"
              width="150"
              label="类型">
            </el-table-column>
            <el-table-column
              align="center"
              prop="error"
              min-width="100"
              label="错误说明">
            </el-table-column>
            <el-table-column
              align="center"
              width="100"
              label="图片">
              <template slot-scope="scope">
                <span v-if="scope.row.imageUrl">
                  <el-button  size="mini" @click="handleImgShowClick(scope.row.imageUrl)">
                    查看
                  </el-button>
                </span>
                <span v-else>
                    无
                </span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              width="100"
              label="确认">
              <template slot-scope="scope">
                <span :class="{'color-blue':scope.row.isConfirm==='1'}">
                  {{scope.row.isConfirm==='1'?'已确认':'未确认'}}
                </span>
              </template>
            </el-table-column>
            <!--操作栏(只有超级管理员显示)-->
            <el-table-column
              align="center"
              width="150"
              v-if="userAuth === '2'"
              label="操作">
              <template slot-scope="scope">
                <el-button type="danger"
                           size="mini"
                           @click="removeRecord(scope.row)">
                  删除
                </el-button>
                <el-button type="primary"
                           @click="modifyRecord(scope.row)"
                           size="mini">
                  修改
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--分页区域-->
          <div class="pagination-wrapper">
            <el-pagination
              background
              :disabled="isSearching"
              :current-page="currentPage"
              @current-change="handleCurrentChange"
              layout="total,prev, pager, next"
              :total="totalCount">
            </el-pagination>
          </div>
        </div>
        <!--大图组件-->
        <album v-if="albumShow"
               :img-src="albumImgUrl"
               @close="handleAlbumClose">
        </album>
      </div>
      <!--删除按钮的对话框-->
      <el-dialog
        title="删除该记录"
        :visible.sync="isDeleteDialogShow"
        top="0"
        :close-on-click-modal="false"
        custom-class="user-edit-dialog"
      >
        <span>确定删除该条记录({{this.recordDataToRemove.username}})?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isDeleteDialogShow = false" size="mini">取 消</el-button>
          <el-button type="primary"
                     :loading="isModifying"
                     @click="confirmDeleteRecord"
                     size="mini">
            确 定
          </el-button>
        </span>
      </el-dialog>
      <!--修改记录的对话框-->
      <el-dialog
        title="修改记录"
        :visible.sync="isModifyDialogShow"
        top="0"
        @close="cancelModifyRecord"
        :close-on-click-modal="false"
        custom-class="user-edit-dialog"
      >
        <!--表单内容区域-->
        <div class="user-edit-dialog-form-wrapper" v-loading="isFormLoading">
          <el-form label-position="right"
                   ref="modifyRecordForm"
                   :rules="modifyRecordRules"
                   label-width="80px"
                   :model="modifyRecordData">
            <el-form-item label="用户名" >
              <el-select v-model="modifyRecordData.username"
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
            <el-form-item label="记录日期" >
              <el-date-picker
                v-model="modifyRecordData.date"
                type="date"
                size="small"
                :editable="false"
                :clearable="false"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="车间" >
              <el-select v-model="modifyRecordData.workshop"
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
            <el-form-item label="类型" >
              <el-select v-model="modifyRecordData.type"
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
            <el-form-item label="错误说明" >
              <el-input v-model="modifyRecordData.error" size="small">
              </el-input>
            </el-form-item>
            <el-form-item label="是否确认" >
              <el-switch
                v-model="modifyRecordData.isConfirm"
                active-text="已确认"
                inactive-text="未确认">
              </el-switch>
            </el-form-item>
            <el-form-item label="图片" class="no-padding-top">
              <image-upload v-model="modifyRecordData.imageUrl"
                            v-if="isModifyDialogShow"
              >
              </image-upload>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer" v-loading="isFormLoading">
          <el-button  size="mini">取 消</el-button>
          <el-button type="primary"
                     :loading="isModifying"
                     @click="handleModifyRecordSubmit"
                     size="mini">
            确 定
          </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import config from './../../config/config'
  import api from './../../api/api'
  import Album from './../../components/Album.vue'
  import ImageUpload from './../../components/ImageUpload.vue'
	export default {
    name: 'SearchRecord',
    components:{
      Album,
      ImageUpload
    },
    mounted:function(){
      this.getDropdownInfo()
    },
    computed:{
    	isRecordListEmpty:function(){
    		return this.recordList.length===0
      },
      userAuth:function(){
    		return this.$store.getters.getUserAuth
      }
    },
    methods:{
    	//提交修改好的记录
      handleModifyRecordSubmit: function(){
      	console.log(this.modifyRecordData)
      },
    	//关闭修改对话框
      cancelModifyRecord: function(){
        this.isModifyDialogShow = false;
      },
    	//修改按钮点击
      modifyRecord: function(rowData){
        this.isModifyDialogShow = true;
        //加载相关数据(姓名列表，车间列表，错误类型列表)
        this.isFormLoading = true;
        this.axios.get(api.fetchModifyDialogData).then((resp)=>{
        	if(resp.data.status === 1){
        		this.initModifyDialogSelect(resp.data.result);
            this.initDefaultDataInModifyDialog(rowData);
          }
          this.isFormLoading = false;
        })
      },
      //初始化修改对话框里的默认数据
      initDefaultDataInModifyDialog: function(rowData){
      	let obj = {
            workshop:rowData.workshop,
            username:rowData.username,
            type:rowData.type,
            date:rowData.date,
            isConfirm:rowData.isConfirm==='1',
            imageUrl:rowData.imageUrl,
            error:rowData.error,
        };
      	this.modifyRecordData = obj;
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
        })
        //初始化车间列表
        let workshopList = [];
        data[1].forEach((item)=>{
          workshopList.push({
            label:item,
            value:item
          })
        })
        //初始化错误类型列表
        let typeList = [];
        data[2].forEach((item)=>{
          typeList.push({
            label:item,
            value:item
          })
        })
        this.usernameList = userList;
        this.workshopList = workshopList;
        this.typeList = typeList;
      },
    	//确认删除
      confirmDeleteRecord: function(){
      	this.isModifying = true;
        this.axios.post(api.removeRecords,{data:this.recordDataToRemove}).then((resp)=>{
          if(resp.data.status === 1){
            this.$message({
              type:'success',
              message:'记录删除成功!'
            })
          }
          this.isDeleteDialogShow = false;
          this.isModifying = false;
          //保证从第一页开始搜
          this.currentPage = 1;
          this.searchRecords();
        })
      },
    	//点击删除按钮
      removeRecord: function(rowData){
      	this.recordDataToRemove = rowData;
      	this.isDeleteDialogShow = true;
      },
    	//查看图片
      handleImgShowClick: function(imageUrl){
      	//打开大图组件
        this.albumImgUrl = imageUrl;
        this.albumShow = true;
      },
    	//处理大图照片关闭
      handleAlbumClose: function(){
        this.albumShow = false
      },
    	//重要行高亮
      tableRowClassName: function({row,rowIndex}){
        if(row.isImportant === '1'){
        	return 'warning-row'
        }
        return ''
      },
    	//分页页码改变
      handleCurrentChange: function(curPage){
        //防止点击相同页
        if(this.currentPage === curPage)return
        this.currentPage = curPage;
        this.search()
      },
      //发送搜索请求
      search: function(){
        //发送到后台的data
        let data = {
          yearValue:this.realYearValue,
          monthValue:this.realMonthValue,
          staffValue:this.realStaffValue,
          isConfirm:this.onlyUnconfirmed?'1':'0',
          currentPage:this.currentPage,
          pageSize:this.pageSize
        };
        this.isSearching = true;
        this.axios.post(api.searchRecords,{data:data}).then((resp)=>{
          if(resp.data.status === 1){
            this.recordList = resp.data.recordArray;
            this.totalCount = resp.data.totalCount;
            if(resp.data.recordArray.length===0){
              this.$message({
                type:'warning',
                message:'没有搜索到数据~'
              })
            }
          }
          this.isSearching = false
        })
      },
    	//搜索数据
      searchRecords: function(){
      	//首先判断权限
        let auth = this.$store.getters.getUserAuth;
        if(auth!==config.ORDINARY_USER){
          //管理员类型
          if(this.staffValue!==''){
            if((this.yearValue===''&&this.monthValue!=='')||
               (this.yearValue!==''&&this.monthValue==='')
            ){
              this.$message({
                type:'warning',
                message:'请同时输入年份和月份或者都不输入!'
              })
              return
            }
          }else{
            if(this.yearValue===''||this.monthValue===''){
              this.$message({
                type:'warning',
                message:'请同时输入年份和月份!'
              })
              return
            }
          }
          //更新值
          this.realYearValue = this.yearValue;
          this.realMonthValue = this.monthValue;
          this.realStaffValue = this.staffValue;
          this.search();
        }else{
          //普通用户
          //todo





        }
      },
    	//重置数据
      resetValues: function(){
      	this.yearValue = '';
        this.monthValue = '';
        this.staffValue = '';

        this.realYearValue = '';
        this.realMonthValue = '';
        this.realStaffValue = '';
      },
    	//获取记录年份，记录人员列表
      getDropdownInfo:function(){
        this.axios.get(api.fetchDropdownInfo).then((resp)=>{
        	if(resp.data.status === 1){
            //构建年份数组
            let yearObj = resp.data.resultArray[1];
        		let yearOptions = [];
            for(let year=yearObj.minYear;year<=yearObj.maxYear;year++){
              yearOptions.push({
                value: year,
                label: year
              })
            }
            this.yearOptions = yearOptions;
            //构建人员数组
            let staffOptions = [];
            let staffList = resp.data.resultArray[0];
            staffList.forEach((item)=>{
              staffOptions.push({
                value: item,
                label: item
              })
            })
            this.staffOptions = staffOptions;
            //构建月份数组
            let monthOptions = [];
            for(let i=1;i<=12;i++){
              monthOptions.push({
                value: i<10?('0'+i):(''+i),
                label: i<10?('0'+i):(''+i)
              })
            }
            this.monthOptions = monthOptions;
          }
        })
      }
    },
		data () {
    	return {
    		/* 记录修改相关数据 */
    		isModifyDialogShow:false,
        modifyRecordData:{
    			workshop:'',
          username:'',
          type:'',
          date:'',
          //确认字段需要转为字符串
          isConfirm:'',
          imageUrl:'',
          error:'',
          date:''
        },
        modifyRecordRules:{},
        //修改对话框是否在加载数据
        isFormLoading:false,
        //下拉用户姓名列表
        usernameList:[],
        workshopList:[],
        typeList:[],

    		//是否正在删除
        isModifying:false,
    		//是否显示删除对话框
        isDeleteDialogShow:false,
        //要删除的数据
        recordDataToRemove:{},

    		//是否显示大图照片
        albumShow:false,
        //大图组件的图片url
        albumImgUrl:'',

    		//是否正在搜索
        isSearching:false,
				//是否只看未确认
        onlyUnconfirmed:false,
				//记录年份相关
        yearOptions:[],
        yearValue:'',
        //记录月份相关
        monthOptions:[],
        monthValue:'',
        //记录人员相关
        staffOptions:[],
        staffValue:'',

        /* 真正用于搜索的年月人员 */
        realYearValue:'',
        realMonthValue:'',
        realStaffValue:'',

        //记录数组
        recordList:[],
        /* 分页相关 */
        //当前页数
        currentPage:1,
        //每页条目数
        pageSize:10,
        //总条目数量(后台传递)
        totalNum:0,
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
  .wrapper{
    .search-wrapper{
      min-height:100px;
      background-color: #fff;
      /*负margin用来抵消原本wrapper的margin*/
      margin-left: -24px;
      margin-right: -24px;
      margin-top: -24px;
      box-sizing: border-box;
      padding: 20px 20px 20px 40px;
      border-bottom:1px solid #e8e8e8;
      .breadcumb{
        margin-bottom: 20px;
      }
      .title{
        color:rgba(0,0,0,.85);
        font-size: 18px;
      }
      .search-box-area{
        margin-top: 20px;
        /*display: flex;*/
        /*flex-direction: row;*/
        /*justify-content: space-between;*/
        .select-wrapper{
          float:left;
          box-sizing: border-box;
          margin-right: 25px;

        }
        .select-title{
          color:rgba(0,0,0,.85);
          font-size: 14px;
          padding-right:5px;
        }
      }
    }
    .record-content{
      background-color: #fff;
      margin-top: 24px;
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
      .content {
        padding: 20px 32px;
        box-sizing: border-box;
        position: relative;
        min-height:400px;
        .record-table{
          .color-blue{
            color:#409EFF;
          }
          .pagination-wrapper{
            float:right;
            overflow: hidden;
            margin-top: 40px;
            position: relative;
            right:-10px;
          }
        }
        .empty-text{
          color:rgba(0,0,0,.25);
          text-align: center;
          position: absolute;
          top:50%;
          left:50%;
          transform: translate(-50%,-50%);
        }
        .empty-icon{
          font-size: 22px;
          position: relative;
          top:2px;
          padding-right: 10px;
        }
      }
    }
  }
</style>
<style type="text/less" lang="less">
  .search-wrapper{
    .el-breadcrumb__inner:not(.is-link){
      color:rgba(0,0,0,0.45);
    }
    .el-select{
      width:160px;
    }
    .el-button+.el-button{
      margin-left: 5px;
    }
  }
  .record-table .el-table td{
    padding:6px 0;
  }
  .record-table .el-table .warning-row{
    color: #dd5b57;
  }
  .search-dropdown{
    padding-left:20px;
    padding-right:20px;
  }
  .record-content{
    .el-button+.el-button{
      margin-left: 5px;
    }
  }
  .record-content .record-table .el-table__header tr th{
    background-color: #fafafa!important;
  }
  .el-form-item{
    margin-bottom: 10px;
  }
  .no-padding-top .el-form-item__label{
    line-height: normal!important;
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
