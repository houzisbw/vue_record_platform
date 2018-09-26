<!--表情选择组件-->
<template>
  <div class="wrapper">
    <div class="emoji-content-wrapper">
      <button v-for="(item,index) in currentPageEmotionList"
              class="emotion-btn"
              @click="addEmotion(item)">
        <i :class="['em',item]"></i>
      </button>
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
  import api from '@/api/api'
	export default {
		name: 'EmotionSelect',
    mounted:function(){
      this.fetchEmotionNameList();
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
    	//向后台请求表情名称
      fetchEmotionNameList: function(){
        this.axios.get(api.fetchEmotionList).then((resp)=>{
        	if(resp.data.status === 1){
        		let total = resp.data.total,
                emotionList = resp.data.emotions;
            this.emotionList = emotionList;
            this.pageNum = Math.ceil(total/this.pageCapacity);
            let startIndex = this.activeIndex*this.pageCapacity,
              endIndex = startIndex+this.pageCapacity;
            this.currentPageEmotionList = this.emotionList.slice(startIndex,endIndex);
          }else{
            this.$message({
              type:'error',
              message:'表情加载失败!'
            })
          }
        })
      },
    	//改变页码
      changePage:function(index){
      	this.activeIndex = index;
        let startIndex = index*this.pageCapacity,
            endIndex = startIndex+this.pageCapacity;
        this.currentPageEmotionList = this.emotionList.slice(startIndex,endIndex);
      },
      //添加表情,发送给父组件
      addEmotion: function(emotionName){
      	this.$emit('choose',emotionName)
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
      .emotion-btn{
        padding:5px;
        outline:none;
        border:none;
        -webkit-appearance: none;
        -moz-appearance: none;
        cursor: pointer;
        background-color: #fff;
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
