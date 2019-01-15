<template>
  <section class="container" id="userList">
    <div style="position: relative">
      <Table :columns="columns" :data="data"></Table>
      <Page v-if="totalCount!=0" style="text-align: right" :total="totalCount" :current="current" :page-size="pageNum" @on-change="init($event)" show-total></Page>
    </div>
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
            key: 'blogTitle'
          },
          {
            title: this.$t("data.openid"),
            key: 'userNickname'
          },
          {
            title: this.$t("data.account"),
            key: 'userNickname'
          },
          {
            title: this.$t("data.phone"),
            key: 'userNickname'
          },
          {
            title: this.$t("data.userTopicNum"),
            key: 'userNickname'
          },
          {
            title: this.$t("data.userTopicNum"),
            key: 'userNickname'
          },
          {
            title: this.$t("data.userLikedNum"),
            key: 'userNickname'
          },
          {
            title: this.$t("data.userHeartNum"),
            key: 'userNickname'
          },
          {
            title: this.$t("data.userSharedNum"),
            key: 'userNickname'
          },
          {
            title: this.$t("data.userEyeNum"),
            key: 'userNickname'
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
                }, this.$t("data.topicDisabled")),
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
                }, this.$t("data.update"))*/
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
      addTopic(){

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

