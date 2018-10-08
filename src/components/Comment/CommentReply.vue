<!--二级评论(回复)组件-->
<!--规则:只显示2条，多余的点击加载更多来显示-->
<template>
  <div class="comment-reply-wrapper">
      <!--头像-->
      <div class="avatar" :style="{backgroundImage:'url('+replyData.fromUserAvatar+')'}">
      </div>
      <!--内容部分-->
      <div class="content">
        <!--评论用户信息-->
        <div class="comment-user-info">
          <span class="username">{{replyData.fromUserNickname || replyData.fromUserId}}</span>
          <span class="usergroup">{{replyData.fromUserGroup}}</span>
        </div>
        <!--评论文本内容-->
        <div class="comment-text" >{{replyData.replyText}}</div>
        <!--图片部分-->
        <span class="comment-img"
              v-if="replyData.replyImgList.length>0"
              @mouseleave="showImageBox(false)"
              @mouseenter="showImageBox(true)">
          [图片]
          <comment-brief-image-viewer
            :img-src="replyData.replyImgList[0]"
            @show="handleShowImageBox"
            v-show="isShowImageBox">
          </comment-brief-image-viewer>
          <!--大图展示组件-->
          <transition name="fade">
            <comment-image-viewer v-show="isShowDetailImage"
                                  @close="hideDetailImage"
                                  :img-src="replyData.replyImgList[0]">
            </comment-image-viewer>
          </transition>
        </span>
        <!--底部操作栏-->
        <div class="bottom-bar">
          <div class="left">
            <span class="time" :title="replyData.time | detailTimeStr">
              {{replyData.time | timeFormatter}}
            </span>
            <span class="dot delete">·</span>
            <span class="delete">删除</span>
          </div>
          <div class="right">
            <div class="like-action">
              <i class="iconfont icon-like">{{replyData.likes>0?replyData.likes:''}}</i>
            </div>
            <div class="comment-action" @click="toggleReplyInput" >
              <i class="iconfont icon-message"></i>
              <span style="margin-left: 5px;">回复</span>
            </div>
          </div>
        </div>
        <!--输入框部分-->
        <div class="reply-input" v-show="isShowReplyInput">
          <message-board-edit-box
            v-clickoutside:emoji-selector="hideEditBox"
            ref="replyBox"
            @submit="handleSubmit"
            edit-box-min-height="15px"
            placeholder="输入回复~"
            input-id="commentReplyInput"
            :hide-action="false"
            panel-bg-color="#fff"
            bg-color-blur="#fff"
            submit-button-text="回复"
            :is-submitting="isSubmittingReply"
            :maxImageNum="1">
          </message-board-edit-box>
        </div>
      </div>
  </div>
</template>

<script>
  import utils from '@/utils/utils'
  import clickoutside from '@/directives/clickoutside'
  import MessageBoardEditBox from '@/components/MessageBoardEditBox'
  import CommentBriefImageViewer from '@/components/Comment/CommentBriefImageViewer'
  import CommentImageViewer from '@/components/Comment/CommentImageViewer'
	export default {
		name: 'CommentReply',
    components:{
      MessageBoardEditBox,
      CommentBriefImageViewer,
      CommentImageViewer
    },
    props:{
			replyData:{
				type:Object,
        required:true
      }
    },
    directives:{
      clickoutside
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
    methods:{
			// 切换回复框
      toggleReplyInput:function(){
        this.isShowReplyInput = !this.isShowReplyInput;
        //必须加nextTick才行,因为数据变了需要等到dom更新(之前是display:none)
        this.$nextTick(()=>{
          if(this.isShowReplyInput) {
            this.$refs.replyBox.focusInput();
          }
        })
      },
      // 处理回复提交
      handleSubmit: function(){

      },
      //点击其他地方隐藏回复框
      hideEditBox: function(){
      	this.isShowReplyInput = false;
      },
      //处理显图片框与否
      showImageBox: function(isShow){
      	this.isShowImageBox = isShow;
      },
      //图片大图显示
      handleShowImageBox: function(){
      	this.isShowDetailImage = true;
      },
      //隐藏大图显示
      hideDetailImage: function(){
        this.isShowDetailImage = false;
      }
    },
		data () {
			return {
        //是否显示输入框
        isShowReplyInput:false,
        //是否正在回复中
        isSubmittingReply:false,
        //是否显示图片框
        isShowImageBox:false,
        //是否显示大图
        isShowDetailImage:false
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
@import './../../assets/css/animation.css';
.comment-reply-wrapper{
  display: flex;
  background-color: #fafbfc;
  padding:10px 10px 0 10px;
  max-width: 100%;
  &:not(:last-child) .content{
    border-bottom: 1px solid #f1f1f1;
  }
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
  .content{
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
      display: inline-block;
    }
    .comment-img{
      color:#406599;
      cursor: pointer;
      margin: 0 5px;
      font-size: 13px;
      position: relative;
      display: inline-block;
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
    .reply-input{
      padding:10px;
      box-sizing: border-box;
      background-color: #fff;
      border:1px solid #f1f1f2;
      border-radius: 3px;
      word-break: break-all;
      margin-bottom: 10px;
    }
  }
}

</style>
