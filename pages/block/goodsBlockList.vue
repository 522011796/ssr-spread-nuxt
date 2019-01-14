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
        <FormItem label="板块背景图" prop="blockLogo" :rules="$filter_rules({required:true})">
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
              :on-progress="handleProgressShow"
              type="drag"
              name="resource"
              action="/proxy/backend/upload-resource"
              style="width:58px;height:58px;">
              <div style="width: 58px;height:56px;line-height: 58px;">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
          </div>
        </FormItem>
        <FormItem label="板块名称" prop="blockTitle" :rules="$filter_rules({required:true})">
          <Input v-model="ruleForm.blockTitle" placeholder="请输入长度不超过20的字符" :maxlength="20" class="input-width-350"></Input>
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
            title: this.$t("data.blockName"),
            key: 'blogTitle'
          },
          {
            title: this.$t("data.blockBgImg"),
            key: 'blogAddtime'
          },
          {
            title: this.$t("data.tipicOpr"),
            width:150,
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
        modal_loading:false
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
      addBlock(){
        this.drawerModal = true;
      },
      closeModal(status){
        if(status == false){
          this.ruleForm = {
            blockLogo:'',
            blockTitle:'',
            blockSubTitle:'',
            resourceUrlList:[]
          };
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
        this.ruleForm.resourceUrlList.push(res.data.resourceUrl);
      },
      handleFormatErrorShow(file) {
        this.$Notice.warning({
          title: 'The file format is incorrect',
          desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
        });
      },
      handleSubmit (formName) {
        let _self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.modal_loading = true;
            console.log(this.ruleForm);
            this.modal_loading = false;
          }
        });
      },
      cancel(){
        this.drawerModal = false;
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

