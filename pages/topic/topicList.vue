<template>
  <section class="container">
    home
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
    //this.init();
  },
  methods:{
    init(){
      this.$axios.get('/api/list').then(res => {
        this.list = res.data;
      });
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

<style scoped>

</style>

