<!--历史排班情况(可在页面做修改)-->
<template>
  <div class="history-wrapper">
    <div class="title">
      <i class="iconfont icon-table title-icon"></i>
      <span class="title-text">历史排班情况</span>
      <div class="date-picker">
        <el-date-picker
          v-model="date"
          @change="handleDatePickerChange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="date"
          size="mini"
          placeholder="选择日期">
        </el-date-picker>
      </div>
    </div>
    <div class="content" v-loading="isLoading">
      <div class="empty-tips" v-show="isEmpty">
        <span v-if="isFirstLoaded">请选择日期查看排班情况~</span>
        <span v-else>当天无排班数据~</span>
      </div>
      <div class="shift-content-wrapper" v-show="!isEmpty">
        <!--公告栏上-->
        <el-card shadow="never" class="card">
          <div slot="header">
            <i class="iconfont icon-sound icon_pos"></i>
            <span>公告栏</span>
          </div>
          <div class="announcement" v-html="announcementUp">
          </div>
        </el-card>

        <!--排班数据部分-->
        <el-card class="shift-content"
                 :key="index"
                 v-for="(item,index) in shiftList"
                 shadow="never">
          <div class="card-content">
            <!--编辑按钮(管理员可见)-->
            <div class="edit-btn">
              <el-tooltip effect="dark" content="编辑该条排班数据" placement="top">
                <i class="iconfont icon-edit icon_no-outline"
                   @click="handleEdit(item)"
                   v-auth="['2']">
                </i>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除该条排班数据" placement="top">
                <i class="iconfont icon-delete icon_no-outline"
                   v-auth="['2']"
                   @click="handleDelete(item)">
                </i>
              </el-tooltip>
            </div>
            <div class="item-wrapper">
              <div class="item-title">
                <el-tag size="small">
                  排班车间
                </el-tag>
              </div>
              <div class="item-content">
                {{item.workshop?item.workshop:'无'}}
              </div>
            </div>
            <div class="item-wrapper">
              <div class="item-title">
                <el-tag size="small">
                  排班工序
                </el-tag>
              </div>
              <div class="item-content">
                {{item.process?item.process:'无'}}
              </div>
            </div>
            <div class="item-wrapper">
              <div class="item-title">
                <el-tag size="small">
                  排班班次
                </el-tag>
              </div>
              <div class="item-content">
                {{item.shift?item.shift:'无'}}
              </div>
            </div>
            <div class="item-wrapper">
              <div class="item-title">
                <el-tag size="small">
                  排班时间
                </el-tag>
              </div>
              <div class="item-content">
                {{(item.startTime&&item.endTime)?(item.startTime+' - '+item.endTime):'无'}}
              </div>
            </div>
            <div class="item-wrapper">
              <div class="item-title">
                <el-tag size="small">
                  排班人员
                </el-tag>
              </div>
              <div class="item-content">
                <el-tag size="small"
                        type="info"
                        :key="staff"
                        class="staff-tag"
                        v-for="(staff,index2) in item.regularStaffList">
                  {{staff}}
                  <span class="staff-type staff-regular">
                    正
                  </span>
                </el-tag>
                <el-tag size="small"
                        :key="index3"
                        v-for="(staff,index3) in item.tempStaffList"
                        type="info"
                        class="staff-tag">
                  {{staff}}
                  <span class="staff-type staff-temp">
                    临
                  </span>
                </el-tag>
              </div>
            </div>
            <div class="item-wrapper" style="margin-top:-15px">
              <div class="item-title">
                <el-tag size="small">
                  排班内容
                </el-tag>
              </div>
              <div class="item-content work-content" >{{item.workContent | workContentFormatter}}</div>
            </div>
          </div>
        </el-card>

        <!--公告栏下-->
        <el-card shadow="never" class="card">
          <div slot="header">
            <i class="iconfont icon-sound icon_pos"></i>
            <span>公告栏</span>
          </div>
          <div class="announcement" v-html="announcementDown">
          </div>
        </el-card>

        <!--编辑排班数据的对话框-->
        <el-dialog
          title="修改排班数据"
          top="5vh"
          :visible.sync="isEditDialogShow"
          :close-on-click-modal="false"
          custom-class="tag-edit-dialog"
        >
          <attendance-form :fetch-url="fetchUrl"
                           v-if="isEditDialogShow"
                           @close="handleClose"
                           :is-fetch-written="true"
                           :fetch-written-data-url="fetchWrittenDataUrl"
                           submit-text="确定修改排班数据?"
                           :id="selectedShiftId"
                           :submit-url="updateWrittenUrl">
          </attendance-form>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import api from '@/api/api'
  import AttendanceForm from '@/components/AttendanceAndArrangement/AttendanceForm'
	export default {
    name: '',
    components:{
      AttendanceForm
    },
		data () {
			return {
				//排班提交表单的prop
        fetchUrl:api.fetchAttendanceArrangeDropdown,
        fetchWrittenDataUrl:api.fetchWrittenDataUrl,
        updateWrittenUrl:api.updateWrittenData,
        //选择的排班的id
        selectedShiftId:'',

				//是否显示编辑对话框
        isEditDialogShow:false,
				//是否初次加载
        isFirstLoaded:true,
				//是否正在加载数据
        isLoading:false,
        //日期
        date:'',
        //公告栏上的数据
        announcementUp:'',
        //公告栏下的数据
        announcementDown:'',
        //当日排班数据
        shiftList:[]
			}
		},
    filters:{
			//格式化工作内容
      workContentFormatter:function(value){
      	return value?value:'无'
      }
    },
    computed:{
      //是否展示数据
      isEmpty:function(){
      	return this.shiftList.length===0
      },
    },
    methods:{
    	//关闭对话框
      handleClose:function(){
        this.isEditDialogShow = false;
        this.fetchData();
      },
    	//编辑排班数据
      handleEdit:function(item){
      	this.selectedShiftId = item._id;
      	this.isEditDialogShow = true;
      },
    	//删除排班数据
      handleDelete:function(item){
      	let id = item._id;
        this.$msgbox.confirm('是否删除该排班数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          //在此进行删除操作,注意去抖操作必须
          beforeClose: _.debounce((action, instance, done) => {
            // 确认按钮按下
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '删除中...';
              //根据数据库的主键找到对应的回复进行删除
              this.axios.post(api.deleteShiftData,{id}).then((resp)=>{
                let status = resp.data.status;
                if(status === 1){
                  this.$message({
                    type:'success',
                    message:'排班数据删除成功!'
                  });
                }else{
                  this.$message({
                    type:'error',
                    message:'排班数据不存在!'
                  })
                }
                this.fetchData();
                instance.confirmButtonLoading = false;
                done();
              });
            } else {
              done();
            }
          },400,{leading:true,trailing:false})
        }).then(()=>{}).catch(()=>{})
      },
			//日期选择器改变
      handleDatePickerChange:function(value){
      	if(value === null)return
        this.date = value;
        this.fetchData();
      },
      //拉取数据(排班数据和公告数据)
      fetchData:function(){
      	this.isLoading = true;
      	this.isFirstLoaded = false;
        this.axios.post(api.fetchShiftDataHistory,{date:this.date}).then((resp)=>{
        	if(resp.data.status === 1){
        		//更新公告数据
            this.announcementUp = resp.data.announce.up;
            this.announcementDown = resp.data.announce.down;
            //更新排班数据
            this.shiftList = resp.data.shift;
          }else{
            this.$message({
              type:'error',
              message:'数据读取错误!'
            });
          }
          this.isLoading = false;
        })
      }
    }
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
  .history-wrapper{
    background-color: #fff;
    box-sizing: border-box;
    .title{
      height:56px;
      line-height: 56px;
      padding:0 32px;
      border-bottom: 1px solid #e8e8e8;
      color:rgba(0,0,0,0.85);
      font-size: 16px;
      .date-picker{
        display: inline-block;
        float:right;
      }
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
      .empty-tips{
        height:400px;
        display: flex;
        align-items: center;
        justify-content: center;
        color:#cbcbcb;
      }
      .shift-content-wrapper{
        margin: 0 auto;
        width:600px;
        .icon_pos{
          position: relative;
          top:1px;
        }
        .shift-content{
          margin-bottom: 20px;
          .card-content{
            position: relative;
            color:rgba(0, 0, 0, 0.65);
            @size:25px;
            .edit-btn{
              position: absolute;
              right:0;
              top:0;
              color:#cbcbcb;
              cursor: pointer;
              .icon_no-outline{
                outline: none;
              }
            }
            .card-index{
              height:@size;
              min-width: @size;
              background-color: #409EFF;
              border-radius: @size;
              text-align: center;
              line-height: @size;
              color:#fff;
              position: absolute;
              right:0;
              top:0;
            }
          }
          .item-wrapper{
            display: flex;
            flex-direction: row;
            padding:10px;
            word-break: break-all;
            flex-wrap: wrap;
            .work-content{
              white-space: pre-wrap;
            }
            .item-title{
              width:100px;
              padding-right:20px;
              box-sizing: border-box;
            }
            .item-content{
              word-break: break-all;
              flex:1;
              display: flex;
              align-items: center;
              /*换行*/
              flex-wrap: wrap;
              .staff-tag{
                margin: 0 15px 15px 0;
                position: relative;
                .staff-type{
                  position: absolute;
                  right:-10px;
                  top:-10px;
                  width:20px;
                  height:20px;
                  line-height: 20px;
                  text-align: center;
                  color:#fff;
                  border-radius: 50%;
                }
                .staff-regular{
                  background-color: #dd5b57;
                }
                .staff-temp{
                  background-color: #cbcbcb;
                }
              }
            }
          }
        }
        .card{
          margin-bottom: 20px;
        }
      }
    }
  }
</style>
<style type="text/less" lang="less">
  //对话框自定义类名
  .history-wrapper {
    .tag-edit-dialog {
      width: 600px;
      position: relative;
      /*这里不居中是因为如果内容太长会导致对话框显示不完整，因此给定对话框一个距离顶部的距离*/
      /*top: 50%;*/
      /*transform: translateY(-50%);*/
      .el-dialog__header {
        border-bottom: 1px solid #e8e8e8;
        padding-bottom: 10px;
        padding-top: 10px;
        .el-dialog__title {
          font-size: 16px;
        }
        .el-dialog__headerbtn {
          top: 15px;
        }
      }
      .user-edit-dialog-form-wrapper {
        width: 70%;
        margin: 0 auto;
      }
      .el-dialog__footer {
        border-top: 1px solid #e8e8e8;
        padding-bottom: 10px;
      }
    }
  }
</style>
