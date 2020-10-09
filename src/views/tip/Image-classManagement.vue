<template>
  <div class='Class-Management-bar' v-bar>
    <div class="Class-Management-M">
        <div class="breadCrumb">
          <breadCrumb :breadcrumb="titleBread"/>
        </div>
        <!-- 表格内容 -->
        <div class="infolist">
          <div class="panel right">
            <panelTitle :panelTitleInit="panelTitle.queryTitle">
            </panelTitle>
            <div class="tree-bar" v-bar>
              <el-tree ref='classTree' highlight-current default-expand-all :data="tree.data" :props="tree.defaultProps" class='tree' @node-click="nodeTree" :expand-on-click-node='tree.expandFlag'  node-key='id'></el-tree>
            </div>
          </div>
          <div class="panel">
            <panelTitle :panelTitleInit="panelTitle.listTitle">
              <div>
                <el-button type="primary" size='mini' @click='addClass'>{{$t('vicenter.common.add')}}</el-button>
                <el-button type="primary" size='mini' @click='editClass'>{{$t('vicenter.common.fix')}}</el-button>
                <el-button type="primary" size='mini' @click='getDelete'>{{$t('vicenter.common.delete')}}</el-button>
              </div>
            </panelTitle>
            <div class="form-bar" v-bar>
              <ComForm :searchIpt="inputItem" :searchFunc="queryFn" :formRule='formRule'></ComForm>
            </div>
          </div>
        </div>
        <div class="modal-dialog">
          <Dialog :modalData="modalData">
            <ComForm ref="modalForm" :searchIpt="modalItem" :searchFunc="modalFn" :formRule='modalRule'></ComForm>
          </Dialog>
        </div>
     </div>
  </div>
