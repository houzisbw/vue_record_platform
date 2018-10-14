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
        <span>请选择日期查看排班情况~</span>
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
            <!--序号-->
            <div class="card-index">
              {{index+1}}
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
              <div class="item-content">
                {{item.workContent?item.workContent:'无'}}
              </div>
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
      </div>
    </div>
  </div>
</template>

<script>
  import api from '@/api/api'
	export default {
		name: '',
		data () {
			return {
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
    computed:{
      //是否展示数据
      isEmpty:function(){
      	return this.shiftList.length===0
      }
    },
    methods:{
			//日期选择器改变
      handleDatePickerChange:function(value){
      	if(value === null)return
        this.date = value;
        this.fetchData();
      },
      //拉取数据(排班数据和公告数据)
      fetchData:function(){
      	this.isLoading = true;
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
            @size:25px;
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
            .item-title{
              width:100px;
              padding-right:20px;
              box-sizing: border-box;
            }
            .item-content{
              flex:1;
              display: flex;
              align-items: center;
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
