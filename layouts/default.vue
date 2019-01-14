<template>
  <div>
    <div class="header">
      <Menu ref="top_menu" mode="horizontal" :active-name="activeMenu" @on-select="selMainMenu">
        <div class="layout-logo">
          微站
        </div>
        <div class="layout-nav">
          <MenuItem name="topic" :to="{path: '/topic/topicList',name:'topic-topicList'}">
            <Icon type="ios-paper" size="15"/>
            {{$t('menu.topicMenu')}}
          </MenuItem>
          <MenuItem name="goods" :to="{path: '/goods/goodsList',name:'goods-goodsList'}">
            <Icon type="ios-archive" size="20"/>
            {{$t('menu.goodsMenu')}}
          </MenuItem>
          <MenuItem name="block" :to="{path: '/block/topicBlockList',name:'block-topicBlockList'}">
            <Icon type="md-apps" size="20"/>
            {{$t('menu.blockMenu')}}
          </MenuItem>
          <MenuItem name="user" :to="{path: '/user/userList',name:'user-userList'}">
            <Icon type="ios-people" size="20"/>
            {{$t('menu.userMenu')}}
          </MenuItem>
          <!--<MenuItem name="system" :to="{path:'/system/imgList',name:'system-imgList'}">
            <Icon type="md-settings" />
            {{$t('menu.systemMenu')}}
          </MenuItem>-->
        </div>
        <div class="clearfix"></div>

        <div class="layout-user">
          <Dropdown>
            <a href="javascript:void(0)">
              admin
              <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem @click.native="logout">退出</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Menu>
    </div>
    <div v-if="loadingShow">
      <div class="div-left" :style="styleMenuObjectLeft">
        <div :class="menu == 'topic' ? 'show' : 'hidden'">
          <Menu ref="side_menu" :active-name="menuSilder ? menuSilder : activeSilder" @on-select="selMenu" style="width: 200px">
            <div>
              <MenuItem name="topic-topicList" :to="{path:'/topic/topicList',name:'topic-topicList'}">
                <Icon type="ios-paper" size="15"/>
                {{$t('subMenu.topicList')}}
              </MenuItem>
            </div>
          </Menu>
        </div>
        <div :class="menu == 'goods' ? 'show' : 'hidden'">
          <Menu ref="side_menu" :active-name="menuSilder ? menuSilder : activeSilder" @on-select="selMenu" style="width: 200px">
            <div>
              <MenuItem name="goods-goodsList" :to="{path:'/goods/goodsList',name:'goods-goodsList'}">
                <Icon type="ios-archive" size="20"/>
                {{$t('subMenu.goodsList')}}
              </MenuItem>
            </div>
          </Menu>
        </div>
        <div :class="menu == 'block' ? 'show' : 'hidden'">
          <Menu ref="side_menu" :active-name="menuSilder ? menuSilder : activeSilder" @on-select="selMenu" style="width: 200px">
            <div>
              <MenuItem name="block-topicBlockList" :to="{path:'/block/topicBlockList',name:'block-topicBlockList'}">
                <Icon type="md-apps" size="20"/>
                {{$t('subMenu.topicBlockList')}}
              </MenuItem>
              <MenuItem name="block-goodsBlockList" :to="{path:'/block/goodsBlockList',name:'block-goodsBlockList'}">
                <Icon type="ios-archive" size="20"/>
                {{$t('subMenu.goodsBlockList')}}
              </MenuItem>
            </div>
          </Menu>
        </div>
        <div :class="menu == 'user' ? 'show' : 'hidden'">
          <Menu ref="side_menu" :active-name="menuSilder ? menuSilder : activeSilder" @on-select="selMenu" style="width: 200px">
            <div>
              <MenuItem name="user-userList" :to="{path:'/user/userList',name:'user-userList'}">
                <Icon type="ios-people" size="20"/>
                {{$t('subMenu.userList')}}
              </MenuItem>
            </div>
          </Menu>
        </div>
        <div :class="menu == 'system' ? 'show' : 'hidden'">
          <Menu ref="side_menu" :active-name="menuSilder ? menuSilder : activeSilder" @on-select="selMenu" style="width: 200px">
            <div>
              <MenuItem name="system-imgList" :to="{path:'/system/imgList',name:'system-imgList'}">
                <Icon type="ios-apps" size="20"/>
                {{$t('subMenu.imgList')}}
              </MenuItem>
            </div>
          </Menu>
        </div>
      </div>
      <div class="div-right">
        <div :style="styleMenuObjectRight" style="background: #ffffff;position: relative">
          <nuxt></nuxt>
        </div>
        <!--<div class="div-footer">footer</div>-->
      </div>
      <div class="clearfix"></div>
    </div>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  export default {
    name: 'layout',
    computed: {
      menu(event) {
        return event.activeMenu;
      },
      menuSilder(event) {
        return this.$route.name;
      }
    },
    data() {
      return {
        loadingShow: false,
        activeSilder: 'index',
        activeMenu: 'dir1',
        styleMenuObjectLeft: {
          height: '',
          'overflow-y': 'auto',
        },
        styleMenuObjectRight: {
          minHeight: '',
          height: '',
          position: 'relative'
        }
      }
    },
    created() {
      if (process.browser) {
        let activeSilder = localStorage.getItem("activeSilder") ? localStorage.getItem("activeSilder") : 'index';
        this.activeSilder = activeSilder;
        let activeMenu = localStorage.getItem("activeMenu") ? localStorage.getItem("activeMenu") : 'menu1';
        this.activeMenu = activeMenu;
      }
      this.hh();
    },
    methods: {
      hh() {
        if (process.browser) {
          this.styleMenuObjectLeft.height = window.innerHeight - 60 + 'px';
          this.styleMenuObjectRight.minHeight = window.innerHeight - 80 + 'px';
          this.$nextTick(function () {
            this.loadingShow = true;
          });
        }
      },
      setActive(){//设置菜单的选中状态，路由变化和直接通过浏览器输入对应地址，也可以设置相应的选中状态
        this.activeSilder = this.$route.name;
        this.activeMenu = this.$route.name.split("-")[0];
        this.$nextTick(()=>{//必须使用该方法才能动态改变menu组件的选中
          //this.$refs.side_menu.updateOpened();
          //this.$refs.side_menu.updateActiveName();
          this.$refs.top_menu.updateOpened();
          this.$refs.top_menu.updateActiveName();
        });
      },
      selMenu(event){
        this.activeSilder = event;
        localStorage.setItem('activeSilder',event);
      },
      selMainMenu(event){
        this.activeMenu = event;
        localStorage.setItem('activeMenu',event);
        localStorage.removeItem("activeSilder");
        console.log(event);
      },
      logout(){
        this.$api.postQs("/proxy/security/admin-logout", {} ,res => {
          Cookies.remove('token');
          window.location = '/login'
        },res=>{
          console.log(res);
        });
      }
    },
    mounted() {
      // 注：window.onresize只能在项目内触发1次
      var _self = this;
      if (process.browser) {
        window.onresize = function () {
          _self.hh();
        }
      }
      this.setActive();
    },
    watch: {
      '$route': function (to, from) {//监听路由变化,为了浏览器点击后退和前进也能切换菜单选中
        this.setActive();
      }
    }
  }
</script>

<style scoped>
  .header{
    background: #ffffff;
    position: fixed;
    width: 100%;
    z-index: 2;
  }
  .div-left {
    width: 200px;
    float: left;
    background: #f8f8f9;
    position: fixed;
    top:60px;
  }
  .div-right{
    margin-left:200px;
    text-align: left;
    border-left:1px solid #dddddd;
    background: #f8f8f9;
    padding:10px 10px;
    position: relative;
    top:60px;
    z-index: 1;
  }
  .div-footer{
    height:30px;
    line-height:30px;
    text-align: center;
    background: #f8f8f9;
  }
  .layout-logo{
    float: left;
    position: relative;
    width: 200px;
    height:100%;
    text-align: center;
  }
  .layout-nav{
    margin-left: 200px;
    height:100%;
    position: relative;
  }
  .layout-user{
    position: absolute;
    right:30px;
    top:0px;
  }
  .clearfix{
    clear:both;
  }
  .hidden{
    display: none !important;
  }
  .show{
    display: block !important;
  }
</style>
