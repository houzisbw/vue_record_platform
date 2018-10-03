<!--新鲜事一级评论组件-->
<template>
  <div class="primary-comment-wrapper">
    <!--头像-->
    <div class="avatar">
    </div>
    <!--内容部分-->
    <div class="content">
      <!--评论用户信息-->
      <div class="comment-user-info">
        <span class="username">超级索尼子</span>
        <span class="usergroup">准备组</span>
      </div>
      <!--评论文本内容-->
      <div class="comment-text">是的范德萨冯绍峰发的郭德纲地方官而dfdsfsdfddddddddddddddddddddddddd第三方但是但是</div>
      <!--评论图片部分-->
      <div class="comment-img"
           @click="showDetailImage"
           :style="{backgroundImage:'url('+'https://i.loli.net/2018/09/29/5baf48d28713b.jpg'+')'}">
      </div>
      <!--底部操作栏-->
      <div class="bottom-bar">
        <div class="left">
          <span>刚刚</span>
          <span class="dot delete">·</span>
          <span class="delete">删除</span>
        </div>
        <div class="right">
          <div class="like-action">
            <i class="iconfont icon-like"></i>
          </div>
          <div class="comment-action">
            <i class="iconfont icon-message"></i>
            <span style="margin-left: 5px;">回复</span>
          </div>
        </div>
      </div>
    </div>
    <!--全屏大图查看组件,动画过渡效果-->
    <transition name="fade">
      <comment-image-viewer @close="closeViewer"
                            v-if="isShowViewer">
      </comment-image-viewer>
    </transition>
  </div>
</template>

<script>
  import CommentImageViewer from '@/components/Comment/CommentImageViewer'
	export default {
		name: 'PrimaryComment',
    components:{
      CommentImageViewer
    },
		data () {
			return {
        isShowViewer:false
			}
		},
    methods:{
			// 显示大图
      showDetailImage:function(){
        this.isShowViewer = true;
      },
      // 关闭全屏查看组件
      closeViewer:function(){
      	this.isShowViewer = false;
      }
    }
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
.primary-comment-wrapper{
  display: flex;
  .avatar{
    width:32px;
    height:32px;
    border-radius: 50%;
    background-color: red;
    background-position: 50%;
    background-size: cover;
    background-repeat: no-repeat;
    margin-right: 10px;
  }
  .content{
    flex:1;
    white-space: nowrap;
    overflow: hidden;
    word-break: break-all;
    .delete{
      display: none;
    }
    &:hover .delete{
      display: inline-block;
      cursor: pointer;
    }
    .comment-user-info{
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      word-break: break-all;
      /*让行高等于文字高度，使得文字上下无间隙*/
      line-height: 13px;
      .username{
        color:#333;
        font-size: 13px;
        margin-right: 5px;
      }
      .usergroup{
        color:#8a9aa9;
        font-size: 13px;
      }
    }
    .comment-text{
      margin-top: 6px;
      color:#505050;
      line-height: 22px;
      font-size: 13px;
      white-space: pre-wrap;
      word-break: break-all;
    }
    .comment-img{
      margin-top: 10px;
      width:80px;
      height:80px;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: 50%;
      cursor: zoom-in;
      background-color: #cbcbcb;
    }
    .bottom-bar{
      margin-top: 7px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      padding-bottom: 10px;
      border-bottom: 1px solid #f1f1f1;
      .left{
        color:#8a9aa9;
        .dot{
          margin: 0 2px;
        }
      }
      .right{
        color:#8a9aa9;
        display: flex;
        justify-content: space-between;
        min-width: 100px;
        .comment-action{
          display: flex;
          align-items: center;
        }
      }
    }
  }
}

//图片查看组件动画过渡效果
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
