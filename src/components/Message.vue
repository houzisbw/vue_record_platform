<!--新鲜事版块组件-->
<template>
  <div class="wrapper">
    <!--头部信息部分-->
    <div class="header">
      <!--头像部分-->
      <div class="avatar-wrapper"
           :style="{backgroundImage:'url('+(messageInfo.profileImgUrl?messageInfo.profileImgUrl:defaultAvatar)+')'}">
      </div>
      <!--信息部分-->
      <div class="info">
        <div class="name">
          {{messageInfo.nickname || messageInfo.username}}
        </div>
        <div class="time">
          <span>{{messageInfo.userGroup || '无组别'}}</span>
          <span>&nbsp;·&nbsp;</span>
          <span class="timestamp"
                :title="messageInfo.publishTime | detailTimeStr">
            {{messageInfo.publishTime | timeFormatter}}
          </span>
        </div>
      </div>
      <!--更多部分-->
      <div class="more-btn">
        <el-dropdown trigger="click"
                     popper-class='dropdown-self-class'
                     @command="handleCommand"
                     placement="bottom"
                     size="medium">
          <i class="iconfont icon-ellipsis more-text"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="!messageInfo.isOwnMessage">举报</el-dropdown-item>
            <el-dropdown-item v-if="messageCanDelelet" command="delete">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!--中部内容部分-->
    <div class="content" v-html="messageHtmlContent"></div>
    <!--中间图片部分-->
    <div class="img-wrapper">
      <!--图片展示组件-->
      <message-image-viewer :imageList="messageInfo.imageList" v-if="messageInfo.imageList.length>0">
      </message-image-viewer>
    </div>
    <!--底部按钮部分-->
    <div class="footer">
      <!--点赞-->
      <div class="action-wrapper" @click="toggleMessageLikes(messageInfo.messageId)">
        <i class="iconfont" :class="[isCurrentMessageLiked?'icon-like-fill active':'icon-like']"></i>
        <span class='action-text' :class="{'active':isCurrentMessageLiked}">
          {{messageLikeNum>0?messageLikeNum:'赞'}}
        </span>
      </div>
      <div class="action-wrapper" @click="toggleComment">
        <i class="iconfont icon-message"></i>
        <span class='action-text'>{{commentNum===0?'评论':commentNum}}</span>
      </div>
      <div class="action-wrapper">
        <i class="iconfont icon-export" style="transform: rotate(-90deg);"></i>
        <span class='action-text'>分享</span>
      </div>
    </div>
    <!--评论模块-->
    <message-comment v-if="isShowComment"
                     @modify-comment-num="handleModifyCommentNum"
                     :message-id="messageInfo.messageId"
                     :comment-avatar="messageInfo.profileImgUrl">
    </message-comment>

  </div>
</template>

