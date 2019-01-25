<template>
  <section class="container" id="userList">
    <div style="position: relative">
      <Table :columns="columns" :data="userList"></Table>
      <Page v-if="totalCount!=0" style="text-align: right" :total="totalCount" :current="current" :page-size="pageNum" @on-change="init($event)" show-total></Page>
    </div>

    <Modal
      v-model="drawerModal"
      :title="$t('data.setAdmin')"
      @on-visible-change="closeModal">

      <Form :model="ruleForm" ref="ruleForm" :label-width="100">
        <FormItem label="管理员密码" prop="password" :rules="$filter_rules({required:true})">
          <Input v-model="ruleForm.password" type="password" placeholder="请输入长度不超过20的字符" :maxlength="20" class="input-width-350"></Input>
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
        modal_loading:false,
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
            title: this.$t("data.realName"),
            key: 'userNickname'
          },
          {
            title: this.$t("data.openid"),
            key: 'userOpenid'
          },
          {
            title: 'Ukey',
            key: 'userKey'
          },
          {
            title: this.$t("data.phone"),
            key: 'userPhone'
          },
          {
            title: this.$t("data.adminStatus"),
            //key: 'userPhone'
            render: (h, params) => {
              if(params.row.userType == 1){
                return h('span',{style:{color:'#19be6b'}}, 'yes');
              }else{
                return h('span', 'no');
              }
            }
          },
          {
            title: this.$t("data.userTopicNum"),
            render: (h, params) => {
              return h('span', '--');
            }
          },
          {
            title: this.$t("data.userLikedNum"),
            render: (h, params) => {
              return h('span', '--');
            }
          },
          {
            title: this.$t("data.userSharedNum"),
            render: (h, params) => {
              return h('span', '--');
            }
          },
          {
            title: this.$t("data.userEyeNum"),
            render: (h, params) => {
              return h('span', '--');
            }
          },
          {
            title: this.$t("data.tipicOpr"),
            render: (h, params) => {
              if(params.row.userStatus == 1){
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px',
                      marginTop:'5px',
                      marginBottom:'5px',
                      color:'#ffffff'
                    },
                    on: {
                      click: () => {
                        this.disabledOpr(params,0)
                      }
                    }
                  }, this.$t("data.enabled")),

                  h('Button', {
                    props: {
                      type: 'info',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px',
                      marginBottom:'5px',
                      color:'#ffffff'
                    },
                    on: {
                      click: () => {
                        this.setAdmin(params)
                      }
                    }
                  }, this.$t("data.setAdmin")),

                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px',
                      marginBottom:'5px',
                      color:'#ffffff'
                    },
                    on: {
                      click: () => {
                        this.cancelAdmin(params)
                      }
                    }
                  }, this.$t("data.cancelAdmin"))
                ]);
              }else{
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px',
                      marginTop:'5px',
                      marginBottom:'5px',
                      color:'#ffffff'
                    },
                    on: {
                      click: () => {
                        this.disabledOpr(params,1)
                      }
                    }
                  }, this.$t("data.topicDisabled")),

                  h('Button', {
                    props: {
                      type: 'info',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px',
                      marginBottom:'5px',
                      color:'#ffffff'
                    },
                    on: {
                      click: () => {
                        this.setAdmin(params)
                      }
                    }
                  }, this.$t("data.setAdmin")),

                  h('Button', {
                    props: {
                      type: 'info',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px',
                      marginBottom:'5px',
                      color:'#ffffff'
                    },
                    on: {
                      click: () => {
                        this.cancelAdmin(params)
                      }
                    }
                  }, this.$t("data.cancelAdmin"))
                ]);
              }
            }
          }
        ],
        userList: [],
        pageNum:15,
        current:1,
        pageNow:1,
        totalCount:0,
        ruleForm:{
          password:'',
          userKey:'',
          userType:''
        }
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
          page:_self.pageNow,
          pageSize:this.pageNum
        };
        this.$api.get('/proxy/backend/get-user-list',params,res => {
          //this.list = res.data;
          console.log(res);
          this.totalCount = parseInt(res.data.data.userCount);
          this.userList = res.data.data.userList;
        });
      },
      setAdmin(params){
        this.drawerModal = true;
        this.ruleForm.userKey = params.row.userKey;
      },
      disabledOpr(params,status){
        var paramsData = {
          userKey : params.row.userKey,
          userStatus: status
        };
        this.$api.postQs('/proxy/backend/set-user-status', this.$utils.clearData(paramsData) ,res => {
          this.$Message.success(res.data.desc);
          this.modal_loading = false;
          this.init(this.pageNow);
          this.drawerModal = false;
        },res=>{
          this.modal_loading = false;
          this.$Message.error(res.data.desc);
        },{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
      },
      closeModal(status){
        if(status == false){
          this.ruleForm = {
            password:'',
            userType:'',
            userPassword:''
          };
          this.drawerModal = false;
          this.$refs['ruleForm'].resetFields();
        }
      },
      handleSubmit (formName) {
        let _self = this;
        let url = "";
        let paramsData = {
          userPassword:this.ruleForm.password,
          userKey:this.ruleForm.userKey,
          userType:1
        };

        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.modal_loading = true;

            this.$api.postQs('/proxy/backend/set-user-type', this.$utils.clearData(paramsData) ,res => {
              this.$Message.success(res.data.desc);
              this.modal_loading = false;
              this.init(this.pageNow);
              this.drawerModal = false;
            },res=>{
              this.modal_loading = false;
              this.$Message.error(res.data.desc);
            },{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
          }
        });
      },
      cancelAdmin(params){
        let paramsData = {
          userKey:params.row.userKey,
          userType:0
        };

        this.modal_loading = true;

        this.$api.postQs('/proxy/backend/set-user-type', this.$utils.clearData(paramsData) ,res => {
          this.$Message.success(res.data.desc);
          this.modal_loading = false;
          this.init(this.pageNow);
          this.drawerModal = false;
        },res=>{
          this.modal_loading = false;
          this.$Message.error(res.data.desc);
        },{"Content-Type":'application/x-www-form-urlencoded; charset=UTF-8'});
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

