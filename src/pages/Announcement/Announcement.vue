<!--公告页面-->
<template>
  <div class="announcement">
    <div class="title">
      <i class="iconfont icon-sound title-icon"></i>
      <span class="title-text">近期公告</span>
    </div>
    <div class="content" v-loading="loading">
      <span class="content-inner">
        {{content}}
      </span>
    </div>
  </div>
</template>

<script>
  import api from './../../api/api'
	export default {
		name: 'Announcement',
    methods:{
			//获取公告信息
      getAnnoucement: function(){
      	this.loading = true;
        this.axios.get(api.fetchAnnouncement).then((resp)=>{
        	if(resp.data.status === 1){
        		this.content = resp.data.content || '';
          }
          this.loading = false;
        })
      }
    },
    mounted:function(){
			this.getAnnoucement()
    },
		data () {
			return {
        content:'',
        loading:false
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
.announcement{
  background-color: #fff;
  box-sizing: border-box;
  .title{
    height:56px;
    line-height: 56px;
    padding:0 32px;
    border-bottom: 1px solid #e8e8e8;
    color:rgba(0,0,0,0.85);
    font-size: 16px;
    .title-text{
      margin-left: 10px;
    }
    .title-icon{
      font-size: 20px;
      position: relative;
      top:2px;
    }
  }
  .content{
    padding:20px 32px;
    box-sizing: border-box;
    white-space:normal;
    word-break:break-all;
    word-wrap:break-word;
    font-size: 14px;
    color:rgba(0,0,0,.65);
    text-indent: 20px;
    min-height:200px;
    display: flex;
    align-items: center;
    .content-inner{

    }
  }
}
</style>
