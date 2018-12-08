<template>
  <section class="container">
    <div class="addTopic">
      <Button type="success" @click="addTopic">{{$t("data.addTopic")}}</Button>
    </div>
    <div>
      <Table :columns="columns" :data="data"></Table>
    </div>


    <Drawer :title='$t("data.addTopic")' :closable="true" v-model="drawerModal" width="100%">
      <div style="text-align: center">
        <div style="width: 600px;margin: 0 auto" class="drawer-id">
          <Form :model="ruleForm" :label-width="80">
            <FormItem label="标题">
              <Input v-model="ruleForm.username" placeholder="请输入长度不超过40的字符" :maxlength="40"></Input>
            </FormItem>
            <FormItem label="分类">
              <Select>
                <Option value="1">教程</Option>
                <Option value="2">资料</Option>
              </Select>
            </FormItem>
            <FormItem label="内容">
              <quill-editor
                :options="editorOption"
                v-model="detailContent">
              </quill-editor>
            </FormItem>
          </Form>
        </div>
      </div>
    </Drawer>
  </section>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

const toolbarOptions = [
  ['bold'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'color': [] }],
  ['image','video']
];
export default {
  data () {
    return {
      drawerModal:false,
      detailContent:'',
      options: {
        // https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js
        target: '/upload/file/upload',
        testChunks: false,
        query:{
          fileType:'voice',
          hotelCode:'YRCDO2RQJKOMQP2T'
        }
      },
      editorOption:{
        modules: {
          toolbar: {
            container: toolbarOptions,  // 工具栏
            handlers: {
              'image': function (value) {
                if (value) {
                  console.log(11);
                  //document.querySelector('#uploadBtn').click();
                } else {
                  this.quill.format('image', false);
                }
              }
            }
          }
        }
      },
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
          title: this.$t("data.topicContent"),
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
              }, this.$t("data.topicDetail"))
            ])
          }
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
    handleSubmit (formName) {
      let _self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
        }
      });
    },
    addTopic(){
      this.drawerModal = true;
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

