<template>
  <section class="container">
    home1
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

</style>