<script>
  import api from '@/api/api'
  import config from '@/config/config'
  import util from '@/utils/utils'
  import _ from 'lodash'
  import eventBus from '@/eventBus/eventBus'
  import eventName from '@/eventBus/eventName'
  import MessageImageViewer from '@/components/MessageImageViewer.vue'
  import MessageComment from '@/components/Comment/MessageComment'
	export default {
		name: 'Message',
    props:{
			//新鲜事的信息对象
			messageInfo:{
				type:Object,
      },
      //新鲜事的评论数
      commentNum:{
				type:Number,
        default:0
      }
    },
    components:{
      MessageImageViewer,
      MessageComment
    },
    mounted:function(){
			this.messageLikeNum = this.messageInfo.likes;
			// 更新新鲜事的评论数量(用户回复后)
      let self = this;
      eventBus.$on(eventName.updateMessageCommentNum,function(num){
        self.$emit('update:commentNum',num)
      });
    },
    computed:{
    	//新鲜事是否可删除
      messageCanDelelet:function(){
      	//(1)超管可以删除 (2)只能删除自己的
        if(parseInt(this.$store.getters.getUserAuth,10) === 2){
        	return true
        }
        return this.messageInfo.isOwnMessage
      },
    	//用户是否已赞该新鲜事,通过vuex来判断
      isCurrentMessageLiked:function(){
      	return this.$store.getters.getLikedMessageList.includes(this.messageInfo.messageId)
      },
      //新鲜事文本内容
      messageHtmlContent:function(){
        //捕获表情字符串
        let emotionReg = /\[:(.+?)\]/g;
        //构造html字符串
        let newValue = this.messageInfo.content ? this.messageInfo.content.replace(emotionReg,function(match){
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
      	let delta = util.timeConvertToChinese(now-value);
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
    	//下拉菜单事件处理
      handleCommand: function(command){
      	//策略类
        let strategy = {
        	//删除新鲜事
        	'delete':()=>{
            this.$msgbox.confirm('是否删除该新鲜事?', '提示', {
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
                  this.axios.post(api.deleteMessage,{id:this.messageInfo.messageId}).then((resp)=>{
                    let status = resp.data.status;
                    if(status === 1){
                      this.$message({
                        type:'success',
                        message:'新鲜事删除成功!'
                      });
                    }else{
                      this.$message({
                        type:'error',
                        message:'新鲜事删除失败!'
                      })
                    }
                    //调用父组件的方法:删除后重新拉取新鲜事数据
                    eventBus.$emit(eventName.reFetchMessages);
                    instance.confirmButtonLoading = false;
                    done();
                  });
                } else {
                  done();
                }
              },400,{leading:true,trailing:false})
            }).then(()=>{}).catch(()=>{})
          }
        };
        strategy[command]&&strategy[command]();
      },
    	//修改评论数
      handleModifyCommentNum: function(num){
      	//修改父组件的prop:评论数,注意父组件的prop使用了sync修饰符
        this.$emit('update:commentNum',num)
      },
    	//切换评论模块显示
      toggleComment: function(){
      	this.isShowComment = !this.isShowComment;
      },
      //处理用户新鲜事点赞
      toggleMessageLikes: function(messageId){
      	if(this.isfetchingLikes)return
      	this.isfetchingLikes = true;
        this.axios.post(api.toggleThumbLike,{
          likeTargetId:messageId,
          type:config.likeType.MESSAGE
        }).then((resp)=>{
        	if(resp.data.status === 1){
        		this.messageLikeNum = resp.data.likeNum;
            let oldLikesList = this.$store.getters.getLikedMessageList;
            let status = resp.data.likeStatus;
            if(status===1){
            	//是点赞
              oldLikesList.push(messageId);
            }else{
            	//取消赞
              let index = oldLikesList.indexOf(messageId);
              oldLikesList.splice(index,1)
            }
            //更新vuex
            this.$store.commit('updateLikedMessageList',oldLikesList)
          }else{
            this.$message({
              type:'error',
              message:'该新鲜事已删除~'
            })
          }
          this.isfetchingLikes = false;
        })
      }
    },
		data () {
			return {
				//新鲜事评论数量，用于及时改变评论数
        messageCommentNum:0,
				//新鲜事赞数,内部变量，用于及时改变赞数
        messageLikeNum:0,
        //用户点赞过的新鲜事列表
        likedMessageList:[],
        //是否正在点赞中
        isfetchingLikes:false,
        //是否显示评论组件
        isShowComment:false,
        //默认头像(得用require引入,不能写在html中)
        defaultAvatar:require('./../assets/images/icon/default-avatar.png')
      }
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
.wrapper{
  width:100%;
  box-shadow:0 1px 2px 0 rgba(0, 0, 0, 0.05);
  background-color: #fff;
  margin-bottom: 15px;
  .header{
    display: flex;
    align-items: center;
    padding:16px 20px 0 20px;
    .avatar-wrapper{
      width:45px;
      height:45px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #cbcbcb;
      background-size: cover;
      background-position: 50%;
      background-repeat: no-repeat;
    }
    .info{
      margin-left: 12px;
      height:100%;
      .name{
        font-size: 15px;
        color:#2e3135;
        font-weight: 600;
      }
      .time{
        color:#8a9aa9;
        font-size: 13px;
        margin-top: 10px;
        .timestamp{
          cursor: pointer;
        }
      }
    }
    .more-btn{
      /*flex中最后一项右对齐，设置marginLeft为auto即可*/
      margin:0 -1px 0 auto;
      .more-text{
        color:#b8c1cc;
        font-size: 30px;
        outline: none;
        cursor:pointer;
        &:hover{
          color: #999999;
        }
      }
    }
  }
  @commonMargin:10px 40px 10px 78px;
  .content{
    margin: @commonMargin;
    font-size: 15px;
    line-height: 1.5;
    /*关键:保留换行和空格*/
    white-space: pre-wrap;
    color: #17181a;
    word-break: break-all;
  }
  .img-wrapper{
    margin: @commonMargin;
  }
  .footer{
    display: flex;
    height:34px;
    margin-top: 15px;
    position: relative;
    border-top:1px solid #ebebeb;
    .action-wrapper{
      flex:1;
      height:100%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      color:#8a93a0;
      cursor:pointer;
      user-select: none;
      &:hover{
        color: #a5afbc;
      }
      .action-text{
        margin-left: 3px;
      }
      .active{
        color:#6cbd45;
      }
    }
    /*除最后一个div有border*/
    .action-wrapper:not(:last-child):after{
      content:'';
      width:1px;
      height:24px;
      top:50%;
      position: absolute;
      right:0;
      transform:translateY(-50%);
      background-color: #ebebeb;
    }
  }

}
</style>
<style lang="less" type="text/less">
  //注意这里全局的样式都修改了!!!
  .el-dropdown-menu .el-dropdown-menu__item:hover{
    background-color: #f8f8f8;
    color:#606266;
  }

</style>
