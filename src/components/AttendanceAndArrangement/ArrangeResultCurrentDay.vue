<!--当日排班情况-->
<template>
  <div class="wrapper" v-loading="isLoading">
    <!--正式员工的排班情况(早中晚深的顺序)-->
    <div class="panel-wrapper">
      <div class="title">
        <span class="title-text">正式员工排班情况</span>
        <el-radio-group v-model="currentTypeRegular"
                        @change="handleRegularChange"
                        size="mini">
          <el-radio-button label="全部"></el-radio-button>
          <el-radio-button :label="item"
                           :key="index"
                           v-for="(item,index) in shiftList">
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="content">
        <div v-if="filterdRegularStaffList.length>0">
          <el-tag class="staff-tag"
                  :key="index"
                  v-for="(item,index) in filterdRegularStaffList">
            {{item.name}}
            <span class="type"
                  v-if="item.type !== 'none'"
                  :style="{backgroundColor:colorObj[item.type]}">
              {{item.type}}
            </span>
          </el-tag>
        </div>
        <div v-else class="no-data">
          无数据
        </div>
      </div>
    </div>
    <!--临时员工的排班情况(早中晚深的顺序)-->
    <div class="panel-wrapper">
      <div class="title">
        <span class="title-text">临时员工排班情况</span>
        <el-radio-group
          v-model="currentTypeTemp"
          @change="handleTempChange"
          size="mini">
          <el-radio-button label="全部"></el-radio-button>
          <el-radio-button :label="item"
                           :key="index"
                           v-for="(item,index) in shiftList">
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="content">
        <div v-if="filterdTempStaffList.length>0">
          <el-tag class="staff-tag"
                  :key="index"
                  v-for="(item,index) in filterdTempStaffList">
            {{item.name}}
            <span class="type"
                  v-if="item.type !== 'none'"
                  :style="{backgroundColor:colorObj[item.type]}">
              {{item.type}}
            </span>
          </el-tag>
        </div>
        <div v-else class="no-data">
          无数据
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '@/api/api'
	export default {
		name: '',
    props:{
			date:{
				type:String,
        required:true
      }
    },
		data () {
			return {
				//是否在加载
        isLoading:false,
				//正式员工当前type
        currentTypeRegular:'全部',
        //临时员工当前type
        currentTypeTemp:'全部',
				//颜色对象
        colorObj:{
        	'早':'#67c23a',
          '中':'#f56c6c',
          '晚':'#e6a23c',
          '深':'#909399',
        },
        //正式员工列表
        regularStaffList:[],
        //正式员工过滤后的列表
        filterdRegularStaffList:[],
        //临时员工列表
        tempStaffList:[],
        //临时员工过滤后的列表
        filterdTempStaffList:[],
        //班次列表
        shiftList:[]
			}
		},
    mounted:function(){
      this.fetchShiftData();
    },
    methods:{
    	//正式员工单选按钮改变
      handleRegularChange: function(value){
      	if(value==='全部'){
          this.filterdRegularStaffList = this.regularStaffList;
        }else{
          this.filterdRegularStaffList = this.regularStaffList.filter((item)=>{
            return item.type === value
          })
        }
      },
      //临时员工单选按钮改变
      handleTempChange: function(value){
        if(value==='全部'){
          this.filterdTempStaffList = this.tempStaffList;
        }else{
          this.filterdTempStaffList = this.tempStaffList.filter((item)=>{
            return item.type === value
          })
        }
      },
			//获取当天排班的数据以及班次数据
      fetchShiftData:function(){
        this.isLoading = true;
        this.axios.post(api.fetchShiftDataCurrentDay,{date:this.date}).then((resp)=>{
        	if(resp.data.status === 1){
            this.shiftList = resp.data.shift;
            this.tempStaffList = resp.data.tempList;
            this.filterdTempStaffList = resp.data.tempList;
            this.filterdRegularStaffList = resp.data.regularList;
            this.regularStaffList = resp.data.regularList;
          }else{

          }
          this.isLoading = false;
        })
      }
    }
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
.wrapper{
  .panel-wrapper{
    margin-bottom: 30px;
    .title{
      font-size: 14px;
      color:#606266;
      margin-bottom: 20px;
      .title-text{
        margin-right: 10px;
      }
    }
    .content{
      .no-data{
        color: #dddddd;
      }
      .staff-tag{
        margin: 0 15px 15px 0;
        position: relative;
        @size:20px;
        .type{
          position: absolute;
          right:-@size/2;
          top:-@size/2;
          width:20px;
          height:20px;
          border-radius: 50%;
          background-color: #d9d9d9;
          line-height: @size;
          text-align: center;
          color:#fff;
        }
      }
    }
  }
}
</style>
