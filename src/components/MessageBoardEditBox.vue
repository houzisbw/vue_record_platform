<!--新鲜事编辑框组件，需要在多个评论里复用，因此抽象成组件-->
<template>
  <div class="wrapper">
    <!--编辑留言的版块-->
    <!--注意v-clickoutside的参数,class为该参数的dom元素点击后不执行回调-->
    <div class="edit-message-wrapper"
         v-if="hackReset"
         v-clickoutside:emoji-selector="hideActionPanel"
         :style="{backgroundColor:panelBgColor}"
         element-loading-background="rgba(0, 0, 0, 0.6)"
         element-loading-text="提交中..."
         element-loading-spinner=""
         v-loading="isSubmitting">
      <div class="edit-dialog-wrapper"
           :style="{backgroundColor : !isTextareaFocus?bgColorBlur:'#fff'}"
           :class="{'active':isTextareaFocus}">
        <!--编辑框,注意展现文本时要用white-space: pre-wrap保留空格和换行-->
        <div class="edit-dialog"
             id="textAreaDiv"
             :class="{'empty':isEmpty}"
             :style="{minHeight:editBoxMinHeight}"
             @focus="editFocus"
             @blur="editBlur"
             ref="textArea"
             @input="handleInput"
             @keyup.ctrl.enter.exact="keyupSubmit"
             :placeholder="placeholder"
             contenteditable="true"
             spellcheck="false">
        </div>
        <!--图片上传组件-->
        <message-image-uploader
          :maxImageNum="maxImageNum"
          @can-add="handleCanAddImage"
          @change="handleImageFileListChange"
          :input-id="inputId">
        </message-image-uploader>
        <!--剩余字符数-->
        <span class="max-limit" :class="{'exceeded':isInputExceeded}">{{maxWordLimit-currentWordLength}}</span>
      </div>
      <div class="edit-bottom"
           v-show="showActionPanel">
        <!--左侧功能列表-->
        <div class="left">
          <!--注意要给popover加一个popper-class用于判断点击点是否在该dom内-->
          <el-popover
            placement="bottom-start"
            width="280"
            popper-class="emoji-selector"
            trigger="click">
            <!--匿名slot内容:表情选择组件-->
            <emotion-select @choose="handleEmotionChoose"></emotion-select>
            <!--具名slot-->
            <!--只有button能够正常工作:插入内容到光标处,div不行-->
            <button class="box"
                    :style="{backgroundColor:panelBgColor}"
                    slot="reference"
                    ref="box">
              <i class="iconfont icon-smile"></i>
              <span>表情</span>
            </button>
          </el-popover>
          <!--图片上传组件的label,for中的id和input联系-->
          <label :for="inputId"
                 class="box"
                 :style="{backgroundColor:panelBgColor}"
                 @click="handleImageUpload"
                 :class="{'disabled-add':!canAddImage}"
                 style="margin-left:10px;">
            <i class="iconfont icon-image"></i>
            <span>图片</span>
          </label>
        </div>
        <!--右侧提交按钮-->
        <div class="right">
          <span class="tip">Ctrl or ⌘ + Enter</span>
          <el-button size="small"
                     :disabled="isSubmitBtnDisabled"
                     @click="submit"
                     type="primary">
            {{submitButtonText}}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import EmotionSelect from '@/components/EmotionSelect.vue'
  import MessageImageUploader from '@/components/MessageImageUploader.vue'
  import api from '@/api/api'
  import eventBus from '@/eventBus/eventBus'
  import eventName from '@/eventBus/eventName'
  import clickoutside from '@/directives/clickoutside'
  export default {
    name: 'MessageBoardEditBox',
    directives:{
    	//点击点在目标元素范围外的指令
      clickoutside
    },
    props:{
      //最大图片上传数
      maxImageNum:{
      	type:Number,
        required:true
      },
      //编辑框最小高度
      editBoxMinHeight:{
      	type:String,
        default:'75px'
      },
      //placeholder
      placeholder:{
      	type:String,
        default:'请输入内容'
      },
      //input的id
      inputId:{
      	type:String,
        required:true
      },
      //输入框失去焦点时是否隐藏操作栏
      hideAction:{
      	type:Boolean,
        default:false
      },
      //最大输入字符数
      maxWordLimit:{
      	type:Number,
        default:200
      },
      //提交按钮文字
      submitButtonText:{
      	type:String,
        default:'发布'
      },
      //输入框失去焦点时的背景色
      bgColorBlur:{
      	type:String,
        default:'rgba(226,230,235,.2)'
      },
      //外框背景色
      panelBgColor:{
        type:String,
        default:'#fff'
      },
      //是否正在提交中
      isSubmitting:{
      	type:Boolean,
        default:false
      }

    },
    components:{
      EmotionSelect,
      MessageImageUploader
    },
    computed:{
      // 输入字符是否超限制
      isInputExceeded:function(){
        return this.maxWordLimit-this.currentWordLength<0
      },
      // 提交按钮是否禁用
      isSubmitBtnDisabled:function(){
        //这里需要对表情进行处理
        let emotionRegExp = /\[:.+?\]/g;
        let len = this.textAreaContent.replace(emotionRegExp,'_').length;
        return !(len>0 && len<=this.maxWordLimit)
      },
      //是否显示操作栏
      showActionPanel:function(){
      	return this.hideAction?this.isShowActionPanel:true;
      }
    },
    methods:{
    	//隐藏操作面板
      hideActionPanel: function(){
      	this.isShowActionPanel = false
      },
      //按键触发提交新鲜事
      keyupSubmit:function(){
        if(!this.isSubmitBtnDisabled){
          this.submit();
        }
      },

      //重置组件数据
      resetAfterSubmit: function(){
        this.hackReset = false;
        this.currentWordLength = 0;
        this.textAreaContent = '';
        this.canAddImage = true;
        this.imageListToUpload = [];
        this.isEmpty = true;
        this.$nextTick(()=>{
          this.hackReset = true;
        })
      },
      //提交新鲜事，包含图片和文字
      submit: function(){
      	//将图片和文字内容传递给父组件进行处理
        this.$emit('submit',this.imageListToUpload,this.textAreaContent);
      },

      //图片上传组件的图片列表变动
      handleImageFileListChange: function(list){
        this.imageListToUpload = list;
      },
      //处理点击图片按钮
      handleImageUpload: function(e){
        //如果不能继续添加图片则阻止默认事件-打开文件选择框
        if(!this.canAddImage){
          e.preventDefault();
        }
      },
      //图片上传组件是否可继续上传
      handleCanAddImage: function(can){
        this.canAddImage = can;
      },
      //表情选择组件的选择事件
      handleEmotionChoose: function(emotionName){
        // 表情替代符
        let emotionReplacer = '[:'+emotionName+']';
        // 输入框获得焦点,然后插入表情
        this.$refs.textArea.focus();
        this.pasteHtmlAtCaret(emotionReplacer);
        // 更新字符数
        this.handleInput();
      },
      //在光标指定位置插入内容
      pasteHtmlAtCaret: function(content){
        if (!content) {//如果插入的内容为空则返回
          return;
        }
        let sel = null;
        if (document.selection) {//IE9以下
          sel = document.selection;
          sel.createRange().pasteHTML(content);
        } else {
          sel = window.getSelection();
          if (sel.rangeCount > 0) {
            let range = sel.getRangeAt(0);      //获取选择范围
            range.deleteContents();             //删除选中的内容
            let el = document.createElement("div"); //创建一个空的div外壳
            el.innerHTML = content;                 //设置div内容为我们想要插入的内容。
            let frag = document.createDocumentFragment();//创建一个空白的文档片段，便于之后插入dom树

            let node = el.firstChild;
            let lastNode = frag.appendChild(node);
            range.insertNode(frag);                 //设置选择范围的内容为插入的内容
            let contentRange = range.cloneRange();  //克隆选区
            contentRange.setStartAfter(lastNode);          //设置光标位置为插入内容的末尾
            contentRange.collapse(true);                   //移动光标位置到末尾
            sel.removeAllRanges();                  //移出所有选区
            sel.addRange(contentRange);             //添加修改后的选区
          }
        }
      },
      editFocus: function(){
      	this.isShowActionPanel = true;
        this.isTextareaFocus = true;
      },
      editBlur: function(){
        this.isTextareaFocus = false;
      },
      //处理输入情况
      handleInput: function(e){
        let innerHtml = this.$refs.textArea.innerHTML;
        //正则匹配表情字符串，只算一个字符,注意是非贪婪全局匹配(?)
        let emotionRegExp = /\[:.+?\]/g;
        this.currentWordLength = innerHtml.replace(emotionRegExp,'_').length;
        this.textAreaContent = innerHtml;
        innerHtml===''?this.isEmpty=true:this.isEmpty=false;
      },
    },
    data () {
      return {
        //重置图片上传组件
        hackReset:true,
        // 输入框是否获得焦点
        isTextareaFocus:false,
        //输入框是否为空
        isEmpty:true,
        currentWordLength:0,
        //输入框内容
        textAreaContent:'',
        //可否继续添加图片
        canAddImage:true,
        //要上传的图片列表
        imageListToUpload:[],
        //是否显示操作面板
        isShowActionPanel:false
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
  .wrapper{
    width:100%;
    padding-bottom: 0;
    .edit-message-wrapper{
      box-sizing: border-box;
      background-color: #fff;
      .active{
        border:1px solid #007fff!important;
      }
      .edit-dialog-wrapper{
        border:1px solid hsla(0,0%,59%,.2);
        position: relative;
        background-color: rgba(226,230,235,.2);
        border-radius: 3px;
        .max-limit{
          position: absolute;
          right: 5px;
          bottom: 5px;
          font-size: 13px;
          z-index: 1;
          user-select: none;
          pointer-events: none;
          color:#a1a9b3;
        }
        .exceeded{
          color:#ff0000;
        }
        .edit-dialog.empty:after{
          display: inline-block;
        }
        .edit-dialog{
          position: relative;
          min-height: 75px;
          padding:8px 10px;
          outline: none;
          color:#17181a;
          height:100%;
          font-size: 14px;
          /*防止复制粘贴出现富文本*/
          -webkit-user-modify: read-write-plaintext-only;
          /*用伪元素模拟placeholder*/
          &:after{
            content:attr(placeholder);
            position: absolute;
            top: 8px;
            color: rgba(23,24,26,.4);
            pointer-events: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            display: none;
          }
        }
      }
      .edit-bottom{
        display: flex;
        margin-top: 10px;
        justify-content: space-between;
        .right{
          display: flex;
          align-items: center;
          .tip{
            color: #c2c2c2;
            text-align: center;
            font-size: 13px;
            /*防止用户选取到该文本*/
            user-select: none;
            margin-right: 10px;
          }
        }
        .left{
          display: flex;
          align-items: center;
          .box{
            color:#027fff;
            cursor: pointer;
            font-size: 14px;
            -webkit-appearance: none;
            -moz-appearance: none;
            outline:none;
            border:none;
            background-color: #fff;
          }
          .disabled-add{
            color:#cbcbcb;
            cursor: not-allowed;
          }
        }
      }
    }
  }
</style>
<style type="text/css">
  .emoji{
    vertical-align: sub;
    font-size: 1.1em;
    width:1.1em;
    height:1.1em;
  }
  .edit-message-wrapper .el-loading-spinner .el-loading-text{
    color:#fff!important;
  }
  .edit-message-wrapper .el-loading-spinner .path{
    stroke:#fff!important;
  }


</style>
