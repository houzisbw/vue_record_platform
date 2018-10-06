<!--新鲜事评论模块,包含输入框和一级评论模块-->
<template>
  <div class="message-comment-wrapper">
    <!--顶部三角形-->
    <div class="top-triangle">
    </div>
    <!--输入框部分-->
    <div class="message-comment-reply-input-wrapper">
      <!--头像-->
      <div class="avatar" :style="{backgroundImage:'url('+commentAvatar+')'}">
      </div>
      <!--输入框-->
      <div class="input">
        <message-board-edit-box
          ref="commentBox"
          @submit="handleSubmit"
          edit-box-min-height="15px"
          placeholder="输入评论~"
          input-id="messageCommentInput"
          :hide-action="true"
          panel-bg-color="#fafbfc"
          bg-color-blur="#fff"
          submit-button-text="评论"
          :is-submitting="isSubmittingComment"
          :maxImageNum="1">
        </message-board-edit-box>
      </div>
    </div>
    <!--一级评论展示列表-->
    <div class="comment-list" v-if="commentList.length>0">
      <!--用数据库的主键来做key值-->
      <primary-comment-list v-for="item in commentList"
                            :key="item._id"
                            :comment-data="item">
      </primary-comment-list>
    </div>
    <!--查看更多按钮-->
    <div class="show-more-comment"
         @click="showMoreComment"
         v-if="isShowLoadMoreComment">
      查看更多 >
    </div>
  </div>
</template>

<script>
  import api from '@/api/api'
  import utils from '@/utils/utils'
  import PrimaryCommentList from '@/components/Comment/PrimaryCommentList'
  import MessageBoardEditBox from '@/components/MessageBoardEditBox'
	export default {
    name: 'MessageComment',
    props: {
      //评论者头像
      commentAvatar: {
        type: String,
        default: ''
      },
      //评论所属的新鲜事的id
      messageId: {
        type: String,
        default: ''
      }
    },
    components: {
      MessageBoardEditBox,
      PrimaryCommentList
    },
    mounted: function () {
      // 请求最新评论
      this.fetchComments();
    },
    methods: {
    	//查看更多评论
      showMoreComment: function(){
      	if(this.isFetchingComment)return
      	//当前页数+1
        this.currentPage = this.currentPage+1;
        this.fetchComments();
      },
    	// 请求最新评论
      fetchComments: function(){
      	this.isFetchingComment = true;
      	// (1)最多取6条，超过6条下方显示查看更多按钮，一次加载6条
        // (2)评论按时间先后排列
        let data = {
        	//新鲜事id
          messageId:this.messageId
        };
        let param = {
          currentPage:this.currentPage,
          pageCapacity:this.maxCommentLoadNumEachTime
        };
        this.axios.post(api.fetchMessageComment,{data:data,param:param}).then((resp)=>{
          if(resp.data.status === 1){
          	let commentList = resp.data.commentList;
          	resp.data.userInfoList.forEach((item,index)=>{
              Object.assign(commentList[index],item);
            });
          	//追加评论列表，不是覆盖
            this.commentList = this.commentList.concat(commentList);
            this.isShowLoadMoreComment = resp.data.hasMore;
          }else{
            this.$message({
              type: 'error',
              message: '评论获取失败'
            })
          }
          this.isFetchingComment = false;
        })
      },
      // 提交评论
      handleSubmit: function (imgList, content) {
      	this.isSubmittingComment = true;
        // 存入数据库
        utils.uploadImageToPictureBed(this.axios, imgList).then((imgUrlList) => {
          let data = {
            messageId: this.messageId,
            content: content,
            imgList: imgUrlList,
            likes: 0,
            userId: this.$store.getters.getUserName,
            //服务端写入时间
            time: ''
          };
          this.axios.post(api.saveMessageComment, {data:data}).then((resp) => {
          	if(resp.data.status === 1){
              this.isSubmittingComment = false;
              this.$refs.commentBox.resetAfterSubmit();
              //重置页数为1
              this.currentPage = 1;
              this.commentList = [];
              //刷新评论列表
              this.fetchComments();
              //修改父组件上的评论数(+1)
              this.$emit('modify-comment-num',resp.data.commentNum);
            }else{
              this.$message({
                type: 'error',
                message: '保存数据出错'
              })
            }
          },()=>{
            this.isSubmittingComment = false;
            //上传图片出错
            this.$message({
              type: 'error',
              message: '保存数据出错'
            })
          })
        }, () => {
          this.isSubmittingComment = false;
          //上传图片出错
          this.$message({
            type: 'error',
            message: '上传图片出错啦'
          })
        }).catch(() => {
          this.isSubmittingComment = false;
          //上传图片出错
          this.$message({
            type: 'error',
            message: '上传图片出错啦'
          })
        })
      },

    },
    data () {
      return {
        //是否在提交评论中
        isSubmittingComment:false,
        //评论数据列表
        commentList:[],
        //一次最多加载的评论条数
        maxCommentLoadNumEachTime:6,
        //当前已加载的页数(每页maxCommentLoadNumEachTime条)
        currentPage:1,
        //是否显示加载更多按钮
        isShowLoadMoreComment:false,
        //是否正在获取评论
        isFetchingComment:false

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
  .message-comment-reply-input-wrapper{
    background-color: #fafbfc;
    margin:16px 20px;
    display: flex;
    border-radius: 3px;
    padding:12px 15px;
    .avatar{
      width:32px;
      height:32px;
      border-radius: 50%;
      margin-right: 12px;
      background-position: 50%;
      background-size: cover;
      background-repeat: no-repeat;
    }
    .input{
      flex:1;
      /*必须加，否则不换行*/
      word-break: break-all;
    }
  }
  .comment-list{
    margin:10px 20px 10px 80px;
  }
  .show-more-comment{
    height:45px;
    line-height: 45px;
    border-top:1px solid #ebebeb;
    color:#406599;
    cursor: pointer;
    font-size: 13px;
    text-align: center;
    user-select: none;
  }
}
</style>
