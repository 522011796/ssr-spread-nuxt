<template>
  <div class="login-bg">
    <!--<Button type="success" @click="login">登录</Button>-->
    <div class="login-logo">
      微站-网月
    </div>
    <div class="login-main">
      <div>
        <span class="login-title">登录</span>
      </div>
      <div class="login-content">
        <div>
          <Input v-model="username" class="login-input" placeholder="请输入用户名"  autocomplete="off"/>
        </div>
        <div class="login-item">
          <Input v-model="password" type="password" class="login-input" placeholder="请输入密码" autocomplete="off"/>
        </div>
        <Button type="info" long class="login-btn" @click="login">登录</Button>
      </div>
    </div>
  </div>
</template>

<script>
  import Logo from '~/components/Logo.vue'
  import Cookies from 'js-cookie'
  import utils from './../utils/utils'

  export default {
    layout: 'fullscreen',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        username:'',
        password:''
      }
    },
    created() {
      //Cookies.set('token', 'success');
    },
    methods: {
      login(){
        if(this.username == '' || this.password == ''){
          this.$Message.error('用户名和密码不能为空！');
          return;
        }

        var params = {
          userPhone:this.username,
          userPassword:this.password
        };
        this.$api.postQs("/proxy/security/admin-login", params ,res => {
          this.$Message.success(res.data.desc);
          Cookies.set('token', 'success');
          setTimeout("window.location = '/topic/topicList';", 1000);
        },res=>{
          this.$Message.error(res.data.desc);
        },{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
      }
    }
  }
</script>

<style scoped>
.login-bg{
  background: #f8f8f8;
  position: absolute;
  height:100%;
  width: 100%;
  background: url(../assets/login_bg.png) top left no-repeat;
  background-size: cover;
  overflow: hidden;
}
.login-main{
  margin:0 auto;
  box-sizing: border-box;
  width: 380px;
  height: 510px;
  padding: 30px 30px 40px;
  background: #fff;
  box-shadow: 0 20px 30px 0 rgba(63,63,65,.06);
  border-radius: 10px;
  margin-top:5%;
  position: relative;
}
.login-title{
  color:#2b85e4;
  font-size:25px;
}
.login-content{
  margin-top:40px;
}
.login-item{
  margin-top:30px;
}
.login-btn{
  margin-top:200px;
  height:40px;
}
.login-logo{
  position: relative;
  top:10px;
  left:15px;
  color:#2d8cf0;
  font-size:15px;
  font-weight: bold;
}
</style>
