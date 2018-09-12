<!--个人中心-->
<template>
  <div class="personal-center">
    <!--左侧用户信息展示页面-->
    <div class="left">
      <div class="left-wrapper">
        <div class="avatar-wrapper">
          <img :src="userAvatar" alt="用户头像" class="avatar-img"/>
        </div>
        <!--个人昵称-->
        <div class="nickname">{{userNickname}}</div>
        <!--个人签名-->
        <div class="signature">{{userSignature}}</div>
        <!--用户详细信息-->
        <div class="detail-info">
          <p class="detail-info-line">
            <i class="iconfont icon-crown"></i>
            <span>{{userInfoObj.username}}</span>
          </p>
          <p class="detail-info-line">
            <i class="iconfont icon-apartment"></i>
            <span>{{userGroup}}</span>
          </p>
          <p class="detail-info-line">
            <i class="iconfont icon-user"></i>
            <span>{{userAuth}}</span>
          </p>
          <p class="detail-info-line">
            <i class="iconfont icon-wrench"></i>
            <span>成都市生物研究所</span>
          </p>
          <p class="detail-info-line">
            <i class="iconfont icon-location"></i>
            <span>中国四川省成都市锦江区</span>
          </p>
          <!--分割线-->
          <div class="divider">
          </div>
          <!--标签部分-->
          <div class="tag-wrapper">
            <div class="tag-title">标签</div>
            <div class="tag-inner">
              <div class="tag-body" v-for="(item,index) in personalTagsList">
                {{item}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--右侧用户具体内容-->
    <div class="right">
      <p class="temp">--施工中--</p>
    </div>
  </div>
</template>

<script>
  //用户默认头像
  import config from './../../config/config'
  import api from './../../api/api'
	export default {
		name: 'PersonalCenter',
    methods:{
			//获取用户信息
      fetchUserInfo:function(){
        this.axios.get(api.fetchUserInfo).then((resp)=>{
        	if(resp.data.status === 1){
        		this.userInfoObj = resp.data.userInfo
          }
        })
      }
    },
    mounted:function(){
			this.fetchUserInfo();
    },
    computed:{
			userAvatar: function(){
				return this.$store.getters.getUserProfileImg || config.defaultUserAvatarUrl
      },
      userNickname: function(){
				return this.$store.getters.getUserNickname || '还没有昵称呢!'
      },
      userSignature: function(){
        return this.$store.getters.getUserSignature || '还没有签名呢!'
      },
      userGroup: function(){
        return this.$store.getters.getUserGroup || '还没有组别呢!'
      },
      userAuth: function(){
      	let auth = this.$store.getters.getUserAuth || '2';
        return config.authName[auth.toString()]
      }
    },
		data () {
			return {
        personalTagsList:['小仙女','很有想法的','绩效达人','大长腿','加班狂魔','优秀','高玩'],
        userInfoObj:{}
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
.personal-center{
  display: flex;
  flex-direction: row;
  .left{
    width:400px;
    .left-wrapper{
      box-sizing: border-box;
      padding:20px;
      margin-right: 20px;
      background-color: #fff;
      .avatar-wrapper{
        margin: 0 auto;
        width:104px;
        height:104px;
        border-radius: 50%;
        overflow: hidden;
        .avatar-img{
          width:100%;
          height:100%;
        }
      }
      .nickname{
        font-size: 17px;
        color:rgba(0,0,0,1);
        text-align: center;
        margin: 20px 0 10px 0;
        font-weight: 500;
      }
      .signature{
        color:rgba(0,0,0,.65);
        font-size: 14px;
        text-align: center;
        margin-bottom: 35px;
      }
      .detail-info{
        margin-top: 10px;
        .detail-info-line{
          padding-left:30px;
          position: relative;
          margin-bottom: 8px;
          font-size: 14px;
          color:rgba(0,0,0,0.65);
          i {
            position: absolute;
            left:0;
          }
        }
        .divider{
          margin: 20px 0;
          border-top:1px dashed #e8e8e8;
        }
        .tag-wrapper{
          .tag-title{
            font-size: 14px;
            color:rgba(0,0,0,0.65);
            font-weight: 500;
            margin-bottom: 8px;
          }
          .tag-body{
            font-size: 12px;
            background-color: #fafafa;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            cursor:pointer;
            display: inline-block;
            box-sizing: border-box;
            padding:0 7px;
            margin: 0 8px 8px 0;
            height:22px;
            line-height: 20px;
            color:rgba(0,0,0,.65);
          }
        }
      }
    }
  }
  .right{
    flex:1;
    box-sizing: border-box;
    padding:20px;
    height:600px;
    background-color: #fff;
    .temp{
      margin-top: 40px;
      color:rgba(0,0,0,0.65);
      font-size: 14px;
      text-align: center;
    }
  }
}
</style>
