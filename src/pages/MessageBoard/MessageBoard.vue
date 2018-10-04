<!--留言板页面，类似于掘金的沸点-->
<template>
  <div class="wrapper">
    <!--编辑留言的版块-->
    <div class="edit-box-wrapper">
      <message-board-edit-box
        ref="editBox"
        @submit="handleSubmit"
        edit-box-min-height="75px"
        placeholder="发布新鲜事~"
        input-id="messageImageInput"
        :isSubmitting="isSubmitting"
        :hide-action="false"
        :maxImageNum="9">
      </message-board-edit-box>
    </div>
    <!--推荐和动态tab栏-->
    <div class="tab">
      <router-link to="/message/recommend"
                   tag="div"
                   class="tab-sub"
                   active-class="tab-active">
        <span>推荐</span>
      </router-link>
      <router-link to="/message/subscribe"
                   tag="div"
                   class="tab-sub"
                   active-class="tab-active">
        <span>动态</span>
      </router-link>

    </div>
    <!--tab栏的router-view-->
    <div class="router-view-wrapper">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import eventBus from '@/eventBus/eventBus'
  import eventName from '@/eventBus/eventName'
  import api from '@/api/api'
  import utils from '@/utils/utils'
  import MessageBoardEditBox from '@/components/MessageBoardEditBox.vue'
	export default {
		name: 'MessageBoard',
    components:{
      MessageBoardEditBox
    },
    computed:{},
    methods:{
			//处理editBox的提交
      handleSubmit: function(imgList,text){
        this.isSubmitting = true;
        utils.uploadImageToPictureBed(this.axios,imgList).then((imgUrlList)=>{
          this.isSubmitting = false;
          //要保存的新鲜事数据
          let messageData = {
            //唯一id:后台统一添加
            messageId:'',
            imageList:imgUrlList,
            likes:0,
            content:text,
            commentNumber:0,
            //发布时间:后台统一添加
            publishTime:'',
            username:this.$store.getters.getUserName,
            profileImgUrl:this.$store.getters.getUserProfileImg,
            nickname:this.$store.getters.getUserNickname,
            userGroup:this.$store.getters.getUserGroup
          };
          //把图片url和文字提交到后台数据库
          this.axios.post(api.saveMessage,{data:messageData}).then((resp)=>{
            if(resp.data.status === 1){
              this.$message({
                type:'success',
                message:'新鲜事发布成功!'
              });
              //清空editBox的数据
              this.$refs.editBox.resetAfterSubmit();
              //通知外层的组件进行更新操作
              eventBus.$emit(eventName.updateMessageList);
            }
          })
        },()=>{
          //上传图片出错
          this.$message({
            type:'error',
            message:'上传图片出错啦'
          })
        }).catch(()=>{
          //上传图片出错
          this.$message({
            type:'error',
            message:'上传图片出错啦'
          })
        });
      },
    },
		data () {
			return {
        //是否正在提交中
        isSubmitting:false,
        //上传图片的列表
        imgListToUpload:[],
        //上传的内容
        textContent:''
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
.wrapper{
  width:640px;
  margin:0 auto;
  .edit-box-wrapper{
    padding:20px 20px 10px 20px;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
  .tab{
    margin:8px 0;
    display: flex;
    justify-content: center;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    .tab-sub{
      width:25%;
      display: flex;
      justify-content: center;
      align-items: center;
      line-height: 2.5em;
      color:#909090;
      font-size: 15px;
      cursor: pointer;
    }
    .tab-active{
      color:#007fff;
      span{
        position: relative;
      }
    }
    .tab-active span:after{
      position: absolute;
      width:100%;
      height:3px;
      background-color: #007fff;
      bottom:0;
      left:0;
      content:'';
    }
  }
  .router-view-wrapper{
    width:100%;
  }
}
</style>

