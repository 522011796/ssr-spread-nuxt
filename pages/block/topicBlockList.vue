<template>
  <section class="container" id="blockList">
    <div class="addTopic">
      <Button type="success" @click="addBlock">{{$t("data.addBlock")}}</Button>
    </div>
    <div style="position: relative">
      <Table :columns="columns" :data="data"></Table>
      <Page v-if="totalCount!=0" style="text-align: right" :total="totalCount" :current="current" :page-size="pageNum" @on-change="init($event)" show-total></Page>
    </div>

    <Modal
      v-model="drawerModal"
      :title="$t('data.addBlock')"
      @on-visible-change="closeModal">

      <Form :model="ruleForm" ref="ruleForm" :label-width="100">
        <FormItem label="板块Logo" prop="blockLogo" :rules="$filter_rules({required:true})">
          <div v-if="ruleForm.blockLogo != ''" class="demo-upload-list" style="position: relative">
            <img :src="ruleForm.blockLogo" alt="">
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
              :before-upload="handleBeforeUpload"
              :on-progress="handleProgressShow"
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
        </FormItem>
        <FormItem label="主标题" prop="blockTitle" :rules="$filter_rules({required:true})">
          <Input v-model="ruleForm.blockTitle" placeholder="请输入长度不超过20的字符" :maxlength="20" class="input-width-350"></Input>
        </FormItem>
        <FormItem label="副标题" prop="blockSubTitle" :rules="$filter_rules({required:true})">
          <Input v-model="ruleForm.blockSubTitle" placeholder="请输入长度不超过30的字符" :maxlength="30" class="input-width-350"></Input>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="success" :loading="modal_loading" @click="handleSubmit('ruleForm')">提交</Button>
        <Button type="default" @click="cancel">取消</Button>
      </div>
    </Modal>
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
          blockLogo:'',
          blockTitle:'',
          blockSubTitle:'',
          resourceUrlList:[]
        },
        columns: [
          {
            title: this.$t("data.blockTitle"),
            key: 'moduleMaintitle'
          },
          {
            title: this.$t("data.blockSubTitle"),
            key: 'moduleSubtitle'
          },
          {
            title: this.$t("data.blockLogo"),
            //key: 'blogAddtime'
            render: (h, params) => {
              return h('img', {
                style:{
                  width:'25px',
                  height:'25px',
                  marginTop:'5px'
                },
                attrs:{
                  src:params.row.moduleLogo
                }
              });
            }
          },
          {
            title: this.$t("data.blockTopicNum"),
            //key: 'blogAddtime'
            render: (h, params) => {
              return h('span', '--');
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
                      this.editBlock(params)
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
        pageNum:15,
        current:1,
        pageNow:1,
        totalCount:0,
        processStatus:0,
        processStatusShow:false,
        modal_loading:false,
        uploadOtherData:{},
        uploadUrl:'',
        filename:'',
        fileKey:'',
        editStatus:false
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
          moduleType: 1
        };
        this.$api.get('/proxy/backend/get-module-list',params,res => {
          //this.list = res.data;
          console.log(res);
          //this.totalCount = parseInt(res.data.data.blogCount);
          this.data = res.data.data.moduleList;
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
      addBlock(){
        this.getPhp();
        this.drawerModal = true;
      },
      editBlock(params){
        this.getPhp();
        console.log(params.row);
        this.ruleForm = {
          blockLogo:params.row.moduleLogo,
          blockTitle:params.row.moduleMaintitle,
          blockSubTitle:params.row.moduleSubtitle,
          //resourceUrlList:params.row.resourceUrlList,
          moduleType:1,
          moduleId:params.row.moduleId
        };
        console.log(this.ruleForm);
        this.editStatus = true;
        this.drawerModal = true;
      },
      deleteOpr(params){
        var _self = this;
        this.$Modal.confirm({
          title: this.$t('lang.delTips'),
          content: "<div class='font-15'>"+ this.$t('lang.delTipsOk') + "</div>",
          onOk: () => {
            var paramsData = {
              moduleId:params.row.moduleId
            };
            this.$api.postQs("/proxy/backend/del-module", paramsData ,res => {
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
            blockLogo:'',
            blockTitle:'',
            blockSubTitle:'',
            resourceUrlList:[],
            moduleId:''
          };
          this.editStatus = false;
          this.$refs['ruleForm'].resetFields();
        }
      },//上传展示图
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
        this.ruleForm.blockLogo = res.data.resourceUrl;
        //this.ruleForm.resourceUrlList.push(res.data.resourceUrl);
      },
      handleFormatErrorShow(file) {
        this.$Notice.warning({
          title: 'The file format is incorrect',
          desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
        });
      },
      handleSubmit (formName) {
        let _self = this;
        let url = "";
        let paramsData = {
          moduleId:this.ruleForm.moduleId,
          moduleType:1,
          moduleLogo:this.ruleForm.blockLogo,
          moduleMaintitle:this.ruleForm.blockTitle,
          moduleSubtitle:this.ruleForm.blockSubTitle,
        };

        console.log(this.ruleForm.moduleId);

        if(this.ruleForm.moduleId){
          url = "/proxy/backend/edit-module";
        }else{
          url = "/proxy/backend/add-module";
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
      },
      cancel(){
        this.editStatus = false;
        this.drawerModal = false;
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
      handleBeforeUpload(file){
        let key = "";
        //key = this.uploadOtherData.key + file.name;
        this.filename = file.name;
        this.uploadOtherData.key = this.fileKey + file.name;
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
  .input-width-350{
    width: 350px;
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

