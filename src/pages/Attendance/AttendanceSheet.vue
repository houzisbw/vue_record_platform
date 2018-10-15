<!--考勤表页面(默认显示正式组的员工)-->
<template>
  <div class="attendance-wrapper">
    <div class="title">
      <i class="iconfont icon-table title-icon"></i>
      <span class="title-text">考勤表</span>
      <div class="date-picker">
        <el-date-picker
          v-model="calendarDate"
          @change="handleDatePickerChange"
          format="yyyy-MM"
          value-format="yyyy-MM"
          type="month"
          size="mini"
          placeholder="选择月份">
        </el-date-picker>
      </div>
    </div>
    <div class="content" v-loading="isLoading">
      <!--这里用if重新渲染防止出现表格数据逻辑错误-->
      <div class="table-wrapper" v-if="!isLoading">
        <div>
          <table class="sheet-table" ref="table">
            <!--下载excel的按钮-->
            <div class="btn-wrapper" v-auth="['2','1']">
              <el-button size="small"
                         @click="downloadExcel"
                         type="primary">
                下载Excel
              </el-button>
            </div>
            <!--表头()-->
            <tr class="table-head">
              <th rowspan="2">
                姓名
              </th>
              <th v-for="n in currentMonthDayNum" :class="{'weekend-day':isWeekend(n)}">
                {{n}}
                <span class="weekend-badge" v-if="isWeekend(n)">休</span>
              </th>
            </tr>
            <tr class="table-head">
              <th v-for="n in currentMonthDayNum" :class="{'weekend-day':isWeekend(n)}" class="weekday">
                {{caculateWeekDay(n)}}
              </th>
            </tr>
            <!--表格主体-->
            <tr>
              <!--colspan给定一个大值，则占满所有列-->
              <td colspan="1000" class="staff-td">
                正式员工
              </td>
            </tr>
            <tr v-for="(item,index) in regularStaffList">
              <td class="name-td">
                {{item}}
              </td>
              <td v-for="n in currentMonthDayNum"
                  :class="{'weekend-day':isWeekend(n)}">
                  <span v-if="showPopover(item,n,1)">
                    <el-popover
                      placement="top-start"
                      trigger="hover">
                      <!--弹出框内的内容-->
                      <el-tag v-for="(it,idx) in getMultipleShiftData(item,n,1)"
                              :style="{marginRight:'10px'}"
                              :key="idx">
                        {{it}}
                      </el-tag>
                      <!--触发弹出框的元素-->
                      <span :style="{color:getSheetFontColor(item,n,1)}"
                            slot="reference">
                        {{showSheetData(item,n,1)}}
                      </span>
                    </el-popover>
                  </span>
                  <span v-else>
                    <span :style="{color:getSheetFontColor(item,n,1)}">
                        {{showSheetData(item,n,1)}}
                    </span>
                  </span>
              </td>
            </tr>
            <tr>
              <!--colspan给定一个大值，则占满所有列-->
              <td colspan="1000" class="staff-td">
                临时员工
              </td>
            </tr>
            <tr v-for="(item,index) in tempStaffList">
              <td class="name-td">
                {{item}}
              </td>
              <td v-for="n in currentMonthDayNum" :class="{'weekend-day':isWeekend(n)}">
                <span :style="{color:getSheetFontColor(item,n,2)}">{{showSheetData(item,n,2)}}</span>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import xlsx from 'xlsx'
  import _ from 'lodash'
  import api from '@/api/api'
	export default {
		name: '',
		data () {
			return {
				//是否在加载中
        isLoading:false,
				//日历组件的日期
        calendarDate:'',
        //正式员工列表
        regularStaffList:[],
        //临时员工列表
        tempStaffList:[],
        //每月天数
        currentMonthDayNum:0,
        //每月周末的day的序号
        weekendsList:[],
        //对应周几的map
        weekMap:{
        	1:'一',
          2:'二',
          3:'三',
          4:'四',
          5:'五',
          6:'六',
          0:'日'
        },
        //正式员工的map(记录其考勤情况,key是员工名，value是一个对象(key为日期，value是数组(存储考勤)))
        regularStaffMap:{},
        //临时员工map
        tempStaffMap:[],
        //字体颜色map
        colorMap:{
        	'早':"#000!important",
          '中':'#000!important',
          '晚':'#000!important',
          '深':'#ff0000!important'
        }
			}
		},
    mounted:function(){
			//计算当前时间
      let date = new Date(),year = date.getFullYear(),month = date.getMonth();
      this.calendarDate = year+'-'+(month+1);
			this.getDateInfo(year,month);
    },

    methods:{
    	//下载excel
      downloadExcel: _.debounce(function(){
      	//生成工作簿
        let table = this.$refs.table;
      	let workbook = xlsx.utils.table_to_book(table);
        xlsx.writeFile(workbook,'考勤表-'+this.calendarDate+'.xlsx');
      },400,{leading:true,trailing:false}),
    	//处理弹出框内的排班信息显示
      getMultipleShiftData:function(staffName,day,type){
        if(day<10){
          day = '0'+day;
        }
        //计算是否是多种考勤班次
        if(type === 1){
          //正式员工
          return this.regularStaffMap[staffName][day];
        }else{
          //临时员工
          return this.tempStaffMap[staffName][day];
        }
      },
    	//处理鼠标移入,是否显示弹出框
      showPopover:function(staffName,day,type){
        if(day<10){
          day = '0'+day;
        }
        //计算是否是多种考勤班次
        if(type === 1){
          //正式员工
          let attendanceArray = this.regularStaffMap[staffName][day];
          if(attendanceArray.length>1){
            return true
          }
        }else{
          //临时员工
          let attendanceArray = this.tempStaffMap[staffName][day];
          if(attendanceArray.length>1){
            return true
          }
        }
        return false
      },
    	//计算考勤表中字体的颜色
      getSheetFontColor:function(staffName,day,type){
        if(day<10){
          day = '0'+day;
        }
        if(type === 1){
          //正式员工
          let attendanceArray = this.regularStaffMap[staffName][day];
          if(attendanceArray.length===1){
            return this.colorMap[attendanceArray[0]] || '#000';
          }else if(attendanceArray.length>1){
            return '#49ABFF!important'
          }
        }else{
          //临时员工
          let attendanceArray = this.tempStaffMap[staffName][day];
          if(attendanceArray.length===1){
            return this.colorMap[attendanceArray[0]] || '#000';
          }else if(attendanceArray.length>1){
            return '#49ABFF!important'
          }
        }
      },
    	//显示考勤表中具体的考勤信息
      showSheetData:function(staffName,day,type){
      	if(day<10){
      		day = '0'+day;
        }
        if(type === 1){
          //正式员工
          let attendanceArray = this.regularStaffMap[staffName][day];
          if(attendanceArray.length===1){
          	return attendanceArray[0]
          }else if(attendanceArray.length>1){
          	return "多"
          }else{
          	return ''
          }
        }else{
        	//临时员工
          let attendanceArray = this.tempStaffMap[staffName][day];
          if(attendanceArray.length===1){
            return attendanceArray[0]
          }else if(attendanceArray.length>1){
            return '多'
          }else{
            return ''
          }
        }
      },
    	//计算周几
      caculateWeekDay:function(dayIndex){
      	if(!this.calendarDate)return '无';
        let year = parseInt(this.calendarDate.split('-')[0],10),
            month = parseInt(this.calendarDate.split('-')[1],10);
        //这里month要减1，因为日历上的月份是+1了的
        let date = new Date(year,month-1,dayIndex);
        let day = date.getDay();
      	return this.weekMap[day]
      },
    	//是否是周末
      isWeekend:function(dayIndex){
      	return this.weekendsList.includes(dayIndex)
      },
      //初始化员工map对象
      initMapData:function(shiftData){
      	//初始化正式员工map
        this.regularStaffList.forEach((item)=>{
        	let dateObj = {};
        	for(let i=1;i<=this.currentMonthDayNum;i++){
            let j = i<10?('0'+i):i;
            dateObj[j]=[]
          }
          this.regularStaffMap[item] = dateObj
        });

        //初始化临时员工map
        this.tempStaffList.forEach((item)=>{
          let dateObj = {};
          for(let i=1;i<=this.currentMonthDayNum;i++){
          	let j = i<10?('0'+i):i;
            dateObj[j]=[]
          }
          this.tempStaffMap[item] = dateObj
        });
        //填充数据
        shiftData.forEach((item)=>{
        	let regularList = item.regularStaffList;
        	let tempList = item.tempStaffList;
        	let shift = item.shift;
        	let day = item.date.split('-')[2];
        	regularList.forEach((it1)=>{
        		//如果没有班次则添加班次
        		if(!this.regularStaffMap[it1][day].includes(shift)){
              this.regularStaffMap[it1][day].push(shift);
            }
          });
          tempList.forEach((it1)=>{
            //如果没有班次则添加班次
            if(!this.tempStaffMap[it1][day].includes(shift)){
              this.tempStaffMap[it1][day].push(shift);
            }
          })
        });
      },
    	//获取正式和临时员工列表以及当月的考勤数据
      fetchData:function(){
        this.isLoading = true;
        this.axios.post(api.fetchAttendanceSheetData,{date:this.calendarDate}).then((resp)=>{
        	if(resp.data.status === 1){
        		this.regularStaffMap = {};
        		this.tempStaffMap = {};
            this.regularStaffList = resp.data.regularStaffList;
            this.tempStaffList = resp.data.tempStaffList;
            this.initMapData(resp.data.currentMonthData);
          }else{
        		this.$message({
              type:'error',
              message:'数据读取失败~'
            })
          }
          this.isLoading = false;
        })
      },
      //月份选择器变化
      handleDatePickerChange:function(value){
      	this.calendarDate = value;
      	let year = value.split('-')[0],
            month = parseInt(value.split('-')[1],10);
      	//注意month要减1，因为日历的月份已经+1
        this.getDateInfo(year,month-1);
      },
      //获取日期信息,注意month是已经减一了的月份
      getDateInfo:function(year,month){
      	//获取当月天数(date设置成下个月第0天)
      	this.currentMonthDayNum = (new Date(year,month+1,0)).getDate();
      	//计算周末天数的序号
        let weekendList = [];
        for(let i=1;i<=this.currentMonthDayNum;i++){
        	let day = (new Date(year,month,i)).getDay();
        	if(day === 0 || day === 6){
            weekendList.push(i)
          }
        }
        this.weekendsList = weekendList;
        this.fetchData();
      }
    }
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
.attendance-wrapper{
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
    .table-wrapper{
      position: relative;
      .btn-wrapper{
        margin-bottom: 10px;
        display: flex;
        justify-content: flex-start;
        cursor: pointer;
      }
      .sheet-table{
        border-collapse: collapse;
        position: relative;
        left:50%;
        transform:translateX(-50%);
        @borderColor:#a2a2a2;
        th{
          border: 1px solid @borderColor;
          width:30px;
          height:40px;
          font-weight:bold;
          vertical-align: middle!important;
        }
        td{
          border: 1px solid @borderColor;
          height:30px;
          vertical-align: middle!important;
          text-align: center;
        }
        .table-head{
          th{
            background-color: #cce8ff;
          }
        }
        .name-td{
          width:70px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding:0 5px;
          text-align: center;
        }
        .staff-td{
          font-weight: bold;
          color: #505050;
          background-color: #fff;
        }
        .weekend-day{
          background-color: rgb(255, 234, 153) !important;
          color:red;
          position: relative;
          .weekend-badge{
            position: absolute;
            width:20px;
            height:20px;
            background-color: #ff3e3f;
            border-radius: 50%;
            top:-10px;
            right:-10px;
            font-weight: normal;
            line-height: 20px;
            z-index: 100;
            font-size: 12px;
            color:#fff;
          }
        }
        .weekday{
          font-size: 11px;
        }
      }
    }
  }
}
</style>
