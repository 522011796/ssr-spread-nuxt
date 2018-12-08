<template>
  <section class="container">
    <Card style="width:200px;height:240px;position: relative">
      <div style="text-align:center;height:230px;width: 100%;border:1px solid #dddddd;">
        <Icon type="ios-trash" style="font-size:22px;position: absolute;right:10px;"/>
        <img src="" alt="" style="height:100%;width: 100%">
      </div>
    </Card>
  </section>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      active:'home',
      list:'',
      ruleForm:{
        username:'',
        password:''
      }
    }
  },
  created() {
    this.init();
  },
  methods:{
    init(){
      //console.log(this.$moment().format('dddd'));
    },
    changeLocale(obj,lang) {
      let locale = lang ? lang : Cookies.get('user_lang');
      this.$i18n.locale = locale;
      Cookies.set('user_lang',locale);
    },
    handleSubmit (formName) {
      let _self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
        }
      });
    }
  }
}
</script>

<style>
.container{
  padding:10px 10px;
}
.ivu-card-body{
  padding:5px;
}
</style>

