<template>
  <div class='traineeTraining-bar' v-bar>
    <div class="traineeTraining-M">
      <div class="breadCrumb">
        <bread :breadcrumb="titleBread"></bread>
      </div>
      <!-- 表格内容 -->
      <div class="infolist">
        <div class="panel panel-Q">
          <panelTitle :panelTitleInit="panelTitle.queryTitle"></panelTitle>
          <div class="form-bar" v-bar>
            <ComForm ref="searchFormRef"  :searchIpt="searchIpt" :searchFunc="SearchFunc" :formRule='formRule'></ComForm>
          </div>
        </div>
        <div class="panel panel-L">
          <panelTitle :panelTitleInit="panelTitle.listTitle">
            <el-button data-id="export-btn" type="primary" size="mini" @click='handleCreate'>{{$t('vicenter.training.common.export')}}</el-button>
          </panelTitle>
          <div class="form-bar" v-bar>
            <ComTable ref="traineeTrainingTable" :tableData="tableData" :tableGroup="tableGroup" ></ComTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bread from '@/components/breadCrumb'
import ComForm from '@/components/form'
import panelTitle from '@/components/title'
import ComTable from '@/components/table'
import Dialog from '@/components/dialog'
import req from '@/api/training/teacher'
export default {
  name: 'demo',
  data () {
    return {
      baseUrl: window.config.trainingUI.baseUrl,
      titleBread: {}, // 面包屑
      panelTitle: {}, // 标题栏
      searchIpt: [ // 查询表单
        {
          type: 'select',
          clearable: true,
          models: '',
          option: [],
          ruleProp: 'traClass'
        },
        {
          type: 'text',
          models: '',
          ruleProp: 'traName'
        },
        {
          type: 'text',
          models: '',
          ruleProp: 'pcTyueName'
        },
        {
          type: 'text',
          models: '',
          ruleProp: 'pcUserName'
        },
        {
          type: 'datetimerange',
          models: [],
          valueFormat: 'timestamp',
          ruleProp: 'createTime',
          editable: false,
          clearable: true
        }
      ],
      formRule: { // 查询表单规则
        model: {
          traClass: '',
          traName: '',
          pcTyueName: '',
          pcUserName: '',
          createTime: []
        },
        refName: 'queryForm',
        rule: {}
      },
      SearchFunc: { // 查询方法
        query: this.query,
        close: this.resetForm
      },
      tableGroup: [ // 表格数据列
        {
          type: 'index',
          model: 'serialNumber'
        },
        {
          type: 'text',
          model: 'className'
        },
        {
          type: 'text',
          model: 'traName'
        },
        {
          type: 'text',
          model: 'pcTyueName'
        },
        {
          type: 'text',
          model: 'pcUserName'
        },
        {
          type: 'text',
          model: 'traStartTime'
        },
        {
          type: 'text',
          model: 'traEndTime'
        },
        {
          type: 'text',
          model: 'traTime'
        },
        {
          type: 'progress',
          strokeWidth: 15,
          inside: false,
          width: '200px',
          model: 'traPercent'
        }
      ],
      tableData: { // 表格数据
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        page: {
          pageGroup: [10, 20, 50, 100],
          CurrentPage: 0,
          pagesize: 10,
          Allpage: 0,
          handleSizeChange: this.handleSizeChange,
          handleCurrentChange: this.handleCurrentChange
        },
        sortMethod: this.getSort
      },
      tempIndex: 0 // 解决查询条件和列表项重复的问题
    }
  },
  created () {
    this.tempIndex = 1
    this.setI18n()
  },
  mounted () {},
  activated () {
    if (this.tempIndex !== 1) {
      this.setI18n()
    }
  },
  methods: {
    setI18n () {
      this.getOptions()
      // 面包屑导航
      this.titleBread = {
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            // path: '/Training/teacher/index' // 跳转路径
            path: '/Training/index' // 跳转路径
          },
          {
            label: this.$t(this.$route.name)
          }
        ]
      }
      // 查询条件和列表title
      this.panelTitle = {
        queryTitle: {
          title: this.$t('vicenter.common.query')
        },
        listTitle: {
          title: this.$t('vicenter.common.list')
        }
      }
      // 查询和重置按钮
      this.SearchFunc = {
        query: this.query,
        close: this.resetForm,
        queryText: this.$t('vicenter.common.query'),
        resetText: this.$t('vicenter.common.reset')
      }
      // this.SearchFunc.queryText = this.$t('vicenter.common.query')
      // this.SearchFunc.resetText = this.$t('vicenter.common.reset')
      // 查询条件
      this.searchIpt.forEach((e) => {
        if (e.ruleProp === 'traClass') {
          e.getLabel = this.$t('vicenter.training.common.trainingClassification')
          e.placeHolder = this.$t('vicenter.common.pleaseSelcet') + this.$t('vicenter.training.common.trainingClassification')
        } else if (e.ruleProp === 'traName') {
          e.getLabel = this.$t('vicenter.training.common.trainingName')
          e.placeHolder = this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.trainingName')
        } else if (e.ruleProp === 'pcTyueName') {
          e.getLabel = this.$t('vicenter.training.common.name')
          e.placeHolder = this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.name')
        } else if (e.ruleProp === 'pcUserName') {
          e.getLabel = this.$t('vicenter.training.common.account')
          e.placeHolder = this.$t('vicenter.common.pleaseEnter') + this.$t('vicenter.training.common.account')
        } else if (e.ruleProp === 'createTime') {
          e.getLabel = this.$t('vicenter.training.common.trainingTime')
          // e.format = this.$t('vicenter.common.pickerFmt')
        }
      })
      // 查询列
      this.tableGroup.forEach((e) => {
        if (e.model === 'serialNumber') {
          e.label = this.$t('vicenter.training.common.serialNumber')
        } else if (e.model === 'className') {
          e.label = this.$t('vicenter.training.common.trainingClassification')
        } else if (e.model === 'traName') {
          e.label = this.$t('vicenter.training.common.trainingName')
        } else if (e.model === 'pcTyueName') {
          e.label = this.$t('vicenter.training.common.name')
        } else if (e.model === 'pcUserName') {
          e.label = this.$t('vicenter.training.common.account')
        } else if (e.model === 'traStartTime') {
          e.label = this.$t('vicenter.training.common.startTrainingTime')
        } else if (e.model === 'traEndTime') {
          e.label = this.$t('vicenter.training.common.lastTrainingTime')
        } else if (e.model === 'traTime') {
          e.label = this.$t('vicenter.training.common.trainingTimes')
        } else if (e.model === 'traPercent') {
          e.label = this.$t('vicenter.training.common.trainingProgress')
        }
      })
      this.query()
    },
    /**
     * 初始化下拉值
     */
    getOptions () {
      let loadCase = this.$initLoading()
      req.getTraDictInfo({dictId: '200'})
        .then(res => {
          this.searchIpt[0].option = res.data.result.map(e => { return {value: e.dictId, label: this.$t(`vicenter.training.common.trainingClassificationList.${e.dictId.toString()}`)} })
          loadCase.close()
        })
        .catch(err => {
          loadCase.close()
          console.log(err)
        })
    },
    handleCreate () {
      console.log('导出')
      let params = {}
      let str = ''
      // this.formRule.model
      params = JSON.parse(JSON.stringify(this.formRule.model))
      let { createTime } = this.formRule.model
      delete params.createTime
      if (createTime != null && createTime.length === 2) {
        params.starTime = this.$options.filters['formatDate'](createTime[0], this.$t('vicenter.common.formatDate'))
        params.endTime = this.$options.filters['formatDate'](createTime[1], this.$t('vicenter.common.formatDate'))
      }
      for (let k in params) {
        str += `${k}=${params[k]}&`
      }
      let lang = JSON.parse(sessionStorage.getItem('currentLang')) ? JSON.parse(sessionStorage.getItem('currentLang')).lang : window.config.conmmonLang
      window.open(`${this.baseUrl}/data/exportCadetReport?${str}language=${lang}`)
    },
    resetForm () {
      this.tableData.page.CurrentPage = 0
      this.formRule.model = {
        account: '',
        pcName: '',
        createTime: ''
      }
      // this.query()
    },
    query () {
      let params = {}
      // this.formRule.model
      params = JSON.parse(JSON.stringify(this.formRule.model))
      let { createTime } = this.formRule.model
      delete params.createTime
      if (createTime != null && createTime.length === 2) {
        params.starTime = this.$options.filters['formatDate'](createTime[0], this.$t('vicenter.common.formatDate'))
        params.endTime = this.$options.filters['formatDate'](createTime[1], this.$t('vicenter.common.formatDate'))
      }
      this.getList(params)
    },
    getList (params) {
      req.getCadetReport({ ...params, page: this.tableData.page.CurrentPage, size: this.tableData.page.pagesize })
        .then(res => {
          let tableData = res.data.result
          tableData.content.forEach(item => {
            item.traStartTime = this.$options.filters['formatDate'](item.traStartTime, this.$t('vicenter.common.formatDate')) || '-'
            item.traEndTime = this.$options.filters['formatDate'](item.traEndTime, this.$t('vicenter.common.formatDate')) || '-'
            item.className = this.$t(`vicenter.training.common.trainingClassificationList.${item.traClass.toString()}`)
          })
          this.tableData.data = tableData.content
          if (this.tableData.data.length > 0) {
            this.tableData.isPage = true
          }
          this.tableData.page.Allpage = tableData.totalElements
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleSizeChange (val) {
      console.log(val)
      this.tableData.page.pagesize = val
      this.query()
    },
    handleCurrentChange (val) {
      console.log(val)
      this.tableData.page.CurrentPage = val - 1
      this.query()
    },
    getSort () {}
  },
  beforeRouteEnter (to, from, next) {
    to.meta.keepAlive = true
    next()
  },
  beforeRouteLeave (to, from, next) {
    if (to.path !== '/language' && to.path !== '/skin' && to.path !== '/ImageLibrary/imageManagement/imageDetails' && to.path !== '/ImageLibrary/imageManagement/ImageEdit' && to.path !== '/ImageLibrary/imageManagement/ImageCreate' && to.path !== '/ImageLibrary/imageManagement/imagePreview') {
      if (this.$refs.searchFormRef) {
        this.$refs.searchFormRef.reset()
      }
      this.formRule.model = {
        traClass: '',
        traName: '',
        pcTyueName: '',
        pcUserName: '',
        createTime: []
      }
      this.selectObj = {
        hsCodes: '',
        siteId: '',
        deviceId: ''
      }
      // if (to.path !== '/login') {
      //   this.query()
      // }
    }
    this.tempIndex = 0
    from.meta.keepAlive = false
    next()
  },
  components: { bread, ComForm, panelTitle, ComTable, Dialog }
}
</script>

<style lang="scss">
@import'@/styles/index.scss';
.traineeTraining-bar {
  @extend .extend-bar;
  .traineeTraining-M {
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
          @include layout(3);
        }
      }
      .panel-Q {
        @extend .extend-panel-Q;
      }
      .panel-L {
        @extend .extend-panel-L;
        .editTable {
          margin: 0 5px;
        }
      }
    }
    .formDialog {
      .el-dialog {
        width: 60% !important;
      }
      .search-form {
        @include layout(1);
      }
      .search-form-btn .el-form-item__content {
        display: none;
      }
    }
  }
}
</style>
