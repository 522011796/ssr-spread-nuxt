<template>
  <div style="text-align: center">
    <logo/>
    <h1 class="title">
      ssr-express-nuxt
    </h1>
    <h2 class="subtitle">
      My splendid Nuxt.js project
    </h2>
    <div class="links">
      <a
        href="https://nuxtjs.org/"
        target="_blank"
        class="button--green">Documentation</a>
      <a
        href="https://github.com/nuxt/nuxt.js"
        target="_blank"
        class="button--grey">GitHub</a>
    </div>
    <div>
      <!--<nuxt-link :to="{path: '/dir1/home',name:'dir1-home'}">切换到另外一个布局</nuxt-link>-->
      <div @click="jumpOther" style="cursor: pointer;color:#2db7f5;">
        切换到另外一个布局
      </div>
    </div>
    <div>
      <div>
        <Button @click="changeLocale($event,'en')"><i class="fa fa-home"></i>英文</Button>
        <Button @click="changeLocale($event,'zh')"><i class="fa fa-home"></i>中文</Button>
      </div>
      <div>
        语言切换：{{ $t('home.introduction') }}
        时间插件：{{ $moment("20111031", "YYYYMMDD").fromNow() }}
      </div>
      <Button type="success">test</Button>
    </div>
    <div>
      <div style="padding:10px 0px 10px 0px;">表单验证：</div>
      <div class="login-info" style="width: 50%;margin:0 auto;">
        <Form :model="ruleForm" ref="ruleForm" :label-width="0">
          <FormItem label="" prop="username" :rules="$filter_rules({required:true})" style="height:45px;">
            <Input prefix="ios-contact" v-model="ruleForm.username" placeholder="" class="input-height"/>
          </FormItem>
          <FormItem label="" prop="password" :rules="$filter_rules({required:true,type:'phone'})" style="height:45px;">
            <Input prefix="ios-contact" v-model="ruleForm.password" placeholder="" class="input-height"/>
          </FormItem>
        </Form>
      </div>
      <div style="text-align: center;width: 50%;margin:0 auto;">
        <Button long style="height:45px;" @click="handleSubmit('ruleForm')">
          <span>login</span>
        </Button>
      </div>
    </div>
    api列表调用：
    <div v-for="(item,index) in list" :key="index" style="width: 50%;margin: 0 auto;text-align: left">
      <div v-html="item.title"></div>
    </div>
  </div>
</template>

<script>
  import Logo from '~/components/Logo.vue'
  import Cookies from 'js-cookie'

  export default {
    layout: 'fullscreen',
    async asyncData(ctx) {
      let [userList, topicList] = await Promise.all([
        ctx.$axios.get('/api/users'),
        ctx.$axios.get('/api/list')
      ])
      return {
        users: userList.data,
        list: topicList.data,
      }
    },
    head() {
      return {
        title: 'Users'
      }
    },
    components: {
      Logo
    },
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        active: 'home',
        list: '',
        ruleForm: {
          username: '',
          password: ''
        }
      }
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        this.$axios.get('/proxy/topics').then(res => {
          //console.log(res.data.data);
          //this.list = res.data.data;
        });
      },
      changeLocale(obj, lang) {
        let locale = lang ? lang : Cookies.get('user_lang');
        this.$i18n.locale = locale;
        Cookies.set('user_lang', locale);
      },
      handleSubmit(formName) {
        let _self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
          }
        });
      },
      jumpOther(){
        window.location = '/dir1/home';
      }
    }
  }
</script>

<style scoped>
  .container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .title {
    font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    display: block;
    font-weight: 300;
    font-size: 100px;
    color: #35495e;
    letter-spacing: 1px;
  }

  .subtitle {
    font-weight: 300;
    font-size: 42px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 15px;
  }

  .links {
    padding-top: 15px;
  }
</style>
