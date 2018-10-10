<!--新鲜事动态模块-->
<template>
  <div class="wrapper">
    <!--新鲜事为空的提示信息-->
    <div class="message-empty" v-if="messageList.length===0 && !isLoading">
      <span class="empty-text">暂时没有新鲜事~快去发布吧!</span>
    </div>
    <!--loading的图就是2个骨架图-->
    <message-skeleton-loading v-if="isLoading">
    </message-skeleton-loading>
    <!--新鲜事组件,sync修饰符用于子组件动态修改prop的值-->
    <message v-for="(item,index) in messageList"
             :key="item.messageId"
             :comment-num.sync="item.commentNumber"
             :message-info="item">
    </message>
  </div>
</template>

<script>
  import eventBus from '@/eventBus/eventBus'
  import eventName from '@/eventBus/eventName'
  import api from '@/api/api'
  import Message from '@/components/Message.vue'
  import MessageSkeletonLoading from '@/components/Loading/MessageSkeletonLoading.vue'
	export default {
		name: 'Subscribe',
    props:{
			//新鲜事排序方式,time按时间排，like按赞数排
      sortBy:{
      	type:String,
        default:'time'
      }
    },
    components:{
      Message,
      MessageSkeletonLoading
    },
    methods:{
			//滚动请求更多新鲜事
      scrollToFetchMoreMessages: function(){
      	//如果在加载中，则返回
        if(this.isLoading)return
        let scrollHeight = document.body.scrollHeight;
        let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        let windowHeight = document.body.clientHeight || document.documentElement.clientHeight;
        let distance = this.loadDistance;
        //滚动到距离页面底部distance的距离处开始加载
        if(scrollTop + windowHeight + distance >= scrollHeight){
        	//如果在loading状态或者没有更多新鲜事了则不继续处理
        	if(this.isLoading || !this.hasMoreMessage)return;
          //页数+1
          this.currentPage = this.currentPage+1;
          this.fetchMessages();
        }
      },
			//请求新鲜事数据
      fetchMessages:function(){
      	if(this.isLoading)return
      	//进入加载状态
        this.isLoading = true;
        //首次加载新鲜事才显示骨架屏
        if(this.isFirstLoading){
        	this.isShowSkeleton = true;
        }
        let data = {
        	currentPage:this.currentPage,
          pageSize:this.maxNumOfMessageLoad,
          //按时间先后排序
          sortBy:this.sortBy
        };
        this.axios.post(api.getSubscribeMessage,{data:data}).then((resp)=>{
          this.isLoading = false;
          this.isShowSkeleton = false;
          if(resp.data.status === 1){
          	//合并处理
            let messageList = resp.data.messageList;
            resp.data.userInfoList.forEach((item,index)=>{
              Object.assign(messageList[index],item);
            });
            this.messageList = this.messageList.concat(messageList);
            this.hasMoreMessage = resp.data.hasMore;
            //更新用户点赞的新鲜事列表
            this.$store.commit('updateLikedMessageList',resp.data.likedList)
          }else{
            this.$message({
              type:'error',
              message:'新鲜事获取失败~'
            })
          }
          this.isFirstLoading = false;
        })
      },
      // 获取用户赞过的回复和评论列表
      fetchUserLikedList: function(){
        this.$store.dispatch('updateLikedReplyList');
        this.$store.dispatch('updateLikedCommentList');
      }
    },
    beforeDestroy: function(){
      window.removeEventListener('scroll',this.scrollToFetchMoreMessages);
    },
    mounted:function(){
			//给window注册scroll事件
      window.addEventListener('scroll',this.scrollToFetchMoreMessages);
			this.fetchMessages();
			// 更新用户点赞的回复列表
			this.fetchUserLikedList();
      //处理兄弟组件来的事件:更新新鲜事
      eventBus.$on(eventName.updateMessageList,()=>{
      	//重置页数为1
        this.currentPage = 1;
        //重置新鲜事数组为空(重要)
        this.messageList= [];
      	this.isFirstLoading = true;
      	this.fetchMessages();
      });
      //监听子组件的重新拉取新鲜事的事件
      eventBus.$on(eventName.reFetchMessages,()=>{
        this.currentPage = 1;
        this.messageList= [];
        this.isFirstLoading = true;
        this.fetchMessages();
      })
    },
		data () {
			return {
        //新鲜事列表
        messageList:[],
        //是否显示骨架屏
        isShowSkeleton:false,
        //是否正在loading
        isLoading:false,
        //是否是首次记载
        isFirstLoading:true,
        //一次最多加载的新鲜事条数
        maxNumOfMessageLoad:10,
        //加载距离(px,滚动窗口时，如果文档底部的距离距离屏幕底部的距离小于该值则进行加载)
        loadDistance:200,
        //当前页数
        currentPage:1,
        //是否正在加载更多数据
        isFetchingMoreMessage:false,
        //是否还有更多新鲜事
        hasMoreMessage:true
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
.wrapper{
  .message-empty{
    height:100px;
    padding: 20px;
    box-sizing: border-box;
    box-shadow:0 1px 2px 0 rgba(0, 0, 0, 0.05);
    background-color: #fff;
    margin-bottom: 20px;
    text-align: center;
    line-height: 60px;
    .empty-text{
      color:#cbcbcb;
      font-size: 14px;
    }
  }
}
</style>
