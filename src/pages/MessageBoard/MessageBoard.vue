<!--留言板页面，类似于掘金的沸点-->
<template>
  <div class="wrapper">
    <!--编辑留言的版块-->
    <div class="edit-message-wrapper">
      <div class="edit-dialog-wrapper" :class="{'active':isTextareaFocus}">
        <!--编辑框,注意展现文本时要用white-space: pre-wrap保留空格和换行-->
         <div class="edit-dialog"
              id="textAreaDiv"
              :class="{'empty':isEmpty}"
              @focus="editFocus"
              @blur="editBlur"
              ref="textArea"
              @input="handleInput"
              placeholder="请输入新鲜事~"
              contenteditable="true"
              spellcheck="false">
         </div>
         <!--剩余字符数-->
        <span class="max-limit" :class="{'exceeded':isInputExceeded}">{{maxWordLimit-currentWordLength}}</span>
      </div>
      <div class="edit-bottom">
        <!--左侧功能列表-->
        <div class="left">
          <el-popover
            placement="bottom-start"
            width="280"
            trigger="click">
            <!--匿名slot内容:表情选择组件-->
            <emotion-select></emotion-select>
            <!--具名slot-->
            <!--只有button能够正常工作:插入内容到光标处,div不行-->
            <button class="box"
                    slot="reference"
                    @click="addEmotion"
                    ref="box">
              <i class="iconfont icon-smile"></i>
              <span>表情</span>
            </button>
          </el-popover>
        </div>
        <!--右侧提交按钮-->
        <div class="right">
          <span class="tip">Ctrl or ⌘ + Enter</span>
          <el-button size="small"
                     :disabled="isSubmitBtnDisabled"
                     @click="show"
                     type="primary">
            发布
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import EmotionSelect from '@/components/EmotionSelect.vue'
	export default {
		name: 'MessageBoard',
    components:{
      EmotionSelect
    },
    computed:{
			// 输入字符是否超限制
      isInputExceeded:function(){
      	return this.maxWordLimit-this.currentWordLength<0
      },
      // 提交按钮是否禁用
      isSubmitBtnDisabled:function(){
      	let len = this.textAreaContent.length;
      	return !(len>0 && len<=this.maxWordLimit)
      }
    },
    methods:{
			show:function(){
				this.data = this.$refs.textArea.innerHTML;
      },
			//添加表情
      addEmotion:function(){
//        this.$refs.textArea.focus();
//        this.pasteHtmlAtCaret(this.emotionUrl)
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
      	this.isTextareaFocus = true;
      },
      editBlur: function(){
        this.isTextareaFocus = false;
      },
      //处理输入情况
      handleInput: function(e){
      	let innerHtml = this.$refs.textArea.innerHTML;
      	this.data = innerHtml;
        this.currentWordLength = innerHtml.length;
        this.textAreaContent = innerHtml;
      	innerHtml===''?this.isEmpty=true:this.isEmpty=false;
      },

    },
		data () {
			return {
				//表情url
        emotionUrl:'<img class="emoji" draggable="false" alt="☁" src="https://gold-cdn.xitu.io/asset/twemoji/2.6.0/svg/2601.svg">',
				//测试
        data:'',
        // 输入框是否获得焦点
        isTextareaFocus:false,
        //输入框是否为空
        isEmpty:true,
        //最大输入字符数
        maxWordLimit:200,
        currentWordLength:0,
        //输入框内容
        textAreaContent:''
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
  .wrapper{
    width:640px;
    margin: 0 auto;
    .edit-message-wrapper{
      padding:20px 20px 10px 20px;
      box-sizing: border-box;
      background-color: #fff;
      box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
      .active{
        border:1px solid #007fff!important;
        background-color: #fff!important;
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
</style>
