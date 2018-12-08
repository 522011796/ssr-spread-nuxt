<template>
  <section class="container">
    <div class="addTopic">
      <Button type="success">{{$t("data.addTopic")}}</Button>
    </div>
    <div>
      <Table :columns="columns" :data="data"></Table>
    </div>
  </section>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  data () {
    return {
      ruleForm:{
        username:'',
        password:''
      },
      columns: [
        {
          title: this.$t("data.topicTitle"),
          key: 'name'
        },
        {
          title: this.$t("data.tipicSendAuthor"),
          key: 'age'
        },
        {
          title: this.$t("data.tipicSendTime"),
          key: 'address'
        },
        {
          title: this.$t("data.tipicLookNum"),
          key: 'address'
        },
        {
          title: this.$t("data.tipicAddNum"),
          key: 'address'
        },
        {
          title: this.$t("data.tipicOpr"),
          render: (h, params) => {
            return h('div', [
              h('a', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.show(params.index)
                  }
                }
              }, this.$t("data.topicDelete")),
              h('a', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.show(params.index)
                  }
                }
              }, this.$t("data.topicDisabled"))
            ]);
          }
        }
      ],
      data: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        }
      ]
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
.container{
  padding:0px 10px;
}
.addTopic{
  padding:10px 0px;
}
</style>

