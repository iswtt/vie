<template>
  <div class='settings-bar' v-bar>
    <div class="settings-M">
        <div class="breadCrumb">
          <breadCrumb :breadcrumb="titleBread"/>
        </div>
        <!-- 表格内容 -->
        <div class="infolist">
          <div class="panel panel-Q">
            <panelTitle :panelTitleInit="panelTitle.queryTitle"></panelTitle>
            <div class="form-bar" v-bar>
              <ComForm ref="searchFormRef" :searchIpt="inputItem" :searchFunc="queryFn" :formRule='formRule'></ComForm>
            </div>
          </div>
          <div class="panel panel-L">
            <panelTitle :panelTitleInit="panelTitle.listTitle">
              <div>
                <el-button v-if="exportButton" type="primary" size="mini" data-id="export-btn" @click='exportExcel'>{{$t('vicenter.common.export', {msg: 'EXCEL'})}}</el-button>
                <el-button type="primary" size="mini" @click='getAdd' data-id="add-btn">{{this.$t('vicenter.common.add')}}</el-button>
              </div>
            </panelTitle>
            <div class="form-bar" v-bar>
              <ComTable :tableData='tableData' :tableGroup='tableGroup'></ComTable>
            </div>
          </div>
        </div>
     </div>
  </div>
</template>
<script>
import breadCrumb from '../../components/breadCrumb'
import ComForm from '../../components/form'
import panelTitle from '../../components/title'
import ComTable from '../../components/table'
import ajax from '../../api/tip/Assessment.js'
export default {
  name: 'Assessment-settings',
  data () {
    return {
      exportButton: false,
      titleBread: { // 面包屑导航组件初始化
        // data: [
        //   {
        //     label: this.$t(this.$route.matched[0].meta.title),
        //     path: '/Tip/index' // 跳转路径
        //   },
        //   {
        //     label: this.$t(this.$route.name)
        //   }
        // ]
      },
      panelTitle: { // title组件数据
        // queryTitle: {
        //   title: this.$t('vicenter.common.query')
        // },
        // listTitle: {
        //   title: this.$t('vicenter.common.list')
        // }
      },
      inputItem: [
        {
          // getLabel: this.$t('vicenter.tip.assessmentSettings.examName'),
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          // placeHolder: this.$t('vicenter.tip.assessmentSettings.inputExamName'),
          models: '',
          ruleProp: 'name'
        },
        {
          // getLabel: this.$t('vicenter.tip.assessmentSettings.startDate'),
          type: 'datetimerange',
          models: [],
          ruleProp: 'startTime'
        },
        {
          // getLabel: this.$t('vicenter.tip.assessmentSettings.endDate'),
          type: 'datetimerange',
          models: [],
          ruleProp: 'endTime'
        },
        {
          // getLabel: this.$t('vicenter.tip.assessmentSettings.createTime'),
          type: 'datetimerange',
          models: [],
          ruleProp: 'createTime'
        },
        {
          // getLabel: this.$t('vicenter.tip.assessmentSettings.assessmentState'),
          type: 'select',
          // placeHolder: this.$t('vicenter.tip.assessmentSettings.inputAssessmentState'),
          models: '',
          ruleProp: 'status',
          option: [
            // {
            //   label: this.$t('vicenter.common.filter.status.notstart'),
            //   value: '0'
            // },
            // {
            //   label: this.$t('vicenter.common.filter.status.starting'),
            //   value: '1'
            // },
            // {
            //   label: this.$t('vicenter.common.filter.status.expirestop'),
            //   value: '2'
            // },
            // {
            //   label: this.$t('vicenter.common.filter.status.forcestop'),
            //   value: '3'
            // }
          ]
        }
      ],
      queryFn: { // 页面表单查询方法
        query: this.query
        // queryText: this.$t('vicenter.common.query'),
        // resetText: this.$t('vicenter.common.reset')
      },
      formRule: {
        refName: 'queryForm',
        rule: {},
        model: {
          name: '',
          startTime: [],
          endTime: [],
          createTime: [],
          status: ''
        }
      },
      tableGroup: [
        {
          // label: this.$t('vicenter.tip.assessmentSettings.appraisalName'),
          type: 'text',
          model: 'name'
        },
        {
          // label: this.$t('vicenter.tip.assessmentSettings.startDate'),
          type: 'text',
          model: 'startTime'
        },
        {
          // label: this.$t('vicenter.tip.assessmentSettings.endDate'),
          type: 'text',
          model: 'endTime'
        },
        {
          // label: this.$t('vicenter.tip.assessmentSettings.examinationFrequency'),
          type: 'text',
          model: 'Frequency'
        },
        {
          // label: this.$t('vicenter.tip.assessmentSettings.state'),
          type: 'showTooltip',
          model: 'status'
        },
        {
          // label: this.$t('vicenter.tip.assessmentSettings.createTime'),
          type: 'text',
          model: 'createTime'
        },
        {
          // label: this.$t('vicenter.common.operation'),
          type: 'operation',
          model: 'operation'
        }
      ],
      operation: [
        {
          func: this.getDetail,
          label: `<span class='iconfont editTable'>&#xe610;</span>`,
          // title: this.$t('vicenter.common.detail'),
          show: true
        },
        {
          func: this.getEdit,
          label: `<span class='iconfont editTable'>&#xe650;</span>`,
          // title: this.$t('vicenter.common.fix'),
          show: true
        },
        {
          func: this.getDelete,
          label: `<span class='iconfont editTable'>&#xe658;</span>`,
          // title: this.$t('vicenter.common.delete'),
          show: true
        },
        {
          func: this.getStop,
          label: `<span class='iconfont editTable'>&#xe704;</span>`,
          // title: this.$t('vicenter.tip.assessmentSettings.stopIt'),
          show: true
        }
      ],
      tableData: {
        data: [],
        isBorder: true,
        isStripe: true,
        isPage: false,
        refName: 'multipleTable',
        sortMethod: this.getSort,
        page: {
          CurrentPage: 0,
          pagesize: 10,
          handleSizeChange: this.handleSizeChange, // 分页条数改变触发该函数
          handleCurrentChange: this.handleCurrentChange, // 当前页码改变触发改函数
          Allpage: 0
        },
        searchData: {
          name: '',
          startTimeUpper: '',
          startTimeLower: '',
          endTimeUpper: '',
          endTimeLower: '',
          createTimeStart: '',
          createTimeEnd: '',
          status: '',
          size: 10,
          page: 0
        }
      },
      tempIndex: 0 // 解决查询条件和列表项重复的问题
    }
  },
  created () {
    this.exportButton = this.$getSystemConfig('exportEnable')
    this.tempIndex = 1
    this.setI18n()
  },
  activated () {
    if (this.tempIndex !== 1) {
      this.setI18n()
    }
  },
  methods: {
    setI18n () {
      // 面包屑导航组件初始化
      this.titleBread = {
        data: [
          {
            label: this.$t(this.$route.matched[0].meta.title),
            path: '/Tip/index' // 跳转路径
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
      this.queryFn.queryText = this.$t('vicenter.common.query')
      this.queryFn.resetText = this.$t('vicenter.common.reset')
      // 操作列按钮提示
      let operateTitle = [
        this.$t('vicenter.common.detail'),
        this.$t('vicenter.common.fix'),
        this.$t('vicenter.common.delete'),
        this.$t('vicenter.tip.assessmentSettings.stopIt')
      ]
      operateTitle.forEach((e, index) => {
        this.operation[index].title = e
      })
      // 查询条件
      this.inputItem.forEach((e) => {
        if (e.ruleProp === 'name') {
          e.getLabel = this.$t('vicenter.tip.assessmentSettings.examName')
          e.placeHolder = this.$t('vicenter.tip.assessmentSettings.inputExamName')
        } else if (e.ruleProp === 'startTime') {
          e.getLabel = this.$t('vicenter.tip.assessmentSettings.startDate')
        } else if (e.ruleProp === 'endTime') {
          e.getLabel = this.$t('vicenter.tip.assessmentSettings.endDate')
        } else if (e.ruleProp === 'createTime') {
          e.getLabel = this.$t('vicenter.tip.assessmentSettings.createTime')
        } else if (e.ruleProp === 'status') {
          e.getLabel = this.$t('vicenter.tip.assessmentSettings.assessmentState')
          e.placeHolder = this.$t('vicenter.tip.assessmentSettings.inputAssessmentState')
          e.option = [
            {
              label: this.$t('vicenter.common.filter.status.notstart'),
              value: '0'
            },
            {
              label: this.$t('vicenter.common.filter.status.starting'),
              value: '1'
            },
            {
              label: this.$t('vicenter.common.filter.status.expirestop'),
              value: '2'
            },
            {
              label: this.$t('vicenter.common.filter.status.forcestop'),
              value: '3'
            }
          ]
        }
      })
      // 查询列
      this.tableGroup.forEach((e) => {
        if (e.model === 'name') {
          e.label = this.$t('vicenter.tip.assessmentSettings.appraisalName')
        } else if (e.model === 'startTime') {
          e.label = this.$t('vicenter.tip.assessmentSettings.startDate')
        } else if (e.model === 'endTime') {
          e.label = this.$t('vicenter.tip.assessmentSettings.endDate')
        } else if (e.model === 'createTime') {
          e.label = this.$t('vicenter.tip.assessmentSettings.createTime')
        } else if (e.model === 'Frequency') {
          e.label = this.$t('vicenter.tip.assessmentSettings.examinationFrequency')
        } else if (e.model === 'status') {
          e.label = this.$t('vicenter.tip.assessmentSettings.state')
        } else if (e.model === 'operation') {
          e.label = this.$t('vicenter.common.operation')
        }
      })
      this.query()
    },
    getList () {
      this.tableData.data = []
      this.tableData.isPage = false
      ajax.ListExam(this.tableData.searchData).then((res) => {
        if (res.data.flag) {
          this.tableData.data = []
          this.tableData.data = res.data.result.content
          this.tableData.data.forEach(e => {
            e.operation = []
            if (e.status === '0') { // 状态为考核未开始
              e.operation = this.operation
            } else if (e.status === '1') { // 状态为考核中
              e.operation.push(this.operation[0])
              e.operation.push(this.operation[3])
            } else if (e.status === '2' || e.status === '3') { // 状态为到期停止或强制停止
              e.operation.push(this.operation[0])
            }
            e.startTime = this.$options.filters['formatDate'](e.startTime)
            e.endTime = this.$options.filters['formatDate'](e.endTime)
            e.createTime = this.$options.filters['formatDate'](e.createTime)
            e.lastEditTime = this.$options.filters['formatDate'](e.lastEditTime)
            e.Frequency = this.$options.filters['frequency'](e.frequency, e.frequencyType)
            if (e.status === '3') { // 强制停止，需要显示停止人和停止时间
              e.status = {
                label: `<span>${this.$options.filters['status'](e.status)}</span>`,
                title: this.$t('vicenter.tip.assessmentSettings.stopPerson') + ' ' + e.lastEditor + ' ' + this.$t('vicenter.tip.assessmentSettings.stopTime') + ' ' + e.lastEditTime,
                show: true
              }
            } else {
              e.status = {
                label: `<span>${this.$options.filters['status'](e.status)}</span>`,
                show: false
              }
            }
          })
          if (this.tableData.data.length > 0) {
            this.tableData.isPage = true
            this.$page(this.tableData.page, res.data.result)
          } else {
            this.tableData.page.Allpage = 0
          }
        }
      }).catch(() => {})
    },
    getSort () {
      // console.log(this.formRule)
    },
    exportExcel () {
      const {lang} = this.$store.state
      let model = this.tableData.searchData
      let params = {
        lang: lang,
        model: model,
        sysMenu: '',
        allDataNum: this.tableData.page.Allpage || 0,
        url: '/tip/exam/exportExcel'
      }
      this.$commonExportExcel(params)
    },
    query () { // 页面查询
      let {name, startTime, endTime, createTime, status} = this.formRule.model
      let search = this.tableData.searchData
      search.startTimeUpper = null
      search.startTimeLower = null
      search.endTimeUpper = null
      search.endTimeLower = null
      search.createTimeStart = null
      search.createTimeEnd = null
      if (startTime != null && startTime.length === 2) {
        search.startTimeUpper = startTime[0].getTime()
        search.startTimeLower = startTime[1].getTime()
      }
      if (endTime != null && endTime.length === 2) {
        search.endTimeUpper = endTime[0].getTime()
        search.endTimeLower = endTime[1].getTime()
      }
      if (createTime != null && createTime.length === 2) {
        search.createTimeStart = createTime[0].getTime()
        search.createTimeEnd = createTime[1].getTime()
      }
      search.name = name
      search.status = status
      this.getList()
    },
    reset () { // 页面查询
      this.getList()
    },
    handleSizeChange (value) { // 修改一页显示多少
      this.$handleSizeChange(value, this.tableData.searchData, this.getList)
    },
    handleCurrentChange (value) { // 翻页
      this.$handleCurrentChange(value, this.tableData.searchData, this.getList)
    },
    getDetail (scope) { // 获取考试详情
      this.$router.push({
        path: '/Tip/detail-settings'
      })
      let details = {
        id: scope.row.id,
        flag: false
      }
      sessionStorage.setItem('details', JSON.stringify(details))
    },
    getEdit (scope) { // 编辑考试
      this.$router.push({
        path: '/Tip/edit-settings'
      })
      let Edit = {
        id: scope.row.id
      }
      sessionStorage.setItem('Edit', JSON.stringify(Edit))
    },
    getDelete (scope) {
      this.$ConfirmBox(this.$t('vicenter.tip.assessmentSettings.sureDelete'), () => {
        ajax.deleteExam({id: scope.row.id}).then(res => {
          if (res.data.flag) {
            this.$NotifSuccess(this.$t('vicenter.tip.assessmentSettings.deleteSuccess'))
            this.getList()
          } else {
            this.$NotifPrompt(res.data.message)
          }
        })
      })
    },
    getStop (scope) {
      this.$ConfirmBox(this.$t('vicenter.tip.assessmentSettings.sureStop'), () => {
        ajax.stopExam({id: scope.row.id}).then(res => {
          if (res.data.flag) {
            this.$NotifSuccess(this.$t('vicenter.tip.assessmentSettings.stopSuccess'))
            this.getList()
          } else {
            this.$NotifPrompt(res.data.message)
          }
        })
      })
    },
    getAdd () { // 设置考核
      this.$router.push({
        path: '/Tip/add-settings'
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    to.meta.keepAlive = true
    next()
  },
  beforeRouteLeave (to, from, next) {
    if (to.path !== '/language' && to.path !== '/skin' && to.path !== '/Tip/detail-settings' && to.path !== '/Tip/edit-settings' && to.path !== '/Tip/add-settings') {
      if (this.$refs.searchFormRef) {
        this.$refs.searchFormRef.reset()
      }
      this.formRule.model = {
        name: '',
        startTime: [],
        endTime: [],
        createTime: [],
        status: ''
      }
      // if (to.path !== '/login') {
      //   this.query()
      // }
    }
    this.tempIndex = 0
    from.meta.keepAlive = false
    next()
  },
  components: { breadCrumb, ComForm, panelTitle, ComTable }
}
</script>
<style lang="scss">
@import "../../styles/index.scss";
.settings-bar {
  @extend .extend-bar;
  .settings-M {
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
      }
    }
  }
}
</style>
