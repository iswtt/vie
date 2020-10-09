<template>
  <div class='dictionary-manage' v-bar>
    <div class="dictionary-setting">
      <div class="breadCrumb">
        <breadCrumb :breadcrumb="titleBread" />
      </div>
      <div class="infolist">
        <div class="panel panel-Q">
          <panelTitle :panelTitleInit="panelTitle.treeTitle"></panelTitle>
          <el-tree ref='vuetree' node-key="id" :expand-on-click-node='falseflag' highlight-current default-expand-all style='width:100%' :data="treeData" :props="defaultProps" @node-click="handleNodeClick">
            <div class="custom-tree-node" :data-id="'dictionaryTreeItem'+node.id+'-div'"  slot-scope="{ node, data }">
              {{ node.label }}
            </div>
          </el-tree>
        </div>
        <div class="panel panel-L ">
          <panelTitle :panelTitleInit="panelTitle.listTitle ">
            <el-button v-if="exportButton" type="primary" size="mini" data-id="export-btn" @click='exportExcel'>{{$t('vicenter.common.export', {msg: 'EXCEL'})}}</el-button>
            <div v-show="isEdit">
              <el-button type="danger" size="mini" data-id="deleteAll-btn" @click='deleteDictionary'>{{$t('vicenter.common.deleteAll')}}</el-button>
              <el-button type="primary" size="mini" data-id="add-btn" @click='addDictionary'>{{$t('vicenter.common.add')}}</el-button>
            </div>
          </panelTitle>
          <ComForm :searchIpt="inputItem" :searchFunc="queryFn" :formRule='formRule'></ComForm>
          <div class="form-bar" v-bar>
            <ComTable @listenToSelectDataEvent='selectRow' :tableData='tableData' :tableGroup='tableGroup'></ComTable>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-dialog">
      <Dialog :modalData="modalData">
        <ComForm ref="modalForm" :searchIpt="modalItem" :searchFunc="modalFn" :formRule='modalRule'></ComForm>
      </Dialog>
      <Dialog :modalData="detailData">
        <el-form class="search-form">
          <el-form-item class='search-form-item' v-for='(item,key) in detailItem' :key='key' :prop='item.key'>
            <label class="search-form-label el-form-item__label">{{item.label}}</label>
            <el-input v-model="item.value" class="search-form-input" :disabled="true" v-if="item.ruleProp !== 'remark'"></el-input>
            <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 5}" v-model="item.value" disabled v-if="item.ruleProp === 'remark'"></el-input>
          </el-form-item>
          <el-form-item class="search-form-btn">
            <el-button  size="large" data-id="closeModal-btn" @click="this.closeDetailModal">{{this.$t('vicenter.common.close')}}</el-button>
          </el-form-item>
        </el-form>
      </Dialog>
    </div>
  </div>
