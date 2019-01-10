<template>
  <section class="container" id="topicList">
    <Modal
      v-model="detailShowModal"
      :footer-hide="true"
      class="topicListId"
    >
      <div style="padding:10px 16px;">
        <div>
          <div>
            {{blogShowTitle}}
          </div>
          <div>
            <div style="position: relative;margin-top:5px;">
            <span style="color:#2db7f5;margin-right:10px;">
              <img :src="userHeadimgurl" style="height:20px;width: 20px;border-radius: 20px;border:1px solid #dddddd;" alt="">
              <span style="position: relative;top:-5px;font-size:10px;">{{userShowNickname}}</span>
            </span>
              <span style="color:#c5c8ce;font-size:10px;margin-right:10px;position: relative;top:-5px;">
              {{blogShowAddtime}}
            </span>
            </div>
          </div>
        </div>
        <div style="margin-top:10px;font-size:12px;color:#515a6e;">
          <div v-html="blogShowContent"></div>
        </div>
      </div>
    </Modal>

    <div class="addTopic">
      <Button type="success" @click="addTopic">{{$t("data.addTopic")}}</Button>
    </div>
    <div style="position: relative">
      <Table :columns="columns" :data="data"></Table>
      <Page v-if="totalCount!=0" style="text-align: right" :total="totalCount" :current="current" :page-size="pageNum" @on-change="init($event)" show-total></Page>
    </div>


    <Drawer :title='$t("data.addTopic")' :closable="true" v-model="drawerModal" @on-visible-change="closeModal" width="100%">
      <div style="display: none">
        <Upload
          ref="upload"
          :show-upload-list="false"
          :on-success="handleSuccess"
          :max-size="1024000"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :on-progress="handleAddProgress"
          type="drag"
          name="resource"
          action="/proxy/backend/upload-resource"
          style="display: inline-block;width:58px;">
          <div id="uploadBtn" style="width: 58px;height:58px;line-height: 58px;">
            <Icon type="ios-camera" size="20"></Icon>
          </div>
        </Upload>
      </div>

      <div style="text-align: center">
        <div style="width: 600px;margin: 0 auto" class="drawer-id">
          <Form :model="ruleForm" ref="ruleForm" :label-width="80">
            <FormItem label="标题" prop="blogTitle" :rules="$filter_rules({required:true})">
              <Input v-model="ruleForm.blogTitle" placeholder="请输入长度不超过40的字符" :maxlength="40"></Input>
            </FormItem>
            <FormItem label="图片介绍" prop="blogSlideimgurl" :rules="$filter_rules({required:true})">
              <div style="position: relative;text-align: left;">
                <div v-if="ruleForm.blogSlideimgurl != ''" class="demo-upload-list" style="position: relative">
                  <img :src="ruleForm.blogSlideimgurl" alt="">
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
                    name="resource"
                    action="/proxy/backend/upload-resource"
                    style="width:58px;height:58px;">
                    <div style="width: 58px;height:56px;line-height: 58px;">
                      <Icon type="ios-camera" size="20"></Icon>
                    </div>
                  </Upload>
                </div>
                <Checkbox v-model="ruleForm.blogSlide" true-value="1" false-value="0" style="position: relative;bottom:25px;">首页滚动</Checkbox>
              </div>
            </FormItem>

            <FormItem label="分类" prop="categoryIdList" :rules="$filter_rules({required:true,type: 'array'})" style="text-align: left">
              <CheckboxGroup v-model="ruleForm.categoryIdList">
                <Checkbox v-for="(item,index) in categoryList" :key="index" :label="item.id">{{item.name}}</Checkbox>
              </CheckboxGroup>
            </FormItem>
            <FormItem label="内容" prop="blogContent" :rules="$filter_rules({required:true})" style="position: relative;">
              <Progress v-if="processAddStatusShow == true && processAddStatus < 100" :percent="processAddStatus" hide-info style="position: absolute;top:-10px;left:0;z-index:9999;"/>
              <quill-editor ref="myTextEditor"
                :options="editorOption"
                v-model="ruleForm.blogContent">
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
      categoryList:[],
      article:'',
      detailHtml:'',
      detailShowModal:false,
      options: {
        // https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js
        target: '/proxy/backend/upload-resource',
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
        blogTitle:'',
        blogSlideimgurl:'',
        categoryIdList:[],
        blogContent:'',
        blogSlide:'0',
        resourceUrlList:[],
        categoryId:''
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
                    this.detailShow(params,params.index)
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
      processStatusShow:false,
      processAddStatus:0,
      processAddStatusShow:true,
      blogShowTitle:'',
      userShowNickname:'',
      blogAddtime:'',
      blogShowContent:'',
      blogShowAddtime:'',
      userHeadimgurl:'',
      pageNum:15,
      current:1,
      pageNow:1,
      totalCount:0,
    }
  },
  created() {
    this.init();
    this.getType();
  },
  methods:{
    init(page){
      var _self = this;
      this.pageNow  = page ? page : this.pageNow;
      var params = {
        keyword:'',
        page:_self.pageNow,
        pageSize:this.pageNum,
        blogSlide:0
      };
      this.$api.get('/proxy/backend/get-blog-list',params,res => {
        //this.list = res.data;
        console.log(res);
        this.totalCount = parseInt(res.data.data.blogCount);
        this.data = res.data.data.blogList;
      });
    },
    getType(){
      this.$api.get('/proxy/backend/get-category-list',{},res => {
        //this.list = res.data;
        //console.log(res.data.data.categoryList);
        let list = [
          {
            id:'1',
            name:'教程'
          },
          {
            id:'2',
            name:'资料'
          }
        ];
        let selList = ['1','2'];

        this.ruleForm.categoryIdList = selList;
        this.categoryList = list;
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
      this.processAddStatusShow = false;
      this.ruleForm.imgUrl = '';
    },
    handleSuccess (res, file) {
      let editor = this.$refs.myTextEditor.quill;
      let _self = this;
      var dataType = res.data.resourceExtension.toLowerCase();
      let url = "";
      if(dataType == 'jpeg' || dataType == 'jpg' || dataType == 'png'){
        if(res.data.resourceUrl.indexOf("http://") != -1 || res.data.resourceUrl.indexOf("https://") != -1){
          url = res.data.resourceUrl;
        }else{
          url = "http://" + res.data.resourceUrl;
        }
        console.log(url);
        _self.processStatusShow = false;
        _self.ruleForm.resourceUrlList.push(url);
        //_self.ruleForm.blogContent += "<img src='"+url+"' style='width: 100% !important;'/>";
        let length = editor.getSelection().index;
        editor.insertEmbed(length, 'image', url);
        // 调整光标到最后
        editor.setSelection(length + 1)
      }

      if(dataType == 'mp4'){
        if(res.data.resourceUrl.indexOf("http://") != -1 || res.data.resourceUrl.indexOf("https://") != -1){
          url = res.data.resourceUrl;
        }else{
          url = "http://" + res.data.resourceUrl;
        }
        _self.processStatusShow = false;
        _self.ruleForm.resourceUrlList.push(url);
        /*_self.ruleForm.blogContent  += '<video class="video-source" width="100%" height="180px"'
                                    + ' src="'+url+'"'
                                    + '>'
                                    + '</video>';*/
        let length = editor.getSelection().index;
        editor.insertEmbed(length, 'video', url);
        // 调整光标到最后
        editor.setSelection(length + 1);
      }
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
      this.ruleForm.blogSlideimgurl = res.data.resourceUrl;
      this.ruleForm.resourceUrlList.push(res.data.resourceUrl);
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
          let article = this.ruleForm.blogContent.replace(/(\<iframe|\<\/iframe)/gi, function ($0, $1) {
            return {
              "<iframe":"<video width='100%' height='180px' style='object-fit: cover;' controls webkit-playsinline='true' playsinline='true' x5-video-player-type='h5' x5-video-orientation='h5' x5-video-player-fullscreen='true' preload='auto' poster='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544675929245&di=082980f0dea86a5cacc47f1e4bea37a7&imgtype=0&src=http%3A%2F%2Fimg.debugrun.com%2Fpic%2F2017%2F10%2F30%2Fc1d115bd74da2a9bffb25c1b48e03dab.png'",
              "</iframe": "</video",
            }[$1];
          });
          //_self.ruleForm.blogContent = article;
          var params = {
            blogTitle:this.ruleForm.blogTitle,
            blogSlide:this.ruleForm.blogSlide,
            blogSlideimgurl:this.ruleForm.blogSlideimgurl,
            blogContent:article,
            resourceUrlList:this.ruleForm.resourceUrlList
          };
          console.log(this.ruleForm);
          this.$api.postQs("/proxy/backend/add-blog", params ,res => {
            this.$Message.success(res.data.desc);
            this.ruleForm = {
              blogTitle:'',
                blogSlideimgurl:'',
                categoryIdList:[],
                blogContent:'',
                blogSlide:'0',
                resourceUrlList:[],
                categoryId:''
            };
            this.drawerModal = false;
            this.init();
          },res=>{
          },{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
        } else {
          this.$Message.error(res.data.desc);
          //console.log(this.ruleForm);
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
    handleAddProgress(res,file,fileList){
      this.processAddStatusShow = true;
      this.processAddStatus = res.percent;
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
    },
    closeModal(status){
      if(status == false){
        this.ruleForm = {
          blogTitle:'',
          blogSlideimgurl:'',
          categoryIdList:[],
          blogContent:'',
          blogSlide:'0',
          resourceUrlList:[],
          categoryId:''
        };
        this.$refs['ruleForm'].resetFields();
      }
    },
    detailShow(params,index){
      var paramsData = {
        blogId: params.row.blogId
      };
      this.detailShowModal = true;
      this.$api.get("/proxy/backend/get-blog-info", paramsData ,res => {
        console.log(res);
        this.blogShowTitle = res.data.data.blogInfo.blogTitle;
        this.userShowNickname = res.data.data.blogInfo.userNickname;
        this.blogShowAddtime = res.data.data.blogInfo.blogAddtime;
        let c1 = res.data.data.blogInfo.blogContent.replace(/<img width="100%"/g, '<img');
        let c2 = res.data.data.blogInfo.blogContent.replace(/<img/g, '<img width="100%"');
        this.blogShowContent = c2;
        this.blogShowAddtime = res.data.data.blogInfo.blogAddtime;
        this.userHeadimgurl = res.data.data.blogInfo.userHeadimgurl;
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

