<template>
  <div class='Examination-Query-bar' v-bar>
    <div class="Examination-Query-M">
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
              <el-button v-if="exportButton" type="primary" size="mini" data-id="export-btn" @click='exportExcel'>{{$t('vicenter.common.export', {msg: 'EXCEL'})}}</el-button>
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
        data: [
          // {
          //   label: this.$t(this.$route.matched[0].meta.title),
          //   path: '/Tip/index' // 跳转路径
          // },
          // {
          //   label: this.$t(this.$route.name)
          // }
        ]
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
          // getLabel: this.$t('vicenter.tip.examinationQuery.rapporteur'),
          type: 'text',
          isFilterSpecialChar: false, // 过滤特殊字符
          // placeHolder: this.$t('vicenter.tip.examinationQuery.inputRapporteur'),
          models: '',
          ruleProp: 'examineeAccount'
        },
        {
          // getLabel: this.$t('vicenter.tip.examinationQuery.examinationTime'),
          type: 'datetimerange',
          models: [],
          ruleProp: 'exTime'
        }
      ],
      queryFn: { // 页面表单查询方法
        // query: this.query
        // queryText: this.$t('vicenter.common.query'),
        // resetText: this.$t('vicenter.common.reset')
      },
      formRule: {
        refName: 'queryForm',
        rule: {},
        model: {
          examineeAccount: '',
          exTime: []
        }
      },
      tableGroup: [
        {
          // label: this.$t('vicenter.tip.examinationQuery.rapporteur'),
          type: 'text',
          model: 'examineeAccount'
        },
        {
          // label: this.$t('vicenter.tip.examinationQuery.examinationTime'),
          type: 'text',
          model: 'startTime'
        },
        {
          // label: this.$t('vicenter.tip.examinationQuery.answerTime'),
          type: 'text',
          model: 'examDuration'
        },
        {
          // label: this.$t('vicenter.tip.examinationQuery.degreeDifficulty'),
          type: 'text',
          model: 'difficulty'
        },
        {
          // label: this.$t('vicenter.tip.examinationQuery.score'),
          type: 'text',
          model: 'score'
        },
        {
          // label: this.$t('vicenter.common.operation'),
          type: 'operation',
          model: 'operation'
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
          examineeAccount: '',
          startTimeUpper: '',
          startTimeLower: '',
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
  mounted () {
    // this.getList('')
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
      this.queryFn = {
        query: this.query,
        queryText: this.$t('vicenter.common.query'),
        resetText: this.$t('vicenter.common.reset')
      }
      // 查询条件
      this.inputItem.forEach((e) => {
        if (e.ruleProp === 'examineeAccount') {
          e.getLabel = this.$t('vicenter.tip.examinationQuery.rapporteur')
          e.placeHolder = this.$t('vicenter.tip.examinationQuery.inputRapporteur')
        } else if (e.ruleProp === 'exTime') {
          e.getLabel = this.$t('vicenter.tip.examinationQuery.examinationTime')
          e.startPlace = this.$t('vicenter.common.startTime')
          e.endPlace = this.$t('vicenter.common.endTime')
        }
      })
      // 查询列
      this.tableGroup.forEach((e) => {
        if (e.model === 'examineeAccount') {
          e.label = this.$t('vicenter.tip.examinationQuery.rapporteur')
        } else if (e.model === 'startTime') {
          e.label = this.$t('vicenter.tip.examinationQuery.examinationTime')
        } else if (e.model === 'examDuration') {
          e.label = this.$t('vicenter.tip.examinationQuery.answerTime')
        } else if (e.model === 'difficulty') {
          e.label = this.$t('vicenter.tip.examinationQuery.degreeDifficulty')
        } else if (e.model === 'score') {
          e.label = this.$t('vicenter.tip.examinationQuery.score')
        } else if (e.model === 'operation') {
          e.label = this.$t('vicenter.common.operation')
        }
      })
      this.query()
    },
    getList () {
      this.tableData.data = []
      this.tableData.isPage = false
      ajax.queryResultList(this.tableData.searchData).then((res) => {
        if (res.data.flag) {
          this.tableData.data = []
          res.data.result.content.forEach(e => {
            this.tableData.data.push({
              examineeAccount: e.examineeAccount,
              startTime: this.$options.filters['formatDate'](e.startTime),
              examDuration: e.examDuration,
              difficulty: this.$options.filters['difficulty'](e.difficulty),
              score: e.score,
              id: e.id,
              operation: [
                {
                  func: this.getDetail,
                  label: `<span class='iconfont editTable'>&#xe610;</span>`,
                  title: this.$t('vicenter.common.detail'),
                  show: true
                }
              ]
            }
            )
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
      console.log(this.formRule)
    },
    exportExcel () {
      const {lang} = this.$store.state
      let model = this.tableData.searchData
      let params = {
        lang: lang,
        model: model,
        sysMenu: '',
        allDataNum: this.tableData.page.Allpage || 0,
        url: '/tip/exam/exportExcelForExamResult'
      }
      this.$commonExportExcel(params)
    },
    query () { // 页面查询
      let {examineeAccount, exTime} = this.formRule.model
      let startTime = null
      let endTime = null
      if (exTime != null && exTime.length === 2) {
        startTime = exTime[0].getTime()
        endTime = exTime[1].getTime()
      }
      let search = this.tableData.searchData
      search.examineeAccount = examineeAccount
      search.startTimeUpper = startTime
      search.startTimeLower = endTime
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
        path: 'test-statistics-detail'
      })
      let details = {
        id: scope.row.id,
        flag: false
      }
      sessionStorage.setItem('details', JSON.stringify(details))
    }
  },
  beforeRouteEnter (to, from, next) {
    to.meta.keepAlive = true
    next()
  },
  beforeRouteLeave (to, from, next) {
    if (to.path !== '/language' && to.path !== '/skin' && to.path !== '/Tip/test-statistics-detail') {
      if (this.$refs.searchFormRef) {
        this.$refs.searchFormRef.reset()
      }
      this.formRule.model = {
        examineeAccount: '',
        exTime: []
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
.Examination-Query-bar {
  @extend .extend-bar;
  .Examination-Query-M {
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
          @include layout(2);
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
