<!--新鲜事一级评论组件-->
<template>
  <div class="primary-comment-wrapper">
    <!--头像-->
    <div class="avatar" :style="{backgroundImage:'url('+commentData.profileImgUrl+')'}">
    </div>
    <!--内容部分-->
    <div class="content">
      <!--评论用户信息-->
      <div class="comment-user-info">
        <span class="username">{{commentData.nickname || commentData.userId}}</span>
        <span class="usergroup">{{commentData.userGroup}}</span>
      </div>
      <!--评论文本内容-->
      <div class="comment-text" v-html="commentHtmlContent"></div>
      <!--评论图片部分-->
      <div class="comment-img"
           v-if="commentData.imgList.length>0"
           @click="showDetailImage"
           :style="{backgroundImage:'url('+commentData.imgList[0]+')'}">
      </div>
      <!--底部操作栏-->
      <div class="bottom-bar">
        <div class="left">
          <span :title="commentData.time | detailTimeStr" class="time">
            {{ commentData.time | timeFormatter}}
          </span>
          <span class="dot delete">·</span>
          <span class="delete">删除</span>
        </div>
        <div class="right">
          <div class="like-action">
            <i class="iconfont icon-like"></i>
          </div>
          <div class="comment-action" @click="toggleCommentReplyBox">
            <i class="iconfont icon-message"></i>
            <span style="margin-left: 5px;">回复</span>
          </div>
        </div>
      </div>
      <!--回复框部分-->
      <div class="comment-box-wrapper" v-if="isShowCommentReplyBox">
        <message-board-edit-box
          v-clickoutside:emoji-selector="hideEditBox"
          ref="replyBox"
          @submit="handleSubmit"
          edit-box-min-height="15px"
          placeholder="输入回复~"
          input-id="messageCommentReplyInput"
          :hide-action="false"
          panel-bg-color="#fafbfc"
          bg-color-blur="#fff"
          submit-button-text="回复"
          :is-submitting="isSubmittingReply"
          :maxImageNum="1">
        </message-board-edit-box>
      </div>
      <!--二级评论组件-->
      <div class="reply-wrapper">
        <comment-reply></comment-reply>
        <comment-reply></comment-reply>
      </div>
      <!--分割线-->
      <div class="divider-line">
      </div>
    </div>
    <!--全屏大图查看组件,动画过渡效果-->
    <transition name="fade">
      <comment-image-viewer @close="closeViewer"
                            :img-src="commentData.imgList[0]"
                            v-if="isShowViewer">
      </comment-image-viewer>
    </transition>
  </div>
</template>

<script>
  import utils from '@/utils/utils'
  import clickoutside from '@/directives/clickoutside'
  import CommentImageViewer from '@/components/Comment/CommentImageViewer'
  import MessageBoardEditBox from '@/components/MessageBoardEditBox'
  import CommentReply from '@/components/Comment/CommentReply'
	export default {
		name: 'PrimaryComment',
    props:{
			// 评论数据对象
      commentData:{
      	type:Object,
        default:{}
      }
    },
    components:{
      CommentImageViewer,
      CommentReply,
      MessageBoardEditBox
    },
    directives:{
      clickoutside
    },
    computed:{
      //评论文本内容
      commentHtmlContent:function(){
        //捕获表情字符串
        let emotionReg = /\[:(.+?)\]/g;
        //构造html字符串
        let newValue = this.commentData.content ? this.commentData.content.replace(emotionReg,function(match){
          let emotionStr = match.slice(2,-1);
          return '<i class="em '+emotionStr+'"></i>'
        }):'';
        return newValue
      }
    },
    filters:{
      //时间过滤器
      timeFormatter: function(value){
        let now = +new Date();
        let delta = utils.timeConvertToChinese(now-value);
        return delta;
      },
      //时间详情表示
      detailTimeStr: function(value){
        let date = new Date();
        date.setTime(parseInt(value,10));
        return date.toLocaleString()
      }
    },

		data () {
			return {
				//是否显示全屏查看大图组件
        isShowViewer:false,
        //是否显示评论回复框
        isShowCommentReplyBox:false,
        //是否正在提交回复
        isSubmittingReply:false
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
      },
      // 是否显示评论回复框
      toggleCommentReplyBox: function(){
      	this.isShowCommentReplyBox = !this.isShowCommentReplyBox;
      },
      // 隐藏输入框
      hideEditBox: function(){
        this.isShowCommentReplyBox = false;
      },
      // 提交
      handleSubmit: function(){

      }
    }
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
.primary-comment-wrapper{
  display: flex;
  margin-top: 10px;
  .avatar{
    width:32px;
    height:32px;
    border-radius: 50%;
    background-color: #cbcbcb;
    background-position: 50%;
    background-size: cover;
    background-repeat: no-repeat;
    margin-right: 10px;
  }
  &:not(:last-child) .divider-line{
    border-bottom: 1px solid #f1f1f1;
    margin-top: 10px;
  }
  .content{
    /*white-space: nowrap;*/
    /*overflow: hidden;*/
    flex:1;
    word-break: break-all;
    .time{
      cursor: default;
    }
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
    .comment-box-wrapper{
      margin-bottom: 10px;
      box-sizing: border-box;
      padding: 12px;
      background-color:#fafbfc;
    }
    .reply-wrapper{
      word-break: break-all;
      width:100%;
      max-width: 100%;
    }
    .bottom-bar{
      margin-top: 7px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      padding-bottom: 10px;
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
          cursor: pointer;
          user-select: none;
          &:hover{
            color: #a3b3c2;
          }
        }
        .like-action{
          cursor: pointer;
          &:hover{
            color: #a3b3c2;
          }
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
