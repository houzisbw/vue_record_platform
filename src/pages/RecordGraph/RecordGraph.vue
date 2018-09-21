<!--统计图表页面-->
<template>
  <div class="graph-wrapper">
    <div class="title">
      <div class="title-text">
        错误记录统计图
      </div>
      <div class="btn-wrapper" v-loading="graphLoading">
        <el-select v-model="yearValue"
                   size="mini"
                   placeholder="请选择年份">
          <el-option
            v-for="item in yearList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="monthValue"
                   size="mini"
                   class="margin-left"
                   placeholder="请选择月份">
          <el-option
            v-for="item in monthList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div class="type-wrapper" v-for="(item,index) in typeList">
          <span class="type-text"
                @click="changeActiveIndex(index)"
                :class="{'type-active':index === activeIndex}">
            {{item.label}}
          </span>
        </div>
      </div>
    </div>
    <!--图表区域-->
    <div class="graph-content">
      <div class="graph-title">
      </div>
      <div class="graph-body" id="recordGraphBody">
      </div>
    </div>
  </div>
</template>

<script>
  import api from '@/api/api'
  import G2 from '@antv/g2'
	export default {
		name: 'RecordGraph',
    mounted:function(){
			this.getYearList();
			this.initData();
    },
    methods:{
    	//初始化数据
      initData:function(){
      	let date = new Date();
      	this.yearValue = date.getFullYear().toString();

        let month = date.getMonth()+1;
        //this.monthValue = month<10?('0'+month):month.toString();
        this.monthValue = '02'
        //初始化图表
        // Step 1: 创建 Chart 对象
        this.chart = new G2.Chart({
          container: 'recordGraphBody', // 指定图表容器 ID
          height : 300, // 指定图表高度
          forceFit: true, //自适应容器宽度
        });
        // Step 2: 载入数据源
        this.chart.source(this.graphData);
        // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
        this.chart.interval().position('genre*sold').color('genre');
        // Step 4: 渲染图表
        this.chart.render();


        //请求数据
        this.fetchRecordData();
      },
      //请求记录数据
      fetchRecordData: function(){
      	let data = {
      		year:this.yearValue,
          month:this.monthValue,
          type:this.typeList[this.activeIndex].value
        };
      	this.axios.post(api.searchGraphRecord,{data:data}).then((resp)=>{
      		if(resp.data.status === 1){
            console.log(resp.data.dataObj)
          }
        })

      },
			//切换type的tab
      changeActiveIndex: function(index){
      	this.activeIndex = index;
      },
      //构建下拉列表数据
      genDropdownData: function(data){
      	let minYear = data.minYear,
            maxYear = data.maxYear;
      	let yearList = [];
      	for(let i=minYear;i<=maxYear;i++){
          yearList.push({
            label:i,
            value:i
          })
        }
        this.yearList = yearList;

        let monthList = [];
        for(let i=1;i<=12;i++){
        	let t = i<10?('0'+i):(i+'');
          monthList.push({
            label:t,
            value:t
          })
        }
        this.monthList = monthList;

      },
      //获取年份数组
      getYearList: function(){
      	this.axios.get(api.getGraphYearList).then((resp)=>{
      		if(resp.data.status === 1){
      			//构建下拉列表数据
            this.genDropdownData(resp.data)
          }
        })
      }
    },
		data () {
			return {
				//测试数据
        graphData:[
          { genre: 'Sports', sold: 275 },
          { genre: 'Strategy', sold: 115 },
          { genre: 'Action', sold: 120 },
          { genre: 'Shooter', sold: 350 },
          { genre: 'Other', sold: 150 }
        ],
        chart:null,

        yearList:[],
        yearValue:'',

        monthList:[],
        monthValue:'',

        //图表类别:个人 还是 本组
        typeList:[
          {
          	value:'PERSONAL',
            label:'个人'
          },
          {
          	value:'GROUP',
            label:'本组'
          }
        ],
        activeIndex:1,
        //是否在loading过程
        graphLoading:false
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
@titleHeight:55px;
.graph-wrapper{
  background-color: #fff;
  .title{
    height:@titleHeight;
    border-bottom:1px solid #e8e8e8;
    box-sizing: border-box;
    padding:0 20px;
    .btn-wrapper{
      height:@titleHeight;
      display: flex;
      align-items: center;
      float:right;
      .margin-left{
        margin-left: 15px;
      }
      .type-wrapper{
        margin-left:15px;
        font-size: 14px;
        height:100%;
        line-height:@titleHeight;
        color:rgba(0,0,0,0.65);
        @activeColor:#1890ff;
        .type-text{
          cursor: pointer;
          transition: all .5s;
          &:hover{
            color:@activeColor;
          }
        }
        .type-active{
          color:@activeColor;
        }
      }
    }
    .title-text{
      height:@titleHeight;
      line-height:@titleHeight;
      float:left;
      color:rgba(0,0,0,0.65);
    }
  }
  .graph-content{
    padding:20px;
    .graph-title{
      height:50px;
    }
    .graph-body{
      margin-top: 20px;
      min-height:400px;
    }
  }

}
</style>
<style type="text/less" lang="less">
  .graph-wrapper .btn-wrapper .el-select .el-input{
    width:130px!important;
  }
</style>
