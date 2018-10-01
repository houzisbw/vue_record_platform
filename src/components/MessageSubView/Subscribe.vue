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
    <!--新鲜事组件-->
    <message v-for="(item,index) in messageList"
             :key="item.messageId"
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
    components:{
      Message,
      MessageSkeletonLoading
    },
    methods:{
			//请求新鲜事数据
      fetchMessages:function(){
        //请求数据，路由切换时会销毁和重建该组件
        this.isLoading = true;
        this.axios.post(api.getSubscribeMessage,{}).then((resp)=>{
          this.isLoading = false;
          if(resp.data.status === 1){
            this.messageList = resp.data.messageList;
            //更新用户点赞的新鲜事列表
            this.$store.commit('updateLikedMessageList',resp.data.likedList)
          }else{
            this.$message({
              type:'error',
              message:'新鲜事获取失败~'
            })
          }
        })
      }
    },
    mounted:function(){
			this.fetchMessages();
      //处理兄弟组件来的事件:更新新鲜事
      eventBus.$on(eventName.updateMessageList,()=>{
      	this.fetchMessages();
      })
    },
		data () {
			return {
        //新鲜事列表
        messageList:[],
        //是否正在loading
        isLoading:false
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