</template>
<script>
import breadCrumb from '@/components/breadCrumb.vue'
import panelTitle from '@/components/title.vue'
import ComTable from '@/components/table.vue'
import ComForm from '@/components/form.vue'
import Dialog from '@/components/dialog.vue'
import ajax from '@/api/background/dictionary.js'
import $axios from '@/components/axios.js'
export default {
  data () {
    return {
      exportButton: false,
      falseflag: false,
      isEdit: false, // 判断字典类型是否可编辑
      selRowId: '',
      selRowKey: '',
      nowTypeCode: '',
      nowOpration: '',
      modalRule: { // 弹窗表单验证和存放数据 model=> post到后台的数据
        refName: 'modalQueryForm',
        rule: {
          dicCode: [ // 序列号校验
            { required: true, message: this.$t('vicenter.Background.dictionary.codeRequired'), trigger: 'blur' },
            // { min: 1, max: 10, message: this.$t('vicenter.Background.dictionary.codeLength'), trigger: 'blur' },
            { pattern: /^[a-zA-Z0-9_]+$/, message: this.$t('vicenter.common.verifyRules.onlyLDU'), trigger: 'blur' }
          ],
          dicName: [
            { required: true, message: this.$t('vicenter.Background.dictionary.nameRequired'), trigger: 'blur' }
            // { min: 1, max: 100, message: this.$t('vicenter.Background.dictionary.nameLength'), trigger: 'blur' }
          ],
          remark: [
            // { required: true, message: this.$t('vicenter.Background.dictionary.remarkRequired'), trigger: 'blur' },
            // { min: 1, max: 500, message: this.$t('vicenter.common.limitRemarksLength'), trigger: 'blur' }
          ]
        },
        model: {
          dicCode: '',
          dicName: '',
          remark: ''
        }
      },
      modalFn: { // 弹窗表单确定方法
        query: this.sure,
        close: this.closeModal,
        queryText: this.$t('vicenter.common.submit'),
        resetText: this.$t('vicenter.common.cancel')
      },
      modalItem: [ // 文本搜索条件 models为显示的数据
        {
          getLabel: this.$t('vicenter.Background.dictionary.dictionaryCoding'),
          type: 'text',
          disabled: false,
          models: '',
          ruleProp: 'dicCode',
          maxlength: 10
        },
        {
          getLabel: this.$t('vicenter.Background.dictionary.dictionaryName'),
          type: 'text',
          disabled: false,
          models: '',
          ruleProp: 'dicName',
          maxlength: 30
        },
        {
          getLabel: this.$t('vicenter.Background.dictionary.remarks'),
          disabled: false,
          type: 'textarea',
          models: '',
          ruleProp: 'remark',
          autoSize: 5,
          maxlength: 500
        }
      ],
      detailItem: [
        {
          label: this.$t('vicenter.Background.dictionary.dictionaryCoding'),
          value: '',
          ruleProp: 'dicCode'
        },
        {
          label: this.$t('vicenter.Background.dictionary.dictionaryName'),
          value: '',
          ruleProp: 'dicName'
        },
        {
          label: this.$t('vicenter.Background.dictionary.remarks'),
          value: '',
          ruleProp: 'remark'
        }
      ],
      modalData: {
        title: '',
        flag: false,
        resetModal: this.resetModal
      },
      detailData: {
        title: '',
        flag: false
      },
      queryFn: { // 页面表单查询方法
        query: this.query,
        queryText: this.$t('vicenter.common.query'),
        resetText: this.$t('vicenter.common.reset')
      },
      inputItem: [ // 文本搜索条件 models为显示的数据
        {
          getLabel: this.$t('vicenter.Background.dictionary.dictionaryCoding'),
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          // placeHolder: this.$t('vicenter.Background.dictionary.inputCodeorname'),
          placeHolder: this.$t('vicenter.Background.dictionary.codeRequired'),
          models: '', // 输入框的值
          ruleProp: 'dicCodeOrName'
        }
      ],
      formRule: { // 表单验证和存放数据 model=> post到后台的数据
        refName: 'modalQueryForm',
        rule: {
          dicCodeOrName: [
            { pattern: /^[a-zA-Z0-9_]+$/, message: this.$t('vicenter.common.verifyRules.onlyLDU'), trigger: 'change' }
          ],
          confValue: [ // 序列号校验
            // { required: true, message: '请输入', trigger: 'blur' }
          ]},
        model: { // 传到后台的数据
          dicCodeOrName: ''
        }
      },
      tableData: { // 表单模拟数据
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        refName: 'multipleTable',
        sortMethod: '',
        page: {
          CurrentPage: 0,
          pagesize: 10,
          handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
          handleCurrentChange: this.handleCurrentChange, // 当前页码改变触发改函数
          Allpage: 0
        }
      },
      tableGroup: [ // 表格数据列
        // {
        //   type: 'index'
        // },
        {
          type: 'selection'
        },
        {
          label: this.$t('vicenter.Background.dictionary.dictionaryCoding'),
          type: 'text',
          model: 'dicCode'
        },
        {
          label: this.$t('vicenter.Background.dictionary.dictionaryName'),
          type: 'text',
          model: 'dicName'
        },
        {
          label: this.$t('vicenter.Background.dictionary.remarks'),
          type: 'text',
          model: 'remark'
        },
        // {
        //   label: this.$t('vicenter.Background.dictionary.sortOrder'),
        //   type: 'text',
        //   model: 'sortOrder'
        // },
        {
          label: this.$t('vicenter.common.operation'),
          type: 'operation',
          width: '150px',
          model: 'operation',
          fixed: 'right'
        }
      ],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      titleBread: { // 面包屑导航组件初始化
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Background/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      },
      panelTitle: { // title组件数据
        listTitle: {
          title: this.$t('vicenter.common.list')
        },
        treeTitle: {
          title: this.$t('vicenter.Background.dictionary.dictionaryType')
        }
      }
    }
  },
  methods: {
    deleteDictionary () {
      let data = {}
      data.id = this.$data.selRowId
      data.nameI18nKey = this.$data.selRowKey
      if (data.id) {
        this.$ConfirmBox(this.$t('vicenter.Background.dictionary.sureDeletedata'), () => {
          ajax.deleteDictionaryList(data).then(res => {
            if (res.data.flag) {
              this.getDictionaryList()
              this.$data.selRowId = ''
            }
          })
        })
      } else {
        this.$ConfirmMsgBox(this.$t('vicenter.Background.dictionary.selectDatabedeleted'))
      }
    },
    selectRow (data) {
      let idArr = data.map(el => {
        return el.id
      })
      let keyArr = data.map(el => {
        return el.nameI18nKey
      })
      this.$data.selRowId = idArr.join(',')
      this.$data.selRowKey = keyArr.join(',')
    },
    handleNodeClick (data) {
      if (data.isEdit === '1') {
        this.$data.isEdit = true
      } else if (data.isEdit === '0') {
        this.$data.isEdit = false
      }
      this.nowTypeCode = data.typeCode
      this.tableData.page.CurrentPage = 0
      this.tableData.page.pagesize = 10
      if (this.nowTypeCode) {
        this.getDictionaryList()
      } else {
        this.nowTypeCode = ''
        this.getDictionaryList()
      }
    },
    json2treeData (jsonData, idStr, pidStr) {
      let treeData = []
      let hash = {}
      let id = idStr
      let pid = pidStr
      let children = 'children'
      let len = jsonData.length
      for (let i = 0; i < len; i++) {
        hash[jsonData[i][id]] = jsonData[i]
      }
      for (let j = 0; j < len; j++) {
        let aVal = jsonData[j]
        let hashVP = hash[aVal[pid]]
        if (hashVP) {
          !hashVP[children] && (hashVP[children] = [])
          hashVP[children].push(aVal)
        } else {
          treeData.push(aVal)
        }
      }
      let childArr = []
      treeData.forEach((e) => {
        if (e.children.length > 0) {
          e.children.forEach((item) => {
            item.name = this.$t('vicenter.DIC.T_DICTIONARY_TYPE.C_' + item.typeCode)
          })
        }
      })
      return treeData
    },
    getDetail (scope) {

    },
    rowDelete (scope) {

    },
    getDictionaryList (params = {}) {
      this.$data.tableData.data = []
      this.tableData.isPage = false
      params.page = this.tableData.page.CurrentPage
      params.size = this.tableData.page.pagesize
      params.typeCode = this.nowTypeCode
      ajax.getDictionaryList(params).then(res => {
        if (res.status === 200) {
          let data = res.data
          if (data.flag) {
            this.$data.tableData.data = data.result.content
            this.$data.tableData.data.forEach(obj => {
              obj.dicName = this.$t(obj.nameI18nKey)
              obj.operation = [
                {
                  func: this.showDetail,
                  label: `<span class='iconfont editTable'>&#xe610;</span>`,
                  title: this.$t('vicenter.common.detail'),
                  show: true
                },
                {
                  func: this.getEdit,
                  label: `<span class='iconfont editTable'>&#xe650;</span>`,
                  title: this.$t('vicenter.common.fix'),
                  show: true
                },
                {
                  func: this.delteaDictionary,
                  label: `<span class='iconfont editTable'>&#xe658;</span>`,
                  title: this.$t('vicenter.common.delete'),
                  show: true
                }
              ]
              if (!this.$data.isEdit) {
                obj.operation = [
                  {
                    func: this.showDetail,
                    label: `<span class='iconfont editTable'>&#xe610;</span>`,
                    title: this.$t('vicenter.common.detail'),
                    show: true
                  }
                ]
              }
            })
            this.tableData.page.Allpage = data.result.totalElements
            if (this.tableData.data.length > 0) {
              this.tableData.isPage = true
            }
          }
        }
      })
    },
    getEdit (scope) {
      this.$data.modalData.flag = true
      this.$data.modalData.title = this.$t('vicenter.Background.dictionary.modifyDictionary')
      this.nowOpration = 'update'
      let rowData = scope.row
      ajax.getDictionaryDetail({id: rowData.id}).then(res => {
        if (res.data.flag) {
          var resData = res.data.result
          this.modalRule.model.id = resData.id
          this.modalRule.model.nameI18nKey = resData.nameI18nKey
          this.$data.modalItem.forEach(obj => {
            if (obj.ruleProp === 'dicCode') {
              obj.disabled = true
              obj.models = resData.dicCode
            } else if (obj.ruleProp === 'dicName') {
              obj.models = this.$t(resData.nameI18nKey)
            } else if (obj.ruleProp === 'remark') {
              obj.models = resData[obj.ruleProp]
            }
          })
        }
      })
    },
    showDetail (scope) {
      this.$data.detailData.flag = true
      this.$data.detailData.title = this.$t('vicenter.Background.dictionary.dictionaryDetails')
      this.nowOpration = 'detail'
      let rowData = scope.row
      this.$data.detailItem.forEach(obj => {
        obj.value = rowData[obj.ruleProp]
      })
    },
    sure () {
      let data = {}
      data.typeCode = this.nowTypeCode
      data.dicCode = this.modalRule.model.dicCode
      data.nameI18nDisplay = this.modalRule.model.dicName
      data.remark = this.modalRule.model.remark
      data.lang = this.$store.state.lang
      if (this.nowOpration === 'add') {
        ajax.addDictionaryList(data).then(res => {
          if (res.data.flag) {
            this.loadLocaleMessage('zh-CN', (message) => {
              this.$i18n.setLocaleMessage('zh-CN', message)
              this.loadLocaleMessage('en-US', (message) => {
                this.$i18n.setLocaleMessage('en-US', message)
                window.config.langInit = true
              })
            })
            // this.getDictionaryList()
            this.$data.modalData.flag = false
            // location.reload()
          }
        })
      } else if (this.nowOpration === 'update') {
        data.id = this.modalRule.model.id
        data.nameI18nKey = this.modalRule.model.nameI18nKey
        ajax.updateDictionaryList(data).then(res => {
          if (res.data.flag) {
            this.loadLocaleMessage('zh-CN', (message) => {
              this.$i18n.setLocaleMessage('zh-CN', message)
              this.loadLocaleMessage('en-US', (message) => {
                this.$i18n.setLocaleMessage('en-US', message)
                window.config.langInit = true
              })
            })
            // this.getDictionaryList()
            this.$data.modalData.flag = false
            // location.reload()
          }
        })
      } else {
        this.$data.modalData.flag = false
      }
    },
    closeModal () {
      this.$data.modalData.flag = false
    },
    closeDetailModal () { // 详情弹窗关闭
      this.$data.detailData.flag = false
    },
    resetModal () {
      this.$refs.modalForm.reset()
    },
    exportExcel () {
      const {lang} = this.$store.state
      let model = this.setParams()
      model.typeCode = this.nowTypeCode
      let params = {
        lang: lang,
        model: model,
        sysMenu: '',
        allDataNum: this.tableData.page.Allpage || 0,
        url: '/management/dictionary/exportExcel'
      }
      this.$commonExportExcel(params)
    },
    setParams () {
      let params = {}
      params.dicCodeOrName = this.$data.formRule.model.dicCodeOrName
      return params
    },
    query (isPage = '') {
      let params = this.setParams()
      if (isPage === 'page') {
        params.page = this.tableData.page.CurrentPage
      } else {
        params.page = 0
        this.$set(this.tableData.page, 'CurrentPage', 0)
      }
      if (this.nowTypeCode) {
        this.getDictionaryList(params)
      } else {
        this.nowTypeCode = ''
        this.getDictionaryList(params)
      }
    },
    delteaDictionary (scope) {
      let data = {}
      data.id = scope.row.id
      data.nameI18nKey = scope.row.nameI18nKey
      this.$ConfirmBox(this.$t('vicenter.Background.dictionary.ifConfirmdeletedata'), () => {
        ajax.deleteDictionaryList(data).then(res => {
          if (res.data.flag) {
            this.getDictionaryList()
          }
        })
      })
    },
    addDictionary () {
      this.$data.modalData.flag = true
      this.$data.modalData.title = this.$t('vicenter.Background.dictionary.addDictionary')
      this.nowOpration = 'add'
      this.$data.modalItem.forEach(obj => {
        if (obj.ruleProp === 'dicCode') {
          obj.disabled = false
        }
      })
    },
    handleSizeChange (value) {
      this.$set(this.tableData.page, 'pagesize', value)
      this.query('page')
    },
    handleCurrentChange (value) {
      this.$set(this.tableData.page, 'CurrentPage', value - 1)
      this.query('page')
    },
    loadLocaleMessage (locale, cb) {
      return $axios({
        method: 'post',
        url: '/upmsapi/i18n/vueJsonByLang'
      }, {
        path: 'vicenter',
        lang: locale
      }).then((res) => {
        if (res.data.flag) {
          cb(res.data.result)
          this.getDictionaryList()
        }
      }).catch(() => {})
    }
  },
  created () {
    this.exportButton = this.$getSystemConfig('exportEnable')
    ajax.dictionaryTreeParams().then(res => {
      if (res.data.flag) {
        let data = this.json2treeData(res.data.result, 'id', 'pid')
        data[0].name = this.$t('vicenter.Background.dictionary.dictionaryManagement')
        data[0].disabled = true
        data[0].isEdit = '0'
        // data[0].children[0].id = 'firstNode'
        data[0].id = 'firstNode'
        this.$data.treeData = data
        // this.nowTypeCode = data[0].children[0].typeCode
        this.nowTypeCode = data[0].typeCode
        if (data[0].children[0].isEdit === '1') {
          this.$data.isEdit = true
        } else if (data[0].children[0].isEdit === '0') {
          this.$data.isEdit = false
        }
        // if (this.nowTypeCode) {
        this.getDictionaryList()
        // }
        this.$nextTick(function () {
          this.$refs.vuetree.setCurrentKey('firstNode')
        })
      }
    })
  },
  components: {
    breadCrumb,
    panelTitle,
    ComTable,
    ComForm,
    Dialog
  }

}
</script>
<style lang="scss">
@import '@/styles/index.scss';
.dictionary-manage {
  @extend .extend-bar;
  .dictionary-setting {
    padding:$margin;
    @include box-sizing;
    .form-bar {
      width: $all;
      @media screen and (min-width: 1640px) {
        height: $all;
        overflow: hidden;
      }
    }
    .infolist {
      .panel {
        @extend .extend-panel;
        .search-form {
          @include layout(1, 'fasle');
          height: auto;
        }
      }
      .panel-Q {
        @extend .extend-panel-Q;
      }
      .panel-L {
        @extend .extend-panel-L;
      }
    }
  }
  .modal-dialog {
    .search-form {
      @include layout(2);
    }
    .el-input.is-disabled {
      .el-input__inner {
        color: #c0c4cc;
      }
    }
  }
}
.el-tooltip__popper {
  max-width: 500px;
  word-break: break-all;
}
</style>
