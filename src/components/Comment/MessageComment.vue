<!--新鲜事评论模块,包含输入框和一级评论模块-->
<template>
  <div class="message-comment-wrapper">
    <!--顶部三角形-->
    <div class="top-triangle">
    </div>
    <!--输入框部分-->
    <div class="reply-input-wrapper">
      <!--头像-->
      <div class="avatar">
      </div>
      <!--输入框-->
      <div class="input">
        <message-board-edit-box
          edit-box-min-height="15px"
          placeholder="输入评论~"
          input-id="messageReplyInput"
          :hide-action="true"
          panel-bg-color="#fafbfc"
          bg-color-blur="#fff"
          submit-button-text="评论"
          :maxImageNum="1">
        </message-board-edit-box>
      </div>
    </div>
  </div>
</template>

<script>
  import MessageBoardEditBox from '@/components/MessageBoardEditBox'
	export default {
		name: 'MessageComment',
    components:{
      MessageBoardEditBox
    },
		data () {
			return {

			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
.message-comment-wrapper{
  position: relative;
  border-top:1px solid #ebebeb;
  background-color: #fff;
  padding-bottom: 20px;
  .top-triangle{
    position: absolute;
    left:50%;
    top:-6px;
    width:10px;
    height:10px;
    transform: translateX(-50%) rotate(45deg);
    border-left:1px solid #ebebeb;
    border-top:1px solid #ebebeb;
    background-color: #fff;
  }
  .reply-input-wrapper{
    background-color: #fafbfc;
    margin:16px 20px;
    display: flex;
    border-radius: 3px;
    padding:12px 15px;
    .avatar{
      width:32px;
      height:32px;
      background-color: red;
      border-radius: 50%;
      margin-right: 12px;
    }
    .input{
      flex:1;
      /*必须加，否则不换行*/
      word-break: break-all;
    }
  }
}
</style>
