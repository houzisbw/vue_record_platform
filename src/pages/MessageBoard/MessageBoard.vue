<!--留言板页面，类似于掘金的沸点-->
<template>
  <div class="wrapper">
    <!--编辑留言的版块-->
    <message-board-edit-box
      editBoxMinHeight="75px"
      placeholder="发布新鲜事~"
      input-id="messageImageInput"
      :maxImageNum="9">
    </message-board-edit-box>
    <!--推荐和动态tab栏-->
    <div class="tab">
      <router-link to="/message/recommend"
                   tag="div"
                   class="tab-sub"
                   active-class="tab-active">
        <span>推荐</span>
      </router-link>
      <router-link to="/message/subscribe"
                   tag="div"
                   class="tab-sub"
                   active-class="tab-active">
        <span>动态</span>
      </router-link>

    </div>
    <!--tab栏的router-view-->
    <div class="router-view-wrapper">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import MessageBoardEditBox from '@/components/MessageBoardEditBox.vue'
	export default {
		name: 'MessageBoard',
    components:{
      MessageBoardEditBox
    },
    computed:{},
    methods:{

    },
		data () {
			return {

			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
.wrapper{
  width:640px;
  margin:0 auto;
  .tab{
    margin:8px 0;
    display: flex;
    justify-content: center;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    .tab-sub{
      width:25%;
      display: flex;
      justify-content: center;
      align-items: center;
      line-height: 2.5em;
      color:#909090;
      font-size: 15px;
      cursor: pointer;
    }
    .tab-active{
      color:#007fff;
      span{
        position: relative;
      }
    }
    .tab-active span:after{
      position: absolute;
      width:100%;
      height:3px;
      background-color: #007fff;
      bottom:0;
      left:0;
      content:'';
    }
  }
  .router-view-wrapper{
    width:100%;
  }
}
</style>

