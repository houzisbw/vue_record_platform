<!--侧栏组件-->
<template>
  <aside class="aside">
    <!--logo部分-->
    <div class="logo">
      <div class="logo-wrapper">
        <img src="./../assets/images/icon/logo.png" class="logo-img"/>
        <span class="logo-title">生研所-错误记录平台</span>
      </div>
    </div>
    <!--侧栏菜单部分-->
    <div class="side-bar-menu">
      <el-menu
        class="el-menu-vertical"
        @select="handleMenuSelect"
        background-color="#001529"
        text-color="#D9D9D9"
        active-text-color="#fff">
        <template v-for="(item,index) in menuData">
          <!--submenu的index必须有且唯一,且是字符串-->
          <el-submenu :index="index+''">
            <template slot="title">
              <i :class="item.iconName"></i>
              <span>{{item.menuName}}</span>
            </template>
            <template v-for="(subItem,subIndex) in item.subMenuNameList">
              <el-menu-item :index="subItem.index"
                            :class="subItem.index === activeMenuIndex?'sub-menu-item-bg-color-active':'sub-menu-item-bg-color'">
                {{subItem.subMenuTitle}}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
      </el-menu>
    </div>
  </aside>
</template>

<script>
  import config from './../config/config'
  //用户权限
  let auth = config.auth;
	export default {
		name: 'Aside',
    mounted:function(){
      this.filterMenuByAuth();
    },
    methods:{
    	//处理菜单选择
      handleMenuSelect: function(index){
        this.activeMenuIndex = index
      },
      //处理菜单权限过滤
      filterMenuByAuth: function(){
      	let menuData = this.menuData;
      	let userAuth = this.$store.getters.getUserAuth;
      	//过滤一级菜单
      	let filteredMenuData = menuData.filter((item)=>{
      		return item.role.indexOf(userAuth)!==-1
        });
        //过滤二级菜单
        filteredMenuData.forEach((item)=>{
      		if(item.subMenuNameList){
      			let sub = item.subMenuNameList.slice();
      			sub = sub.filter((subItem)=>{
              return subItem.role.indexOf(userAuth)!==-1
            });
            item.subMenuNameList = sub;
          }
        });
        //更新过滤后的菜单
        this.menuData = filteredMenuData
      },
    },
		data () {
			return {
				//当前激活菜单index
				activeMenuIndex:'',
        //菜单数据
        menuData:[
          {
          	menuName:'错误记录',
            iconName:'el-icon-tickets',
            role:[auth.ADMIN,auth.ORDINARY_USER,auth.SUPER_ADMIN],
            subMenuNameList:[
              {
              	index:'1-1',
                iconName:'',
                role:[auth.ADMIN,auth.ORDINARY_USER,auth.SUPER_ADMIN],
                subMenuTitle:'查询记录'
              },
              {
                index:'1-2',
                iconName:'',
                role:[auth.SUPER_ADMIN],
                subMenuTitle:'修改记录'
              },
              {
                index:'1-3',
                iconName:'',
                role:[auth.SUPER_ADMIN],
                subMenuTitle:'添加记录'
              }
            ]
          },
          {
            menuName:'配置信息',
            iconName:'el-icon-edit-outline',
            role:[auth.SUPER_ADMIN],
            subMenuNameList:[
              {
                index:'2-1',
                iconName:'',
                role:[auth.SUPER_ADMIN],
                subMenuTitle:'公告内容'
              },
              {
                index:'2-2',
                iconName:'',
                role:[auth.SUPER_ADMIN],
                subMenuTitle:'本组名称'
              },
              {
                index:'2-3',
                iconName:'',
                role:[auth.SUPER_ADMIN],
                subMenuTitle:'车间名字'
              }
            ]
          },
          {
            menuName:'用户管理',
            iconName:'el-icon-setting',
            role:[auth.SUPER_ADMIN],
            subMenuNameList:[
              {
                index:'3-1',
                iconName:'',
                role:[auth.SUPER_ADMIN],
                subMenuTitle:'添加/删除用户'
              }
            ]
          },
          {
            menuName:'统计图表',
            iconName:'el-icon-menu',
            role:[auth.ADMIN,auth.ORDINARY_USER,auth.SUPER_ADMIN],
            subMenuNameList:[
              {
                index:'4-1',
                iconName:'',
                role:[auth.ADMIN,auth.ORDINARY_USER,auth.SUPER_ADMIN],
                subMenuTitle:'当月错误记录图'
              }
            ]
          },
          {
            menuName:'公告内容',
            iconName:'el-icon-info',
            role:[auth.ADMIN,auth.ORDINARY_USER,auth.SUPER_ADMIN],
            subMenuNameList:[
              {
                index:'5-1',
                iconName:'',
                role:[auth.ADMIN,auth.ORDINARY_USER,auth.SUPER_ADMIN],
                subMenuTitle:'公告内容'
              }
            ]
          },
        ]
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
  .aside{
    min-height:100vh;
    width:256px;
    background-color: #001529;
    box-shadow:2px 0 6px rgba(0,21,41,0.35);
    /*防止box-shadow被挡住*/
    z-index:10;
    .logo{
      height:64px;
      background-color: #002140;
      text-align: center;
      cursor: pointer;
      user-select:none;
      .logo-wrapper{
        /*让块级元素水平居中*/
        display: inline-block;
        height:100%;
        line-height: 64px;
        .logo-img{
          vertical-align: middle;
          height:32px;
          width:32px;
          display: inline-block;
        }
        .logo-title{
          display: inline-block;
          font-size: 17px;
          font-weight: bold;
          color:#fff;
          padding-left: 10px;
        }
      }
    }
    .side-bar-menu{
      width:100%;
      .el-menu-vertical{
        border-right:none;
        .sub-menu-item-bg-color{
          background-color: #000c17!important;
        }
        .sub-menu-item-bg-color-active{
          background-color: #1890ff!important;
        }
      }
    }
  }
</style>
<!--elementUI样式设置-->
<style type='text/less' lang="less">
  .side-bar-menu .el-menu--inline.el-menu{
    box-shadow: inset 0 2px 8px rgba(0,0,0,.45);
  }
</style>
