<template>
  <section class="container" id="goodsList">
    <div class="addTopic">
      <Button type="success" @click="addGoods">{{$t("data.addGoods")}}</Button>
    </div>
    <div style="position: relative">
      <Table :columns="columns" :data="data"></Table>
      <Page v-if="totalCount!=0" style="text-align: right" :total="totalCount" :current="current" :page-size="pageNum" @on-change="init($event)" show-total></Page>
    </div>

    <Drawer :title='$t("data.addGoods")' :closable="true" v-model="drawerModal" @on-visible-change="closeModal" width="100%">
      <div style="text-align: center">
        <div style="width: 600px;margin: 0 auto" class="drawer-id">
          <Form :model="ruleForm" ref="ruleForm" :label-width="80">
            <FormItem label="商品名称" prop="goodsName" :rules="$filter_rules({required:true})">
              <Input v-model="ruleForm.goodsName" placeholder="请输入长度不超过20个字符" :maxlength="20"></Input>
            </FormItem>
            <FormItem label="商品型号" prop="goodsType" :rules="$filter_rules({required:true})">
              <Input v-model="ruleForm.goodsType" placeholder="请输入长度不超过20个字符" :maxlength="20"></Input>
            </FormItem>
            <FormItem label="所属板块" prop="goodsBlock" :rules="$filter_rules({required:true})">
              <Select v-model="ruleForm.goodsBlock">
                <Option v-for="(item,index) in blockList" :value="item.moduleId" :key="index">{{item.moduleMaintitle}}</Option>
              </Select>
            </FormItem>
            <FormItem label="原价" prop="goodsOldPrice" :rules="$filter_rules({required:true,type:'float2'})">
              <Input v-model="ruleForm.goodsOldPrice" placeholder="请输入正整数且最多两位小数" :maxlength="20"></Input>
            </FormItem>
            <FormItem label="现价" prop="goodsNowPrice" :rules="$filter_rules({required:true,type:'float2'})">
              <Input v-model="ruleForm.goodsNowPrice" placeholder="请输入正整数且最多两位小数" :maxlength="20"></Input>
            </FormItem>
            <FormItem label="展示图" prop="goodsShowImg" :rules="$filter_rules({required:true})">
              <div style="position: relative;text-align: left;">
                <div v-if="ruleForm.goodsShowImg != ''" class="demo-upload-list" style="position: relative">
                  <img :src="ruleForm.goodsShowImg" alt="">
                </div>
                <div class="demo-upload-list" style="position: relative">
                  <Progress v-if="processStatusShow == true && processStatus < 100" :percent="processStatus" hide-info style="position: absolute;top:0;left:0;z-index:9999;"/>
                  <Upload
                    ref="uploadShow"
                    :show-upload-list="false"
                    :default-file-list="defaultList"
                    :on-success="handleSuccessShow"
                    :format="['jpg','jpeg','png']"
                    :max-size="10240"
                    :on-format-error="handleFormatErrorShow"
                    :on-exceeded-size="handleMaxSizeShow"
                    :on-progress="handleProgressShow"
                    :before-upload="handleBeforeUpload"
                    type="drag"
                    name="file"
                    :data="uploadOtherData"
                    :action="uploadUrl"
                    style="width:58px;height:58px;">
                    <div style="width: 58px;height:56px;line-height: 58px;">
                      <Icon type="ios-camera" size="20"></Icon>
                    </div>
                  </Upload>
                </div>
              </div>
            </FormItem>
            <FormItem label="滚动图" prop="goodsTopScrollImg" :rules="$filter_rules({required:true,type:'array'})">
              <div style="position: relative;text-align: left;">
                <div v-if="ruleForm.goodsTopScrollImg.length > 0" v-for="(item,index) in ruleForm.goodsTopScrollImg" :key="index" class="demo-upload-list" style="position: relative">
                  <!--<img :src="ruleForm.goodsTopScrollImg" alt="">-->
                  <img :src="item" alt="">
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item,'scroll')"></Icon>
                  </div>
                </div>
                <div class="demo-upload-list" style="position: relative">
                  <Progress v-if="processStatusScroll == true && processStatusScroll < 100" :percent="processStatus" hide-info style="position: absolute;top:0;left:0;z-index:9999;"/>
                  <Upload
                    ref="uploadTop"
                    :show-upload-list="false"
                    :default-file-list="defaultList"
                    :on-success="handleSuccessTop"
                    :format="['jpg','jpeg','png']"
                    :max-size="10240"
                    :on-format-error="handleFormatErrorTop"
                    :on-exceeded-size="handleMaxSizeTop"
                    :on-progress="handleProgressTop"
                    :before-upload="handleBeforeUpload"
                    type="drag"
                    name="file"
                    :data="uploadOtherData"
                    :action="uploadUrl"
                    style="width:58px;height:58px;">
                    <div style="width: 58px;height:56px;line-height: 58px;">
                      <Icon type="ios-camera" size="20"></Icon>
                    </div>
                  </Upload>
                </div>
              </div>
            </FormItem>
            <FormItem label="商品描述" prop="goodsDescription" :rules="$filter_rules({required:true})">
              <Input v-model="ruleForm.goodsDescription" type="textarea" placeholder="请输入长度不超过120个字符" :maxlength="120"></Input>
            </FormItem>
            <FormItem label="商品内容" prop="goodsContent" :rules="$filter_rules({required:true,type:'array'})">
              <div style="position: relative;text-align: left;">
                <div v-if="ruleForm.goodsContent.length > 0" v-for="(item,index) in ruleForm.goodsContent" :key="index" class="demo-upload-list" style="position: relative">
                  <img :src="item" alt="">
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item,'centent')"></Icon>
                  </div>
                </div>
                <div class="demo-upload-list" style="position: relative">
                  <Progress v-if="processStatusContent == true && processStatusContent < 100" :percent="processStatus" hide-info style="position: absolute;top:0;left:0;z-index:9999;"/>
                  <Upload
                    ref="uploadContent"
                    :show-upload-list="false"
                    :default-file-list="defaultList"
                    :on-success="handleSuccessContent"
                    :format="['jpg','jpeg','png']"
                    :max-size="10240"
                    :on-format-error="handleFormatErrorContent"
                    :on-exceeded-size="handleMaxSizeContent"
                    :on-progress="handleProgressContent"
                    :before-upload="handleBeforeUpload"
                    type="drag"
                    name="file"
                    :data="uploadOtherData"
                    :action="uploadUrl"
                    style="width:58px;height:58px;">
                    <div style="width: 58px;height:56px;line-height: 58px;">
                      <Icon type="ios-camera" size="20"></Icon>
                    </div>
                  </Upload>
                </div>
              </div>
            </FormItem>
            <FormItem label="置顶" prop="blogSlide" :rules="$filter_rules({required:true})" style="text-align: left">
              <Checkbox v-model="ruleForm.blogSlide" true-value="1" false-value="0" style="position: relative;">置顶到板块</Checkbox>
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
export default {
  data () {
    return {
      drawerModal:false,
      detailContent:'',
      categoryList:[],
      article:'',
      detailHtml:'',
      detailShowModal:false,
      ruleForm:{
        goodsName: '',
        goodsType: '',
        goodsOldPrice: '',
        goodsNowPrice: '',
        goodsTopScrollImg: [],
        goodsShowImg: '',
        goodsContent: [],
        goodsDescription: '',
        goodsBlock: '',
        resourceUrlList: [],
        blogSlide:'0',
        productId:''
      },
      columns: [
        {
          title: this.$t("data.goodsName"),
          key: 'productName'
        },
        {
          title: this.$t("data.topicBlock"),
          render: (h, params) => {
            return h('span', params.row.productModule[0].moduleMaintitle);
          }
        },
        {
          title: this.$t("data.goodsModel"),
          key: 'productModel'
        },
        {
          title: this.$t("data.goodsOldPrice"),
          key: 'productOriginalprice'
        },
        {
          title: this.$t("data.goodsNowPrice"),
          key: 'productPrice'
        },
        {
          title: this.$t("data.goodsShowImg"),
          render: (h, params) => {
            return h('img', {
              style:{
                width:'25px',
                height:'25px',
                marginTop:'5px'
              },
              attrs:{
                src:params.row.productLogo
              }
            });
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
                    this.editGoods(params)
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
      processStatusScroll:0,
      processStatusScrollShow:false,
      processStatusContent:0,
      processStatusContentShow:false,
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
      uploadOtherData:{},
      uploadUrl:'',
      filename:'',
      fileKey:'',
      editStatus:false,
      blockList:[]
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
        page:_self.pageNow,
        pageSize:this.pageNum,
      };
      this.$api.get('/proxy/backend/get-product-list',params,res => {
        //this.list = res.data;
        console.log(res);
        this.totalCount = parseInt(res.data.data.productCount);
        this.data = res.data.data.productList;
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
    addGoods(params){
      this.getPhp();
      this.getBlockList();
      this.drawerModal = true;
      this.processStatusShow = false;
      this.processAddStatusShow = false;
      this.ruleForm.imgUrl = '';
    },
    editGoods(params){
      this.getPhp();
      this.getBlockList();
      console.log(params.row.productModule);
      this.ruleForm = {
          goodsName: params.row.productName,
          goodsType:  params.row.productModel,
          goodsOldPrice:  params.row.productOriginalprice,
          goodsNowPrice:  params.row.productPrice,
          goodsTopScrollImg:  JSON.parse(params.row.productContent).goodsTopScrollImg,
          goodsShowImg:  params.row.productLogo,
          goodsContent:  JSON.parse(params.row.productContent).productContent,
          goodsDescription:  JSON.parse(params.row.productContent).goodsDescription,
          goodsBlock:  ""+params.row.productModule[0].moduleId,
          //resourceUrlList:  params.row.id,
          blogSlide: params.row.productTop,
          productId: params.row.productId,
      },

      this.drawerModal = true;
      this.processStatusShow = false;
      this.processAddStatusShow = false;
      this.ruleForm.imgUrl = '';
    },
    handleSubmit (formName) {
      let _self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _self = this;
          let url = "";
          let arr = [];
          let content = {};
          arr.push(parseInt(this.ruleForm.goodsBlock));
          content = {
            goodsDescription:this.ruleForm.goodsDescription,
            productContent:this.ruleForm.goodsContent,
            goodsTopScrollImg:this.ruleForm.goodsTopScrollImg,
          };

          let paramsData = {
            productId:this.ruleForm.productId,
            productName:this.ruleForm.goodsName,
            productModel:this.ruleForm.goodsType,
            moduleIdList:JSON.stringify(arr),
            productPrice:this.ruleForm.goodsNowPrice,
            productOriginalprice:this.ruleForm.goodsOldPrice,
            productLogo:this.ruleForm.goodsShowImg,
            productContent:JSON.stringify(content),
            productTop:this.ruleForm.blogSlide
          };

          //console.log(this.ruleForm);

          if(this.ruleForm.productId){
            url = "/proxy/backend/edit-product";
          }else{
            url = "/proxy/backend/add-product";
          }

          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.modal_loading = true;

              this.$api.postQs(url, this.$utils.clearData(paramsData) ,res => {
                this.$Message.success(res.data.desc);
                this.modal_loading = false;
                this.init();
                this.drawerModal = false;
              },res=>{
                this.modal_loading = false;
                this.$Message.error(res.data.desc);
              },{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
            }
          });
        }
      });
    },
    //上传展示图
    handleProgressShow(res,file,fileList){
      this.processStatusShow = true;
      this.processStatus = res.percent;
    },
    handleMaxSizeShow (file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 1G.'
      });
    },
    handleSuccessShow (res, file) {
      this.ruleForm.goodsShowImg = res.data.resourceUrl;
      //this.ruleForm.resourceUrlList.push(res.data.resourceUrl);
    },
    handleFormatErrorShow(file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      });
    },
    //上传商品滚动图
    handleProgressTop(res,file,fileList){
      this.processStatusScrollShow = true;
      this.processStatusScroll = res.percent;
    },
    handleMaxSizeTop (file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 1G.'
      });
    },
    handleSuccessTop (res, file) {
      this.ruleForm.goodsTopScrollImg.push(res.data.resourceUrl);
      console.log(this.ruleForm.goodsTopScrollImg);
      //this.ruleForm.resourceUrlList.push(res.data.resourceUrl);
    },
    handleFormatErrorTop(file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      });
    },
    handleProgressTop(res,file,fileList){
      this.processStatusScroll = true;
      this.processStatusScroll = res.percent;
    },
    //上传商品内容图片
    handleProgressContent(res,file,fileList){
      this.processStatusContentShow = true;
      this.processStatusContent = res.percent;
    },
    handleMaxSizeContent (file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 1G.'
      });
    },
    handleSuccessContent (res, file) {
      this.ruleForm.goodsContent.push(res.data.resourceUrl);
      //this.ruleForm.resourceUrlList.push(res.data.resourceUrl);
    },
    handleFormatErrorContent(file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      });
    },
    handleProgressTop(res,file,fileList){
      this.processStatusScroll = true;
      this.processStatusScroll = res.percent;
    },
    closeModal(status){
      if(status == false){
        this.ruleForm = {
          goodsName: '',
          goodsType: '',
          goodsOldPrice: '',
          goodsNowPrice: '',
          goodsTopScrollImg: [],
          goodsShowImg: '',
          goodsContent: [],
          goodsDescription: '',
          goodsBlock: '',
          resourceUrlList: [],
          blogSlide:'0',
          productId:''

      };
        this.$refs['ruleForm'].resetFields();
      }
    },
    getPhp(){
      this.$api.get("/proxy/backend/get-policy", {} ,res => {
        //console.log(res.data.data);
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
          success_action_status: 200,
          //name:'123412341234.png'
        };
        this.uploadUrl = res.data.data.host;
        this.fileKey = res.data.data.dir

      });
    },
    getBlockList(){
      var params = {
        moduleType: 2
      };
      this.$api.get('/proxy/backend/get-module-list',params,res => {
        this.blockList = res.data.data.moduleList;
        //console.log(res.data.data.moduleList);
      });
    },
    handleBeforeUpload(file){
      let key = "";
      //key = this.uploadOtherData.key + file.name;
      this.filename = file.name;
      this.uploadOtherData.key = this.fileKey + file.name;
    },
    deleteOpr(params){
      var _self = this;
      this.$Modal.confirm({
        title: this.$t('lang.delTips'),
        content: "<div class='font-15'>"+ this.$t('lang.delTipsOk') + "</div>",
        onOk: () => {
          var paramsData = {
            productId:params.row.productId
          };
          this.$api.postQs("/proxy/backend/del-product", paramsData ,res => {
            this.$Message.success(res.data.desc);
            this.init();
          },res=>{
            this.$Message.error(res.data.desc);
          },{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
        }
      });
    },
    handleRemove(file,type){
      if(type=="scroll"){
        this.ruleForm.goodsTopScrollImg.splice(this.ruleForm.goodsTopScrollImg.indexOf(file), 1);
      }
      if(type=="centent"){
        this.ruleForm.goodsContent.splice(this.ruleForm.goodsContent.indexOf(file), 1);
      }
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

