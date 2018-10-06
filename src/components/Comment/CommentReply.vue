<!--二级评论(回复)组件-->
<!--规则:只显示2条，多余的点击加载更多来显示-->
<template>
  <div class="comment-reply-wrapper">
      <!--头像-->
      <div class="avatar">
      </div>
      <!--内容部分-->
      <div class="content">
        <!--评论用户信息-->
        <div class="comment-user-info">
          <span class="username">罗秋雨</span>
          <span class="usergroup">准备组</span>
        </div>
        <!--评论文本内容-->
        <div class="comment-text" >是打发第三方是的额333333333333333333333333333333333333333333333333333333</div>

        <!--图片部分-->

        <!--底部操作栏-->
        <div class="bottom-bar">
          <div class="left">
            <span class="time">
              刚刚
            </span>
            <span class="dot delete">·</span>
            <span class="delete">删除</span>
          </div>
          <div class="right">
            <div class="like-action">
              <i class="iconfont icon-like"></i>
            </div>
            <div class="comment-action" @click="toggleReplyInput" >
              <i class="iconfont icon-message"></i>
              <span style="margin-left: 5px;">回复</span>
            </div>
          </div>
        </div>
        <!--输入框部分-->

        <!--bug:文字无法自动换行-->
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
  import clickoutside from '@/directives/clickoutside'
  import MessageBoardEditBox from '@/components/MessageBoardEditBox'
	export default {
		name: 'CommentReply',
    components:{
      MessageBoardEditBox
    },
    directives:{
      clickoutside
    },
    methods:{
			// 切换回复框
      toggleReplyInput:function(){
        this.isShowReplyInput = !this.isShowReplyInput;
        //必须加nextTick才行
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
      }
    },
		data () {
			return {
        //是否显示输入框
        isShowReplyInput:false,
        //是否正在回复中
        isSubmittingReply:false
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
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
    overflow: hidden;
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
