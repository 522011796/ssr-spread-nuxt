<template>
  <section class="container">
    <div class="addTopic">
      <Button type="success" @click="addTopic">{{$t("data.addTopic")}}</Button>
    </div>
    <div>
      <Table :columns="columns" :data="data"></Table>
    </div>


    <Drawer :title='$t("data.addTopic")' :closable="true" v-model="drawerModal" width="100%">
      <div style="display: none">
        <Upload
          ref="upload"
          :show-upload-list="false"
          :on-success="handleSuccess"
          :max-size="10240"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          multiple
          type="drag"
          action="//jsonplaceholder.typicode.com/posts/"
          style="display: inline-block;width:58px;">
          <div id="uploadBtn" style="width: 58px;height:58px;line-height: 58px;">
            <Icon type="ios-camera" size="20"></Icon>
          </div>
        </Upload>
      </div>

      <div style="text-align: center">
        <div style="width: 600px;margin: 0 auto" class="drawer-id">
          <Form :model="ruleForm" ref="ruleForm" :label-width="80">
            <FormItem label="标题" prop="title" :rules="$filter_rules({required:true})">
              <Input v-model="ruleForm.title" placeholder="请输入长度不超过40的字符" :maxlength="40"></Input>
            </FormItem>
            <FormItem label="图片介绍" prop="imgUrl" :rules="$filter_rules({required:true})">
              <div style="position: relative;text-align: left;">
                <div v-if="ruleForm.imgUrl != ''" class="demo-upload-list" style="position: relative">
                  <img :src="ruleForm.imgUrl" alt="">
                </div>
                <div class="demo-upload-list" style="position: relative">
                  <Progress v-if="processStatusShow == true && processStatus < 100" :percent="processStatus" hide-info style="position: absolute;top:0;left:0;z-index:9999;"/>
                  <Upload
                    ref="uploadTop"
                    :show-upload-list="false"
                    :default-file-list="defaultList"
                    :on-success="handleSuccessTop"
                    :format="['jpg','jpeg','png']"
                    :max-size="10240"
                    :on-format-error="handleFormatErrorTop"
                    :on-exceeded-size="handleMaxSizeTop"
                    :on-progress="handleProgress"
                    type="drag"
                    action="/upload"
                    style="width:58px;height:58px;">
                    <div style="width: 58px;height:56px;line-height: 58px;">
                      <Icon type="ios-camera" size="20"></Icon>
                    </div>
                  </Upload>
                </div>
                <Checkbox v-model="ruleForm.top" true-value="1" false-value="0" style="position: relative;bottom:25px;">首页滚动</Checkbox>
              </div>
            </FormItem>
            <FormItem label="分类" prop="type" :rules="$filter_rules({required:true})">
              <Select v-model="ruleForm.type">
                <Option value="1">教程</Option>
                <Option value="2">资料</Option>
              </Select>
            </FormItem>
            <FormItem label="内容" prop="detailContent" :rules="$filter_rules({required:true})">
              <quill-editor
                :options="editorOption"
                v-model="ruleForm.detailContent">
              </quill-editor>
            </FormItem>
          </Form>
        </div>
        <div>
          <Button type="success" @click="handleSubmit('ruleForm')">发布</Button>
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
  ['image']
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
                  document.querySelector('#uploadBtn').click();
                } else {
                  this.quill.format('image', false);
                }
              }
            }
          }
        }
      },
      ruleForm:{
        title:'',
        imgUrl:'',
        type:'',
        detailContent:'',
        top:'0'
      },
      columns: [
        {
          title: this.$t("data.topicTitle"),
          key: 'blogTitle'
        },
        {
          title: this.$t("data.tipicSendAuthor"),
          key: 'userNickname'
        },
        {
          title: this.$t("data.tipicSendTime"),
          key: 'blogAddtime'
        },
        {
          title: this.$t("data.tipicLookNum"),
          //key: 'blogPv'
          render: (h, params) => {
            return h('div', [
                h('span', {

                },params.row.blogPv ? params.row.blogPv : 0)
            ])
          }
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
                    this.deleteOpr(params,params.index)
                  }
                }
              }, this.$t("data.topicDelete")),
              /*h('a', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.disabledOpr(params,params.index)
                  }
                }
              }, this.$t("data.topicDisabled")),*/
              h('a', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  color:'#19be6b'
                },
                on: {
                  click: () => {
                    this.topOpr(params,params.index)
                  }
                }
              }, this.$t("data.topicTop"))
            ]);
          }
        }
      ],
      data: [],
      defaultList: [
        {
          'name': 'a42bdcc1178e62b4694c830f028db5c0',
          'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
        }
      ],
      imgName: '',
      visible: false,
      uploadList: [],
      processStatus:0,
      processStatusShow:false
    }
  },
  created() {
    this.init();
  },
  methods:{
    init(){
      var params = {
        keyword:'',
        page:1,
        pageSize:15,
        blogSlide:0
      };
      this.$api.get('/proxy/backend/get-blog-list',params,res => {
        //this.list = res.data;
        console.log(res);
        this.data = res.data.data.blogList;
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
      this.processStatusShow = false;
      this.ruleForm.imgUrl = '';
    },
    handleSuccess (res, file) {
      file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
      file.name = '7eb99afb9d5f317c912f08b5212fd69a';
      console.log(res);
      this.processStatusShow = false;
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      });

      this.processStatusShow = false;
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 10M.'
      });
    },
    handleSuccessTop (res, file) {
      file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
      file.name = '7eb99afb9d5f317c912f08b5212fd69a';
      console.log(res);
    },
    handleFormatErrorTop (file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      });
    },
    handleMaxSizeTop (file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 10M.'
      });
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          //this.$Message.success('Success!');
          console.log(this.ruleForm);
        } else {
          this.$Message.error('Fail!');
          console.log(this.ruleForm);
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    },
    handleProgress(res,file,fileList){
      this.processStatusShow = true;
      this.processStatus = res.percent;
    },
    deleteOpr(params,index){
      var _self = this;
      this.$Modal.confirm({
        title: this.$t('lang.delTips'),
        content: "<div class='font-15'>"+ this.$t('lang.delTipsOk') + "</div>",
        onOk: () => {
          var paramsData = {
            blogId:params.row.blogId
          };
          this.$api.postQs("/proxy/backend/del-blog", paramsData ,res => {
            this.$Message.success(res.data.desc);
            this.init();
          },res=>{
            this.$Message.error(res.data.desc);
          },{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
        }
      });
    },
    disabledOpr(params,index){

    },
    topOpr(params,index){
      var _self = this;
      this.$Modal.confirm({
        title: this.$t('lang.topTips'),
        content: "<div class='font-15'>"+ this.$t('lang.topTipsOk') + "</div>",
        onOk: () => {
          var paramsData = {
            blogId:params.row.blogId
          };
          this.$api.postQs("/proxy/backend/set-blog-top", paramsData ,res => {
            this.$Message.success(res.data.desc);
            this.init();
          },res=>{
            this.$Message.error(res.data.desc);
          },{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
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
.demo-upload-list{
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0,0,0,.2);
  margin-right: 4px;
}
.demo-upload-list img{
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover{
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,.6);
}
.demo-upload-list:hover .demo-upload-list-cover{
  display: block;
}
.demo-upload-list-cover i{
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>

