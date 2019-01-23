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
          :max-size="1048576"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :on-progress="handleAddProgress"
          :before-upload="handleBeforeUpload"
          type="drag"
          :data="uploadOtherData"
          name="file"
          :action="uploadUrl"
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
              <Input v-model="ruleForm.blogTitle" placeholder="请输入长度不超过120的字符" :maxlength="120"></Input>
            </FormItem>
            <FormItem label="所属板块" prop="blogBlock" :rules="$filter_rules({required:true})">
              <Select v-model="ruleForm.blogBlock">
                <Option v-for="(item,index) in blockList" :value="item.moduleId" :key="index">{{item.moduleMaintitle}}</Option>
              </Select>
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
                    :max-size="1048576"
                    :on-format-error="handleFormatErrorTop"
                    :on-exceeded-size="handleMaxSizeTop"
                    :on-progress="handleProgress"
                    :before-upload="handleBeforeUploadTop"
                    type="drag"
                    :data="uploadOtherData"
                    name="file"
                    :action="uploadUrl"
                    style="width:58px;height:58px;">
                    <div style="width: 58px;height:56px;line-height: 58px;">
                      <Icon type="ios-camera" size="20"></Icon>
                    </div>
                  </Upload>
                </div>
                <!--<Checkbox v-model="ruleForm.blogSlide" true-value="1" false-value="0" style="position: relative;bottom:25px;">推荐滚动幻灯片</Checkbox>-->
              </div>
            </FormItem>
            <FormItem label="推荐列表" style="text-align: left">
              <Checkbox v-model="ruleForm.blogSlide" true-value="1" false-value="0">推荐滚动幻灯片</Checkbox>
              <Checkbox v-model="ruleForm.blogTop" true-value="1" false-value="0">推荐列表置顶</Checkbox>
            </FormItem>
            <FormItem id="findForm" label="发现" style="margin-bottom: 24px !important;">
              <Checkbox v-model="singleBox" @on-change="changeFindBox" true-value="1" false-value="0" style="float: left">放置到发现列表</Checkbox>
              <Checkbox v-model="ruleForm.blogFindtop" true-value="1" false-value="0" :disabled="singleBox==false" style="float: left">置顶到发现列表</Checkbox>
              <Checkbox v-model="ruleForm.blogFindslide" true-value="1" false-value="0" :disabled="singleBox==false" style="float: left">置顶到发现幻灯片</Checkbox>

              <div style="text-align: left;height: 24px;line-height: 24px;color: #ed4014;">{{errorFindBox}}</div>
            </FormItem>
            <FormItem label="分类" prop="categoryIdList" :rules="$filter_rules({required:true})">
              <Select v-model="ruleForm.categoryIdList">
                <Option v-for="(item,index) in typeList" :value="item.categoryId" :key="index">{{item.categoryName}}</Option>
                <!--<Option value="1">讨论</Option>
                <Option value="2">新闻</Option>
                <Option value="3">分享</Option>
                <Option value="4">求助</Option>
                <Option value="5">原创</Option>
                <Option value="6">转载</Option>
                <Option value="7">教程</Option>
                <Option value="8">开箱评测</Option>-->
              </Select>
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
          <div style="display: none" id="htmlDetailShow" ref="htmlDetailShow" v-html="htmlDetailShow"></div>
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
  /*[{ 'list': 'ordered'}, { 'list': 'bullet' }],*/
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
      htmlDetailShow:'',
      uploadUrl:'',
      uploadOtherData:{},
      errorFindBox:'',
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
                  //console.log(11);
                  document.querySelector('#uploadBtn').click();
                } else {
                  this.quill.format('image', false);
                }
              }
            }
          }
        }
      },
      singleBox:0,
      ruleForm:{
        blogId:'',
        blogTitle:'',
        blogSlideimgurl:'',
        categoryIdList:[],
        blogContent:'',
        blogSlide:0,
        resourceUrlList:[],
        categoryId:'',
        findBlogSlide:[],
        blogBlock:'',
        blogTop:0,
        blogFindslide:0,
        blogFindtop:0,
        blogFind:0
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
          title: this.$t("data.topicType"),
          //key: 'userNickname'
          render: (h, params) => {
            return h('div', [
              h('span', {

              },params.row.blogCategory[0].categoryName)
            ])
          }
        },
        {
          title: this.$t("data.tipicSendTime"),
          render: (h, params) => {
            return h('div', [
              h('span', {

              },params.row.blogModule[0].moduleMaintitle)
            ])
          }
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
          title: this.$t("data.tipicLikeNum"),
          //key: 'blogPv'
          render: (h, params) => {
            return h('div', [
              h('span', {

              },params.row.blogLike ? params.row.blogLike : 0)
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
                    this.deleteOpr(params)
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
              /*h('a', {
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
              }, this.$t("data.topicTop"))*/
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
                    this.editTopic(params)
                  }
                }
              }, this.$t("data.update"))
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
      blockList:'',
      blogTop:'',
      typeList:[],
      filename:'',
      fileKey:'',
    }
  },
  watch: {
    ruleForm: {
      handler(newValue, oldValue) {
        let article = newValue.blogContent.replace(/(\<iframe|\<\/iframe)/gi, function ($0, $1) {
          return {
            "<iframe":"<p><video width='100%' height='180px' style='object-fit: cover;' controls webkit-playsinline='true' playsinline='true' x5-video-player-type='h5' x5-video-orientation='h5' x5-video-player-fullscreen='true' preload='auto' poster='https://bbs.9451.com/proxy/img/video.jpg'",
            "</iframe": "</video></p",
          }[$1];
        });

        this.htmlDetailShow = article;
      },
      deep: true
    }
  },
  created() {
    this.init();
  },
  methods:{
    init(page){
      var _self = this;
      this.pageNow  = page ? page : this.pageNow;
      var params = {
        keyword:'',
        page:_self.pageNow,
        pageSize:this.pageNum,
        //blogSlide:0
      };
      this.$api.get('/proxy/backend/get-blog-list',this.$utils.clearData(params),res => {
        //this.list = res.data;
        //console.log(res);
        this.totalCount = parseInt(res.data.data.blogCount);
        this.data = res.data.data.blogList;
      });
    },
    addTopic(){
      this.getPhp();
      this.getBlockList();
      this.getType();
      this.drawerModal = true;
      this.processStatusShow = false;
      this.processAddStatusShow = false;
      this.ruleForm.imgUrl = '';
    },
    editTopic(params){
      this.getPhp();
      this.getBlockList();
      this.getType();
      //console.log(JSON.parse(params.row.blogText));
      let text = JSON.parse(params.row.blogText);
      let content = "";
      for(var i=0;i<text.length;i++){
        //console.log(text[i].data);
        if(text[i].type == "text"){
          content += "<p>"+ text[i].data +"</p>";
        }
        if(text[i].type == "img"){
          content += "<p>"+ "<img src='"+text[i].data+"'/>" +"</p>";
        }
        if(text[i].type == "video"){
          content += "<p>"+ "<iframe style='width: 100% !important;' src='"+text[i].data+"'></iframe>" +"</p>";
        }
      }

      //console.log(content);

      this.ruleForm = {
          blogId:params.row.blogId,
          blogTitle:params.row.blogTitle,
          blogSlideimgurl:params.row.blogSlideimgurl,
          categoryIdList:params.row.blogCategory[0].categoryId,
          blogContent:content,
          blogSlide:params.row.blogSlide,
          resourceUrlList:params.row.resourceUrlList,
          categoryId:params.row.blogCategory[0].categoryId,
          findBlogSlide:params.row.blogFindSlide,
          blogBlock:params.row.blogModule[0].moduleId,
          blogTop:params.row.blogTop,
          blogFindslide:params.row.blogFindSlide,
          blogFindtop:params.row.blogFindtop,
          blogFind:params.row.blogFind,
          resourceUrlList:[]
      };
      //console.log(this.ruleForm);
      this.singleBox = params.row.blogFind;
      this.drawerModal = true;
      this.processStatusShow = false;
      this.processAddStatusShow = false;
      this.ruleForm.imgUrl = '';
    },
    handleSuccess (res, file) {
      let editor = this.$refs.myTextEditor.quill;
      let _self = this;
      //console.log(res.data);
      var dataType = res.data.resourceContenttype.toLowerCase();
      let url = "";
      if(dataType == 'image/jpeg' || dataType == 'image/jpg' || dataType == 'image/png'){
        url = res.data.resourceUrl;
        //console.log(url);
        _self.processStatusShow = false;
        _self.ruleForm.resourceUrlList.push(url);
        //_self.ruleForm.blogContent += "<img src='"+url+"' style='width: 100% !important;'/>";
        let length = editor.getSelection().index;
        editor.insertEmbed(length, 'image', url);
        // 调整光标到最后
        editor.setSelection(length + 1)
      }

      if(dataType == 'video/mp4'){
        url = res.data.resourceUrl;
        //console.log(url);
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
    handleBeforeUploadTop(file){
      let key = "";
      //key = this.uploadOtherData.key + file.name;
      this.filename = file.name;
      this.uploadOtherData.key = this.fileKey + file.name;
      //console.log(this.uploadOtherData.key);
    },
    handleBeforeUpload(file){
      let key = "";
      //key = this.uploadOtherData.key + file.name;
      this.filename = file.name;
      this.uploadOtherData.key = this.fileKey + file.name;
      //console.log(this.uploadOtherData.key);
    },
    handleSubmit (name) {
      //console.log(1111111);
      this.errorFindBox = "";
      /*if(this.singleBox == true && this.ruleForm.findBlogSlide.length == 0){
        this.errorFindBox = "请选择至少一个选项";
        return;
      }*/
      this.$refs[name].validate((valid) => {
        if (valid) {
          //this.$Message.success('Success!');
          //console.log(2222);
          let article = this.ruleForm.blogContent.replace(/(\<iframe|\<\/iframe)/gi, function ($0, $1) {
            return {
              "<iframe":"<p><video width='100%' height='180px' style='object-fit: cover;' controls webkit-playsinline='true' playsinline='true' x5-video-player-type='h5' x5-video-orientation='h5' x5-video-player-fullscreen='true' preload='auto' poster='https://bbs.9451.com/proxy/img/video.jpg'",
              "</iframe": "</video></p",
            }[$1];
          });
          //console.log(33333);
          let subDataHtml = {};
          let subDataArr = [];

          let countP = document.querySelector("#htmlDetailShow").querySelectorAll("p");
          //console.log(article);
          for(var i =0;i<countP.length;i++){
            //console.log(document.querySelector("#htmlDetailShow").querySelectorAll("p")[i].querySelector("video"));
            if(document.querySelector("#htmlDetailShow").querySelectorAll("p")[i].querySelector("img")){
              //console.log(document.querySelector("#htmlDetailShow").querySelectorAll("p")[i].querySelectorAll("[src]")[0].currentSrc);
              subDataArr.push(
                {
                  type: "img",
                  data: document.querySelector("#htmlDetailShow").querySelectorAll("p")[i].querySelectorAll("[src]")[0].currentSrc
                }
              );
            }else if(document.querySelector("#htmlDetailShow").querySelectorAll("p")[i].querySelector("video")){
              //console.log(document.querySelector("#htmlDetailShow").querySelectorAll("p")[i].querySelector("video").currentSrc);
              subDataArr.push(
                {
                  type: "video",
                  data: document.querySelector("#htmlDetailShow").querySelectorAll("p")[i].querySelector("video").currentSrc
                }
              );
            }else{
              //console.log(document.querySelector("#htmlDetailShow").querySelectorAll("p")[i].innerText);
              if(document.querySelector("#htmlDetailShow").querySelectorAll("p")[i].innerText.indexOf("\n") != -1){
                console.log("\n");
                subDataArr.push(
                  {
                    type: "text",
                    data: "\n"
                  }
                );
              }else{
                subDataArr.push(
                  {
                    type: "text",
                    data: document.querySelector("#htmlDetailShow").querySelectorAll("p")[i].innerText
                  }
                );
              }
            }
          }
          let url = "";
          if(this.ruleForm.blogId){
            url = "/proxy/backend/edit-blog";
          }else{
            url = "/proxy/backend/add-blog";
          }
          //console.log(55555);
          let typeArr = [];
          let blockArr = [];
          typeArr.push(this.ruleForm.categoryIdList);
          blockArr.push(this.ruleForm.blogBlock);
          //_self.ruleForm.blogContent = article;
          var params = {
            blogId:this.ruleForm.blogId,
            blogTitle:this.ruleForm.blogTitle,
            categoryIdList:JSON.stringify(typeArr),
            moduleIdList:JSON.stringify(blockArr),
            blogSlide:this.ruleForm.blogSlide,
            blogSlideimgurl:this.ruleForm.blogSlideimgurl,
            blogTop:this.ruleForm.blogTop,
            blogFindslide:this.ruleForm.blogFindslide,
            blogFind:this.singleBox,
            blogFindtop:this.ruleForm.blogFindtop,
            blogText:JSON.stringify(subDataArr),
            blogContent:article,
            resourceUrlList:this.ruleForm.resourceUrlList,
          };
          //console.log(subDataArr);
          this.$api.postQs(url, this.$utils.clearData(params) ,res => {
            this.$Message.success(res.data.desc);
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
    getPhp(){
      this.$api.get("/proxy/backend/get-policy", {} ,res => {
        if(this.filename!=""){
          this.filename = this.filename
        }
        this.uploadOtherData = {
          policy: res.data.data.policy,
          callback: res.data.data.callback,
          key: res.data.data.dir,
          OSSAccessKeyId: res.data.data.accessid,
          signature: res.data.data.signature,
          expire: res.data.data.expire,
          success_action_status: 200
        };
        this.uploadUrl = res.data.data.host;
        this.fileKey = res.data.data.dir;

      });
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    },
    handleBeforeAdd(file){

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
          blogId:'',
          blogTitle:'',
          blogSlideimgurl:'',
          categoryIdList:[],
          blogContent:'',
          blogSlide:"0",
          resourceUrlList:[],
          categoryId:'',
          findBlogSlide:[],
          blogBlock:'',
          blogTop:"0",
          blogFindslide:"0",
          blogFindtop:"0",
          blogFind:"0"
        };
        //console.log(this.ruleForm);
        this.typeList = [];
        this.singleBox = "0";
        this.$refs['ruleForm'].resetFields();
      }
    },
    detailShow(params,index){
      var paramsData = {
        blogId: params.row.blogId
      };
      this.detailShowModal = true;
      this.$api.get("/proxy/backend/get-blog-info", paramsData ,res => {
        //console.log(res);
        this.blogShowTitle = res.data.data.blogInfo.blogTitle;
        this.userShowNickname = res.data.data.blogInfo.userNickname;
        this.blogShowAddtime = res.data.data.blogInfo.blogAddtime;
        let c1 = res.data.data.blogInfo.blogContent.replace(/<img width="100%"/g, '<img');
        let c2 = res.data.data.blogInfo.blogContent.replace(/<img/g, '<img style="max-width:100%;"');
        this.blogShowContent = c2;
        this.blogShowAddtime = res.data.data.blogInfo.blogAddtime;
        this.userHeadimgurl = res.data.data.blogInfo.userHeadimgurl;
      });
    },
    changeFindBox(status){
      if(!status){
        this.errorFindBox = "";
        this.ruleForm.findBlogSlide = [];
      }
    },
    getBlockList(){
      var params = {
        moduleType: 1
      };
      this.$api.get('/proxy/backend/get-module-list',params,res => {
        this.blockList = res.data.data.moduleList;
        //console.log(res.data.data.moduleList);
      });
    },
    getType(){
      this.$api.get('/proxy/backend/get-category-list',{},res => {
        this.typeList = res.data.data.categoryList;
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

