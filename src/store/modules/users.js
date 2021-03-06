/**
 * Created by Administrator on 2018/9/7.
 */
import axios from 'axios'
import api from '@/api/api'
import config from '@/config/config'
//cdn引入
//import { Message } from 'element-ui';
//用户相关的状态,未登录时为空
const state = {
  //用户名
  username:'',
  //用户头像
  profileImgUrl:'',
  //用户昵称
  nickname:'',
  //用户权限
  auth:'',
  //用户签名
  signature:'',
  //用户组别
  group:'',

  //用户点赞的新鲜事列表
  likedMessageList:[],
  //用户点赞的回复列表
  likedReplyList:[],
  //用户已点赞的评论列表
  likedCommentList:[],
  //用户未确认的错误记录总数
  unconfirmedCount:0
}

//getter,用户获取state
const getters = {
  //获取用户登录的名称
  getUserName: state => state.username,
  //获取用户头像url
  getUserProfileImg: state => state.profileImgUrl,
  //获取用户昵称
  getUserNickname: state=>state.nickname,
  //获取用户权限
  getUserAuth:state=>state.auth,
  //获取用户签名
  getUserSignature:state=>state.signature,
  //获取用户组别
  getUserGroup:state=>state.group,

  //获取点赞的新鲜事列表
  getLikedMessageList:state=>state.likedMessageList,
  //获取用户已点赞的回复列表
  getLikedReplyList:state=>state.likedReplyList,
  //获取用户已点赞的评论列表
  getLikedCommentList:state=>state.likedCommentList,
  //获取未确认的记录总数
  getUnconfirmedCount:state=>state.unconfirmedCount
}

//mutations,用于改变state,注意要存到localStorage中避免刷新页面数据丢失
const mutations = {
  //改变用户名称
  updateUserName:function(state,newName){
    state.username = newName;
    window.localStorage.setItem('username',newName)
  },
  //更新用户头像
  updateUserProfile:function(state,newProfile){
    state.profileImgUrl = newProfile;
    window.localStorage.setItem('profileImgUrl',newProfile)
  },
  //更新用户昵称
  updateUserNickname: function(state,newNickname){
    state.nickname = newNickname
    window.localStorage.setItem('nickname',newNickname)
  },
  //更新用户权限
  updateUserAuth: function(state,newAuth){
    state.auth = newAuth
    window.localStorage.setItem('auth',newAuth)
  },
  //更新用户签名
  updateUserSignature: function(state,newSig){
    state.signature = newSig
    window.localStorage.setItem('signature',newSig)
  },
  //更新用户组别
  updateUserGroup: function(state,newGroup){
    state.group = newGroup
    window.localStorage.setItem('group',newGroup)
  },
  //更新未确认的总数
  updateUnconfirmedCount:function(state,count){
    state.unconfirmedCount = count
    window.localStorage.setItem('count',count)
  },
  //登出
  logout: function(state){
    state.username = '';
    state.profileImgUrl = '';
    state.nickname = '';
    state.auth = '';
    state.signature = '';
    state.group = '';
    state.unconfirmedCount = 0;

    window.localStorage.removeItem('username')
    window.localStorage.removeItem('profileImgUrl')
    window.localStorage.removeItem('nickname')
    window.localStorage.removeItem('auth')
    window.localStorage.removeItem('signature')
    window.localStorage.removeItem('group')
    window.localStorage.removeItem('count')
  },

  //点赞的新鲜事列表
  updateLikedMessageList:function(state,list){
    state.likedMessageList = list
  },
  //更新点赞的回复列表
  updateLikedReplyList:function(state,list){
    state.likedReplyList = list
  },
  //更新点赞的评论列表
  updateLikedCommentList:function(state,list){
    state.likedCommentList = list
  },
};

//actions，异步方法
const actions = {
  // 更新用户点赞的回复列表,因为要复用所以放在action中,组件中直接this.$store.dispatch('updateLikedReplyList')
  updateLikedReplyList:function({commit}){
    axios.post(api.fetchUserLikedList,{type:config.likeType.REPLY}).then((resp)=>{
      if(resp.data.status === 1){
        // 更新vuex
        commit('updateLikedReplyList',resp.data.likedList);
      }else{
        ELEMENT.Message({
          type:'error',
          message:'点赞数据读取失败~'
        })
      }
    })
  },
  // 更新用户点赞的评论列表
  updateLikedCommentList:function({commit}){
    axios.post(api.fetchUserLikedList,{type:config.likeType.COMMENT_FIRST}).then((resp)=>{
      if(resp.data.status === 1){
        // 更新vuex
        commit('updateLikedCommentList',resp.data.likedList);
      }else{
        ELEMENT.Message({
          type:'error',
          message:'点赞数据读取失败~'
        })
      }
    })
  },
};

//导出
export default {
  //命名空间模块，不添加是全局的，其他模块也可以用,true时store无法commit本模块的mutation
  //namespaced:true,
  state,
  getters,
  actions,
  mutations
}