</template>
<script>
import breadCrumb from '../../components/breadCrumb'
import ComForm from '../../components/form'
import Dialog from '../../components/dialog'
import panelTitle from '../../components/title'
import ajax from '../../api/tip/Image-classification.js'
export default {
  name: 'Assessment-Class-Management',
  data () {
    return {
      titleBread: { // 面包屑导航组件初始化
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Tip/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      tree: {
        model: {},
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        expandFlag: false
      },
      panelTitle: { // title组件数据
        queryTitle: {
          title: this.$t('vicenter.tip.imageClassManagement.imageClassification')
        },
        listTitle: {
          title: this.$t('vicenter.tip.imageClassManagement.imageClassificationInfo')
        }
      },
      inputItem: [
        {
          getLabel: this.$t('vicenter.tip.imageClassManagement.classificationCode'),
          type: 'text',
          models: '',
          disabled: true,
          ruleProp: 'code'
        },
        {
          getLabel: this.$t('vicenter.tip.imageClassManagement.classificationName'),
          type: 'text',
          models: '',
          disabled: true,
          ruleProp: 'name'
        },
        {
          getLabel: this.$t('vicenter.tip.imageClassManagement.classificationDescription'),
          type: 'textarea',
          models: '',
          resize: 'none',
          disabled: true,
          ruleProp: 'describe'
        }
      ],
      queryFn: { // 页面表单查询方法
        query: this.query,
        queryText: this.$t('vicenter.common.fix'),
        resetText: this.$t('vicenter.common.reset')
      },
      formRule: {
        refName: 'queryForm',
        rule: {},
        model: {}
      },
      modalData: {
        title: '',
        flag: false,
        resetModal: this.resetModal
      },
      modalItem: [
        {
          getLabel: this.$t('vicenter.tip.imageClassManagement.classificationCode'),
          type: 'text',
          placeHolder: this.$t('vicenter.tip.imageClassManagement.automaticGeneration'),
          models: '',
          disabled: true,
          ruleProp: 'code'
        },
        {
          getLabel: this.$t('vicenter.tip.imageClassManagement.classificationName'),
          type: 'text',
          placeHolder: this.$t('vicenter.tip.imageClassManagement.inputCategoryNames'),
          models: '',
          ruleProp: 'name'
        },
        {
          getLabel: this.$t('vicenter.tip.imageClassManagement.classificationDescription'),
          type: 'textarea',
          placeHolder: this.$t('vicenter.tip.imageClassManagement.inputCategoryDescription'),
          models: '',
          resize: 'none',
          ruleProp: 'describe'
        }
      ],
      modalFn: { // 页面表单查询方法
        query: this.save,
        close: this.closeModal,
        queryText: this.$t('vicenter.common.save'),
        resetText: this.$t('vicenter.common.cancel')
      },
      modalRule: {
        refName: 'modalQueryForm',
        rule: {
          name: [
            {required: true, message: this.$t('vicenter.tip.imageClassManagement.inputCategoryNames')}
          ],
          describe: [
            {required: true, message: this.$t('vicenter.tip.imageClassManagement.inputCategoryDescription')}
          ]
        },
        model: {
          code: '',
          name: '',
          describe: ''
        }
      },
      apiFlag: true
    }
  },
  created () {
    this.queryListImage()
  },
  methods: {
    queryListImage (id = 0) { // 获取图像类别树
      ajax.queryListImage({isAll: true}).then((res) => {
        if (res.data.flag) {
          this.$treeNode(res.data.result, 'name', 'id', 'code', 'pId')
          this.tree.data = [
            {
              label: this.$t('vicenter.tip.imageClassManagement.imageClassification'),
              id: 0,
              code: 0,
              pid: '',
              children: res.data.result
            }
          ]
          this.$nextTick(function () {
            this.$refs.classTree.setCurrentKey(id)
          })
          this.nodeTree({id: id})
        }
      }).catch(() => {})
    },
    save () { // 页面保存
      let parame = this.modalRule.model
      if (this.modalRule.type === 'add') {
        parame.pid = this.tree.model.id === 0 ? '' : this.tree.model.id
        ajax.addImage(parame).then((res) => {
          if (res.data.flag) {
            this.$NotifSuccess(this.$t('vicenter.common.addSuccess'))
            this.queryListImage(this.tree.model.id)
            this.$data.modalData.flag = false
          }
        }).catch(() => {})
      } else if (this.modalRule.type === 'update') {
        parame.pid = this.tree.model.pid
        parame.id = this.tree.model.id
        ajax.updateImage(parame).then((res) => {
          if (res.data.flag) {
            this.$NotifSuccess(this.$t('vicenter.common.editSuccess'))
            this.queryListImage(this.tree.model.id)
            this.$data.modalData.flag = false
          }
        }).catch(() => {})
      } else {
        this.$data.modalData.flag = false
      }
    },
    getDelete () { // 删除
      const {id} = this.tree.model
      if (id === 0 || id === '' || id === undefined) {
        this.$NotifPrompt(this.$t('vicenter.tip.imageClassManagement.selectCategories'))
        return false
      }
      this.$ConfirmBox(this.$t('vicenter.tip.imageClassManagement.sureDelete'), () => {
        ajax.delImage({id: id}).then((res) => {
          if (res.data.flag) {
            this.tree.model = {}
            for (var i in this.inputItem) {
              this.inputItem[i].models = ''
            }
            this.formRule.model = {}
            this.$NotifSuccess(this.$t('vicenter.common.deleteSuccess'))
            this.queryListImage()
          }
        }).catch(() => {})
      })
    },
    addClass () { // 新增
      if (this.$refs.modalForm) {
        this.$refs.modalForm.reset()
      }
      this.modalData.title = this.$t('vicenter.tip.imageClassManagement.categoryInformationNew')
      this.modalData.flag = true
      this.modalRule.type = 'add'
    },
    editClass () { // 修改
      let currentSelectId = this.tree.model.id
      if (currentSelectId !== 0) {
        if (this.$refs.modalForm) {
          this.$refs.modalForm.reset()
        }
        this.modalData.title = this.$t('vicenter.tip.imageClassManagement.classificationInformationModification')
        this.modalData.flag = true
        this.modalRule.type = 'update'
        ajax.detail({id: currentSelectId}).then((res) => {
          if (res.data.flag) {
            let resData = res.data.result
            this.tree.model.pid = resData.pid
            this.modalItem.forEach(e => {
              e.models = resData[e.ruleProp]
            })
          }
        }).catch(() => {})
      } else if (currentSelectId === 0) {
        this.$NotifPrompt(this.$t('vicenter.tip.imageClassManagement.selectCategories'))
        return false
      }
    },
    nodeTree (data) { // 点击树节点
      this.tree.model = data
      if (data.id !== 0) {
        ajax.detail({id: data.id}).then((res) => {
          if (res.data.flag) {
            for (var i in this.inputItem) {
              this.inputItem[i].models = res.data.result[this.inputItem[i].ruleProp]
            }
          }
        }).catch(() => {})
      } else {
        this.inputItem[0].models = 0
        this.inputItem[1].models = this.$t('vicenter.tip.imageClassManagement.imageClassification')
        this.inputItem[2].models = ''
      }
    },
    resetModal () { // 点×号关闭弹窗并且清空数据
      this.$refs.modalForm.reset()
    },
    closeModal () {
      this.$data.modalData.flag = false
    },
    query () {
      return false
    }
  },
  components: { breadCrumb, ComForm, Dialog, panelTitle }
}
</script>
<style lang="scss">
@import "../../styles/index.scss";
.Class-Management-bar {
  @extend .extend-bar;
  .Class-Management-M {
    padding:$margin;
    @include box-sizing;
    .tree-bar {
      width: $all;
      @media screen and (min-width: 1640px) {
        height: $all;
        overflow: hidden;
      }
    }
    .form-bar {
      width: $all;
      @media screen and (min-width: 1640px) {
        height: $all;
        overflow: hidden;
      }
    }
    .infolist {
      .panel {
        border: #dddddd solid 1px;
        overflow: hidden;
        margin-bottom: $dis10;
        border-radius: 4px;
        @include flex(column, flex-start, flex-start);
        width: $all* .6;
        @media screen and (max-width: 1640px) {
          width: $all;
        }
        .search-form {
          @include layout(3);
          .el-textarea__inner {
            height:200px;
          }
          @media screen and (max-width: 1640px) {
            .el-textarea__inner {
              width: $all * 3.19;
            }
          }
          .search-form-btn {
            display: none;
          }
        }
      }
      .tree {
        width: $all;
      }
      .right {
        width: $all* .4;
        @media screen and (max-width: 1640px) {
          width: $all;
        }
        margin-right: $margin;
      }
    }
    .modal-dialog {
      .search-form {
        @include layout(1);
        justify-content: flex-start!important;
      }
    }
  }
}
</style>
