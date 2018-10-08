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
      <div class="reply-wrapper" v-if="replyList.length>0">
        <comment-reply v-for="item in replyList"
                       :key="item._id"
                       :reply-data="item">
        </comment-reply>
        <!--加载更多-->
        <div class="fetch-more" v-if="isShowLoadMore">
          <span class="fetch-more-text"
                v-if="!isFetchingReply"
                @click="fetchMoreReply">
            加载更多
          </span>
          <span v-else >
            加载中...
          </span>
        </div>
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
  import api from '@/api/api'
  import utils from '@/utils/utils'
  import config from '@/config/config'
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
    mounted:function(){
      this.fetchReply(this.replyListCurrentPage,
                      this.replyNumOfPageSize,
                      this.replyInitialShowNum + (this.replyListCurrentPage-1)*this.replyNumOfPageSize,
                      false);

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
        //是否显示加载更多
        isShowLoadMore:false,
        //是否正在提交回复
        isSubmittingReply:false,
        //是否正在获取回复
        isFetchingReply:false,
        //回复数量初始加载数量
        replyInitialShowNum:2,
        //点击加载更多后加载的回复数量
        replyNumOfPageSize:4,
        //回复列表
        replyList:[],
        //回复列表显示的当前页数
        replyListCurrentPage:1,
        //是否是首次加载回复(只加载2条)
        isFirstLoadReply:true,
        //提交回复后无加载更多下最多显示条数
        maxReplyNumShownAfterSubmit:10
			}
		},
    methods:{
			// 获取该评论的回复
      fetchReply: function(pageNum,pageSize,offset,isShowAll){
      	this.isFetchingReply = true;
        // 该评论的id
        let commentId = this.commentData._id;
        let data = {
          commentId,
          pageNum:pageNum,
          pageSize:pageSize,
          //回复数偏移量
          offset:offset
        };
        //如果是首次加载,只加载2条
        if(this.isFirstLoadReply){
          data.pageSize = this.replyInitialShowNum;
        }
        this.axios.post(api.fetchReplyOfComment,{data:data}).then((resp)=>{
        	if(resp.data.status === 1){
        		let replyList = resp.data.replyList;
        		let fromUserInfoList = resp.data.fromUserInfoList;
            fromUserInfoList.forEach((item,index)=>{
            	Object.assign(replyList[index],item)
            });
            //如果不是显示全部回复，则concat即可
            if(!isShowAll){
              this.replyList = this.replyList.concat(replyList);
            }else{
              this.replyList = replyList;
            }
            this.isShowLoadMore = resp.data.isFetchMore;
            this.isFirstLoadReply = false;
            //页数+1
            this.replyListCurrentPage = this.replyListCurrentPage+1;
          }else{
            this.$message({
              type: 'error',
              message: '读取回复失败~'
            })
          }
          this.isFetchingReply = false;
        })
      },
			// 拉取更多回复
      fetchMoreReply: function(){
      	if(this.isFetchingReply) return;
        this.fetchReply(
          this.replyListCurrentPage,
          this.replyNumOfPageSize,
          this.replyInitialShowNum + (this.replyListCurrentPage-1)*this.replyNumOfPageSize,
          false);
      },
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
      // 提交回复
      handleSubmit: function(imgList,content){
        this.isSubmittingReply = true;
        // 上传图片
        utils.uploadImageToPictureBed(this.axios, imgList).then((imgUrlList) => {
          let data = {
          	//评论id
            commentId: this.commentData._id,
            //回复内容
            replyText: content,
            //回复图片数组
            replyImgList: imgUrlList,
            //回复id
            replyId:this.commentData._id,
            //回复类型
            replyType:config.replyType.COMMENT_REPLY,
            //赞数
            likes: 0,
            //服务端写入时间
            time: '',
            //回复的用户名,不能是昵称
            fromUserId:this.$store.getters.getUserName
          };
          this.axios.post(api.saveCommentReply, {
          	data:data,
            numLimit:this.maxReplyNumShownAfterSubmit
          }).then((resp) => {
            if(resp.data.status === 1){
              this.isSubmittingReply = false;
              //这里提交回复后，如果回复数量总数小于limit值，直接展示全部评论，然后刷新所有数据
              //如果回复总数大于limit值，则显示加载更多
              let isShowAll = resp.data.isShowAll;
              if(isShowAll){
                this.fetchReply(1,Infinity,Infinity,true);
              }else{
              	//清空相关数据结构
              	this.replyListCurrentPage = 1;
                this.isFirstLoadReply = true;
                this.replyList = [];
                this.fetchReply(this.replyListCurrentPage,
                  this.replyNumOfPageSize,
                  this.replyInitialShowNum + (this.replyListCurrentPage-1)*this.replyNumOfPageSize,
                  false);
              }
              this.$refs.replyBox.resetAfterSubmit();
              this.$message({
                type: 'success',
                message: '评论成功~'
              })
            }else{
              this.$message({
                type: 'error',
                message: '保存数据出错'
              })
            }
          },()=>{
            this.isSubmittingReply = false;
            //上传图片出错
            this.$message({
              type: 'error',
              message: '保存数据出错'
            })
          })
        }, () => {
          this.isSubmittingReply = false;
          //上传图片出错
          this.$message({
            type: 'error',
            message: '上传图片出错啦'
          })
        }).catch(() => {
          this.isSubmittingReply = false;
          //上传图片出错
          this.$message({
            type: 'error',
            message: '上传图片出错啦'
          })
        })
      },
    }
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
//引入动画css
@import './../../assets/css/animation.css';
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
      .fetch-more{
        font-size: 13px;
        line-height: 40px;
        text-align: center;
        background-color: #fafbfc;
        .fetch-more-text{
          color:#406599;
          cursor: pointer;
        }
      }
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

</style>
