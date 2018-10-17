<!--统计图表页面-->
<template>
  <div>
    <!--当月图表-->
    <div class="graph-wrapper">
      <!--图表标题-->
      <div class="title">
        <div class="title-text">
          {{barGraphTitle}}
          <span>(共{{barTotal}}条)</span>
        </div>
        <div class="btn-wrapper" >
          <el-select v-model="yearValue"
                     size="mini"
                     :disabled="graphLoading"
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
                     :disabled="graphLoading"
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
      <div class="graph-content" v-loading="graphLoading">
        <div class="graph-body" id="recordGraphBody" v-show="!isBarGraphEmpty">
        </div>
        <div class="graph-body graph-body-empty"  v-show="isBarGraphEmpty">
          <i class="iconfont icon-frown" style="margin-right: 10px;font-size: 18px;"></i>
          <span>数据空空如也</span>
        </div>
      </div>
    </div>
    <!--历史图表-->
    <div class="graph-wrapper">
      <!--图表标题-->
      <div class="title">
        <div class="title-text">
          个人/本组平均 近一年每月历史错误记录数量对比折线图
        </div>
      </div>
      <!--图表区域-->
      <div class="graph-content" >
        <div class="graph-body" id="historyGraphBody" >
        </div>
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
      //画柱状图
      this.drawBarGraph(this.barGraphData,'recordGraphBody','name','value','#1890ff',true);
      //画折线图
      this.drawLineGraph();
    },
    computed:{
    	//柱状图标题
      barGraphTitle:function(){
      	return this.yearValue+'年'+parseInt(this.monthValue,10)+'月'+this.typeList[this.activeIndex].label+
               '错误记录统计柱状图'
      },
      //柱状图数据是否为空
      isBarGraphEmpty:function(){
      	return this.barGraphData.length===0
      }
    },
    watch:{
      monthValue: function(){
      	this.update();
      },
      yearValue:function(){
        this.update();
      },
      activeIndex:function(){
        this.update();
      },
      barGraphData:function(newVal){
      	// 在切换显隐后,必须调用如下2句才能使图形重新画出
        this.chart.forceFit();
      	this.chart.repaint();
      }
    },
    methods:{
    	//更新
      update:function(){
      	if(this.graphLoading)return
        this.graphLoading = true;
        let promise = this.fetchRecordData();
        promise.then(()=>{
          this.updateBarGraph(this.barGraphData);
          this.graphLoading = false;
        });
      },
    	//更新柱状图
      updateBarGraph: function(dataList){
        // 计算总数
        let total = this.barGraphData.reduce((t,c)=>{return t+parseInt(c.value,10)},0);
        this.barTotal = total;
        this.chart.changeData(dataList);
        this.chart.forceFit();
        this.chart.repaint();
      },
      //画折线图
      drawLineGraph:function(){
        this.lineChart = new G2.Chart({
          container: 'historyGraphBody', // 指定图表容器 ID
          height : 400, // 指定图表高度
          forceFit: true, //自适应容器宽度,
        });
        // 载入数据源
        this.lineChart.source(this.lineGraphData,{
        	'month':{
        		alias:'年月'
          },
          'num':{
        		alias:'错误记录数量'
          },
        });
        this.lineChart.tooltip({
          crosshairs: {
            type: 'line'
          }
        });
        this.lineChart.line().position('month*num').color('type').tooltip('num');
        this.lineChart.point().position('month*num').color('type').size(4).shape('circle').style({
          stroke: '#fff',
          lineWidth: 1
        }).tooltip('num');;
        this.lineChart.legend({
          // 格式化图例为中文
          itemFormatter:(item)=>{
          	return this.lineGraphLegendMap[item]
          }
        });
        this.lineChart.render();
      },
    	//画柱状图
      drawBarGraph:function(dataList,domId,xAttr,yAttr,color,isHorizontal){
        //初始化图表
        this.chart = new G2.Chart({
          container: domId, // 指定图表容器 ID
          height : 600, // 指定图表高度
          forceFit: true, //自适应容器宽度,
          padding: [ 0, 60, 80, 120 ],
        });
        // 载入数据源
        this.chart.source(dataList);
        // 计算总数
        let total = dataList.reduce((t,c)=>{return t+parseInt(c.value,10)},0);
        this.barTotal = total;
        // 创建图形语法，绘制柱状图
        let pos = xAttr+'*'+yAttr;
        this.chart.interval().position(pos).color(color).label('value', {
        	offset:5,
          textStyle: {
            textAlign: 'start',
          },
          formatter: (text, item, index) => {
            return (text/this.barTotal*100).toFixed(1)+'%';
          }
        });
        this.chart.axis(xAttr, {
          label:{
            offset:10,
            textStyle:{
              textAlign:'end',
            }
          }
        });
        //坐标轴别名
        this.chart.scale(yAttr,{
          alias:'错误记录数量'
        });
        this.chart.axis(yAttr, {
          title:{}
        });
        // 隐藏图例
        this.chart.legend(false);
        // 变为横向柱状图
        if(isHorizontal) this.chart.coord().transpose();
        // 渲染图表
        this.chart.render();
      },
    	//初始化数据
      initData:function(){
      	let date = new Date();
      	this.yearValue = date.getFullYear().toString();
        let month = date.getMonth()+1;
        this.monthValue = month<10?('0'+month):month.toString();
        //请求柱状图数据
        this.fetchRecordData();
        //请求折线图数据
        this.fetchLineGraphData();
      },
      //请求折线图数据
      fetchLineGraphData: function(){
      	this.axios.get(api.getLatestYearRecord).then((resp)=>{
      		if(resp.data.status === 1){
            this.lineGraphData = resp.data.data;
            this.lineChart.changeData(this.lineGraphData);
          }
        })
      },
      //请求记录数据
      fetchRecordData: function(){
      	return new Promise((resolve,reject)=>{
          let data = {
            year:this.yearValue,
            month:this.monthValue,
            type:this.typeList[this.activeIndex].value
          };
          this.axios.post(api.searchGraphRecord,{data:data}).then((resp)=>{
            if(resp.data.status === 1){
              let dataObj = resp.data.dataObj;
              let list = [];
              Object.keys(dataObj).forEach((item)=>{
                list.push({
                  name:item,
                  value:dataObj[item]
                })
              });
              list.sort((a,b)=>{return a.value - b.value});
              this.barGraphData = list;
              resolve()
            }else{
            	reject()
            }
          })
        });
      },
			//切换type的tab
      changeActiveIndex: function(index){
      	if(this.graphLoading)return
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
				/* 折线图数据 */
				lineChart:null,
        lineGraphData:[],
        lineGraphLegendMap:{
					'AVG':'本组平均错误数量',
          'PERSONAL':'个人错误数量'
        },
				/* 柱状图数据 */
        barTotal:0,
        barGraphData:[],
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
        graphLoading:false,


        /* 折线图数据 */
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
@titleHeight:55px;
.graph-wrapper{
  background-color: #fff;
  margin-bottom: 30px;
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
      height:30px;
      line-height: 30px;
      color:rgba(0,0,0,0.65);
    }
    .graph-body{
      margin-top: 20px;
      min-height:400px;
    }
    .graph-body-empty{
      display: flex;
      justify-content: center;
      align-items: center;
      color:rgba(0,0,0,0.35);
      font-size: 18px;
    }
  }

}
</style>
<style type="text/less" lang="less">
  .graph-wrapper .btn-wrapper .el-select .el-input{
    width:130px!important;
  }
</style>
