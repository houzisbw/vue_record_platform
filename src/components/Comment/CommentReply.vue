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
        <div class="comment-text" v-if="replyData.replyType === 1">
          <span class="comment-text-inner">{{replyData.replyText}}</span>
        </div>
        <div class="comment-text" v-else>
          回复<span class="reply-to-user">{{replyData.toUserId}}: </span>
          <span class="comment-text-inner" v-html="messageHtmlContent"></span>
        </div>
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
            <span class="dot delete" v-if="replyData.fromUserId === currentUsername">·</span>
            <span class="delete"
                  v-if="replyData.fromUserId === currentUsername"
                  @click="handleDelete">
              删除
            </span>
          </div>
          <div class="right">
            <div class="like-action" @click="toggleLikes">
              <i class="iconfont" :class="[isCurrentReplyLiked?'icon-like-fill active':'icon-like']">
              </i>
              <span class='action-text' :class="{'active':isCurrentReplyLiked}" v-if="replyData.likes>0">
                {{replyData.likes>0?replyData.likes:''}}
              </span>
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
  import api from '@/api/api'
  import utils from '@/utils/utils'
  import config from '@/config/config'
  import eventBus from '@/eventBus/eventBus'
  import eventName from '@/eventBus/eventName'
  import _ from 'lodash'
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
      },
      index:{
				type:Number
      },
      //回复所属新鲜事id
      messageId:{
				type:String,
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
    computed:{
  		//当前用户
      currentUsername:function(){
      	return this.$store.getters.getUserName;
      },
      //用户是否已赞该评论,通过vuex来判断
      isCurrentReplyLiked:function(){
        return this.$store.getters.getLikedReplyList.includes(this.replyData._id)
      },
      //新鲜事文本内容
      messageHtmlContent:function(){
        //捕获表情字符串
        let emotionReg = /\[:(.+?)\]/g;
        //构造html字符串
        let newValue = this.replyData.replyText ? this.replyData.replyText.replace(emotionReg,function(match){
          let emotionStr = match.slice(2,-1);
          return '<i class="em '+emotionStr+'"></i>'
         }):'';
         return newValue
      },
    },
    methods:{
			// 用户点赞处理
      toggleLikes: function(){
      	if(this.isFetchingLikes)return;
        this.isFetchingLikes = true;
        this.axios.post(api.toggleThumbLike,{
          likeTargetId:this.replyData._id,
          messageId:this.messageId,
          type:config.likeType.REPLY
        }).then((resp)=>{
          if(resp.data.status === 1){
          	//从后台获取到的该回复的赞数
          	let replyLikedNum = resp.data.likeNum;
          	//更新回复的赞数
            this.$emit('update:likes',replyLikedNum);
          	// 更新用户已点赞的回复列表
            this.$store.dispatch('updateLikedReplyList');
          }else{
            this.$message({
              type:'error',
              message:'该回复已删除~'
            })
          }
          this.isFetchingLikes = false;
        })
      },
			// 删除该回复
      handleDelete: function(){
        this.$msgbox.confirm('是否删除该回复?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          //在此进行删除操作,注意去抖操作必须
          beforeClose: _.debounce((action, instance, done) => {
          	// 确认按钮按下
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '删除中...';
              //根据数据库的主键找到对应的回复进行删除
              this.axios.post(api.deleteReply,{id:this.replyData._id}).then((resp)=>{
                let status = resp.data.status;
                if(status === 1){
                  this.$message({
                    type:'success',
                    message:'回复删除成功!'
                  });
                }else{
                  this.$message({
                    type:'error',
                    message:'回复不存在!'
                  })
                }
                //调用父组件的方法：重新拉取该评论的所有回复
                eventBus.$emit(eventName.reFetchReplies);
                instance.confirmButtonLoading = false;
                done();
              });
            } else {
              done();
            }
          },400,{leading:true,trailing:false})
        }).then(()=>{}).catch(()=>{})
      },
			// 父组件调用:重置状态
      reset: function(){
      	this.isShowReplyInput = false;
        this.isSubmittingReply = false;
        this.$refs.replyBox.resetAfterSubmit();
      },
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
      handleSubmit: function(imgList,content){
        this.isSubmittingReply = true;
        // 调用父组件的submit方法即可,
        // 第三个参数是回复的回复,
        // 第四个参数是回复的目标用户
        // 第五个是该回复的id
        // 最后一个是该组件的index
        this.$emit('submit',
          imgList,
          content,
          config.replyType.REPLY_REPLY,
          this.replyData.fromUserId,
          this.replyData._id,
          this.index);
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
        isShowDetailImage:false,
        //是否正在点赞中
        isFetchingLikes:false,
        //回复赞数
        replyLikeNum:0
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
      word-break: break-all;
      display: inline-block;
      .comment-text-inner{
        white-space: pre-wrap;
        word-break: break-all;
      }
      .reply-to-user{
        color:#406599;
        cursor: pointer;
      }
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
        .active{
          color:#6cbd45;
        }
        .like-action{
          cursor: pointer;
          &:hover{
            color: #a3b3c2;
          }
          .action-text{
            margin-left: 1px;
            position:relative;
            top:-1px;
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
