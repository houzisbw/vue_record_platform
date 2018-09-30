<!--新鲜事版块组件-->
<template>
  <div class="wrapper">
    <!--头部信息部分-->
    <div class="header">
      <!--头像部分-->
      <div class="avatar-wrapper" :style="{backgroundImage:'url('+'https://i.loli.net/2018/09/28/5badcaad5c804.jpg'+')'}">
      </div>
      <!--信息部分-->
      <div class="info">
        <div class="name">
          {{messageInfo.nickname || messageInfo.username}}
        </div>
        <div class="time">
          <span>{{messageInfo.userGroup || '无组别'}}</span>
          <span>&nbsp;·&nbsp;</span>
          <span>{{messageInfo.publishTime | timeFormatter}}</span>
        </div>
      </div>
      <!--更多部分-->
      <div class="more-btn">
        <el-dropdown trigger="click"
                     popper-class='dropdown-self-class'
                     placement="bottom"
                     size="medium">
          <i class="iconfont icon-ellipsis more-text"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>举报</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
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
      <div class="action-wrapper">
        <i class="iconfont icon-like"></i>
        <span class='action-text'>赞</span>
      </div>
      <div class="action-wrapper">
        <i class="iconfont icon-message"></i>
        <span class='action-text'>评论</span>
      </div>
      <div class="action-wrapper">
        <i class="iconfont icon-export" style="transform: rotate(-90deg);"></i>
        <span class='action-text'>分享</span>
      </div>
    </div>
  </div>
</template>

<script>
  import util from '@/utils/utils'
  import MessageImageViewer from '@/components/MessageImageViewer.vue'
	export default {
		name: 'Message',
    props:{
			//新鲜事的信息对象
			messageInfo:{
				type:Object,
      }
    },
    components:{
      MessageImageViewer
    },
    mounted:function(){},
    computed:{
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
      }
    },
    methods:{

    },
		data () {
			return {}
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
      &:hover{
        color: #a5afbc;
      }
      .action-text{
        margin-left: 3px;
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
