<template>
  <div>
    <Button type="success" @click="login">登录</Button>
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
      }
    },
    created() {
      //Cookies.set('token', 'success');
    },
    methods: {
      login(){
        Cookies.set('token', 'success');
        setTimeout("window.location = '/topic/topicList';", 1000);
      }
    }
  }
</script>

<style>

</style>
