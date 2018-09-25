<!--表情选择组件-->
<template>
  <div class="wrapper">
    <div class="emoji-content-wrapper">
      <li v-for="(item,index) in currentPageEmotionList">
        <i class="em em-ab"></i>
      </li>
    </div>
    <div class="pagination">
      <div class="pagination-inner">
        <div v-for="(item,index) in pageNum"
             @click="changePage(index)"
             :class="{'active-btn':index === activeIndex}"
             class="page-btn">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
	export default {
		name: 'EmotionSelect',
    mounted:function(){
			//注意表情不能一次全部请求，得分页请求


			this.emotionList = Array(55).fill(0);
			this.pageNum = Math.ceil(this.emotionList.length/this.pageCapacity);
			let startIndex = this.activeIndex*this.pageCapacity,
          endIndex = startIndex+this.pageCapacity;
			this.currentPageEmotionList = this.emotionList.slice(startIndex,endIndex);
    },
		data () {
			return {
				//总表情列表
        emotionList:[],
        //当前页表情列表
        currentPageEmotionList:[],
        //每页容量
        pageCapacity:54,
        //总页数
        pageNum:1,
        //当前激活页的index
        activeIndex:0
			}
		},
    methods:{
    	//改变页码
      changePage:function(index){
      	this.activeIndex = index;
        let startIndex = index*this.pageCapacity,
            endIndex = startIndex+this.pageCapacity;
        this.currentPageEmotionList = this.emotionList.slice(startIndex,endIndex);
      }
    }
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
  .wrapper{
    width:100%;
    max-width: 100%;
    .emoji-content-wrapper{
      display: flex;
      flex-wrap: wrap;
      width:100%;
      max-width: 100%;
      justify-content: flex-start;
      li{
        padding:5px;
        list-style: none;
        cursor: pointer;
        &:hover{
          transform: scale(1.1);
        }
      }
    }
    .pagination{
      @pagerSize:8px;
      margin-top: 10px;
      position: relative;
      .pagination-inner{
        position: absolute;
        left:50%;
        transform: translateX(-50%);
        display: flex;
        .page-btn{
          width:@pagerSize;
          height:@pagerSize;
          border-radius: 50%;
          background-color: #f0f0f0;
          margin: 0 6px;
          cursor:pointer;
        }
        .active-btn{
          background-color: #b4b4b4!important;
        }
      }
    }
  }
</style>
